import Controller from "/static/js/controllers/controller.js";

class PostDetails extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.controller = new Controller();
    this.postId = null;
    this.state = null;
    this.isChanged = false;
  }

  initializePostId() {
    try {
      this.postId = this.dataset.postId;
    } catch (error) {
      this.postId = null;
      console.log(error);
    }
  }

  async getPostDetails(id) {
    try {
      const url = `/posts/${id}`;
      const response = await this.controller.request(url);
      return response.data;
    } catch (error) {
      console.log(error);
      this.isChanged = false;
      return null;
    }
  }

  async initializeState() {
    this.state = await this.getPostDetails(this.postId);
  }

  async connectedCallback() {
    this.style.display = "none";
    this.initializePostId();
    await this.initializeState();
    if (!(this.postId && this.state)) return;
    await this.render();
    this.style.display = "block";
  }

  disconnectedCallback() {
    document.body.style.overflowY = "auto";
    this.dispatchEvent(
      new CustomEvent("closed", { detail: { isChanged: this.isChanged } })
    );
  }

  getCss(){
    return /*css*/`
    :host {
      display: block;
      transition: visibility .3s;
  }
  *{
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    font-size: 1.6rem;
  }
  
  .backdrop {
      display: flex;
      justify-content: center;
      align-items: center;
      position: fixed;
      inset: 0 0 0 0;
      height: 100vh;
      width: 100vw;
      background-color: rgba(var(--clr-bg-secondary), .8);
      z-index: 9999;
  }
  
  .post-details {
      display: grid;
      grid-template-rows: 5rem auto auto;
      width: 680px;
      background-color: rgb(var(--clr-bg-secondary));
      box-shadow: 0 0 2rem  rgb(0, 0, 0, 0.3);
      border-radius: var(--br);
      position: relative;
      max-height: 90vh;
  }
    
  .body{
      max-height: 70vh;
      width: auto;
      overflow: hidden;
      scroll-behavior: smooth;
      scrollbar-width: thin;
      scrollbar-color: rgb(var(--clr-text-secondary)) rgb(var(--clr-bg-secondary));
      margin-bottom: 1.5rem;
  }
/* WebKit scrollbar styles (for Chrome, Safari, Edge) */
.body::-webkit-scrollbar {
  width: 8px; /* Customize scrollbar width */
}

.body::-webkit-scrollbar-thumb {
  background-color: rgb(var(--clr-text-secondary)); /* Scrollbar thumb color */
}

.body::-webkit-scrollbar-track {
  background-color: rgb(var(--clr-bg-secondary)); /* Scrollbar track color */
}

/* Hide scrollbar arrows in WebKit browsers */
.body::-webkit-scrollbar-button {
  display: none;
}

  .body:hover{
    overflow: hidden auto;
  }

  .shadow{
      box-shadow: 0 0 .5rem rgba(0 ,0, 0, 0.3);
  }
  
  .p{
      padding: 1rem;
  }
  .footer{
    padding: 1rem;
  }
  .flex{
    display: flex;
  }
  .flex-col{
    flex-direction: column;
  }
  .flex-center{
    justify-content: center;
    align-items: center;
  }
  .circle-btn {
    border: none;
    border-radius: 50%;
    height: 2.5rem;
    width: 2.5rem;
    background-color: rgb(var(--clr-text-primary));
    cursor: pointer;
}

.close-btn {
    mask-image: url("/static/assets/images/close-button.svg");
    mask-position: center;
    mask-repeat: no-repeat;
    position: absolute;
    top: 1.25rem;
    right: 1.5rem;
}

.btn{
    border: none;
    height: 2.5rem;
    width: 2.5rem;
    cursor: pointer;
}
.footer{
  position: relative;
}
    `
  }

  addStyle(){
    const style = document.createElement("style");
    style.textContent = this.getCss().trim();
    this.shadowRoot.appendChild(style);
  }

  async render() {
    document.body.style.overflowY = "hidden";
    this.addStyle();
    this.renderHTMLTemplate();
    await this.addPostComp();
    await this.addCommentsWrapper();
    await this.addCommentCreator();
    this.attachEventListeners();
  }

  renderHTMLTemplate() {
    const template = document.createElement("template");
    template.innerHTML = this.getHTMLTemplate().trim();
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
  

  getHTMLTemplate() {
    const username = this.state.author.username;

    return /*html*/ `
        <div class="backdrop">
            <div class="post-details">
                <div class="col header flex flex-center shadow">
                    <h2>Post by ${username}</h2>
                    <button id="close-btn" class="circle-btn close-btn"></button>
                </div>
                <div class="col body">
                    <div id="post-section"></div>
                    <div id="comments-wrapper-section"></div>
                </div>
                <div id="comment-creator-section" class="col footer shadow"></div>
            </div>
        </div>
        `;
  }

  async addPostComp() {
    const postSection = this.shadowRoot.querySelector("#post-section");
    const postComp = await document.createElement("post-c");

    // Preload image and set dimensions if necessary
    const imageSrc = this.state?.image; // Assuming your state contains an image URL
    if (typeof imageSrc === "string") {
      const { width, height } = await this.preloadImage(imageSrc);
      postComp.style.setProperty("--img-width", `${width}px`);
      postComp.style.setProperty("--img-height", `${height}px`);
    }

    postComp.state = this.state;
    postComp.setAttribute("withCount", "true");
    postSection.appendChild(postComp);
  }

  // Helper function to preload the image and get its dimensions
  preloadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = () => reject(new Error("Failed to load image"));
    });
  }

  async addCommentsWrapper() {
    const commentsWrapperSection = this.shadowRoot.querySelector(
      "#comments-wrapper-section"
    );
    const commentsWrapper = await document.createElement("comments-wrapper");
    commentsWrapper.dataset.postId = this.postId;
    commentsWrapperSection.appendChild(commentsWrapper);
  }

  async addCommentCreator() {
    const commentsCreatorSection = this.shadowRoot.querySelector(
      "#comment-creator-section"
    );
    const commentCreator = await document.createElement("comment-creator");
    commentCreator.dataset.postId = this.postId;
    commentsCreatorSection.appendChild(commentCreator);
  }

  attachEventListeners() {
    this.shadowRoot
      .querySelector("comment-creator")
      .addEventListener("comment-added", (e) => {
        this.handleCommentAdded(e);
      });

    this.shadowRoot
      .querySelector("comments-wrapper")
      .addEventListener("comments-updated", (e) => {
        this.state = e.detail;
        this.shadowRoot
          .querySelector("post-c")
          .setAttribute("data-comments-count", this.state.comments_count);
      });

    this.shadowRoot
      .querySelector("post-c")
      .addEventListener("post-deleted", (e) => {
        this.dispatchEvent(
          new CustomEvent("post-deleted", { detail: e.detail })
        );
      });

    this.shadowRoot.addEventListener("click", (event) => {
      if (event.target.id === "close-btn") this.remove();
      if (event.target.classList.contains("backdrop")) this.remove();
    });
  }

  async handleCommentAdded(e) {
    this.state = await this.getPostDetails(this.postId);
    this.shadowRoot
      .querySelector("post-c")
      .updateCommentCount(this.state.comments_count);
    this.shadowRoot.querySelector("comments-wrapper").update();
    this.isChanged = true;
    this.scrollToComments();
  }

    scrollToComments() {
    const postBody = this.shadowRoot.querySelector(".body");
    const scrHeight = postBody.scrollHeight;
    setTimeout(() => {
      postBody.scroll({ behavior: "smooth", top: scrHeight });
    }, 200);
  }
  
}

export default PostDetails;
customElements.define("post-details", PostDetails);
