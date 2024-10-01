import Controller from "/static/js/controllers/controller.js"
import state from "/static/js/utils/state.js";

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
            postBody: this.shadowRoot.querySelector(".post__body"),
            menuBtn: this.shadowRoot.querySelector(".post__button"),
            menuBtnSvg: this.shadowRoot.querySelector(".post__button__svg"),
            editBtn: this.shadowRoot.querySelector("#edit-btn"),
            deleteBtn: this.shadowRoot.querySelector("#delete-btn"),
        }
    }

    connectedCallback() {
        this.currentUser = state.getCurrentUser();
        this.render();
        const elements = this.elements();
        this.attachEventListeneres(elements);
    }

    attachEventListeneres(elements) {

        this.shadowRoot.getElementById("comments-link")?.addEventListener("click", this.showComments.bind(this))

        document.addEventListener("click", e => this.handleMenuToggle(e));
        if (elements.editBtn) {
            elements.editBtn.addEventListener("click", this.editPost.bind(this));
        }
        if (elements.deleteBtn) {
            elements.deleteBtn.addEventListener("click", this.triggerDelete.bind(this));
        }
    }

    async showComments() {
        try {
            const url = `/posts/${this.state.id}`;
            const response = await this.controller.request(url);
            const comments = response.data.comments || [];
            console.log(comments)
            
        } catch (error) {

        }
    }

    editPost() {
        console.log("post edit:", this.state.id);
    }

    triggerDelete() {
        const confirmationComp = document.createElement("confirmation-c");
        confirmationComp.msg = "Are you sure you want to delete this post?";
        this.shadowRoot.appendChild(confirmationComp);
        confirmationComp.addEventListener("delete-confirm", e =>
            this.handleDeleteConfrimation(e, confirmationComp)
        )
    }

    async handleDeleteConfrimation(e, element) {
        const { isConfirm } = e.detail;
        this.disposeElement(element);

        if (isConfirm) {
            // Delete 
            const token = this.currentUser.token;
            const url = `/posts/${this.state.id}`
            try {
                const customHeader = {
                    "Authorization": `Bearer ${token}`,
                }
                const response = await this.controller.request(url, "DELETE", null, customHeader);

                if (response.status >= 200 && response.status < 300) {
                    this._dispatchEvent("post-deleted", { detail: { isDeleted: true } })
                } else {
                    this._dispatchEvent("post-deleted", { detail: { isDeleted: false } })
                }

            } catch (error) {
                console.log(error);
                this._dispatchEvent("post-deleted", { detail: { isDeleted: false } })
            }

        }
    }

    _dispatchEvent(name, value) {
        const event = new CustomEvent(name, value);
        this.dispatchEvent(event);
    }

    // Function to dispose of the element
    disposeElement(element) {
        // Remove event listeners
        element.removeEventListener('delete-confirm', this.handleDeleteConfrimation);

        // Remove from DOM
        if (element.parentNode) {
            element.parentNode.removeChild(element);
        }
    }

    handleMenuToggle(e) {
        const chbx = this.shadowRoot.querySelector("#chbx");
        const menuBtn = this.shadowRoot.querySelector(".post__button");
        const menu = this.shadowRoot.querySelector(".post__menu");

        e.preventDefault();
        e.stopPropagation();

        if (!menu) return;

        //check if user click outside menu to close it
        if (menu.contains(e.composedPath()[0]) || menuBtn.contains(e.composedPath()[0])) {
            chbx.checked = !chbx.checked
        } else {
            chbx.checked = false
        }
    }

    // Renders the component's HTML structure
    render() {
        if (!this.state) return;

        this.id = this.state.id;
        const profileImage = this.getProfileImage();
        const postImage = this.getPostImage();
        const profileUrl = this.getProfileUrl();

        this.shadowRoot.innerHTML = this.getHTMLTemplate(profileImage, postImage, profileUrl);
        this.addStyles();
        this.setFormattedDate();
    }

    // Shows the post details modal
    showPostDetails() {
        const modal = document.querySelector("modal-c");
        const postDetails = document.createElement("post-details-c");
        postDetails.state = this.state; // Pass the post state to the details component

        modal.appendChild(postDetails);
        document.body.appendChild(modal);

        modal.show();
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

    // Generates the HTML structure for the post component
    getHTMLTemplate(profileImage, postImage, profileUrl) {
        return /*html*/ `
            <link rel="stylesheet" href="/static/css/common.css">
            <article class="post shadow">
                <div class="post__header">
                    <div class="post__profile__img flex flex-center">
                        <navlink-c class="navlink-img" data-img="${profileImage}" data-to="${profileUrl}"></navlink-c>
                        ${this.getPopupTemplate(profileImage)}
                    </div>
                    <div class="post__info">
                        ${this.getUsernameTemplate(profileImage)}
                        <div class="post__info__wrapper post__info__time">
                            <a href="#" class="post__info__time__link">${this.state.created_at}</a>
                        </div>
                    </div>
                    ${this.getPostMenu()}
                </div>
                <p class="post__body">${this.state.body}</p>
                <div class="post__img__wrapper">
                    <img src="${postImage}" alt="" class="post__img">
                </div>
                <div class="post__comments__wrapper">
                    <a href="#" id="comments-link" class="post__comments__link"><span>${this.state.comments_count}</span> comments</a>
                </div>
            </article>
        `;
    }

    // Returns the popup HTML template
    getPopupTemplate(profileImage) {
        return /*html*/ `
            <div class="post__popup shadow-lg">
                <a href="#">
                    <img class="post__popup__img" src="${profileImage}" alt="" width="96" height="96">
                </a>
                <div class="post__popup__main">
                    <a class="post__popup__link" href="#">${this.state.author.username}</a>
                    <div class="post__popup__wrapper">
                        ${this.getPopupInfo()}
                    </div>
                </div>
            </div>
        `;
    }

    getCurrentUser() {
        try {
            const localStorage = window.localStorage.getItem("currentUser");
            if (localStorage) {
                const currentUser = JSON.parse(localStorage);
                return currentUser;
            } else {
                return null
            }
        } catch (error) {
            return null;
        }
    }

    // Returns the post menu
    getPostMenu() {
        const currentUser = this.getCurrentUser();
        if (this.state.author?.id === currentUser?.user?.id) {
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
                <svg class="post__menu__svg" width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32z"></path>
                </svg>
                <span>Edit post</span>
            </label>
            <hr>
            <label id="delete-btn" class="post__menu__item" for="chbx">
                <svg class="post__menu__svg" width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
                </svg>
                <span>Delete post</span>
            </label>
        `;
    }

    // Returns the popup info template
    getPopupInfo() {
        return /*html*/ `
            <div class="post__popup__info">
                <svg class="post__popup__svg" height="20" width="20" viewBox="0 0 512 512">
                    <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zM291.7 90.3L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"></path>
                </svg>
                <span class="post__popup__number">625</span>
                <span class="post__popup__label">post</span>
            </div>
        `;
    }

    // Returns the username template
    getUsernameTemplate(profileImage) {
        return /*html*/ `
            <div class="post__info__wrapper post__info__username">
                <div class="post__username">
                    <a href="#" class="post__info__username__link">${this.state.author.username}</a>
                    ${this.getPopupTemplate(profileImage)}
                </div>
            </div>
        `;
    }

    // Adds dynamic styles to the shadow DOM
    addStyles() {
        const style = document.createElement('style');
        style.textContent = this.getCSS();
        this.shadowRoot.appendChild(style);
    }

    // Gets the CSS styles for the component
    getCSS() {
        return `
            a{
                color: rgb(var(--clr-main-foreground));
                text-decoration: none;
            }
            a:hover{
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
                box-shadow: 0 0 5px -2px rgba(0, 0, 0, 0.3);
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
                /*margin: 20px;*/
                background-color: rgb(var(--clr-secondary-background));
                color: rgb(var(--clr-main-foreground));
                border-radius: 10px;
                font-size: 1.6rem;
                position: relative;
            }

            .post__header {
                height: 48.23;
                margin: 0 0 12px;
                /* top | left-right | bottom  */
                padding: 12px 16px 0;
                display: flex;
                position: relative;
            }

            .post__profile__img{
                width: 50px;
                margin-right: .5rem;
                position:relative;
            }

            .post__profile__img:hover>.post__popup{
                visibility: visible;
                top: 92%;
                left: -252%;
                }

            .post__link__img {
                margin-right: 10px;
                object-fit: cover;
                border-radius: 50%;
            }

            .post__popup {
                visibility: hidden;
                position: absolute;
                background-color: rgb(var(--clr-secondary-background));
                display: flex;
                gap: 20px;
                padding: 20px;
                border-radius: 10px;
                z-index: 5;
            }

            .post__popup__img {
                border-radius: 50%;
            }

            .post__popup__link {
                font-size: 1.5rem;
                font-weight: 700;
            }

            .post__popup__wrapper {
                margin-top: 15px;
            }

            .post__popup__info {
                margin-top: 10px;
                display: flex;
                align-items: center;
                justify-content: start;
            }

            .post__popup__svg {
                fill: var(--clr-icon);
                margin-right: 10px;
            }

            .post__popup__number {
                font-size: large;
                font-weight: 700;
                margin-right: 2px;
            }

            .post__popup__label {
                font-weight: 300;
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

            .post__username{
                position:relative;
            }

            .post__username:hover>.post__popup{
                visibility: visible;
                top: 100%;
                left: -200%;
            }

            .post__info__username {
                margin: 8px 0 0;
            }

            .post__info__username__link {
                font-weight: 600;
                text-decoration: none;
                color: inherit;
            }

            .post__info__time {
                height: 18.25px;
                position: relative;
            }

            .post__info__time__link {
                text-decoration: none;
                color: rgb(var(--clr-secondary-foreground));
                font-size: 1.5rem;
            }

            .post__info__time__link::before {
                content: "3 september at 7:12 PM";
                visibility: hidden;
                position: absolute;
                white-space: nowrap;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
                padding: 20px;
                border-radius: 10px;
                /*z-index: 6;*/
                color: rgb(var(--clr-popup-time-foreground));
                top: 116%;
                left: -15%;
                transition: background-color .2s
            }

            .post__info__time__link:hover::before {
                background-color: rgba(var(--clr-popup-time-background), 0.9);
                visibility: visible;
            }

            .post__menu {
                visibility: hidden;
                position: absolute;
                top: 70%;
                right: 4.7%;
            }

            .post__menu__caret {
                fill: rgb(var(--clr-secondary-background));
                background-color: transparent;
                -webkit-filter: drop-shadow(0px 15px 10px rgba(0, 0, 0, .4));
                filter: drop-shadow(0px 15px -6px rgba(0, 0, 0, .4));
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
                background-color: rgb(var(--clr-secondary-background));
                border-radius: 10px 0 10px 10px;
                /* box-shadow: 0 0 10px  rgba(0,0,0,0.4); */
            }

            .post__menu__svg {
                fill: rgb(var(--clr-options));
            }

            .post__menu__body hr {
                border: none;
                height: .5px;
                background-color: rgba(var(--clr-secondary-foreground), .3);
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
                background-color: rgb(var(--clr-hover));
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
                fill: rgb(var(--clr-main-foreground));
            }

            .post__button:hover {
                background-color: rgb(var(--clr-hover));
            }

            #chbx {
                visibility: hidden;
            }

            #chbx:checked~.post__menu {
                visibility: visible;
            }

            .post__body {
                padding: 4px 16px 16px;
            }

            .post__img__wrapper {
                background-color: rgb(var(--clr-image-background));
                max-height: 750px;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
                cursor: pointer;
            }

            .post__comments__wrapper {
                height: 43px;
                margin: 0px 16px;
                padding: 10px 0px;
                display: flex;
                align-items: center;
                justify-content: end;
            }
            /* Add other styles here */
        `;
    }

    // Converts the post creation date and updates the component
    setFormattedDate() {
        let [postDate] = this.state.author.created_at.split("T");
        let [year, month, day] = postDate.split("-");
        const formattedDate = new Date(year, month - 1, day).toLocaleDateString('en-us', {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });
        this.shadowRoot.querySelector('.post__info__time__link').innerText = formattedDate;
    }
}

customElements.define("post-c", PostComponent);
