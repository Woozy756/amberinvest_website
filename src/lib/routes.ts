const localizedRoutePrefixes = [
	["/properties/3-rooms", "/dzīvokļi/3-istabas"],
	["/properties/4-rooms", "/dzīvokļi/4-istabas"],
	["/properties/5-rooms", "/dzīvokļi/5-istabas"],
	["/properties", "/dzīvokļi"],
	["/how-to-buy", "/kā-iegādāties"],
	["/about-us", "/par-mums"],
	["/contact", "/kontakti"]
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

export function localizeInternalHref(href: string): string {
	const trimmedHref = href.trim();

	if (!trimmedHref.startsWith("/") || trimmedHref.startsWith("//")) {
		return trimmedHref;
	}

	const suffixIndex = trimmedHref.search(/[?#]/);
	const pathname = suffixIndex === -1 ? trimmedHref : trimmedHref.slice(0, suffixIndex);
	const suffix = suffixIndex === -1 ? "" : trimmedHref.slice(suffixIndex);
	const normalizedPathname = pathname === "/" ? pathname : pathname.replace(/\/+$/, "");

	return `${replaceRoutePrefix(normalizedPathname, localizedRoutePrefixes)}${suffix}`;
}
