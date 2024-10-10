class InputComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._inputValue = null;
  }

  set inputValue(value) {
    this._inputValue = value;
    this.setupInput();
  }

  get inputValue() {
    return this._inputValue;
  }

  connectedCallback() {
    this.initiallizeInputValue();
    this.addStyle();
    this.render();
    this.setupInput();
    this.attachEvents();

    // Use setTimeout to ensure the resize happens after the component is fully rendered
    setTimeout(() => this.resize(), 0);
  }

  initiallizeInputValue() {
    if (this.dataset?.hasOwnProperty("inputValue")) {
      this._inputValue = this.dataset.inputValue;
    } else {
      this._inputValue = "";
    }
  }

  render() {
    const template = document.createElement("template");
    template.innerHTML = this.getHTMLTemplate(this.inputValue).trim();
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  getHTMLTemplate(content) {
    const placeholder = this.dataset?.placeholder || "What's on your mind?";
    return /*html*/ `
      <p>
        <textarea part="input" placeholder="${placeholder}">${content}</textarea>
      </p>
    `;
  }

  addStyle() {
    const style = document.createElement("style");
    style.textContent = this.getCSS().trim();
    this.shadowRoot.appendChild(style);
  }

  getCSS() {
    return /*css*/ `
      * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
      }
      p {
        display: flex;
        justify-content: center; /* Center horizontally (if needed) */
        align-items: center;     /* Center vertically */
        min-height: 5rem;       /* Set a height to the container */
        width: 100%;            /* Set a height to the container */
      }
      textarea {
        padding: 1rem;
        padding-top: 1.25rem;
        font-size: 1.8rem;
        resize: none;
        height: 100%;           /* Height of the textarea */
        width: 100%;            /* Width of the textarea */
        overflow: hidden;
        border: none;
        border-radius: var(--br);
        outline: 0;
        background-color: rgb(var(--clr-tertiary-background));
        color: rgb(var(--clr-tertiary-foreground));
      }
    `;
  }

  attachEvents() {
    const textarea = this.shadowRoot.querySelector("textarea");
    textarea.addEventListener("input", (e) => {
      this.handleInput(textarea);
      this.dispatchEvent(
        new CustomEvent("input-changed", { detail: e.target.value })
      );
    });
  }

  handleInput(textarea) {
    try {
      this.inputValue = textarea.value;
      this.resize(textarea);
    } catch (error) {
      this.inputValue = null;
    }
  }

  resize() {
    const textarea = this.shadowRoot.querySelector("textarea");
    const p = textarea.parentElement;
    const minHeight = "5rem";

    // Reset height to auto to allow recalculation
    p.style.height = minHeight;

    // Set to content's scroll height if not empty
    if (textarea.value.trim()) {
      p.style.height = `${textarea.scrollHeight}px`;
    }
  }

  setupInput() {
    const textarea = this.shadowRoot.querySelector("textarea");
    textarea.value = this._inputValue;
    this.resize(); // Resize again to make sure it adjusts to initial content
  }

  focusInput() {
    const textarea = this.shadowRoot.querySelector("textarea");
    textarea.focus();
  }
}

export default InputComponent;

window.customElements.define("input-c", InputComponent);


// class InputComponent extends HTMLElement {
//   constructor() {
//     super();
//     this.attachShadow({ mode: "open" });
//     this._inputValue = null;
//   }

//   set inputValue(value) {
//     this._inputValue = value;
//     this.setupInput();
//   }

//   get inputValue() {
//     return this._inputValue;
//   }


//   connectedCallback() {
//     this.initiallizeInputValue();
//     this.addStyle();
//     this.render();
//     this.setupInput();
//     this.attachEvents();
//   }


//   initiallizeInputValue(){
//     if (this.dataset?.hasOwnProperty("inputValue")){
//       this._inputValue = this.dataset.inputValue ;
//     } else {
//       this._inputValue = "";
//     }
//   }

//   render() {
//     const template = document.createElement("template")
//     template.innerHTML = this.getHTMLTemplate(this.inputValue).trim();
//     this.shadowRoot.appendChild(template.content.cloneNode(true));
//     this.shadowRoot.querySelector("textarea").addEventListener("input", e =>{
//       this.inputValue = e.target.value;
//     })
//   }

//   getHTMLTemplate(content) {
//     const placeholder = this.dataset?.placeholder || "What's on your mind?";
//     return /*html*/ `
//         <p>
//             <textarea part="input"  placeholder="${placeholder}">${content}</textarea>
//         </p>
//         `;
//   }

//   addStyle() {
//     const style = document.createElement("style");
//     style.textContent = this.getCSS().trim();
//     this.shadowRoot.appendChild(style);
//   }

//   getCSS() {
//     return /*css*/ `
//         *{
//             padding: 0;
//             margin: 0;
//             box-sizing: border-box;
//         }
//         p{
//             display: flex;
//             justify-content: center; /* Center horizontally (if needed) */
//             align-items: center;     /* Center vertically */
//             min-height: 5rem;           /* Set a height to the container */
//             width:100%;           /* Set a height to the container */
//         }

//         textarea {
//             padding: 1rem;
//             padding-top: 1.25rem;
//             font-size: 1.8rem;
//             resize: none;
//             height: 100%;           /* Height of the textarea */
//             width: 100%;           /* Height of the textarea */
//             overflow: hidden;
//             border: none;
//             border-radius: var(--br);
//             outline:0;
//             background-color: rgb(var(--clr-tertiary-background));
//             color: rgb(var(--clr-tertiary-foreground));
//         }
//         `;
//   }

//   attachEvents() {
//     const textarea = this.shadowRoot.querySelector("textarea");
//     textarea.addEventListener("input", (e) => {
//       this.handleInput(textarea);
//       this.dispatchEvent(
//         new CustomEvent("input-changed", { detail: e.target.value })
//       );
//     });
//   }

//   handleInput(textarea) {
//     try {
//       this.inputValue = textarea.value;
//       this.resize(textarea);
//     } catch (error) {
//       this.inputValue = null;
//     }
//   }

//   resize() {
//     const textarea = this.shadowRoot.querySelector("textarea");
//     const p = textarea.parentElement;
//     const minHeight = "5rem";

//     // Reset height to auto to allow recalculation
//     p.style.height = minHeight;

//     // Set to content's scroll height if not empty
//     if (textarea.value.trim()) {
//       p.style.height = `${textarea.scrollHeight}px`;
//     }
//   }


//   setupInput() {
//     const textarea = this.shadowRoot.querySelector("textarea");
//     textarea.value = this._inputValue;
//     this.resize(textarea);
//   }

//   focusInput() {
//     const textarea = this.shadowRoot.querySelector("textarea");
//     this.resize(textarea);
//     textarea.focus();
//   }
// }

// export default InputComponent;

// window.customElements.define("input-c", InputComponent);
