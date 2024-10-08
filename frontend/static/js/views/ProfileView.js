import state from "/static/js/utils/state.js";
import Controller from "/static/js/controllers/controller.js";
import { loader } from "/static/js/utils/loader.js";

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
    this.clear();
    this.renderTemplate();
    this.setupEventHandlers();
  }

  renderTemplate() {
    const postsUrl = `/users/${this.params.id}/posts`;

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="/static/css/common.css" />
      <link rel="stylesheet" href="/static/css/profileview.css" />
      <div class="profile-view wrapper main-color flex flex-col align-items-center gap">
          <dashboard-c data-id="${this.params.id}"></dashboard-c>
          ${
            this.shouldRenderPostCreator()
              ? `<post-creator></post-creator>`
              : ""
          }
          <posts-wrapper sort="desc" data-pathname="${postsUrl}"></posts-wrapper>
      </div>
    `;
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

// import state from "/static/js/utils/state.js";
// import Controller from "/static/js/controllers/controller.js";
// import { loader } from "/static/js/utils/loader.js";

// export default class ProfileView extends HTMLElement {
//   constructor(params) {
//     super();
//     this.attachShadow({ mode: "open" });
//     this.params = params;
//     this.controller = new Controller();
//     this.currentUser = null;
//     this.update = this.update.bind(this);
//   }

//   async connectedCallback() {
//     this.currentUser = state.getCurrentUser();
//     await this.render();
//   }

//   async render() {
//     this.clear();
//     this.renderTemplate();
//     this.attachEvents();
//   }

//   renderTemplate() {
//     const url = `/users/${this.params.id}/posts`;

//     this.shadowRoot.innerHTML = /*html*/ `
//             <link rel="stylesheet" href="/static/css/common.css" />
//             <link rel="stylesheet" href="/static/css/profileview.css" />
//             <div class="profile-view wrapper main-color flex flex-col align-items-center gap">
//                 <dashboard-c data-id=${this.params.id}></dashboard-c>
//                 ${this.renderPostCreator()}
//                 <posts-wrapper sort="desc" data-pathname=${url}></posts-wrapper>
//             </div>
//         `;
//   }

//   attachEvents() {
//     const postcreator = this.shadowRoot.querySelector("post-creator");
//     const postsWrapper = this.shadowRoot.querySelector("posts-wrapper");

//     if (postcreator) {
//       postcreator.addEventListener("post-created", (e) => {
//         this.shadowRoot.querySelector("posts-wrapper").addPost(e.detail);
//         this.update();
//       });
//     }
//     if (postsWrapper) {
//       postsWrapper.addEventListener("post-deleted", () => {
//         console.log("deleted");
//         this.update();
//       });
//       postsWrapper.addEventListener("post-added", this.update);
//       postsWrapper.addEventListener("state-updated", (e) => {
//         this.update();
//         console.log(e.detail, "comment added")
//       });
//     }
//   }

//   async update() {
//     const dashboard = this.shadowRoot.querySelector("dashboard-c");
//     await dashboard.update(); // Update dashboard
//   }

//   renderPostCreator() {
//     if (this.params.id == this.currentUser?.user?.id) {
//       return `<post-creator></post-creator>`;
//     }

//     return "";
//   }

//   clear() {
//     this.shadowRoot.innerHTML = "";
//   }
// }

// window.customElements.define("profile-view", ProfileView);
