export default class MainLayout extends HTMLElement{
    constructor(){
        super();
        this.root = null;
    }

    connectedCallback(){
        const shadow = this.attachShadow({mode: "open"});

        shadow.innerHTML = /*html*/`
        <link rel="stylesheet" href="/static/css/mainlayout.css"/>
        <div id="root" class="wrapper">
            <navbar-c></navbar-c>
            
        </div>
        `

        this.root = this.shadowRoot.querySelector("#root");

        this.addEventListener("click", e =>{
            e.stopPropagation();
            e.preventDefault();
        })
    }

    renderView(view){
        const navbar = this.shadowRoot.querySelector("navbar-c");
        Array.from(this.shadowRoot.querySelector("#root").children).map(child => {
            if (!child.contains(navbar)){
                child.remove()
            }
        });
        this.shadowRoot.querySelector("#root").appendChild(view);
    }
};

window.customElements.define("main-layout", MainLayout);
