import { navigateTo } from "/static/js/utils/router.js";
import Controller from "/static/js/controllers/controller.js";
import state from "/static/js/utils/state.js";

export default class PostCreator extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.controller = new Controller();
    this.currentUser = null;
  }

  connectedCallback() {
    this.style.display = "none";
    this.currentUser = state.getCurrentUser();
    if (!this.currentUser) return; // Ensure user is logged in
    this.setup();
    this.style.display = "block";
  }

  setup() {
    this.addStyle();
    this.render();
    this.registerEventListeners();
  }

  getCss() {
    return /*css*/`
    :host{
      display: block;
  }
  .post-creator{
    position: relative;
  }
  
  .container{
      height: auto;
      padding: 1rem;
      overflow: hidden;
      position: relative;
  }
  
  p{
      width: 100%;
      height: 5rem;
  }
  
  textarea{
      width: 100%;
      /* height: 100%; */
      height: 5rem;
      font-size: 1.8rem;
      padding: 1.25rem;
      outline: none;
      resize: none;
      border-radius: var(--br);
      border: 0;
      background-color: rgb(var(--clr-tertiary-background));
      color: rgb(var(--clr-tertiary-foreground));
      overflow: hidden;
    }
    textarea:focus{
      border: .2rem solid rgb(var(--clr-active-background));
    }
    
    #profile-img{
        /* height: 45px;
        width: 45px; */
        border-radius: 50%;
        object-fit: cover;
        cursor: pointer;
    }
    
    #file-input{
        display: none;
    }
    
    #upload-btn{
        border: 0;
        height: 25px;
        width: 25px;
        margin-top: 1.25rem;
        mask-image: url("/static/assets/images/img.svg");
        -webkit-mask-image: url("/static/assets/images/img.svg");
        mask-position: center;
        mask-size: cover;
        background-color: rgb(var(--clr-main-foreground));
        cursor: pointer;
    }
    
    .submit-wrapper{
        padding: 1rem;
        padding-right: 2rem;
        border-top: 1px solid rgb(var(--clr-border));
        position: relative;
    }
    
    .active{
        background-color: rgb(var(--clr-active-background)) !important;
    }
    
    #submit-btn{
        padding: 1rem;
        font-size: 1.6rem;
        font-weight: 600;  
        border: 0;
        background-color: rgb(var(--clr-active-background)); 
        color: rgb(var(--clr-active-foreground));
        border-radius: var(--br);
        cursor: pointer;
        transition: background-color .3s;
    }
    
    #submit-btn:hover{
      background-color: rgb(var(--clr-active-hover-background));
    }
    
    #submit-btn:disabled{
        background-color: rgb(var(--clr-main-disabled-background));
        color: rgb(var(--clr-main-disabled-foreground));
    }
    
    #upload-section{
        position: relative;
    }
    
    #delete-btn{
        position: absolute;
        display: none;
        height: 16px;
        width: 16px;
        background-color: rgb(var(--clr-danger));
        mask-image: url("/static/assets/images/trash.svg");
        mask-position: center;
        mask-size: cover;
        cursor: pointer;
        top: 0;
        right: 0;
        transition: background-color .3s, transform .3;
    }
    
    #delete-btn:hover{
        background-color: rgb(255, 99, 99);
        transform: scale(1.15);
    }
    
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    
    .d-hidden{
        display: none;
    }
    
    .hidden{
        visibility:hidden;
    }
    
    .overflow-hidden{
        overflow: hidden;
    }
    
    .circle-btn {
        border: none;
        border-radius: 50%;
        height: 2.5rem;
        width: 2.5rem;
        background-color: rgb(var(--clr-main-foreground));
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
    
    .post-btn{
        mask-image: url("/static/assets/images/send.svg");
        mask-position: center;
        mask-repeat: no-repeat;
        position: absolute;
        top: 1.25rem;
        right: 1.5rem;
        background-color: rgb(var(--clr-main-foreground));
        transition: transform .5s, background-color .5s;
    }
    
    .post-btn:hover{
        transform: rotate(45deg);
        background-color: rgb(var(--clr-tarmeez-light));
    }
    
    .post-btn:disabled{
        background-color: rgb(var(--clr-secondary-foreground));
    }
    
    .main-color {
        background-color: rgb(var(--clr-main-background));
        color: rgb(var(--clr-main-foreground));
    }
    
    .padding {
        padding: 2rem;
    }
    
    .padding-view {
        padding-top: calc(var(--nav-h) + 4rem);
    }
    
    .margin-view {
        margin-top: var(--nav-h);
        /* margin-top: calc(var(--nav-h) + 2rem); */
    }
    
    .wrapper {
        height: 100%;
        width: 100%;
    }
    
    .card {
        width: 680px;
        background-color: rgb(var(--clr-secondary-background));
        color: rgb(var(--clr-main-foreground));
        border-radius: var(--br);
    }
    
    .ml-1{
        margin-left: 1rem;
    }
    
    .mb-1 {
        margin-bottom: 1rem;
    }
    
    .flex {
        display: flex;
    }
    
    .flex-col {
        flex-direction: column;
    }
    
    .flex-center {
        justify-content: center;
        align-items: center;
    }
    
    .justify-content-center {
        justify-content: center;
    }
    
    .justify-content-between {
        justify-content: space-between;
    }
    
    .justify-content-start {
        justify-content: start;
    }
    
    .justify-content-end {
        justify-content: end;
    }
    
    .gap {
        gap: 1rem;
    }
    
    .align-items-center {
        align-items: center;
    }
    
    .align-items-top {
        align-items: start;
    }
    
    .grid {
        display: grid;
        gap: 1rem;
    }
    
    .col-2 {
        grid-template-columns: 45px 1fr;
    }
    
    .col-3 {
        grid-template-columns: repeat(3, 1fr);
    }
    
    .col-3-custom {
        grid-template-columns: 45px 1fr 45px;
    }
    
    .bg-transparent {
        background-color: transparent;
    }
    
    .backdrop {
        overflow: initial;
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        inset: 0 0 0 0;
        height: 100vh;
        width: 100vw;
        background-color: rgba(var(--clr-secondary-background), .8);
        z-index: 9999;
    }
    .error{
      height: 100%;
      position: absolute;
      top: 5px;
      left: 0;
      color: rgb(var(--clr-danger));
      padding: 1rem;
      font-size: 1.4rem;
    }
    `
  }

  addStyle() {
    const style = document.createElement("style");
    style.textContent = this.getCss().trim();
    this.shadow.appendChild(style);
  }

  getHTMLTemplate(userId, profileImg) {
    return /*html*/`    

    <div class="card post-creator">
      <div class="input-wrapper grid col-3-custom container">
        <div class="col flex justify-content-center align-items-start">
          <img id="profile-img" height="45" width="45" data-user-id="${userId}" src="${profileImg}" alt="User profile image"/>
        </div>
        <div class="col">            
            <textarea placeholder="What's on your mind?"></textarea>            
        </div>
        <div id="upload-section" class="col flex">
          <input id="file-input" type="file" accept="image/*" hidden/>
          <button id="upload-btn" type="button">Upload Image</button>
          <button id="delete-btn" type="button" style="display: none;">Delete Image</button>
        </div>
      </div>
      <div class="submit-wrapper flex justify-content-end">
        <button id="submit-btn" disabled>Post</button>
      </div>
    </div>
    `
  }

  render() {
    const userId = this.currentUser.user.id;
    const profileImg = this.currentUser?.user?.profile_image || "";
    const template = document.createElement("template");
    template.innerHTML = this.getHTMLTemplate(userId, profileImg).trim();
    this.shadow.appendChild(template.content.cloneNode(true));
  }

  registerEventListeners() {
    this.addEventListener("click", e => e.stopPropagation());

    const { textarea, uploadBtn, fileInput, deleteBtn, submitBtn, profileImg } = this.getElements();

    textarea.addEventListener("input", () => this.handleInput());
    fileInput.addEventListener("change", () => this.handleFileSelection());
    uploadBtn.addEventListener("click", () => fileInput.click());
    deleteBtn.addEventListener("click", () => this.handleDelete());
    submitBtn.addEventListener("click", () => this.handlePostSubmit());
    profileImg.addEventListener("click", (e) => navigateTo(`/users/${e.target.dataset.userId}`));
  }

  handleInput() {
    const { textarea } = this.getElements();
    this.resizeTextarea(textarea);
    this.updateButtonState();
    this.shadow.querySelector(".error-message")?.remove();
  }

  resizeTextarea(textarea) {
    textarea.style.height = "5rem"; // Reset height for recalculation
    if (textarea.value.trim()) {
      textarea.style.height = `${textarea.scrollHeight}px`; // Set to content's scroll height
    }
  }

  handleFileSelection() {
    this.updateButtonState(); // Enable or disable the submit button based on file presence
    this.shadow.querySelector(".error-message")?.remove();
  }

  handleDelete() {
    const { fileInput, uploadBtn, deleteBtn } = this.getElements();
    fileInput.value = ""; // Clear the file input
    uploadBtn.classList.remove("active");
    deleteBtn.style.display = "none";
    this.updateButtonState();
    this.shadow.querySelector(".error-message")?.remove();
  }

  updateButtonState() {
    const { textarea, fileInput, submitBtn, uploadBtn, deleteBtn } = this.getElements();
    const isEmpty = textarea.value.trim() === "";
    const hasFile = fileInput.files.length > 0;

    if (hasFile) {
      uploadBtn.classList.add("active");
      deleteBtn.style.display = "block";
    } else {
      uploadBtn.classList.remove("active");
      deleteBtn.style.display = "none";
    }

    // Enable the submit button if either text or image is present
    if (!isEmpty || hasFile) {
      submitBtn.removeAttribute("disabled");
    } else {
      submitBtn.setAttribute("disabled", true);
    }
  }

  async handlePostSubmit() {
    //
    const loader = document.createElement("processing-c");
    this.shadow.querySelector(".post-creator").appendChild(loader);

    new Promise(async (resolve, reject) => {
      //
      const { textarea, fileInput } = this.getElements();
      const content = textarea.value.trim();

      if (!content) {
        reject("Post content is empty!");
        return;
      }

      const formData = new FormData();
      formData.append("body", content);
      if (fileInput.files.length > 0) formData.append("image", fileInput.files[0]);

      const headers = { Authorization: `Bearer ${this.currentUser.token}` };

      try {
        const response = await this.controller.request("/posts", "POST", formData, headers);
        if (response.status >= 200 && response.status < 300) {
          resolve(true)
          this.dispatchEvent(new CustomEvent("post-created", { detail: response.data }));
          this.clearPost(); // Clear the form on success
        } else {
          reject("Post has not been created!");
        }
      } catch (error) {
        reject(error.msg || "Failed to submit post. Please try again.");
      }
      //
    }).
      then(() => this.smoothLoaderRemove(loader))
      .catch(error => {        
        this.smoothLoaderRemove(loader);
        this.renderError(error);
      });
    //
  }

  smoothLoaderRemove(loader){
    loader.style.visibility = "hidden";
    setTimeout(() => {
        loader.remove();
    }, 300);
  }


  renderError(message) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.innerHTML = /*html*/`<p class="error">${this.escapeHTML(message)}</p>`;
    this.shadow.querySelector(".submit-wrapper").appendChild(errorDiv);
    setTimeout(() => {
      errorDiv.remove();
    }, 5000);
  }

  clearPost() {
    const { textarea, fileInput, submitBtn } = this.getElements();
    textarea.value = "";
    fileInput.value = "";
    this.updateButtonState(); // Reset the state and button
    submitBtn.setAttribute("disabled", true);
  }

  escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  getElements() {
    return {
      textarea: this.shadow.querySelector("textarea"),
      submitBtn: this.shadow.querySelector("#submit-btn"),
      fileInput: this.shadow.querySelector("#file-input"),
      uploadBtn: this.shadow.querySelector("#upload-btn"),
      deleteBtn: this.shadow.querySelector("#delete-btn"),
      profileImg: this.shadow.querySelector("#profile-img"),
    };
  }
}

window.customElements.define("post-creator", PostCreator);

