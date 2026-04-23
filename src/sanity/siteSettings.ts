import { sanityClient } from "sanity:client";
import { mapAssetImage, trimValue } from "./utils";

export interface SiteLink {
  label: string;
  href: string;
}

export interface SiteSocialLink {
  platform: string;
  url: string;
}

export interface SiteImage {
  url: string;
  alt?: string;
}

export interface SiteSeoSettings {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: SiteImage;
  noIndex: boolean;
}

export interface SiteSettings {
  siteTitle?: string;
  logo?: SiteImage;
  footerTitle?: string;
  footerDescription?: string;
  contactEmail?: string;
  phone?: string;
  address?: string;
  businessHours?: string;
  socialLinks: SiteSocialLink[];
  headerNavigation: SiteLink[];
  footerNavigation: SiteLink[];
  defaultSeo?: SiteSeoSettings;
}

interface RawSiteImage {
  asset?: {
    url?: string;
  };
  alt?: string;
}

interface RawSiteLink {
  label?: string;
  href?: string;
}

interface RawSiteSocialLink {
  platform?: string;
  url?: string;
}

interface RawSiteSeoSettings {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: RawSiteImage;
  noIndex?: boolean;
}

interface RawSiteSettings {
  siteTitle?: string;
  logo?: RawSiteImage;
  footerTitle?: string;
  footerDescription?: string;
  contactEmail?: string;
  phone?: string;
  address?: string;
  businessHours?: string;
  socialLinks?: RawSiteSocialLink[];
  headerNavigation?: RawSiteLink[];
  footerNavigation?: RawSiteLink[];
  defaultSeo?: RawSiteSeoSettings;
}

const siteSettingsQuery = `*[_type == "siteSettings"][0]{
  siteTitle,
  logo{
    asset->{
      url
    },
    alt
  },
  footerTitle,
  footerDescription,
  contactEmail,
  phone,
  address,
  businessHours,
  socialLinks[]{
    platform,
    url
  },
  headerNavigation[]{
    label,
    href
  },
  footerNavigation[]{
    label,
    href
  },
  defaultSeo{
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
}`;

function mapImage(image?: RawSiteImage): SiteImage | undefined {
  const mappedImage = mapAssetImage(image, { alt: image?.alt });

  if (!mappedImage) {
    return undefined;
  }

  return {
    url: mappedImage.src,
    alt: mappedImage.alt || undefined,
  };
}

function mapLinks(items: RawSiteLink[] | undefined): SiteLink[] {
  return (
    items
      ?.map((item) => ({
        label: trimValue(item.label) ?? "",
        href: trimValue(item.href) ?? "",
      }))
      .filter((item) => item.label && item.href) ?? []
  );
}

function mapSocialLinks(items: RawSiteSocialLink[] | undefined): SiteSocialLink[] {
  return (
    items
      ?.map((item) => ({
        platform: trimValue(item.platform) ?? "",
        url: trimValue(item.url) ?? "",
      }))
      .filter((item) => item.platform && item.url) ?? []
  );
}

function mapDefaultSeo(seo?: RawSiteSeoSettings): SiteSeoSettings | undefined {
  if (!seo) {
    return undefined;
  }

  return {
    metaTitle: trimValue(seo.metaTitle),
    metaDescription: trimValue(seo.metaDescription),
    ogImage: mapImage(seo.ogImage),
    noIndex: seo.noIndex === true,
  };
}

let settingsPromise: Promise<SiteSettings | null> | null = null;

export async function loadSiteSettings(): Promise<SiteSettings | null> {
  if (settingsPromise) {
    return settingsPromise;
  }

  settingsPromise = sanityClient
    .fetch<RawSiteSettings | null>(siteSettingsQuery)
    .then((result) => {
      if (!result) {
        return null;
      }

      return {
        siteTitle: trimValue(result.siteTitle),
        logo: mapImage(result.logo),
        footerTitle: trimValue(result.footerTitle),
        footerDescription: trimValue(result.footerDescription),
        contactEmail: trimValue(result.contactEmail),
        phone: trimValue(result.phone),
        address: trimValue(result.address),
        businessHours: trimValue(result.businessHours),
        socialLinks: mapSocialLinks(result.socialLinks),
        headerNavigation: mapLinks(result.headerNavigation),
        footerNavigation: mapLinks(result.footerNavigation),
        defaultSeo: mapDefaultSeo(result.defaultSeo),
      };
    })
    .catch(() => null);

  return settingsPromise;
}
