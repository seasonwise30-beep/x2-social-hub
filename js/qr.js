/* =========================================================
   X2 SOCIAL HUB
   QR Code Controller
   Version: 1.0.0
========================================================= */

const X2QR = {

    currentZoom: 1,

    minZoom: 1,

    maxZoom: 3,

    zoomStep: 0.25,

    /* -----------------------------------------------------
       GET QR IMAGE
    ----------------------------------------------------- */

    getQRImage() {

        const profile = window.X2ProfileView?.currentProfile;

        if (profile?.qrImage) {
            return profile.qrImage;
        }

        const image = document.getElementById(
            "profile-qr-image"
        );

        return image?.src || "";
    },

    /* -----------------------------------------------------
       GET INSTAGRAM URL
    ----------------------------------------------------- */

    getInstagramURL() {

        const profile = window.X2ProfileView?.currentProfile;

        return profile?.instagramUrl ||
            "https://www.instagram.com/x2.rohuuuu.baghel/";
    },

    /* -----------------------------------------------------
       OPEN QR MODAL
    ----------------------------------------------------- */

    openModal() {

        const imageURL = this.getQRImage();

        if (!imageURL) {

            this.notify(
                "QR image is not available.",
                "warning"
            );

            return;
        }

        this.currentZoom = 1;

        const content = `
            <div class="qr-modal-content">

                <button
                    type="button"
                    class="qr-modal-close"
                    data-modal-close
                    aria-label="Close QR modal"
                >×</button>

                <h2>Scan & Connect</h2>

                <p>
                    Scan this QR code to visit the Instagram profile.
                </p>

                <div class="qr-zoom-container">

                    <img
                        id="qr-zoom-image"
                        class="qr-modal-image"
                        src="${this.escapeHTML(imageURL)}"
                        alt="Original Instagram QR code"
                    >

                </div>

                <div class="qr-zoom-controls">

                    <button
                        type="button"
                        data-qr-zoom="out"
                        aria-label="Zoom out"
                    >−</button>

                    <button
                        type="button"
                        data-qr-zoom="reset"
                    >Reset</button>

                    <button
                        type="button"
                        data-qr-zoom="in"
                        aria-label="Zoom in"
                    >+</button>

                </div>

                <div class="qr-modal-actions">

                    <button
                        type="button"
                        class="btn btn-primary"
                        data-qr-download
                    >
                        Download QR
                    </button>

                    <button
                        type="button"
                        class="btn btn-secondary"
                        data-qr-share
                    >
                        Share QR
                    </button>

                    <a
                        href="${this.escapeHTML(this.getInstagramURL())}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="btn btn-secondary"
                    >
                        Open Instagram
                    </a>

                </div>

            </div>
        `;

        if (window.X2Hub) {
            window.X2Hub.openModal(content);
        }

        this.updateZoom();
    },

    /* -----------------------------------------------------
       ZOOM CONTROLS
    ----------------------------------------------------- */

    zoomIn() {

        this.currentZoom = Math.min(
            this.maxZoom,
            this.currentZoom + this.zoomStep
        );

        this.updateZoom();
    },

    zoomOut() {

        this.currentZoom = Math.max(
            this.minZoom,
            this.currentZoom - this.zoomStep
        );

        this.updateZoom();
    },

    resetZoom() {

        this.currentZoom = 1;

        this.updateZoom();
    },

    updateZoom() {

        const image = document.getElementById(
            "qr-zoom-image"
        );

        if (!image) return;

        image.style.transform =
            `scale(${this.currentZoom})`;
    },

    /* -----------------------------------------------------
       DOWNLOAD QR IMAGE
    ----------------------------------------------------- */

    async downloadQR() {

        const imageURL = this.getQRImage();

        if (!imageURL) {
            this.notify("QR image not found.", "error");
            return;
        }

        try {

            const response = await fetch(imageURL);

            if (!response.ok) {
                throw new Error("Unable to fetch QR image.");
            }

            const blob = await response.blob();

            const objectURL = URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = objectURL;

            link.download = "x2-rohuuu-instagram-qr.png";

            document.body.appendChild(link);

            link.click();

            link.remove();

            URL.revokeObjectURL(objectURL);

            this.notify(
                "QR code download started.",
                "success"
            );

        } catch (error) {

            console.error("[X2QR] Download failed:", error);

            // Fallback: open the original image.
            window.open(imageURL, "_blank", "noopener");

            this.notify(
                "Opening original QR image.",
                "info"
            );
        }
    },

    /* -----------------------------------------------------
       SHARE QR IMAGE
    ----------------------------------------------------- */

    async shareQR() {

        const imageURL = this.getQRImage();

        if (!imageURL) {
            this.notify("QR image not found.", "error");
            return;
        }

        try {

            const response = await fetch(imageURL);

            if (!response.ok) {
                throw new Error("QR image could not be loaded.");
            }

            const blob = await response.blob();

            const file = new File(
                [blob],
                "x2-rohuuu-instagram-qr.png",
                {
                    type: blob.type || "image/png"
                }
            );

            if (
                navigator.canShare &&
                navigator.canShare({ files: [file] })
            ) {

                await navigator.share({
                    title: "X2 SOCIAL HUB QR Code",
                    text: "Scan to connect with me on Instagram.",
                    files: [file]
                });

            } else {

                await navigator.clipboard.writeText(
                    this.getInstagramURL()
                );

                this.notify(
                    "Instagram profile link copied.",
                    "success"
                );
            }

        } catch (error) {

            if (error.name !== "AbortError") {

                console.error("[X2QR] Share failed:", error);

                this.notify(
                    "Unable to share QR code.",
                    "error"
                );
            }
        }
    },

    /* -----------------------------------------------------
       COPY INSTAGRAM LINK
    ----------------------------------------------------- */

    async copyInstagramLink() {

        try {

            await navigator.clipboard.writeText(
                this.getInstagramURL()
            );

            this.notify(
                "Instagram link copied!",
                "success"
            );

        } catch (error) {

            console.error(error);

            this.notify(
                "Unable to copy Instagram link.",
                "error"
            );
        }
    },

    /* -----------------------------------------------------
       NOTIFICATIONS
    ----------------------------------------------------- */

    notify(message, type = "info") {

        if (window.X2Hub) {
            window.X2Hub.toast(message, type);
        } else {
            console.log(message);
        }
    },

    /* -----------------------------------------------------
       ESCAPE HTML
    ----------------------------------------------------- */

    escapeHTML(value) {

        return String(value).replace(/[&<>"']/g, character => {

            const entities = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            };

            return entities[character];
        });
    },

    /* -----------------------------------------------------
       EVENT LISTENERS
    ----------------------------------------------------- */

    initEvents() {

        document.addEventListener("click", event => {

            const openButton = event.target.closest(
                "[data-action='show-qr'], #show-qr, #open-qr"
            );

            if (openButton) {

                event.preventDefault();

                this.openModal();

                return;
            }

            const zoomButton = event.target.closest(
                "[data-qr-zoom]"
            );

            if (zoomButton) {

                const action = zoomButton.dataset.qrZoom;

                if (action === "in") this.zoomIn();

                if (action === "out") this.zoomOut();

                if (action === "reset") this.resetZoom();

                return;
            }

            if (event.target.closest("[data-qr-download]")) {
                this.downloadQR();
                return;
            }

            if (event.target.closest("[data-qr-share]")) {
                this.shareQR();
                return;
            }

            if (event.target.closest("[data-qr-copy-link]")) {
                this.copyInstagramLink();
            }
        });

        document.addEventListener("wheel", event => {

            const image = event.target.closest(
                "#qr-zoom-image"
            );

            if (!image) return;

            if (event.deltaY < 0) {
                this.zoomIn();
            } else {
                this.zoomOut();
            }

        }, { passive: true });
    },

    /* -----------------------------------------------------
       INITIALIZE
    ----------------------------------------------------- */

    init() {

        this.initEvents();

        console.log("[X2QR] QR controller initialized.");

    }

};


/* =========================================================
   GLOBAL ACCESS
========================================================= */

window.X2QR = X2QR;


/* =========================================================
   MODULE INITIALIZER
========================================================= */

export function initQR() {

    X2QR.init();

}