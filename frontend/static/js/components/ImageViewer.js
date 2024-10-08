class ImageViewer extends HTMLElement {
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
      this.image = null;
  
      // Bound methods
      this.onClose = this.onClose.bind(this);
      this.onBackdropClick = this.onBackdropClick.bind(this);
    }
  
    connectedCallback() {
      this.render();
      this.attachEvents();
    }
  
    disconnectedCallback() {
      this.detachEvents();
      this.restoreScrollState();
    }
  
    render() {
      this.disableScroll();
      this.shadow.innerHTML = this.getHTMLTemplate();
      this.addImg();
    }
  
    getHTMLTemplate() {
      return /*html*/ `
        <link rel="stylesheet" href="/static/css/common.css"/>
        <style>
          ${this.getComponentCSS()}
        </style>
        <div class="backdrop">
          <div  class="image-container flex flex-center">
            <button id="close-btn" class="circle-btn close-btn">&#10005;</button>
            <div class="img-wrapper position-relative">
              <!-- Image will be dynamically inserted here -->
            </div>
          </div>
        </div>
      `;
    }
  
    addImg() {
      if (this.image) {
        const img = document.createElement("img");
        img.src = this.image;
        img.classList.add("img");
        this.shadow.querySelector(".img-wrapper").appendChild(img);
      } else {
        console.warn("No image provided in state.");
      }
    }
  
    attachEvents() {
      const closeButton = this.shadow.querySelector("#close-btn");
      const backdrop = this.shadow.querySelector(".backdrop");
  
      closeButton?.addEventListener("click", this.onClose);
      backdrop?.addEventListener("click", this.onBackdropClick);
    }
  
    detachEvents() {
      const closeButton = this.shadow.querySelector("#close-btn");
      const backdrop = this.shadow.querySelector(".backdrop");
  
      closeButton?.removeEventListener("click", this.onClose);
      backdrop?.removeEventListener("click", this.onBackdropClick);
    }
  
    onClose() {
      this.remove(); // Safely remove the component
    }
  
    onBackdropClick(event) {
      if (event.target.classList.contains("backdrop")) {
        this.remove();
      }
    }
  
    disableScroll() {
      document.body.style.overflowY = "hidden";
    }
  
    restoreScrollState() {
      document.body.style.overflowY = "auto";
    }
  
    getComponentCSS() {
      return `
        :host {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1000;
        }
  
        .backdrop {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          opacity: 0;
          animation: fadeIn 0.4s forwards;
        }
  
        .image-container {
          position: relative;
          max-width: 90%;
          max-height: 90%;
          background: transparent;
          border-radius: 8px;
          overflow: hidden;
          transform: scale(0.7);
          animation: scaleIn 0.4s forwards;
        }
  
        .circle-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          padding: 5px 10px;
          font-size: 16px;
          border: none;
          background: rgba(0, 0, 0, 0.5);
          color: white;
          border-radius: 50%;
          cursor: pointer;
          transition: background 0.3s ease;
        }
  
        .circle-btn:hover {
          background: rgba(0, 0, 0, 0.8);
        }
  
        .img-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          padding: 10px;
        }
  
        .img {
          max-width: 100%;
          max-height: 100%;
          border-radius: 8px;
          box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.5);
          object-fit: contain;
        }
  
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
  
        @keyframes scaleIn {
          from {
            transform: scale(0.7);
          }
          to {
            transform: scale(1);
          }
        }
      `;
    }
  }
  
  export default ImageViewer;
  window.customElements.define("img-viewer", ImageViewer);
  