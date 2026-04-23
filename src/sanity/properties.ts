import {sanityClient} from 'sanity:client'
import { trimValue } from './utils'

export type PropertyStatus = 'available' | 'reserved' | 'sold'

export interface PropertyImage {
  src: string
  alt: string
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
  currency: string
  floor: number
  building?: string
  image: string
  gallery: PropertyImage[]
  floorPlanImage?: string
  floorPlanNote?: string
  floorPlanSectionTitle?: string
  floorPlanCardTitle?: string
  details: PropertyDetailItem[]
  category: PropertyCategory
  project?: PropertyProject
}

export function getPropertyCategoryHref(category: Pick<PropertyCategory, 'slug'> | string): string {
  const slug = typeof category === 'string' ? category : category.slug
  return `/properties/${slug}`
}

export function getPropertyHref(
  property: Pick<Property, 'slug' | 'category'> & {category: Pick<PropertyCategory, 'slug'>},
): string {
  return `${getPropertyCategoryHref(property.category)}/${property.slug}`
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
  currency?: string
  floor?: number
  building?: string
  heroImage?: string
  gallery?: Array<{
    src?: string
    alt?: string
  }>
  floorPlanImage?: string
  floorPlanNote?: string
  floorPlanSectionTitle?: string
  floorPlanCardTitle?: string
  details?: Array<{
    label?: string
    value?: string
  }>
  category?: RawPropertyCategory
  project?: RawPropertyProject
}

const propertyCategorySelection = `
  "slug": slug.current,
  "label": title,
  shortLabel,
  description,
  "propertyCount": count(*[_type == "property" && references(^._id)])
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
  currency,
  floor,
  building,
  "heroImage": heroImage.asset->url,
  gallery[]{
    "src": image.asset->url,
    alt
  },
  "floorPlanImage": floorPlanImage.asset->url,
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
  }
`

function mapCategory(rawCategory?: RawPropertyCategory): PropertyCategory {
  return {
    slug: trimValue(rawCategory?.slug) ?? '',
    label: trimValue(rawCategory?.label) ?? 'Dzīvoklis',
    shortLabel: trimValue(rawCategory?.shortLabel) ?? trimValue(rawCategory?.label) ?? 'Dzīvoklis',
    description: trimValue(rawCategory?.description) ?? '',
    propertyCount: rawCategory?.propertyCount ?? 0,
  }
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
  const image = rawProperty.heroImage ?? ''
  const gallery =
    rawProperty.gallery
      ?.map((item) => ({
        src: item.src ?? '',
        alt: item.alt ?? rawProperty.title ?? '',
      }))
      .filter((item) => item.src) ?? []

  return {
    id: rawProperty._id,
    title: trimValue(rawProperty.title) ?? '',
    slug: trimValue(rawProperty.slug) ?? '',
    propertyCode: trimValue(rawProperty.propertyCode) ?? '',
    status: rawProperty.status ?? 'available',
    shortDescription: trimValue(rawProperty.shortDescription) ?? '',
    descriptionParagraphs: getDescriptionParagraphs(rawProperty.description),
    aboutSectionTitle: trimValue(rawProperty.aboutSectionTitle),
    rooms: rawProperty.rooms ?? 0,
    area: rawProperty.area ?? 0,
    price: rawProperty.price ?? 0,
    currency: trimValue(rawProperty.currency) ?? 'EUR',
    floor: rawProperty.floor ?? 0,
    building: trimValue(rawProperty.building),
    image,
    gallery: gallery.length > 0 ? gallery : image ? [{src: image, alt: rawProperty.title ?? ''}] : [],
    floorPlanImage: trimValue(rawProperty.floorPlanImage),
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
  }
}

function handleSanityQueryError(context: string, error: unknown): never {
  console.error(`Failed to load ${context} from Sanity.`, error)
  throw error
}

export async function getPropertyCategories(): Promise<PropertyCategory[]> {
  try {
    const rawCategories = await sanityClient.fetch<RawPropertyCategory[]>(
      `*[_type == "propertyType" && defined(slug.current)] | order(title asc) {
        ${propertyCategorySelection}
      }`,
    )

    return rawCategories.map(mapCategory)
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
    const rawProperty = await sanityClient.fetch<RawProperty | null>(
      `*[
        _type == "property" &&
        slug.current == $slug
      ][0] {
        ${propertySelection}
      }`,
      {slug},
    )

    return rawProperty ? mapProperty(rawProperty) : null
  } catch (error) {
    handleSanityQueryError(`property "${slug}"`, error)
  }
}

export async function getPropertyByCategoryAndSlug(
  categorySlug: string,
  slug: string,
): Promise<Property | null> {
  try {
    const rawProperty = await sanityClient.fetch<RawProperty | null>(
      `*[
        _type == "property" &&
        slug.current == $slug &&
        propertyType->slug.current == $categorySlug
      ][0] {
        ${propertySelection}
      }`,
      {categorySlug, slug},
    )

    return rawProperty ? mapProperty(rawProperty) : null
  } catch (error) {
    handleSanityQueryError(`property "${slug}" in category "${categorySlug}"`, error)
  }
}

export async function getSimilarProperties(
  slug: string,
  categorySlug: string,
  limit = 3,
): Promise<Property[]> {
  try {
    const rawProperties = await sanityClient.fetch<RawProperty[]>(
      `*[
        _type == "property" &&
        defined(slug.current) &&
        slug.current != $slug &&
        propertyType->slug.current == $categorySlug
      ] | order(price asc) {
        ${propertySelection}
      }`,
      {slug, categorySlug},
    )

    return rawProperties.map(mapProperty).slice(0, limit)
  } catch (error) {
    handleSanityQueryError(`similar properties for "${slug}"`, error)
  }
}
