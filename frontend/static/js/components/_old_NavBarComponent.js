import { navigateTo } from "/static/js/utils/router.js";

export default class NavBarComponent extends HTMLElement {

    constructor() {
        super();
        this.currentUser = null;
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });

        shadow.innerHTML = /*html*/`
        <link rel="stylesheet" href="/static/css/navbar.css"/>
        <nav class="nav">
            <div class="col">
                <navlink-c data-to="/" data-img="/static/assets/images/logo.png" data-text="TARMEEZ"></navlink-c>
            </div>
            <div class="col">
                <themetogglebtn-c data-ficn='/static/assets/images/dark-mode-button.svg' data-sicn='/static/assets/images/light-mode-button.svg'></themetogglebtn-c>
            </div>
            <div class="col user-management">
                <div id="auth" class="col nav-section navbar-auth">
                    <button id="login-btn" class="auth-button button accent-button  navbar-button">Sign in</button>
                    <button id="signup-btn" class="auth-button button tarmeez-button  navbar-button">Signup</button>
                </div>
                <div id="user" class="col nav-section navbar-user hidden">
                    <navlink-c id="profile-link" class="profile-link" data-to='' data-img='/static/assets/images/default-user1.png'></navlink-c>
                    <button id="logout-btn" class="button logout-button  navbar-button">Log out</button>
                </div>
            </div>
        </nav>
        `;

        //set up current user if exists
        let currentUser = window.localStorage.getItem("currentUser");
        if (currentUser) {
            currentUser = JSON.parse(currentUser);
            this.setCurrentUser(currentUser);
        }


        //load elements selectors
        const elements = this.elements();

        //
        elements.auth.modal = elements.modal;
        elements.modal.appendChild(elements.auth);


        //add event listeners
        elements.authButtons.forEach(button => {
            //
            button.addEventListener("click", e => {
                e.preventDefault();
                elements.modal.show();
                const target = e.composedPath()[0];
                if (target.contains(elements.loginBtn)) {
                    elements.auth.setActiveForm(elements.auth.formId.login);
                }
                else if (target.contains(elements.signupBtn)) {
                    elements.auth.setActiveForm(elements.auth.formId.signup);
                }
            });
            //
        });

        elements.logoutBtn.addEventListener("click", e => {
            e.preventDefault();
            window.localStorage.removeItem("currentUser");
            //rerender profile 
            elements.profileLink.img = '/static/assets/images/default-user1.png';
            elements.profileLink.rerender();

            //todo rerender posts to remove current user from it;
            this.toggleAuthSection(false);

            //if current url is user profile then redirect to home page
            if (!window.location.pathname !== "/" ){
                navigateTo("/"); // redirect to Home page
            }
        })
        //
    }


    elements() {
        const _auth = document.createElement("auth-c");
        const _authButtons = Array.from(this.shadowRoot.querySelectorAll(".auth-button"));

        return {
            loginBtn: this.shadowRoot.querySelector("#login-btn"),
            signupBtn: this.shadowRoot.querySelector("#signup-btn"),
            logoutBtn: this.shadowRoot.querySelector("#logout-btn"),
            modal: document.querySelector(`modal-c`),
            auth: _auth,
            authButtons: _authButtons,
            profileLink: this.shadowRoot.querySelector("#profile-link"),
            authSection: this.shadowRoot.querySelector("#auth"),
            userSection: this.shadowRoot.querySelector("#user"),
        }
    }


    toggleAuthSection(hideAuth = true) {
        const elements = this.elements();

        if (hideAuth) {
            elements.authSection.classList.add("hidden");
            elements.userSection.classList.remove("hidden");
        } else {
            elements.authSection.classList.remove("hidden");
            elements.userSection.classList.add("hidden");
        }
    }


    setCurrentUser(currentUser) {
        this.currentUser = currentUser;
        const elements = this.elements();
        this.toggleAuthSection();
        const img = this.currentUser.user["profile_image"];
        elements.profileLink.setImg(img);
        elements.profileLink.to = `/users/${this.currentUser.user["id"]}`;

    }

}



window.customElements.define("navbar-c", NavBarComponent);