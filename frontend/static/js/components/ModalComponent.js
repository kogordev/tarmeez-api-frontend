export default class ModalComponent extends HTMLElement {
    constructor() {
        super();
        this._shadow = this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this._render();
        this._setupEventListeners();
    }

    _render() {
        this._shadow.innerHTML = /*html*/`
            <link rel="stylesheet" href="/static/css/modal.css"/>
            <div id="backdrop" class="backdrop hidden">
                <div class="wrapper border-radius flex centered">
                    <button id="btn-close" class="btn btn-circle btn-close"></button>
                    <slot></slot>
                </div>
            </div>
        `;
    }

    _setupEventListeners() {
        const backdrop = this._shadow.querySelector("#backdrop");
        const closeBtn = this._shadow.querySelector("#btn-close");

        this._shadow.addEventListener("click", (e) => this._handleClick(e, backdrop, closeBtn));
    }

    _handleClick(event, backdrop, closeBtn) {
        event.stopPropagation();
        const clickedElement = event.composedPath()[0];

        if (clickedElement === backdrop || clickedElement === closeBtn) {
            this.hide();
        }
    }

    show() {
        this._shadow.querySelector(".backdrop").classList.remove("hidden");
    }

    hide() {
        this._shadow.querySelector(".backdrop").classList.add("hidden");
        this._clearSlot();
    }

    _clearSlot() {
        const slot = this._shadow.querySelector("slot");
        const assignedNodes = slot.assignedNodes();

        assignedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
                node.remove();
            }
        });
    }

    disconnectedCallback() {
        this._shadow.removeEventListener("click", this._handleClick);
    }
}

customElements.define("modal-c", ModalComponent);
