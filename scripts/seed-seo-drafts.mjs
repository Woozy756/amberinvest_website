import {createClient} from '@sanity/client'
import {existsSync, readFileSync} from 'node:fs'
import path from 'node:path'

const envPath = path.join(process.cwd(), '.env')

if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)\s*$/)
    if (!match || process.env[match[1]] !== undefined) continue

    process.env[match[1]] = match[2].replace(/^["']|["']$/g, '')
  }
}

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID || 'kshtq64w'
const dataset = process.env.PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN

if (!token) {
  console.error('Missing a write-capable Sanity token. Set SANITY_API_WRITE_TOKEN in .env or the shell.')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-04-16',
  token,
  useCdn: false,
})

const truncate = (value, maxLength) => {
  if (!value) return undefined
  const trimmed = String(value).replace(/\s+/g, ' ').trim()
  return trimmed.length > maxLength ? `${trimmed.slice(0, maxLength - 1).trimEnd()}…` : trimmed
}

const compactSeo = (seo) =>
  Object.fromEntries(Object.entries(seo).filter(([, value]) => value !== undefined && value !== null && value !== ''))

const imageSeo = (image, alt) => {
  if (!image?.asset?._ref) return undefined

  return {
    _type: 'image',
    asset: image.asset,
    alt: truncate(alt, 120),
  }
}

const draftId = (id) => (id.startsWith('drafts.') ? id : `drafts.${id}`)

const stripSystemFields = (doc) => {
  const {_createdAt, _updatedAt, _rev, ...rest} = doc
  return rest
}

async function upsertDraftSeo(doc, seo) {
  const id = draftId(doc._id)
  const existingDraft = await client.getDocument(id)

  if (existingDraft) {
    await client.patch(id).set({seo}).commit()
    return 'patched'
  }

  await client.createIfNotExists({
    ...stripSystemFields(doc),
    _id: id,
    seo,
  })
  return 'created'
}

const singletonDocs = await client.fetch(`{
  "homepage": *[_id == "homepage"][0]{
    ...,
    heroBackgroundImage{asset}
  },
  "aboutPage": *[_id == "aboutPage"][0],
  "contactPage": *[_id == "contactPage"][0],
  "howToBuyPage": *[_id == "howToBuyPageClean"][0]{
    ...,
    heroImage{asset}
  }
}`)

const propertyTypes = await client.fetch(`*[_type == "propertyType" && !(_id in path("drafts.**"))]{
  ...
}`)

const properties = await client.fetch(`*[_type == "property" && !(_id in path("drafts.**"))]{
  ...,
  heroImage{asset}
}`)

const tasks = [
  singletonDocs.homepage && {
    doc: singletonDocs.homepage,
    seo: compactSeo({
      metaTitle: 'AmberHome | Dzīvokļi Ventspilī',
      metaDescription: truncate(singletonDocs.homepage.heroLead, 160),
      ogImage: imageSeo(singletonDocs.homepage.heroBackgroundImage, singletonDocs.homepage.heroTitle),
      noIndex: false,
    }),
  },
  singletonDocs.aboutPage && {
    doc: singletonDocs.aboutPage,
    seo: compactSeo({
      metaTitle: singletonDocs.aboutPage.title,
      metaDescription: truncate(singletonDocs.aboutPage.introParagraphs?.[0], 160),
      noIndex: false,
    }),
  },
  singletonDocs.contactPage && {
    doc: singletonDocs.contactPage,
    seo: compactSeo({
      metaTitle: singletonDocs.contactPage.title,
      metaDescription: truncate(singletonDocs.contactPage.contactLead, 160),
      noIndex: false,
    }),
  },
  singletonDocs.howToBuyPage && {
    doc: singletonDocs.howToBuyPage,
    seo: compactSeo({
      metaTitle: singletonDocs.howToBuyPage.title,
      metaDescription: truncate(singletonDocs.howToBuyPage.heroLead || singletonDocs.howToBuyPage.faqLead, 160),
      ogImage: imageSeo(singletonDocs.howToBuyPage.heroImage, singletonDocs.howToBuyPage.heroTitle),
      noIndex: false,
    }),
  },
  ...propertyTypes.map((doc) => ({
    doc,
    seo: compactSeo({
      metaTitle: `AmberHome | ${doc.title}`,
      metaDescription: truncate(doc.description, 160),
      noIndex: false,
    }),
  })),
  ...properties.map((doc) => ({
    doc,
    seo: compactSeo({
      metaTitle: `AmberHome | ${doc.title}`,
      metaDescription: truncate(doc.shortDescription, 160),
      ogImage: imageSeo(doc.heroImage, doc.title),
      noIndex: false,
    }),
  })),
].filter(Boolean)

for (const task of tasks) {
  const result = await upsertDraftSeo(task.doc, task.seo)
  console.log(`${result}: ${draftId(task.doc._id)}`)
}

console.log(`Seeded SEO drafts: ${tasks.length}`)
