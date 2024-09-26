export default class NavBarComponent extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
        this.currentUser = null;
    }

    connectedCallback() {
        this.currentUser = this.getCurrentUser();

        this.render();

        // Load element selectors
        const elements = this.elements();

        this.attachEventListeners(elements);

        // Sync current user data across components
        if (this.currentUser) {
            this.syncUserDetails(elements);
        }
    }

    render() {
        this.shadow.innerHTML = /*html*/`
        <link rel="stylesheet" href="/static/css/navbar.css"/>
        <nav class="nav">
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

    UserSection(user) {
        const id = user.id || "#";
        const img = user.profile_image || "/static/assets/images/default-user1.png";

        return /*html*/`
            <div id="user" class="col nav-section navbar-user">
                <navlink-c id="profile-link" class="profile-link" data-to='${id}' data-img=${img}></navlink-c>
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

    getCurrentUser() {
        const user = this.dataset.user;
        if (user) {
            try {
                return JSON.parse(user);
            } catch (error) {
                return null
            }
        } return null;
    }


    showAuthModal(event, elements) {
        event.preventDefault();
        const auth = document.createElement("auth-c");
        elements.modal.appendChild(auth);

        const target = event.target;
        if (target.id === "login-btn") {
            auth.setActiveForm(auth.formId.login); // Activate login form
        } else if (target.id === "signup-btn") {
            auth.setActiveForm(auth.formId.signup); // Activate signup form
        }

        // Auth login-success event
        auth.addEventListener("auth-finished", e => this.handleAuthSuccess(e, elements));
        elements.modal.show();

    }


    handleAuthSuccess(e) {
        const { user } = e.detail.data;
        const elements = this.elements();

        const authEvent = new CustomEvent("auth-finished", {detail: user});
        this.dispatchEvent(authEvent)

        elements.modal.hide();
    }


    setCurrentUser(currentUser, elements) {
        this.currentUser = currentUser;
        elements.userManagement.innerHTML = this.renderUserManagement();
        this.attachEventListeners = this.attachEventListeners.bind(this);
        const auth = elements.modal.querySelector("auth-c");
        elements.modal.removeChild(auth);
        elements.modal.hide();

    }


    syncUserDetails(elements) {
        const userProfileImg = this.currentUser.user.profile_image;
        elements.profileLink.setImg(userProfileImg || '/static/assets/images/default-user1.png');
        elements.profileLink.to = `/users/${this.currentUser.user.id}`;
    }


    handleLogout(event) {
        event.preventDefault();
        window.localStorage.removeItem("currentUser");
        const logoutEvent = new CustomEvent("logout");
        this.dispatchEvent(logoutEvent);
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
