import PostComponent from '/static/js/components/PostComponent.js';
import Controller from '/static/js/controllers/controller.js';

export default class ProfileView extends HTMLElement {
    constructor(params) {
        super();
        this.attachShadow({ mode: "open" });
        this.params = params;
        this.controller = new Controller();
        this.user = null;
        this.currentUser = null;
        this.token = null;
    }

    connectedCallback() {
        this.render();
    }

    async render() {
        this.clear();
        await this.loadUser();
        this.renderTemplate();
        await this.loadUserPosts();
        this.attachEventListener();
    }

    async loadUser() {
        try {
            const json = await this.controller.request(`/users/${this.params.id}`);
            this.user = JSON.stringify(json.data);
        } catch (error) {
            console.error("Error fetching user data:", error.message);
        }
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

    renderTemplate() {
        this.shadowRoot.innerHTML = /*html*/ `
            <link rel="stylesheet" href="/static/css/common.css" />
            <link rel="stylesheet" href="/static/css/profileview.css" />
            <div class="wrapper main-color flex flex-col align-items-center gap">
                <dashboard-c data-user='${this.user}'></dashboard-c>
                ${this.renderPostCreator()}
                <div id="posts-wrapper" class="card flex flex-col gap"></div>
            </div>
        `;
    }


    attachEventListener() {
        const postcreator = this.shadowRoot.querySelector("postcreator-c");
        if (postcreator){
            postcreator.addEventListener("finished", this.rerender.bind(this));
        }
    }

    async loadUserPosts() {
        try {
            const userPosts = await this.controller.request(`/users/${this.params.id}/posts`);
            this.renderPosts(userPosts.data);
        } catch (error) {
            console.error("Error fetching user posts:", error.message);
        }
    }

    renderPosts(posts) {
        if (!posts || posts.length === 0) return;

        const postsWrapper = this.shadowRoot.querySelector("#posts-wrapper");
        for (let post of posts) {
            const postComp = new PostComponent();
            postComp.state = post;
            postsWrapper.prepend(postComp);
        }
    }

    renderPostCreator() {
        if (window.location.pathname.indexOf("/users/") === 0) {
            const currentUser = this.getCurrentUser();
            if (currentUser) {
                if (currentUser.user.id == this.params.id) {
                    const token = currentUser.token;
                    const img = currentUser.user.profile_image;
                    return `<PostCreator-c data-token='${token}' data-img=${img}></postcreator-c>`
                }
            }
        }
        //
        return "";
        //
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
