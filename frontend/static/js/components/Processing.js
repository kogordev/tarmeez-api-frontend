import { loaderSvg } from "/static/js/utils/utils.js";
import { processingSvg } from "/static/js/utils/utils.js";

export default class Processing extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadow.innerHTML = this.getHTMLTemplate();
    }

    getHTMLTemplate() {
        return `
        <style>
            .backdrop{
                position: absolute;
                inset: 0 0 0 0;
                height: 100%;
                width: 100%;
                display: flex; 
                justify-content:center;
                align-items: center;
                background: rgba(var(--clr-bg-secondary), .8);
                z-index: 99999;
                border-radius: var(--br);
                transition: all .3s;
            }
            svg{
            color: rgb(var(--clr-processing-bg));
            }
        </style>
        <div class="backdrop">
            ${processingSvg}
        </div>
        `
    }

}


window.customElements.define("processing-c", Processing);