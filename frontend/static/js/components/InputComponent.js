class InputComponent extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._inputValue = null;
    }


    connectedCallback() {
        this.render();
        this.addStyle();
        this.attachEvents();
    }

    render() {
        this.shadowRoot.innerHTML = this.getHTMLTemplate();
    }

    getHTMLTemplate() {
        const placeholder = this.dataset?.placeholder || "What's on your mind?";
        if (Object(this.dataset)?.hasOwnProperty("inputValue")) {
            return /*html*/`
            <p>
                <textarea>${this.dataset.inputValue}</textarea>
            </p>
            `
        }
        return /*html*/`
        <p>
            <textarea  placeholder="${placeholder}"></textarea>
        </p>
        `
    }

    addStyle() {
        const style = document.createElement("style");
        style.textContent = this.getCSS();
        this.shadowRoot.appendChild(style);
    }

    getCSS() {
        return /*css*/`
        *{
            padding: 0;
            margin: 0;
            box-sizing: border-box;
        }
        p{
            display: flex;
            justify-content: center; /* Center horizontally (if needed) */
            align-items: center;     /* Center vertically */
            height: 5rem;           /* Set a height to the container */
            width:100%;           /* Set a height to the container */
        }

        textarea {
            padding: 1rem;
            padding-top: 1.25rem;
            font-size: 1.8rem;
            resize: none;
            height: 100%;           /* Height of the textarea */
            width: 100%;           /* Height of the textarea */
            overflow: hidden;
            border: none;
            border-radius: var(--br);
            outline:0;
            background-color: rgb(var(--clr-hover));
            color: rgb(var(--clr-main-foreground));
        }
        `
    }

    attachEvents() {
        const textarea = this.shadowRoot.querySelector("textarea");
        textarea.addEventListener("input", () => {
            this.handleInput(textarea);
        });
    }

    handleInput(textarea) {
        try {
            this.inputValue = textarea.value;
            this.resize(textarea);
        } catch (error) {
            this.inputValue = null;
        }
    }

    resize(textarea) {
        const p = textarea.parentElement;
        const minHeight = "5rem";

        // Reset height to auto to allow recalculation
        p.style.height = minHeight;

        // Set to content's scroll height if not empty
        if (textarea.value.trim()) {
            p.style.height = `${textarea.scrollHeight}px`;
        }
    }


    set inputValue(value) {
        this._inputValue = value;
        this.setupInput();
    }

    get inputValue() {
        return this._inputValue;
    }

    setupInput() {
        const textarea = this.shadowRoot.querySelector("textarea");
        textarea.value = this._inputValue;
        this.resize(textarea)
    }

    focusInput(){
        const textarea = this.shadowRoot.querySelector("textarea");
        this.resize(textarea);
        textarea.focus();
    }
}


export default InputComponent;

window.customElements.define("input-c", InputComponent);
