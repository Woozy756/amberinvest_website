import {getCliClient} from 'sanity/cli'
import {mkdir, writeFile} from 'node:fs/promises'
import path from 'node:path'

const isDryRun = process.argv.includes('--dry-run')
const client = getCliClient({apiVersion: '2026-06-09'})

const properties = await client.fetch(`*[
  _type == "property" &&
  defined(slug.current)
]{
  ...,
  "floorPlanFilename": floorPlanImage.asset->originalFilename,
  "additionalFloorPlanFilename": additionalFloorPlanImage.asset->originalFilename
}`)

const getApartmentNumber = (property) => {
  const filename = property.additionalFloorPlanFilename || property.floorPlanFilename || ''
  const match = filename.match(/Talsu3A_dz(\d+)/i)
  return match ? Number(match[1]) : null
}

const getPlanNumber = (filename) => {
  const match = filename?.match(/Talsu3A_dz(\d+)/i)
  return match ? Number(match[1]) : null
}

const getFloor = (apartmentNumber) => {
  if (apartmentNumber <= 5) return 1
  if (apartmentNumber <= 10) return 2
  return 3
}

const replaceNumber = (value, apartmentNumber) =>
  value?.replace(/(nr\.?\s*)\d+/i, `$1${apartmentNumber}`)

const replaceSlugNumber = (value, apartmentNumber) =>
  value?.replace(/nr\d+$/i, `nr${apartmentNumber}`)

const backupDirectory = path.join(process.cwd(), 'backups')
const backupTimestamp = new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-')
const backupPath = path.join(backupDirectory, `sanity-properties-${backupTimestamp}.json`)

await mkdir(backupDirectory, {recursive: true})
await writeFile(backupPath, `${JSON.stringify(properties, null, 2)}\n`)

const changes = properties
  .map((property) => {
    const apartmentNumber = getApartmentNumber(property)

    if (!apartmentNumber) {
      return null
    }

    const set = {
      title: replaceNumber(property.title, apartmentNumber),
      propertyCode: replaceNumber(property.propertyCode, apartmentNumber),
      slug: {
        ...property.slug,
        current: replaceSlugNumber(property.slug?.current, apartmentNumber),
      },
      floor: getFloor(apartmentNumber),
    }

    if (apartmentNumber === 15) {
      set.area = 70.6
    }

    if (apartmentNumber === 10) {
      set.rooms = 4
      set.details = (property.details ?? []).map((detail) =>
        detail.label === 'Guļamistabas' ? {...detail, value: '3'} : detail,
      )
    }

    if (property.seo?.metaTitle) {
      set.seo = {
        ...property.seo,
        metaTitle: replaceNumber(property.seo.metaTitle, apartmentNumber),
      }
    }

    const primaryPlanNumber = getPlanNumber(property.floorPlanFilename)
    const unset =
      primaryPlanNumber && primaryPlanNumber !== apartmentNumber ? ['floorPlanImage'] : []

    return {
      id: property._id,
      apartmentNumber,
      set,
      unset,
      previous: {
        title: property.title,
        slug: property.slug?.current,
        propertyCode: property.propertyCode,
        rooms: property.rooms,
        area: property.area,
        floor: property.floor,
        floorPlanFilename: property.floorPlanFilename,
        additionalFloorPlanFilename: property.additionalFloorPlanFilename,
      },
    }
  })
  .filter(Boolean)
  .sort((a, b) => a.apartmentNumber - b.apartmentNumber)

console.log(`Backup: ${backupPath}`)
console.log(`Mode: ${isDryRun ? 'dry run' : 'write'}`)

for (const change of changes) {
  console.log(
    [
      `Nr.${change.apartmentNumber}`,
      change.id,
      `${change.previous.slug} -> ${change.set.slug.current}`,
      `floor ${change.previous.floor} -> ${change.set.floor}`,
      change.set.area ? `area ${change.previous.area} -> ${change.set.area}` : null,
      change.set.rooms ? `rooms ${change.previous.rooms} -> ${change.set.rooms}` : null,
      change.unset.length ? `unset ${change.unset.join(', ')}` : null,
    ]
      .filter(Boolean)
      .join(' | '),
  )
}

if (!isDryRun) {
  let transaction = client.transaction()

  for (const change of changes) {
    transaction = transaction.patch(change.id, (patch) => {
      let nextPatch = patch.set(change.set)

      if (change.unset.length > 0) {
        nextPatch = nextPatch.unset(change.unset)
      }

      return nextPatch
    })
  }

  await transaction.commit()
  console.log(`Updated Sanity documents: ${changes.length}`)
}
