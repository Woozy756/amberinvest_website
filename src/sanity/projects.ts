import {sanityClient} from 'sanity:client'

export interface CompanyProjectPreviewItem {
  title: string
  category?: string
}

export interface CompanyProject {
  id: string
  title: string
  city: string
  address: string
  propertyCount: number
  coverImage?: string
  coverAlt: string
  propertyPreview: CompanyProjectPreviewItem[]
}

interface RawCompanyProjectPreviewItem {
  title?: string
  category?: string
}

interface RawCompanyProject {
  _id: string
  title?: string
  city?: string
  address?: string
  propertyCount?: number
  coverImage?: string
  coverAlt?: string
  propertyPreview?: RawCompanyProjectPreviewItem[]
}

const projectsQuery = `*[_type == "project"] | order(title asc) {
  _id,
  title,
  city,
  address,
  "propertyCount": count(*[_type == "property" && references(^._id)]),
  "coverImage": *[
    _type == "property" &&
    references(^._id) &&
    defined(heroImage.asset)
  ] | order(title asc)[0].heroImage.asset->url,
  "coverAlt": coalesce(
    *[
      _type == "property" &&
      references(^._id) &&
      defined(heroImage.asset)
    ] | order(title asc)[0].title,
    title
  ),
  "propertyPreview": *[
    _type == "property" &&
    references(^._id)
  ] | order(title asc)[0...3]{
    title,
    "category": propertyType->title
  }
}`

function mapProject(project: RawCompanyProject): CompanyProject {
  return {
    id: project._id,
    title: project.title?.trim() ?? '',
    city: project.city?.trim() ?? '',
    address: project.address?.trim() ?? '',
    propertyCount: project.propertyCount ?? 0,
    coverImage: project.coverImage?.trim() || undefined,
    coverAlt: project.coverAlt?.trim() || project.title?.trim() || '',
    propertyPreview:
      project.propertyPreview
        ?.map((item) => ({
          title: item.title?.trim() ?? '',
          category: item.category?.trim() || undefined,
        }))
        .filter((item) => item.title) ?? [],
  }
}

export async function loadCompanyProjects(): Promise<CompanyProject[]> {
  try {
    const rawProjects = await sanityClient.fetch<RawCompanyProject[]>(projectsQuery)

    return rawProjects.map(mapProject).filter((project) => project.title)
  } catch {
    return []
  }
}
