import nodemailer from "nodemailer";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const fallbackPort = 465;

const asBoolean = (value, fallback) => {
	if (value === undefined) return fallback;
	return value.toLowerCase() === "true";
};

function normalizeContactPayload(body) {
	const input = typeof body === "object" && body !== null ? body : {};

	return {
		firstName: typeof input.firstName === "string" ? input.firstName.trim() : "",
		lastName: typeof input.lastName === "string" ? input.lastName.trim() : "",
		phone: typeof input.phone === "string" ? input.phone.trim() : "",
		email: typeof input.email === "string" ? input.email.trim() : "",
		information: typeof input.information === "string" ? input.information.trim() : "",
		sourceProject: typeof input.sourceProject === "string" ? input.sourceProject.trim() : "",
		sourceProperty: typeof input.sourceProperty === "string" ? input.sourceProperty.trim() : "",
		sourcePropertyCode: typeof input.sourcePropertyCode === "string" ? input.sourcePropertyCode.trim() : "",
		sourceUrl: typeof input.sourceUrl === "string" ? input.sourceUrl.trim() : "",
		consent: input.consent === true
	};
}

export function validateContactPayload(body) {
	const payload = normalizeContactPayload(body);

	if (!payload.firstName || !payload.lastName || !payload.phone || payload.phone === "+371") {
		return {
			ok: false,
			message: "Lūdzu, aizpildiet obligātos laukus."
		};
	}

	if (!payload.email) {
		return {
			ok: false,
			message: "E-pasta adrese ir obligāta."
		};
	}

	if (!emailPattern.test(payload.email)) {
		return {
			ok: false,
			message: "E-pasta adrese nav derīga."
		};
	}

	if (!payload.consent) {
		return {
			ok: false,
			message: "Nepieciešama piekrišana personas datu apstrādei."
		};
	}

	return {
		ok: true,
		payload
	};
}

function createTransporter() {
	const smtpHost = process.env.CONTACT_SMTP_HOST;
	const smtpPort = Number(process.env.CONTACT_SMTP_PORT ?? fallbackPort);
	const smtpSecure = asBoolean(process.env.CONTACT_SMTP_SECURE, true);
	const smtpUser = process.env.CONTACT_SMTP_USER;
	const smtpPass = process.env.CONTACT_SMTP_PASS;

	if (!smtpHost || !smtpUser || !smtpPass) {
		return null;
	}

	return nodemailer.createTransport({
		host: smtpHost,
		port: Number.isNaN(smtpPort) ? fallbackPort : smtpPort,
		secure: smtpSecure,
		auth: {
			user: smtpUser,
			pass: smtpPass
		}
	});
}

export async function sendContactEmail(payload) {
	const transporter = createTransporter();
	const toEmail = process.env.CONTACT_TO_EMAIL;
	const fromEmail = process.env.CONTACT_FROM_EMAIL ?? process.env.CONTACT_SMTP_USER;

	if (!transporter || !toEmail || !fromEmail) {
		throw new Error("Contact email is not configured.");
	}

	await transporter.sendMail({
		from: fromEmail,
		to: toEmail,
		replyTo: payload.email,
		subject: "Jauns pieprasījums no kontaktformas",
		text: [
			"Saņemts jauns pieprasījums no mājaslapas kontaktformas.",
			"",
			`Vārds: ${payload.firstName}`,
			`Uzvārds: ${payload.lastName}`,
			`Telefons: ${payload.phone}`,
			`E-pasts: ${payload.email}`,
			`Projekts: ${payload.sourceProject || "-"}`,
			`Dzīvoklis: ${payload.sourceProperty || "-"}`,
			`Dzīvokļa kods: ${payload.sourcePropertyCode || "-"}`,
			`Objekta saite: ${payload.sourceUrl || "-"}`,
			`Papildu informācija: ${payload.information || "-"}`
		].join("\n")
	});
}
