import { loaderSvg } from "/static/js/utils/utils.js";

class ScreenLoader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' }); // Attach shadow DOM for encapsulation

        // Create loader elements
        this.wrapper = document.createElement('div');
        this.svgWrapper = document.createElement("div");
        this.svgWrapper.innerHTML = loaderSvg;

        // Set up initial class names and properties
        this.wrapper.className = 'loader-wrapper';
        this.svgWrapper.className = 'loader-image';

        // Append elements to shadow DOM
        this.wrapper.appendChild(this.svgWrapper);
        this.shadowRoot.append(this.createStyles(), this.wrapper);

        // Initialize internal state
        this._isVisible = false;
    }

    connectedCallback() {
        this.hide(true); // Hide immediately when the element is first attached
    }

    disconnectedCallback() {
        document.body.style.overflow = "auto";
    }

    createStyles() {
        const style = document.createElement('style');
        style.textContent = /*css*/`

            :host{
                position: fixed;
                inset: 0 0 0 0;
                height: 100%;
                width: 100%;
                z-index: 99999999; /* High z-index to appear above other elements */
                pointer-events: none; /* Prevent interaction when visible */
                background: rgb(var(--clr-bg-secondary));
            }
            .loader-wrapper {
                height: 100%;
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;

                visibility: hidden;
                opacity: 0;
                transition: visibility 0s linear 0.5s, opacity 0.5s ease-in-out;
            }

            .loader-wrapper.visible {
                visibility: visible;
                opacity: 1;
                transition: visibility 0s linear 0.5s, opacity 0.5s ease-in-out;
            }

            .loader-image {
                width: 100px; /* Loader size */
                height: 100px;
            }
            svg{
                color: rgb(var(--clr-processing-bg));
            }
        `;
        return style;
    }

    // Method to show the loader with a smooth transition
    show() {
        if (!this._isVisible) {
            document.body.style.overflow = "hidden";
            this._isVisible = true;
            this.wrapper.classList.add('visible'); // Apply CSS class to show
        }
    }

    // Method to hide the loader with a smooth transition
    hide(immediate = false) {
        if (this._isVisible) {
            this._isVisible = false;
            if (immediate) {
                // Hide immediately without transition
                this.wrapper.style.transition = 'none';
                this.wrapper.classList.remove('visible');
                this.wrapper.offsetHeight; // Trigger reflow
                this.wrapper.style.transition = '';
            } else {
                // Hide with transition
                this.wrapper.classList.remove('visible');
            }
        }
    }

}

// Define the custom element
customElements.define('screen-loader', ScreenLoader);

export default ScreenLoader;