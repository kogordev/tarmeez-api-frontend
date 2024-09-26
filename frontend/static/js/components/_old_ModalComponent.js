export default class ModalComponent extends HTMLElement {

    constructor() {
        super();
    }

    connectedCallback() {        
        const shadow = this.attachShadow({ mode: "open" });
        shadow.innerHTML = /*html*/`
        <link rel="stylesheet" href="/static/css/modal.css"/>
        <div id="backdrop" class="backdrop hidden">
            <div class="wrapper border-radius flex centered">
                <button id="btn-close" class="btn btn-circle btn-close"></button>
            <slot></slot>
            </div>
        </div>
        `;

        this.shadowRoot.addEventListener("click", e => {
            e.stopPropagation();
            const backdrop = this.shadowRoot.querySelector("#backdrop");
            const closeBtn =this.shadowRoot.querySelector("#btn-close");
            if (e.composedPath()[0].contains(backdrop) || e.composedPath()[0] === closeBtn) {
                this.hide()
            }
        })
    }


    show() {
        this.shadowRoot.querySelector(".backdrop").classList.remove("hidden");
    }

    hide() {
        this.shadowRoot.querySelector(".backdrop").classList.add("hidden");
        this.clearSlot()
    }

    clearSlot(){
        this.shadowRoot.querySelector("slot").innerHTML = ""
    }

    dispose() {
        this.dispose();
    }
    
}


customElements.define("modal-c", ModalComponent);