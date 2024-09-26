export default class DropdownComponent extends HTMLElement{

    constructor(){
        super();
    }

    connectedCallback(){
        const shadow = this.attachShadow({mode: "open"});
        const {img} = this.dataset;

        shadow.innerHTML = /*html*/`
        <style>
        :host{
            display: inline-block;
        }
        div{
            border-radius: 50%;
            position: relative;
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
            mask-image: url("${img}");
            -webkit-mask-image: url("${img || ''}");
            mask-repeat: no-repeat;
            mask-position: center;
            cursor: pointer;
            transition: mask-image .5s;
        }
        .menu{
            position: absolute;
            height: 100px;
            width: 100px;
            background-color: rgb(var(--clr-secondary-background));
            border-radius: var(--br);
            top: 40px;
            right: 0;
        }
        .shadow{
            box-shadow: 0 0 10px -5px black;
        }

        </style>
        <div>
            <button></button>
            <div class="menu shadow"></div>
        </div>
        `;
    }
}

customElements.define("dropdown-c", DropdownComponent);