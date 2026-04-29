import {
	getAllProperties,
	getPropertyCategories,
	getPropertyCategoryHref,
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
	const staticPaths = ["/", "/properties", "/about-us", "/how-to-buy", "/contact"];
	const categoryPaths = categories.map((category) => getPropertyCategoryHref(category));
	const propertyPaths = properties.map((property) => getPropertyHref(property));
	const paths = [...staticPaths, ...categoryPaths, ...propertyPaths];
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
