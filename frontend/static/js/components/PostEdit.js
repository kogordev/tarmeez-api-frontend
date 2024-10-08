import Controller from "/static/js/controllers/controller.js";
import state from "/static/js/utils/state.js";
import { loader } from "/static/js/utils/loader.js";

class PostEdit extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.controller = new Controller();
    this.state = null;
    this.currentUser = null;
    this.scrollY = 0;

    this.bindMethods();
  }

  bindMethods() {
    this.onUploadChange = this.onUploadChange.bind(this);
    this.onRemoveImage = this.onRemoveImage.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onBackdropClick = this.onBackdropClick.bind(this);
    this.onInputChanged = this.onInputChanged.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  async connectedCallback() {
    this.saveScrollPosition();
    try {
      this.currentUser = await state.getCurrentUser();
      this.render();
    } catch (error) {
      this.displayError("Failed to load user information. Please try again later.");
    }
    this.restoreScrollPosition();
  }

  disconnectedCallback() {
    this.detachEvents();
    document.body.style.overflowY = "auto";
  }

  render() {
    document.body.style.overflowY = "hidden";
    this.style.visibility = "hidden";
    const { author = {}, body = "", image = "", created_at } = this.state || {};
    const profileImg = this.getProfileImage(author);
    const username = author.username || "Unknown";

    this.shadow.innerHTML = this.getHTMLTemplate(profileImg, username, body, image, created_at);
    this.toggleImageDisplay(typeof image !== "object");
    this.attachEvents();
    this.shadow.querySelector("input-c").focusInput();
    this.style.visibility = "visible";
  }

  getHTMLTemplate(profileImg, username, content, img, created_at) {
    return /*html*/`
      <link rel="stylesheet" href="/static/css/common.css"/>
      <link rel="stylesheet" href="/static/css/postedit.css"/>
      <div class="backdrop">
        <div class="post-edit">
          <div class="header flex flex-center">
            <h2>Edit post</h2>
            <button id="close-btn" class="circle-btn close-btn"></button>
          </div>
          <div class="user-info flex">
            <img height="40" width="40" class="profile-img" src="${profileImg}" alt="profile image"/>
            <div class="flex flex-col ml-1">
              <span id="username">${username}</span>
              <span id="created-at">${created_at}</span>
            </div>
          </div>
          <div class="body flex flex-col gap">
            <input-c data-input-value="${content}"></input-c>
            <div class="img-wrapper flex flex-center" style="display: none;">
              <img width="466" height="517.38" class="post-img" src="${img}" alt="post image"/>
              <button id="remove-btn" class="btn"></button>
            </div>
          </div>
          <div class="options flex align-items-center gap">
            <span>Add to your post</span>
            <button id="upload-btn" class="btn"></button>
            <input type="file" id="upload-input" accept="image/*" hidden/>
          </div>
          <div class="footer flex flex-col flex-center">
            <div id="error-msg" class="error-msg"></div>
            <button id="submit-btn" disabled>Submit</button>
          </div>
        </div>
      </div>
    `;
  }

  attachEvents() {
    this.addEventListener("click", e => e.stopPropagation());
    this.shadow.querySelector("#close-btn")?.addEventListener("click", this.onClose);
    this.shadow.querySelector(".backdrop")?.addEventListener("click", this.onBackdropClick);
    this.shadow.querySelector("#upload-btn")?.addEventListener("click", () => this.shadow.querySelector("#upload-input").click());
    this.shadow.querySelector("#upload-input")?.addEventListener("change", this.onUploadChange);
    this.shadow.querySelector("#remove-btn")?.addEventListener("click", this.onRemoveImage);
    this.shadow.querySelector("input-c")?.addEventListener("input-changed", this.onInputChanged);
    this.shadow.querySelector("#submit-btn")?.addEventListener("click", this.onSubmit);
  }

  detachEvents() {
    this.shadow.querySelector("#close-btn")?.removeEventListener("click", this.onClose);
    this.shadow.querySelector(".backdrop")?.removeEventListener("click", this.onBackdropClick);
    this.shadow.querySelector("#upload-btn")?.removeEventListener("click", () => this.shadow.querySelector("#upload-input").click());
    this.shadow.querySelector("#upload-input")?.removeEventListener("change", this.onUploadChange);
    this.shadow.querySelector("#remove-btn")?.removeEventListener("click", this.onRemoveImage);
    this.shadow.querySelector("input-c")?.removeEventListener("input-changed", this.onInputChanged);
    this.shadow.querySelector("#submit-btn")?.removeEventListener("click", this.onSubmit);
  }

  onUploadChange(event) {
    const file = event.target.files[0];
    if (file) {
      this.readFileAsDataURL(file).then((result) => {
        const img = this.shadow.querySelector(".post-img");
        img.src = result;
        this.toggleImageDisplay(true);
        this.shadow.querySelector("#submit-btn").removeAttribute("disabled");
      });
    }
  }

  onRemoveImage() {
    const img = this.shadow.querySelector(".post-img");
    const uploadInput = this.shadow.querySelector("#upload-input");
    img.src = "";
    uploadInput.value = null;
    this.toggleImageDisplay(false);
    this.shadow.querySelector("#submit-btn").removeAttribute("disabled");
  }

  async onSubmit() {
    loader(async () => {
      const body = this.shadow.querySelector("input-c").inputValue;
      const uploadInput = this.shadow.querySelector("#upload-input");

      const formData = this.buildFormData(body, uploadInput);
      if (!formData) return;

      try {
        const url = `/posts/${this.state.id}`;
        const headers = { "Authorization": `Bearer ${this.currentUser.token}` };
        const response = await this.controller.request(url, "POST", formData, headers);
        if (response.status >= 200 && response.status < 300) {
          this.dispatchEvent(new CustomEvent("post-edited", { detail: response.data }));
        } else {
          this.displayError("Failed to edit the post. Please try again.");
        }
      } catch (error) {
        this.displayError("An error occurred while submitting the post. Please try again.");
      }
    });
  }


  buildFormData(body, uploadInput) {
    const thereIsFile = uploadInput.files.length > 0;
    const thereIsImg = this.shadow.querySelector(".post-img")?.getAttribute("src");

    if (typeof this.state.image === "string" && !thereIsFile && !thereIsImg) {
      // Display an error if there is no image selected and the original post has an image
      this.displayError("Please upload an image to proceed.");
      return null;  // Return `null` to indicate form data creation failed
    }

    const formData = new FormData();
    formData.append("body", body);
    formData.append("_method", "put");
    if (thereIsFile) formData.append("image", uploadInput.files[0]);

    return formData;
  }


  displayError(message) {
    const errorContainer = this.shadow.querySelector("#error-msg");
    if (errorContainer) {
      errorContainer.textContent = message;
      errorContainer.style.display = "block";
      setTimeout(() => (errorContainer.style.display = "none"), 5000);
    }
  }

  readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  getProfileImage(author) {
    return typeof author.profile_image === "object" ? "/static/assets/images/default-user1.png" : author.profile_image;
  }

  toggleImageDisplay(show) {
    const imgWrapper = this.shadow.querySelector(".img-wrapper");
    imgWrapper.style.display = show ? "flex" : "none";
  }

  saveScrollPosition() {
    this.scrollY = window.scrollY;
  }

  restoreScrollPosition() {
    window.scrollTo(0, this.scrollY);
  }

  onClose() {
    this.remove();
  }

  onBackdropClick(event) {
    if (event.target.classList.contains("backdrop")) this.remove();
  }

  onInputChanged() {
    this.shadow.querySelector("#submit-btn").removeAttribute("disabled");
  }
}

export default PostEdit;
window.customElements.define("post-edit", PostEdit);


// import Controller from "/static/js/controllers/controller.js";
// import state from "/static/js/utils/state.js";
// import { loader } from "/static/js/utils/loader.js";

// class PostEdit extends HTMLElement {
//   constructor() {
//     super();
//     this.shadow = this.attachShadow({ mode: "open" });
//     this.controller = new Controller();
//     this.state = null;
//     this.currentUser = null;
//     this.scrollY = 0;

//     // Bound methods
//     this.onUploadChange = this.onUploadChange.bind(this);
//     this.onRemoveImage = this.onRemoveImage.bind(this);
//     this.onClose = this.onClose.bind(this);
//     this.onBackdropClick = this.onBackdropClick.bind(this);
//     this.onInputChanged = this.onInputChanged.bind(this);
//     this.onSubmit = this.onSubmit.bind(this);
//   }

//   async connectedCallback() {
//     this.scrollY = window.scrollY; // Save the current scroll position
//     try {
//       this.currentUser = await state.getCurrentUser();
//       this.render();
//     } catch (error) {
//       console.error("Error loading current user:", error);
//       this.displayError("Failed to load user information. Please try again later.");
//     }
//     window.scrollTo(0, this.scrollY); // Restore the scroll position
//   }

//   disconnectedCallback() {
//     this.detachEvents();
//     document.body.style.overflowY = "auto";
//   }

//   render() {
//     document.body.style.overflowY = "hidden";
//     const { author = {}, body = "", image = "" } = this.state || {};
//     const profileImg = typeof author.profile_image === "object" ? "/static/assets/images/default-user1.png" : author.profile_image;
//     const username = author.username || "Unknown";

//     this.shadow.innerHTML = this.getHTMLTemplate(profileImg, username, body, image);
//     if (typeof image === "object") {
//       const imgWrapper = this.shadow.querySelector(".img-wrapper");
//       console.log(imgWrapper)
//       if (imgWrapper) {
//         imgWrapper.style.display = "none";
//       }
//     }
//     this.attachEvents();
//     this.shadow.querySelector("input-c").focusInput(); // Focus on the input component
//   }

//   getHTMLTemplate(profileImg, username, content, img) {
//     return /*html*/ `
//       <link rel="stylesheet" href="/static/css/common.css"/>
//       <link rel="stylesheet" href="/static/css/postedit.css"/>
//       <div class="backdrop">
//         <div class="post-edit">
//           <div class="header flex flex-center">
//             <h2>Edit post</h2>
//             <button id="close-btn" class="circle-btn close-btn"></button>
//           </div>
//           <div class="user-info">
//             <img class="profile-img" src="${profileImg}" alt="profile image"/>
//             <span>${username}</span>
//           </div>
//           <div class="body flex flex-col gap">
//             <input-c data-input-value="${content}"></input-c>
//             <div class="img-wrapper flex flex-center">
//               <img width="466" height="517.38" class="post-img" src="${img}" alt="post image"/>
//               <button id="remove-btn" class="btn"></button>
//             </div>
//           </div>
//           <div class="options flex align-items-center gap">
//             <span>Add to your post</span>
//             <button id="upload-btn" class="btn" ></button>
//             <input type="file" id="upload-input" accept="image/*" hidden/>
//           </div>
//           <div class="footer flex flex-col flex-center">
//             <div id="error-msg" class="error-msg"></div> <!-- Error Message Container -->
//             <button id="submit-btn" disabled>Submit</button>
//           </div>
//         </div>
//       </div>
//     `;
//   }
//   //  ${img ? this.getPostImageHTML(img) : ""}

//   // getPostImageHTML(img) {
//   //   return `
//   //     <div class="img-wrapper flex flex-center">
//   //       <img width="466" height="517.38" class="post-img" src="${img}" alt="post image"/>
//   //       <button id="remove-btn" class="btn"></button>
//   //     </div>`;
//   // }

//   attachEvents() {
//     this.addEventListener("click", e => e.stopPropagation());
//     this.shadow.querySelector("#close-btn")?.addEventListener("click", this.onClose);
//     this.shadow.querySelector(".backdrop")?.addEventListener("click", this.onBackdropClick);
//     this.shadow.querySelector("#upload-btn")?.addEventListener("click", () => this.shadow.querySelector("#upload-input").click());
//     this.shadow.querySelector("#upload-input")?.addEventListener("change", this.onUploadChange);
//     this.shadow.querySelector("#remove-btn")?.addEventListener("click", this.onRemoveImage);
//     this.shadow.querySelector("input-c")?.addEventListener("input-changed", this.onInputChanged);
//     this.shadow.querySelector("#submit-btn")?.addEventListener("click", this.onSubmit);
//   }

//   detachEvents() {
//     this.shadow.querySelector("#close-btn")?.removeEventListener("click", this.onClose);
//     this.shadow.querySelector(".backdrop")?.removeEventListener("click", this.onBackdropClick);
//     this.shadow.querySelector("#upload-btn")?.removeEventListener("click", () => this.shadow.querySelector("#upload-input").click());
//     this.shadow.querySelector("#upload-input")?.removeEventListener("change", this.onUploadChange);
//     this.shadow.querySelector("#remove-btn")?.removeEventListener("click", this.onRemoveImage);
//     this.shadow.querySelector("input-c")?.removeEventListener("input-changed", this.onInputChanged);
//     this.shadow.querySelector("#submit-btn")?.removeEventListener("click", this.onSubmit);
//   }

//   onUploadChange(event) {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const img = this.shadow.querySelector(".post-img");
//         const imgWrapper = this.shadow.querySelector(".img-wrapper");
//         img.src = e.target.result;
//         imgWrapper.style.display = "block";
//         this.shadow.querySelector("#submit-btn").removeAttribute("disabled");
//       };
//       reader.readAsDataURL(file);
//     }
//   }

//   onRemoveImage() {
//     const img = this.shadow.querySelector(".post-img");
//     const imgWrapper = this.shadow.querySelector(".img-wrapper");
//     const uploadInput = this.shadow.querySelector("#upload-input");
//     if (imgWrapper && img) {
//       img.src = "";
//       uploadInput.value = null;
//       imgWrapper.style.display = "none";
//     }
//   }

//   onClose() {
//     this.remove();
//   }

//   onBackdropClick(event) {
//     if (event.target.classList.contains("backdrop")) this.remove();
//   }

//   onInputChanged() {
//     this.shadow.querySelector("#submit-btn").removeAttribute("disabled");
//   }

//   async onSubmit() {
//     loader(async () => {
//       const body = this.shadow.querySelector("input-c");
//       const uploadInput = this.shadow.querySelector("#upload-input");

//       const formData = new FormData();
//       if (uploadInput.files.length > 0) {
//         formData.append("image", uploadInput.files[0]);
//       }
//       formData.append("body", body.inputValue);
//       formData.append("_method", "put");

//       try {
//         const url = `/posts/${this.state.id}`;
//         const headers = {
//           "Authorization": `Bearer ${this.currentUser.token}`,
//         };
//         const response = await this.controller.request(url, "POST", formData, headers);
//         if (response.status >= 200 && response.status < 300) {
//           this.dispatchEvent(new CustomEvent("post-edited", { detail: response.data }));
//         } else {
//           this.displayError("Failed to edit the post. Please try again.");
//         }
//       } catch (error) {
//         console.error("Error submitting post:", error);
//         this.displayError(error.msg || "An error occurred while submitting the post. Please try again.");
//       }
//     });
//   }

//   displayError(message) {
//     const errorContainer = this.shadow.querySelector("#error-msg");
//     if (errorContainer) {
//       errorContainer.textContent = message;
//       errorContainer.style.display = "block";
//       setTimeout(() => {
//         errorContainer.style.display = "none";
//       }, 5000); // Hide error after 5 seconds
//     }
//   }
// }

// export default PostEdit;
// window.customElements.define("post-edit", PostEdit);
