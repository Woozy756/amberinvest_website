const localizedRoutePrefixes = [
	["/properties/3-rooms", "/dzīvokļi/3-istabas"],
	["/properties/4-rooms", "/dzīvokļi/4-istabas"],
	["/properties/5-rooms", "/dzīvokļi/5-istabas"],
	["/properties", "/dzīvokļi"],
	["/how-to-buy", "/kā-iegādāties"],
	["/about-us", "/par-mums"],
	["/contact", "/kontakti"]
] as const;

const englishRoutePrefixes = [
	["/dzīvokļi/3-istabas", "/en/apartments/3-rooms"],
	["/dzīvokļi/4-istabas", "/en/apartments/4-rooms"],
	["/dzīvokļi/5-istabas", "/en/apartments/5-rooms"],
	["/properties/3-rooms", "/en/apartments/3-rooms"],
	["/properties/4-rooms", "/en/apartments/4-rooms"],
	["/properties/5-rooms", "/en/apartments/5-rooms"],
	["/dzīvokļi", "/en/apartments"],
	["/properties", "/en/apartments"],
	["/kā-iegādāties", "/en/how-to-buy"],
	["/how-to-buy", "/en/how-to-buy"],
	["/par-mums", "/en/about-us"],
	["/about-us", "/en/about-us"],
	["/par-eku", "/en/about-the-building"],
	["/kontakti", "/en/contact"],
	["/contact", "/en/contact"]
] as const;

const latvianRoutePrefixes = [
	["/en/apartments/3-rooms", "/dzīvokļi/3-istabas"],
	["/en/apartments/4-rooms", "/dzīvokļi/4-istabas"],
	["/en/apartments/5-rooms", "/dzīvokļi/5-istabas"],
	["/en/apartments", "/dzīvokļi"],
	["/en/how-to-buy", "/kā-iegādāties"],
	["/en/about-us", "/par-mums"],
	["/en/about-the-building", "/par-eku"],
	["/en/contact", "/kontakti"],
	["/en", "/"]
] as const;

function replaceRoutePrefix(
	pathname: string,
	prefixes: ReadonlyArray<readonly [string, string]>
): string {
	for (const [sourcePrefix, localizedPrefix] of prefixes) {
		if (pathname === sourcePrefix || pathname.startsWith(`${sourcePrefix}/`)) {
			return `${localizedPrefix}${pathname.slice(sourcePrefix.length)}`;
		}
	}

	return pathname;
}

export function localizeInternalHref(href: string, locale: "lv" | "en" = "lv"): string {
	const trimmedHref = href.trim();

	if (!trimmedHref.startsWith("/") || trimmedHref.startsWith("//")) {
		return trimmedHref;
	}

	const suffixIndex = trimmedHref.search(/[?#]/);
	const pathname = suffixIndex === -1 ? trimmedHref : trimmedHref.slice(0, suffixIndex);
	const suffix = suffixIndex === -1 ? "" : trimmedHref.slice(suffixIndex);
	const normalizedPathname = pathname === "/" ? pathname : pathname.replace(/\/+$/, "");

	if (locale === "en") {
		if (normalizedPathname === "/") {
			return `/en${suffix}`;
		}

		return `${replaceRoutePrefix(normalizedPathname, englishRoutePrefixes)}${suffix}`;
	}

	return `${replaceRoutePrefix(normalizedPathname, localizedRoutePrefixes)}${suffix}`;
}

export function getAlternateLocaleHref(pathname: string, targetLocale: "lv" | "en"): string {
	const normalizedPathname = pathname === "/" ? pathname : pathname.replace(/\/+$/, "");

	if (targetLocale === "en") {
		if (normalizedPathname === "/") return "/en";
		return replaceRoutePrefix(normalizedPathname, englishRoutePrefixes);
	}

	return replaceRoutePrefix(normalizedPathname, latvianRoutePrefixes);
}
