import Controller from "/static/js/controllers/controller.js";
import { navigateTo } from "/static/js/utils/router.js";
import { reset, flex } from "/static/js/utils/cssClasses.js";

function  getCss() {
  const commentsWrapper = /*css*/`
  .comments-wrapper{
    border-top: 1px solid rgb(var(--clr-border)) !important;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    gap: 1.5rem;
  }   
  ul{
      list-style: none;
      padding-left: 1rem;
  }    
  .comment{
      font-size: 1.6rem;
      width: auto;
      /*background: green*/
  }    
  img{
      height: 3.5rem;
      width: 3.5rem;
      margin-top: 1rem;
      border-radius: 50%;
      object-fit: cover;
      cursor: pointer;
  }   
  span{
      font-size: 1rem;
      color: rgb(var(--clr-bg-secondary)) !important;
  }   
  .body{
      display: inline-block;
      background-color: rgb(var(--clr-bg-tertiary)) !important;
      border-radius: 1.2rem;
      padding: 1rem;
      width: auto;
  }    
  .username{
      display: block;
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
      letter-spacing: .1rem;
      text-transform: capitalize;
      color: rgb(var(--clr-text-primary)) !important;
  }   
  .content{
      display: block;
      font-size: 1.5rem;
      text-indent: .5rem;
      color: rgb(var(--clr-text-secondary)) !important;
  }
  .clickable{
    color: rgb(var(--clr-link));
  }   
  `
  return "".concat(reset, flex, commentsWrapper);
}

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
    this.style.display = "none";
    this.postId = this.dataset?.postId || null;
    if (this.postId) {
      this.addStyle();
      this.render();
    } else {
      console.error("Post ID not provided.");
    }
    this.style.display = "block";
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

  addStyle(){
    const style = document.createElement("style");
    style.textContent = getCss().trim();
    this.shadowRoot.appendChild(style);
  }

  async render() {
    this.style.visibility = "hidden";
    const template = document.createElement("template");
    template.innerHTML = this.getHTMLTemplate();
    this.shadowRoot.appendChild(template.content.cloneNode(true));
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

  /**
 * Convert URLs in the given text to clickable links
 * @param {string} text - The post content text
 * @returns {string} - Text with URLs converted to <a> tags
 */
  formatLinks(text) {
    const urlPattern = /(https?:\/\/[^\s]+)/g; // Match HTTP or HTTPS URLs
    return text.replace(urlPattern, (url) => `<a  href="${url}" class="clickable" target="_blank">${url}</a>`);
  }


  renderSingleComment(comment) {
    const commentsList = this.shadowRoot.querySelector("#comments-list");
    const formatedBody = this.formatLinks(comment.body);

    const commentItem = document.createElement("li");
    commentItem.id = comment.id;
    commentItem.className = "comment flex gap align-items-start";

    commentItem.innerHTML = `
            <div class="flex justify-content-center">
                ${this.getProfileImage(comment)}
            </div>
            <div class="body-wrapper">
                <div class="body-content flex-col gap">
                    <p class="col body flex flex-col justify-content-start">
                        <span class="username">${comment.author.username}</span>
                        <span class="content">${formatedBody}</span>
                    </p>
                </div>
            </div>
        `;

    commentsList.appendChild(commentItem);

    commentItem.addEventListener("click", (e) =>
      this.handleCommentClick(e, comment)
    );

    commentItem.querySelector(".content")?.addEventListener("click", e => this.handleLinkClick(e));
  }

  // Prevent default event handling for anchor tags to ensure links open correctly
  handleLinkClick(event) {
    if (event.target.tagName.toLowerCase() === 'a') {
      event.stopPropagation();
      return;
    }
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
