import Controller from '/static/js/controllers/controller.js';

export default class DashboardComponent extends HTMLElement {
    constructor() {
        super();
        this.controller = new Controller();
        this.user = null; // Initialize user data
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        try {
            await this.load();
        } catch (error) {
            console.error("Error initializing component:", error);
        }
    }

    async load() {
        this.renderLoadingState(); // Initial loading state with smooth transition

        const id = this.dataset.id;
        if (!id) {
            console.error("No data-id attribute provided!");
            this.renderError("User ID is missing");
            return;
        }

        await this.setUser(id); // Fetch user data
        if (this.user) {
            this.render(); // Render only if user data is successfully fetched
            this.transitionIn(); // Add smooth transition for visibility
        } else {
            this.renderError("User data could not be loaded");
        }
    }

    // Fetch user data from the API
    async setUser(id) {
        try {
            const url = `/users/${id}`;
            const json = await this.controller.request(url);
            this.user = json.data;
        } catch (error) {
            this.user = null;
            console.error("Error fetching user data:", error.message);
        }
    }

    // Render the loading state with smooth transition
    renderLoadingState() {
        this.clearShadowDOM();
        this.shadowRoot.innerHTML = /*html*/ `
            <link rel="stylesheet" href="/static/css/common.css"/>
            <link rel="stylesheet" href="/static/css/dashboard.css"/>
        `;
        // login is removed
    }

    // Render error message if user data is not available
    renderError(message) {
        this.clearShadowDOM();
        this.shadowRoot.innerHTML = /*html*/ `
            <div class="error-message">
                <h2>Error</h2>
                <p>${this.escapeHTML(message)}</p>
            </div>
        `;
    }

    // Render the main content of the dashboard
    render() {
        if (!this.user) {
            console.error("User data is not available.");
            return;
        }

        // Clear the shadow DOM before rendering
        this.clearShadowDOM();

        // Attach the styles and HTML structure
        this.attachStyles();
        this.attachHTML();
    }

    clearShadowDOM() {
        this.shadowRoot.innerHTML = '';
    }

    attachStyles() {
        const styles = /*html*/ `
            <link rel="stylesheet" href="/static/css/common.css"/>
            <link rel="stylesheet" href="/static/css/dashboard.css"/>
        `;
        this.shadowRoot.innerHTML += styles;
    }

    attachHTML() {
        let { profile_image, username, email, posts_count, comments_count } = this.user;
        if (typeof profile_image === "object"){
            profile_image = "/static/assets/images/default-user1.png"
        }

        // Build the template for the dashboard
        const template = /*html*/ `
            <div class="card padding grid col-3 transition-opacity hidden">
                <div class="col padding flex flex-col gap">
                    <div class="flex flex-col flex-center">
                        <img src="${profile_image}" alt="Profile image of ${username}" class="profile-image"/>
                        <h2 class="username">${this.escapeHTML(username)}</h2>
                        <h2 class="email">${this.escapeHTML(email)}</h2>
                    </div>
                </div>
                <div class="col padding flex flex-col flex-center">
                    <span class="number">${posts_count}</span>
                    <sub class="label">Posts</sub>
                </div>
                <div class="col padding flex flex-col flex-center">
                    <span class="number">${comments_count}</span>
                    <span class="label">Comments</span>
                </div>
            </div>
        `;

        this.shadowRoot.innerHTML += template;
    }

    // Utility method to escape HTML characters
    escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.textContent;
    }

    // Smooth transition to reveal the content
    transitionIn() {
        const cardElement = this.shadowRoot.querySelector('.card');
        if (cardElement) {
            // Add a small delay to trigger CSS transition
            setTimeout(() => {
                cardElement.classList.remove('hidden'); // Remove the hidden class to start transition
            }, 50); // Adjust delay as necessary
        }
    }
}

window.customElements.define("dashboard-c", DashboardComponent);
