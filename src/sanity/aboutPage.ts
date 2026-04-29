import { sanityClient } from "sanity:client";
import { mapSeo, trimStringList, trimValueOrEmpty, type RawSeoField, type SanitySeo } from "./utils";

export interface AboutPageContent {
	title: string;
	introEyebrow: string;
	introTitle: string;
	introParagraphs: string[];
	valuesEyebrow: string;
	valuesTitle: string;
	values: string[];
	missionEyebrow: string;
	missionText: string;
	visionEyebrow: string;
	visionText: string;
	seo?: SanitySeo;
}

interface RawAboutPage {
	title?: string;
	introEyebrow?: string;
	introTitle?: string;
	introParagraphs?: string[];
	valuesEyebrow?: string;
	valuesTitle?: string;
	values?: string[];
	missionEyebrow?: string;
	missionText?: string;
	visionEyebrow?: string;
	visionText?: string;
	seo?: RawSeoField;
}

interface RawAboutPageQueryResult {
	page?: RawAboutPage | null;
}

const aboutPageQuery = `{
  "page": *[_id == "aboutPage"][0]{
    title,
    introEyebrow,
    introTitle,
    introParagraphs,
    valuesEyebrow,
    valuesTitle,
    values,
    missionEyebrow,
    missionText,
    visionEyebrow,
    visionText,
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
  }
}`;

export async function loadAboutPage(): Promise<AboutPageContent | null> {
	try {
		const result = await sanityClient.fetch<RawAboutPageQueryResult>(aboutPageQuery);
		const page = result?.page;

		if (!page) {
			return null;
		}

		return {
			title: trimValueOrEmpty(page.title),
			introEyebrow: trimValueOrEmpty(page.introEyebrow),
			introTitle: trimValueOrEmpty(page.introTitle),
			introParagraphs: trimStringList(page.introParagraphs),
			valuesEyebrow: trimValueOrEmpty(page.valuesEyebrow),
			valuesTitle: trimValueOrEmpty(page.valuesTitle),
			values: trimStringList(page.values),
			missionEyebrow: trimValueOrEmpty(page.missionEyebrow),
			missionText: trimValueOrEmpty(page.missionText),
			visionEyebrow: trimValueOrEmpty(page.visionEyebrow),
			visionText: trimValueOrEmpty(page.visionText),
			seo: mapSeo(page.seo),
		};
	} catch {
		return null;
	}
}
