import {
	getAllProperties,
	getPropertyCategories,
	getPropertyCategoryHref,
	getPropertyCategoryHrefForLocale,
	getPropertyHref,
} from "../sanity/properties";

const siteUrl = (import.meta.env.PUBLIC_SITE_URL ?? "https://amberhome.lv").replace(/\/+$/, "");

function absoluteUrl(path: string): string {
	return new URL(path, `${siteUrl}/`).toString();
}

function escapeXml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
}

function sitemapEntry(path: string): string {
	return `  <url><loc>${escapeXml(absoluteUrl(path))}</loc></url>`;
}

export async function GET() {
	const [properties, categories] = await Promise.all([getAllProperties(), getPropertyCategories()]);
	const staticPaths = [
		"/",
		"/dzīvokļi",
		"/par-eku",
		"/par-mums",
		"/kā-iegādāties",
		"/kontakti",
		"/en",
		"/en/apartments",
		"/en/about-the-building",
		"/en/about-us",
		"/en/how-to-buy",
		"/en/contact",
	];
	const categoryPaths = categories.flatMap((category) => [
		getPropertyCategoryHref(category),
		getPropertyCategoryHrefForLocale(category, "en"),
	]);
	const propertyPaths = properties.flatMap((property) => [
		getPropertyHref(property),
		getPropertyHref(property, "en"),
	]);
	const paths = [...new Set([...staticPaths, ...categoryPaths, ...propertyPaths])];
	const body = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
		...paths.map(sitemapEntry),
		"</urlset>",
		"",
	].join("\n");

	return new Response(body, {
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
		},
	});
}
