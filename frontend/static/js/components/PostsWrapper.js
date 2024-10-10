import PostComponent from "/static/js/components/PostComponent.js";
import Controller from "/static/js/controllers/controller.js";

export default class PostsWrapper extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.style.display = "none";
    this.controller = new Controller();
    this.pathname = "";
    this.isLoading = false;
    this.hasMorePosts = true;
  }

  connectedCallback() {
    this.initializePathname();
    if (!this.pathname) {
      console.error("No data-pathname provided to posts-wrapper.");
      return;
    }
    this.initializeComponent();
    this.style.display = "block";
  }

  disconnectedCallback() {
    this.cleanupEventListeners();
  }

  initializePathname() {
    this.pathname = this.dataset?.pathname ?? null;
  }

  async initializeComponent() {
    this.renderTemplate();
    if (this.getAttribute("pagination")) {
      this.setupInfiniteScrolling();
    }
    await this.renderPosts(); // Initial posts load
  }

  renderTemplate() {
    this.shadowRoot.innerHTML = /*html*/ `
      <link rel="stylesheet" href="/static/css/common.css"/>
      <div id="posts-wrapper" class="card flex flex-col justify-content-center gap bg-transparent"></div>
      <div id="loading-spinner" style="display:none;" class="spinner">Loading...</div>
      <div id="load-more-trigger" class="load-more-trigger"></div>
    `;
  }

  setupInfiniteScrolling() {
    const loadMoreTrigger = this.shadowRoot.querySelector("#load-more-trigger");
    if (!loadMoreTrigger) return;

    this.intersectionObserver = new IntersectionObserver(
      async (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !this.isLoading && this.hasMorePosts) {
          await this.renderPosts();
        }
      },
      { threshold: 1.0 }
    );

    this.intersectionObserver.observe(loadMoreTrigger);
  }

  async loadPosts() {
    if (this.isLoading || !this.hasMorePosts) return [];

    this.isLoading = true;
    this.toggleSpinner(true); // Show loading spinner

    try {
      const url = `${this.pathname}?page=${this.controller.page}&limit=10`;
      const response = await this.controller.request(url);

      if (response?.data && Array.isArray(response.data)) {
        this.controller.page++;
        this.hasMorePosts = response.data.length > 0;
        return response.data;
      }
      this.hasMorePosts = false;
      return [];
    } catch (error) {
      console.error("Failed to load posts:", error);
      this.displayError(error.msg || "Unable to load posts. Please try again.");
      this.hasMorePosts = false;
      return [];
    } finally {
      this.isLoading = false;
      this.toggleSpinner(false); // Hide loading spinner
    }
  }

  async renderNewPosts() {
    this.controller.page = 1;
    this.clearPosts();
    await this.renderPosts();
  }

  async renderPosts() {
    const posts = await this.loadPosts();
    if (!posts.length) {
      this.displayNoPostsMessage();
      return;
    }

    posts.forEach((post) => this.renderSinglePost(post));
  }

  renderSinglePost(post) {
    const postsWrapper = this.shadowRoot.querySelector("#posts-wrapper");
    if (!postsWrapper) return;

    const postComp = new PostComponent();
    postComp.state = post;
    postComp.id = post.id;

    const sortOrder = this.getAttribute("sort") || "asc";
    sortOrder === "desc"
      ? postsWrapper.prepend(postComp)
      : postsWrapper.append(postComp);

    this.setupPostEventListeners(postComp);
  }

  setupPostEventListeners(postComp) {
    postComp.addEventListener("state-changed", (e) => {
      this.dispatchEvent(
        new CustomEvent("state-changed", { detail: e.detail })
      );
    });

    postComp.addEventListener("post-deleted", (e) =>
      this.handlePostDelete(e, postComp)
    );
  }

  handlePostDelete(event, postComp) {
    const { detail } = event;
    postComp.remove();

    this.dispatchEvent(
      new CustomEvent("post-deleted", {
        detail: { postId: postComp.id },
        bubbles: true,
        composed: true,
      })
    );
  }

  addPost(post, sort = "desc") {
    this.setAttribute("sort", sort);
    this.renderSinglePost(post);
  }

  clearPosts() {
    const postsWrapper = this.shadowRoot.querySelector("#posts-wrapper");
    if (postsWrapper) postsWrapper.innerHTML = "";
  }

  displayNoPostsMessage() {
    const postsWrapper = this.shadowRoot.querySelector("#posts-wrapper");
    postsWrapper.innerHTML = "<p>No posts available.</p>";
  }

  displayError(message) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.textContent = message;
    this.shadowRoot.appendChild(errorDiv);
  }

  toggleSpinner(isVisible) {
    const spinner = this.shadowRoot.querySelector("#loading-spinner");
    if (spinner) {
      spinner.style.display = isVisible ? "block" : "none";
    }
  }

  cleanupEventListeners() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }
}

window.customElements.define("posts-wrapper", PostsWrapper);
