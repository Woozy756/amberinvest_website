import { useState } from "react";

import PropertyGalleryModal from "./PropertyGalleryModal";

export default function PropertyGallery({ images = [], title }) {
	const [activeIndex, setActiveIndex] = useState(0);
	const [isZoomOpen, setIsZoomOpen] = useState(false);
	const activeImage = images[activeIndex] ?? images[0];
	const hasMultipleImages = images.length > 1;

	if (!activeImage) {
		return null;
	}

	const thumbnailGapRem = 0.7;
	const thumbnailFitSize = `calc(${100 / images.length}% - ${
		(Math.max(images.length - 1, 0) * thumbnailGapRem) / images.length
	}rem)`;
	const closeZoom = (selectedIndex = activeIndex) => {
		setActiveIndex(selectedIndex);
		setIsZoomOpen(false);
	};
	const activeImageLabel = activeImage.label || "Foto galerija";

	return (
		<div
			className="property-gallery"
			style={{
				"--gallery-thumb-fit-size": thumbnailFitSize,
			}}
		>
			<div className="property-gallery__stage">
				<button
					className="property-gallery__zoom-trigger"
					type="button"
					onClick={() => setIsZoomOpen(true)}
					aria-label={`Palielināt attēlu ${activeIndex + 1}`}
				>
					<img
						className="property-gallery__image"
						src={activeImage.src}
						srcSet={activeImage.srcSet}
						sizes="(min-width: 1180px) 58vw, (min-width: 860px) 54vw, 100vw"
						alt={activeImage.alt || title}
						width="1600"
						height="1600"
						fetchPriority={activeIndex === 0 ? "high" : "auto"}
					/>
				</button>
				<div className="property-gallery__meta text-xs font-bold tracking-[0.14em] uppercase" aria-live="polite">
					<span>{activeImageLabel}</span>
					<strong>
						{activeIndex + 1} / {images.length}
					</strong>
				</div>
			</div>

			{hasMultipleImages ? (
				<div className="property-gallery__thumbs" role="list" aria-label={`${title} attēlu izvēle`}>
					{images.map((image, index) => (
						<button
							key={image.src}
							className="property-gallery__thumb"
							type="button"
							onClick={() => setActiveIndex(index)}
							aria-pressed={index === activeIndex}
							aria-label={`Rādīt attēlu ${index + 1}`}
						>
							<img src={image.thumbSrc || image.src} alt="" width="360" height="360" loading="lazy" />
						</button>
					))}
				</div>
			) : null}

			{isZoomOpen ? (
				<PropertyGalleryModal
					images={images}
					activeIndex={activeIndex}
					onClose={closeZoom}
					title={title}
				/>
			) : null}
		</div>
	);
}
