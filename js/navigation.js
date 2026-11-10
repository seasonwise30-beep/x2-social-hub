/* =========================================================
   X2 SOCIAL HUB
   Navigation Controller
   Version: 1.0.0
========================================================= */

const X2Navigation = {

    /* -----------------------------------------------------
       ELEMENT SELECTORS
    ----------------------------------------------------- */

    selectors: {
        menuToggle: [
            "#menu-toggle",
            "#mobile-menu-toggle",
            "[data-menu-toggle]"
        ].join(","),

        mobileMenu: [
            "#mobile-menu",
            "#nav-menu",
            "[data-mobile-menu]"
        ].join(","),

        header: ".site-header, .main-header, header"
    },

    /* -----------------------------------------------------
       GET CURRENT PAGE
    ----------------------------------------------------- */

    getCurrentPage() {

        const pathname = window.location.pathname;

        const filename = pathname.split("/").pop();

        return filename || "index.html";
    },

    /* -----------------------------------------------------
       ACTIVE NAVIGATION
    ----------------------------------------------------- */

    setActiveNavigation() {

        const currentPage = this.getCurrentPage();

        document.querySelectorAll(
            ".nav-link, .mobile-nav-link, [data-nav-link]"
        ).forEach(link => {

            const href = link.getAttribute("href");

            if (!href || href.startsWith("#")) return;

            let linkPage;

            try {
                linkPage = new URL(
                    href,
                    window.location.href
                ).pathname.split("/").pop();
            } catch {
                return;
            }

            const isActive = linkPage === currentPage;

            link.classList.toggle("active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    },

    /* -----------------------------------------------------
       MOBILE MENU
    ----------------------------------------------------- */

    getMenuElements() {

        return {
            toggle: document.querySelector(
                this.selectors.menuToggle
            ),

            menu: document.querySelector(
                this.selectors.mobileMenu
            )
        };
    },

    openMenu() {

        const { toggle, menu } = this.getMenuElements();

        if (!menu) return;

        menu.classList.add("active", "open");

        menu.setAttribute("aria-hidden", "false");

        document.body.classList.add("mobile-menu-open");

        if (toggle) {
            toggle.classList.add("active");

            toggle.setAttribute("aria-expanded", "true");
        }
    },

    closeMenu() {

        const { toggle, menu } = this.getMenuElements();

        if (!menu) return;

        menu.classList.remove("active", "open");

        menu.setAttribute("aria-hidden", "true");

        document.body.classList.remove("mobile-menu-open");

        if (toggle) {
            toggle.classList.remove("active");

            toggle.setAttribute("aria-expanded", "false");
        }
    },

    toggleMenu() {

        const { menu } = this.getMenuElements();

        if (!menu) return;

        const isOpen =
            menu.classList.contains("active") ||
            menu.classList.contains("open");

        if (isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    },

    /* -----------------------------------------------------
       MENU EVENT LISTENERS
    ----------------------------------------------------- */

    initMenuEvents() {

        document.addEventListener("click", event => {

            const toggle = event.target.closest(
                this.selectors.menuToggle
            );

            if (toggle) {
                event.preventDefault();

                this.toggleMenu();

                return;
            }

            const menuLink = event.target.closest(
                ".mobile-nav-link, [data-mobile-link]"
            );

            if (menuLink) {
                this.closeMenu();
                return;
            }

            const { menu } = this.getMenuElements();

            if (
                menu &&
                menu.classList.contains("active") &&
                !menu.contains(event.target)
            ) {
                this.closeMenu();
            }
        });

        document.addEventListener("keydown", event => {

            if (event.key === "Escape") {
                this.closeMenu();
            }

            const { toggle } = this.getMenuElements();

            if (
                toggle &&
                (event.key === "Enter" || event.key === " ")
            ) {
                if (document.activeElement === toggle) {
                    event.preventDefault();

                    this.toggleMenu();
                }
            }
        });
    },

    /* -----------------------------------------------------
       SMOOTH SCROLL
    ----------------------------------------------------- */

    initSmoothScroll() {

        document.addEventListener("click", event => {

            const link = event.target.closest(
                'a[href^="#"]'
            );

            if (!link) return;

            const href = link.getAttribute("href");

            if (!href || href === "#") return;

            let target;

            try {
                target = document.querySelector(href);
            } catch {
                return;
            }

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches ? "auto" : "smooth",

                block: "start"
            });

            history.replaceState(
                null,
                "",
                href
            );

            this.closeMenu();
        });
    },

    /* -----------------------------------------------------
       HEADER SCROLL EFFECT
    ----------------------------------------------------- */

    initHeaderScroll() {

        const headers = document.querySelectorAll(
            this.selectors.header
        );

        if (!headers.length) return;

        let ticking = false;

        const updateHeader = () => {

            const isScrolled = window.scrollY > 30;

            headers.forEach(header => {
                header.classList.toggle(
                    "scrolled",
                    isScrolled
                );
            });

            ticking = false;
        };

        window.addEventListener(
            "scroll",
            () => {

                if (!ticking) {
                    window.requestAnimationFrame(updateHeader);

                    ticking = true;
                }

            },
            { passive: true }
        );

        updateHeader();
    },

    /* -----------------------------------------------------
       INITIALIZE
    ----------------------------------------------------- */

    init() {

        this.setActiveNavigation();

        this.initMenuEvents();

        this.initSmoothScroll();

        this.initHeaderScroll();

        console.log("[X2Navigation] Navigation initialized.");
    }

};


/* =========================================================
   GLOBAL ACCESS
========================================================= */

window.X2Navigation = X2Navigation;


/* =========================================================
   MODULE INITIALIZER
========================================================= */

export function initNavigation() {

    X2Navigation.init();

}