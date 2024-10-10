import state from "/static/js/utils/state.js";

export default class NavBarComponent extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
        this.currentUser = null; // initial value
    }

    connectedCallback() {
        this.style.display = "none";
        this.currentUser = state.getCurrentUser(); // Set currentUser value
        this.render();
        this.style.display = "block";
        this.subscribeToState();
    }

    subscribeToState() {
        state.subscribe(currentUser => {
            if (currentUser) {
                this.currentUser = currentUser;
            } else {
                this.currentUser = null;
            }
            this.rerender();
            console.log("feedback recieved from navbar");
        });
    }

    render() {
        this.shadow.innerHTML = /*html*/`
        <link rel="stylesheet" href="/static/css/navbar.css"/>
        <nav class="nav shadow">
            <div class="col">
                <navlink-c data-to="/" data-img="/static/assets/images/logo.png" data-text="TARMEEZ"></navlink-c>
            </div>
            <div class="col">
                <themetogglebtn-c data-ficn='/static/assets/images/dark-mode-button.svg' data-sicn='/static/assets/images/light-mode-button.svg'></themetogglebtn-c>
            </div>
            <div class="col user-management">
                ${this.renderUserManagement()}
            </div>
        </nav>
        `;

        // Load element selectors
        const elements = this.elements();
        this.attachEventListeners(elements);
    }

    attachEventListeners() {
        const elements = this.elements();

        // Add event listeners for login and signup buttons
        elements.authButtons.forEach(button => {
            if (button) {
                button.addEventListener("click", (e) => {
                    this.showAuthModal(e, elements);
                });
            }
        });

        // Add logout button event listener
        if (elements.logoutBtn) {
            elements.logoutBtn.addEventListener("click", (e) => {
                this.handleLogout(e, elements);
            });
        }
    }

    AuthSection() {
        return /*html*/`
            <div id="auth" class="col nav-section navbar-auth">
                <button id="login-btn" class="auth-button button accent-button navbar-button">Sign in</button>
                <button id="signup-btn" class="auth-button button tarmeez-button navbar-button">Signup</button>
            </div>`
    }

    UserSection(currentUser) {
        const user = currentUser.user;
        const id = user.id || "#";
        const img = user.profile_image || "/static/assets/images/default-user1.png";
        const url = `/users/${id}`;

        return /*html*/`
            <div id="user" class="col nav-section navbar-user">
                <navlink-c id="profile-link" class="profile-link" data-to='${url}' data-img=${img}></navlink-c>
                <button id="logout-btn" class="button logout-button navbar-button">Log out</button>
            </div>
            `
    }

    renderUserManagement() {
        if (this.currentUser) {
            return this.UserSection(this.currentUser)
        } else {
            return this.AuthSection();
        }
    }

    showAuthModal(e) {
        const modal = document.createElement("modal-c");
        const auth = document.createElement("auth-c");

        modal.appendChild(auth);
        this.shadowRoot.appendChild(modal);

        const target = e.target;
        if (target.id === "login-btn") {
            auth.setActiveForm(auth.formId.login); // Activate login form
        } else if (target.id === "signup-btn") {
            auth.setActiveForm(auth.formId.signup); // Activate signup form
        }

        modal.show();
    }


    handleLogout() {
        state.updateCurrentUser(null);
    }

    elements() {
        const _auth = document.createElement("auth-c"); // Create the Auth component
        const _authButtons = Array.from(this.shadowRoot.querySelectorAll(".auth-button"));

        return {
            loginBtn: this.shadowRoot.querySelector("#login-btn"),
            signupBtn: this.shadowRoot.querySelector("#signup-btn"),
            logoutBtn: this.shadowRoot.querySelector("#logout-btn"),
            modal: document.querySelector("modal-c"), // Assuming `modal-c` exists in DOM
            auth: _auth, // Auth component
            authButtons: _authButtons,
            profileLink: this.shadowRoot.querySelector("#profile-link"),
            authSection: this.shadowRoot.querySelector("#auth"),
            userSection: this.shadowRoot.querySelector("#user"),
            userManagement: this.shadow.querySelector(".user-management")
        };
    }

    rerender() {
        this.shadow.innerHTML = ``;
        this.render();
    }
}

window.customElements.define("navbar-c", NavBarComponent);
