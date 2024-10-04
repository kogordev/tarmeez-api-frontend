import state from '/static/js/utils/state.js';
import Controller from '/static/js/controllers/controller.js';
import { navigateTo } from "/static/js/utils/router.js"

export default class ProfileView extends HTMLElement {
    constructor(params) {
        super();
        this.attachShadow({ mode: "open" });
        this.loader = document.getElementById('appLoader');
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
        this.attachEventListener();
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

    attachEventListener() {
        const postcreator = this.shadowRoot.querySelector("postcreator-c");
        if (postcreator) {
            postcreator.addEventListener("finished", e => this.handlePostCreated(e));
        }
        if (this.postsWrapper) {
            this.postsWrapper.addEventListener("post-removed", this.updateDashboard.bind(this));
            this.postsWrapper.addEventListener("post-added", this.updateDashboard.bind(this));
            this.postsWrapper.addEventListener("comment-added", this.updateDashboard.bind(this))
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


    handlePostCreated(e) {
        try {
            const post = e.detail?.data;
            this.postsWrapper.addPost(post)
        } catch (error) {
            console.log(error);
        }
    }

    updateDashboard() {
        const dashboard = this.shadowRoot.querySelector("dashboard-c");
        dashboard.load(); // Update dashboard
    }

    renderPostCreator() {
        if (this.params.id == this.currentUser?.user?.id) {
            return `<postcreator-c></postcreator-c>`;
        }

        return ""
    }

    rerender() {
        this.clear();
        this.render();
    }

    clear() {
        this.shadowRoot.innerHTML = '';
    }
}

window.customElements.define("profile-view", ProfileView);
