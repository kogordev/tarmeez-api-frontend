export default class ThemeToggleBtnComponent extends HTMLElement{

    constructor(){
        super();
    }

    connectedCallback(){

        const shadow = this.attachShadow({mode:"open"});
        
        const {ficn, sicn} = this.dataset;

        const style = document.createElement("style");
        
        style.textContent=/*css*/`
        :host{
            display: inline-block;
        }
        div{
            border-radius: 50%;
            transition: var(--tr-hover);
        }
        div:hover{
            background-color: rgb(var(--clr-hover));
        }
        button{
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
        .light-mode-button{
            mask-image: url("${sicn}");
            -webkit-mask-image: url("${sicn || ''}");
        }
        `


        const wrapper = document.createElement("div");
        const btn = document.createElement("button");
        btn.id = "btn";

        shadow.append(style, wrapper);
        wrapper.appendChild(btn);

        if(this.isDark() && !document.body.classList.contains("dark-mode")){
            this.toggle();
        }
        
        this.addEventListener("click", e =>{
            e.preventDefault();
            this.toggle();
        });

    }

    toggle(){
        const body = document.body;
        const btn = this.shadowRoot.querySelector("div").querySelector("button");

        body.classList.toggle("dark-mode");
        btn.classList.toggle("light-mode-button");
        localStorage.setItem("dark", body.classList.contains("dark-mode"));
    }

    isDark(){
        return localStorage.getItem("dark") === "true";
    }
}

customElements.define("themetogglebtn-c", ThemeToggleBtnComponent);