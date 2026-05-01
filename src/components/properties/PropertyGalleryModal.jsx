import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const DEFAULT_ZOOM = 1;
const ENLARGED_ZOOM = 1.65;
const FOCUSABLE_ELEMENTS =
	'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
const SWIPE_THRESHOLD = 46;

function Icon({ name }) {
	if (name === "close") {
		return (
			<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
				<path d="M6 6l12 12M18 6 6 18" />
			</svg>
		);
	}

	if (name === "previous") {
		return (
			<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
				<path d="m15 6-6 6 6 6" />
			</svg>
		);
	}

	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
			<path d="m9 6 6 6-6 6" />
		</svg>
	);
}

export default function PropertyGalleryModal({ activeIndex, images = [], onClose, title }) {
	const [isMounted, setIsMounted] = useState(false);
	const [modalIndex, setModalIndex] = useState(activeIndex);
	const [zoomLevel, setZoomLevel] = useState(DEFAULT_ZOOM);
	const [turnDirection, setTurnDirection] = useState("next");
	const modalRef = useRef(null);
	const closeButtonRef = useRef(null);
	const previousFocusRef = useRef(null);
	const swipeStartRef = useRef(null);
	const suppressImageClickRef = useRef(false);
	const hasMultipleImages = images.length > 1;
	const activeImage = images[modalIndex] ?? images[0];
	const previousImage = hasMultipleImages ? images[modalIndex === 0 ? images.length - 1 : modalIndex - 1] : null;
	const nextImage = hasMultipleImages ? images[modalIndex === images.length - 1 ? 0 : modalIndex + 1] : null;
	const activeImageLabel = activeImage?.label || "Foto galerija";

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const toggleZoom = () => {
		setZoomLevel((currentLevel) => (currentLevel === DEFAULT_ZOOM ? ENLARGED_ZOOM : DEFAULT_ZOOM));
	};

	const closeModal = () => {
		onClose(modalIndex);
	};

	const selectImage = (nextIndex, direction) => {
		setTurnDirection(direction);
		setZoomLevel(DEFAULT_ZOOM);
		setModalIndex(nextIndex);
	};

	const showPreviousImage = () => {
		selectImage(modalIndex === 0 ? images.length - 1 : modalIndex - 1, "previous");
	};

	const showNextImage = () => {
		selectImage(modalIndex === images.length - 1 ? 0 : modalIndex + 1, "next");
	};

	const stopModalClose = (event) => {
		event.stopPropagation();
	};

	const handleImagePointerDown = (event) => {
		stopModalClose(event);
		event.currentTarget.setPointerCapture?.(event.pointerId);
		swipeStartRef.current = {
			x: event.clientX,
			y: event.clientY,
		};
	};

	const handleImagePointerUp = (event) => {
		stopModalClose(event);

		if (!swipeStartRef.current || !hasMultipleImages) {
			swipeStartRef.current = null;
			return;
		}

		const deltaX = event.clientX - swipeStartRef.current.x;
		const deltaY = event.clientY - swipeStartRef.current.y;
		swipeStartRef.current = null;

		if (Math.abs(deltaX) < SWIPE_THRESHOLD || Math.abs(deltaX) < Math.abs(deltaY) * 1.25) {
			return;
		}

		suppressImageClickRef.current = true;

		if (deltaX > 0) {
			showPreviousImage();
		} else {
			showNextImage();
		}
	};

	const handleImageClick = (event) => {
		stopModalClose(event);

		if (suppressImageClickRef.current) {
			suppressImageClickRef.current = false;
			return;
		}

		toggleZoom();
	};

	useEffect(() => {
		const previousOverflow = document.body.style.overflow;
		previousFocusRef.current = document.activeElement;
		document.body.style.overflow = "hidden";
		closeButtonRef.current?.focus();

		return () => {
			document.body.style.overflow = previousOverflow;
			previousFocusRef.current?.focus?.();
		};
	}, []);

	useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.key === "Escape") {
				closeModal();
			}

			if (event.key === "ArrowLeft" && hasMultipleImages) {
				showPreviousImage();
			}

			if (event.key === "ArrowRight" && hasMultipleImages) {
				showNextImage();
			}

			if (event.key === "Tab") {
				const focusableElements = Array.from(modalRef.current?.querySelectorAll(FOCUSABLE_ELEMENTS) ?? []);
				const firstElement = focusableElements[0];
				const lastElement = focusableElements[focusableElements.length - 1];

				if (!firstElement || !lastElement) {
					return;
				}

				if (event.shiftKey && document.activeElement === firstElement) {
					event.preventDefault();
					lastElement.focus();
				}

				if (!event.shiftKey && document.activeElement === lastElement) {
					event.preventDefault();
					firstElement.focus();
				}
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [hasMultipleImages, images.length, modalIndex, onClose]);

	if (!activeImage || !isMounted) {
		return null;
	}

	return createPortal(
		<div
			ref={modalRef}
			className="property-gallery-modal"
			role="dialog"
			aria-modal="true"
			aria-label={`${title} attēlu galerija`}
			onClick={closeModal}
		>
			<div className="property-gallery-modal__shell">
				<div className="property-gallery-modal__toolbar">
					<p className="property-gallery-modal__meta text-xs font-bold tracking-[0.14em] uppercase">
						<span>{activeImageLabel}</span>
						<strong>
							{modalIndex + 1} / {images.length}
						</strong>
					</p>

					<button
						ref={closeButtonRef}
						className="property-gallery-modal__close"
						type="button"
						onClick={(event) => {
							stopModalClose(event);
							closeModal();
						}}
						aria-label="Aizvērt galeriju"
					>
						<Icon name="close" />
					</button>
				</div>

				<div
					className={`property-gallery-modal__stage${
						hasMultipleImages ? "" : " property-gallery-modal__stage--single"
					}`}
				>
					{hasMultipleImages ? (
						<button
							className="property-gallery-modal__switch property-gallery-modal__switch--previous"
							type="button"
							onClick={(event) => {
								stopModalClose(event);
								showPreviousImage();
							}}
							aria-label="Iepriekšējais attēls"
						>
							<Icon name="previous" />
						</button>
					) : null}

					<div
						className="property-gallery-modal__image-frame"
						data-zoomed={zoomLevel > DEFAULT_ZOOM}
						onClick={stopModalClose}
						onPointerCancel={() => {
							swipeStartRef.current = null;
						}}
						onPointerDown={handleImagePointerDown}
						onPointerUp={handleImagePointerUp}
					>
						{previousImage ? (
							<button
								className="property-gallery-modal__peek property-gallery-modal__peek--previous"
								type="button"
								onPointerDown={stopModalClose}
								onPointerUp={stopModalClose}
								onClick={(event) => {
									stopModalClose(event);
									showPreviousImage();
								}}
								aria-label="Iepriekšējais attēls"
							>
								<img src={previousImage.zoomSrc || previousImage.src} alt="" width="2400" height="2400" />
							</button>
						) : null}
						{nextImage ? (
							<button
								className="property-gallery-modal__peek property-gallery-modal__peek--next"
								type="button"
								onPointerDown={stopModalClose}
								onPointerUp={stopModalClose}
								onClick={(event) => {
									stopModalClose(event);
									showNextImage();
								}}
								aria-label="Nākamais attēls"
							>
								<img src={nextImage.zoomSrc || nextImage.src} alt="" width="2400" height="2400" />
							</button>
						) : null}
						<button
							className="property-gallery-modal__image-button"
							type="button"
							onClick={handleImageClick}
							aria-label={zoomLevel > DEFAULT_ZOOM ? "Samazināt attēlu" : "Palielināt attēlu"}
						>
							<img
								key={`${activeImage.zoomSrc || activeImage.src}-${turnDirection}`}
								className="property-gallery-modal__image"
								data-turn-direction={turnDirection}
								src={activeImage.zoomSrc || activeImage.src}
								alt={activeImage.alt || title}
								width="2400"
								height="2400"
								style={{
									"--gallery-modal-zoom": zoomLevel,
								}}
							/>
						</button>
					</div>

					{hasMultipleImages ? (
						<button
							className="property-gallery-modal__switch property-gallery-modal__switch--next"
							type="button"
							onClick={(event) => {
								stopModalClose(event);
								showNextImage();
							}}
							aria-label="Nākamais attēls"
						>
							<Icon name="next" />
						</button>
					) : null}
				</div>
			</div>
		</div>,
		document.body,
	);
}
