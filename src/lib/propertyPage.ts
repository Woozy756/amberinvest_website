import { formatCurrency } from "./formatting";
import { propertyStatusMeta, type Property } from "../sanity/properties";
import type { FloorPlanTab } from "../components/shared/FloorPlansSection.astro";
import type { Locale } from "../i18n/translations";
import {
	getLocalizedPropertyDescription,
	getLocalizedPropertyImageText,
	getLocalizedPropertyTitle
} from "../sanity/properties";

export interface PropertyFact {
	label: string;
	value: string;
}

export interface PropertyPageViewModel {
	status: (typeof propertyStatusMeta)[keyof typeof propertyStatusMeta];
	priceLabel: string;
	pricePerSquareMeterLabel: string;
	descriptionParagraphs: string[];
	locationLabel: string;
	aboutSectionTitle: string;
	keyFacts: PropertyFact[];
	floorPlans: FloorPlanTab[];
}

const factExclusionLabels = new Set(["Kopējā platība", "Istabu skaits", "Stāvs", "Statuss"]);

export function createPropertyPageViewModel(property: Property, locale: Locale = "lv"): PropertyPageViewModel {
	const isEnglish = locale === "en";
	const status = isEnglish
		? {
				...propertyStatusMeta[property.status],
				label: { available: "Available", reserved: "Reserved", sold: "Sold" }[property.status]
			}
		: propertyStatusMeta[property.status];
	const priceLabel = formatCurrency(property.price, property.currency);
	const pricePerSquareMeterLabel = formatCurrency(
		property.pricePerSquareMeter > 0 ? property.pricePerSquareMeter : Math.round(property.price / Math.max(property.area, 1)),
		property.currency,
	);
	const descriptionParagraphs =
		isEnglish
			? [getLocalizedPropertyDescription(property, locale)]
			: property.descriptionParagraphs.length > 0
			? property.descriptionParagraphs
			: [getLocalizedPropertyDescription(property, locale)];
	const locationLabel = property.project?.city || property.category.label || (isEnglish ? "Apartment" : "Dzīvoklis");
	const aboutSectionTitle =
		property.aboutSectionTitle || "Dzīves telpa ar skaidru plānojuma loģiku";

	const keyFacts: PropertyFact[] = [
		{ label: isEnglish ? "Rooms" : "Istabas", value: String(property.rooms) },
		{ label: isEnglish ? "Area" : "Platība", value: `${property.area.toFixed(1)} m²` },
		{ label: isEnglish ? "Floor" : "Stāvs", value: isEnglish ? `Floor ${property.floor}` : `${property.floor}. stāvs` },
		{ label: isEnglish ? "Status" : "Statuss", value: status.label },
	];

	const floorPlanSpecs = [
		{ label: isEnglish ? "Total area" : "Kopējā platība", value: `${property.area.toFixed(1)} m²` },
		{ label: isEnglish ? "Number of rooms" : "Istabu skaits", value: String(property.rooms) },
		{ label: isEnglish ? "Floor" : "Stāvs", value: isEnglish ? `Floor ${property.floor}` : `${property.floor}. stāvs` },
		...(property.building ? [{ label: isEnglish ? "Building" : "Ēka", value: property.building }] : []),
		...property.details
			.filter((detail) => !factExclusionLabels.has(detail.label))
			.map((detail) =>
				isEnglish
					? {
							label:
								({
									"Guļamistabas": "Bedrooms",
									"Vannas istabas": "Bathrooms",
									"Viesistaba": "Living room",
									"Papildu telpas": "Additional rooms"
								} as Record<string, string>)[detail.label] ??
								getLocalizedPropertyImageText(detail.label, locale) ??
								detail.label,
							value:
								detail.value === "Apvienota ar virtuvi un ēdamzonu"
									? "Combined with the kitchen and dining area"
									: detail.value === "Gaitenis un atsevišķa istaba"
										? "Hallway and a separate room"
										: getLocalizedPropertyImageText(detail.value, locale) ?? detail.value
						}
					: detail
			),
	];

	const localizedPropertyTitle = getLocalizedPropertyTitle(property, locale);
	const floorPlans: FloorPlanTab[] = [
		{
			id: property.category.slug,
			tabLabel: isEnglish ? `${property.rooms} rooms` : `${property.rooms} istabas`,
			title: isEnglish ? `${localizedPropertyTitle} plan` : property.floorPlanCardTitle || `${property.rooms} istabu plāns`,
			price: priceLabel,
			image: property.floorPlanImage ?? "/property-floor-plan.svg",
			images: property.floorPlanImages.map((image, index) => {
				const localizedLabel = getLocalizedPropertyImageText(image.label, locale);

				return {
					...image,
					alt: isEnglish
						? `${localizedPropertyTitle} ${localizedLabel?.toLowerCase() || `floor plan ${index + 1}`}`
						: image.alt,
					label: localizedLabel
				};
			}),
			imageAlt: isEnglish ? `${property.rooms}-room apartment plan` : `${property.rooms} istabu dzīvokļa plāns`,
			ctaText: isEnglish ? "Book a viewing" : "Piesaki apskati",
			ctaLink: "#property-inquiry",
			specs: floorPlanSpecs,
		},
	];

	return {
		status,
		priceLabel,
		pricePerSquareMeterLabel,
		descriptionParagraphs,
		locationLabel,
		aboutSectionTitle,
		keyFacts,
		floorPlans,
	};
}
