/* =========================================================
   X2 SOCIAL HUB
   Individual Profile Controller
   Version: 1.0.0
========================================================= */

const X2ProfileView = {

    dataPath: "data/profiles.json",

    currentProfile: null,

    /* -----------------------------------------------------
       GET PROFILE ID
    ----------------------------------------------------- */

    getProfileId() {

        const params = new URLSearchParams(
            window.location.search
        );

        return params.get("id") || "x2-rohuuu-baghel";
    },

    /* -----------------------------------------------------
       LOAD PROFILE DATABASE
    ----------------------------------------------------- */

    async loadProfile() {

        try {

            const response = await fetch(this.dataPath);

            if (!response.ok) {
                throw new Error(
                    `Database request failed: ${response.status}`
                );
            }

            const data = await response.json();

            const profileId = this.getProfileId();

            const profile = data.profiles.find(item =>
                item.id === profileId ||
                item.slug === profileId
            );

            if (!profile || profile.active === false) {
                throw new Error("Profile not found.");
            }

            this.currentProfile = profile;

            return profile;

        } catch (error) {

            console.error(
                "[X2ProfileView]",
                error
            );

            this.showNotFound();

            return null;
        }
    },

    /* -----------------------------------------------------
       UPDATE TEXT ELEMENT
    ----------------------------------------------------- */

    setText(selectors, value) {

        const element = document.querySelector(selectors);

        if (!element) return;

        element.textContent = value || "";
    },

    /* -----------------------------------------------------
       UPDATE IMAGE
    ----------------------------------------------------- */

    setImage(selectors, source, fallback, alt) {

        const element = document.querySelector(selectors);

        if (!element) return;

        element.src = source || fallback;

        element.alt = alt || "Profile image";

        element.onerror = () => {

            element.onerror = null;

            if (fallback) {
                element.src = fallback;
            }
        };
    },

    /* -----------------------------------------------------
       UPDATE LINK
    ----------------------------------------------------- */

    setLink(selectors, url) {

        const element = document.querySelector(selectors);

        if (!element) return;

        if (url) {
            element.href = url;
            element.hidden = false;
        } else {
            element.hidden = true;
        }
    },

    /* -----------------------------------------------------
       RENDER PROFILE INFORMATION
    ----------------------------------------------------- */

    renderProfile(profile) {

        if (!profile) return;

        document.title =
            `${profile.displayName} | X2 SOCIAL HUB`;

        this.setText(
            "#profile-name",
            profile.displayName || profile.fullName
        );

        this.setText(
            "#profile-full-name",
            profile.fullName
        );

        this.setText(
            "#profile-username",
            `@${(profile.username || "").replace(/^@/, "")}`
        );

        this.setText(
            "#profile-bio",
            profile.bio
        );

        this.setText(
            "#profile-category",
            profile.category
        );

        this.setText(
            "#profile-platform",
            profile.platform
        );

        this.setImage(
            "#profile-avatar",
            profile.avatar,
            "assets/images/default-avatar.png",
            `${profile.displayName} profile picture`
        );

        this.setImage(
            "#profile-qr-image",
            profile.qrImage,
            "",
            `${profile.displayName} Instagram QR code`
        );

        this.setLink(
            "#profile-instagram-link",
            profile.instagramUrl
        );

        this.setLink(
            "#profile-open-instagram",
            profile.instagramUrl
        );

        this.setLink(
            "#profile-whatsapp-link",
            profile.whatsapp
                ? `https://wa.me/${profile.whatsapp.replace(/\D/g, "")}`
                : ""
        );

        this.setLink(
            "#profile-email-link",
            profile.email
                ? `mailto:${profile.email}`
                : ""
        );

        document.querySelectorAll(
            "[data-profile-name]"
        ).forEach(element => {
            element.textContent = profile.displayName;
        });

        document.querySelectorAll(
            "[data-profile-username]"
        ).forEach(element => {
            element.textContent =
                `@${(profile.username || "").replace(/^@/, "")}`;
        });

        document.querySelectorAll(
            "[data-profile-bio]"
        ).forEach(element => {
            element.textContent = profile.bio || "";
        });

        document.body.dataset.profileId = profile.id;

        this.updateSocialActions(profile);
    },

    /* -----------------------------------------------------
       SOCIAL ACTIONS
    ----------------------------------------------------- */

    updateSocialActions(profile) {

        const instagramButtons = document.querySelectorAll(
            "[data-action='instagram']"
        );

        instagramButtons.forEach(button => {

            if (profile.instagramUrl) {
                button.href = profile.instagramUrl;
                button.target = "_blank";
                button.rel = "noopener noreferrer";
                button.hidden = false;
            } else {
                button.hidden = true;
            }
        });

        const copyButtons = document.querySelectorAll(
            "[data-action='copy-profile']"
        );

        copyButtons.forEach(button => {
            button.dataset.profileUrl = window.location.href;
        });
    },

    /* -----------------------------------------------------
       COPY PROFILE LINK
    ----------------------------------------------------- */

    async copyProfileLink() {

        try {

            await navigator.clipboard.writeText(
                window.location.href
            );

            if (window.X2Hub) {
                window.X2Hub.toast(
                    "Profile link copied!",
                    "success"
                );
            }

        } catch (error) {

            console.error(error);

            if (window.X2Hub) {
                window.X2Hub.toast(
                    "Unable to copy profile link.",
                    "error"
                );
            }
        }
    },

    /* -----------------------------------------------------
       SHARE PROFILE
    ----------------------------------------------------- */

    async shareProfile() {

        const profile = this.currentProfile;

        if (!profile) return;

        const shareData = {
            title: profile.displayName,
            text: `Connect with ${profile.displayName} on X2 SOCIAL HUB.`,
            url: window.location.href
        };

        try {

            if (navigator.share) {

                await navigator.share(shareData);

            } else {

                await navigator.clipboard.writeText(
                    window.location.href
                );

                if (window.X2Hub) {
                    window.X2Hub.toast(
                        "Profile link copied for sharing.",
                        "success"
                    );
                }
            }

        } catch (error) {

            if (error.name !== "AbortError") {
                console.error("Share failed:", error);
            }
        }
    },

    /* -----------------------------------------------------
       QR MODAL
    ----------------------------------------------------- */

    openQRModal() {

        const profile = this.currentProfile;

        if (!profile || !profile.qrImage) {

            if (window.X2Hub) {
                window.X2Hub.toast(
                    "QR image is not available yet.",
                    "warning"
                );
            }

            return;
        }

        const modalContent = `
            <div class="qr-modal-content">
                <button
                    type="button"
                    class="qr-modal-close"
                    data-modal-close
                    aria-label="Close QR code"
                >×</button>

                <h2>${this.escapeHTML(profile.displayName)}</h2>

                <p>Scan to connect on Instagram</p>

                <img
                    src="${this.escapeHTML(profile.qrImage)}"
                    alt="Instagram QR code"
                    class="qr-modal-image"
                >

                <p>
                    @${this.escapeHTML(
                        (profile.username || "").replace(/^@/, "")
                    )}
                </p>

                <a
                    href="${this.escapeHTML(profile.qrImage)}"
                    download
                    class="btn btn-primary"
                >
                    Download QR Code
                </a>
            </div>
        `;

        if (window.X2Hub) {
            window.X2Hub.openModal(modalContent);
        }
    },

    /* -----------------------------------------------------
       HTML ESCAPING
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
       PROFILE NOT FOUND
    ----------------------------------------------------- */

    showNotFound() {

        const main = document.querySelector(
            "main"
        );

        if (!main) return;

        main.innerHTML = `
            <section class="profile-not-found glass-panel">
                <h1>Profile Not Found</h1>

                <p>
                    This profile may have been removed
                    or the link may be incorrect.
                </p>

                <a href="profiles.html" class="btn btn-primary">
                    Explore Profiles
                </a>
            </section>
        `;
    },

    /* -----------------------------------------------------
       EVENT LISTENERS
    ----------------------------------------------------- */

    initEvents() {

        document.addEventListener("click", event => {

            const qrButton = event.target.closest(
                "[data-action='show-qr'], #show-qr"
            );

            if (qrButton) {
                event.preventDefault();
                this.openQRModal();
                return;
            }

            const copyButton = event.target.closest(
                "[data-action='copy-profile'], #copy-profile-link"
            );

            if (copyButton) {
                event.preventDefault();
                this.copyProfileLink();
                return;
            }

            const shareButton = event.target.closest(
                "[data-action='share-profile'], #share-profile"
            );

            if (shareButton) {
                event.preventDefault();
                this.shareProfile();
            }
        });
    },

    /* -----------------------------------------------------
       INITIALIZE
    ----------------------------------------------------- */

    async init() {

        this.initEvents();

        const profile = await this.loadProfile();

        if (!profile) return;

        this.renderProfile(profile);

        console.log(
            `[X2ProfileView] Loaded ${profile.displayName}.`
        );
    }

};


/* =========================================================
   GLOBAL ACCESS
========================================================= */

window.X2ProfileView = X2ProfileView;


/* =========================================================
   MODULE INITIALIZER
========================================================= */

export async function initProfileView() {

    await X2ProfileView.init();

}