import { loader } from "/static/js/utils/loader.js";
import Controller from "/static/js/controllers/controller.js";
import { navigateTo } from "/static/js/utils/router.js";

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
        // loader(this.renderCallback.bind(this), this.renderTimeoutCallback.bind(this));
        this.shadowRoot.innerHTML = await this.getHTMLTemplate();
       // this.shadowRoot.querySelector(".comments-wrapper").classList.add("hidden");
        this.comments = await this.loadComments();
        this.renderComments(this.comments);
        this.dispatchEvent(new CustomEvent("comments-updated", { detail: this.post }))
    }

    // async renderCallback() {
    //     this.shadowRoot.innerHTML = await this.getHTMLTemplate();
    //     this.shadowRoot.querySelector(".comments-wrapper").classList.add("hidden");
    //     this.comments = await this.loadComments();
    //     this.renderComments(this.comments);
    //     this.dispatchEvent(new CustomEvent("comments-updated", { detail: this.post }))
    // }

    // renderTimeoutCallback(){
    //     this.shadowRoot.querySelector(".comments-wrapper").classList.remove("hidden");
    // }

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
                    <p class="col body flex flex-col align-items-center justify-content-start">
                        <span class="username">${comment.author.username}</span></br>
                        <span class="content">${comment.body}</span>
                    </p>
                    <button id="delete-btn" class="delete-btn"></button>
                </div>
                <p><span>${comment.author.created_at}</span></p>
            </div>

        </li>`
        const elem = template.content.cloneNode(true);

        commentsList.appendChild(elem);
        this.shadowRoot.getElementById(`${comment.id}`).addEventListener("click", (e) => {
            console.log(e.target)
            if (e.target.id === "delete-btn") {
                console.log(e.target)
                console.log("comment id: ", comment.id, "post id: ", this.postId)
            } else if (e.target.matches(".profile-img")) {
                console.log("profile image clicked user id :", e.target);
                const id = e.target.id;
                const authorId = e.target.getAttribute("author");
                navigateTo(`/users/${authorId}`);
            }
        });

    }

    getProfileImage(comment) {
        let img = comment?.author?.profile_image;
        const profileImg = typeof img == "object" ? "/static/assets/images/default-user1.png" : img;
        const id = comment.id;
        const authorId = comment.author.id;
        return `<img class="profile-img" id=${id} author=${authorId} src=${profileImg} alt="profile image"/>`
    }

}

export default CommentsWrapper;
window.customElements.define("comments-wrapper", CommentsWrapper);