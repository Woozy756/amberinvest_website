import { formatCurrency } from "./formatting";
import { propertyStatusMeta, type Property } from "../sanity/properties";
import type { FloorPlanTab } from "../components/shared/FloorPlansSection.astro";

export interface PropertyFact {
	label: string;
	value: string;
}

export interface PropertyPageViewModel {
	status: (typeof propertyStatusMeta)[keyof typeof propertyStatusMeta];
	priceLabel: string;
	descriptionParagraphs: string[];
	locationLabel: string;
	aboutSectionTitle: string;
	keyFacts: PropertyFact[];
	floorPlans: FloorPlanTab[];
}

const factExclusionLabels = new Set(["Kopējā platība", "Istabu skaits", "Stāvs", "Statuss"]);

export function createPropertyPageViewModel(property: Property): PropertyPageViewModel {
	const status = propertyStatusMeta[property.status];
	const priceLabel = formatCurrency(property.price, property.currency);
	const descriptionParagraphs =
		property.descriptionParagraphs.length > 0
			? property.descriptionParagraphs
			: [property.shortDescription];
	const locationLabel = property.project?.city || property.category.label || "Dzīvoklis";
	const aboutSectionTitle =
		property.aboutSectionTitle || "Dzīves telpa ar skaidru plānojuma loģiku";

	const keyFacts: PropertyFact[] = [
		{ label: "Istabas", value: String(property.rooms) },
		{ label: "Platība", value: `${property.area.toFixed(1)} m²` },
		{ label: "Stāvs", value: `${property.floor}. stāvs` },
		{ label: "Statuss", value: status.label },
	];

	const floorPlanSpecs = [
		{ label: "Kopējā platība", value: `${property.area.toFixed(1)} m²` },
		{ label: "Istabu skaits", value: String(property.rooms) },
		{ label: "Stāvs", value: `${property.floor}. stāvs` },
		...(property.building ? [{ label: "Ēka", value: property.building }] : []),
		...property.details.filter((detail) => !factExclusionLabels.has(detail.label)),
	];

	const floorPlans: FloorPlanTab[] = [
		{
			id: property.category.slug,
			tabLabel: `${property.rooms} istabas`,
			title: property.floorPlanCardTitle || `${property.rooms} istabu plāns`,
			price: priceLabel,
			image: property.floorPlanImage ?? "/property-floor-plan.svg",
			imageAlt: `${property.rooms} istabu dzīvokļa plāns`,
			ctaText: "Pieteikt apskati",
			ctaLink: "#property-inquiry",
			specs: floorPlanSpecs,
		},
	];

	return {
		status,
		priceLabel,
		descriptionParagraphs,
		locationLabel,
		aboutSectionTitle,
		keyFacts,
		floorPlans,
	};
}
