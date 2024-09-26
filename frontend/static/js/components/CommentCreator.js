export default class CommentCreator extends  HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode: "open"});
    }

    connectedCallback(){
        this.render();
    }

    render(){
        this.shadowRoot.innerHTML = /*html*/`
        <link rel="stylesheet" href="/static/css/commentcreator.css"/>
        <div>
            <h1>Comment Creator</h1>
        </div>
        `
    }

    rerender(){
        this.shadowRoot.innerHTML = "";
        this.render();
    }
}

window.customElements.define("commentcreator-c", CommentCreator);