import { backdrop, reset } from "/static/js/utils/cssClasses.js";

function getCSS() {
    const confirmationStyles =  /*css*/`

    .wrapper {
        padding: 2rem;
        background-color: rgb(var(--clr-bg-secondary));
        color: rgb(var(--clr-text-primary));
        border-radius: var(--br);
        font-size: 2rem;
        font-weight: 600;
        user-select: none;
    }
    .footer {
        padding-top: 3rem;
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
    }
    .button {
        border: none;
        border-radius: var(--br);
        cursor: pointer;
        padding: 1rem;
    }
    #confirm-btn {
        background-color: rgb(var(--clr-action-bg));
        color: rgb(var(--clr-action-text));
    }
    `;

    return "".concat(reset, backdrop, confirmationStyles);
}

export default class ConfirmationComponent extends HTMLElement {
    constructor(msg) {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
        this.msg = msg;
    }

    connectedCallback() {
        if (!this.msg) {
            throw new Error("Confirmation must have a message");
        }
        this.render();
        this.addStyles();
        this.attachEventListeners();
    }

    render() {
        const template = this.getTemplate();
        this.shadow.appendChild(template.content.cloneNode(true));
    }

    getTemplate() {
        const template = document.createElement("template");
        template.innerHTML = /*html*/`
        <div class="backdrop">
            <div class="wrapper">
                <div class="body">
                    <p>${this.msg}</p>
                </div>
                <div class="footer">
                    <button id="cancel-btn" class="button">Cancel</button>
                    <button id="confirm-btn" class="button">Confirm</button>
                </div>
            </div>
        </div>
        `;
        return template;
    }

    addStyles() {
        const style = document.createElement("style");
        style.textContent = getCSS();
        this.shadow.appendChild(style);
    }

   
    attachEventListeners() {
        this.shadow.querySelector("#confirm-btn").addEventListener("click", () => this.dispatchResult(true));
        this.shadow.querySelector("#cancel-btn").addEventListener("click", () => this.dispatchResult(false));
    }

    dispatchResult(isConfirm) {
        const event = new CustomEvent("delete-confirm", { detail: { isConfirm } });
        this.dispatchEvent(event);
    }
}

window.customElements.define("confirmation-c", ConfirmationComponent);
