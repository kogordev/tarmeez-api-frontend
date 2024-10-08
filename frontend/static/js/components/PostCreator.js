import { navigateTo } from "/static/js/utils/router.js";
import Controller from "/static/js/controllers/controller.js";
import state from "/static/js/utils/state.js";
import { loader } from "/static/js/utils/loader.js"

export default class PostCreator extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.controller = new Controller();
    this.currentUser = null;
  }

  connectedCallback() {
    this.currentUser = state.getCurrentUser();
    if (!this.currentUser) return; // Ensure user is logged in
    this.setup();
  }

  setup() {
    this.render();
    this.registerEventListeners();
  }

  render() {
    this.style.visibility = "hidden";
    const profileImg = this.currentUser?.user?.profile_image || "";
    const userId = this.currentUser.user.id;
    this.shadow.innerHTML = /*html*/ `
      <link rel="stylesheet" href="/static/css/common.css"/>
      <link rel="stylesheet" href="/static/css/postcreator.css"/>
      <div class="card">
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
    `;
    this.style.visibility = "visible";
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
    loader(async () => {
      const { textarea, fileInput } = this.getElements();
      const content = textarea.value.trim();

      if (!content) {
        console.log("Post content is empty!");
        return;
      }

      const formData = new FormData();
      formData.append("body", content);
      if (fileInput.files.length > 0) formData.append("image", fileInput.files[0]);

      const headers = { Authorization: `Bearer ${this.currentUser.token}` };

      try {
        const response = await this.controller.request("/posts", "POST", formData, headers);
        if (response.status >= 200 && response.status < 300) {
          this.dispatchEvent(new CustomEvent("post-created", { detail: response.data }));
          this.clearPost(); // Clear the form on success
        }
      } catch (error) {
        console.error("Error while submitting post:", error);
        this.renderError("Failed to submit post. Please try again.");
      }
    })
  }

  renderError(message) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.innerHTML = `<h2>Error</h2><p>${this.escapeHTML(message)}</p>`;
    this.shadow.appendChild(errorDiv);
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

