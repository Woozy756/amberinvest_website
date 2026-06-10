import { useState } from "react";

import PropertyGalleryModal from "./PropertyGalleryModal";

const PLAN_MODAL_ZOOM = 2.35;
const SECOND_PLAN_MODAL_ZOOM = 4;

function Icon({ name }) {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
			{name === "previous" ? <path d="m15 6-6 6 6 6" /> : <path d="m9 6 6 6-6 6" />}
		</svg>
	);
}

export default function PropertyPlanGallery({
	images = [],
	fallbackImage,
	fallbackAlt,
	title,
	locale = "lv",
}) {
	const isEnglish = locale === "en";
	const normalizedImages =
		images.length > 0
			? images
			: fallbackImage
				? [{
						src: fallbackImage,
						zoomSrc: fallbackImage,
						alt: fallbackAlt || title,
						label: isEnglish ? "Floor plan" : "Plānojums",
					}]
				: [];
	const [activeIndex, setActiveIndex] = useState(0);
	const [isZoomOpen, setIsZoomOpen] = useState(false);
	const activeImage = normalizedImages[activeIndex] ?? normalizedImages[0];
	const hasMultipleImages = normalizedImages.length > 1;

	if (!activeImage) {
		return null;
	}

	const closeZoom = (selectedIndex = activeIndex) => {
		setActiveIndex(selectedIndex);
		setIsZoomOpen(false);
	};
	const showPreviousImage = () => {
		setActiveIndex((currentIndex) =>
			currentIndex === 0 ? normalizedImages.length - 1 : currentIndex - 1,
		);
	};
	const showNextImage = () => {
		setActiveIndex((currentIndex) =>
			currentIndex === normalizedImages.length - 1 ? 0 : currentIndex + 1,
		);
	};

	return (
		<div className="apartment-plans__viewer">
			<button
				className="apartment-plans__image-trigger"
				type="button"
				onClick={() => setIsZoomOpen(true)}
				aria-label={`${isEnglish ? "Enlarge floor plan image" : "Palielināt plānojuma attēlu"} ${activeIndex + 1}`}
			>
				<img
					className="apartment-plans__image"
					src={activeImage.src}
					srcSet={activeImage.srcSet}
					sizes="(min-width: 900px) 50vw, 100vw"
					alt={activeImage.alt || fallbackAlt || title}
					loading="lazy"
				/>
			</button>

			{hasMultipleImages ? (
				<div
					className="apartment-plans__switches"
					aria-label={`${title} ${isEnglish ? "floor plan image selection" : "plānojuma attēlu izvēle"}`}
				>
					<button
						className="apartment-plans__switch apartment-plans__switch--previous"
						type="button"
						onClick={showPreviousImage}
						aria-label={isEnglish ? "Previous floor plan image" : "Iepriekšējais plānojuma attēls"}
					>
						<Icon name="previous" />
					</button>
					<button
						className="apartment-plans__switch apartment-plans__switch--next"
						type="button"
						onClick={showNextImage}
						aria-label={isEnglish ? "Next floor plan image" : "Nākamais plānojuma attēls"}
					>
						<Icon name="next" />
					</button>
				</div>
			) : null}

			{isZoomOpen ? (
				<PropertyGalleryModal
					images={normalizedImages}
					activeIndex={activeIndex}
					onClose={closeZoom}
					title={title}
					labelFallback={isEnglish ? "Floor plan" : "Plānojums"}
					imageFit="contain"
					preserveAspectRatio
					locale={locale}
					enlargedZoom={(imageIndex) =>
						imageIndex === 1 ? SECOND_PLAN_MODAL_ZOOM : PLAN_MODAL_ZOOM
					}
				/>
			) : null}
		</div>
	);
}
