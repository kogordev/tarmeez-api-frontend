import Controller from '/static/js/controllers/controller.js';

export default class DashboardComponent extends HTMLElement {
    constructor() {
        super();
        this.controller = new Controller();
        this.user = null; // Initialize user data
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        this.load();
    }

    async setUser(id) {
        // Parse and store user data from the dataset
        try {
            const url = `/users/${id}`
            const json = await this.controller.request(url);
            this.user = json.data;
        } catch (error) {
            this.user = null;
            console.error("Error fetching user data:", error.message);
        }
    }

    render() {
        if (!this.user){
            console.log("user not found");
            return;
        };
        // Clear the shadow DOM before rendering
        this.clearShadowDOM();

        // Attach the styles and HTML structure
        this.attachStyles();
        this.attachHTML();
    }

    clearShadowDOM() {
        this.shadowRoot.innerHTML = '';
    }

    async load(){
        try {
            const id = this.dataset.id;
            await this.setUser(id);
            this.render();
        } catch (error) {
            console.log("make sure data-id is provided!");
            return;
        }
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
