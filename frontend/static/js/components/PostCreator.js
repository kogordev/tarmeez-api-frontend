import Controller from "/static/js/controllers/controller.js"

export default class PostCreator extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
        this.controller = new Controller();
        this.loader = document.querySelector("screenloader-c");
    }

    connectedCallback() {
        const img = this.dataset.img;
        this.render(img);
        this.attachEventListeners();
    }

    render(img) {
        this.shadow.innerHTML = /*html*/`
        <link rel="stylesheet" href="/static/css/common.css"/>
        <link rel="stylesheet" href="/static/css/postcreator.css"/>
        <div class="card">
            <div class="input-wrapper grid col-3-custom container">
                <div class="col flex justify-content-center align-items-start">
                    <img id="profile-img" src=${img} alt="user profile image"/>
                </div>
                <div class="col">
                    <p>
                        <textarea  placeholder="What's on your mind?"></textarea>
                    </p>
                </div>
                <div id="upload-section" class="col flex">
                    <input id="file-input" type="file" accept="image/png, image/jpg, image/jpeg, image/gif"/>
                    <button id="upload-btn"></button>
                    <button id="delete-btn"></button>
                </div>
            </div>
            <div class="submit-wrapper flex justify-content-end">
                <button id="submit-btn" disabled=true>Post</button>
            </div>
        </div>
        `
    }

    attachEventListeners() {
        const elements = this.getElements();
        this.addEventListener("click",e => e.stopPropagation())
        elements.textarea.addEventListener("input", e => this.handleInput(e, elements.textarea, elements.submitBtn));
        elements.fileInput.addEventListener("change", e => {
            this.handleFileSelection(e)
            console.log("clicked");
        });
        elements.uploadBtn.addEventListener("click", () => {
            elements.fileInput.click()
        });
        elements.deleteBtn.addEventListener("click", this.handleDelete.bind(this))
        elements.submitBtn.addEventListener("click", this.handlePostSubmit.bind(this));
    }

    handleInput(e, textarea, btn) {
        this.resize(textarea);
        this.toggleSubmitBtn(textarea, btn);
    }

    resize(textarea) {
        const p = textarea.parentElement;
        const minHeight = "5rem"; // Minimum height when the textarea is empty

        // Reset height to auto to allow recalculation
        p.style.height = minHeight;

        // Check if the textarea is empty and adjust height accordingly
        if (textarea.value.trim() === '') {
            p.style.height = minHeight; // Set to minimum height when empty
        } else {
            const scHeight = textarea.scrollHeight;
            p.style.height = scHeight + "px"; // Set to content's scroll height
        }
    }

    handleDelete(){
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
        } 
        else {
            elements.submitBtn.setAttribute("disabled", true);
        }
    }

    handleFileSelection(e) {
        const elements = this.getElements();
        if (e.target.files.length > 0) {
        //   console.log("file selected: ", e.target.files[0]);
        this.handleInput(e, elements.textarea, elements.submitBtn);
        }
    }

    async handlePostSubmit() {
        const content = this.shadow.querySelector("textarea").value.trim();

        if (content === "") {
            console.log("Post content is empty!");
            return;
        }

        let response = null;

        try {
            const frmData = new FormData();
            const content = this.shadow.querySelector("textarea").value.trim();
            frmData.append("body", content);

            const fileInput = this.shadow.querySelector("#file-input").files;
            if (fileInput.length > 0) frmData.append("image", fileInput[0]);

            const customHeader = {
                "Authorization": `Bearer ${this.dataset.token}`,
            }

            response = await this.controller.
            request("/posts", "POST", frmData, customHeader);


        } catch (error) {
            console.log(error)
        }

        const event = new CustomEvent("finished", {detail: response});
        this.dispatchEvent(event);

        // Clear the content after posting
        this.clearPost();
    }

    clearPost() {
        const elements = this.getElements();

        elements.textarea.value = "";
        elements.fileInput.value = "";
        this.handleInput(null, elements.textarea, elements.submitBtn);
    }


    getElements(){
        return {
             textarea : this.shadow.querySelector("textarea"),
             submitBtn : this.shadow.querySelector("#submit-btn"),
             fileInput : this.shadow.querySelector("#file-input"),
             uploadBtn : this.shadow.querySelector("#upload-btn"),
             deleteBtn : this.shadow.querySelector("#delete-btn")
        }
    }

}

window.customElements.define("postcreator-c", PostCreator)