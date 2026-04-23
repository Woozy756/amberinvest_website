export const lvNumberFormatter = new Intl.NumberFormat("lv-LV");

export function formatCurrency(value: number, currency = "EUR"): string {
	return currency === "EUR"
		? `€${lvNumberFormatter.format(value)}`
		: `${lvNumberFormatter.format(value)} ${currency}`;
}

export function toPhoneHref(phone?: string): string | undefined {
	const trimmedPhone = phone?.trim();
	return trimmedPhone ? `tel:${trimmedPhone.replace(/[^\d+]/g, "")}` : undefined;
}

export function splitLines(value?: string): string[] {
	return (value ?? "")
		.split(/\r?\n/)
		.map((line) => line.trim())
		.filter(Boolean);
}
