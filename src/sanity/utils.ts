export interface SanityAssetImage {
	asset?: {
		url?: string;
	};
}

export interface SanityImageField extends SanityAssetImage {
	alt?: string;
	label?: string;
}

export function trimValue(value?: string): string | undefined {
	const nextValue = value?.trim();
	return nextValue || undefined;
}

export function trimValueOrEmpty(value?: string): string {
	return trimValue(value) ?? "";
}

export function trimStringList(items?: string[]): string[] {
	return items?.map((item) => item.trim()).filter(Boolean) ?? [];
}

export function splitParagraphs(value?: string): string[] {
	return (value ?? "")
		.split(/\n{2,}|\r\n\r\n/)
		.map((paragraph) => paragraph.trim())
		.filter(Boolean);
}

export function mapParagraphField(value?: string) {
	const trimmedValue = trimValueOrEmpty(value);
	const paragraphs = splitParagraphs(trimmedValue);

	return {
		value: trimmedValue,
		paragraphs,
	};
}

export function mapAssetImage(
	image?: SanityAssetImage,
	options: {
		alt?: string;
		label?: string;
	},
) {
	const src = trimValue(image?.asset?.url);

	if (!src) {
		return undefined;
	}

	const alt = trimValue(options.alt) ?? trimValue(options.label) ?? "";
	const label = trimValue(options.label);

	return {
		src,
		alt,
		label,
	};
}
