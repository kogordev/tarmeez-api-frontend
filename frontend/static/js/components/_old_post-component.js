export default class PostComponent extends  HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode: "open"});
        this.state = null;
    }

    connectedCallback(){
        this.render();
    }

    render(){
        if (!this.state) return;
        
        this.id = this.state.id;
        
        const profileImage = typeof this.state.author.profile_image == "string" ?  this.state.author.profile_image : "/static/assets/images/default-user1.png" ;

        const postImage = typeof this.state.image == "string" ? this.state.image : null

        const profileUrl = `/users/${this.state.author.id}`;

        this.shadowRoot.innerHTML = /*html*/`       
        <link rel="stylesheet" href="/static/css/common.css">
        <article class="post shadow">
            <div class="post__header">
                <div class="post__profile__img flex flex-center">
                    <navlink-c class="navlink-img" data-img="${profileImage}" data-to=${profileUrl}>
                    </navlink-c>
                    <div class="post__popup shadow-lg">
                        <a href="#">
                            <img class="post__popup__img" src="${profileImage}" alt="" width="96"
                                height="96">
                        </a>
                        <div class="post__popup__main">
                            <a class="post__popup__link" href="#">${this.state.author.username}</a>
                            <div class="post__popup__wrapper">
                                <div class="post__popup__info">
                                    <svg class="post__popup__svg" xmlns="http://www.w3.org/2000/svg" height="20"
                                        width="20"
                                        viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                                        <path
                                            d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" />
                                    </svg>
                                    <span class="post__popup__number">625</span>
                                    <span class="post__popup__label">post</span>
                                </div>
                                <div class="post__popup__info">
                                    <svg class="post__popup__svg" xmlns="http://www.w3.org/2000/svg" height="20"
                                        width="20"
                                        viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                                        <path
                                            d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c0 0 0 0 0 0s0 0 0 0s0 0 0 0c0 0 0 0 0 0l.3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z" />
                                    </svg>
                                    <span class="post__popup__number">259</span>&nbsp;
                                    <span class="post__popup__label">comment</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="post__info">
                    <div class="post__info__wrapper post__info__username">
                        <div class="post__username">
                            <a href="#" class="post__info__username__link">${this.state.author.username}</a>
                            <div class="post__popup shadow-lg">
                                <a href="#">
                                    <img class="post__popup__img" src="${profileImage}" alt="" width="96"
                                        height="96">
                                </a>
                                <div class="post__popup__main">
                                    <a class="post__popup__link" href="#">${this.state.author.username}</a>
                                    <div class="post__popup__wrapper">
                                        <div class="post__popup__info">
                                            <svg class="post__popup__svg" xmlns="http://www.w3.org/2000/svg" height="20"
                                                width="20"
                                                viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                                                <path
                                                    d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" />
                                            </svg>
                                            <span class="post__popup__number">625</span>
                                            <span class="post__popup__label">post</span>
                                        </div>
                                        <div class="post__popup__info">
                                            <svg class="post__popup__svg" xmlns="http://www.w3.org/2000/svg" height="20"
                                                width="20"
                                                viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                                                <path
                                                    d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c0 0 0 0 0 0s0 0 0 0s0 0 0 0c0 0 0 0 0 0l.3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z" />
                                            </svg>
                                            <span class="post__popup__number">259</span>
                                            <span class="post__popup__label">comment</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="post__info__wrapper post__info__time">
                        <a href="#" class="post__info__time__link">${this.state.created_at}</a>
                    </div>
                </div>

                <input type="checkbox" name="" id="chbx">
                <div class="post__menu">
                    <svg class="post__menu__caret" height="12" viewBox="0 0 21 12" width="21"
                        class="xem7dle x10l6tqk xng853d xdlq8gc" fill="var(--card-background)"
                        style="transform: scale(-1, -1) translate(0px, 0px);">
                        <path
                            d="M21 0c-2.229.424-4.593 2.034-6.496 3.523L5.4 10.94c-2.026 2.291-5.434.62-5.4-2.648V0h21Z">
                        </path>
                    </svg>
                    <div class="post__menu__body shadow-lg">
                        <!-- edit button -->
                        <label class="post__menu__item" for="chbx">
                            <svg class="post__menu__svg" width="20" height="20" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 448 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                                <path
                                    d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zM325.8 139.7l14.4 14.4c15.6 15.6 15.6 40.9 0 56.6l-21.4 21.4-71-71 21.4-21.4c15.6-15.6 40.9-15.6 56.6 0zM119.9 289L225.1 183.8l71 71L190.9 359.9c-4.1 4.1-9.2 7-14.9 8.4l-60.1 15c-5.5 1.4-11.2-.2-15.2-4.2s-5.6-9.7-4.2-15.2l15-60.1c1.4-5.6 4.3-10.8 8.4-14.9z" />
                            </svg>
                            <span>Edit post</span>
                        </label>
                        <hr>
                        <!-- delete button -->
                        <label class="post__menu__item" for="chbx">
                            <svg class="post__menu__svg" width="20" height="20" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 448 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                                <path
                                    d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z" />
                            </svg>
                            <span>Delete post</span>
                        </label>
                    </div>
                </div>
                <label class="post__button" for="chbx">
                    <svg class="post__button__svg" width="20" height="20" xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                        <path
                            d="M8 256a56 56 0 1 1 112 0A56 56 0 1 1 8 256zm160 0a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm216-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112z" />
                    </svg>
                </label>
            </div>
            <p class="post__body">${this.state.body}</p>
            <div class="post__img__wrapper">
                <img src="${postImage}" alt="" class="post__img">
            </div>
            <div class="post__comments__wrapper">
                <a href="#" class="post__comments__link"><span>${this.state.comments_count}</span> comments</a>
            </div>
        </article>
        `

        // convert post date into  Saturday, August 31, 2024 at 7:12 PM
        // from 2024-09-02T20:24:50.000000Z
        let [postDate, postTime ] = this.state.author.created_at.split("T");
        let [year, month, day] = postDate.split("-")

        let date = new Date(year, month-1 , day).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"long", day:"numeric"});
        
        // let postMonthName = date.toLocaleString()
        // console.log("date time:", postMonthName)
        // add css
        const css = document.createElement("style");
        css.textContent = /*css*/`
            .navlink-img::part(wrapper):hover {
                background-color: inherit; /* Ensure background stays the same */
            }
            
            .navlink-img::part(img) {
                height: 40px;
                width: 40px;
                border-radius: 50%;
                object-fit: cover;
            }
            
            a {
                text-decoration: none;
                color: inherit;
            }

            a:hover {
                text-decoration: underline;
            }

            .shadow {
                box-shadow: 0 0 5px -2px rgba(0, 0, 0, 0.3);
            }

            .shadow-lg {
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
            }

            .wrapper {
                height: 100%;
                width: 100%;
                display: flex;
                justify-content: center;
            }

            .post {
                max-width: 680px;
                /*margin: 20px;*/
                background-color: rgb(var(--clr-secondary-background));
                color: rgb(var(--clr-main-foreground));
                border-radius: 10px;
                font-size: 1.6rem;
            }

            .post__header {
                height: 48.23;
                margin: 0 0 12px;
                /* top | left-right | bottom  */
                padding: 12px 16px 0;
                display: flex;
                position: relative;
            }

            .post__profile__img{
                width: 50px;
                margin-right: .5rem;
                overflow: hidden;
                position:relative;
            }

            .post__profile__img:hover>.post__popup{
                visibility: visible;
                top: 92%;
                left: -252%;
                }

            .post__link__img {
                margin-right: 10px;
                object-fit: cover;
                border-radius: 50%;
            }

            .post__popup {
                visibility: hidden;
                position: absolute;
                background-color: rgb(var(--clr-secondary-background));
                display: flex;
                gap: 20px;
                padding: 20px;
                border-radius: 10px;
                z-index: 5;
            }

            .post__popup__img {
                border-radius: 50%;
            }

            .post__popup__link {
                font-size: 1.5rem;
                font-weight: 700;
            }

            .post__popup__wrapper {
                margin-top: 15px;
            }

            .post__popup__info {
                margin-top: 10px;
                display: flex;
                align-items: center;
                justify-content: start;
            }

            .post__popup__svg {
                fill: var(--clr-icon);
                margin-right: 10px;
            }

            .post__popup__number {
                font-size: large;
                font-weight: 700;
                margin-right: 2px;
            }

            .post__popup__label {
                font-weight: 300;
            }

            .post__info {
                width: 562px;
                height: 46.23;
                margin: -5px 0px;
                line-height: 1.2;
            }

            .post__info__wrapper {
                display: flex;
                align-items: center;
            }

            .post__username{
                position:relative;
            }

            .post__username:hover>.post__popup{
                visibility: visible;
                top: 100%;
                left: -200%;
            }

            .post__info__username {
                margin: 8px 0 0;
            }

            .post__info__username__link {
                font-weight: 600;
                text-decoration: none;
                color: inherit;
            }

            .post__info__time {
                height: 18.25px;
                position: relative;
            }

            .post__info__time__link {
                text-decoration: none;
                color: rgb(var(--clr-secondary-foreground));
                font-size: 1.5rem;
            }

            .post__info__time__link::before {
                content: "${date} at 7:12 PM";
                visibility: hidden;
                position: absolute;
                white-space: nowrap;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
                padding: 20px;
                border-radius: 10px;
                z-index: 9999;
                color: rgb(var(--clr-popup-time-foreground));
                top: 116%;
                left: -15%;
                transition: background-color .2s
            }

            .post__info__time__link:hover::before {
                background-color: rgba(var(--clr-popup-time-background), 0.9);
                visibility: visible;
            }

            .post__menu {
                visibility: hidden;
                position: absolute;
                top: 70%;
                right: 4.7%;
            }

            .post__menu__caret {
                fill: rgb(var(--clr-secondary-background));
                background-color: transparent;
                -webkit-filter: drop-shadow(0px 15px 10px rgba(0, 0, 0, .4));
                filter: drop-shadow(0px 15px -6px rgba(0, 0, 0, .4));
                position: relative;
                right: -8.94rem;
                z-index: 2;
            }

            .post__menu__body {
                width: 150px;
                font-weight: 600;
                padding: 5px 7px;
                display: flex;
                flex-direction: column;
                gap: 6px;
                position: relative;
                right: 0%;
                margin-top: -4%;
                background-color: rgb(var(--clr-secondary-background));
                border-radius: 10px 0 10px 10px;
                /* box-shadow: 0 0 10px  rgba(0,0,0,0.4); */
            }

            .post__menu__svg {
                fill: rgb(var(--clr-options));
            }

            .post__menu__body hr {
                border: none;
                height: .5px;
                background-color: rgba(var(--clr-secondary-foreground), .3);
                width: 90%;
                margin: 0 auto;
            }

            .post__menu__item {
                white-space: nowrap;
                cursor: pointer;
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: start;
                gap: 8px;
                padding: 10px;
            }

            .post__menu__item:hover {
                background-color: rgb(var(--clr-hover));
            }

            .post__button {
                border: none;
                outline: none;
                height: 36px;
                width: 36px;
                border-radius: 50%;
                background-color: inherit;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .post__button__svg {
                fill: rgb(var(--clr-main-foreground));
            }

            .post__button:hover {
                background-color: rgb(var(--clr-hover));
            }

            #chbx {
                visibility: hidden;
            }

            #chbx:checked~.post__menu {
                visibility: visible;
            }

            .post__body {
                padding: 4px 16px 16px;
            }

            .post__img__wrapper {
                background-color: rgb(var(--clr-image-background));
                max-height: 750px;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
                cursor: pointer;
            }

            .post__comments__wrapper {
                height: 43px;
                margin: 0px 16px;
                padding: 10px 0px;
                display: flex;
                align-items: center;
                justify-content: end;
            }
        `

        this.shadowRoot.appendChild(css)

        
        const chbx = this.shadowRoot.querySelector("#chbx")
        const menuBtn = this.shadowRoot.querySelector(".post__button")
        const menu = this.shadowRoot.querySelector(".post__menu")
    
        document.addEventListener("click", e => {
            e.preventDefault();
            e.stopPropagation();

            //check if user click outside menu to close it
            if (menu.contains(e.composedPath()[0]) || menuBtn.contains(e.composedPath()[0])) {
                chbx.checked = !chbx.checked
            } else {
                chbx.checked = false
            }    
        })
    }

    

    rerender(){
        this.shadowRoot.innerHTML = "";
        this.render();
    }
}

window.customElements.define("post-c", PostComponent);