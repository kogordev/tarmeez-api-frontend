export default class DashboardComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.user = null; // Initialize user data
    }

    connectedCallback() {
        this.setUser();
        this.render();
    }

    setUser() {
        // Parse and store user data from the dataset
        const userData = this.dataset.user || null;
        if (userData) {
            try {
                this.user = JSON.parse(userData);
            } catch (error) {
                console.error("Failed to parse user data:", error);
            }
        }
    }

    render() {
        if (!this.user) return;

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
        const { profile_image, username, email, posts_count, comments_count } = this.user;

        const template = /*html*/ `
            <div class="card padding grid col-3">
                <div class="col padding flex flex-col gap">
                    <div class="flex flex-col flex-center">
                        <img src="${profile_image}" alt="Profile image of ${username}" />
                        <h2>${this.escapeHTML(username)}</h2>
                        <h2>${this.escapeHTML(email)}</h2>
                    </div>
                </div>
                <div class="col padding flex flex-col flex-center">
                    <span class="number">${posts_count}</span>
                    <sub class="label">Post</sub>
                </div>
                <div class="col padding flex flex-col flex-center">
                    <span class="number">${comments_count}</span>
                    <span class="label">Comment</span>
                </div>
            </div>
        `;

        this.shadowRoot.innerHTML += template;
    }

    escapeHTML(str) {
        // Basic function to escape HTML content
        const div = document.createElement('div');
        div.textContent = str;
        return div.textContent;
    }
}

window.customElements.define("dashboard-c", DashboardComponent);
