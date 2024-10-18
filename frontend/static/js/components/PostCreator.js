import { navigateTo } from "/static/js/utils/router.js";
import Controller from "/static/js/controllers/controller.js";
import state from "/static/js/utils/state.js";
import { reset, flex, grid, card } from "/static/js/utils/cssClasses.js";

function getCss() {
  const postCreatorStyles =  /*css*/`
  :host{
    display: block;
}
.post-creator{
  position: relative;
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.container{
    height: auto;
    padding: 1rem;
    overflow: hidden;
    position: relative;
    background-color: rgb(var(--clr-bg-secondary)); /* Secondary background */
    color: rgb(var(--clr-text-primary)); /* Primary text color */
}

p{
    width: 100%;
    height: 5rem;
    color: rgb(var(--clr-text-secondary)); /* Secondary text color */
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
    background-color: rgb(var(--clr-bg-tertiary)); /* Tertiary background */
    color: rgb(var(--clr-text-primary)); /* Primary text color */
    overflow: hidden;
  }
  textarea:focus{
    border: .2rem solid rgb(var(--clr-action-bg)); /* Focus state */
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
      background-color: rgb(var(--clr-accent-secondary)); /* Accent color for upload button */
      cursor: pointer;
  }
  
  .submit-wrapper{
      padding: 1rem;
      padding-right: 2rem;
      border-top: 1px solid rgb(var(--clr-border));
      position: relative;
  }
  
  .active{
      background-color: rgb(var(--clr-accent-primary)) !important;
  }
  
  #submit-btn{
      padding: 1rem;
      font-size: 1.6rem;
      font-weight: 600;  
      border: 0;
      background-color: rgb(var(--clr-submit-bg)); /* Submit button background */
      color: rgb(var(--clr-submit-text)); /* Submit button text */
      border-radius: var(--br);
      cursor: pointer;
      transition: background-color .3s;
  }
  
  #submit-btn:hover{
    background-color: rgb(var(--clr-submit-hover-bg)); /* Hover state */
    color: rgb(var(--clr-submit-hover-text)); /* Hover text color */
  }
  
  #submit-btn:disabled{
    background-color: rgb(var(--clr-disabled-bg)); /* Disabled button */
    color: rgb(var(--clr-disabled-text));
  }
  
  #upload-section{
      position: relative;
  }
  
  #delete-btn{
      position: absolute;
      display: none;
      height: 16px;
      width: 16px;
      background-color: rgb(var(--clr-danger-bg)); /* Danger background */
      mask-image: url("/static/assets/images/trash.svg");
      mask-position: center;
      mask-size: cover;
      cursor: pointer;
      top: 0;
      right: 0;
      transition: background-color .3s, transform .3;
  }
  
  #delete-btn:hover{
    background-color: rgb(var(--clr-danger-alert)); /* Hover state for delete */
      transform: scale(1.15);
  }
    
  .hidden{
      visibility:hidden;
  }
  
  .btn{
      border: none;
      height: 2.5rem;
      width: 2.5rem;
      cursor: pointer;
  }
  
  .padding {
      padding: 2rem;
  }
  
  .margin-view {
      margin-top: var(--nav-h);
      /* margin-top: calc(var(--nav-h) + 2rem); */
  }
  
  .wrapper {
      height: 100%;
      width: 100%;
  }
    
  .error{
    height: 100%;
    position: absolute;
    top: 5px;
    left: 0;
    color: rgb(var(--clr-danger-bg)); /* Error text color */
    padding: 1rem;
    font-size: 1.4rem;
  }
  `
  return "".concat(reset, flex, grid, card, postCreatorStyles);
}

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
    if (!this.currentUser) {
      this.remove();
      return ; // Ensure user is logged in
    }
      
    this.setup();
    this.style.display = "block";
  }

  setup() {
    this.addStyle();
    this.render();
    this.registerEventListeners();
  }


  addStyle() {
    const style = document.createElement("style");
    style.textContent = getCss().trim();
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
            <textarea placeholder="What's on your mind?" dir="auto"></textarea>            
        </div>
        <div id="upload-section" class="col flex">
          <input id="file-input" type="file" accept="image/*" hidden/>
          <button id="upload-btn" type="button"></button>
          <button id="delete-btn" type="button" style="display: none;"></button>
        </div>
      </div>
      <div class="submit-wrapper flex justify-content-end">
        <button id="submit-btn" disabled>Post</button>
      </div>
    </div>
    `
  }

  getProfileImg(img){
    if (typeof img === "object") return "/static/assets/images/default-user1.png";
    return img;
  }

  render() {
    const userId = this.currentUser.user.id;
    const profileImg = this.getProfileImg(this.currentUser.user.profile_image);
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
    textarea.style.minHeight = "5rem"; // Reset height for recalculation
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

  // async handlePostSubmit() {

  //   //
  //   loader(async () => {
  //     const { textarea, fileInput } = this.getElements();
  //     const content = textarea.value.trim();

  //     if (!content) {
  //       this.renderError("Post content is empty!");
  //       return;
  //     }

  //     const formData = new FormData();
  //     formData.append("body", content);
  //     if (fileInput.files.length > 0) formData.append("image", fileInput.files[0]);

  //     const headers = { Authorization: `Bearer ${this.currentUser.token}` };

  //     try {
  //       const response = await this.controller.request("/posts", "POST", formData, headers);
  //       if (response.status >= 200 && response.status < 300) {
  //         this.dispatchEvent(new CustomEvent("post-created", { detail: response.data }));
  //         this.clearPost(); // Clear the form on success
  //       } else {
  //         this.renderError("Post has not been created!");
  //       }
  //     } catch (error) {
  //       this.renderError(error.msg || "Failed to submit post. Please try again.");
  //     }
  //   })
  //   //
  // }

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

  smoothLoaderRemove(loader) {
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

