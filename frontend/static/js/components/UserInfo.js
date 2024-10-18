import Controller from "/static/js/controllers/controller.js"
import state from "/static/js/utils/state.js";

export default class UserInfo extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.controller = new Controller();
        this.userId = null;
        this.user = null;
        this.currentUser = state.getCurrentUser();
    }

    connectedCallback() {
        this.userId = this.dataset.id || null;
        if (!this.userId) {
            this.remove();
            return;
        }
        this.render();
    }

    getContainerHTML() {
        return `
        <style>
            *{
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-size: 1.6rem;
            }
            .header-text{
                font-size: 2.4rem;
                font-weight: 600;
                text-transform: capitalize;
                letter-spacing: .2rem;
            }
            span{
                display: block;
            }
            .overflow-hidden{
                overflow: hidden;
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
            .justify-content-center{
                justify-content: center;
            }
            .justify-content-end{
                justify-content: end;
            }
            .align-items-center{
                align-items: center;
            }
            .gap{
                gap: 1rem;
            }
            .user-info-container{
                width: var(--card-w);
                height: 20rem;
                border-radius: var(--br);
                box-shadow: var(--shadow-sm);
                background-color: rgb(var(--clr-bg-secondary));
                position: relative;
                overflow: hidden;
            }
        </style>
        <div id="user-info-container" class="user-info-container flex flex-center"></div>
        `
    }

    renderContainer() {
        const template = document.createElement("template");
        template.innerHTML = this.getContainerHTML().trim();
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    getInitialLoaderHTML() {
        return `
        <style>

        </style>
        <div id="initial-loading-container">
            <processing-c></processing-c>
        </div>
        `
    }

    renderInitialLoader() {
        const template = document.createElement("template");
        template.innerHTML = this.getInitialLoaderHTML().trim();
        this.shadowRoot.querySelector(".user-info-container").appendChild(template.content.cloneNode(true))
    }

    toggleInitialLoading(show) {
        const initialLoading = this.shadowRoot.querySelector("#initial-loading-container");
        if (initialLoading) initialLoading.style.display = show ? "block" : "none";
    }

    getProfileImg(img) {
        return typeof img === "object" ? "/static/assets/images/default-user1.png" : img;
    }

    getUserInfoCss() {
        return `
        *{
            user-select: none;
        }
        .profile-container {
            display: flex;
            height: 100%;
            justify-content: space-between;  /* Distributes space evenly between left and right */
            align-items: center;
            padding: 20px;
            width: 680px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            background-color: rgb(var(--clr-bg-secondary));
            color: rgb(var(--clr-text-secondary));
        }
        .profile-left, .profile-right{
            height: 16rem;
        }

        /* Left side: Profile image and text details */
        .profile-left {
            display: flex;
            align-items: center;
        }

        /* Profile image styling */
        .profile-image img {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            object-fit: cover;
            cursor: pointer;
        }

        /* Profile details: name and username */
        .profile-details {
            margin-left: 20px;
        }

        /* Right side: Stats and Edit Profile button */
        .profile-right {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-end;  /* Align items to the right */
            gap: 10px;  /* Adds space between stats and button */
        }

        /* Stats: Posts and Comments */
        .profile-stats {
            display: flex;
            gap: 20px;  /* Space between posts and comments */
        }

        /* Edit Profile button */
        .edit-profile-button {
           margin-top: 1rem;
           cursor: pointer;
           background-color: rgb(var(--clr-action-bg));
           color: rgb(var(--clr-action-text));
           border: none;
           padding: .8rem;
           box-shadow: var(--shadow-sm);
           border-radius: var(--br); 
           position: absolute;
           font-size: 1.4rem;
           bottom: 2rem;
           right: 2rem;
        }
        
        .edit-profile-button:hover{
            background-color: rgb(var(--clr-action-hover-bg));
            color: rgb(var(--clr-action-hover-text));
        }

        /* Center-align stats when the button is hidden */
        .profile-container:not(.show-edit) .profile-right {
            align-items: center;  /* Center-align when the button is hidden */
        }

        .hidden{
            display: none;
        }
        
        .right-profile:has(button){
            margin-top: 6rem;
            background: black
        }

        .name{
            color: rgb(var(--clr-text-primary));
            text-transform: capitalize;
        }
        `
    }

    addUserInfoStyles() {
        const style = document.createElement("style");
        style.textContent = this.getUserInfoCss().trim();
        this.shadowRoot.appendChild(style);
    }

    renderEditButton() {
        return this.userId == this.currentUser.user.id ? `<button id="editBtn" class="edit-profile-button">Edit Profile</button>` : "";
    }

    getUserInfoHTML(name, username, profileImg, postsCount, commentsCount) {
        return `
        <div class="profile-container show-edit">
            <!-- Left side: Profile image and details -->
            <div class="profile-left">
                <div class="profile-image">
                    <img id="profileImg" loading="lazy" src="${profileImg}" alt="Profile Picture">
                </div>
                <div class="profile-details">
                    <h2 id="name" class="name">${name}</h2>
                    <p id="username">@${username}</p>
                </div>
            </div>

            <!-- Right side: Post count, comment count, and edit button -->
            <div class="profile-right">
                <div class="profile-stats">
                    <span class="posts-count flex flex-col flex-center">
                        <span id="postsCount">${postsCount}</span>
                        <span>posts</span>
                    </span>
                    <span class="comments-count flex flex-col flex-center">
                        <span id="commentsCount">${commentsCount}</span>
                        <span>comments</span>
                    </span>
                </div>
                ${this.renderEditButton()}
            </div>
        </div>
        `;
    }


    renderUserInfo(data) {
        this.addUserInfoStyles();
        const { name, username, profile_image, posts_count, comments_count } = data;
        const profileImg = this.getProfileImg(profile_image);
        const template = document.createElement("template");
        template.innerHTML = this.getUserInfoHTML(name, username, profileImg, posts_count, comments_count).trim();
        this.shadowRoot.querySelector("#user-info-container").appendChild(template.content.cloneNode(true));
    }

    async getUserInfo() {
        try {
            const response = await this.controller.request(`/users/${this.userId}`);
            const responseMsg = response.msg.toLowerCase();
            if (responseMsg !== "success") {
                this.renderError("data not retrieved");
                return;
            }
            this.user = response.data;
        } catch (error) {
            this.user = null;
            this.renderError(`User information not retrieved ${error.msg || error}`);
            console.log(error.msg || error);
        }
    }

    renderError(msg) {
        const template = document.createElement("template");
        template.innerHTML = `
        <div>
            <p>${msg}</p>
        </div>
        `
        this.shadowRoot.querySelector("#user-info-container").appendChild(template.content.cloneNode(true));
    }

    async render() {
        this.renderContainer();
        this.renderInitialLoader();
        await this.getUserInfo();
        if (this.user) this.renderUserInfo(this.user);
        this.toggleInitialLoading(false);
        this.attachEvents();
    }

    attachEvents() {
        this.shadowRoot.querySelector("#profileImg")?.addEventListener("click", this.handleProfileImgClick.bind(this));
        this.shadowRoot.querySelector("#editBtn")?.addEventListener("click", this.handleProfileEditClick.bind(this));
    }

    handleProfileImgClick() {
        const imgViewer = document.createElement("img-viewer");
        imgViewer.image = this.getProfileImg(this.user.profile_image);
        this.shadowRoot.appendChild(imgViewer);
    }

    handleProfileEditClick() {
        const updateUser = document.createElement("update-user");
        updateUser.user = this.currentUser;
        this.shadowRoot.appendChild(updateUser);
    }

    refreshUI() {
        this.shadowRoot.getElementById("name").textContent = this.user.name;
        this.shadowRoot.getElementById("username").textContent = this.user.username;
        this.shadowRoot.getElementById("profileImg").src = this.getProfileImg(this.user.profile_image);
        this.shadowRoot.getElementById("postsCount").textContent = this.user.posts_count;
        this.shadowRoot.getElementById("commentsCount").textContent = this.user.comments_count;
    }
    

    /**
 * Updates the component with the latest user data.
 */
    async update() {
        console.log("userinfo update triggered")
        await this.getUserInfo();
        if (this.user) this.refreshUI();
    }
}





customElements.define("user-info", UserInfo)