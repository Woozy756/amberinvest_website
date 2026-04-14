import type { APIRoute } from "astro";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: APIRoute = async ({ request }) => {
	try {
		const body = await request.json();
		const firstName = typeof body?.firstName === "string" ? body.firstName.trim() : "";
		const lastName = typeof body?.lastName === "string" ? body.lastName.trim() : "";
		const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
		const email = typeof body?.email === "string" ? body.email.trim() : "";
		const interest = typeof body?.interest === "string" ? body.interest.trim() : "";
		const consent = body?.consent === true;

		if (!firstName || !lastName || !phone || phone === "+371") {
			return new Response(
				JSON.stringify({
					message: "Lūdzu, aizpildiet obligātos laukus."
				}),
				{
					status: 400,
					headers: { "Content-Type": "application/json" }
				}
			);
		}

		if (email && !emailPattern.test(email)) {
			return new Response(
				JSON.stringify({
					message: "E-pasta adrese nav derīga."
				}),
				{
					status: 400,
					headers: { "Content-Type": "application/json" }
				}
			);
		}

		if (!consent) {
			return new Response(
				JSON.stringify({
					message: "Nepieciešama piekrišana personas datu apstrādei."
				}),
				{
					status: 400,
					headers: { "Content-Type": "application/json" }
				}
			);
		}

		return new Response(
			JSON.stringify({
				ok: true,
				message: "Paldies. Saņēmām jūsu pieprasījumu un sazināsimies 24 stundu laikā.",
				lead: {
					firstName,
					lastName,
					phone,
					email,
					interest
				}
			}),
			{
				status: 200,
				headers: { "Content-Type": "application/json" }
			}
		);
	} catch {
		return new Response(
			JSON.stringify({
				message: "Neizdevās apstrādāt pieprasījumu."
			}),
			{
				status: 400,
				headers: { "Content-Type": "application/json" }
			}
		);
	}
};
