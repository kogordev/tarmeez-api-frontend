export default class Processing extends HTMLElement{
    constructor(){
        super();
        this.shadow = this.attachShadow({mode: "open"});
    }

    connectedCallback(){
        this.render();
    }

    render(){
        this.shadow.innerHTML = this.getHTMLTemplate();
    }

    getHTMLTemplate(){
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
                background: rgb(var(--clr-secondary-background));
                z-index: 99999;
            }
            img{
                shadow-box: 0 0 10px rgba(0, 0, 0, .4);
            }
        </style>
        <div class="backdrop">
            <img height="100" width="100" src="/static/assets/images/loader1.gif" alt="loader"/>
        </div>
        `
    }

}


window.customElements.define("processing-c", Processing);