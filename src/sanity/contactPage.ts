import { sanityClient } from "sanity:client";
import { mapSeo, trimStringList, trimValueOrEmpty, type RawSeoField, type SanitySeo } from "./utils";

export interface ContactPageContent {
	title: string;
	contactEyebrow: string;
	contactTitle: string;
	contactLead: string;
	contactHighlights: string[];
	formEyebrow: string;
	formTitle: string;
	formLead: string;
	formCardTitle: string;
	formCardIntro: string;
	defaultInformation: string;
	submitLabel: string;
	seo?: SanitySeo;
}

interface RawContactPage {
	title?: string;
	contactEyebrow?: string;
	contactTitle?: string;
	contactLead?: string;
	contactHighlights?: string[];
	formEyebrow?: string;
	formTitle?: string;
	formLead?: string;
	formCardTitle?: string;
	formCardIntro?: string;
	defaultInformation?: string;
	submitLabel?: string;
	seo?: RawSeoField;
}

const contactPageQuery = `*[_id == "contactPage"][0]{
  title,
  contactEyebrow,
  contactTitle,
  contactLead,
  contactHighlights,
  formEyebrow,
  formTitle,
  formLead,
  formCardTitle,
  formCardIntro,
  defaultInformation,
  submitLabel,
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
}`;

export async function loadContactPage(): Promise<ContactPageContent | null> {
	try {
		const page = await sanityClient.fetch<RawContactPage | null>(contactPageQuery);

		if (!page) {
			return null;
		}

		return {
			title: trimValueOrEmpty(page.title),
			contactEyebrow: trimValueOrEmpty(page.contactEyebrow),
			contactTitle: trimValueOrEmpty(page.contactTitle),
			contactLead: trimValueOrEmpty(page.contactLead),
			contactHighlights: trimStringList(page.contactHighlights),
			formEyebrow: trimValueOrEmpty(page.formEyebrow),
			formTitle: trimValueOrEmpty(page.formTitle),
			formLead: trimValueOrEmpty(page.formLead),
			formCardTitle: trimValueOrEmpty(page.formCardTitle),
			formCardIntro: trimValueOrEmpty(page.formCardIntro),
			defaultInformation: trimValueOrEmpty(page.defaultInformation),
			submitLabel: trimValueOrEmpty(page.submitLabel),
			seo: mapSeo(page.seo),
		};
	} catch {
		return null;
	}
}
