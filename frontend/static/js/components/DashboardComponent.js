import Controller from "/static/js/controllers/controller.js";

export default class DashboardComponent extends HTMLElement {
  constructor() {
    super();
    this.controller = new Controller();
    this.user = null; // Initialize user data
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    this.style.display = "none";
    try {
      await this.load();
    } catch (error) {
      console.error("Error initializing component:", error);
    }
    this.style.display = "block";
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
      this.dispatchEvent(new CustomEvent("user-loaded", { detail: this.user }));
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
    this.clearShadowDOM();
    this.addStyle();
    this.attachTemplate();
    this.shadowRoot.querySelector("#profile-img").addEventListener("click", () => {
      const profileImg = document.createElement("img-viewer");
      profileImg.image = this.getProfileImage(this.user.profile_image);
      document.body.appendChild(profileImg);
    })
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

  getCss(){
    return /*css*/`
    :host{
      display: block;
    }  
    *{
      padding: 0;
      margin: 0;
      box-sizing: border-box;
    }
    .col{
        /* border-radius: var(--br); */
        background-color: rgb(var(--clr-tertiary-background));
        box-shadow: var(--box-shadow-light);
        overflow: hidden;
        border-radius: var(--br);
    }  
    img{
        /* height: 100px;
        width: 100px; */
        object-fit: cover;
        border-radius: 50%;
        cursor: pointer;
    } 
    .number{
        font-size: 5rem;
        font-weight: 600;
    }  
    .label{
        font-size: 1.2rem;
        color: rgb(var(--clr-tertiary-foreground))
    }  
    .username{
        font-weight: 600;
        letter-spacing: .2rem;
        text-transform: capitalize;
        margin-top: 1rem;
    }
    .email{
        font-size: 1.4rem;
        font-weight: 500;
    }
    .padding {
      padding: 2rem;
    }
    .grid {
        display: grid;
        gap: 1rem;
    }
    .col-3 {
        grid-template-columns: repeat(3, 1fr);
    }
    .hidden{
      visibility:hidden;
    }
    .flex {
        display: flex;
    }
    .flex-col {
        flex-direction: column;
    }
    .flex-center {
      justify-content: center;
      align-items: center;
    }
    .gap {
        gap: 1rem;
    }
    .card {
      width: 680px;
      background-color: rgb(var(--clr-secondary-background));
      color: rgb(var(--clr-main-foreground));
      border-radius: var(--br);
    }
    .img-col{
      position: relative;
    }
      `
    }

  addStyle(){
    const style = document.createElement("style");
    style.textContent = this.getCss().trim();
    this.shadowRoot.appendChild(style);
  }

  /**
   * Clears the shadow DOM content.
   */
  clearShadowDOM() {
    this.shadowRoot.innerHTML = "";
  }

  getHTMLTemplate(profile_image, username, email, posts_count, comments_count){
    return /*html*/`
    <div class="card padding grid col-3 transition-opacity hidden">
      <div class="col padding flex flex-col gap">
        <div class="img-col flex flex-col flex-center">
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
   * Attaches the main component template.
   */
  attachTemplate() {
    const { profile_image, username, email, posts_count, comments_count } = this.user;

    const template = document.createElement("template");
    template.innerHTML = this.getHTMLTemplate(profile_image, username, email, posts_count, comments_count).trim();
    this.shadowRoot.appendChild(template.content.cloneNode(true));
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

  getUser() {
    console.log("dashboard:", this.user)
    return this.user;
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
