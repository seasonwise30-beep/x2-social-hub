/* =========================================================
   X2 SOCIAL HUB
   Profile Directory Controller
   Version: 1.0.0
========================================================= */

const X2Profiles = {

    dataPath: "data/profiles.json",

    allProfiles: [],

    filteredProfiles: [],

    currentCategory: "all",

    currentSearch: "",

    currentSort: "featured",

    /* -----------------------------------------------------
       LOAD PROFILE DATABASE
    ----------------------------------------------------- */

    async loadProfiles() {

        try {

            const response = await fetch(this.dataPath);

            if (!response.ok) {
                throw new Error(
                    `Profile database error: ${response.status}`
                );
            }

            const data = await response.json();

            if (!Array.isArray(data.profiles)) {
                throw new Error(
                    "Invalid profile database format."
                );
            }

            this.allProfiles = data.profiles.filter(
                profile => profile.active !== false
            );

            this.filteredProfiles = [...this.allProfiles];

            console.log(
                `[X2Profiles] Loaded ${this.allProfiles.length} profiles.`
            );

            return this.allProfiles;

        } catch (error) {

            console.error(
                "[X2Profiles] Unable to load profiles:",
                error
            );

            if (window.X2Hub) {
                window.X2Hub.toast(
                    "Unable to load profiles. Please refresh the page.",
                    "error"
                );
            }

            return [];
        }
    },

    /* -----------------------------------------------------
       CREATE PROFILE CARD
    ----------------------------------------------------- */

    createProfileCard(profile) {

        const card = document.createElement("article");

        card.className = "profile-card glass-panel";

        card.dataset.profileId = profile.id;

        const avatar = document.createElement("img");

        avatar.className = "profile-card-avatar";

        avatar.src = profile.avatar ||
            "assets/images/default-avatar.png";

        avatar.alt = `${profile.displayName} profile picture`;

        avatar.loading = "lazy";

        avatar.onerror = () => {
            avatar.onerror = null;
            avatar.src = "assets/images/default-avatar.png";
        };

        const category = document.createElement("span");

        category.className = "profile-card-category";

        category.textContent = profile.category || "Creator";

        const name = document.createElement("h3");

        name.className = "profile-card-name";

        name.textContent = profile.displayName || profile.fullName;

        const username = document.createElement("p");

        username.className = "profile-card-username";

        username.textContent = `@${(
            profile.username || ""
        ).replace(/^@/, "")}`;

        const bio = document.createElement("p");

        bio.className = "profile-card-bio";

        bio.textContent = profile.bio || "";

        const actions = document.createElement("div");

        actions.className = "profile-card-actions";

        const viewButton = document.createElement("a");

        viewButton.className = "btn btn-primary profile-card-view";

        viewButton.href = `profile.html?id=${encodeURIComponent(profile.id)}`;

        viewButton.textContent = "View Profile";

        const instagramButton = document.createElement("a");

        instagramButton.className = "btn btn-secondary profile-card-instagram";

        instagramButton.href = profile.instagramUrl || "#";

        instagramButton.textContent = "Instagram";

        instagramButton.target = "_blank";

        instagramButton.rel = "noopener noreferrer";

        if (!profile.instagramUrl) {
            instagramButton.hidden = true;
        }

        actions.append(viewButton, instagramButton);

        card.append(
            avatar,
            category,
            name,
            username,
            bio,
            actions
        );

        if (profile.featured) {
            card.classList.add("featured");
        }

        return card;
    },

    /* -----------------------------------------------------
       RENDER PROFILE COLLECTION
    ----------------------------------------------------- */

    renderProfiles(container, profiles) {

        if (!container) return;

        container.replaceChildren();

        if (!profiles.length) {
            this.renderEmptyState(container);
            return;
        }

        const fragment = document.createDocumentFragment();

        profiles.forEach(profile => {
            fragment.appendChild(
                this.createProfileCard(profile)
            );
        });

        container.appendChild(fragment);
    },

    /* -----------------------------------------------------
       EMPTY STATE
    ----------------------------------------------------- */

    renderEmptyState(container) {

        const empty = document.createElement("div");

        empty.className = "profile-empty-state";

        const title = document.createElement("h3");

        title.textContent = "No profiles found";

        const description = document.createElement("p");

        description.textContent =
            "Try another search or choose a different category.";

        const resetButton = document.createElement("button");

        resetButton.type = "button";

        resetButton.className = "btn btn-secondary";

        resetButton.textContent = "Clear Filters";

        resetButton.addEventListener("click", () => {
            this.resetFilters();
        });

        empty.append(title, description, resetButton);

        container.appendChild(empty);
    },

    /* -----------------------------------------------------
       HOMEPAGE FEATURED PROFILES
    ----------------------------------------------------- */

    renderFeaturedProfiles() {

        const container = document.getElementById(
            "featured-profiles"
        );

        if (!container) return;

        const featured = this.allProfiles.filter(
            profile => profile.featured === true
        );

        this.renderProfiles(container, featured);
    },

    /* -----------------------------------------------------
       DIRECTORY PROFILES
    ----------------------------------------------------- */

    renderDirectoryProfiles() {

        const container = document.getElementById(
            "all-profiles"
        );

        if (!container) return;

        this.renderProfiles(
            container,
            this.filteredProfiles
        );
    },

    /* -----------------------------------------------------
       SEARCH PROFILES
    ----------------------------------------------------- */

    searchProfiles(searchText) {

        this.currentSearch = searchText
            .trim()
            .toLowerCase();

        this.applyFilters();
    },

    /* -----------------------------------------------------
       CATEGORY FILTER
    ----------------------------------------------------- */

    filterByCategory(category) {

        this.currentCategory = category || "all";

        this.applyFilters();
    },

    /* -----------------------------------------------------
       SORT PROFILES
    ----------------------------------------------------- */

    sortProfiles(sortType) {

        this.currentSort = sortType || "featured";

        this.applyFilters();
    },

    /* -----------------------------------------------------
       APPLY FILTERS
    ----------------------------------------------------- */

    applyFilters() {

        let results = [...this.allProfiles];

        // Category filter.
        if (this.currentCategory !== "all") {

            results = results.filter(profile => {
                return profile.category === this.currentCategory;
            });
        }

        // Search filter.
        if (this.currentSearch) {

            results = results.filter(profile => {

                const searchableText = [
                    profile.displayName,
                    profile.fullName,
                    profile.username,
                    profile.bio,
                    profile.category
                ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

                return searchableText.includes(
                    this.currentSearch
                );
            });
        }

        // Sorting.
        switch (this.currentSort) {

            case "name":
                results.sort((a, b) =>
                    (a.displayName || "").localeCompare(
                        b.displayName || ""
                    )
                );
                break;

            case "newest":
                results.sort((a, b) =>
                    new Date(b.createdAt || 0) -
                    new Date(a.createdAt || 0)
                );
                break;

            case "featured":
            default:
                results.sort((a, b) =>
                    Number(b.featured) - Number(a.featured)
                );
                break;
        }

        this.filteredProfiles = results;

        this.renderDirectoryProfiles();

        this.updateResultsCount();
    },

    /* -----------------------------------------------------
       RESULTS COUNT
    ----------------------------------------------------- */

    updateResultsCount() {

        const countElements = document.querySelectorAll(
            "#results-count, [data-results-count]"
        );

        countElements.forEach(element => {
            element.textContent = this.filteredProfiles.length;
        });
    },

    /* -----------------------------------------------------
       RESET FILTERS
    ----------------------------------------------------- */

    resetFilters() {

        this.currentCategory = "all";

        this.currentSearch = "";

        this.currentSort = "featured";

        const search = document.getElementById(
            "profile-search"
        );

        if (search) {
            search.value = "";
        }

        const sort = document.getElementById(
            "profile-sort"
        );

        if (sort) {
            sort.value = "featured";
        }

        document.querySelectorAll(
            "[data-category]"
        ).forEach(button => {

            const active =
                button.dataset.category === "all";

            button.classList.toggle("active", active);

            button.setAttribute(
                "aria-pressed",
                String(active)
            );
        });

        this.applyFilters();
    },

    /* -----------------------------------------------------
       INITIALIZE SEARCH EVENTS
    ----------------------------------------------------- */

    initSearchEvents() {

        const search = document.getElementById(
            "profile-search"
        );

        if (search) {

            search.addEventListener("input", event => {
                this.searchProfiles(event.target.value);
            });
        }
    },

    /* -----------------------------------------------------
       INITIALIZE CATEGORY EVENTS
    ----------------------------------------------------- */

    initCategoryEvents() {

        document.addEventListener("click", event => {

            const button = event.target.closest(
                "[data-category]"
            );

            if (!button) return;

            const category = button.dataset.category;

            this.filterByCategory(category);

            document.querySelectorAll(
                "[data-category]"
            ).forEach(item => {

                const active =
                    item.dataset.category === category;

                item.classList.toggle("active", active);

                item.setAttribute(
                    "aria-pressed",
                    String(active)
                );
            });
        });
    },

    /* -----------------------------------------------------
       INITIALIZE SORT EVENTS
    ----------------------------------------------------- */

    initSortEvents() {

        const sort = document.getElementById(
            "profile-sort"
        );

        if (!sort) return;

        sort.addEventListener("change", event => {
            this.sortProfiles(event.target.value);
        });
    },

    /* -----------------------------------------------------
       INITIALIZE
    ----------------------------------------------------- */

    async init() {

        await this.loadProfiles();

        this.renderFeaturedProfiles();

        this.renderDirectoryProfiles();

        this.initSearchEvents();

        this.initCategoryEvents();

        this.initSortEvents();

        this.updateResultsCount();

    }

};


/* =========================================================
   GLOBAL ACCESS
========================================================= */

window.X2Profiles = X2Profiles;


/* =========================================================
   MODULE INITIALIZER
========================================================= */

export async function initProfiles() {

    await X2Profiles.init();

}