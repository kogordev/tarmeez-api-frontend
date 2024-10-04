import Controller from "/static/js/controllers/controller.js";
class PostDetailsComponent extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.controller = new Controller();
        this.state = null;
    }

    async getPostDetails(id) {
        try {
            const url = `/posts/${id}`;
            const response = await this.controller.request(url);
            return response.data;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async connectedCallback() {
        this.state = await this.getPostDetails(this.id);
        if (this.state) {
            this.render();
        }
    }

    scrollToComments() {
        const postBody = this.shadowRoot.querySelector(".body");
        const scrHeight = postBody.scrollHeight;
        setTimeout(() => {
            postBody.scroll({ behavior: "smooth", top: scrHeight });
        }, 200);
    }

    disconnectedCallback() {
        document.body.style.overflowY = "auto";
        this.dispatchEvent(new CustomEvent("closed", { detail: this.state}));
    }

    async render() {
        const username = this.state.author.username;
        const state = JSON.stringify(this.state);
        console.log(state.length)
        this.shadowRoot.innerHTML = this.getHTMLTemplate(username, state);
        const postWrapper = this.shadowRoot.querySelector("#post-wrapper");
        const postComp = document.createElement("post-c");
        postComp.state = this.state;
        postComp.setAttribute("withCount", "true");
        postWrapper.appendChild(postComp);

        document.body.style.overflowY = "hidden";
        //add screenloader 
        const screenloader = document.createElement("screen-loader");
        document.body.appendChild(screenloader);
        screenloader.show();
        //
        this.shadowRoot.querySelector(".post-details").classList.add("hidden");
        this.shadowRoot.querySelector(".post-details").classList.remove("hidden");
        setTimeout(() => {
            screenloader.hide();
        },200);
        this.attachEventListeners();
    }

    getHTMLTemplate(username, state) {
        return/*html*/`
        <link rel="stylesheet" href="/static/css/common.css">
        <link rel="stylesheet" href="/static/css/postdetails.css">
        <div class="backdrop">

            <div class="post-details">
                <div class="col header flex flex-center shadow">
                    <h2>Post by ${username}</h2>
                    <button id="close-btn" class="circle-btn close-btn"></button>
                </div>
                <div class="col body padding">
                    <div id="post-wrapper"></div>
                    <comments-wrapper id="comments-wrapper" data-post-id='${this.id}'><comments-wrapper>
                </div>
                <div id="comment-creator" class="col footer shadow padding">
                    <commentcreator-c  data-post-id=${this.id}></commentcreator-c>
                </div>
            </div>

        </div>
        `
    }

    attachEventListeners() {
        this.shadowRoot.querySelector("commentcreator-c").addEventListener("comment-added", e => {
            this.handlelCommentAdded(e);
        });

        this.shadowRoot.querySelector("comments-wrapper").addEventListener("comments-updated", e => {
            this.state = e.detail;
            this.shadowRoot.querySelector("post-c").setAttribute("data-comments-count", this.state.comments_count) 
        });

        this.shadowRoot.querySelector("post-c").addEventListener("post-deleted", e => {
            this.remove();
        })

        this.shadowRoot.addEventListener("click", (event) => {
            if (event.target.id === "close-btn") this.remove();
            if (event.target.classList.contains("backdrop")) this.remove();
        })
    }

    updateCommentCount() {
        const commentsCount = this.state.comments.length; // Use local array length
        const postComponent = this.shadowRoot.querySelector("post-c");
        if (postComponent) {
            postComponent.setAttribute('data-comments-count', commentsCount);
        }
    }

    async handlelCommentAdded(e) {
        //
        const commentsWrapper = this.shadowRoot.querySelector("comments-wrapper");
        const screenloader = document.createElement("screen-loader");
        this.shadowRoot.appendChild(screenloader);
        screenloader.show();
        await commentsWrapper.render();
        setTimeout(() => {
            screenloader.hide();
            screenloader.remove();
        }, 200);
        this.scrollToComments();
    }


}

export default PostDetailsComponent
customElements.define("post-details", PostDetailsComponent);