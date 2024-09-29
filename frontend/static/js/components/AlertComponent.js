export default class AlertComponent extends HTMLElement{
    constructor(msg, duration){
        super();
        this.shadow = this.attachShadow({mode: "open"});
        this._msg = msg;
        this._duration = duration;
    }

    connectedCallback(){
        this.render(this._msg);
        this.addStyle();
    }

    render(msg, duration){
        this.shadow.innerHTML = /*html*/`
        <div>
            <p>{msg}</p>
        </div>
        `
    }

    addStyle(){
        const style = document.createElement("style");
        style.textContent = this._getCSS();
        this.shadow.appendChild(style);
    }

    _getCSS(){
        return /*css*/`
        div{
            position: absolute;
            width: auto;
            height: auto;
            padding: 2rem;
            background-color: rgba(var(--clr-popup-background), .7);
            color: rgba(var(--clr-popup-foreground), .8);
        }
        `
    }
}