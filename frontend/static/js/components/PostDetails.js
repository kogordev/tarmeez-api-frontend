import Controller from "/static/js/controllers/controller.js";

class PostDetails extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.controller = new Controller();
    this.postId = null;
    this.state = null;
    this.isChanged = false;
  }

  initializePostId() {
    try {
      this.postId = this.dataset.postId;
    } catch (error) {
      this.postId = null;
      console.log(error);
    }
  }

  async getPostDetails(id) {
    try {
      const url = `/posts/${id}`;
      const response = await this.controller.request(url);
      return response.data;
    } catch (error) {
      console.log(error);
      this.isChanged = false;
      return null;
    }
  }

  async initializeState() {
    this.state = await this.getPostDetails(this.postId);
  }

  async connectedCallback() {
    this.initializePostId();
    await this.initializeState();
    if (!(this.postId && this.state)) return;
    await this.render();
  }

  disconnectedCallback() {
    document.body.style.overflowY = "auto";
    this.dispatchEvent(
      new CustomEvent("closed", { detail: { isChanged: this.isChanged } })
    );
  }

  async render() {
    document.body.style.overflowY = "hidden";
    this.renderHTMLTemplate();
    await this.addPostComp();
    await this.addCommentsWrapper();
    await this.addCommentCreator();
    this.attachEventListeners();
  }

  renderHTMLTemplate() {
    this.shadowRoot.innerHTML = this.getHTMLTemplate();
  }

  getHTMLTemplate() {
    const username = this.state.author.username;

    return /*html*/ `
        <link rel="stylesheet" href="/static/css/common.css">
        <link rel="stylesheet" href="/static/css/postdetails.css">
        <div class="backdrop">
            <div class="post-details">
                <div class="col header flex flex-center shadow">
                    <h2>Post by ${username}</h2>
                    <button id="close-btn" class="circle-btn close-btn"></button>
                </div>
                <div class="col body">
                    <div id="post-section"></div>
                    <div id="comments-wrapper-section"></div>
                </div>
                <div id="comment-creator-section" class="col footer shadow padding"></div>
            </div>
        </div>
        `;
  }

  async addPostComp() {
    const postSection = this.shadowRoot.querySelector("#post-section");
    const postComp = await document.createElement("post-c");

    // Preload image and set dimensions if necessary
    const imageSrc = this.state?.image; // Assuming your state contains an image URL
    if (typeof imageSrc === "string") {
      const { width, height } = await this.preloadImage(imageSrc);
      postComp.style.setProperty("--img-width", `${width}px`);
      postComp.style.setProperty("--img-height", `${height}px`);
    }

    postComp.state = this.state;
    postComp.setAttribute("withCount", "true");
    postSection.appendChild(postComp);
  }

  // Helper function to preload the image and get its dimensions
  preloadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = () => reject(new Error("Failed to load image"));
    });
  }

  async addCommentsWrapper() {
    const commentsWrapperSection = this.shadowRoot.querySelector(
      "#comments-wrapper-section"
    );
    const commentsWrapper = await document.createElement("comments-wrapper");
    commentsWrapper.dataset.postId = this.postId;
    commentsWrapperSection.appendChild(commentsWrapper);
  }

  async addCommentCreator() {
    const commentsCreatorSection = this.shadowRoot.querySelector(
      "#comment-creator-section"
    );
    const commentCreator = await document.createElement("comment-creator");
    commentCreator.dataset.postId = this.postId;
    commentsCreatorSection.appendChild(commentCreator);
  }

  attachEventListeners() {
    this.shadowRoot
      .querySelector("comment-creator")
      .addEventListener("comment-added", (e) => {
        this.handleCommentAdded(e);
      });

    this.shadowRoot
      .querySelector("comments-wrapper")
      .addEventListener("comments-updated", (e) => {
        this.state = e.detail;
        this.shadowRoot
          .querySelector("post-c")
          .setAttribute("data-comments-count", this.state.comments_count);
      });

    this.shadowRoot
      .querySelector("post-c")
      .addEventListener("post-deleted", (e) => {
        this.dispatchEvent(
          new CustomEvent("post-deleted", { detail: e.detail })
        );
      });

    this.shadowRoot.addEventListener("click", (event) => {
      if (event.target.id === "close-btn") this.remove();
      if (event.target.classList.contains("backdrop")) this.remove();
    });
  }

  async handleCommentAdded(e) {
    this.state = await this.getPostDetails(this.postId);
    this.shadowRoot
      .querySelector("post-c")
      .updateCommentCount(this.state.comments_count);
    this.shadowRoot.querySelector("comments-wrapper").update();
    this.isChanged = true;
    this.scrollToComments();
  }

    scrollToComments() {
    const postBody = this.shadowRoot.querySelector(".body");
    const scrHeight = postBody.scrollHeight;
    setTimeout(() => {
      postBody.scroll({ behavior: "smooth", top: scrHeight });
    }, 200);
  }
  
}

export default PostDetails;
customElements.define("post-details", PostDetails);


// import Controller from "/static/js/controllers/controller.js";
// import {loader} from "/static/js/utils/loader.js";

// class PostDetails extends HTMLElement {
//   constructor() {
//     super();
//     this.attachShadow({ mode: "open" });
//     this.controller = new Controller();
//     this.postId = null;
//     this.state = null;
//     this.isChanged = false;
//   }

//   initializePostId() {
//     try {
//       this.postId = this.dataset.postId;
//     } catch (error) {
//       this.postId = null;
//       console.log(error);
//     }
//   }

//   async getPostDetails(id) {
//     try {
//       const url = `/posts/${id}`;
//       const response = await this.controller.request(url);
//       return response.data;
//     } catch (error) {
//       console.log(error);
//       this.isChanged = false;
//       return null;
//     }
//   }

//   async initializeState() {
//     this.state = await this.getPostDetails(this.postId);
//   }

//   async connectedCallback() {
//     this.initializePostId();
//     await this.initializeState();
//     if (!(this.postId && this.state)) return;
//     await this.render()
//   }

//   scrollToComments() {
//     const postBody = this.shadowRoot.querySelector(".body");
//     const scrHeight = postBody.scrollHeight;
//     setTimeout(() => {
//       postBody.scroll({ behavior: "smooth", top: scrHeight });
//     }, 200);
//   }

//   disconnectedCallback() {
//     document.body.style.overflowY = "auto";
//     this.dispatchEvent(
//       new CustomEvent("closed", { detail: { isChanged: this.isChanged } })
//     );
//   }

//   async render() {
      
//     document.body.style.overflowY = "hidden";
//     this.renderHTMLTemplate();
//     await this.addPostComp();
//     await this.addCommentsWrapper();
//     await this.addCommentCreator();
//     this.attachEventListeners();
//   }

//   async renderHTMLTemplate() {
//     this.shadowRoot.innerHTML = this.getHTMLTemplate();
//   }

//   getHTMLTemplate() {
//     const username = this.state.author.username;

//     return /*html*/ `
//         <link rel="stylesheet" href="/static/css/common.css">
//         <link rel="stylesheet" href="/static/css/postdetails.css">
//         <div class="backdrop">

//             <div class="post-details">
//                 <div class="col header flex flex-center shadow">
//                     <h2>Post by ${username}</h2>
//                     <button id="close-btn" class="circle-btn close-btn"></button>
//                 </div>
//                 <div class="col body">
//                     <div id="post-section"></div>
//                     <div id="comments-wrapper-section"></div>
//                 </div>
//                 <div id="comment-creator-section" class="col footer shadow padding"></div>
//             </div>

//         </div>
//         `;
//   }

//   async addPostComp() {
//     const postSection = this.shadowRoot.querySelector("#post-section");
//     const postComp = await document.createElement("post-c");
//     postComp.state = this.state;
//     postComp.setAttribute("withCount", "true");
//     postSection.appendChild(postComp);
//   }

//   handlePostDelete(e) {
//     this.dispatchEvent(new CustomEvent("post-deleted", { detail: e.detail }));
//   }

//   async addCommentsWrapper() {
//     const commentsWrapperSection = this.shadowRoot.querySelector(
//       "#comments-wrapper-section"
//     );
//     const commentsWrapper = await document.createElement("comments-wrapper");
//     commentsWrapper.dataset.postId = this.postId;
//     commentsWrapperSection.appendChild(commentsWrapper);
//   }

//   async addCommentCreator() {
//     const commentsCreatorSection = this.shadowRoot.querySelector(
//       "#comment-creator-section"
//     );
//     const commentCreator = await document.createElement("comment-creator");
//     commentCreator.dataset.postId = this.postId;
//     commentsCreatorSection.appendChild(commentCreator);
//   }

//   attachEventListeners() {
//     this.shadowRoot
//       .querySelector("comment-creator")
//       .addEventListener("comment-added", (e) => {
//         this.handlelCommentAdded(e);
//       });

//     this.shadowRoot
//       .querySelector("comments-wrapper")
//       .addEventListener("comments-updated", (e) => {
//         this.state = e.detail;
//         this.shadowRoot
//           .querySelector("post-c")
//           .setAttribute("data-comments-count", this.state.comments_count);
//       });

//     this.shadowRoot
//       .querySelector("post-c")
//       .addEventListener("post-deleted", (e) => {
//         console.log("post deleted from post details")
//         this.dispatchEvent(
//           new CustomEvent("post-deleted", { detail: e.detail })
//         );
//       });

//     this.shadowRoot.addEventListener("click", (event) => {
//       if (event.target.id === "close-btn") this.remove();
//       if (event.target.classList.contains("backdrop")) this.remove();
//     });
//   }

//   updateCommentCount() {
//     const commentsCount = this.state.comments.length; // Use local array length
//     const postComponent = this.shadowRoot.querySelector("post-c");
//     if (postComponent) {
//       postComponent.setAttribute("data-comments-count", commentsCount);
//     }
//   }

//   async handlelCommentAdded(e) {
//     //
//     this.state = await this.getPostDetails(this.postId);
//     this.shadowRoot
//       .querySelector("post-c")
//       .updateCommentCount(this.state.comments_count);
//     this.shadowRoot.querySelector("comments-wrapper").update();
//     this.isChanged = true;
//     this.scrollToComments();
//     this.isChanged = true; // flag /post detail close tell the parent there are changes;
//   }
// }

// export default PostDetails;
// customElements.define("post-details", PostDetails);
