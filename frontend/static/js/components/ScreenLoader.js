class ScreenLoader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' }); // Attach shadow DOM for encapsulation

        // Create loader elements
        this.wrapper = document.createElement('div');
        this.loaderImage = document.createElement('img');

        // Set up initial class names and properties
        this.wrapper.className = 'loader-wrapper';
        this.loaderImage.className = 'loader-image';
        this.loaderImage.src = "/static/assets/images/loader1.gif";
        this.loaderImage.alt = "Loading...";

        // Append elements to shadow DOM
        this.wrapper.appendChild(this.loaderImage);
        this.shadowRoot.append(this.createStyles(), this.wrapper);

        // Initialize internal state
        this._isVisible = false;
    }

    connectedCallback() {
        this.hide(true); // Hide immediately when the element is first attached
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
                background: rgb(var(--clr-secondary-background));
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
        `;
        return style;
    }

    // Method to show the loader with a smooth transition
    show() {
        if (!this._isVisible) {
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