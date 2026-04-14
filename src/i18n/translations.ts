export const locales = ["lv"] as const;

export type Locale = (typeof locales)[number];

type Messages = {
	site: {
		defaultTitle: string;
	};
	brand: {
		name: string;
		project: string;
		homeAriaLabel: string;
	};
	header: {
		navAriaLabel: string;
		mobileNavAriaLabel: string;
		menuOpenLabel: string;
		cta: string;
		home: string;
		properties: string;
		propertiesListing: string;
		propertyDetail: string;
		aboutUs: string;
		howToBuy: string;
		faq: string;
		contact: string;
	};
	home: {
		title: string;
		heroEyebrow: string;
		heroTitle: string;
		heroLead: string;
		primaryCta: string;
		secondaryCta: string;
		availabilityTitle: string;
		availabilityCta: string;
		metrics: Array<{
			label: string;
			value: string;
		}>;
		projectHighlights: {
			eyebrow: string;
			title: string;
			galleryAriaLabel: string;
			features: Array<{
				icon: "structure" | "energy" | "finish" | "parking" | "lift" | "location";
				title: string;
				body: string;
			}>;
			gallery: Array<{
				image: string;
				thumb: string;
				alt: string;
			}>;
		};
		editorialGallery: {
			eyebrow: string;
			title: string;
			lead: string;
			rowAriaLabel: string;
			images: Array<{
				image: string;
				alt: string;
				label: string;
				orientation: "landscape" | "portrait";
			}>;
		};
		apartmentPlans: {
			eyebrow: string;
			title: string;
			lead: string;
			tabsAriaLabel: string;
			specsAriaLabel: string;
			plans: Array<{
				tabLabel: string;
				title: string;
				price: string;
				imageKey: "plan2room" | "plan3room";
				imageAlt: string;
				ctaText: string;
				ctaLink: string;
				specs: Array<{
					label: string;
					value: string;
				}>;
			}>;
		};
	};
	pages: {
		properties: string;
		propertyDetail: string;
		aboutUs: string;
		howToBuy: string;
		faq: string;
		contact: string;
	};
};

const translations: Record<Locale, Messages> = {
	lv: {
		site: {
			defaultTitle: "Amberinvest"
		},
		brand: {
			name: "Amberinvest",
			project: "V Residences Ventspils",
			homeAriaLabel: "Amberinvest sākumlapa"
		},
		header: {
			navAriaLabel: "Galvenā navigācija",
			mobileNavAriaLabel: "Mobilā navigācija",
			menuOpenLabel: "Atvērt izvēlni",
			cta: "Nosūtīt pieprasījumu",
			home: "Sākums",
			properties: "Dzīvokļi",
			propertiesListing: "Dzīvokļu saraksts",
			propertyDetail: "Dzīvokļa detaļas",
			aboutUs: "Par mums",
			howToBuy: "Kā iegādāties",
			faq: "BUJ",
			contact: "Kontakti"
		},
		home: {
			title: "Amberinvest | Dzīvokļi Ventspilī",
			heroEyebrow: "V Residences • Ventspils",
			heroTitle: "Mūsdienīgi dzīvokļi ar pilnu apdari un pārdomātiem plānojumiem",
			heroLead:
				"Vēsturiskās ēkas atjaunošanas projekts ar sakārtotu inženierinfrastruktūru, moderniem plānojumiem un pārdomātu koplietošanas telpu kvalitāti.",
			primaryCta: "Skatīt dzīvokļus",
			secondaryCta: "Pieteikt apskati",
			availabilityTitle: "Aktuālā pieejamība",
			availabilityCta: "Pieejamie dzīvokļi",
			metrics: [
				{ label: "Dzīvokļi", value: "24" },
				{ label: "Plānojumi", value: "2–3 istabas" },
				{ label: "Platība", value: "45–75 m²" },
				{ label: "Pabeigšana", value: "2026" }
			],
			projectHighlights: {
				eyebrow: "Par projektu",
				title: "Pārdomāts risinājums kvalitatīvai dzīvošanai",
				galleryAriaLabel: "Projekta galerija",
				features: [
					{
						icon: "structure",
						title: "Konstrukcija",
						body: "Monolīts betona karkass ar ķieģeļu aizpildījumu, atjaunotu fasādi un sakārtotu kopējo inženierinfrastruktūru."
					},
					{
						icon: "energy",
						title: "Energoefektivitāte",
						body: "Energo klase A ar pārdomātiem risinājumiem ikdienas uzturēšanas izmaksu samazināšanai."
					},
					{
						icon: "finish",
						title: "Apdare",
						body: "Pilna apdare ar kvalitatīviem materiāliem, LED apgaismojumu un tumša metāla akcentiem koplietošanas zonās."
					},
					{
						icon: "parking",
						title: "Stāvvietas",
						body: "Bruģēts pagalms ar piebraucamo ceļu, personalizētām autostāvvietām un pārskatāmu teritorijas organizāciju."
					},
					{
						icon: "lift",
						title: "Lifts",
						body: "Modernizēts lifts katrā kāpņu telpā, pieejams visiem stāviem un pielāgots ērtai ikdienas kustībai."
					},
					{
						icon: "location",
						title: "Atrašanās vieta",
						body: "Centrāla atrašanās vieta Ventspilī ar ātru piekļuvi centram, skolām, pakalpojumiem un sabiedriskajam transportam."
					}
				],
				gallery: [
					{
						image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80",
						thumb: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=320&q=80",
						alt: "Dzīvokļa interjers ar dabisko gaismu un minimālu apdari"
					},
					{
						image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=80",
						thumb: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=320&q=80",
						alt: "Virtuves un dzīvojamās zonas skats ar gaišu apdari"
					},
					{
						image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80",
						thumb: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=320&q=80",
						alt: "Dzīvojamā istaba ar augstiem logiem un neitrālu materiālu paleti"
					},
					{
						image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80&sat=-10",
						thumb: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=320&q=80&sat=-10",
						alt: "Kāpņu telpas fragments ar atjaunotu apdari un logiem"
					},
					{
						image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=80",
						thumb: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=320&q=80",
						alt: "Guļamistaba ar koka grīdu un lielu logu"
					},
					{
						image: "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1400&q=80",
						thumb: "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=320&q=80",
						alt: "Vannas istabas apdares fragments ar gaišiem materiāliem"
					}
				]
			},
			editorialGallery: {
				eyebrow: "Interjers",
				title: "Telpas, kurās gribas atgriezties",
				lead:
					"Katrs dzīvoklis veidots ar uzmanību detaļām — marmora grīda, LED apgaismojums, moderna vannas istaba.",
				rowAriaLabel: "Projekta attēlu galerija",
				images: [
					{
						image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
						alt: "Gaišs dzīvojamās zonas interjers ar logiem un neitrālu apdari",
						label: "Dzīvojamā zona",
						orientation: "landscape"
					},
					{
						image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
						alt: "Guļamistabas interjers ar koka grīdu un siltu dienasgaismu",
						label: "Guļamistaba",
						orientation: "portrait"
					},
					{
						image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
						alt: "Dzīvojamā istaba ar augstiem logiem un mierīgu materiālu paleti",
						label: "Interjera perspektīva",
						orientation: "portrait"
					},
					{
						image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1600&q=80",
						alt: "Virtuves un dzīvojamās zonas skats ar gaišām virsmām",
						label: "Virtuve un dzīvojamā zona",
						orientation: "landscape"
					},
					{
						image: "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1600&q=80",
						alt: "Vannas istabas apdare ar gaišiem materiāliem un tīrām līnijām",
						label: "Apdares detaļas",
						orientation: "landscape"
					},
					{
						image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80&sat=-12",
						alt: "Koplietošanas telpas fragments ar atjaunotu apdari un dienasgaismu",
						label: "Koplietošanas telpa",
						orientation: "portrait"
					}
				]
			},
			apartmentPlans: {
				eyebrow: "Dzīvokļu plāni",
				title: "Izvēlieties sev piemērotāko plānojumu",
				lead:
					"Divu un trīs istabu dzīvokļi ar pārdomātu zonējumu, pilnu apdari un skaidri nolasāmu telpu struktūru.",
				tabsAriaLabel: "Dzīvokļu plānu izvēle",
				specsAriaLabel: "Dzīvokļa specifikācija",
				plans: [
					{
						tabLabel: "2 istabas",
						title: "2 istabu dzīvoklis",
						price: "no €65 000",
						imageKey: "plan2room",
						imageAlt: "Divu istabu dzīvokļa plāns",
						ctaText: "Pieteikt apskati",
						ctaLink: "/contact",
						specs: [
							{ label: "Kopējā platība", value: "48.7 m²" },
							{ label: "Dzīvojamā istaba + virtuve", value: "23.8 m²" },
							{ label: "Guļamistaba", value: "12.4 m²" },
							{ label: "Vannas istaba", value: "4.6 m²" },
							{ label: "Priekštelpa", value: "7.9 m²" },
							{ label: "Apdare", value: "Pilna apdare" }
						]
					},
					{
						tabLabel: "3 istabas",
						title: "3 istabu dzīvoklis",
						price: "no €82 000",
						imageKey: "plan3room",
						imageAlt: "Trīs istabu dzīvokļa plāns",
						ctaText: "Saņemt piedāvājumu",
						ctaLink: "/contact",
						specs: [
							{ label: "Kopējā platība", value: "67.9 m²" },
							{ label: "Dzīvojamā istaba + virtuve", value: "27.6 m²" },
							{ label: "Guļamistaba", value: "13.4 m²" },
							{ label: "Otrā guļamistaba", value: "11.8 m²" },
							{ label: "Vannas istaba", value: "5.2 m²" },
							{ label: "Apdare", value: "Pilna apdare" }
						]
					}
				]
			}
		},
		pages: {
			properties: "Amberinvest | Dzīvokļu saraksts",
			propertyDetail: "Amberinvest | Dzīvokļa detaļas",
			aboutUs: "Amberinvest | Par mums",
			howToBuy: "Amberinvest | Kā iegādāties",
			faq: "Amberinvest | BUJ",
			contact: "Amberinvest | Kontakti"
		}
	}
};

export function getMessages(locale: Locale = "lv") {
	return translations[locale];
}
