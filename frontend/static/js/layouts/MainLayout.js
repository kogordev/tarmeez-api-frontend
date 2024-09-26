import { navigateTo } from "/static/js/utils/router.js";

export default class MainLayout extends HTMLElement {
    constructor() {
        super();
        this.root = null;
    }

    connectedCallback() {
        this.attachShadow({ mode: "open" });
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = "";
        this.shadowRoot.innerHTML = /*html*/`
            <link rel="stylesheet" href="/static/css/common.css"/>
            <link rel="stylesheet" href="/static/css/mainlayout.css"/>
            <div id="root" class="wrapper padding-view ">
                ${this.renderNavbar()}

            </div>
        `;
        this.root = this.shadowRoot.querySelector("#root");

        this.setupEventListeners();
    }

    getCurrentUser() {
        // Load and set up current user if exists
        const storedUser = window.localStorage.getItem("currentUser");
        if (storedUser) {
            const currentUser = storedUser;
            return currentUser
        } else return null
    }

    renderNavbar() {
        const user = this.getCurrentUser();
        return /*html*/`
        <navbar-c data-user=${user}></navbar-c>
        `
    }

    // Setup general event listeners
    setupEventListeners() {

        const navbar = this.shadowRoot.querySelector("navbar-c");
        navbar.addEventListener("logout", e => this.handleLogout(e));
        navbar.addEventListener("auth-finished", e => this.handleAuth(e));
    }

    // Method to render the passed view component within the root
    renderView(view) {
        // Clear all children except navbar
        const navbar = this.shadowRoot.querySelector("navbar-c");
        Array.from(this.root.children).forEach(child => {
            if (child !== navbar) {
                this.root.removeChild(child);
            }
        });

        // Append postCreator if user is logged in and in home page
        const isHome = window.location.pathname === "/";
        let data = this.parseJson(this.getCurrentUser());

        if (isHome && data) {
            view.isLoggedIn = true;
            view.data = data;
        }

        this.root.appendChild(view);
    }

    handleAuth(e) {
        this.shadowRoot.innerHTML = "";
        this.render();
        if (e.detail.hasOwnProperty("id")) {
            navigateTo("/users/" + e.detail.id);
        }
    }

    handleLogout() {
        this.shadowRoot.innerHTML = "";
        this.render();

        navigateTo("/");
    }


    parseJson(str) {
        try {
            return JSON.parse(str);
        } catch (error) {
            return null
        }
    }

}

window.customElements.define("main-layout", MainLayout);
