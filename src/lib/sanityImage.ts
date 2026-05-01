interface SanityImageOptions {
	width?: number;
	height?: number;
	quality?: number;
	fit?: "crop" | "clip" | "max";
	aspectRatio?: number;
}

export function getSanityImageUrl(src: string, options: SanityImageOptions = {}): string {
	if (!src) {
		return "";
	}

	try {
		const url = new URL(src);

		if (!url.hostname.endsWith("cdn.sanity.io")) {
			return src;
		}

		if (options.width) {
			url.searchParams.set("w", String(options.width));
		}

		if (options.height) {
			url.searchParams.set("h", String(options.height));
		}

		if (options.fit) {
			url.searchParams.set("fit", options.fit);
		}

		if (options.quality) {
			url.searchParams.set("q", String(options.quality));
		}

		url.searchParams.set("auto", "format");
		url.searchParams.set("fm", "webp");

		return url.toString();
	} catch {
		return src;
	}
}

export function getSanityImageSrcSet(
	src: string,
	widths: number[],
	options: Omit<SanityImageOptions, "width" | "height"> = {},
): string {
	return widths
		.map((width) => {
			const height = options.aspectRatio ? Math.round(width / options.aspectRatio) : undefined;

			return `${getSanityImageUrl(src, {...options, width, height})} ${width}w`;
		})
		.join(", ");
}
