import PostComponent from "/static/js/components/PostComponent.js";
import Controller from "/static/js/controllers/controller.js";

import { reset, flex, card } from "/static/js/utils/cssClasses.js";

function getCss() {
  const postsWrapperStyles = /*css*/`

  .bg-transparent {
    background-color: transparent !important;
  }
  .no-posts{
    font-size: 3rem;
    padding: 2rem;
    font-weight: 600;
    background-color: rgb(var(--clr-disabled-bg));
    color: rgb(var(--clr-disabled-text));
  }
  .error-message{
    margin-top: 2rem;
    color: rgb(var(--clr-danger-bg));
    font-size: 2rem;
  }
  .spinner{
    position: relative;
    height: 10rem;
  }
  `
  return "".concat(reset, flex, card, postsWrapperStyles);
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
    <div id="loading-spinner" style="display:none;" class="spinner card"></div>
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
    }
  }

  async renderNewPosts() {
    this.controller.page = 1;
    this.clearPosts();
    await this.renderPosts();
  }

  async renderPosts() {
    this.togglePostsWrapper(false);
    const posts = await this.loadPosts();
    if (!posts.length) {
      this.displayNoPostsMessage();
      this.toggleSpinner(false); // Hide loading spinner
      return;
    }

    await posts.forEach((post) => this.renderSinglePost(post));
    this.toggleSpinner(false); // Hide loading spinner
    this.togglePostsWrapper(true);
  }

  togglePostsWrapper(show) {
    const postsWrapper = this.shadowRoot.querySelector("posts-wrapper");
    if (postsWrapper) {
      postsWrapper.style.visibility = show ? "visible" : "hidden";
    }
  }

  async renderSinglePost(post, fromView = false) {
    const postsWrapper = this.shadowRoot.querySelector("#posts-wrapper");
    if (!postsWrapper) return;

    const postComp = await new PostComponent();
    postComp.state = post;
    postComp.id = post.id;

    if(fromView) postComp.addEventListener("renderFinished", () => postComp.setAsNewAdded());

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

    let postsCount = this.shadowRoot.querySelector("#posts-wrapper").children.length;
    if( postsCount === 0) this.displayNoPostsMessage();
    
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
    this.renderSinglePost(post, true);
    this.shadowRoot.querySelector(".no-posts")?.remove();
  }

  clearPosts() {
    const postsWrapper = this.shadowRoot.querySelector("#posts-wrapper");
    if (postsWrapper) postsWrapper.innerHTML = "";
  }

  displayNoPostsMessage() {
    const postsWrapper = this.shadowRoot.querySelector("#posts-wrapper");
    postsWrapper.innerHTML = "<p class='card flex flex-center no-posts'>No posts available.</p>";
  }

  displayError(message) {
    const template = document.createElement("template");
    template.innerHTML = /*html*/`
    <div class="error-message flex flex-center">${message}</div>
    `
    this.shadowRoot.appendChild(template.content.cloneNode(true));
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
