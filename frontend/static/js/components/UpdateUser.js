import { reset, flex, backdrop } from "/static/js/utils/cssClasses.js";
import Controller from "/static/js/controllers/controller.js";

export default class UpdateUser extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.controller = new Controller();
        this.user = null;
    }

    disconnectedCallback() {
        document.body.style.overflow = "auto";
    }

    connectedCallback() {
        if (!this.user) {
            this.remove();
            console.error("please provide user data");
            return;
        }
        this.render();
    }

    getCss() {
        return `
        .wrapper{
            width: 40rem;
            height: 60rem;
            padding: 4rem;
            background-color: rgb(var(--clr-bg-secondary));
            border-radius: var(--br);
            position: relative;
        }
        .close-btn{
            position: absolute;
            top: 2rem;
            right: 2rem;
            border-radius: 50%;
            mask-image: url("/static/assets/images/close-button.svg");
            mask-size: cover;
            mask-position: center;
            mask-repeat: no-repeat;
            background-color: rgb(var(--clr-action-bg));
            height: 2.5rem;
            width: 2.5rem;
            transition: all .3s;
            cursor: pointer;
        }
        .close-btn:hover{
            background-color: rgb(var(--clr-action-hover-bg));
        }
        .profile-img-wrapper{
            background-color: rgb(var(--clr-bg-tertiary));
            height: 100%;
            width: 20rem;
        }
        form{
            margin-top: 8rem;
            margin-bottom: 4rem;
        }
        input, button{
            height: 4rem;
            padding: 1rem;
            font-size: 1.8rem;
            border-radius: var(--br);
            outline: none;
            border: 1px solid rgb(var(--clr-border));
        }
        input:focus{
            border: 2px solid rgb(var(--clr-action-bg));
        }
        .hidden{
            display: none;
        }
        .btn{
            border: none;
            cursor: pointer;        
            transition: all .3s;
        }
        .submit-btn{
            background-color: rgb(var(--clr-action-bg));
            color: rgb(var(--clr-action-text));
        }
        .submit-btn:hover{
            background-color: rgb(var(--clr-action-hover-bg));
            color: rgb(var(--clr-action-hover-text));
        }
        .profile-img-wrapper{
            width: 100%;
            background-color: rgb(var(--clr-bg-tertiary));
            border-radius: var(--br);
            box-shadow: var(--shadow-sm);
            padding: 2rem;
        }
        img{
            border-radius: 50%;
            object-fit: cover;
        }
        .upload-btn{
            height: 3rem;
            width: 3rem;
            mask-image: url("/static/assets/images/img.svg");
            mask-position: center;
            mask-size: 2rem 2rem;
            mask-repeat: no-repeat;
            background-color: rgb(var(--clr-text-primary));
        }
        .upload-btn:hover{
            background-color: rgb(var(--clr-action-hover-bg)) !important;
        }
        .footer{
            position: relative;
        }
        `;
    }

    addStyle() {
        const style = document.createElement("style");
        style.textContent = this.getCss().trim().concat(reset, backdrop, flex);
        this.shadowRoot.appendChild(style);
    }

    getHTMLTemplate(name, username, email, profileImg) {
        return `
        <div id="backdrop" class="backdrop">
            <div id="wrapper" class="wrapper">
                <button id="closeBtn" class="close-btn"></button>
                <div class="header flex flex-center">
                    <h2>Update account</h2>
                </div>
                <form class="flex flex-col gap">
                    <input id="nameInput" type="text" name="name" placeholder="Enter name..." value="${name}"/>
                    <input id="usernameInput" type="text" name="username" placeholder="Enter username..." value="${username}"/>
                    <input id="emailInput" type="email" name="email" placeholder="Enter email..." value="${email}"/>
                    <input id="fileInput" class="hidden" type="file" name="image" accept="image/png, image/jpg, image/jpeg"/>
                    <div class="profile-img-wrapper flex gap">
                        <img loading="lazy" id="profileImg" height="100" width="100" src="${profileImg}" alt="Profile image"/>
                        <p class="flex align-items-center gap">
                            Upload a photo
                            <button id="uploadBtn" class="btn upload-btn"></button>                        
                        </p>
                    </div>
                </form>
                <div id="footer" class="footer flex justify-content-end align-items-center">
                    <button id="submitBtn" class="btn submit-btn">Submit</button>
                </div>
            </div>
        </div>
        `
    }

    getProfileImg(img) {
        return typeof img === "object" ? "/static/assets/images/default-user1.png" : img;
    }

    renderHTMLTemplate() {
        const template = document.createElement("template");
        console.log(this.user);
        const { name, username, email, profile_image } = this.user.user;
        const profileImg = this.getProfileImg(profile_image);
        template.innerHTML = this.getHTMLTemplate(name, username, email, profileImg).trim();
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    render() {
        document.body.style.overflow = "hidden";
        this.addStyle();
        this.renderHTMLTemplate();
        this.attachEvents();
    }

    attachEvents() {

        const uploadBtn = this.shadowRoot.querySelector("#uploadBtn");
        const fileInput = this.shadowRoot.querySelector("#fileInput");
        const img = this.shadowRoot.getElementById("profileImg");
        const submitBtn = this.shadowRoot.querySelector("#submitBtn");

        this.shadowRoot.addEventListener("click", e => {
            e.stopPropagation();
            const target = e.target;
            if (target.id === "backdrop" || target.id === "closeBtn") {
                this.remove();
            }
        });

        uploadBtn.addEventListener("click", e => {
            e.preventDefault();
            fileInput.click();
        });

        fileInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    img.src = e.target.result;
                    img.style.display = 'block';  // Show the image when it's loaded
                }
                reader.readAsDataURL(file);
            }
        });

        submitBtn.addEventListener("click", this.updateProfile.bind(this));

    }

    async updateProfile() {
        const processing = document.createElement("processing-c");
        this.shadowRoot.getElementById("wrapper").appendChild(processing);
        const form = this.shadowRoot.querySelector("form");
        const formData = new FormData(form);
        formData.append("_method", "put");
        try {
            const url = `/updatePorfile/${this.user.user.id}`;
            const header = { "Authorization": `Bearer ${this.user.token}` };
            const response = await this.controller.request(url, "POST", formData, header);
            console.log(response)
            this.renderError(error.msg || error);
        } catch (error) {
            console.log(error.msg || error);
            this.renderError(error.msg || error);
        } finally {
            // processing.remove();
            processing.style.visibility = "hidden";
            setTimeout(() => {
                processing.remove();
            }, 2000);
        }
    }

    renderError(msg) {
        const div = document.createElement("div");
        div.innerHTML = `
        <style>
            .error-message{
                color: rgb(var(--clr-danger));
                position: absolute;
                bottom: 2rem;
                left: 2rem;
                transition: all .3s;
            }
        </style>
        <p class="error-message">${msg}</p>`
        this.shadowRoot.getElementById("footer").appendChild(div);
        setTimeout(() => {
            div.style.visibility = "hidden";
            setInterval(() => {
                div.remove();
            }, 2000);
        }, 3000);
    }
}

customElements.define("update-user", UpdateUser);