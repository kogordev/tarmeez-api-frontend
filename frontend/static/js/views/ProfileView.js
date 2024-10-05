import state from '/static/js/utils/state.js';
import Controller from '/static/js/controllers/controller.js';
import { loader } from "/static/js/utils/loader.js";

export default class ProfileView extends HTMLElement {
    constructor(params) {
        super();
        this.attachShadow({ mode: "open" });
        this.params = params;
        this.controller = new Controller();
        this.currentUser = null;
        this.postsWrapper = null; // initial value
    }

    async connectedCallback() {
        this.currentUser = state.getCurrentUser();
        await this.render();
    }

    async render() {
        this.clear();
        this.renderTemplate();
        await this.loadUserPosts();
        this.attachEvents();
    }


    renderTemplate() {
        this.shadowRoot.innerHTML = /*html*/ `
            <link rel="stylesheet" href="/static/css/common.css" />
            <link rel="stylesheet" href="/static/css/profileview.css" />
            <div class="profile-view wrapper main-color flex flex-col align-items-center gap">
                <dashboard-c data-id=${this.params.id}></dashboard-c>
                ${this.renderPostCreator()}
                <postswrapper-c id="posts-wrapper"></postswrapper-c>
            </div>
        `;
    }

    attachEvents() {
        const postcreator = this.shadowRoot.querySelector("postcreator-c");
        if (postcreator) {
            postcreator.addEventListener("finished", this.update.bind(this));
        }
        if (this.postsWrapper) {
            this.postsWrapper.addEventListener("post-removed", this.update.bind(this));
            this.postsWrapper.addEventListener("post-added", this.update.bind(this));
            this.postsWrapper.addEventListener("comment-added", this.update.bind(this))
        }
    }

    async loadUserPosts() {
        try {
            const url = `/users/${this.params.id}/posts`;
            const userPosts = await this.controller.request(url);
            this.postsWrapper = this.shadowRoot.querySelector('#posts-wrapper'); this.setPostsInWrapper(userPosts.data);
        } catch (error) {
            console.error("Error fetching user posts:", error.message);
        }
    }

    // Method to set posts in the PostsWrapper component
    setPostsInWrapper(posts) {

        this.postsWrapper.setPosts(posts); // Call setPosts method defined in the component
    }

    async update() {
        const dashboard = this.shadowRoot.querySelector("dashboard-c");
        await dashboard.load(); // Update dashboard
        await this.loadUserPosts();
    }

    renderPostCreator() {
        if (this.params.id == this.currentUser?.user?.id) {
            return `<postcreator-c></postcreator-c>`;
        }

        return ""
    }


    clear() {
        this.shadowRoot.innerHTML = '';
    }
}

window.customElements.define("profile-view", ProfileView);
