class PostEdit extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
        this.state = null;
    }

    connectedCallback() {
        this.render();
    }

    render() {
        let profileImg = this.state.author.profile_image;
        if (typeof profileImg === "object") {
            profileImg = "/static/assets/images/default-user1.png";
        }
        const username = this.state.author.username;
        const content = this.state.body;
        this.shadow.innerHTML = this.getHTMLTemplate(profileImg, username, content);

        this.attachEvents();
        //focus input
        this.shadow.querySelector("input-c").focusInput();
    }

    getHTMLTemplate(profileImg, username, content) {
        return /*html*/`
        <link rel="stylesheet" href="/static/css/common.css"/>
        <link rel="stylesheet" href="/static/css/postedit.css"/>
        <div class="backdrop">
            <div class="post-edit">
                <div class="header flex flex-center">
                    <h2>Edit post</h2>
                    <button id="close-btn" class="circle-btn close-btn"></button>
                </div>
                <div class="user-info">
                    <img class="profile-img" src=${profileImg} alt="profile image"/>
                    <span>${username}</span>
                </div>
                <div class="body flex flex-col gap">
                    <input-c data-input-value='${content}'></input-c>
                    ${this.PostImg()}
                </div>
                <button id="save-btn">Save</button>
            </div>
        </div>
        `
    }

    PostImg() {
        const img = this.state.image;
        if (typeof img === "object") return "";
        return `
        <div class="img-wrapper flex flex-center">
            <img class="post-img" src=${img} alt="post image"/>
        </div>`
    }

    attachEvents() {
        this.shadow.addEventListener("click", (event) => {
            if (event.target.id === "close-btn") this.remove();
            if (event.target.classList.contains("backdrop")) this.remove();
        })
    }

}

export default PostEdit;
window.customElements.define("post-edit", PostEdit);