import PostComponent from '/static/js/components/PostComponent.js';
import Controller from '/static/js/controllers/controller.js';
import {navigateTo} from "/static/js/utils/router.js"


export default class HomeView extends HTMLElement {
    constructor(params) {
        super();
        this.attachShadow({ mode: "open" });
        this.controller = new Controller();
        this.boundInfiniteScroll = this.infiniteScroll.bind(this);
        this.isLoggedIn = false;
        this.data = null;
    }

    connectedCallback() {
        this.render();
        document.addEventListener("scroll", this.boundInfiniteScroll);
    }

    disconnectedCallback() {
        // Clean up the event listener when the element is removed
        document.removeEventListener("scroll", this.boundInfiniteScroll);
    }

    async render() {
        this.shadowRoot.innerHTML = /*html*/ `
            <link rel="stylesheet" href="/static/css/common.css"/>
            <link rel="stylesheet" href="/static/css/homeview.css"/>
            <div id="posts-wrapper" class="wrapper  main-color flex flex-col align-items-center gap">
            ${this.renderPostCreator()}
            </div>    
        `;
        this.renderPosts();
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.addEventListener("click", (e) => {
            e.stopPropagation();
            e.preventDefault();
        });

        const postCreator = this.shadowRoot.querySelector("postcreator-c");
        if(postCreator){
            postCreator.addEventListener("finished", () => navigateTo("/"))
        }
    }

    async renderPosts() {
        try {
            const posts = await this.fetchPosts();
            if (!posts || posts.length === 0) return;

            const postsWrapper = this.shadowRoot.querySelector("#posts-wrapper");
            for (let post of posts) {
                const postComp = await this.createPostComponent(post);
                postsWrapper.appendChild(postComp);
            }
        } catch (error) {
            console.error("Failed to render posts:", error);
        }
    }

    async fetchPosts() {
        try {
            const pageNumber = this.controller.page;
            const response = await this.controller.request(`/posts?page=${pageNumber}&limit=5`);
            return response.data;
        } catch (error) {
            console.error("Error fetching posts:", error);
            return [];
        }
    }

    async createPostComponent(post) {
        const postComp = new PostComponent();
        postComp.state = post;

        try {
            const response = await this.controller.request(`/posts/${post.id}`);
            postComp.state.comments = response.data.comments;
        } catch (error) {
            console.error(`Error fetching comments for post ${post.id}:`, error);
        }

        return postComp;
    }

    renderPostCreator() {

        if (this.isLoggedIn && this.data?.hasOwnProperty("user")) {
            const { user, token } = this.data;
            const img = user.profile_image || "/static/assets/images/default-user1.png";
            return `<PostCreator-c data-token='${token}' data-img=${img}></postcreator-c>`
        }

        //
        return "";
        //
    }

    clear() {
        this.shadowRoot.innerHTML = '';
    }

    infiniteScroll() {
        if (window.scrollY + window.innerHeight >= document.body.scrollHeight) {
             this.renderPosts();
        }
    }
}

window.customElements.define("home-view", HomeView);
