import { useId, useState } from "react";

const initialValues = {
	firstName: "",
	lastName: "",
	phone: "+371",
	email: "",
	interest: "",
	consent: false
};

const interestOptions = [
	{ value: "", label: "Izvēlieties" },
	{ value: "2-istabu", label: "2 istabu dzīvoklis" },
	{ value: "3-istabu", label: "3 istabu dzīvoklis" },
	{ value: "apskate", label: "Pieteikt apskati" },
	{ value: "cits", label: "Cits jautājums" }
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values) {
	const errors = {};

	if (!values.firstName.trim()) errors.firstName = "Lūdzu, ievadiet vārdu.";
	if (!values.lastName.trim()) errors.lastName = "Lūdzu, ievadiet uzvārdu.";
	if (!values.phone.trim() || values.phone.trim() === "+371") {
		errors.phone = "Lūdzu, ievadiet telefona numuru.";
	}

	if (values.email.trim() && !emailPattern.test(values.email.trim())) {
		errors.email = "Lūdzu, ievadiet korektu e-pasta adresi.";
	}

	if (!values.consent) errors.consent = "Nepieciešama piekrišana personas datu apstrādei.";

	return errors;
}

export default function ContactForm({
	title = "Piesakiet konsultāciju",
	intro = "Aizpildiet formu, un mēs sazināsimies, lai vienotos par nākamo soli.",
	defaultInterest = "",
	submitLabel = "Nosūtīt pieprasījumu"
}) {
	const id = useId();
	const [values, setValues] = useState(() => ({
		...initialValues,
		interest: defaultInterest
	}));
	const [errors, setErrors] = useState({});
	const [status, setStatus] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleChange = (event) => {
		const { name, value, type, checked } = event.target;
		const nextValue = type === "checkbox" ? checked : value;

		setValues((current) => ({
			...current,
			[name]: nextValue
		}));

		setErrors((current) => {
			if (!current[name]) return current;
			const nextErrors = { ...current };
			delete nextErrors[name];
			return nextErrors;
		});
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setStatus(null);

		const nextErrors = validate(values);
		if (Object.keys(nextErrors).length) {
			setErrors(nextErrors);
			return;
		}

		setIsSubmitting(true);

		try {
			const response = await fetch("/api/contact", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					firstName: values.firstName.trim(),
					lastName: values.lastName.trim(),
					phone: values.phone.trim(),
					email: values.email.trim(),
					interest: values.interest,
					consent: values.consent
				})
			});

			const payload = await response.json().catch(() => null);

			if (!response.ok) {
				throw new Error(payload?.message || "Neizdevās nosūtīt pieprasījumu.");
			}

			setStatus({
				type: "success",
				message: payload?.message || "Paldies. Sazināsimies ar jums tuvākajā laikā."
			});
			setValues({
				...initialValues,
				interest: defaultInterest
			});
			setErrors({});
		} catch (error) {
			setStatus({
				type: "error",
				message: error instanceof Error ? error.message : "Radās kļūda. Mēģiniet vēlreiz."
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form className="contact-form" onSubmit={handleSubmit} noValidate>
			<div className="contact-form__header">
				<h3 className="contact-form__title">{title}</h3>
				<p className="contact-form__intro">{intro}</p>
			</div>

			<div className="contact-form__grid">
				<div className="contact-form__field">
					<label className="contact-form__label" htmlFor={`${id}-firstName`}>
						Vārds
					</label>
					<input
						className="contact-form__control"
						id={`${id}-firstName`}
						name="firstName"
						type="text"
						value={values.firstName}
						onChange={handleChange}
						aria-invalid={errors.firstName ? "true" : "false"}
						aria-describedby={errors.firstName ? `${id}-firstName-error` : undefined}
						autoComplete="given-name"
						required
					/>
					{errors.firstName ? (
						<p className="contact-form__error" id={`${id}-firstName-error`}>
							{errors.firstName}
						</p>
					) : null}
				</div>

				<div className="contact-form__field">
					<label className="contact-form__label" htmlFor={`${id}-lastName`}>
						Uzvārds
					</label>
					<input
						className="contact-form__control"
						id={`${id}-lastName`}
						name="lastName"
						type="text"
						value={values.lastName}
						onChange={handleChange}
						aria-invalid={errors.lastName ? "true" : "false"}
						aria-describedby={errors.lastName ? `${id}-lastName-error` : undefined}
						autoComplete="family-name"
						required
					/>
					{errors.lastName ? (
						<p className="contact-form__error" id={`${id}-lastName-error`}>
							{errors.lastName}
						</p>
					) : null}
				</div>

				<div className="contact-form__field">
					<label className="contact-form__label" htmlFor={`${id}-phone`}>
						Telefona numurs
					</label>
					<input
						className="contact-form__control"
						id={`${id}-phone`}
						name="phone"
						type="text"
						value={values.phone}
						onChange={handleChange}
						aria-invalid={errors.phone ? "true" : "false"}
						aria-describedby={errors.phone ? `${id}-phone-error` : undefined}
						autoComplete="tel"
						required
					/>
					{errors.phone ? (
						<p className="contact-form__error" id={`${id}-phone-error`}>
							{errors.phone}
						</p>
					) : null}
				</div>

				<div className="contact-form__field">
					<label className="contact-form__label" htmlFor={`${id}-email`}>
						E-pasts
					</label>
					<input
						className="contact-form__control"
						id={`${id}-email`}
						name="email"
						type="email"
						value={values.email}
						onChange={handleChange}
						aria-invalid={errors.email ? "true" : "false"}
						aria-describedby={errors.email ? `${id}-email-error` : undefined}
						autoComplete="email"
					/>
					{errors.email ? (
						<p className="contact-form__error" id={`${id}-email-error`}>
							{errors.email}
						</p>
					) : null}
				</div>

				<div className="contact-form__field contact-form__field--full">
					<label className="contact-form__label" htmlFor={`${id}-interest`}>
						Interese
					</label>
					<select
						className="contact-form__select"
						id={`${id}-interest`}
						name="interest"
						value={values.interest}
						onChange={handleChange}
					>
						{interestOptions.map((option) => (
							<option key={option.value || "placeholder"} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</div>

				<div className="contact-form__field contact-form__field--full">
					<div className="contact-form__checkbox">
						<input
							id={`${id}-consent`}
							name="consent"
							type="checkbox"
							checked={values.consent}
							onChange={handleChange}
							aria-invalid={errors.consent ? "true" : "false"}
							aria-describedby={errors.consent ? `${id}-consent-error` : undefined}
							required
						/>
						<label htmlFor={`${id}-consent`}>Piekrītu personas datu apstrādei</label>
					</div>
					{errors.consent ? (
						<p className="contact-form__error" id={`${id}-consent-error`}>
							{errors.consent}
						</p>
					) : null}
				</div>
			</div>

			{status ? (
				<p
					className={`contact-form__status contact-form__status--${status.type}`}
					role={status.type === "error" ? "alert" : "status"}
				>
					{status.message}
				</p>
			) : null}

			<button className="contact-form__submit" type="submit" disabled={isSubmitting}>
				{isSubmitting ? "Nosūtām..." : submitLabel}
			</button>
		</form>
	);
}
