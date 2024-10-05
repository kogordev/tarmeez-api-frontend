import Controller from '/static/js/controllers/controller.js';

export default class HomeView extends HTMLElement {
    constructor(params) {
        super();
        this.attachShadow({ mode: "open" });


        // Initialize core state properties
        this.controller = new Controller();
        this.postsWrapper = null;
        this.isLoading = false; // Prevent concurrent loads
        this.hasMorePosts = true; // Flag to check if more posts are available

        // Bind methods
        this.handlePostCreated = this.handlePostCreated.bind(this);
        this.loadMorePosts = this.loadMorePosts.bind(this);
    }

    async connectedCallback() {
        await this.initializeComponent();
    }

    disconnectedCallback() {
        this.cleanupEventListeners(); // Properly clean up event listeners on disconnect
    }

    /**
     * Initializes component, sets up event listeners, and loads initial data.
     */
    async initializeComponent() {
        this.renderTemplate();
        this.setupEventListeners();
        await this.loadInitialPosts(); // Load initial posts when component is mounted
    }

    /**
     * Renders the main template of the HomeView component.
     */
    renderTemplate() {
        this.shadowRoot.innerHTML = /*html*/ `
            <link rel="stylesheet" href="/static/css/common.css"/>
            <link rel="stylesheet" href="/static/css/homeview.css"/>
            <div class="wrapper main-color flex flex-col align-items-center gap">
                <postcreator-c></postcreator-c>
                <postswrapper-c id="posts-wrapper"></postswrapper-c>
                <div id="load-more-trigger" class="load-more-trigger"></div>
            </div>
        `;

        // Capture references to key elements
        this.postsWrapper = this.shadowRoot.querySelector('#posts-wrapper');
        const loadMoreTrigger = this.shadowRoot.querySelector('#load-more-trigger');

        // Initialize IntersectionObserver for infinite scrolling
        this.initializeIntersectionObserver(loadMoreTrigger);
    }

    /**
     * Sets up event listeners for the HomeView component.
     */
    setupEventListeners() {
        const postCreator = this.shadowRoot.querySelector("postcreator-c");
        if (postCreator) {
            postCreator.addEventListener("finished", this.handlePostCreated);
        }
    }

    /**
     * Cleans up event listeners and IntersectionObserver.
     */
    cleanupEventListeners() {
        const postCreator = this.shadowRoot.querySelector("postcreator-c");
        if (postCreator) {
            postCreator.removeEventListener("finished", this.handlePostCreated);
        }

        // Clean up IntersectionObserver
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
        }
    }

    /**
     * Initializes IntersectionObserver to monitor scroll position for loading more posts.
     * @param {HTMLElement} targetElement - Element to observe for infinite scroll.
     */
    initializeIntersectionObserver(targetElement) {
        this.intersectionObserver = new IntersectionObserver(async (entries) => {
            if (entries[0].isIntersecting && !this.isLoading && this.hasMorePosts) {
                await this.loadMorePosts(); // Trigger loading more posts when element is visible
            }
        }, { threshold: 1.0 });

        if (targetElement) {
            this.intersectionObserver.observe(targetElement);
        }
    }

    /**
     * Loads the initial set of posts for the component.
     */
    async loadInitialPosts() {
        await this.loadPosts(); // Load the initial set of posts
    }

    /**
     * Loads a page of posts and updates the PostsWrapper component.
     */
    async loadPosts() {
        if (this.isLoading || !this.hasMorePosts) return;

        this.isLoading = true;
        try {
            const url = `/posts?page=${this.controller.page}&limit=10`;
            const response = await this.controller.request(url);

            if (response?.data && Array.isArray(response.data)) {
                this.setPostsInWrapper(response.data);
                this.controller.page++;
                this.hasMorePosts = response.data.length > 0; // Update flag based on response length
            } else {
                this.hasMorePosts = false; // No more posts available
            }
        } catch (error) {
            console.error("Failed to load posts:", error);
            this.hasMorePosts = false;
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Sets the fetched posts into the PostsWrapper component.
     * @param {Array} posts - List of posts to render.
     */
    setPostsInWrapper(posts) {
        if (this.postsWrapper && posts.length > 0) {
            this.postsWrapper.loadPostsPage(posts, "asc");
        }
    }

    /**
     * Event handler for post creation event.
     * @param {CustomEvent} event - Event containing the newly created post data.
     */
    handlePostCreated(event) {
        const newPost = event.detail?.data;
        if (newPost && this.postsWrapper) {
            this.postsWrapper.addPost(newPost); // Dynamically add the new post to the wrapper
        }
    }

    /**
     * Load more posts when called, typically by IntersectionObserver.
     */
    async loadMorePosts() {
        await this.loadPosts();
    }

    /**
     * Utility to clear the shadow DOM content.
     */
    clear() {
        this.shadowRoot.innerHTML = '';
    }
}

window.customElements.define("home-view", HomeView);


