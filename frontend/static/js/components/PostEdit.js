import Controller from "/static/js/controllers/controller.js";
import state from "/static/js/utils/state.js";
import { loader } from "/static/js/utils/loader.js";
import { reset, backdrop, flex, niceScrollbar } from "/static/js/utils/cssClasses.js";


function getCss(){
  const postEditStyles = /*css*/`
  .shadow {
    box-shadow: 0 0 .5rem rgba(0, 0, 0, 0.3);
  }

  .p {
      padding: 1rem;
  }

  :host {
      display: block;
  }

  .post-edit {
      display: grid;
      grid-template-rows:auto auto auto auto auto;
      width: 50rem;
      background-color: rgb(var(--clr-bg-secondary)) !important;
      box-shadow: 0 0 2rem rgb(0, 0, 0, 0.3);
      border-radius: var(--br);
      overflow: hidden;
  }

  .header {
      position: relative;
      padding: 1rem;
  }

  .user-info {
      padding-inline: 2rem;
      margin-bottom: 1rem;
  }

  .profile-img {
      height: 3.5rem;
      width: 3.5rem;
      object-fit: contain;
      border-radius: 50%;
  }

  .img-wrapper {
      padding: 1.5rem;
      border: 1px solid rgb(var(--clr-text-secondary)) !important;
      min-height: 50rem;
      overflow: hidden;
      width: 450px;
      height: 517.38px;
      border-radius: var(--br);
      position: relative;
  }

  .post-img {
      object-fit: cover;
      height: 100%;
      width: 100%;
  }

  .body {
      padding-top: 1rem;
      padding-inline: 2rem;
      max-height: 60vh;
      scroll-behavior: smooth;
      overflow: hidden;
      margin-bottom: .5rem;
  }
  .body:hover{
    overflow-y: auto;
  }

  .footer {
      margin-bottom: 3.5rem;
  }

  #submit-btn {
      border: none;
      background-color: rgb(var(--clr-action-bg)) !important;
      color: rgb(var(--clr-action-text)) !important;
      padding: 1.5rem;
      border-radius: var(--br);
      cursor: pointer;
      transition: background-color .3s;
  }

  #submit-btn:hover {
      background-color: rgb(var(--clr-action-hover-bg)) !important; /* Hover background (darker teal) */
      color: rgb(var(--clr-action-hover-text)) !important; /* White text for hover state */
  }

  #submit-btn:disabled {
      background-color: rgb(var(--clr-disabled-bg)) !important;
      color: rgb(var(--clr-disabled-text)) !important;
  }


  #remove-btn {
      border-radius: 50%;
      height: 3.5rem;
      width: 3.5rem;
      position: absolute;
      top: 1rem;
      right: 1rem;
      mask-image: url("/static/assets/images/close-button.svg");
      color: rgb(var(--clr-text-primary)) !important;
      z-index: 999;
  }

  span {
      font-size: 1.6rem;
  }

  .options {
      padding: 2rem;
  }

  input-c::part(input) {
      background-color: rgb(var(--clr-bg-tertiary)) !important;
      padding-top: 1.5rem;
      border: 1px solid rgb(var(--clr-secondary-foreground)) !important;
  }

  input-c::part(input):focus {
      border:.2rem solid rgb(var(--clr-action-bg)) !important;
  }

  .error-msg {
      margin-bottom: 1rem;
      color: red;
      font-size: 1.4rem;
  }

  #username {
      display: inline-block;
      font-size: 1.6rem;
      font-weight: 600;
      text-transform: capitalize;
  }

  #created-at {
      display: inline-block;
      font-weight: 300;
      font-size: 1.3rem;
  }

  .btn {
    border: none;
    mask-position: center;
    mask-repeat: no-repeat;
    mask-size: cover;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }

  #upload-btn {
      border: none;
      padding: 1.5rem;
      mask-image: url("/static/assets/images/img.svg");
      background-color: rgb(var(--clr-accent-primary)) !important;
  }

  .btn{
    border: none;
    height: 2.5rem;
    width: 2.5rem;
    cursor: pointer;
  }

  .circle-btn {
    border: none;
    border-radius: 50%;
    height: 2.5rem;
    width: 2.5rem;
    background-color: rgb(var(--clr-text-primary)) !important;
    cursor: pointer;
  }

  .close-btn {
    mask-image: url("/static/assets/images/close-button.svg");
    mask-position: center;
    mask-repeat: no-repeat;
    position: absolute;
    top: 1.25rem;
    right: 1.5rem;
  }`;

  return "".concat(reset, backdrop, flex,niceScrollbar, postEditStyles)
}


class PostEdit extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.controller = new Controller();
    this.state = null;
    this.currentUser = null;
    this.scrollY = 0;

    this.bindMethods();
  }

  bindMethods() {
    this.onUploadChange = this.onUploadChange.bind(this);
    this.onRemoveImage = this.onRemoveImage.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onBackdropClick = this.onBackdropClick.bind(this);
    this.onInputChanged = this.onInputChanged.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  async connectedCallback() {
    this.saveScrollPosition();
    this.style.display = "none";
    try {
      this.currentUser = await state.getCurrentUser();
      this.addStyle();
      this.render();
    } catch (error) {
      this.displayError("Failed to load user information. Please try again later.");
    }
    this.style.display = "block";
    this.restoreScrollPosition();
  }

  disconnectedCallback() {
    this.detachEvents();
   // document.body.style.overflowY = "auto"; because 
   this.dispatchEvent(new CustomEvent("closed"))
  }

  
  addStyle(){
    const style = document.createElement("style");
    style.textContent = getCss().trim();
    this.shadow.appendChild(style);
  }

  render() {
    document.body.style.overflowY = "hidden";
    this.style.visibility = "hidden";
    const { author = {}, body = "", image = "", created_at } = this.state || {};
    const profileImg = this.getProfileImage(author);
    const username = author.username || "Unknown";

    const template = document.createElement("template");

    template.innerHTML = this.getHTMLTemplate(profileImg, username, body, image, created_at);
    this.shadow.appendChild(template.content.cloneNode(true));
    this.toggleImageDisplay(typeof image !== "object");
    this.attachEvents();
    this.style.visibility = "visible";
    this.shadow.querySelector("input-c").focusInput();
  }

  getHTMLTemplate(profileImg, username, content, img, created_at) {
    return /*html*/`
      <div class="backdrop">
        <div class="post-edit">
          <div class="header flex flex-center">
            <h2>Edit post</h2>
            <button id="close-btn" class="circle-btn close-btn"></button>
          </div>
          <div class="user-info flex gap">
            <img loading="lazy" height="40" width="40" class="profile-img" src="${profileImg}" alt="profile image"/>
            <div class="flex flex-col ml-1">
              <span id="username">${username}</span>
              <span id="created-at">${created_at}</span>
            </div>
          </div>
          <div class="body niceScrollbar flex flex-col gap">
            <input-c data-input-value="${content}"></input-c>
            <div class="img-wrapper flex flex-center" style="display: none;">
              <img loading="lazy" width="466" height="517.38" class="post-img" src="${img}" alt="post image"/>
              <button id="remove-btn" class="btn"></button>
            </div>
          </div>
          <div class="options flex align-items-center gap">
            <span>Add to your post</span>
            <button id="upload-btn" class="btn"></button>
            <input type="file" id="upload-input" accept="image/*" hidden/>
          </div>
          <div class="footer flex flex-col flex-center">
            <div id="error-msg" class="error-msg"></div>
            <button id="submit-btn" disabled>Submit</button>
          </div>
        </div>
      </div>
    `;
  }

  attachEvents() {
    this.addEventListener("click", e => e.stopPropagation());
    this.shadow.querySelector("#close-btn")?.addEventListener("click", this.onClose);
    this.shadow.querySelector(".backdrop")?.addEventListener("click", this.onBackdropClick);
    this.shadow.querySelector("#upload-btn")?.addEventListener("click", () => this.shadow.querySelector("#upload-input").click());
    this.shadow.querySelector("#upload-input")?.addEventListener("change", this.onUploadChange);
    this.shadow.querySelector("#remove-btn")?.addEventListener("click", this.onRemoveImage);
    this.shadow.querySelector("input-c")?.addEventListener("input-changed", this.onInputChanged);
    this.shadow.querySelector("#submit-btn")?.addEventListener("click", this.onSubmit);
  }

  detachEvents() {
    this.shadow.querySelector("#close-btn")?.removeEventListener("click", this.onClose);
    this.shadow.querySelector(".backdrop")?.removeEventListener("click", this.onBackdropClick);
    this.shadow.querySelector("#upload-btn")?.removeEventListener("click", () => this.shadow.querySelector("#upload-input").click());
    this.shadow.querySelector("#upload-input")?.removeEventListener("change", this.onUploadChange);
    this.shadow.querySelector("#remove-btn")?.removeEventListener("click", this.onRemoveImage);
    this.shadow.querySelector("input-c")?.removeEventListener("input-changed", this.onInputChanged);
    this.shadow.querySelector("#submit-btn")?.removeEventListener("click", this.onSubmit);
  }

  onUploadChange(event) {
    const file = event.target.files[0];
    if (file) {
      this.readFileAsDataURL(file).then((result) => {
        const img = this.shadow.querySelector(".post-img");
        img.src = result;
        this.toggleImageDisplay(true);
        this.shadow.querySelector("#submit-btn").removeAttribute("disabled");
      });
    }
  }

  onRemoveImage() {
    const img = this.shadow.querySelector(".post-img");
    const uploadInput = this.shadow.querySelector("#upload-input");
    img.src = "";
    uploadInput.value = null;
    this.toggleImageDisplay(false);
    this.shadow.querySelector("#submit-btn").removeAttribute("disabled");
  }

  async onSubmit() {
    loader(async () => {
      const body = this.shadow.querySelector("input-c").inputValue;
      const uploadInput = this.shadow.querySelector("#upload-input");

      const formData = this.buildFormData(body, uploadInput);
      if (!formData) return;

      try {
        const url = `/posts/${this.state.id}`;
        const headers = { "Authorization": `Bearer ${this.currentUser.token}` };
        const response = await this.controller.request(url, "POST", formData, headers);
        if (response.status >= 200 && response.status < 300) {
          this.dispatchEvent(new CustomEvent("post-edited", { detail: response.data }));
        } else {
          this.displayError("Failed to edit the post. Please try again.");
        }
      } catch (error) {
        this.displayError("An error occurred while submitting the post. Please try again.");
      }
    });
  }


  buildFormData(body, uploadInput) {
    const thereIsFile = uploadInput.files.length > 0;
    const thereIsImg = this.shadow.querySelector(".post-img")?.getAttribute("src");

    if (typeof this.state.image === "string" && !thereIsFile && !thereIsImg) {
      // Display an error if there is no image selected and the original post has an image
      this.displayError("Please upload an image to proceed.");
      return null;  // Return `null` to indicate form data creation failed
    }

    const formData = new FormData();
    formData.append("body", body);
    formData.append("_method", "put");
    if (thereIsFile) formData.append("image", uploadInput.files[0]);

    return formData;
  }


  displayError(message) {
    const errorContainer = this.shadow.querySelector("#error-msg");
    if (errorContainer) {
      errorContainer.textContent = message;
      errorContainer.style.display = "block";
      setTimeout(() => (errorContainer.style.display = "none"), 5000);
    }
  }

  readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  getProfileImage(author) {
    return typeof author.profile_image === "object" ? "/static/assets/images/default-user1.png" : author.profile_image;
  }

  toggleImageDisplay(show) {
    const imgWrapper = this.shadow.querySelector(".img-wrapper");
    imgWrapper.style.display = show ? "flex" : "none";
  }

  saveScrollPosition() {
    this.scrollY = window.scrollY;
  }

  restoreScrollPosition() {
    window.scrollTo(0, this.scrollY);
  }

  onClose() {
    this.remove();
  }

  onBackdropClick(event) {
    if (event.target.classList.contains("backdrop")) this.remove();
  }

  onInputChanged() {
    this.shadow.querySelector("#submit-btn").removeAttribute("disabled");
  }
}

export default PostEdit;
window.customElements.define("post-edit", PostEdit);

