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

export default function PropertyGalleryModal({
	activeIndex,
	images = [],
	onClose,
	title,
	labelFallback = "Foto galerija",
	imageFit = "cover",
	preserveAspectRatio = false,
	enlargedZoom = ENLARGED_ZOOM,
	locale = "lv",
}) {
	const isEnglish = locale === "en";
	const [isMounted, setIsMounted] = useState(false);
	const [modalIndex, setModalIndex] = useState(activeIndex);
	const [zoomLevel, setZoomLevel] = useState(DEFAULT_ZOOM);
	const [zoomOrigin, setZoomOrigin] = useState({ x: "50%", y: "50%" });
	const [zoomPan, setZoomPan] = useState({ x: 0, y: 0 });
	const [turnDirection, setTurnDirection] = useState("next");
	const [loadedAspectRatios, setLoadedAspectRatios] = useState({});
	const [isMobileViewport, setIsMobileViewport] = useState(false);
	const modalRef = useRef(null);
	const closeButtonRef = useRef(null);
	const previousFocusRef = useRef(null);
	const swipeStartRef = useRef(null);
	const pointerDownPointRef = useRef(null);
	const panStartRef = useRef(null);
	const suppressImageClickRef = useRef(false);
	const hasMultipleImages = images.length > 1;
	const activeImage = images[modalIndex] ?? images[0];
	const previousImage = hasMultipleImages ? images[modalIndex === 0 ? images.length - 1 : modalIndex - 1] : null;
	const nextImage = hasMultipleImages ? images[modalIndex === images.length - 1 ? 0 : modalIndex + 1] : null;
	const activeImageLabel = activeImage?.label || labelFallback;
	const activeEnlargedZoom =
		typeof enlargedZoom === "function" ? enlargedZoom(modalIndex, activeImage) : enlargedZoom;
	const activeImageAspectRatio =
		preserveAspectRatio && activeImage?.width && activeImage?.height
			? activeImage.width / activeImage.height
			: loadedAspectRatios[activeImage?.zoomSrc || activeImage?.src] || 1;
	const canPanZoom = preserveAspectRatio && isMobileViewport && zoomLevel > DEFAULT_ZOOM;

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(max-width: 720px)");
		const updateViewportMode = () => {
			setIsMobileViewport(mediaQuery.matches);
		};

		updateViewportMode();
		mediaQuery.addEventListener("change", updateViewportMode);

		return () => {
			mediaQuery.removeEventListener("change", updateViewportMode);
		};
	}, []);

	const toggleZoom = () => {
		setZoomLevel((currentLevel) => {
			const nextLevel = currentLevel === DEFAULT_ZOOM ? activeEnlargedZoom : DEFAULT_ZOOM;

			if (nextLevel === DEFAULT_ZOOM) {
				setZoomPan({ x: 0, y: 0 });
			}

			return nextLevel;
		});
	};

	const closeModal = () => {
		onClose(modalIndex);
	};

	const selectImage = (nextIndex, direction) => {
		setTurnDirection(direction);
		setZoomLevel(DEFAULT_ZOOM);
		setZoomOrigin({ x: "50%", y: "50%" });
		setZoomPan({ x: 0, y: 0 });
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
		pointerDownPointRef.current = {
			x: event.clientX,
			y: event.clientY,
		};

		if (canPanZoom) {
			panStartRef.current = {
				x: event.clientX,
				y: event.clientY,
				panX: zoomPan.x,
				panY: zoomPan.y,
			};
			swipeStartRef.current = null;
			return;
		}

		swipeStartRef.current = {
			x: event.clientX,
			y: event.clientY,
		};
	};

	const handleImagePointerMove = (event) => {
		if (!panStartRef.current) {
			return;
		}

		stopModalClose(event);

		const deltaX = event.clientX - panStartRef.current.x;
		const deltaY = event.clientY - panStartRef.current.y;

		if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
			suppressImageClickRef.current = true;
		}

		setZoomPan({
			x: panStartRef.current.panX + deltaX,
			y: panStartRef.current.panY + deltaY,
		});
	};

	const handleImagePointerUp = (event) => {
		stopModalClose(event);

		if (panStartRef.current) {
			panStartRef.current = null;
			pointerDownPointRef.current = null;
			return;
		}

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
			pointerDownPointRef.current = null;
			return;
		}

		if (preserveAspectRatio && zoomLevel === DEFAULT_ZOOM) {
			const bounds = event.currentTarget.getBoundingClientRect();
			const pointerPoint = pointerDownPointRef.current ?? { x: event.clientX, y: event.clientY };
			const imageElement = event.currentTarget.querySelector(".property-gallery-modal__image");
			const clickAspectRatio =
				imageElement?.naturalWidth && imageElement?.naturalHeight
					? imageElement.naturalWidth / imageElement.naturalHeight
					: activeImageAspectRatio;
			const frameAspectRatio = bounds.width / bounds.height;
			const isLetterboxed = clickAspectRatio > frameAspectRatio;
			const renderedWidth = isLetterboxed ? bounds.width : bounds.height * clickAspectRatio;
			const renderedHeight = isLetterboxed ? bounds.width / clickAspectRatio : bounds.height;
			const renderedLeft = bounds.left + (bounds.width - renderedWidth) / 2;
			const renderedTop = bounds.top + (bounds.height - renderedHeight) / 2;
			const originX = ((pointerPoint.x - renderedLeft) / renderedWidth) * 100;
			const originY = ((pointerPoint.y - renderedTop) / renderedHeight) * 100;

			setZoomOrigin({
				x: `${Math.max(0, Math.min(100, originX))}%`,
				y: `${Math.max(0, Math.min(100, originY))}%`,
			});
		}

		pointerDownPointRef.current = null;
		toggleZoom();
	};

	const handleImageLoad = (event) => {
		if (!preserveAspectRatio || !activeImage) {
			return;
		}

		const { naturalWidth, naturalHeight } = event.currentTarget;

		if (!naturalWidth || !naturalHeight) {
			return;
		}

		const imageKey = activeImage.zoomSrc || activeImage.src;
		setLoadedAspectRatios((currentRatios) => ({
			...currentRatios,
			[imageKey]: naturalWidth / naturalHeight,
		}));
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
			className={`property-gallery-modal property-gallery-modal--${imageFit}${
				preserveAspectRatio ? " property-gallery-modal--natural" : ""
			}`}
			role="dialog"
			aria-modal="true"
			aria-label={`${title} ${isEnglish ? "image gallery" : "attēlu galerija"}`}
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
						aria-label={isEnglish ? "Close gallery" : "Aizvērt galeriju"}
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
							aria-label={isEnglish ? "Previous image" : "Iepriekšējais attēls"}
						>
							<Icon name="previous" />
						</button>
					) : null}

					<div
						className="property-gallery-modal__image-frame"
						data-zoomed={zoomLevel > DEFAULT_ZOOM}
						onClick={handleImageClick}
						onPointerCancel={() => {
							pointerDownPointRef.current = null;
							panStartRef.current = null;
							swipeStartRef.current = null;
						}}
						onPointerDown={handleImagePointerDown}
						onPointerMove={handleImagePointerMove}
						onPointerUp={handleImagePointerUp}
						style={{
							"--gallery-modal-aspect-ratio": activeImageAspectRatio,
						}}
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
								aria-label={isEnglish ? "Previous image" : "Iepriekšējais attēls"}
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
								aria-label={isEnglish ? "Next image" : "Nākamais attēls"}
							>
								<img src={nextImage.zoomSrc || nextImage.src} alt="" width="2400" height="2400" />
							</button>
						) : null}
						<button
							className="property-gallery-modal__image-button"
							type="button"
							aria-label={
								zoomLevel > DEFAULT_ZOOM
									? isEnglish ? "Zoom out" : "Samazināt attēlu"
									: isEnglish ? "Zoom in" : "Palielināt attēlu"
							}
						>
							<img
								key={`${activeImage.zoomSrc || activeImage.src}-${turnDirection}`}
								className="property-gallery-modal__image"
								data-turn-direction={turnDirection}
								src={activeImage.zoomSrc || activeImage.src}
								alt={activeImage.alt || title}
								width={activeImage.width || 2400}
								height={activeImage.height || 2400}
								onLoad={handleImageLoad}
								style={{
									"--gallery-modal-zoom": zoomLevel,
									"--gallery-modal-origin-x": zoomOrigin.x,
									"--gallery-modal-origin-y": zoomOrigin.y,
									"--gallery-modal-pan-x": `${zoomPan.x}px`,
									"--gallery-modal-pan-y": `${zoomPan.y}px`,
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
							aria-label={isEnglish ? "Next image" : "Nākamais attēls"}
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
