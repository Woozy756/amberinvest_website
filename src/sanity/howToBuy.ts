import { sanityClient } from "sanity:client";
import { mapAssetImage, mapParagraphField, splitParagraphs, trimStringList, trimValue, trimValueOrEmpty } from "./utils";

export interface HowToBuyImage {
	src: string;
	alt: string;
	label?: string;
}

export interface HowToBuyDetailItem {
	label: string;
	value: string;
}

export interface HowToBuyStep {
	title: string;
	body: string;
	bodyParagraphs: string[];
	supportingNote?: string;
	image?: HowToBuyImage;
}

export interface HowToBuyFaqItem {
	question: string;
	answer: string;
	answerParagraphs: string[];
}

export interface HowToBuyPageContent {
	title: string;
	heroEyebrow: string;
	heroTitle: string;
	heroLead: string;
	heroLeadParagraphs: string[];
	heroImage?: HowToBuyImage;
	stepsEyebrow: string;
	stepsTitle: string;
	stepsLead: string;
	stepsLeadParagraphs: string[];
	steps: HowToBuyStep[];
	financingEyebrow: string;
	financingTitle: string;
	financingLead: string;
	financingLeadParagraphs: string[];
	financingImage?: HowToBuyImage;
	financingHighlights: HowToBuyDetailItem[];
	documentsEyebrow: string;
	documentsTitle: string;
	documentsLead: string;
	documentsLeadParagraphs: string[];
	documentsImage?: HowToBuyImage;
	documentItems: HowToBuyDetailItem[];
	faqEyebrow: string;
	faqTitle: string;
	faqLead: string;
	faqLeadParagraphs: string[];
	faqItems: HowToBuyFaqItem[];
	contactEyebrow: string;
	contactTitle: string;
	contactLead: string;
	contactLeadParagraphs: string[];
	contactBenefits: string[];
	contactFormTitle: string;
	contactFormIntro: string;
	contactDefaultInformation: string;
	contactSubmitLabel: string;
}

interface RawImage {
	image?: {
		asset?: {
			url?: string;
		};
	};
	alt?: string;
	label?: string;
}

interface RawPlainImage {
	asset?: {
		url?: string;
	};
}

interface RawDetailItem {
	label?: string;
	value?: string;
}

interface RawStep {
	title?: string;
	body?: string;
	supportingNote?: string;
	image?: RawImage;
}

interface RawFaqItem {
	question?: string;
	answer?: string;
}

interface RawHowToBuyPage {
	title?: string;
	heroEyebrow?: string;
	heroTitle?: string;
	heroLead?: string;
	heroImage?: RawPlainImage;
	stepsEyebrow?: string;
	stepsTitle?: string;
	stepsLead?: string;
	steps?: RawStep[];
	financingEyebrow?: string;
	financingTitle?: string;
	financingLead?: string;
	financingImage?: RawImage;
	financingHighlights?: RawDetailItem[];
	documentsEyebrow?: string;
	documentsTitle?: string;
	documentsLead?: string;
	documentsImage?: RawImage;
	documentItems?: RawDetailItem[];
	faqEyebrow?: string;
	faqTitle?: string;
	faqLead?: string;
	faqItems?: RawFaqItem[];
	contactEyebrow?: string;
	contactTitle?: string;
	contactLead?: string;
	contactBenefits?: string[];
	contactFormTitle?: string;
	contactFormIntro?: string;
	contactDefaultInformation?: string;
	contactSubmitLabel?: string;
}

interface RawHowToBuyQueryResult {
	page?: RawHowToBuyPage | null;
}

const howToBuyQuery = `{
  "page": *[_id == "howToBuyPageClean"][0]{
    title,
    heroEyebrow,
    heroTitle,
    heroLead,
    heroImage{
      asset->{
        url
      }
    },
    stepsEyebrow,
    stepsTitle,
    stepsLead,
    steps[]{
      title,
      body,
      supportingNote,
      image{
        image{
          asset->{
            url
          }
        },
        alt,
        label
      }
    },
    financingEyebrow,
    financingTitle,
    financingLead,
    financingImage{
      image{
        asset->{
          url
        }
      },
      alt,
      label
    },
    financingHighlights[]{
      label,
      value
    },
    documentsEyebrow,
    documentsTitle,
    documentsLead,
    documentsImage{
      image{
        asset->{
          url
        }
      },
      alt,
      label
    },
    documentItems[]{
      label,
      value
    },
    faqEyebrow,
    faqTitle,
    faqLead,
    faqItems[]{
      question,
      answer
    },
    contactEyebrow,
    contactTitle,
    contactLead,
    contactBenefits,
    contactFormTitle,
    contactFormIntro,
    contactDefaultInformation,
    contactSubmitLabel
  }
}`;

function mapImage(rawImage?: RawImage): HowToBuyImage | undefined {
	return mapAssetImage(rawImage?.image, {
		alt: rawImage?.alt,
		label: rawImage?.label,
	});
}

function mapPlainImage(rawImage?: RawPlainImage, altFallback = ""): HowToBuyImage | undefined {
	return mapAssetImage(rawImage, { alt: altFallback });
}

function mapDetailItems(items: RawDetailItem[] | undefined): HowToBuyDetailItem[] {
	return (
		items
			?.map((item) => ({
				label: item.label?.trim() ?? "",
				value: item.value?.trim() ?? "",
			}))
			.filter((item) => item.label && item.value) ?? []
	);
}

function mapSteps(items: RawStep[] | undefined): HowToBuyStep[] {
	return (
		items
			?.map((item) => {
				const title = trimValueOrEmpty(item.title);
				const body = trimValueOrEmpty(item.body);
				const bodyParagraphs = splitParagraphs(body);

				if (!title || !body) {
					return null;
				}

				return {
					title,
					body,
					bodyParagraphs: bodyParagraphs.length > 0 ? bodyParagraphs : [body],
					supportingNote: trimValue(item.supportingNote),
					image: mapImage(item.image),
				};
			})
			.filter((item): item is HowToBuyStep => Boolean(item)) ?? []
	);
}

function mapFaqItems(items: RawFaqItem[] | undefined): HowToBuyFaqItem[] {
	return (
		items
			?.map((item) => {
				const question = trimValueOrEmpty(item.question);
				const answer = trimValueOrEmpty(item.answer);
				const answerParagraphs = splitParagraphs(answer);

				if (!question || !answer) {
					return null;
				}

				return {
					question,
					answer,
					answerParagraphs: answerParagraphs.length > 0 ? answerParagraphs : [answer],
				};
			})
			.filter((item): item is HowToBuyFaqItem => Boolean(item)) ?? []
	);
}

export async function loadHowToBuyPage(): Promise<HowToBuyPageContent | null> {
	try {
		const result = await sanityClient.fetch<RawHowToBuyQueryResult>(howToBuyQuery);
		const page = result?.page;

		if (!page) {
			return null;
		}

		const heroLead = mapParagraphField(page.heroLead);
		const stepsLead = mapParagraphField(page.stepsLead);
		const financingLead = mapParagraphField(page.financingLead);
		const documentsLead = mapParagraphField(page.documentsLead);
		const faqLead = mapParagraphField(page.faqLead);
		const contactLead = mapParagraphField(page.contactLead);

		return {
			title: trimValueOrEmpty(page.title),
			heroEyebrow: trimValueOrEmpty(page.heroEyebrow),
			heroTitle: trimValueOrEmpty(page.heroTitle),
			heroLead: heroLead.value,
			heroLeadParagraphs: heroLead.paragraphs,
			heroImage: mapPlainImage(page.heroImage, trimValueOrEmpty(page.heroTitle)),
			stepsEyebrow: trimValueOrEmpty(page.stepsEyebrow),
			stepsTitle: trimValueOrEmpty(page.stepsTitle),
			stepsLead: stepsLead.value,
			stepsLeadParagraphs: stepsLead.paragraphs,
			steps: mapSteps(page.steps),
			financingEyebrow: trimValueOrEmpty(page.financingEyebrow),
			financingTitle: trimValueOrEmpty(page.financingTitle),
			financingLead: financingLead.value,
			financingLeadParagraphs: financingLead.paragraphs,
			financingImage: mapImage(page.financingImage),
			financingHighlights: mapDetailItems(page.financingHighlights),
			documentsEyebrow: trimValueOrEmpty(page.documentsEyebrow),
			documentsTitle: trimValueOrEmpty(page.documentsTitle),
			documentsLead: documentsLead.value,
			documentsLeadParagraphs: documentsLead.paragraphs,
			documentsImage: mapImage(page.documentsImage),
			documentItems: mapDetailItems(page.documentItems),
			faqEyebrow: trimValueOrEmpty(page.faqEyebrow),
			faqTitle: trimValueOrEmpty(page.faqTitle),
			faqLead: faqLead.value,
			faqLeadParagraphs: faqLead.paragraphs,
			faqItems: mapFaqItems(page.faqItems),
			contactEyebrow: trimValueOrEmpty(page.contactEyebrow),
			contactTitle: trimValueOrEmpty(page.contactTitle),
			contactLead: contactLead.value,
			contactLeadParagraphs: contactLead.paragraphs,
			contactBenefits: trimStringList(page.contactBenefits),
			contactFormTitle: trimValueOrEmpty(page.contactFormTitle),
			contactFormIntro: trimValueOrEmpty(page.contactFormIntro),
			contactDefaultInformation: trimValueOrEmpty(page.contactDefaultInformation),
			contactSubmitLabel: trimValueOrEmpty(page.contactSubmitLabel),
		};
	} catch {
		return null;
	}
}
