export default class HomeView extends HTMLElement {
  constructor(params) {
    super();
    this.attachShadow({ mode: "open" });

    // Bind methods
    this.handlePostCreated = this.handlePostCreated.bind(this);
  }

  async connectedCallback() {
    await this.initializeComponent();
  }

  async initializeComponent() {
    this.renderTemplate();
    this.setupEventListeners();
  }

  disconnectedCallback() {
    this.cleanupEventListeners(); // Properly clean up event listeners on disconnect
  }

  renderTemplate() {
    this.shadowRoot.innerHTML = /*html*/ `
            <link rel="stylesheet" href="/static/css/common.css"/>
            <link rel="stylesheet" href="/static/css/homeview.css"/>
            <div id="homeView" class="wrapper main-color flex flex-col align-items-center gap">
                <post-creator></post-creator>
                <posts-wrapper pagination=true data-pathname="/posts"></posts-wrapper>
            </div>
        `;
  }

  setupEventListeners() {
    const postCreator = this.shadowRoot.querySelector("post-creator");
    if (postCreator) {
      postCreator.addEventListener("post-created", this.handlePostCreated);
    }
  }

  cleanupEventListeners() {
    const postCreator = this.shadowRoot.querySelector("post-creator");
    if (postCreator) {
      postCreator.removeEventListener("post-created", this.handlePostCreated);
    }
  }

  handlePostCreated(e) {
    this.shadowRoot.querySelector("posts-wrapper")?.addPost(e.detail);
  }

  /**
   * Utility to clear the shadow DOM content.
   */
  clear() {
    this.shadowRoot.innerHTML = "";
  }
}

window.customElements.define("home-view", HomeView);
