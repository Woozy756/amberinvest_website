import { sanityClient } from "sanity:client";
import { trimStringList, trimValueOrEmpty } from "./utils";

export interface HomepageHeroContent {
	heroEyebrow?: string;
	heroTitle?: string;
	heroLead?: string;
	heroBackgroundImage?: {
		asset?: {
			url?: string;
		};
		alt?: string;
	};
	availabilityTitle?: string;
	metrics?: Array<{
		label?: string;
		value?: string;
	}>;
}

export interface HomepageHighlightsContent {
	projectHighlightsEyebrow?: string;
	projectHighlightsTitle?: string;
	projectHighlightsGalleryAriaLabel?: string;
	projectFeatures?: Array<{
		iconSvg?: {
			asset?: {
				url?: string;
			};
			originalFilename?: string;
		};
		title?: string;
		body?: string;
	}>;
	projectGallery?: Array<{
		image?: {
			asset?: {
				url?: string;
			};
		};
		alt?: string;
	}>;
}

export interface HomepageEditorialContent {
	editorialEyebrow?: string;
	editorialTitle?: string;
	editorialLead?: string;
	editorialRowAriaLabel?: string;
	editorialImages?: Array<{
		image?: {
			asset?: {
				url?: string;
			};
		};
		alt?: string;
		label?: string;
		orientation?: "landscape" | "portrait";
	}>;
}

export interface HomepageContactContent {
	contactEyebrow?: string;
	contactTitle?: string;
	contactLead?: string;
	contactBenefits?: string[];
}

export interface HomepageContent {
	hero: HomepageHeroContent;
	highlights: HomepageHighlightsContent;
	editorial: HomepageEditorialContent;
	contact: HomepageContactContent;
}

interface RawHomepageImage {
	asset?: {
		url?: string;
	};
	alt?: string;
}

interface RawHomepageContent {
	heroEyebrow?: string;
	heroTitle?: string;
	heroLead?: string;
	heroBackgroundImage?: RawHomepageImage;
	availabilityTitle?: string;
	metrics?: Array<{
		label?: string;
		value?: string;
	}>;
	projectHighlightsEyebrow?: string;
	projectHighlightsTitle?: string;
	projectHighlightsGalleryAriaLabel?: string;
	projectFeatures?: Array<{
		iconSvg?: {
			asset?: {
				url?: string;
			};
			originalFilename?: string;
		};
		title?: string;
		body?: string;
	}>;
	projectGallery?: Array<{
		image?: RawHomepageImage;
		alt?: string;
	}>;
	editorialEyebrow?: string;
	editorialTitle?: string;
	editorialLead?: string;
	editorialRowAriaLabel?: string;
	editorialImages?: Array<{
		image?: RawHomepageImage;
		alt?: string;
		label?: string;
		orientation?: "landscape" | "portrait";
	}>;
	contactEyebrow?: string;
	contactTitle?: string;
	contactLead?: string;
	contactBenefits?: string[];
}

const homepageQuery = `*[_type == "homepage"][0]{
  heroEyebrow,
  heroTitle,
  heroLead,
  heroBackgroundImage{
    asset->{
      url
    },
    alt
  },
  availabilityTitle,
  metrics[]{
    label,
    value
  },
  projectHighlightsEyebrow,
  projectHighlightsTitle,
  projectHighlightsGalleryAriaLabel,
  projectFeatures[]{
    iconSvg{
      asset->{
        url
      },
      originalFilename
    },
    title,
    body
  },
  projectGallery[]{
    image{
      asset->{
        url
      }
    },
    alt
  },
  editorialEyebrow,
  editorialTitle,
  editorialLead,
  editorialRowAriaLabel,
  editorialImages[]{
    image{
      asset->{
        url
      }
    },
    alt,
    label,
    orientation
  },
  contactEyebrow,
  contactTitle,
  contactLead,
  contactBenefits[]
}`;

function mapHeroSection(page: RawHomepageContent | null): HomepageHeroContent {
	return {
		heroEyebrow: trimValueOrEmpty(page?.heroEyebrow),
		heroTitle: trimValueOrEmpty(page?.heroTitle),
		heroLead: trimValueOrEmpty(page?.heroLead),
		heroBackgroundImage: page?.heroBackgroundImage,
		availabilityTitle: trimValueOrEmpty(page?.availabilityTitle),
		metrics:
			page?.metrics?.map((metric) => ({
				label: trimValueOrEmpty(metric.label),
				value: trimValueOrEmpty(metric.value),
			})) ?? [],
	};
}

function mapHighlightsSection(page: RawHomepageContent | null): HomepageHighlightsContent {
	return {
		projectHighlightsEyebrow: trimValueOrEmpty(page?.projectHighlightsEyebrow),
		projectHighlightsTitle: trimValueOrEmpty(page?.projectHighlightsTitle),
		projectHighlightsGalleryAriaLabel: trimValueOrEmpty(page?.projectHighlightsGalleryAriaLabel),
		projectFeatures:
			page?.projectFeatures?.map((feature) => ({
				iconSvg: feature.iconSvg,
				title: trimValueOrEmpty(feature.title),
				body: trimValueOrEmpty(feature.body),
			})) ?? [],
		projectGallery:
			page?.projectGallery?.map((item) => ({
				image: item.image,
				alt: trimValueOrEmpty(item.alt),
			})) ?? [],
	};
}

function mapEditorialSection(page: RawHomepageContent | null): HomepageEditorialContent {
	return {
		editorialEyebrow: trimValueOrEmpty(page?.editorialEyebrow),
		editorialTitle: trimValueOrEmpty(page?.editorialTitle),
		editorialLead: trimValueOrEmpty(page?.editorialLead),
		editorialRowAriaLabel: trimValueOrEmpty(page?.editorialRowAriaLabel),
		editorialImages:
			page?.editorialImages?.map((image) => ({
				image: image.image,
				alt: trimValueOrEmpty(image.alt),
				label: trimValueOrEmpty(image.label),
				orientation: image.orientation,
			})) ?? [],
	};
}

function mapContactSection(page: RawHomepageContent | null): HomepageContactContent {
	return {
		contactEyebrow: trimValueOrEmpty(page?.contactEyebrow),
		contactTitle: trimValueOrEmpty(page?.contactTitle),
		contactLead: trimValueOrEmpty(page?.contactLead),
		contactBenefits: trimStringList(page?.contactBenefits),
	};
}

export async function loadHomepage(): Promise<HomepageContent | null> {
	try {
		const page = await sanityClient.fetch<RawHomepageContent | null>(homepageQuery);

		return {
			hero: mapHeroSection(page),
			highlights: mapHighlightsSection(page),
			editorial: mapEditorialSection(page),
			contact: mapContactSection(page),
		};
	} catch {
		return null;
	}
}
