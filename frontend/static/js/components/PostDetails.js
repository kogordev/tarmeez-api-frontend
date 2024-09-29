export default class PostDetailsComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.state = null; // The state will be populated when the component is used
    }

    connectedCallback() {
        this.render();
    }

    // Renders the component's HTML structure
    render() {
        if (!this.state) return;

        const profileImage = this.getProfileImage();
        const postImage = this.getPostImage();
        const profileUrl = this.getProfileUrl();

        this.shadowRoot.innerHTML = this.getHTMLTemplate(profileImage, postImage, profileUrl);
        this.addStyles();
        this.setFormattedDate();
    }

    // Gets the author's profile image or returns the default image
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

    // Generates the HTML structure for the post details component
    getHTMLTemplate(profileImage, postImage, profileUrl) {
        const commentsHTML = this.getCommentsHTML();
        return /*html*/ `
            <link rel="stylesheet" href="/static/css/common.css">
            <article class="post-details shadow">
                <div class="post-details__header">
                    <button id="btn-close" class="btn btn-circle btn-close">×</button>
                    <h3>Post Details</h3>
                </div>
                <div class="post__wrapper">
                    <div class="post__main">
                        <div class="post__header">
                            <div class="post__profile__img flex flex-center">
                                <navlink-c class="navlink-img" data-img="${profileImage}" data-to="${profileUrl}"></navlink-c>
                            </div>
                            <div class="post__info">
                                <div class="post__username">
                                    <a href="#" class="post__info__username__link">${this.state.author.username}</a>
                                </div>
                                <div class="post__info__wrapper post__info__time">
                                    <span class="post__info__time__link">${this.state.created_at}</span>
                                </div>
                            </div>
                        </div>
                        <p class="post__body">${this.state.body}</p>
                        <div class="post__img__wrapper">
                            <img src="${postImage}" alt="" class="post__img">
                        </div>
                    </div>
                    <div class="post__comments">
                        <h4>Comments (${this.state.comments.length})</h4>
                        <div class="post__comments__list">
                            ${commentsHTML}
                        </div>
                    </div>
                </div>
            </article>
        `;
    }

    // Generates the HTML for the comments section
    getCommentsHTML() {
        return this.state.comments
            .map(
                (comment) => /*html*/ `
                <div class="comment">
                    <div class="comment__header">
                        <img src="${comment.user.profile_image}" class="comment__avatar" alt="User Avatar">
                        <span class="comment__username">${comment.user.username}</span>
                        <span class="comment__created-at">${new Date(comment.created_at).toLocaleString()}</span>
                    </div>
                    <p class="comment__body">${comment.body}</p>
                </div>`
            )
            .join("");
    }

    // Adds dynamic styles to the shadow DOM
    addStyles() {
        const style = document.createElement("style");
        style.textContent = this.getCSS();
        this.shadowRoot.appendChild(style);
    }

    // Gets the CSS styles for the component
    getCSS() {
        return `
            .post-details {
                width: 800px;
                background-color: white;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
                padding: 20px;
            }
            
            .post-details__header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #ccc;
                padding-bottom: 10px;
                margin-bottom: 20px;
            }

            .btn-close {
                cursor: pointer;
                border: none;
                background: none;
                font-size: 1.5rem;
            }
            
            .post__wrapper {
                display: flex;
                justify-content: space-between;
            }
            
            .post__main {
                flex: 3;
                margin-right: 20px;
            }

            .post__comments {
                flex: 1;
                border-left: 1px solid #ddd;
                padding-left: 20px;
            }

            .comment {
                margin-bottom: 15px;
                padding: 10px;
                background-color: #f9f9f9;
                border-radius: 8px;
                box-shadow: 0 0 5px -2px rgba(0, 0, 0, 0.2);
            }

            .comment__header {
                display: flex;
                align-items: center;
                margin-bottom: 5px;
            }

            .comment__avatar {
                height: 32px;
                width: 32px;
                border-radius: 50%;
                margin-right: 10px;
            }

            .comment__username {
                font-weight: bold;
                margin-right: 5px;
            }

            .comment__created-at {
                font-size: 0.85rem;
                color: gray;
            }

            .comment__body {
                margin: 0;
            }
        `;
    }

    // Converts the post creation date and updates the component
    setFormattedDate() {
        const postDate = new Date(this.state.created_at).toLocaleDateString("en-us", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        this.shadowRoot.querySelector(".post__info__time__link").innerText = postDate;
    }
}

// Define the new custom component
window.customElements.define("post-details-c", PostDetailsComponent);
