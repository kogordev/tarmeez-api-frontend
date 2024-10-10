export default class ThemeToggleBtnComponent extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
        this.activeMode = null;
    }

    connectedCallback() {
        const { ficn, sicn } = this.dataset;

        // Attach styles and initialize the button
        this.attachStyles(ficn, sicn);
        this.initializeButton(ficn, sicn);

        // Apply the initial theme based on localStorage or system settings
        const defaultTheme = this.getDefaultTheme();
        const localTheme = localStorage.getItem("theme");
        this.applyInitialTheme(localTheme, defaultTheme);

        // Setup event listener for toggling the theme
        this.addEventListener("click", (e) => {
            e.preventDefault();
            this.toggleTheme();
        });
    }

    getDefaultTheme(){
        return indow.matchMedia("(prefers-color-scheme: dark)").matches === "true" ? "dark": "light";
    }

    // Attach styles dynamically to the shadow DOM
    attachStyles(ficn, sicn) {
        const style = document.createElement("style");
        style.textContent = /*css*/ `
            :host {
                display: inline-block;
            }
            div {
                border-radius: 50%;
                transition: var(--tr-hover);
            }
            div:hover {
                background-color: rgb(var(--clr-hover));
            }
            button {
                border: 0;
                padding: var(--p);
                height: 1.6rem;
                width: 1.6rem;
                background-color: rgb(var(--clr-main-foreground));
                outline: none;
                mask-image: url("${ficn}");
                -webkit-mask-image: url("${ficn || ''}");
                mask-repeat: no-repeat;
                mask-position: center;
                cursor: pointer;
                transition: mask-image .5s;
            }
            .light-mode-button {
                mask-image: url("${sicn}");
                -webkit-mask-image: url("${sicn || ''}");
            }
        `;
        this.shadow.appendChild(style);
    }

    // Initialize the button and append it to the shadow DOM
    initializeButton() {
        const wrapper = document.createElement("div");
        const button = document.createElement("button");
        button.id = "btn";

        wrapper.appendChild(button);
        this.shadow.appendChild(wrapper);

        this.button = button; // Cache button reference for future use
    }

    // Toggle the theme between light and dark mode
    toggleTheme() {
        const body = document.body;
        // toggle based on icon


        body.classList.toggle("dark");
        this.button.classList.toggle("light-mode-button");
        localStorage.setItem("dark", body.classList.contains("dark"));
    }

    // Apply the initial theme based on local storage or system preferences
    applyInitialTheme(name, defaultTheme) {
        document.body.className = "";
        switch(name){
            case "dark": 
                document.body.classList.add("dark");
                break;
            case "light":
                document.body.classList.add("light");
                break;
            default: 
                document.body.classList.add(defaultTheme);
        }
    }

}

customElements.define("themetogglebtn-c", ThemeToggleBtnComponent);
