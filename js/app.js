/* =========================================================
   X2 SOCIAL HUB
   Main Application Controller
   Version: 1.0.0
========================================================= */

const X2Hub = {
    config: {
        siteName: "X2 SOCIAL HUB",
        version: "1.0.0"
    },

    /* -----------------------------------------------------
       TOAST NOTIFICATIONS
    ----------------------------------------------------- */

    toast(message, type = "info", duration = 3000) {
        const container = document.getElementById("toast-container");

        if (!container) {
            console.log(`[X2Hub ${type}] ${message}`);
            return;
        }

        const toast = document.createElement("div");

        toast.className = `toast toast-${type}`;
        toast.setAttribute("role", "status");
        toast.setAttribute("aria-live", "polite");

        const icons = {
            success: "✓",
            error: "✕",
            warning: "⚠",
            info: "ⓘ"
        };

        const icon = document.createElement("span");
        icon.className = "toast-icon";
        icon.textContent = icons[type] || icons.info;

        const text = document.createElement("span");
        text.className = "toast-message";
        text.textContent = message;

        toast.append(icon, text);
        container.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add("show");
        });

        window.setTimeout(() => {
            toast.classList.remove("show");

            window.setTimeout(() => {
                toast.remove();
            }, 300);
        }, duration);
    },

    /* -----------------------------------------------------
       GLOBAL MODAL
    ----------------------------------------------------- */

    openModal(content, options = {}) {
        const modal = document.getElementById("global-modal");
        const modalContent = document.getElementById("modal-content");

        if (!modal || !modalContent) {
            console.warn("Global modal elements were not found.");
            return;
        }

        modalContent.innerHTML = content;

        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");

        document.body.classList.add("modal-open");

        if (options.className) {
            modal.classList.add(options.className);
        }

        const closeButton = modal.querySelector(
            "[data-modal-close]"
        );

        if (closeButton) {
            closeButton.addEventListener(
                "click",
                X2Hub.closeModal,
                { once: true }
            );
        }
    },

    closeModal() {
        const modal = document.getElementById("global-modal");

        if (!modal) return;

        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");

        document.body.classList.remove("modal-open");

        const modalContent = document.getElementById("modal-content");

        if (modalContent) {
            window.setTimeout(() => {
                if (!modal.classList.contains("active")) {
                    modalContent.innerHTML = "";
                }
            }, 250);
        }
    },

    /* -----------------------------------------------------
       THEME PANEL
    ----------------------------------------------------- */

    openThemePanel() {
        const overlay = document.getElementById("theme-overlay");

        if (!overlay) return;

        overlay.classList.add("active");
        overlay.setAttribute("aria-hidden", "false");

        document.body.classList.add("theme-panel-open");
    },

    closeThemePanel() {
        const overlay = document.getElementById("theme-overlay");

        if (!overlay) return;

        overlay.classList.remove("active");
        overlay.setAttribute("aria-hidden", "true");

        document.body.classList.remove("theme-panel-open");
    },

    /* -----------------------------------------------------
       PAGE LOADER
    ----------------------------------------------------- */

    hidePageLoader() {
        const loader = document.querySelector(".page-loader");

        if (!loader) return;

        loader.classList.add("loaded");

        window.setTimeout(() => {
            loader.remove();
        }, 500);
    },

    /* -----------------------------------------------------
       FOOTER YEAR
    ----------------------------------------------------- */

    updateFooterYear() {
        document.querySelectorAll("[data-current-year]").forEach(
            element => {
                element.textContent = new Date().getFullYear();
            }
        );

        document.querySelectorAll(".current-year").forEach(
            element => {
                element.textContent = new Date().getFullYear();
            }
        );
    },

    /* -----------------------------------------------------
       SCROLL REVEAL
    ----------------------------------------------------- */

    initScrollReveal() {
        const elements = document.querySelectorAll(
            ".reveal, .reveal-up, .reveal-left, .reveal-right"
        );

        if (!elements.length) return;

        if (!("IntersectionObserver" in window)) {
            elements.forEach(element => {
                element.classList.add("visible", "revealed");
            });

            return;
        }

        const observer = new IntersectionObserver(
            (entries, currentObserver) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(
                            "visible",
                            "revealed"
                        );

                        currentObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }
        );

        elements.forEach(element => {
            observer.observe(element);
        });
    },

    /* -----------------------------------------------------
       GLOBAL EVENT LISTENERS
    ----------------------------------------------------- */

    initGlobalEvents() {

        // Close modal when clicking outside its content.
        document.addEventListener("click", event => {
            const modal = document.getElementById("global-modal");

            if (
                modal &&
                event.target === modal
            ) {
                X2Hub.closeModal();
            }
        });

        // Theme panel controls.
        document.addEventListener("click", event => {
            const openButton = event.target.closest(
                "[data-open-theme]"
            );

            const closeButton = event.target.closest(
                "[data-close-theme]"
            );

            if (openButton) {
                X2Hub.openThemePanel();
            }

            if (closeButton) {
                X2Hub.closeThemePanel();
            }
        });

        // Close theme panel when clicking its backdrop.
        const themeOverlay = document.getElementById("theme-overlay");

        if (themeOverlay) {
            themeOverlay.addEventListener("click", event => {
                if (event.target === themeOverlay) {
                    X2Hub.closeThemePanel();
                }
            });
        }

        // Escape key closes active overlays.
        document.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                X2Hub.closeModal();
                X2Hub.closeThemePanel();
            }
        });

        // Prevent empty placeholder links from jumping to the top.
        document.addEventListener("click", event => {
            const link = event.target.closest('a[href="#"]');

            if (link) {
                event.preventDefault();
            }
        });
    },

    /* -----------------------------------------------------
       MODULE LOADER
    ----------------------------------------------------- */

    async loadModule(path, initializer) {
        try {
            const module = await import(path);

            if (typeof module[initializer] === "function") {
                await module[initializer]();
            }

            return true;

        } catch (error) {
            console.info(
                `[X2Hub] Module pending or unavailable: ${path}`,
                error.message
            );

            return false;
        }
    },

    /* -----------------------------------------------------
       INITIALIZE WEBSITE MODULES
    ----------------------------------------------------- */

    async initModules() {

        const modules = [
            {
                path: "./themes.js",
                initializer: "initThemes"
            },
            {
                path: "./navigation.js",
                initializer: "initNavigation"
            },
            {
                path: "./profiles.js",
                initializer: "initProfiles"
            },
            {
                path: "./profile-view.js",
                initializer: "initProfileView"
            },
            {
                path: "./music-player.js",
                initializer: "initMusicPlayer"
            },
            {
                path: "./qr.js",
                initializer: "initQR"
            },
            {
                path: "./share.js",
                initializer: "initShare"
            },
            {
                path: "./contact.js",
                initializer: "initContact"
            }
        ];

        for (const module of modules) {
            await this.loadModule(
                module.path,
                module.initializer
            );
        }
    },

    /* -----------------------------------------------------
       MAIN INITIALIZATION
    ----------------------------------------------------- */

    async init() {

        if (this.initialized) return;

        this.initialized = true;

        console.log(
            `%c${this.config.siteName}`,
            "font-size:20px;font-weight:bold;color:#8b7cff;"
        );

        console.log(
            `Version ${this.config.version} initialized.`
        );

        this.updateFooterYear();

        this.initGlobalEvents();

        this.initScrollReveal();

        await this.initModules();

        this.hidePageLoader();

        document.documentElement.classList.add("app-ready");

        console.log("X2 SOCIAL HUB is ready.");
    }
};


/* =========================================================
   GLOBAL ACCESS
========================================================= */

window.X2Hub = X2Hub;


/* =========================================================
   START APPLICATION
========================================================= */

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        () => X2Hub.init(),
        { once: true }
    );

} else {

    X2Hub.init();

}