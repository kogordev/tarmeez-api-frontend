class PostDetails extends HTMLElement{
    constructor(){
        super();
        this.shadow = this.attachShadow({mode: "open"});
        this.state = null;
    }

    async connectedCallback(){
        this.state = this.dataset.state;

        if (!this.state) {
            throw new Error("no data-state attribute provided!");
        };

        await this.render();
    }


    render(){
        this.innerHTML = /*html*/`
        <link rel="stylesheet" href="/static/css/common.css">
        <div class="backdrop">
            <div class="header"></div>
            <div class="post-wrapper"></div>
            <div class=comments-wrapper></div>
        </div>
        `
    }




}


export default PostDetails;

window.customElements.define("post-details", PostDetails );