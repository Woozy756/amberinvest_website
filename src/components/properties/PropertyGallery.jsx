import { useState } from "react";

export default function PropertyGallery({ images = [], title }) {
	const [activeIndex, setActiveIndex] = useState(0);
	const activeImage = images[activeIndex] ?? images[0];

	if (!activeImage) {
		return null;
	}

	return (
		<div className="property-gallery">
			<div className="property-gallery__stage">
				<img
					className="property-gallery__image"
					src={activeImage.src}
					alt={activeImage.alt || title}
					width="1600"
					height="1120"
				/>
				<div className="property-gallery__meta text-xs font-bold tracking-[0.14em] uppercase" aria-live="polite">
					<span>Foto galerija</span>
					<strong>
						{activeIndex + 1} / {images.length}
					</strong>
				</div>
			</div>

			{images.length > 1 ? (
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
							<img src={image.src} alt="" width="360" height="260" />
						</button>
					))}
				</div>
			) : null}
		</div>
	);
}
