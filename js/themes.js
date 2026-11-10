/* =========================================================
   X2 SOCIAL HUB
   Theme Management System
   Version: 1.0.0
========================================================= */

const X2Themes = {

    storageKey: "x2-social-hub-theme",

    defaultTheme: "liquid",

    themes: [
        {
            id: "liquid",
            name: "Liquid Glass",
            description: "Premium translucent glass aesthetic",
            icon: "◈"
        },
        {
            id: "midnight",
            name: "Midnight Black",
            description: "Deep black with elegant highlights",
            icon: "◐"
        },
        {
            id: "ios-light",
            name: "iOS Light",
            description: "Clean and bright Apple-inspired style",
            icon: "☀"
        },
        {
            id: "ios-dark",
            name: "iOS Dark",
            description: "Elegant dark interface",
            icon: "☾"
        },
        {
            id: "sunset",
            name: "Sunset Gradient",
            description: "Warm sunset-inspired gradients",
            icon: "🌅"
        },
        {
            id: "aurora",
            name: "Aurora",
            description: "Northern lights-inspired colors",
            icon: "✧"
        },
        {
            id: "cyberpunk",
            name: "Cyberpunk",
            description: "Futuristic neon interface",
            icon: "⚡"
        },
        {
            id: "minimal",
            name: "Minimal White",
            description: "Simple and sophisticated white design",
            icon: "○"
        }
    ],

    currentTheme: "liquid",

    /* -----------------------------------------------------
       GET SAVED THEME
    ----------------------------------------------------- */

    getSavedTheme() {

        try {
            const saved = localStorage.getItem(this.storageKey);

            const exists = this.themes.some(
                theme => theme.id === saved
            );

            return exists ? saved : this.defaultTheme;

        } catch (error) {
            console.warn("Theme storage unavailable:", error);

            return this.defaultTheme;
        }
    },

    /* -----------------------------------------------------
       APPLY THEME
    ----------------------------------------------------- */

    applyTheme(themeId, save = true) {

        const selectedTheme = this.themes.find(
            theme => theme.id === themeId
        );

        if (!selectedTheme) {
            console.warn(`Unknown theme: ${themeId}`);
            return false;
        }

        document.body.setAttribute(
            "data-theme",
            selectedTheme.id
        );

        document.documentElement.setAttribute(
            "data-theme",
            selectedTheme.id
        );

        this.currentTheme = selectedTheme.id;

        if (save) {
            try {
                localStorage.setItem(
                    this.storageKey,
                    selectedTheme.id
                );
            } catch (error) {
                console.warn(
                    "Unable to save selected theme:",
                    error
                );
            }
        }

        this.updateActiveTheme();

        document.dispatchEvent(
            new CustomEvent("x2:themechange", {
                detail: {
                    theme: selectedTheme.id,
                    name: selectedTheme.name
                }
            })
        );

        return true;
    },

    /* -----------------------------------------------------
       UPDATE ACTIVE THEME INDICATOR
    ----------------------------------------------------- */

    updateActiveTheme() {

        document.querySelectorAll("[data-theme-select]").forEach(
            button => {

                const isActive =
                    button.dataset.themeSelect === this.currentTheme;

                button.classList.toggle("active", isActive);

                button.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );

                if (isActive) {
                    button.setAttribute(
                        "aria-current",
                        "true"
                    );
                } else {
                    button.removeAttribute("aria-current");
                }
            }
        );

        document.querySelectorAll("[data-theme-active]").forEach(
            element => {
                element.textContent = this.currentTheme;
            }
        );
    },

    /* -----------------------------------------------------
       GENERATE THEME OPTIONS
    ----------------------------------------------------- */

    renderThemeOptions() {

        const container = document.getElementById("theme-options");

        if (!container) return;

        container.innerHTML = "";

        this.themes.forEach(theme => {

            const button = document.createElement("button");

            button.type = "button";

            button.className = "theme-option";

            button.dataset.themeSelect = theme.id;

            button.setAttribute(
                "aria-label",
                `Apply ${theme.name} theme`
            );

            button.setAttribute("aria-pressed", "false");

            const preview = document.createElement("span");

            preview.className = "theme-preview";

            preview.dataset.preview = theme.id;

            preview.setAttribute("aria-hidden", "true");

            const icon = document.createElement("span");

            icon.className = "theme-option-icon";

            icon.textContent = theme.icon;

            const details = document.createElement("span");

            details.className = "theme-option-details";

            const name = document.createElement("span");

            name.className = "theme-option-name";

            name.textContent = theme.name;

            const description = document.createElement("span");

            description.className = "theme-option-description";

            description.textContent = theme.description;

            const check = document.createElement("span");

            check.className = "theme-option-check";

            check.textContent = "✓";

            check.setAttribute("aria-hidden", "true");

            details.append(name, description);

            button.append(
                preview,
                icon,
                details,
                check
            );

            container.appendChild(button);
        });

        this.updateActiveTheme();
    },

    /* -----------------------------------------------------
       THEME EVENT LISTENERS
    ----------------------------------------------------- */

    initThemeEvents() {

        document.addEventListener("click", event => {

            const button = event.target.closest(
                "[data-theme-select]"
            );

            if (!button) return;

            const themeId = button.dataset.themeSelect;

            const success = this.applyTheme(themeId);

            if (success && window.X2Hub) {

                const selected = this.themes.find(
                    theme => theme.id === themeId
                );

                window.X2Hub.toast(
                    `${selected.name} theme applied`,
                    "success",
                    2200
                );
            }
        });
    },

    /* -----------------------------------------------------
       PUBLIC THEME API
    ----------------------------------------------------- */

    setTheme(themeId) {
        return this.applyTheme(themeId);
    },

    getCurrentTheme() {
        return this.currentTheme;
    },

    getAvailableThemes() {
        return [...this.themes];
    },

    /* -----------------------------------------------------
       INITIALIZE
    ----------------------------------------------------- */

    init() {

        this.currentTheme = this.getSavedTheme();

        this.applyTheme(this.currentTheme, false);

        this.renderThemeOptions();

        this.initThemeEvents();

        console.log(
            `[X2Themes] ${this.currentTheme} theme initialized.`
        );
    }
};


/* =========================================================
   GLOBAL THEME ACCESS
========================================================= */

window.X2Themes = X2Themes;


/* =========================================================
   MODULE INITIALIZER
========================================================= */

export function initThemes() {

    X2Themes.init();

}