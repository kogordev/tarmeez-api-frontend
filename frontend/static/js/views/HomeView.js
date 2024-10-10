export default class HomeView extends HTMLElement {
  constructor(params) {
    super();
    document.title = "Tarmeez | Home"
    this.attachShadow({ mode: "open" });


    // Bind methods
    this.handlePostCreated = this.handlePostCreated.bind(this);
  }

  connectedCallback() {
    this.style.display = "none";
    this.initializeComponent();
    this.style.display = "block";
  }

  async initializeComponent() {
    this.addStyle();
    this.renderTemplate();
    this.setupEventListeners();
  }

  disconnectedCallback() {
    this.cleanupEventListeners(); // Properly clean up event listeners on disconnect
  }

  getCss() {
    return /*css*/`
    *{
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    } 
    :host{
        display: block;
        overflow-y: hidden;
    } 
    .wrapper{
        height: 100%;
        width: 100%;
    }
    .flex{
        display: flex;
    }
    .flex-col{
        flex-direction: column;
    }
    .flex-center{
        justify-content: center;
        align-items: center;
    }
    .justify-content-center{
        justify-content: center;
    }
    .align-items-center{
        align-items: center;
    }
    #posts-wrapper{
    margin-bottom: 1rem;
    }
    .main-color {
      background-color: rgb(var(--clr-main-background));
      color: rgb(var(--clr-main-foreground));
    }
    .gap {
      gap: 1rem;
    }
    `
  }

  addStyle() {
    const style = document.createElement("style");
    style.textContent = this.getCss().trim();
    this.shadowRoot.appendChild(style);
  }

  getHTMLTemplate() {
    return /*html*/ `
     <div id="homeView" class="wrapper main-color flex flex-col align-items-center gap">
         <post-creator></post-creator>
         <posts-wrapper pagination=true data-pathname="/posts"></posts-wrapper>
     </div>`;
  }

  renderTemplate() {
    const template = document.createElement("template");
    template.innerHTML = this.getHTMLTemplate().trim();
    this.shadowRoot.appendChild(template.content.cloneNode(true));
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
