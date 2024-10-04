import Controller from "/static/js/controllers/controller.js";
class CommentsWrapper extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.controller = new Controller();
        this.postId = null;
        this.post = null;
        this.comments = [];
    }

    connectedCallback() {
        this.postId = this.dataset?.postId || null;
        if (!this.postId) return;
        this.render();
    }

    async loadComments() {
        try {
            const url = `/posts/${this.postId}`;
            const response = await this.controller.request(url);
            this.post = response.data;
            if (response.data?.hasOwnProperty("comments")) {
                return response.data.comments;
            }
            return [];
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async render() {
        this.shadowRoot.innerHTML = this.getHTMLTemplate();
        const commentsWrapper = this.shadowRoot.querySelector(".comments-wrapper");
        this.comments = await this.loadComments();
        this.renderComments(this.comments);
        commentsWrapper.classList.remove("hidden");
        this.dispatchEvent(new CustomEvent("comments-updated", {detail: this.post}))
    }

    getHTMLTemplate() {
        return /*html*/`
        <link rel="stylesheet" href="/static/css/common.css">
        <link rel="stylesheet" href="/static/css/commentswrapper.css">
        <div class="comments-wrapper">
            <ul id="comments-list" class="flex flex-col gap"></ul>
        </div>
        `
    }

    renderComments(comments) {
        for (let comment of comments) {
            this.renderSingleComment(comment);
        }
    }

    renderSingleComment(comment) {
        const commentsList = this.shadowRoot.querySelector("ul");
        if (!commentsList) {
            console.log("comment list not found");
            return
        };
        const template = document.createElement("template");
        template.innerHTML = /*html*/`
        <li id=${comment.id} class="comment flex gap">
            <div class="flex justify-content-center">
                ${this.getProfileImage(comment)}
            </div>
            <div class="body-wrapper">
                <div class="body-content flex gap">
                    <p class="col body flex align-items-center justify-content-start">
                        ${comment.body}
                    </p>
                    <button id="delete-btn" class="delete-btn"></button>
                </div>
                <p><span>${comment.author.created_at}</span></p>
            </div>

        </li>`
        const elem = template.content.cloneNode(true);
      //  elem.id = comment.id;
        commentsList.appendChild(elem);
        this.shadowRoot.getElementById(`${comment.id}`).addEventListener("click", (e)=>{
            if(e.target.id === "delete-btn"){
                console.log(e.target)
                console.log("comment id: ",comment.id, "post id: ", this.postId)
            }
        })
    }

    addComment(comment) {
        this.comments.push(comment);
        this.renderSingleComment(comment);
        this.dispatchEvent(new CustomEvent("comment-added", { detail: this.state.length }));
    }

    getProfileImage(comment) {
        let profilImage = comment?.author?.profile_image;
        if (typeof profilImage === "object") {
            return `<img src="/static/assets/images/default-user1.png" alt="profile image"/>`
        };
        return `<img src="${comment.author.profile_image}" alt="profile image"/>`;
    }

    updateComments() {

    }
}

export default CommentsWrapper;
window.customElements.define("comments-wrapper", CommentsWrapper);