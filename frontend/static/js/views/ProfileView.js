import state from "/static/js/utils/state.js";
import Controller from "/static/js/controllers/controller.js";

export default class ProfileView extends HTMLElement {
  constructor(params) {
    super();
    this.attachShadow({ mode: "open" });
    this.params = params;
    this.controller = new Controller();
    this.currentUser = null;
    this.updateDashboard = this.updateDashboard.bind(this); // Bind update function
  }

  async connectedCallback() {
    this.currentUser = state.getCurrentUser();
    await this.render();
  }

  async render() {
    this.style.display = "none";
    this.clear();
    this.addStyle();
    await this.renderTemplate();
    this.setupEventHandlers();
    this.style.display = "block";
  }

  getCss(){
    return /*css*/`
    * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    }
    :host {
        display: block;
        height: auto;
        overflow-y: hidden;
    }
    .profile-view{
        background-color: rgb(var(--clr-main-background));
        padding-bottom: 2rem;
        transition: visibility .3s;
    }
    h1 {
        font-size: 5.5rem;
        font-weight: 500;
    }
    .header {
        height: 200px;
        background-color: rgba(var(--clr-bg-secondary), .5);
    }
    .section {
        width: 70%;
    }
    .flex {
      display: flex;
    }
    
    .flex-col {
        flex-direction: column;
    }
    .gap {
      gap: 1rem;
    } 
    .align-items-center {
      align-items: center;
    }
      `
  }

  addStyle(){
    const style = document.createElement("style");
    style.textContent = this.getCss().trim();
    this.shadowRoot.appendChild(style);
  }

  getHTMLTemplate(postsUrl){
    return /*html*/`
    <div class="profile-view wrapper main-color flex flex-col align-items-center gap">
    <dashboard-c data-id="${this.params.id}"></dashboard-c>
    ${this.shouldRenderPostCreator()
    ? `<post-creator></post-creator>`
      : ""
    }
      <posts-wrapper sort="desc" data-pathname="${postsUrl}"></posts-wrapper>
    </div>
    `
  }

  renderTemplate() {
    const postsUrl = `/users/${this.params.id}/posts`;
    const template = document.createElement("template");
    template.innerHTML = this.getHTMLTemplate(postsUrl).trim();
    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }

  /**
   * Attaches event handlers for child components.
   */
  setupEventHandlers() {
    this.setupPostCreatorEvents();
    this.setupPostsWrapperEvents();
  }

  /**
   * Attaches events to the post-creator element if it exists.
   */
  setupPostCreatorEvents() {
    const postCreator = this.shadowRoot.querySelector("post-creator");
    if (!postCreator) return;

    postCreator.addEventListener("post-created", (e) => {
      this.handlePostCreated(e);
    });
  }

  /**
   * Attaches events to the posts-wrapper element.
   */
  setupPostsWrapperEvents() {
    const postsWrapper = this.shadowRoot.querySelector("posts-wrapper");
    if (!postsWrapper) return;

    postsWrapper.addEventListener("post-deleted", this.updateDashboard);
    postsWrapper.addEventListener("post-added", this.updateDashboard);
    postsWrapper.addEventListener("comment-added", this.updateDashboard);
    postsWrapper.addEventListener("state-changed", this.updateDashboard);

    this.shadowRoot.querySelector("dashboard-c")?.addEventListener("user-loaded", e => {
      const { username } = e.detail;
      document.title = "Tarmeez | " + this._capitalizeFirstLetter(username) + "'s Profile";
    })
  }

  _capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  /**
   * Handler for the post-created event.
   * @param {Event} event - Event object containing post data.
   */
  handlePostCreated(event) {
    const postsWrapper = this.shadowRoot.querySelector("posts-wrapper");
    postsWrapper.addPost(event.detail);
    this.updateDashboard(); // Refresh dashboard on new post creation
  }

  /**
   * Checks if the current user is the profile owner and should render the post-creator.
   * @returns {Boolean} True if the current user is the owner, false otherwise.
   */
  shouldRenderPostCreator() {
    return this.params.id == this.currentUser?.user?.id;
  }

  /**
   * Clears the shadow DOM content.
   */
  clear() {
    this.shadowRoot.innerHTML = "";
  }

  /**
   * Updates the dashboard component.
   */
  async updateDashboard() {
    const dashboard = this.shadowRoot.querySelector("dashboard-c");
    if (dashboard) await dashboard.update();
  }
}

window.customElements.define("profile-view", ProfileView);
