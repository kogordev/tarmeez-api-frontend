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
    if (this.postId) {
      this.render();
    } else {
      console.error("Post ID not provided.");
    }
  }

  async loadComments() {
    const url = `/posts/${this.postId}`;
    try {
      const response = await this.controller.request(url);
      const post = response.data;
      this.post = post;
      return post?.comments || [];
    } catch (error) {
      console.error("Failed to load comments:", error);
      return [];
    }
  }

  async render() {
    this.style.visibility = "hidden";
    this.shadowRoot.innerHTML = this.getHTMLTemplate();
    try {
      this.comments = await this.loadComments();
      this.renderComments(this.comments);
      this.dispatchEvent(
        new CustomEvent("comments-updated", { detail: this.post })
      );
    } catch (error) {
      this.displayError("Unable to render comments.");
    } finally { this.style.visibility = "visible"; }
  }

  async update() {
    try {
      // Fetch the latest comments
      const newComments = await this.loadComments();

      // Filter new comments that are not already in the current list
      const newOnlyComments = newComments.filter(
        (newComment) =>
          !this.comments.some((existingComment) => existingComment.id === newComment.id)
      );

      // Render the new comments only
      newOnlyComments.forEach((comment) => this.renderSingleComment(comment));

      // Update the current comments list with the new ones
      this.comments = [...this.comments, ...newOnlyComments];

     // console.log("Comments updated successfully.");
    } catch (error) {
      console.error("Error updating comments:", error);
    }
  }

  getHTMLTemplate() {
    return `
            <style>
                @import "/static/css/common.css";
                @import "/static/css/commentswrapper.css";
            </style>
            <div class="comments-wrapper">
                <ul id="comments-list" class="flex flex-col gap"></ul>
            </div>
        `;
  }

  renderComments(comments) {
    const commentsList = this.shadowRoot.querySelector("#comments-list");
    commentsList.innerHTML = ""; // Clear previous comments
    comments.forEach((comment) => this.renderSingleComment(comment));
  }

  renderSingleComment(comment) {
    const commentsList = this.shadowRoot.querySelector("#comments-list");

    const commentItem = document.createElement("li");
    commentItem.id = comment.id;
    commentItem.className = "comment flex gap";

    commentItem.innerHTML = `
            <div class="flex justify-content-center">
                ${this.getProfileImage(comment)}
            </div>
            <div class="body-wrapper">
                <div class="body-content flex-col gap">
                    <p class="col body flex flex-col justify-content-start">
                        <span class="username">${comment.author.username}</span>
                        <span class="content">${this.sanitizeText(comment.body)}</span>
                    </p>
                    <button id="delete-btn" class="delete-btn"></button>
                </div>
            </div>
        `;

    commentsList.appendChild(commentItem);

    commentItem.addEventListener("click", (e) =>
      this.handleCommentClick(e, comment)
    );
  }

  getProfileImage(comment) {
    let imgSrc = comment?.author?.profile_image;
    if (typeof imgSrc === "object") {
      imgSrc = "/static/assets/images/default-user1.png"
    }
    return `<img class="profile-img" id="profile-${comment.id}" author="${comment.author.id}" src="${imgSrc}" alt="profile image"/>`;
  }

  handleCommentClick(event, comment) {
    const target = event.target;

    if (target.id === "delete-btn") {
      console.log(`Delete comment id: ${comment.id}, post id: ${this.postId}`);
    } else if (target.matches(".profile-img")) {
      const authorId = target.getAttribute("author");
      navigateTo(`/users/${authorId}`);
    }
  }

  sanitizeText(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  displayError(message) {
    const commentsList = this.shadowRoot.querySelector("#comments-list");
    commentsList.innerHTML = `<li class="error">${message}</li>`;
  }

  addComment(comment) {
    this.renderSingleComment(comment);
    this.comments.push(comment); // Ensure comments list stays updated
  }
}

export default CommentsWrapper;
window.customElements.define("comments-wrapper", CommentsWrapper);
