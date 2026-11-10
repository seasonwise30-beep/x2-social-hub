/* =========================================================
   X2 SOCIAL HUB
   Contact & Profile Submission Controller
   Version: 1.0.0
========================================================= */

/*
   IMPORTANT:
   Replace these placeholder endpoints with your actual
   Formspree endpoints before publishing the website.

   Example:
   https://formspree.io/f/abcdwxyz
*/

const FORMSPREE_CONFIG = {

    contact: "https://formspree.io/f/YOUR_CONTACT_FORM_ID",

    profile: "https://formspree.io/f/YOUR_PROFILE_FORM_ID"

};


/* =========================================================
   CONTACT CONTROLLER
========================================================= */

const X2Contact = {

    /* -----------------------------------------------------
       INITIALIZE
    ----------------------------------------------------- */

    init() {

        this.initContactForm();

        this.initProfileForm();

        this.initBioCounter();

        this.initLiveValidation();

        console.log("[X2Contact] Forms initialized.");

    },


    /* -----------------------------------------------------
       GET FORM ENDPOINT
    ----------------------------------------------------- */

    getEndpoint(form, type) {

        return (
            form.dataset.formspreeEndpoint ||
            (form.getAttribute("action") &&
             form.getAttribute("action").startsWith("https://formspree.io/")
                ? form.getAttribute("action")
                : FORMSPREE_CONFIG[type])
        );

    },


    /* -----------------------------------------------------
       CHECK ENDPOINT CONFIGURATION
    ----------------------------------------------------- */

    isConfigured(endpoint) {

        return (
            typeof endpoint === "string" &&
            endpoint.startsWith("https://formspree.io/f/") &&
            !endpoint.includes("YOUR_") &&
            !endpoint.endsWith("/f/")
        );

    },


    /* -----------------------------------------------------
       CONTACT FORM
    ----------------------------------------------------- */

    initContactForm() {

        const form = document.querySelector("#contact-form");

        if (!form) return;

        form.addEventListener("submit", async event => {

            event.preventDefault();

            if (!this.validateForm(form)) return;

            const endpoint = this.getEndpoint(form, "contact");

            if (!this.isConfigured(endpoint)) {

                this.showStatus(
                    form,
                    "Please configure your Formspree contact endpoint first.",
                    "error"
                );

                return;
            }

            await this.submitForm(form, endpoint);

        });

    },


    /* -----------------------------------------------------
       PROFILE SUBMISSION FORM
    ----------------------------------------------------- */

    initProfileForm() {

        const form = document.querySelector(
            "#profile-submission-form"
        );

        if (!form) return;

        form.addEventListener("submit", async event => {

            event.preventDefault();

            if (!this.validateForm(form)) return;

            const endpoint = this.getEndpoint(form, "profile");

            if (!this.isConfigured(endpoint)) {

                this.showStatus(
                    form,
                    "Please configure your Formspree profile submission endpoint first.",
                    "error"
                );

                return;
            }

            await this.submitForm(form, endpoint);

        });

    },


    /* -----------------------------------------------------
       FORM VALIDATION
    ----------------------------------------------------- */

    validateForm(form) {

        let valid = true;

        const fields = form.querySelectorAll(
            "input[required], textarea[required], select[required]"
        );

        fields.forEach(field => {

            this.clearFieldError(field);

            if (!field.checkValidity()) {

                valid = false;

                this.showFieldError(
                    field,
                    this.getValidationMessage(field)
                );

            }

        });


        // Email validation

        const emailFields = form.querySelectorAll(
            'input[type="email"]'
        );

        emailFields.forEach(field => {

            if (!field.value.trim()) return;

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(field.value.trim())) {

                valid = false;

                this.showFieldError(
                    field,
                    "Please enter a valid email address."
                );

            }

        });


        // URL validation

        const urlFields = form.querySelectorAll(
            'input[type="url"]'
        );

        urlFields.forEach(field => {

            if (!field.value.trim()) return;

            try {

                const url = new URL(field.value);

                if (!["http:", "https:"].includes(url.protocol)) {
                    throw new Error("Invalid protocol");
                }

            } catch {

                valid = false;

                this.showFieldError(
                    field,
                    "Please enter a valid website URL."
                );

            }

        });


        if (!valid) {

            const firstInvalid = form.querySelector(
                ".field-error, :invalid"
            );

            firstInvalid?.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            firstInvalid?.focus();

        }

        return valid;

    },


    /* -----------------------------------------------------
       VALIDATION MESSAGES
    ----------------------------------------------------- */

    getValidationMessage(field) {

        if (field.validity.valueMissing) {
            return "This field is required.";
        }

        if (field.validity.typeMismatch) {

            if (field.type === "email") {
                return "Please enter a valid email address.";
            }

            if (field.type === "url") {
                return "Please enter a valid URL.";
            }

        }

        if (field.validity.tooShort) {
            return `Please enter at least ${field.minLength} characters.`;
        }

        if (field.validity.tooLong) {
            return `Please enter no more than ${field.maxLength} characters.`;
        }

        return field.validationMessage || "Please check this field.";

    },


    /* -----------------------------------------------------
       SHOW FIELD ERROR
    ----------------------------------------------------- */

    showFieldError(field, message) {

        field.classList.add("field-error");

        field.setAttribute("aria-invalid", "true");

        let errorElement = field.parentElement.querySelector(
            ".field-error-message"
        );

        if (!errorElement) {

            errorElement = document.createElement("small");

            errorElement.className = "field-error-message";

            errorElement.setAttribute("role", "alert");

            field.insertAdjacentElement(
                "afterend",
                errorElement
            );

        }

        errorElement.textContent = message;

    },


    /* -----------------------------------------------------
       CLEAR FIELD ERROR
    ----------------------------------------------------- */

    clearFieldError(field) {

        field.classList.remove("field-error");

        field.removeAttribute("aria-invalid");

        const errorElement =
            field.parentElement.querySelector(
                ".field-error-message"
            );

        errorElement?.remove();

    },


    /* -----------------------------------------------------
       LIVE VALIDATION
    ----------------------------------------------------- */

    initLiveValidation() {

        document.addEventListener("input", event => {

            const field = event.target;

            if (
                !field.matches(
                    "#contact-form input, " +
                    "#contact-form textarea, " +
                    "#profile-submission-form input, " +
                    "#profile-submission-form textarea"
                )
            ) return;

            if (field.classList.contains("field-error")) {

                this.clearFieldError(field);

                if (!field.checkValidity()) {

                    this.showFieldError(
                        field,
                        this.getValidationMessage(field)
                    );

                }

            }

        });

    },


    /* -----------------------------------------------------
       BIO CHARACTER COUNTER
    ----------------------------------------------------- */

    initBioCounter() {

        const bio = document.querySelector(
            "#profile-bio-input"
        ) || document.querySelector(
            "#profile-submission-form textarea[name='bio']"
        );

        if (!bio) return;

        const counter = document.querySelector(
            "#bio-counter"
        ) || document.querySelector(
            "[data-bio-counter]"
        );

        if (!counter) return;

        const updateCounter = () => {

            const max = bio.maxLength > 0
                ? bio.maxLength
                : 300;

            counter.textContent =
                `${bio.value.length}/${max}`;

            counter.classList.toggle(
                "is-limit",
                bio.value.length >= max
            );

        };

        bio.addEventListener("input", updateCounter);

        updateCounter();

    },


    /* -----------------------------------------------------
       SUBMIT FORM TO FORMSPREE
    ----------------------------------------------------- */

    async submitForm(form, endpoint) {

        const submitButton = form.querySelector(
            'button[type="submit"], input[type="submit"]'
        );

        const originalText = submitButton
            ? submitButton.textContent
            : "";

        const statusType = form.id === "contact-form"
            ? "contact"
            : "profile";

        try {

            if (submitButton) {

                submitButton.disabled = true;

                submitButton.textContent = "Sending...";

                submitButton.setAttribute(
                    "aria-busy",
                    "true"
                );

            }

            this.showStatus(
                form,
                "Sending your submission...",
                "loading"
            );


            const formData = new FormData(form);

            formData.append(
                "_subject",
                statusType === "contact"
                    ? "New X2 SOCIAL HUB Contact Message"
                    : "New X2 SOCIAL HUB Profile Submission"
            );


            const response = await fetch(endpoint, {

                method: "POST",

                body: formData,

                headers: {
                    "Accept": "application/json"
                }

            });


            const result = await response.json().catch(() => ({}));


            if (!response.ok) {

                const errorMessage =
                    result.errors?.map(error => error.message).join(", ") ||
                    "Something went wrong. Please try again.";

                throw new Error(errorMessage);

            }


            form.reset();

            this.clearAllErrors(form);

            this.showStatus(
                form,
                statusType === "contact"
                    ? "Thank you! Your message has been sent successfully."
                    : "Thank you! Your profile has been submitted for review.",
                "success"
            );

            if (statusType === "profile") {
                this.initBioCounter();
            }

            if (window.X2Hub) {

                window.X2Hub.toast(
                    "Submission successful!",
                    "success"
                );

            }


        } catch (error) {

            console.error(
                "[X2Contact] Submission error:",
                error
            );

            this.showStatus(
                form,
                error.message ||
                "Unable to send your submission. Please try again.",
                "error"
            );

        } finally {

            if (submitButton) {

                submitButton.disabled = false;

                submitButton.textContent = originalText;

                submitButton.removeAttribute("aria-busy");

            }

        }

    },


    /* -----------------------------------------------------
       CLEAR ALL ERRORS
    ----------------------------------------------------- */

    clearAllErrors(form) {

        form.querySelectorAll(
            ".field-error"
        ).forEach(field => {

            this.clearFieldError(field);

        });

        form.querySelectorAll(
            ".field-error-message"
        ).forEach(error => {

            error.remove();

        });

    },


    /* -----------------------------------------------------
       STATUS MESSAGES
    ----------------------------------------------------- */

    showStatus(form, message, type = "info") {

        let status = form.querySelector(
            "#form-status"
        ) || form.querySelector(
            ".form-status"
        ) || form.querySelector(
            "[data-form-status]"
        );

        if (!status) {

            status = document.createElement("div");

            status.className = "form-status";

            status.setAttribute("role", "status");

            status.setAttribute("aria-live", "polite");

            form.appendChild(status);

        }

        status.textContent = message;

        status.className =
            `form-status form-status-${type}`;

        status.dataset.status = type;

    }

};


/* =========================================================
   GLOBAL ACCESS
========================================================= */

window.X2Contact = X2Contact;


/* =========================================================
   MODULE INITIALIZER
========================================================= */

export function initContact() {

    X2Contact.init();

}