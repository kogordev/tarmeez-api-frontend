import Controller from "/static/js/controllers/controller.js";
import state from "/static/js/utils/state.js";
import { navigateTo } from "/static/js/utils/router.js";
import { isRTL } from "/static/js/utils/utils.js";
import { reset, flex } from "/static/js/utils/cssClasses.js";


function  getCss() {
  const postStyles = /*css*/`
  *{
    font-size: 1.5rem;
  }
  a {
    color: rgb(var(--clr-text-primary)); /* Use primary text color for links */
    text-decoration: none;
  }

  a:hover {
      text-decoration: underline;
  }

  .navlink-img::part(wrapper):hover {
      background-color: inherit;
  }

  .navlink-img::part(img) {
      height: 40px;
      width: 40px;
      border-radius: 50%;
      object-fit: cover;
  }

  .shadow {
      box-shadow: var(--shadow-sm);
  }

  .shadow-lg {
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
  }

  .wrapper {
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      z-index: 1;
  }

  .post {
      width: 680px;
      background-color: rgb(var(--clr-bg-secondary)); /* Use secondary background for post */
      color: rgb(var(--clr-text-primary)); /* Use primary text color */
      border-radius: 10px;
      position: relative;
      transition: background-color .5s;
  }

  .post__header {
      height: 48.23;
      margin: 0 0 12px;
      padding: 12px 8px 0;
      /*padding: 12px 16px 0;*/
      display: flex;
      position: relative;
  }

  .post__profile__img {
      width: 50px;
      position: relative;
  }

  .post__link__img {
      margin-right: 10px;
      object-fit: cover;
      border-radius: 50%;
  }
  
  .post__info {
      width: 562px;
      height: 46.23;
      margin: -5px 0px;
      line-height: 1.2;
  }

  .post__info__wrapper {
      display: flex;
      align-items: center;
  }

  .post__username {
      position: relative;
      font-weight: 600; /* Bold for username */
      color: rgb(var(--clr-text-primary)); /* Primary text color */
  }

  .post__info__username {
      margin: 8px 0 0;
  }

  .post__info__username__link {
      font-weight: 600;
      text-decoration: none;
      color: inherit;
      cursor: pointer;
      text-transform: capitalize;
  }

  .post__info__time {
      height: 18.25px;
      position: relative;
      color: rgb(var(--clr-text-secondary)); /* Secondary text color for time */
  }

  .post__info__time__link {
      text-decoration: none;
      color: rgb(var(--clr-text-secondary));
      font-size: 1.1rem;
  }

  .post__menu {
      visibility: hidden;
      position: absolute;
      top: 70%;
      right: 4.7%;
      font-size: 1rem;
  }

  .post__menu__caret {
      fill: rgb(var(--clr-bg-secondary));
      background-color: transparent;
      position: relative;
      right: -12.9rem;
      z-index: 2;
      transform: rotate(180deg)
  }

  .post__menu__body {
      width: 150px;
      font-weight: 600;
      padding: 5px 7px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      position: relative;
      right: 0%;
      margin-top: -4%;
      background-color: rgb(var(--clr-bg-secondary));
      border-radius: 10px 0 10px 10px;
  }

  .post__menu__svg {
      fill: rgb(var(--clr-text-secondary));
  }

  .post__menu__body hr {
      border: none;
      height: .5px;
      background-color: rgba(var(--clr-text-secondary), .3);
      width: 90%;
      margin: 0 auto;
  }

  .post__menu__item {
      white-space: nowrap;
      cursor: pointer;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: start;
      gap: 8px;
      padding: 10px;
  }

  .post__menu__item:hover {
      background-color: rgb(var(--clr-hover-bg));
  }

  .post__button {
      border: none;
      outline: none;
      height: 36px;
      width: 36px;
      border-radius: 50%;
      background-color: inherit;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
  }

  .post__button__svg {
      fill: rgb(var(--clr-text-primary));
  }

  .post__button:hover {
      background-color: rgb(var(--clr-hover-bg));
  }

  #chbx {
      visibility: hidden;
  }

  #chbx:checked~.post__menu {
      visibility: visible;
  }

  .post__body {
      padding: 4px 20px 16px;

  }

  .post__img__wrapper {
      max-height: 750px;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      cursor: pointer;
      background-color: rgb(var(--clr-bg-tertiary))
  }

  .post__img {
      object-fit: cover;
      /* from post details*/
      width: var(--img-width);
      height: var(--img-height);
  }

  .post__comments__wrapper {
      height: 43px;
      margin: 0px 16px;
      padding: 10px 0px;
      display: flex;
      align-items: center;
      justify-content: end;
  }
  .clickable{
    color: rgb(var(--clr-link));
  }

  .newPost{
    background-color: rgba(var(--clr-accent-primary), .6) !important;
  }

#profile-img{
  border-radius: 50%;
  cursor: pointer;
}

  /* Add other styles here */
      `;

return "".concat(reset, flex, postStyles);
}


export default class PostComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.state = null;
    this.controller = new Controller();
    this.currentUser = null;
  }

  elements() {
    return {
      profileImg: this.shadowRoot.querySelector("#profile-img"),
      usernameWrapper: this.shadowRoot.querySelector(".post__username"),
      usernameLink: this.shadowRoot.querySelector("#username-link"),
      postBody: this.shadowRoot.querySelector(".post__body"),
      postImg: this.shadowRoot.querySelector("#post-img"),
      menuBtn: this.shadowRoot.querySelector(".post__button"),
      menuBtnSvg: this.shadowRoot.querySelector(".post__button__svg"),
      editBtn: this.shadowRoot.querySelector("#edit-btn"),
      deleteBtn: this.shadowRoot.querySelector("#delete-btn"),
    };
  }

  connectedCallback() {
    if (!this.state) {
      this.remove();  
      return
    };

    this.initializeComponent();
  }

  async initializeComponent() {
    this.currentUser = state.getCurrentUser();
    this.id = this.state.id;

    await this.render();
    const elements = this.elements();
    this.attachEventListeneres(elements);
  }

  // Renders the component's HTML structure
  async render() {
    this.addStyle();
    this.style.visibility = "hidden";
    const profileImage = this.getProfileImage();
    const profileImageElement = new Image();
    profileImageElement.src = profileImage;


    const  postImage = this.getPostImage();
    let postImageElement = new Image();
    if(postImage){
      postImageElement.src = postImage;
      try {
        await Promise.all([this.preloadImage(profileImageElement), this.preloadImage(postImageElement)]);
        this.renderComponent(profileImage, postImage);
      } catch (error) {
        console.error('Image loading failed:', error);
        // Render even if the image failed to load
        this.renderComponent(profileImage, null);
      }
    } else {
      this.renderComponent(profileImage, null);
    }
  
  }

  preloadImage(image){
    return new Promise((resolve, reject) => {
      image.onload = () => resolve(image);
      image.onerror = () => reject;
    })
  }

  renderComponent(profileImage, postImage){
    const profileUrl = this.getProfileUrl();
    // Convert URLs in the post content to clickable links
    const formattedBody = this.formatLinks(this.state.body);

    const template = document.createElement("template");
    template.innerHTML = this.getHTMLTemplate(
      profileImage,
      formattedBody,
      postImage,
      profileUrl
    );

    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.style.visibility = "visible";
    this.dispatchEvent(new CustomEvent("renderFinished"));
  }

  addStyle() {
    const style = document.createElement("style");
    style.textContent = getCss().trim();
    this.shadowRoot.appendChild(style);
  }

  // Gets the author’s profile image or returns the default image
  getProfileImage() {
    return typeof this.state.author.profile_image === "string"
      ? this.state.author.profile_image
      : "/static/assets/images/default-user1.png";
  }

  // Gets the post image or returns null
  getPostImage() {
    return typeof this.state.image === "string" ? this.state.image : null;
  }

  // Returns the URL to the author's profile
  getProfileUrl() {
    return `/users/${this.state.author.id}`;
  }

  /**
   * Convert URLs in the given text to clickable links
   * @param {string} text - The post content text
   * @returns {string} - Text with URLs converted to <a> tags
   */
  formatLinks(text) {
    const urlPattern = /(https?:\/\/[^\s]+)/g; // Match HTTP or HTTPS URLs
    return text.replace(urlPattern, (url) => `<a href="${url}" class="clickable" target="_blank">${url}</a>`);
  }


  // Generates the HTML structure for the post component
  getHTMLTemplate(profileImage, formattedBody, postImage, profileUrl) {
    return /*html*/ `
            <article class="post shadow">
                <div class="post__header">
                    <div class="post__profile__img flex flex-center">
                        <img height="40" width="40" id="profile-img" src="${profileImage}" alt="profile image"/>
                    </div>
                    <div class="post__info">
                        ${this.getUsernameTemplate()}
                        <div class="post__info__wrapper post__info__time">
                            <a id="created-at-link" href="#" class="post__info__time__link">${this.state.created_at}</a>
                        </div>
                    </div>
                    ${this.getPostMenu()}
                </div>
                ${this.renderBody(formattedBody)}
                <div  class="post__img__wrapper">
                    <img id="post-img" src="${postImage}" height="auto" width="auto" alt="" class="post__img">
                </div>
                <div class="post__comments__wrapper">
                    <a href="#" id="comments-link" class="post__comments__link">
                      <span id="comments-count">${this.state.comments_count}</span>
                       comments
                    </a>
                </div>
            </article>
        `;
  }

  // Returns the post menu
  getPostMenu() {
    if (this.state.author?.id === this.currentUser?.user?.id) {
      return /*html*/ `
            <input type="checkbox" id="chbx">
            <div class="post__menu">
                <svg class="post__menu__caret" height="12" viewBox="0 0 21 12" width="21" fill="currentColor">
                    <path d="M21 0c-2.229.424-4.593 2.034-6.496 3.523L5.4 10.94c-2.026 2.291-5.434.62-5.4-2.648V0h21Z"></path>
                </svg>
                <div class="post__menu__body shadow-lg">
                    ${this.getMenuItems()}
                </div>
            </div>
            <label  class="post__button" for="chbx">
                <svg class="post__button__svg" width="20" height="20" xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                    <path
                        d="M8 256a56 56 0 1 1 112 0A56 56 0 1 1 8 256zm160 0a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm216-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112z" />
                </svg>
            </label>
        `;
    }
    return "";
  }

  // Returns the menu items
  getMenuItems() {
    return /*html*/ `
            <label id="edit-btn" class="post__menu__item" for="chbx">
                <svg class="post__menu__svg" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32z"></path>
                </svg>
                <span>Edit post</span>
            </label>
            <hr>
            <label id="delete-btn" class="post__menu__item" for="chbx">
                <svg class="post__menu__svg" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
                </svg>
                <span>Delete post</span>
            </label>
        `;
  }


  // Returns the username template
  getUsernameTemplate() {
    return /*html*/ `
            <div class="post__info__wrapper post__info__username">
                <div class="post__username">
                    <a id="username-link" class="post__info__username__link">${this.state.author.username}</a>
                </div>
            </div>
        `;
  }

  renderBody(body){
    const justify = isRTL(body) ? "end" : "start";
    return `<p id="body" class="post__body flex justify-content-${justify}">${body}</p>`
  }

  attachEventListeneres(elements) {
    if (!this.getAttribute("withCount")) {
      this.shadowRoot
        .getElementById("comments-link")
        ?.addEventListener("click", this.showComments.bind(this));
    }

    document.addEventListener("click", (e) => this.handleMenuToggle(e));
    if (elements.editBtn) {
      elements.editBtn.addEventListener("click", this.editPost.bind(this));
    }

    if (elements.deleteBtn) {
      elements.deleteBtn.addEventListener(
        "click",
        this.triggerDelete.bind(this)
      );
    }

    if (elements.postImg) {
      elements.postImg.addEventListener("click", () => {
        const imgViewer = document.createElement("img-viewer");
        imgViewer.image = this.state.image;
        this.shadowRoot.appendChild(imgViewer)
      })
    }

    // Handle links inside the post body correctly
    elements.postBody?.addEventListener("click", this.handleLinkClick.bind(this));

    // Handle links inside the post body correctly
    elements.usernameWrapper?.addEventListener("click", this.handleLinkClick.bind(this));

    // Handle username link 
    elements.usernameLink.addEventListener("click", () => navigateTo(`/users/${this.state.author.id}`))

    // 
    elements.profileImg.addEventListener("click", () => navigateTo(`/users/${this.state.author.id}`))
  }

  // Prevent default event handling for anchor tags to ensure links open correctly
  handleLinkClick(event) {
    if (event.target.tagName.toLowerCase() === 'a') {
      event.stopPropagation();
      return;
    }
  }

  async showComments() {
    try {
      const postDetails = document.createElement("post-details");
      postDetails.dataset.postId = this.state.id;
      this.shadowRoot.appendChild(postDetails);
      postDetails.addEventListener("closed", (e) => {
        if (e.detail.isChanged) {
          //	console.log("post state is changed");
          this.updateState();
          this.dispatchEvent(new CustomEvent("state-changed", { detail: this.state }));
        }
      });
      postDetails.addEventListener("post-deleted", () => {
        this._dispatchEvent("post-deleted", { detail: this.state });
        this.remove();
      });
    } catch (error) {
      console.log(error);
    }
  }

  updateCommentCount(value) {
    const commentsLink = this.shadowRoot.querySelector("#comments-link");
    if (commentsLink) {
      try {
        commentsLink.querySelector("span").textContent = value;
      } catch (error) {
        console.log("failed to update comments count", error);
      }
    }
  }

  editPost() {
    const postEdit = document.createElement("post-edit");
    postEdit.state = this.state;
    postEdit.addEventListener("post-edited", e => {
      this.updateState();
      postEdit.remove();
    });
    postEdit.addEventListener("closed", ()=> document.body.style.overflowY = "auto")
    this.shadowRoot.appendChild(postEdit);
  }

  triggerDelete() {
    const confirmationComp = document.createElement("confirmation-c");
    confirmationComp.msg = "Are you sure you want to delete this post?";
    this.shadowRoot.appendChild(confirmationComp);
    confirmationComp.addEventListener("delete-confirm", (e) =>
      this.handleDeleteConfrimation(e, confirmationComp)
    );
  }

  async handleDeleteConfrimation(e, confirmationComp) {
    const { isConfirm } = e.detail;
    if (isConfirm) {
      // Delete
      const token = this.currentUser.token;
      const url = `/posts/${this.state.id}`;
      try {
        const customHeader = {
          Authorization: `Bearer ${token}`,
        };
        const response = await this.controller.request(
          url,
          "DELETE",
          null,
          customHeader
        );

        if (response.status >= 200 && response.status < 300) {
          this._dispatchEvent("post-deleted", { detail: response.data });
        }
      } catch (error) {
        console.log(error);
      }
    }
    confirmationComp.remove();
  }

  _dispatchEvent(name, value) {
    const event = new CustomEvent(name, value);
    this.dispatchEvent(event);
  }

  handleMenuToggle(e) {
    const chbx = this.shadowRoot.querySelector("#chbx");
    const menuBtn = this.shadowRoot.querySelector(".post__button");
    const menu = this.shadowRoot.querySelector(".post__menu");

    e.preventDefault();
    e.stopPropagation();

    if (!menu) return;

    //check if user click outside menu to close it
    if (
      menu.contains(e.composedPath()[0]) ||
      menuBtn.contains(e.composedPath()[0])
    ) {
      chbx.checked = !chbx.checked;
    } else {
      chbx.checked = false;
    }
  }

  async update() {
    try {
      const response = await this.controller.request("/posts/" + this.state.id);
      if (response?.status >= 200 && response?.status < 300) {
        this.state = response.data;
      }
    } catch (error) {
      console.log("failed to load post data", error);
    }
  }

  updateHTML() {
    //
    const profileImage = this.shadowRoot.querySelector("#profile-img"); // data-img data-to
    profileImage.setAttribute("data-img", this.getProfileImage());
    profileImage.setAttribute("data-to", this.getProfileUrl());

    const usernameLink = this.shadowRoot.querySelector("#username-link");
    usernameLink.textContent = this.state.author.username;

    const createdAtLink = this.shadowRoot.querySelector("#created-at-link");
    if (createdAtLink) createdAtLink.textContent = this.state.created_at;

    const body = this.shadowRoot.querySelector("#body");
    body.innerHTML = this.formatLinks(this.state.body.trim());

    const postImg = this.shadowRoot.querySelector("#post-img");
    postImg.src = this.getPostImage();

    const commentsCount = this.shadowRoot.querySelector("#comments-count");
    commentsCount.textContent = this.state.comments_count;
  }

  async updateState() {
    await this.update();
    this.updateHTML();
  }

  setAsNewAdded(){
    console.log(this.shadowRoot.querySelector(".post"))
    this.shadowRoot.querySelector(".post").classList.add("newPost");
    setTimeout(() => {
      this.shadowRoot.querySelector(".post").classList.remove("newPost");  
    }, 1000);
  }
}

customElements.define("post-c", PostComponent);
// import Controller from "/static/js/controllers/controller.js";
// import state from "/static/js/utils/state.js";
// import { navigateTo } from "/static/js/utils/router.js";
// import { isRTL } from "/static/js/utils/utils.js";

// export default class PostComponent extends HTMLElement {
//   constructor() {
//     super();
//     this.attachShadow({ mode: "open" });
//     this.state = null;
//     this.controller = new Controller();
//     this.currentUser = null;
//   }

//   elements() {
//     return {
//       usernameWrapper: this.shadowRoot.querySelector(".post__username"),
//       usernameLink: this.shadowRoot.querySelector("#username-link"),
//       postBody: this.shadowRoot.querySelector(".post__body"),
//       postImg: this.shadowRoot.querySelector("#post-img"),
//       menuBtn: this.shadowRoot.querySelector(".post__button"),
//       menuBtnSvg: this.shadowRoot.querySelector(".post__button__svg"),
//       editBtn: this.shadowRoot.querySelector("#edit-btn"),
//       deleteBtn: this.shadowRoot.querySelector("#delete-btn"),
//     };
//   }

//   connectedCallback() {
//     this.style.display = "none";
//     this.initializeComponent();
//     this.style.display = "block";
//   }

//   getCss() {
//     return /*css*/`
//     *{
//       margin: 0;
//       padding: 0;
//       box-sizing: border-box;
//       font-size: 1.5rem;
//     }
//     a {
//       color: rgb(var(--clr-text-primary)); /* Use primary text color for links */
//       text-decoration: none;
//     }

//     a:hover {
//         text-decoration: underline;
//     }

//     .navlink-img::part(wrapper):hover {
//         background-color: inherit;
//     }

//     .navlink-img::part(img) {
//         height: 40px;
//         width: 40px;
//         border-radius: 50%;
//         object-fit: cover;
//     }

//     .shadow {
//         box-shadow: 0 0 5px -2px rgba(0, 0, 0, 0.3);
//     }

//     .shadow-lg {
//         box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
//     }

//     .wrapper {
//         height: 100%;
//         width: 100%;
//         display: flex;
//         justify-content: center;
//         z-index: 1;
//     }

//     .post {
//         width: 680px;
//         background-color: rgb(var(--clr-bg-secondary)); /* Use secondary background for post */
//         color: rgb(var(--clr-text-primary)); /* Use primary text color */
//         border-radius: 10px;
//         position: relative;
//         transition: background-color .5s;
//     }

//     .post__header {
//         height: 48.23;
//         margin: 0 0 12px;
//         padding: 12px 16px 0;
//         display: flex;
//         position: relative;
//     }

//     .post__profile__img {
//         width: 50px;
//         position: relative;
//     }

//     .post__link__img {
//         margin-right: 10px;
//         object-fit: cover;
//         border-radius: 50%;
//     }
    
//     .post__info {
//         width: 562px;
//         height: 46.23;
//         margin: -5px 0px;
//         line-height: 1.2;
//     }

//     .post__info__wrapper {
//         display: flex;
//         align-items: center;
//     }

//     .post__username {
//         position: relative;
//         font-weight: 600; /* Bold for username */
//         color: rgb(var(--clr-text-primary)); /* Primary text color */
//     }

//     .post__info__username {
//         margin: 8px 0 0;
//     }

//     .post__info__username__link {
//         font-weight: 600;
//         text-decoration: none;
//         color: inherit;
//         cursor: pointer;
//         text-transform: capitalize;
//     }

//     .post__info__time {
//         height: 18.25px;
//         position: relative;
//         color: rgb(var(--clr-text-secondary)); /* Secondary text color for time */
//     }

//     .post__info__time__link {
//         text-decoration: none;
//         color: rgb(var(--clr-text-secondary));
//         font-size: 1.1rem;
//     }

//     .post__menu {
//         visibility: hidden;
//         position: absolute;
//         top: 70%;
//         right: 4.7%;
//         font-size: 1rem;
//     }

//     .post__menu__caret {
//         fill: rgb(var(--clr-bg-secondary));
//         background-color: transparent;
//         position: relative;
//         right: -12.9rem;
//         z-index: 2;
//         transform: rotate(180deg)
//     }

//     .post__menu__body {
//         width: 150px;
//         font-weight: 600;
//         padding: 5px 7px;
//         display: flex;
//         flex-direction: column;
//         gap: 6px;
//         position: relative;
//         right: 0%;
//         margin-top: -4%;
//         background-color: rgb(var(--clr-bg-secondary));
//         border-radius: 10px 0 10px 10px;
//     }

//     .post__menu__svg {
//         fill: rgb(var(--clr-text-secondary));
//     }

//     .post__menu__body hr {
//         border: none;
//         height: .5px;
//         background-color: rgba(var(--clr-text-secondary), .3);
//         width: 90%;
//         margin: 0 auto;
//     }

//     .post__menu__item {
//         white-space: nowrap;
//         cursor: pointer;
//         border-radius: 10px;
//         display: flex;
//         align-items: center;
//         justify-content: start;
//         gap: 8px;
//         padding: 10px;
//     }

//     .post__menu__item:hover {
//         background-color: rgb(var(--clr-hover-bg));
//     }

//     .post__button {
//         border: none;
//         outline: none;
//         height: 36px;
//         width: 36px;
//         border-radius: 50%;
//         background-color: inherit;
//         cursor: pointer;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//     }

//     .post__button__svg {
//         fill: rgb(var(--clr-text-primary));
//     }

//     .post__button:hover {
//         background-color: rgb(var(--clr-hover-bg));
//     }

//     #chbx {
//         visibility: hidden;
//     }

//     #chbx:checked~.post__menu {
//         visibility: visible;
//     }

//     .post__body {
//         padding: 4px 20px 16px;

//     }

//     .post__img__wrapper {
//         max-height: 750px;
//         display: flex;
//         justify-content: center;
//         align-items: center;
//         overflow: hidden;
//         cursor: pointer;
//         background-color: rgb(var(--clr-bg-tertiary))
//     }

//     .post__img {
//         object-fit: cover;
//         /* from post details*/
//         width: var(--img-width);
//         height: var(--img-height);
//     }

//     .post__comments__wrapper {
//         height: 43px;
//         margin: 0px 16px;
//         padding: 10px 0px;
//         display: flex;
//         align-items: center;
//         justify-content: end;
//     }
//     .clickable{
//       color: rgb(var(--clr-link));
//     }

//     .newPost{
//       background-color: rgba(var(--clr-accent-primary), .6) !important;
//     }
    
// .flex {
//   display: flex;
// }

// .flex-col {
//   flex-direction: column;
// }

// .flex-center {
//   justify-content: center;
//   align-items: center;
// }

// .justify-content-center {
//   justify-content: center;
// }

// .justify-content-between {
//   justify-content: space-between;
// }

// .justify-content-start {
//   justify-content: start;
// }

// .justify-content-end {
//   justify-content: end;
// }

// .gap {
//   gap: 1rem;
// }

// .align-items-center {
//   align-items: center;
// }

// .align-items-top {
//   align-items: start;
// }

//     /* Add other styles here */
//         `;
//   }

//   addStyle() {
//     const style = document.createElement("style");
//     style.textContent = this.getCss().trim();
//     this.shadowRoot.appendChild(style);
//   }

//   initializeComponent() {
//     this.currentUser = state.getCurrentUser();
//     this.render();
//     const elements = this.elements();
//     this.attachEventListeneres(elements);
//   }


//   // Renders the component's HTML structure
//   render() {
//     if (!this.state) return;

//     this.addStyle();
//     this.style.visibility = "hidden";
//     this.id = this.state.id;
//     const profileImage = this.getProfileImage();
//     const postImage = this.getPostImage();
//     const profileUrl = this.getProfileUrl();
//     // Convert URLs in the post content to clickable links
//     const formattedBody = this.formatLinks(this.state.body);

//     const template = document.createElement("template");
//     template.innerHTML = this.getHTMLTemplate(
//       profileImage,
//       formattedBody,
//       postImage,
//       profileUrl
//     );

//     this.shadowRoot.appendChild(template.content.cloneNode(true));
//     this.style.visibility = "visible";
//   }

//   // Gets the author’s profile image or returns the default image
//   getProfileImage() {
//     return typeof this.state.author.profile_image === "string"
//       ? this.state.author.profile_image
//       : "/static/assets/images/default-user1.png";
//   }

//   // Gets the post image or returns null
//   getPostImage() {
//     return typeof this.state.image === "string" ? this.state.image : null;
//   }

//   // Returns the URL to the author's profile
//   getProfileUrl() {
//     return `/users/${this.state.author.id}`;
//   }

//   /**
//    * Convert URLs in the given text to clickable links
//    * @param {string} text - The post content text
//    * @returns {string} - Text with URLs converted to <a> tags
//    */
//   formatLinks(text) {
//     const urlPattern = /(https?:\/\/[^\s]+)/g; // Match HTTP or HTTPS URLs
//     return text.replace(urlPattern, (url) => `<a href="${url}" class="clickable" target="_blank">${url}</a>`);
//   }


//   // Generates the HTML structure for the post component
//   getHTMLTemplate(profileImage, formattedBody, postImage, profileUrl) {
//     return /*html*/ `
//             <article class="post shadow">
//                 <div class="post__header">
//                     <div class="post__profile__img flex flex-center">
//                         <navlink-c id="profile-img" class="navlink-img" data-img="${profileImage}" data-to="${profileUrl}"></navlink-c>
//                     </div>
//                     <div class="post__info">
//                         ${this.getUsernameTemplate()}
//                         <div class="post__info__wrapper post__info__time">
//                             <a id="created-at-link" href="#" class="post__info__time__link">${this.state.created_at}</a>
//                         </div>
//                     </div>
//                     ${this.getPostMenu()}
//                 </div>
//                 ${this.renderBody(formattedBody)}
//                 <div  class="post__img__wrapper">
//                     <img id="post-img" src="${postImage}" height="auto" width="auto" alt="" class="post__img">
//                 </div>
//                 <div class="post__comments__wrapper">
//                     <a href="#" id="comments-link" class="post__comments__link">
//                       <span id="comments-count">${this.state.comments_count}</span>
//                        comments
//                     </a>
//                 </div>
//             </article>
//         `;
//   }

//   // Returns the post menu
//   getPostMenu() {
//     if (this.state.author?.id === this.currentUser?.user?.id) {
//       return /*html*/ `
//             <input type="checkbox" id="chbx">
//             <div class="post__menu">
//                 <svg class="post__menu__caret" height="12" viewBox="0 0 21 12" width="21" fill="currentColor">
//                     <path d="M21 0c-2.229.424-4.593 2.034-6.496 3.523L5.4 10.94c-2.026 2.291-5.434.62-5.4-2.648V0h21Z"></path>
//                 </svg>
//                 <div class="post__menu__body shadow-lg">
//                     ${this.getMenuItems()}
//                 </div>
//             </div>
//             <label  class="post__button" for="chbx">
//                 <svg class="post__button__svg" width="20" height="20" xmlns="http://www.w3.org/2000/svg"
//                     viewBox="0 0 448 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
//                     <path
//                         d="M8 256a56 56 0 1 1 112 0A56 56 0 1 1 8 256zm160 0a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm216-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112z" />
//                 </svg>
//             </label>
//         `;
//     }
//     return "";
//   }

//   // Returns the menu items
//   getMenuItems() {
//     return /*html*/ `
//             <label id="edit-btn" class="post__menu__item" for="chbx">
//                 <svg class="post__menu__svg" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
//                     <path d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32z"></path>
//                 </svg>
//                 <span>Edit post</span>
//             </label>
//             <hr>
//             <label id="delete-btn" class="post__menu__item" for="chbx">
//                 <svg class="post__menu__svg" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
//                     <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
//                 </svg>
//                 <span>Delete post</span>
//             </label>
//         `;
//   }


//   // Returns the username template
//   getUsernameTemplate() {
//     return /*html*/ `
//             <div class="post__info__wrapper post__info__username">
//                 <div class="post__username">
//                     <a id="username-link" class="post__info__username__link">${this.state.author.username}</a>
//                 </div>
//             </div>
//         `;
//   }

//   renderBody(body){
//     const justify = isRTL(body) ? "end" : "start";
//     return `<p id="body" class="post__body flex justify-content-${justify}">${body}</p>`
//   }

//   attachEventListeneres(elements) {
//     if (!this.getAttribute("withCount")) {
//       this.shadowRoot
//         .getElementById("comments-link")
//         ?.addEventListener("click", this.showComments.bind(this));
//     }

//     document.addEventListener("click", (e) => this.handleMenuToggle(e));
//     if (elements.editBtn) {
//       elements.editBtn.addEventListener("click", this.editPost.bind(this));
//     }

//     if (elements.deleteBtn) {
//       elements.deleteBtn.addEventListener(
//         "click",
//         this.triggerDelete.bind(this)
//       );
//     }

//     if (elements.postImg) {
//       elements.postImg.addEventListener("click", () => {
//         const imgViewer = document.createElement("img-viewer");
//         imgViewer.image = this.state.image;
//         this.shadowRoot.appendChild(imgViewer)
//       })
//     }

//     // Handle links inside the post body correctly
//     elements.postBody?.addEventListener("click", this.handleLinkClick.bind(this));

//     // Handle links inside the post body correctly
//     elements.usernameWrapper?.addEventListener("click", this.handleLinkClick.bind(this));

//     // Handle username link 
//     elements.usernameLink.addEventListener("click", () => navigateTo(`/users/${this.state.author.id}`))
//   }

//   // Prevent default event handling for anchor tags to ensure links open correctly
//   handleLinkClick(event) {
//     if (event.target.tagName.toLowerCase() === 'a') {
//       event.stopPropagation();
//       return;
//     }
//   }

//   async showComments() {
//     try {
//       const postDetails = document.createElement("post-details");
//       postDetails.dataset.postId = this.state.id;
//       this.shadowRoot.appendChild(postDetails);
//       postDetails.addEventListener("closed", (e) => {
//         if (e.detail.isChanged) {
//           //	console.log("post state is changed");
//           this.updateState();
//           this.dispatchEvent(new CustomEvent("state-changed", { detail: this.state }));
//         }
//       });
//       postDetails.addEventListener("post-deleted", () => {
//         this._dispatchEvent("post-deleted", { detail: this.state });
//         this.remove();
//       });
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   updateCommentCount(value) {
//     const commentsLink = this.shadowRoot.querySelector("#comments-link");
//     if (commentsLink) {
//       try {
//         commentsLink.querySelector("span").textContent = value;
//       } catch (error) {
//         console.log("failed to update comments count", error);
//       }
//     }
//   }

//   editPost() {
//     const postEdit = document.createElement("post-edit");
//     postEdit.state = this.state;
//     postEdit.addEventListener("post-edited", e => {
//       this.updateState();
//       postEdit.remove();
//     });
//     postEdit.addEventListener("closed", ()=> document.body.style.overflowY = "auto")
//     this.shadowRoot.appendChild(postEdit);
//   }

//   triggerDelete() {
//     const confirmationComp = document.createElement("confirmation-c");
//     confirmationComp.msg = "Are you sure you want to delete this post?";
//     this.shadowRoot.appendChild(confirmationComp);
//     confirmationComp.addEventListener("delete-confirm", (e) =>
//       this.handleDeleteConfrimation(e, confirmationComp)
//     );
//   }

//   async handleDeleteConfrimation(e, confirmationComp) {
//     const { isConfirm } = e.detail;
//     if (isConfirm) {
//       // Delete
//       const token = this.currentUser.token;
//       const url = `/posts/${this.state.id}`;
//       try {
//         const customHeader = {
//           Authorization: `Bearer ${token}`,
//         };
//         const response = await this.controller.request(
//           url,
//           "DELETE",
//           null,
//           customHeader
//         );

//         if (response.status >= 200 && response.status < 300) {
//           this._dispatchEvent("post-deleted", { detail: response.data });
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     }
//     confirmationComp.remove();
//   }

//   _dispatchEvent(name, value) {
//     const event = new CustomEvent(name, value);
//     this.dispatchEvent(event);
//   }

//   handleMenuToggle(e) {
//     const chbx = this.shadowRoot.querySelector("#chbx");
//     const menuBtn = this.shadowRoot.querySelector(".post__button");
//     const menu = this.shadowRoot.querySelector(".post__menu");

//     e.preventDefault();
//     e.stopPropagation();

//     if (!menu) return;

//     //check if user click outside menu to close it
//     if (
//       menu.contains(e.composedPath()[0]) ||
//       menuBtn.contains(e.composedPath()[0])
//     ) {
//       chbx.checked = !chbx.checked;
//     } else {
//       chbx.checked = false;
//     }
//   }

//   async update() {
//     try {
//       const response = await this.controller.request("/posts/" + this.state.id);
//       if (response?.status >= 200 && response?.status < 300) {
//         this.state = response.data;
//       }
//     } catch (error) {
//       console.log("failed to load post data", error);
//     }
//   }

//   updateHTML() {
//     //
//     const profileImage = this.shadowRoot.querySelector("#profile-img"); // data-img data-to
//     profileImage.setAttribute("data-img", this.getProfileImage());
//     profileImage.setAttribute("data-to", this.getProfileUrl());

//     const usernameLink = this.shadowRoot.querySelector("#username-link");
//     usernameLink.textContent = this.state.author.username;

//     const createdAtLink = this.shadowRoot.querySelector("#created-at-link");
//     if (createdAtLink) createdAtLink.textContent = this.state.created_at;

//     const body = this.shadowRoot.querySelector("#body");
//     body.innerHTML = this.formatLinks(this.state.body.trim());

//     const postImg = this.shadowRoot.querySelector("#post-img");
//     postImg.src = this.getPostImage();

//     const commentsCount = this.shadowRoot.querySelector("#comments-count");
//     commentsCount.textContent = this.state.comments_count;
//   }

//   async updateState() {
//     await this.update();
//     this.updateHTML();
//   }

//   setAsNewAdded(){
//     this.shadowRoot.querySelector(".post").classList.add("newPost");
//     setTimeout(() => {
//       this.shadowRoot.querySelector(".post").classList.remove("newPost");  
//     }, 1000);
//   }
// }

// customElements.define("post-c", PostComponent);
