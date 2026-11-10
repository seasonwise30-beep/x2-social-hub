/* =========================================================
   X2 SOCIAL HUB
   Universal Sharing Controller
   Version: 1.0.0
========================================================= */

const X2Share = {

    /* -----------------------------------------------------
       GET SHARE INFORMATION
    ----------------------------------------------------- */

    getShareData() {

        const profile = window.X2ProfileView?.currentProfile;

        if (profile) {
            return {
                title: profile.displayName || "X2 SOCIAL HUB",
                text: `Connect with ${profile.displayName} on Instagram through X2 SOCIAL HUB.`,
                url: window.location.href
            };
        }

        return {
            title: "X2 SOCIAL HUB",
            text: "Discover profiles and connect with the X2 community.",
            url: window.location.href
        };
    },

    /* -----------------------------------------------------
       NATIVE SHARE
    ----------------------------------------------------- */

    async nativeShare() {

        const data = this.getShareData();

        if (!navigator.share) {
            return this.copyLink();
        }

        try {

            await navigator.share({
                title: data.title,
                text: data.text,
                url: data.url
            });

            return true;

        } catch (error) {

            if (error.name !== "AbortError") {
                console.error("[X2Share] Native share failed:", error);

                return this.copyLink();
            }

            return false;
        }
    },

    /* -----------------------------------------------------
       COPY LINK
    ----------------------------------------------------- */

    async copyLink(url = window.location.href) {

        try {

            if (navigator.clipboard && window.isSecureContext) {

                await navigator.clipboard.writeText(url);

            } else {

                const textarea = document.createElement("textarea");

                textarea.value = url;

                textarea.style.position = "fixed";
                textarea.style.opacity = "0";

                document.body.appendChild(textarea);

                textarea.select();

                const copied = document.execCommand("copy");

                textarea.remove();

                if (!copied) {
                    throw new Error("Clipboard copy failed.");
                }
            }

            this.notify("Link copied successfully!", "success");

            return true;

        } catch (error) {

            console.error("[X2Share] Copy failed:", error);

            this.notify(
                "Unable to copy link. Please copy it manually.",
                "error"
            );

            return false;
        }
    },

    /* -----------------------------------------------------
       SHARE THROUGH WHATSAPP
    ----------------------------------------------------- */

    shareWhatsApp() {

        const data = this.getShareData();

        const message = `${data.text}\n${data.url}`;

        const url =
            `https://wa.me/?text=${encodeURIComponent(message)}`;

        window.open(url, "_blank", "noopener,noreferrer");
    },

    /* -----------------------------------------------------
       SHARE THROUGH FACEBOOK
    ----------------------------------------------------- */

    shareFacebook() {

        const data = this.getShareData();

        const url =
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.url)}`;

        window.open(url, "_blank", "noopener,noreferrer");
    },

    /* -----------------------------------------------------
       SHARE THROUGH TELEGRAM
    ----------------------------------------------------- */

    shareTelegram() {

        const data = this.getShareData();

        const url =
            `https://t.me/share/url?url=${encodeURIComponent(data.url)}&text=${encodeURIComponent(data.text)}`;

        window.open(url, "_blank", "noopener,noreferrer");
    },

    /* -----------------------------------------------------
       SHARE THROUGH X
    ----------------------------------------------------- */

    shareX() {

        const data = this.getShareData();

        const url =
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(data.text)}&url=${encodeURIComponent(data.url)}`;

        window.open(url, "_blank", "noopener,noreferrer");
    },

    /* -----------------------------------------------------
       SHARE THROUGH EMAIL
    ----------------------------------------------------- */

    shareEmail() {

        const data = this.getShareData();

        const subject = encodeURIComponent(data.title);

        const body = encodeURIComponent(
            `${data.text}\n\n${data.url}`
        );

        window.location.href =
            `mailto:?subject=${subject}&body=${body}`;
    },

    /* -----------------------------------------------------
       SHARE PROFILE
    ----------------------------------------------------- */

    async shareProfile() {

        const profile = window.X2ProfileView?.currentProfile;

        if (!profile) {
            return this.nativeShare();
        }

        return this.nativeShare();
    },

    /* -----------------------------------------------------
       OPEN SHARE MENU
    ----------------------------------------------------- */

    openShareMenu() {

        const data = this.getShareData();

        const content = `
            <div class="share-modal-content">

                <button
                    type="button"
                    class="share-modal-close"
                    data-modal-close
                    aria-label="Close share menu"
                >×</button>

                <h2>Share ${this.escapeHTML(data.title)}</h2>

                <p>Share this link with your friends.</p>

                <div class="share-options">

                    <button data-share-platform="native">
                        Share
                    </button>

                    <button data-share-platform="whatsapp">
                        WhatsApp
                    </button>

                    <button data-share-platform="facebook">
                        Facebook
                    </button>

                    <button data-share-platform="telegram">
                        Telegram
                    </button>

                    <button data-share-platform="x">
                        X
                    </button>

                    <button data-share-platform="email">
                        Email
                    </button>

                    <button data-share-platform="copy">
                        Copy Link
                    </button>

                </div>

                <div class="share-link-box">
                    <input
                        type="text"
                        value="${this.escapeHTML(data.url)}"
                        readonly
                        aria-label="Shareable link"
                    >

                    <button data-share-platform="copy">
                        Copy
                    </button>
                </div>

            </div>
        `;

        if (window.X2Hub) {
            window.X2Hub.openModal(content);
        }
    },

    /* -----------------------------------------------------
       PLATFORM DISPATCHER
    ----------------------------------------------------- */

    async handlePlatform(platform) {

        switch (platform) {

            case "native":
                await this.nativeShare();
                break;

            case "whatsapp":
                this.shareWhatsApp();
                break;

            case "facebook":
                this.shareFacebook();
                break;

            case "telegram":
                this.shareTelegram();
                break;

            case "x":
            case "twitter":
                this.shareX();
                break;

            case "email":
                this.shareEmail();
                break;

            case "copy":
                await this.copyLink();
                break;

            default:
                console.warn(
                    `[X2Share] Unknown platform: ${platform}`
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

            const shareButton = event.target.closest(
                "[data-action='share'], #share-button, #share-profile"
            );

            if (shareButton) {

                event.preventDefault();

                this.openShareMenu();

                return;
            }

            const copyButton = event.target.closest(
                "[data-action='copy-link'], #copy-link"
            );

            if (copyButton) {

                event.preventDefault();

                this.copyLink();

                return;
            }

            const platformButton = event.target.closest(
                "[data-share-platform]"
            );

            if (platformButton) {

                event.preventDefault();

                this.handlePlatform(
                    platformButton.dataset.sharePlatform
                );
            }
        });
    },

    /* -----------------------------------------------------
       INITIALIZE
    ----------------------------------------------------- */

    init() {

        this.initEvents();

        console.log("[X2Share] Sharing system initialized.");

    }

};


/* =========================================================
   GLOBAL ACCESS
========================================================= */

window.X2Share = X2Share;


/* =========================================================
   MODULE INITIALIZER
========================================================= */

export function initShare() {

    X2Share.init();

}