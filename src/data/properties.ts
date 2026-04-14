export const propertyCategories = [
	{
		slug: "divistabu",
		label: "2 istabu dzīvokļi",
		shortLabel: "2 istabu",
		description: "Kompakti, gaismas pilni plānojumi ikdienai un pārdomātam ieguldījumam."
	},
	{
		slug: "trisistabu",
		label: "3 istabu dzīvokļi",
		shortLabel: "3 istabu",
		description: "Sabalanots dzīves ritms ar vairāk vietas ģimenei, darbam un atpūtai."
	},
	{
		slug: "cetristabu",
		label: "4 istabu dzīvokļi",
		shortLabel: "4 istabu",
		description: "Plašāki dzīvokļi ar reprezentablu sajūtu, lielāku elastību un ģimenes komfortu."
	}
] as const;

export type PropertyCategorySlug = (typeof propertyCategories)[number]["slug"];

export type PropertyStatus = "available" | "reserved" | "sold";

export interface PropertyImage {
	src: string;
	alt: string;
}

export interface PropertyFloorPlan {
	image: string;
	alt: string;
	note: string;
}

export interface PropertyDetailItem {
	label: string;
	value: string;
}

export interface Property {
	id: string;
	title: string;
	slug: string;
	category: PropertyCategorySlug;
	rooms: number;
	area: number;
	price: number;
	status: PropertyStatus;
	floor: number;
	image: string;
	shortDescription: string;
	description: string;
	gallery: PropertyImage[];
	floorPlan: PropertyFloorPlan;
	details: PropertyDetailItem[];
}

export const propertyStatusMeta: Record<
	PropertyStatus,
	{ label: string; tone: "available" | "reserved" | "sold" }
> = {
	available: { label: "Pieejams", tone: "available" },
	reserved: { label: "Rezervēts", tone: "reserved" },
	sold: { label: "Pārdots", tone: "sold" }
};

const floorPlanImage = "/property-floor-plan.svg";

function createProperty({
	gallery,
	floorPlanNote,
	...property
}: Omit<Property, "image" | "floorPlan"> & { floorPlanNote: string }) {
	return {
		...property,
		image: gallery[0]?.src ?? "",
		gallery,
		floorPlan: {
			image: floorPlanImage,
			alt: `${property.title} plānojums`,
			note: floorPlanNote
		}
	} satisfies Property;
}

const properties: Property[] = [
	createProperty({
		id: "apt-a12",
		title: "2 istabu dzīvoklis A-12 ar rīta gaismu",
		slug: "divistabu-a12",
		category: "divistabu",
		rooms: 2,
		area: 48.7,
		price: 68400,
		status: "available",
		floor: 2,
		shortDescription: "Funkcionāls plānojums ar logiem uz iekšpagalma pusi un mierīgu, privātu noskaņu.",
		description:
			"Šis dzīvoklis apvieno kompakta plānojuma loģiku ar patīkami atvērtu dzīvojamo zonu. Dienas gaisma ienāk no rīta puses, radot vieglu un mierīgu atmosfēru, savukārt guļamistabas proporcijas ļauj saglabāt pilnvērtīgu privāto zonu gan ikdienai, gan ilgtermiņa ieguldījumam īres segmentā.",
		gallery: [
			{
				src: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80",
				alt: "Gaiša viesistaba ar koka grīdu un lieliem logiem"
			},
			{
				src: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=80",
				alt: "Virtuves un ēdamzonas skats modernā dzīvoklī"
			},
			{
				src: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80",
				alt: "Guļamistaba ar neitrālu, elegantu apdari"
			},
			{
				src: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=80",
				alt: "Kopējās dzīvojamās zonas interjers ar virtuvi"
			}
		],
		floorPlanNote:
			"Ieeja veidota ar skaidru garderobes nišu, dzīvojamā zona orientēta pret gaismu, bet guļamistaba atdalīta privātākam ritmam.",
		details: [
			{ label: "Istabu skaits", value: "2" },
			{ label: "Kopējā platība", value: "48.7 m²" },
			{ label: "Stāvs", value: "2. stāvs" },
			{ label: "Statuss", value: "Pieejams" },
			{ label: "Balkons / terase", value: "Franču balkons" },
			{ label: "Apkure", value: "Pilsētas centrālā ar individuāliem skaitītājiem" },
			{ label: "Ēkas tips", value: "Renovēta mūra ēka" },
			{ label: "Apdare", value: "Pilna iekšējā apdare, ozolkoka toņu grīdas" }
		]
	}),
	createProperty({
		id: "apt-b07",
		title: "2 istabu dzīvoklis B-07 ar balkonu",
		slug: "divistabu-b07",
		category: "divistabu",
		rooms: 2,
		area: 51.2,
		price: 72100,
		status: "reserved",
		floor: 3,
		shortDescription: "Dzīvoklis ar atvērtu dzīvojamo zonu, balkonu un saules gaismu lielāko dienas daļu.",
		description:
			"Atvērta plānojuma viesistaba un virtuve veido plašāku sajūtu nekā rāda kvadratūra, savukārt balkons darbojas kā papildus sezonāla telpa rīta kafijai vai vakara atelpai. Dzīvoklis ir piemērots pārim vai vienam iedzīvotājam, kuram būtiska ir gaisma, vienkārša ikdienas loģika un augstāks komforta līmenis.",
		gallery: [
			{
				src: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80",
				alt: "Dzīvokļa viesistaba ar izeju uz balkonu"
			},
			{
				src: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1400&q=80",
				alt: "Gaiša guļamistaba ar teksturētu sienu"
			},
			{
				src: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1400&q=80",
				alt: "Kompakta virtuve ar dabīgiem materiāliem"
			},
			{
				src: "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1400&q=80",
				alt: "Mājas fasādes un balkonu ritma skats"
			}
		],
		floorPlanNote:
			"Plānojums veidots ap centrālo dzīvojamo telpu ar tiešu izeju uz balkonu un kompakti organizētu privāto guļamistabu.",
		details: [
			{ label: "Istabu skaits", value: "2" },
			{ label: "Kopējā platība", value: "51.2 m²" },
			{ label: "Stāvs", value: "3. stāvs" },
			{ label: "Statuss", value: "Rezervēts" },
			{ label: "Balkons / terase", value: "Balkons 4.6 m²" },
			{ label: "Apkure", value: "Pilsētas centrālā ar regulējamiem radiatoriem" },
			{ label: "Ēkas tips", value: "Renovēta mūra ēka" },
			{ label: "Apdare", value: "Gaiša iekšējā apdare ar akmens masas flīzēm sanitārajā mezglā" }
		]
	}),
	createProperty({
		id: "apt-c03",
		title: "2 istabu dzīvoklis C-03 ar iekšpagalma skatu",
		slug: "divistabu-c03",
		category: "divistabu",
		rooms: 2,
		area: 47.3,
		price: 66500,
		status: "available",
		floor: 1,
		shortDescription: "Pārdomāts pirmais stāvs ar augstāku privātuma sajūtu un vieglu piekļuvi teritorijai.",
		description:
			"Vērsts pret klusu iekšpagalmu, šis dzīvoklis piedāvā mierīgāku ikdienas ritmu un ērtu piekļuvi bez kompromisiem apdares kvalitātē. Tā ir laba izvēle gan pirmajam īpašumam, gan investoram, kas vēlas pieprasāmu, viegli izīrējamu formātu ar racionālu cenu.",
		gallery: [
			{
				src: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=80",
				alt: "Klusas noskaņas interjers ar gaismas ieplūdi no pagalma puses"
			},
			{
				src: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1400&q=80",
				alt: "Dzīvokļa virtuve ar vienkāršu un tīru apdari"
			},
			{
				src: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1400&q=80",
				alt: "Guļamistabas un garderobes zonas skats"
			},
			{
				src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80",
				alt: "Mājas ieejas un iekšpagalma fasādes skats"
			}
		],
		floorPlanNote:
			"Iekšpagalma orientācija un īss kustības ceļš starp dzīvojamo zonu, virtuvi un guļamistabu nodrošina praktisku ikdienas plūsmu.",
		details: [
			{ label: "Istabu skaits", value: "2" },
			{ label: "Kopējā platība", value: "47.3 m²" },
			{ label: "Stāvs", value: "1. stāvs" },
			{ label: "Statuss", value: "Pieejams" },
			{ label: "Balkons / terase", value: "Nav" },
			{ label: "Apkure", value: "Pilsētas centrālā ar individuālu uzskaiti" },
			{ label: "Ēkas tips", value: "Renovēta mūra ēka" },
			{ label: "Apdare", value: "Pilna apdare neitrālos toņos" }
		]
	}),
	createProperty({
		id: "apt-a21",
		title: "3 istabu dzīvoklis A-21 ar plašu viesistabu",
		slug: "trisistabu-a21",
		category: "trisistabu",
		rooms: 3,
		area: 66.8,
		price: 89200,
		status: "available",
		floor: 4,
		shortDescription: "Sabiedriskā zona apvieno virtuvi un atpūtas daļu, saglabājot skaidru telpas struktūru.",
		description:
			"Plašā centrālā viesistaba ir šī dzīvokļa kodols, ap kuru sakārtotas abas guļamistabas un ikdienas funkcijas. Proporcijas ļauj ērti uzņemt viesus, bet plānojums joprojām saglabā privātās zonas skaidri nodalītas, tāpēc īpašums ir piemērots ģimenei vai pāra dzīvei ar darba telpas vajadzību.",
		gallery: [
			{
				src: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=80",
				alt: "Plaša viesistaba ar ēdamzonu un virtuvi"
			},
			{
				src: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1400&q=80",
				alt: "Guļamistaba ar smalku tekstūru un mīkstu gaismu"
			},
			{
				src: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1400&q=80",
				alt: "Virtuves niša ar koka un akmens apdari"
			},
			{
				src: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1400&q=80",
				alt: "Daudzdzīvokļu ēkas fasāde ar plašiem logiem"
			}
		],
		floorPlanNote:
			"Sabiedriskā un privātā daļa šeit sadalīta ļoti skaidri, nodrošinot plašu centrālo telpu un divas pilnvērtīgas guļamistabas.",
		details: [
			{ label: "Istabu skaits", value: "3" },
			{ label: "Kopējā platība", value: "66.8 m²" },
			{ label: "Stāvs", value: "4. stāvs" },
			{ label: "Statuss", value: "Pieejams" },
			{ label: "Balkons / terase", value: "Lodžija 5.1 m²" },
			{ label: "Apkure", value: "Pilsētas centrālā ar siltuma rekuperācijas risinājumu" },
			{ label: "Ēkas tips", value: "Renovēta mūra ēka" },
			{ label: "Apdare", value: "Pilna apdare ar ozolkoka imitācijas grīdu un matētām virsmām" }
		]
	}),
	createProperty({
		id: "apt-b16",
		title: "3 istabu dzīvoklis B-16 ar dienvidu orientāciju",
		slug: "trisistabu-b16",
		category: "trisistabu",
		rooms: 3,
		area: 68.9,
		price: 91500,
		status: "reserved",
		floor: 5,
		shortDescription: "Vairāk dabiskās gaismas, lielāka master guļamistaba un līdzsvarots plānojums ģimenei.",
		description:
			"Dienvidu orientācija piešķir šim dzīvoklim siltāku un dinamiskāku dienas sajūtu. Plašāka galvenā guļamistaba, ergonomiska virtuve un pārdomāti logu risinājumi veido īpašumu, kas ir patīkams ilgstošai dzīvošanai un vienlaikus saglabā arī labu tālākpārdošanas potenciālu.",
		gallery: [
			{
				src: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1400&q=80",
				alt: "Gaiša guļamistaba ar dienvidu saules gaismu"
			},
			{
				src: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80",
				alt: "Dzīvojamā zona ar plašiem logiem un koka grīdām"
			},
			{
				src: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1400&q=80",
				alt: "Virtuve ar ilgtspējīgiem materiāliem"
			},
			{
				src: "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1400&q=80",
				alt: "Fasādes skats ar logu ritmu un detaļām"
			}
		],
		floorPlanNote:
			"Plānojums paredz plašāku master guļamistabu, atsevišķu bērnistabu vai kabinetu un atvērtu dzīvojamo telpu saules pusē.",
		details: [
			{ label: "Istabu skaits", value: "3" },
			{ label: "Kopējā platība", value: "68.9 m²" },
			{ label: "Stāvs", value: "5. stāvs" },
			{ label: "Statuss", value: "Rezervēts" },
			{ label: "Balkons / terase", value: "Balkons 6.2 m²" },
			{ label: "Apkure", value: "Pilsētas centrālā ar individuāli regulējamiem kontūriem" },
			{ label: "Ēkas tips", value: "Renovēta mūra ēka" },
			{ label: "Apdare", value: "Pilna apdare siltos, dabīgos toņos" }
		]
	}),
	createProperty({
		id: "apt-c10",
		title: "3 istabu dzīvoklis C-10 ar nišas virtuvi",
		slug: "trisistabu-c10",
		category: "trisistabu",
		rooms: 3,
		area: 64.5,
		price: 86800,
		status: "available",
		floor: 3,
		shortDescription: "Racionāls plānojums ar atdalītu virtuves zonu un komfortablu dzīvojamo telpu ikdienas ritmam.",
		description:
			"Šis dzīvoklis būs piemērots tiem, kuri novērtē funkcionāli atdalītas zonas, bet nevēlas zaudēt plašuma sajūtu. Virtuve ievietota nišā, atstājot dzīvojamo istabu vizuāli tīru un mierīgu, bet abas guļamistabas ļauj elastīgi plānot ģimenes vai darba dzīves vajadzības.",
		gallery: [
			{
				src: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1400&q=80",
				alt: "Dzīvokļa virtuve nišas plānojumā"
			},
			{
				src: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=80",
				alt: "Plaša dzīvojamā telpa ar ēdamzonu"
			},
			{
				src: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80",
				alt: "Guļamistabas interjers ar maigu dienasgaismu"
			},
			{
				src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80",
				alt: "Dzīvojamā nama ieejas zona un arhitektūra"
			}
		],
		floorPlanNote:
			"Kompakti organizētā virtuve atdala gatavošanas zonu no atpūtas daļas, saglabājot tīru, reprezentablu dzīvojamās telpas proporciju.",
		details: [
			{ label: "Istabu skaits", value: "3" },
			{ label: "Kopējā platība", value: "64.5 m²" },
			{ label: "Stāvs", value: "3. stāvs" },
			{ label: "Statuss", value: "Pieejams" },
			{ label: "Balkons / terase", value: "Franču balkons" },
			{ label: "Apkure", value: "Pilsētas centrālā ar digitālu patēriņa uzskaiti" },
			{ label: "Ēkas tips", value: "Renovēta mūra ēka" },
			{ label: "Apdare", value: "Pilna apdare ar gaišu sienu un koka akcentu paleti" }
		]
	}),
	createProperty({
		id: "apt-a31",
		title: "4 istabu dzīvoklis A-31 ar panorāmas logiem",
		slug: "cetristabu-a31",
		category: "cetristabu",
		rooms: 4,
		area: 91.4,
		price: 126000,
		status: "available",
		floor: 6,
		shortDescription: "Plaša ģimenes dzīves telpa ar izteiktu reprezentācijas sajūtu un panorāmas logiem.",
		description:
			"Panorāmas logi un izteikti atvērta dzīvojamā zona šim dzīvoklim piešķir arhitektoniski pārliecinošu sajūtu. Plānojums piemērots ģimenei, kas vēlas apvienot viesu uzņemšanu, pilnvērtīgu privāto zonu un ilgtermiņā vērtīgu īpašumu ar reprezentablu raksturu.",
		gallery: [
			{
				src: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1400&q=80",
				alt: "Plaša premium viesistaba ar panorāmas logiem"
			},
			{
				src: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80",
				alt: "Dzīvojamā telpa ar gaismu un dabīgu materiālu klātbūtni"
			},
			{
				src: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1400&q=80",
				alt: "Privātā guļamistaba ar iebūvēto skapju zonu"
			},
			{
				src: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1400&q=80",
				alt: "Arhitektoniski atturīga dzīvojamā nama fasāde"
			}
		],
		floorPlanNote:
			"Plašā dzīvojamā telpa izvietota stūra daļā ar panorāmas logiem, kamēr guļamistabu bloks saglabā neatkarīgu, mierīgu privāto zonu.",
		details: [
			{ label: "Istabu skaits", value: "4" },
			{ label: "Kopējā platība", value: "91.4 m²" },
			{ label: "Stāvs", value: "6. stāvs" },
			{ label: "Statuss", value: "Pieejams" },
			{ label: "Balkons / terase", value: "Terase 11.8 m²" },
			{ label: "Apkure", value: "Pilsētas centrālā ar komforta grīdas kontūriem vannas zonās" },
			{ label: "Ēkas tips", value: "Renovēta mūra ēka" },
			{ label: "Apdare", value: "Premium apdare ar dabīgā akmens un koka akcentiem" }
		]
	}),
	createProperty({
		id: "apt-b25",
		title: "4 istabu dzīvoklis B-25 ar divām vannasistabām",
		slug: "cetristabu-b25",
		category: "cetristabu",
		rooms: 4,
		area: 94.6,
		price: 132500,
		status: "sold",
		floor: 5,
		shortDescription: "Plašāks ģimenes formāts ar divām sanitārajām zonām un sakārtotu privāto spārnu.",
		description:
			"Divas vannasistabas un rūpīgi organizēts guļamistabu bloks padara šo dzīvokli ļoti ērtu ģimenes ikdienai. Tas piedāvā izteikti praktisku premium formātu ar pietiekamu reprezentācijas rezervi viesiem un mierīgu, atdalītu privāto dzīves daļu.",
		gallery: [
			{
				src: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1400&q=80",
				alt: "Viesistaba ar plašu logu joslu"
			},
			{
				src: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1400&q=80",
				alt: "Guļamistaba un garderobes zona lielākā dzīvoklī"
			},
			{
				src: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1400&q=80",
				alt: "Mierīga guļamistabas atmosfēra ar dabisko apgaismojumu"
			},
			{
				src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80",
				alt: "Eksterjera skats ar koptu apkārtni"
			}
		],
		floorPlanNote:
			"Divu vannasistabu novietojums ļauj skaidri sadalīt viesu un ģimenes lietojumu, vienlaikus saglabājot reprezentablu dzīvojamo centru.",
		details: [
			{ label: "Istabu skaits", value: "4" },
			{ label: "Kopējā platība", value: "94.6 m²" },
			{ label: "Stāvs", value: "5. stāvs" },
			{ label: "Statuss", value: "Pārdots" },
			{ label: "Balkons / terase", value: "Balkons 8.4 m²" },
			{ label: "Apkure", value: "Pilsētas centrālā ar individuāliem skaitītājiem" },
			{ label: "Ēkas tips", value: "Renovēta mūra ēka" },
			{ label: "Apdare", value: "Premium apdare ar akmens masas flīzēm un matētām furnitūrām" }
		]
	}),
	createProperty({
		id: "apt-c22",
		title: "4 istabu dzīvoklis C-22 ar stūra viesistabu",
		slug: "cetristabu-c22",
		category: "cetristabu",
		rooms: 4,
		area: 92.7,
		price: 129800,
		status: "reserved",
		floor: 4,
		shortDescription: "Stūra novietojums ar plašāku skata leņķi, lielāku gaismas daudzumu un mierīgu atmosfēru.",
		description:
			"Stūra viesistaba piešķir īpašumam papildus gaismu un telpisku dziļumu, bet trīs atsevišķas guļamistabas ļauj īpašumu pielāgot dažādām ģimenes struktūrām. Tas ir dzīvoklis ar līdzsvaru starp reprezentatīvu sajūtu, ikdienas ērtumu un ilgtermiņa vērtību.",
		gallery: [
			{
				src: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80",
				alt: "Dzīvojamā zona ar plašu gaismas ieplūdi"
			},
			{
				src: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1400&q=80",
				alt: "Virtuves un ēdamzonas skats ar strukturētu kompozīciju"
			},
			{
				src: "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1400&q=80",
				alt: "Stūra dzīvokļa fasādes un logu skats"
			},
			{
				src: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1400&q=80",
				alt: "Dzīvojamās mājas eksterjers ar arhitektūras detaļām"
			}
		],
		floorPlanNote:
			"Stūra dzīvojamā telpa un trīs atsevišķas guļamistabas rada elastīgu plānojumu ar izteiktu gaismas kvalitāti.",
		details: [
			{ label: "Istabu skaits", value: "4" },
			{ label: "Kopējā platība", value: "92.7 m²" },
			{ label: "Stāvs", value: "4. stāvs" },
			{ label: "Statuss", value: "Rezervēts" },
			{ label: "Balkons / terase", value: "Lodžija 7.3 m²" },
			{ label: "Apkure", value: "Pilsētas centrālā ar digitāli vadāmu regulāciju" },
			{ label: "Ēkas tips", value: "Renovēta mūra ēka" },
			{ label: "Apdare", value: "Pilna apdare ar siltiem ozola un smilškrāsas toņiem" }
		]
	})
];

export function getAllProperties() {
	return [...properties];
}

export function getFeaturedProperties(limit = 6) {
	return properties.slice(0, limit);
}

export function getPropertyCategories() {
	return [...propertyCategories];
}

export function getPropertiesByCategory(category: PropertyCategorySlug) {
	return properties.filter((property) => property.category === category);
}

export function getPropertyBySlug(slug: string) {
	return properties.find((property) => property.slug === slug);
}

export function getCategoryBySlug(categorySlug: string) {
	return propertyCategories.find((category) => category.slug === categorySlug);
}

export function getPropertyCountByCategory(category: PropertyCategorySlug) {
	return properties.filter((property) => property.category === category).length;
}

export function getSimilarProperties(slug: string, limit = 3) {
	const currentProperty = getPropertyBySlug(slug);

	if (!currentProperty) {
		return [];
	}

	const sortByRelevance = (a: Property, b: Property) => {
		const statusWeight = (property: Property) => (property.status === "available" ? 0 : property.status === "reserved" ? 1 : 2);
		const statusDifference = statusWeight(a) - statusWeight(b);

		if (statusDifference !== 0) {
			return statusDifference;
		}

		return Math.abs(a.price - currentProperty.price) - Math.abs(b.price - currentProperty.price);
	};

	const sameCategory = properties
		.filter((property) => property.slug !== slug && property.category === currentProperty.category)
		.sort(sortByRelevance);

	const relatedFromOtherCategories = properties
		.filter((property) => property.slug !== slug && property.category !== currentProperty.category)
		.sort(sortByRelevance);

	return [...sameCategory, ...relatedFromOtherCategories].slice(0, limit);
}
