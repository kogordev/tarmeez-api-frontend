import { navigateTo } from "/static/js/utils/router.js";

export default class NavLinkComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.to = null;
        this.img = null;
    }

    connectedCallback() {
        this.render();
    }

    static get oberservedAttributes(){
        return ["data-img", "data-to"];
    }

    attributeChangedCallback(name, oldValue, newValue){
        switch(name){
            case "data-img": 
                this.setImg(newValue);
                break;
            case "data-to":
                this.setTo(newValue);
                break;
        }
    }

    getCss(){
        return /*css*/`
        :host{
            display: inline-block;
            user-select: none;
        }
        div{
            width: 145px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: var(--fs-header);
            cursor: pointer;
            border-radius: var(--br);
            transition: background-color .3s;
            overflow: hidden;
        }
        div:hover{
            background-color: rgb(var(--clr-hover-bg));
        }
        /* div img{
            height: 54px;
            width: 54px;
        } */
        div span{
            padding-right: 1.5rem;
            letter-spacing: .4rem;
            margin-left: -1.2rem;
        }
        
        `
    }

    addStyle(){
        const style = document.createElement("style");
        style.textContent = this.getCss().trim();
        this.shadowRoot.appendChild(style);
    }

    render() {
        return new Promise((res, rej) => {
            try {
                this.to = this.to || this.dataset["to"];
                this.img = this.img || this.dataset["img"]
                this.text = this.text || this.dataset["text"];

                // Avoid appending stylesheet multiple times
                if (!this.shadowRoot.querySelector('style')) {
                    this.addStyle();
                    // const cssLink = document.createElement("link");
                    // cssLink.rel = "stylesheet";
                    // cssLink.href = "/static/css/navlink.css";
                    // this.shadowRoot.append(cssLink);
                }

                const wrapper = document.createElement("div");
                wrapper.setAttribute("part", "wrapper");

                const linkImg = document.createElement("img");
                linkImg.src = this.img;
                linkImg.alt = "logo";
                linkImg.height ="54";
                linkImg.width ="54";
                linkImg.setAttribute("part", "img");

                this.shadowRoot.append(wrapper);
                wrapper.appendChild(linkImg);

                if (this.text) {
                    const linkText = document.createElement("span");
                    linkText.textContent = this.text;
                    wrapper.appendChild(linkText);
                }

                this.addEventListener(
                    "click",
                    (e) => {
                        navigateTo(this.to);
                    },
                    //{ once: true } // Prevent multiple event listener issues
                );

                res(true);
            } catch (error) {
                console.error("Render failed", error);
                rej(error);
            }
        });
    }

    rerender() {
        // Clear current shadow DOM content
        this.shadowRoot.innerHTML = '';
        // Re-render the component
        this.render();
    }

    setImg(src) {
        this.shadowRoot.querySelector("img").src = src;
    }

    setTo(url) {
        this.to = url;
    }

    setText(text) {
        this.shadowRoot.querySelector("span").textContent = text;
    }
}

customElements.define("navlink-c", NavLinkComponent);
