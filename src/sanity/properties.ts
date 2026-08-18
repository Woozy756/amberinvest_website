import {sanityClient} from 'sanity:client'
import {getSanityImageSrcSet, getSanityImageUrl} from '../lib/sanityImage'
import { mapSeo, trimValue, type RawSeoField, type SanitySeo } from './utils'

export type PropertyStatus = 'available' | 'reserved' | 'sold'

export interface PropertyImage {
  src: string
  srcSet: string
  thumbSrc: string
  zoomSrc: string
  alt: string
  label?: string
  width?: number
  height?: number
}

export interface PropertyDetailItem {
  label: string
  value: string
}

export interface PropertyCategory {
  slug: string
  label: string
  shortLabel: string
  description: string
  propertyCount: number
  seo?: SanitySeo
}

export interface PropertyProject {
  title?: string
  city?: string
  address?: string
}

export interface Property {
  id: string
  title: string
  slug: string
  propertyCode: string
  status: PropertyStatus
  shortDescription: string
  descriptionParagraphs: string[]
  aboutSectionTitle?: string
  rooms: number
  area: number
  price: number
  pricePerSquareMeter: number
  currency: string
  floor: number
  building?: string
  image: string
  gallery: PropertyImage[]
  floorPlanImage?: string
  additionalFloorPlanImage?: string
  floorPlanImages: PropertyImage[]
  floorPlanNote?: string
  floorPlanSectionTitle?: string
  floorPlanCardTitle?: string
  details: PropertyDetailItem[]
  category: PropertyCategory
  project?: PropertyProject
  seo?: SanitySeo
}

const localizedPropertyCategorySlugs: Record<string, string> = {
  '3-rooms': '3-istabas',
  '4-rooms': '4-istabas',
  '5-rooms': '5-istabas',
}

export function getPropertyCategoryRouteSlug(
  category: Pick<PropertyCategory, 'slug'> | string,
): string {
  const slug = typeof category === 'string' ? category : category.slug
  return localizedPropertyCategorySlugs[slug] ?? slug
}

export function getPropertyCategoryHref(category: Pick<PropertyCategory, 'slug'> | string): string {
  return getPropertyCategoryHrefForLocale(category, 'lv')
}

export function getPropertyCategoryHrefForLocale(
  category: Pick<PropertyCategory, 'slug'> | string,
  locale: 'lv' | 'en' = 'lv',
): string {
  const slug = typeof category === 'string' ? category : category.slug
  return locale === 'en'
    ? `/en/apartments/${slug}`
    : `/dzīvokļi/${getPropertyCategoryRouteSlug(slug)}`
}

export function getPropertyHref(
  property: Pick<Property, 'slug' | 'category'> & {category: Pick<PropertyCategory, 'slug'>},
  locale: 'lv' | 'en' = 'lv',
): string {
  return `${getPropertyCategoryHrefForLocale(property.category, locale)}/${property.slug}`
}

export function getPropertyCategoryLabel(
  category: Pick<PropertyCategory, 'slug' | 'label' | 'shortLabel'>,
  locale: 'lv' | 'en' = 'lv',
  short = false,
): string {
  if (locale === 'lv') {
    return short ? category.shortLabel : category.label
  }

  const rooms = getFirstNumberFromSlug(category.slug)
  if (!rooms) return short ? category.shortLabel : category.label
  return short ? `${rooms} rooms` : `${rooms}-room apartments`
}

export function getLocalizedPropertyTitle(property: Pick<Property, 'title'>, locale: 'lv' | 'en' = 'lv'): string {
  if (locale === 'lv') return property.title

  const apartmentMatch = property.title.match(/^(.*?)\s*Dzīvoklis Nr\.?\s*(\d+)$/i)
  if (!apartmentMatch) {
    return property.title.replace(/Dzīvoklis Nr\.?\s*/i, 'Apartment No. ')
  }

  const [, address, apartmentNumber] = apartmentMatch
  const localizedAddress = address.trim().replace(/^Talsu 3A$/i, 'Talsu Street 3A')
  return `Apartment No. ${apartmentNumber}, ${localizedAddress}`
}

export function getLocalizedPropertyImageText(value: string | undefined, locale: 'lv' | 'en' = 'lv'): string | undefined {
  if (!value || locale === 'lv') return value

  const replacements: Array<[RegExp, string]> = [
    [/Dzīvokļa plāns/gi, 'Apartment plan'],
    [/Stāva plāns/gi, 'Floor plan'],
    [/Foto galerija/gi, 'Photo gallery'],
    [/Dzīvojamā telpa/gi, 'Living area'],
    [/Vannas istaba/gi, 'Bathroom'],
    [/Bērna istaba|Bērnistaba/gi, "Child's room"],
    [/Guļamistaba/gi, 'Bedroom'],
    [/Priekštelpa/gi, 'Entrance hall'],
    [/Papildus/gi, 'Additional feature'],
    [/Gaitenis/gi, 'Hallway'],
    [/Virtuve/gi, 'Kitchen'],
    [/Lodžija/gi, 'Loggia'],
    [/Tualete/gi, 'WC'],
    [/Ofiss/gi, 'Office'],
    [/dzīvokļa plāns/gi, 'apartment plan'],
  ]

  return replacements.reduce(
    (localizedValue, [pattern, replacement]) => localizedValue.replace(pattern, replacement),
    value,
  )
}

export function getLocalizedPropertyDescription(
  property: Pick<Property, 'rooms' | 'area' | 'shortDescription'>,
  locale: 'lv' | 'en' = 'lv',
): string {
  if (locale === 'lv') return property.shortDescription

  const bedrooms = Math.max(property.rooms - 1, 0)
  const bedroomText = bedrooms === 1 ? 'one bedroom' : `${bedrooms} bedrooms`
  return `${property.rooms}-room apartment with a total area of ${formatDescriptionArea(property.area)} m². The layout includes an open-plan living room and kitchen, ${bedroomText}, a bathroom and a separate WC. The apartment has heat-recovery ventilation, individually adjustable underfloor heating in every room and a fully finished interior with fitted sanitary ware. Each apartment has individual electricity, heating and water meters, and residents have access to on-site parking.`
}

export const propertyStatusMeta: Record<
  PropertyStatus,
  {label: string; tone: 'available' | 'reserved' | 'sold'}
> = {
  available: {label: 'Pieejams', tone: 'available'},
  reserved: {label: 'Rezervēts', tone: 'reserved'},
  sold: {label: 'Pārdots', tone: 'sold'},
}

interface RawPortableTextBlock {
  _type?: string
  children?: Array<{
    text?: string
  }>
}

interface RawPropertyCategory {
  slug?: string
  label?: string
  shortLabel?: string
  description?: string
  propertyCount?: number
  seo?: RawSeoField
}

interface RawPropertyProject {
  title?: string
  city?: string
  address?: string
}

interface RawProperty {
  _id: string
  title?: string
  slug?: string
  propertyCode?: string
  status?: PropertyStatus
  shortDescription?: string
  description?: RawPortableTextBlock[]
  aboutSectionTitle?: string
  rooms?: number
  area?: number
  price?: number
  pricePerSquareMeter?: number
  currency?: string
  floor?: number
  building?: string
  heroImage?: string
  gallery?: Array<{
    src?: string
    alt?: string
    label?: string
  }>
  floorPlanImage?: {
    src?: string
    width?: number
    height?: number
    originalFilename?: string
  }
  additionalFloorPlanImage?: {
    src?: string
    width?: number
    height?: number
    originalFilename?: string
  }
  floorPlanNote?: string
  floorPlanSectionTitle?: string
  floorPlanCardTitle?: string
  details?: Array<{
    label?: string
    value?: string
  }>
  category?: RawPropertyCategory
  project?: RawPropertyProject
  seo?: RawSeoField
}

const propertyCategorySelection = `
  "slug": slug.current,
  "label": title,
  shortLabel,
  description,
  "propertyCount": count(*[_type == "property" && references(^._id)]),
  seo{
    metaTitle,
    metaDescription,
    ogImage{
      asset->{
        url
      },
      alt
    },
    noIndex
  }
`

const propertySelection = `
  _id,
  title,
  "slug": slug.current,
  propertyCode,
  status,
  shortDescription,
  description,
  aboutSectionTitle,
  rooms,
  area,
  price,
  pricePerSquareMeter,
  currency,
  floor,
  building,
  "heroImage": heroImage.asset->url,
  gallery[]{
    "src": image.asset->url,
    alt,
    label
  },
  "floorPlanImage": floorPlanImage{
    "src": asset->url,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height,
    "originalFilename": asset->originalFilename
  },
  "additionalFloorPlanImage": additionalFloorPlanImage{
    "src": asset->url,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height,
    "originalFilename": asset->originalFilename
  },
  floorPlanNote,
  floorPlanSectionTitle,
  floorPlanCardTitle,
  details[]{
    label,
    value
  },
  "category": propertyType->{
    ${propertyCategorySelection}
  },
  "project": project->{
    title,
    city,
    address
  },
  seo{
    metaTitle,
    metaDescription,
    ogImage{
      asset->{
        url
      },
      alt
    },
    noIndex
  }
`

function mapCategory(rawCategory?: RawPropertyCategory): PropertyCategory {
  return {
    slug: trimValue(rawCategory?.slug) ?? '',
    label: trimValue(rawCategory?.label) ?? 'Dzīvoklis',
    shortLabel: trimValue(rawCategory?.shortLabel) ?? trimValue(rawCategory?.label) ?? 'Dzīvoklis',
    description: trimValue(rawCategory?.description) ?? '',
    propertyCount: rawCategory?.propertyCount ?? 0,
    seo: mapSeo(rawCategory?.seo),
  }
}

function getFirstNumberFromSlug(slug: string): number | null {
  const match = slug.match(/\d+/)
  return match ? Number(match[0]) : null
}

function sortCategoriesByFirstSlugNumber(categories: PropertyCategory[]): PropertyCategory[] {
  return [...categories].sort((a, b) => {
    const aNumber = getFirstNumberFromSlug(a.slug)
    const bNumber = getFirstNumberFromSlug(b.slug)

    if (aNumber !== null && bNumber !== null && aNumber !== bNumber) {
      return aNumber - bNumber
    }

    if (aNumber !== null && bNumber === null) {
      return -1
    }

    if (aNumber === null && bNumber !== null) {
      return 1
    }

    return a.label.localeCompare(b.label, 'lv')
  })
}

function getDescriptionParagraphs(blocks: RawPortableTextBlock[] = []): string[] {
  return blocks
    .filter((block) => block?._type === 'block')
    .map((block) =>
      (block.children ?? [])
        .map((child) => child.text ?? '')
        .join('')
        .trim(),
    )
    .filter(Boolean)
}

function formatDescriptionArea(area: number): string {
  if (!Number.isFinite(area) || area <= 0) {
    return ''
  }

  return Number.isInteger(area) ? String(area) : area.toFixed(1)
}

function getApartmentTypeLabel(rooms: number): string {
  const labels: Record<number, string> = {
    1: 'Vienistabas',
    2: 'Divistabu',
    3: 'Trīsistabu',
    4: 'Četristabu',
    5: 'Piecu istabu',
  }

  return labels[rooms] ?? `${rooms} istabu`
}

function getLowercaseApartmentTypeLabel(rooms: number): string {
  const label = getApartmentTypeLabel(rooms)
  return label ? `${label.charAt(0).toLocaleLowerCase('lv')}${label.slice(1)}` : label
}

function getRoomsFromCategorySlug(slug: string): number | null {
  const match = slug.match(/^(\d+)-rooms$/)
  return match ? Number(match[1]) : null
}

function getApartmentNumberFromPlanFilename(filename?: string): number | null {
  const match = filename?.match(/Talsu3A_dz(\d+)/i)
  return match ? Number(match[1]) : null
}

function getApartmentNumber(rawProperty: RawProperty): number | null {
  return (
    getApartmentNumberFromPlanFilename(rawProperty.additionalFloorPlanImage?.originalFilename) ??
    getApartmentNumberFromPlanFilename(rawProperty.floorPlanImage?.originalFilename)
  )
}

function replaceApartmentNumber(value: string | undefined, apartmentNumber: number): string | undefined {
  if (!value) {
    return value
  }

  return value.replace(/(nr\.?\s*)\d+/i, `$1${apartmentNumber}`)
}

function replaceApartmentSlugNumber(value: string | undefined, apartmentNumber: number): string | undefined {
  if (!value) {
    return value
  }

  return value.replace(/nr\d+$/i, `nr${apartmentNumber}`)
}

function getFloorFromApartmentNumber(apartmentNumber: number): number {
  if (apartmentNumber <= 5) {
    return 1
  }

  if (apartmentNumber <= 10) {
    return 2
  }

  return 3
}

function getBedroomDescription(rooms: number): string | null {
  const bedroomCount = rooms - 1
  const labels: Record<number, string> = {
    1: 'viena guļamistaba',
    2: 'divas guļamistabas',
    3: 'trīs guļamistabas',
    4: 'četras guļamistabas',
  }

  if (bedroomCount <= 0) {
    return null
  }

  return labels[bedroomCount] ?? `${bedroomCount} guļamistabas`
}

function getPropertyDescription(rooms: number, area: number, fallbackDescription?: string): string {
  const formattedArea = formatDescriptionArea(area)

  if (!rooms || !formattedArea) {
    return fallbackDescription ?? ''
  }

  const bedroomDescription = getBedroomDescription(rooms)
  const layoutDescription = bedroomDescription
    ? `dzīvojamā istaba, kas apvienota ar virtuves zonu, ${bedroomDescription}, vannas istaba un atsevišķa tualetes telpa`
    : 'dzīvojamā istaba, kas apvienota ar virtuves zonu, vannas istaba un atsevišķa tualetes telpa'

  return `${getApartmentTypeLabel(rooms)} dzīvoklis ar kopējo platību ${formattedArea} m². Dzīvoklī ir ${layoutDescription}. Dzīvoklī ir rekuperācijas sistēma, kas nodrošina svaigu gaisu telpās, regulējamas siltās grīdas katrā istabā un pilnībā pabeigta iekšējā apdare ar labiekārtotu sanitāro mezglu un santehniku. Katram dzīvoklim ir savi elektrības, apkures un ūdens skaitītāji, ēka ir siltināta, un iedzīvotājiem ir pieejamas arī autostāvvietas.`
}

function mapProject(rawProject?: RawPropertyProject): PropertyProject | undefined {
  if (!rawProject) {
    return undefined
  }

  const title = rawProject.title?.trim()
  const city = rawProject.city?.trim()
  const address = rawProject.address?.trim()

  if (!title && !city && !address) {
    return undefined
  }

  return {
    title: title || undefined,
    city: city || undefined,
    address: address || undefined,
  }
}

function mapProperty(rawProperty: RawProperty): Property {
  const category = mapCategory(rawProperty.category)
  const rooms = rawProperty.rooms ?? 0
  const title = trimValue(rawProperty.title) ?? ''
  const slug = trimValue(rawProperty.slug) ?? ''
  const propertyCode = trimValue(rawProperty.propertyCode) ?? ''
  const area = rawProperty.area ?? 0
  const floor = rawProperty.floor ?? 0
  const image = rawProperty.heroImage ?? ''
  const shortDescription = trimValue(rawProperty.shortDescription) ?? ''
  const descriptionParagraphs = getDescriptionParagraphs(rawProperty.description)
  const seo = mapSeo(rawProperty.seo)
  const gallery =
    rawProperty.gallery
      ?.map((item) => ({
        src: getSanityImageUrl(item.src ?? '', {width: 1600, height: 1600, fit: 'crop', quality: 82}),
        srcSet: getSanityImageSrcSet(item.src ?? '', [720, 1100, 1600, 2200], {
          aspectRatio: 1,
          fit: 'crop',
          quality: 82,
        }),
        thumbSrc: getSanityImageUrl(item.src ?? '', {width: 360, height: 360, fit: 'crop', quality: 76}),
        zoomSrc: getSanityImageUrl(item.src ?? '', {width: 2400, height: 2400, fit: 'crop', quality: 86}),
        alt: item.alt ?? rawProperty.title ?? '',
        label: trimValue(item.label),
      }))
      .filter((item) => item.src) ?? []
  const primaryFloorPlan = rawProperty.floorPlanImage
  const fallbackFloorPlanImage = trimValue(primaryFloorPlan?.src)
  const fallbackFloorPlanAlt = title
    ? `${title} dzīvokļa plāns`
    : `${rooms || ''} istabu dzīvokļa plāns`.trim()
  const mapFloorPlanImage = (
    item: RawProperty['floorPlanImage'],
    label: string,
  ): PropertyImage | null => {
    const src = trimValue(item?.src)

    if (!src) {
      return null
    }

    return {
      src: getSanityImageUrl(src, {width: 1600, fit: 'max', quality: 86}),
      srcSet: getSanityImageSrcSet(src, [720, 1100, 1600, 2200], {
        fit: 'max',
        quality: 86,
      }),
      thumbSrc: getSanityImageUrl(src, {width: 360, fit: 'max', quality: 78}),
      zoomSrc: getSanityImageUrl(src, {width: 2400, fit: 'max', quality: 88}),
      alt: fallbackFloorPlanAlt,
      label,
      width: item?.width,
      height: item?.height,
    }
  }
  const mappedFloorPlanImages = [
    mapFloorPlanImage(primaryFloorPlan, 'Dzīvokļa plāns'),
    mapFloorPlanImage(rawProperty.additionalFloorPlanImage, 'Stāva plāns'),
  ].filter((item): item is PropertyImage => Boolean(item))

  return {
    id: rawProperty._id,
    title,
    slug,
    propertyCode,
    status: rawProperty.status ?? 'available',
    shortDescription,
    descriptionParagraphs: descriptionParagraphs.length > 0 ? descriptionParagraphs : [shortDescription].filter(Boolean),
    aboutSectionTitle: trimValue(rawProperty.aboutSectionTitle),
    rooms,
    area,
    price: rawProperty.price ?? 0,
    pricePerSquareMeter: rawProperty.pricePerSquareMeter ?? 0,
    currency: trimValue(rawProperty.currency) ?? 'EUR',
    floor,
    building: trimValue(rawProperty.building),
    image,
    gallery:
      gallery.length > 0
        ? gallery
        : image
          ? [
              {
                src: getSanityImageUrl(image, {width: 1600, height: 1600, fit: 'crop', quality: 82}),
                srcSet: getSanityImageSrcSet(image, [720, 1100, 1600, 2200], {
                  aspectRatio: 1,
                  fit: 'crop',
                  quality: 82,
                }),
                thumbSrc: getSanityImageUrl(image, {width: 360, height: 360, fit: 'crop', quality: 76}),
                zoomSrc: getSanityImageUrl(image, {width: 2400, height: 2400, fit: 'crop', quality: 86}),
                alt: rawProperty.title ?? '',
                label: undefined,
              },
            ]
          : [],
    floorPlanImage: fallbackFloorPlanImage,
    additionalFloorPlanImage: trimValue(rawProperty.additionalFloorPlanImage?.src),
    floorPlanImages: mappedFloorPlanImages,
    floorPlanNote: trimValue(rawProperty.floorPlanNote),
    floorPlanSectionTitle: trimValue(rawProperty.floorPlanSectionTitle),
    floorPlanCardTitle: trimValue(rawProperty.floorPlanCardTitle),
    details:
      rawProperty.details
        ?.map((detail) => ({
          label: detail.label ?? '',
          value: detail.value ?? '',
        }))
        .filter((detail) => detail.label && detail.value) ?? [],
    category,
    project: mapProject(rawProperty.project),
    seo,
  }
}

function handleSanityQueryError(context: string, error: unknown): never {
  console.error(`Failed to load ${context} from Sanity.`, error)
  throw error
}

export async function getPropertyCategories(): Promise<PropertyCategory[]> {
  try {
    const rawCategories = await sanityClient.fetch<RawPropertyCategory[]>(
      `*[_type == "propertyType" && defined(slug.current)] {
        ${propertyCategorySelection}
      }`,
    )

    return sortCategoriesByFirstSlugNumber(rawCategories.map(mapCategory))
  } catch (error) {
    handleSanityQueryError('property categories', error)
  }
}

export async function getPropertyCategoryBySlug(categorySlug: string): Promise<PropertyCategory | null> {
  try {
    const rawCategory = await sanityClient.fetch<RawPropertyCategory | null>(
      `*[
        _type == "propertyType" &&
        slug.current == $categorySlug
      ][0]{
        ${propertyCategorySelection}
      }`,
      {categorySlug},
    )

    return rawCategory ? mapCategory(rawCategory) : null
  } catch (error) {
    handleSanityQueryError(`property category "${categorySlug}"`, error)
  }
}

export async function getAllProperties(): Promise<Property[]> {
  try {
    const rawProperties = await sanityClient.fetch<RawProperty[]>(
      `*[
        _type == "property" &&
        defined(slug.current) &&
        defined(propertyType->slug.current)
      ] | order(price asc) {
        ${propertySelection}
      }`,
    )

    return rawProperties.map(mapProperty)
  } catch (error) {
    handleSanityQueryError('properties', error)
  }
}

export async function getPropertiesByCategory(categorySlug: string): Promise<Property[]> {
  try {
    const rawProperties = await sanityClient.fetch<RawProperty[]>(
      `*[
        _type == "property" &&
        defined(slug.current) &&
        propertyType->slug.current == $categorySlug
      ] | order(price asc) {
        ${propertySelection}
      }`,
      {categorySlug},
    )

    return rawProperties.map(mapProperty)
  } catch (error) {
    handleSanityQueryError(`properties for category "${categorySlug}"`, error)
  }
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  try {
    const rawProperties = await sanityClient.fetch<RawProperty[]>(
      `*[
        _type == "property" &&
        defined(slug.current) &&
        defined(propertyType->slug.current)
      ] {
        ${propertySelection}
      }`,
    )

    return rawProperties.map(mapProperty).find((property) => property.slug === slug) ?? null
  } catch (error) {
    handleSanityQueryError(`property "${slug}"`, error)
  }
}

export async function getPropertyByCategoryAndSlug(
  categorySlug: string,
  slug: string,
): Promise<Property | null> {
  try {
    const rawProperties = await sanityClient.fetch<RawProperty[]>(
      `*[
        _type == "property" &&
        propertyType->slug.current == $categorySlug
      ] {
        ${propertySelection}
      }`,
      {categorySlug},
    )

    return rawProperties.map(mapProperty).find((property) => property.slug === slug) ?? null
  } catch (error) {
    handleSanityQueryError(`property "${slug}" in category "${categorySlug}"`, error)
  }
}

export async function getSimilarProperties(
  propertyId: string,
  categorySlug: string,
  limit = 3,
): Promise<Property[]> {
  try {
    const rawProperties = await sanityClient.fetch<RawProperty[]>(
      `*[
        _type == "property" &&
        defined(slug.current) &&
        _id != $propertyId &&
        propertyType->slug.current == $categorySlug
      ] | order(price asc) {
        ${propertySelection}
      }`,
      {propertyId, categorySlug},
    )

    return rawProperties.map(mapProperty).slice(0, limit)
  } catch (error) {
    handleSanityQueryError(`similar properties for "${propertyId}"`, error)
  }
}
