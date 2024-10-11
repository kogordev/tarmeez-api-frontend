import PostComponent from "/static/js/components/PostComponent.js";
import Controller from "/static/js/controllers/controller.js";

function getCss(){
  return /*css*/`
  .card {
    width: 680px;
    background-color: rgb(var(--clr-secondary-background));
    color: rgb(var(--clr-main-foreground));
    border-radius: var(--br);
  }
  .flex {
    display: flex;
  } 
  .flex-center{
    justify-content: center;
    align-items: center;
  }
  .flex-col {
    flex-direction: column;
  }
  .justify-content-center {
    justify-content: center;
  }
  .gap {
      gap: 1rem;
  }
  .bg-transparent {
    background-color: transparent;
  }
  .no-posts{
    font-size: 5rem;
    font-weight: 700;
    color: rgb(var(--clr-main-disabled-background));
  }
  `
}

export default class PostsWrapper extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.controller = new Controller();
    this.pathname = "";
    this.isLoading = false;
    this.hasMorePosts = true;
  }

  async connectedCallback() {
    this.initializePathname();
    if (!this.pathname) {
      console.error("No data-pathname provided to posts-wrapper.");
      return;
    }
    await this.initializeComponent();
  }

  disconnectedCallback() {
    this.cleanupEventListeners();
  }

  initializePathname() {
    this.pathname = this.dataset?.pathname ?? null;
  }

  async initializeComponent() {
    this.addStyle();
    this.renderTemplate();
    if (this.getAttribute("pagination")) {
      this.setupInfiniteScrolling();
    }
    await this.renderPosts(); // Initial posts load
  }

  addStyle() {
    const style = document.createElement("style");
    style.textContent = getCss().trim();
    this.shadowRoot.appendChild(style);
  }

  getHTMLTemplate() {
    return /*html*/ `
    <div id="posts-wrapper" class="card flex flex-col justify-content-center gap bg-transparent"></div>
    <div id="loading-spinner" style="display:none;" class="spinner card">

        <img height="120" width="120" src="/static/assets/images/loader1.gif" alt="spinner"/>

    </div>
    <div id="load-more-trigger" class="load-more-trigger"></div>`
  }

  renderTemplate() {
    const template = document.createElement("template");
    template.innerHTML = this.getHTMLTemplate().trim();
    this.shadowRoot.appendChild(template.content.cloneNode(true));
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
    postsWrapper.innerHTML = "<p class='card no-posts'>No posts available.</p>";
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
