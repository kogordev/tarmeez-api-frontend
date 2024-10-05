import { navigateTo } from "/static/js/utils/router.js";
import Controller from "/static/js/controllers/controller.js";
import state from "/static/js/utils/state.js";

export default class PostCreator extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
        this.controller = new Controller();
        this.currentUser = null; // Initial value
    }

    connectedCallback() {
        this.currentUser = state.getCurrentUser();
        if(!this.currentUser) return;
        this.setup();
    }

    setup(){
        this.render();
        this.attachEventListeners();
    }

    render() {
        const img = this.currentUser?.user?.profile_image || "";
        const userId = this.currentUser.user.id;
        this.shadow.innerHTML = /*html*/`
            <link rel="stylesheet" href="/static/css/common.css"/>
            <link rel="stylesheet" href="/static/css/postcreator.css"/>
            <div class="card">
                <div class="input-wrapper grid col-3-custom container">
                    <div class="col flex justify-content-center align-items-start">
                        <img id="profile-img" data-user-id=${userId} src='${img}' alt="user profile image"/>
                    </div>
                    <div class="col">
                        <p>
                            <textarea  placeholder="What's on your mind?"></textarea>
                        </p>
                    </div>
                    <div id="upload-section" class="col flex">
                        <input id="file-input" type="file" accept="image/png, image/jpg, image/jpeg, image/gif"/>
                        <button id="upload-btn" type="button">Upload Image</button>
                        <button id="delete-btn" type="button" style="display: none;">Delete Image</button>
                    </div>
                </div>
                <div class="submit-wrapper flex justify-content-end">
                    <button id="submit-btn" disabled>Post</button>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        const elements = this.getElements();
        this.addEventListener("click", e => e.stopPropagation());

        elements.textarea.addEventListener("input", () => this.handleInput(elements.textarea, elements.submitBtn));
        elements.fileInput.addEventListener("change", e => this.handleFileSelection(e));
        elements.uploadBtn.addEventListener("click", () => elements.fileInput.click());
        elements.deleteBtn.addEventListener("click", this.handleDelete.bind(this));
        elements.submitBtn.addEventListener("click", this.handlePostSubmit.bind(this));
        elements.profileImg.addEventListener("click", e => navigateTo(`/users/${e.target.dataset.userId}`))
    }

    handleInput(textarea, btn) {
        this.resize(textarea);
        this.toggleSubmitBtn();
    }

    resize(textarea) {
        const p = textarea.parentElement;
        const minHeight = "5rem";

        // Reset height to auto to allow recalculation
        p.style.height = minHeight;

        // Set to content's scroll height if not empty
        if (textarea.value.trim()) {
            p.style.height = `${textarea.scrollHeight}px`;
        }
    }

    handleDelete() {
        const elements = this.getElements();
        elements.fileInput.value = "";
        elements.uploadBtn.classList.remove("active");
        elements.deleteBtn.style.display = "none";
        this.toggleSubmitBtn();
    }

    toggleSubmitBtn() {
        const elements = this.getElements();
        const isEmpty = elements.textarea.value.trim() === '';

        if (elements.fileInput.files.length > 0) {
            elements.uploadBtn.classList.add("active");
            elements.deleteBtn.style.display = "block";
        }

        if (!isEmpty || elements.fileInput.files.length > 0) {
            elements.submitBtn.removeAttribute("disabled");
        } else {
            elements.submitBtn.setAttribute("disabled", true);
        }
    }

    handleFileSelection(e) {
        this.toggleSubmitBtn(); // Update the submit button state based on file selection
    }

    async handlePostSubmit() {
        const content = this.shadow.querySelector("textarea").value.trim();
        if (!content) {
            console.log("Post content is empty!");
            return;
        }

        let response = null;

        try {

            const frmData = new FormData();
            frmData.append("body", content);

            const fileInput = this.shadow.querySelector("#file-input").files;
            if (fileInput.length > 0) frmData.append("image", fileInput[0]);

            const customHeader = {
                "Authorization": `Bearer ${this.currentUser.token}`,
            };

            response = await this.controller.request("/posts", "POST", frmData, customHeader);
        } catch (error) {
            console.error("Error while submitting post:", error);
        }finally{
            this.clearPost(); // Clear after successful post
            const event = new CustomEvent("finished", { detail: response });
            this.dispatchEvent(event);
        }

    }

    clearPost() {
        const elements = this.getElements();
        elements.textarea.value = "";
        elements.fileInput.value = "";
        elements.uploadBtn.classList.remove("active");
        elements.deleteBtn.style.display = "none";
        this.handleInput(elements.textarea, elements.submitBtn);
    }

    getElements() {
        return {
            textarea: this.shadow.querySelector("textarea"),
            submitBtn: this.shadow.querySelector("#submit-btn"),
            fileInput: this.shadow.querySelector("#file-input"),
            uploadBtn: this.shadow.querySelector("#upload-btn"),
            deleteBtn: this.shadow.querySelector("#delete-btn"),
            profileImg: this.shadow.querySelector("#profile-img")
        };
    }
}

window.customElements.define("postcreator-c", PostCreator);

