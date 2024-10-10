import { navigateTo } from "/static/js/utils/router.js";
import Controller from "/static/js/controllers/controller.js";
import state from "/static/js/utils/state.js"

class CommentCreator extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.controller = new Controller();
        this.currentUser = null;
        this.postId = null;
    }

    connectedCallback() {
        this.style.display = "none";
        this.currentUser = state.getCurrentUser();
        this.postId = this.dataset.postId;
        if (!(this.currentUser && this.postId)) return;

        this.render();
        const elements = this.getElements();
        this.attachEvents(elements);
        this.style.display = "block";
    }

    render() {
        const img = this.currentUser.user.profile_image;
        const profileImg = typeof img === "object" ? "/static/assets/images/default-user1.png" : img;
        this.shadowRoot.innerHTML = this.getHTMLTemplate(profileImg, this.currentUser.user.id);
    }

    getHTMLTemplate(profileImg, userId) {
        return /*html*/`
        <link rel="stylesheet" href="/static/css/commentcreator.css">
        <link rel="stylesheet" href="/static/css/common.css">
        <div class="comment-creator">
            <div class="col flex justify-content-center overflow-hidden">
                <img class="img" height="40" width="40" data-user-id=${userId}  src=${profileImg} alt="profile image"/>
            </div>
            <div class="col main">
                <input-c id="comment-input"></input-c>
                <div class="flex justify-content-end">
                    <button disabled></button>
                </div>
            </div>
        </div>
        `
    }

    getElements() {
        return {
            input: this.shadowRoot.querySelector("input-c"),
            btn: this.shadowRoot.querySelector("button"),
            profileImg: this.shadowRoot.querySelector(".img")
        }
    }

    attachEvents(elements) {

        elements.input.addEventListener("input", () => {
            this.handleInput(elements);
        });

        elements.btn.addEventListener("click", this.addComment.bind(this));
        elements.profileImg.addEventListener("click", e => navigateTo(`/users/${e.target.dataset.userId}`))
    }

    handleInput() {
        const textarea = this.shadowRoot.querySelector("input-c");
        const btn = this.shadowRoot.querySelector("button");

        if (textarea.inputValue === "") {
            btn.setAttribute("disabled", true);
        } else {
            btn.removeAttribute("disabled");
            btn.classList.add("active");
        }
    }

    clearInput() {
        this.shadowRoot.querySelector("input-c").inputValue = "";
    }


    async addComment() {
        const commentInput = this.shadowRoot.querySelector("#comment-input");
        const commentText = commentInput?.inputValue.trim();

        if (!commentText) {
            this.showError("Comment cannot be empty.");
            return;
        }

        try {
            const response = await this.controller.request(
                `/posts/${this.postId}/comments`,
                "POST",
                { body: commentText },
                { Authorization: `Bearer ${this.currentUser.token}` }
            );
            if (response?.data?.id) {
                this.dispatchEvent(new CustomEvent("comment-added", {detail: response.data}))
                this.clearInput();
                this.handleInput();
            } else {
                this.showError("Failed to add comment.");
            }
        } catch (error) {
            console.error("Error adding comment:", error);
            this.showError("An error occurred while adding the comment.");
        }
    }


    showError(message) {
        const errorElem = document.createElement("div");
        errorElem.textContent = message;
        errorElem.style.color = "red";
        errorElem.classList.add("error-message");
        this.shadowRoot.appendChild(errorElem);
        setTimeout(() => errorElem.remove(), 3000); // Remove error message after 3 seconds
    }

}

export default CommentCreator;
window.customElements.define("comment-creator", CommentCreator);