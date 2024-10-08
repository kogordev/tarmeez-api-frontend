import Controller from "/static/js/controllers/controller.js";

export default class DashboardComponent extends HTMLElement {
  constructor() {
    super();
    this.controller = new Controller();
    this.user = null; // Initialize user data
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    try {
      await this.load();
    } catch (error) {
      console.error("Error initializing component:", error);
    }
  }

  /**
   * Loads the user data and initializes the component UI.
   */
  async load() {
    this.renderLoadingState(); // Show loading state with smooth transition

    const id = this.dataset.id;
    if (!id) {
      this.handleError("User ID is missing");
      return;
    }

    await this.fetchUserData(id);
    this.user ? this.render() : this.handleError("User data could not be loaded");
  }

  /**
   * Fetches user data from the server.
   * @param {String} id - User ID to fetch data for.
   */
  async fetchUserData(id) {
    try {
      const response = await this.controller.request(`/users/${id}`);
      this.user = response.data;
    } catch (error) {
      this.user = null;
      console.error("Error fetching user data:", error.message);
    }
  }

  /**
   * Renders the component UI with the user data.
   */
  render() {
    if (!this.user) {
      console.error("User data is not available.");
      return;
    }
    this.style.visibility = "hidden";
    this.clearShadowDOM();
    this.attachTemplate();
    this.shadowRoot.querySelector("#profile-img").addEventListener("click", ()=>{
      const profileImg = document.createElement("img-viewer");
      profileImg.image = this.getProfileImage(this.user.profile_image);
      document.body.appendChild(profileImg);
    })
    this.style.visibility = "visible";
    this.transitionIn();
  }

  /**
   * Renders the loading state template.
   */
  renderLoadingState() {
    this.clearShadowDOM();
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="/static/css/common.css"/>
      <link rel="stylesheet" href="/static/css/dashboard.css"/>
      <div class="loading-state">Loading...</div>
    `;
  }

  /**
   * Renders error messages.
   * @param {String} message - Error message to display.
   */
  handleError(message) {
    this.clearShadowDOM();
    this.shadowRoot.innerHTML = `
      <div class="error-message">
        <h2>Error</h2>
        <p>${this.escapeHTML(message)}</p>
      </div>
    `;
  }

  /**
   * Clears the shadow DOM content.
   */
  clearShadowDOM() {
    this.shadowRoot.innerHTML = "";
  }

  /**
   * Attaches the main component template.
   */
  attachTemplate() {
    const { profile_image, username, email, posts_count, comments_count } = this.user;

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="/static/css/common.css"/>
      <link rel="stylesheet" href="/static/css/dashboard.css"/>
      <div class="card padding grid col-3 transition-opacity hidden">
        <div class="col padding flex flex-col gap">
          <div class="flex flex-col flex-center">
            <img id="profile-img" height="120" width="120" src="${this.getProfileImage(profile_image)}" alt="Profile image of ${username}" class="profile-image"/>
            <h2 id="username" class="username">${this.escapeHTML(username)}</h2>
            <h2 id="email" class="email">${this.escapeHTML(email)}</h2>
          </div>
        </div>
        <div class="col padding flex flex-col flex-center">
          <span id="posts-count" class="number">${posts_count}</span>
          <sub class="label">Posts</sub>
        </div>
        <div class="col padding flex flex-col flex-center">
          <span id="comments-count" class="number">${comments_count}</span>
          <span class="label">Comments</span>
        </div>
      </div>
    `;
  }

  /**
   * Smoothly reveals the card content.
   */
  transitionIn() {
    const cardElement = this.shadowRoot.querySelector(".card");
    if (cardElement) {
      setTimeout(() => cardElement.classList.remove("hidden"), 50);
    }
  }

  /**
   * Utility method to escape HTML characters.
   * @param {String} str - String to escape.
   */
  escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.textContent;
  }

  /**
   * Gets the author’s profile image or returns a default image.
   * @param {String} profileImg - Profile image URL.
   */
  getProfileImage(profileImg) {
    return typeof profileImg === "string" ? profileImg : "/static/assets/images/default-user1.png";
  }

  /**
   * Updates the component with the latest user data.
   */
  async update() {
    const id = this.dataset.id;
    await this.fetchUserData(id);
    if (this.user) this.refreshUI();
  }

  /**
   * Updates the UI elements without a full re-render.
   */
  refreshUI() {
    const { profile_image, username, email, posts_count, comments_count } = this.user;
    this.shadowRoot.querySelector("#profile-img").src = this.getProfileImage(profile_image);
    this.shadowRoot.querySelector("#username").textContent = this.escapeHTML(username);
    this.shadowRoot.querySelector("#email").textContent = this.escapeHTML(email);
    this.shadowRoot.querySelector("#posts-count").textContent = posts_count;
    this.shadowRoot.querySelector("#comments-count").textContent = comments_count;
  }
}

window.customElements.define("dashboard-c", DashboardComponent);
