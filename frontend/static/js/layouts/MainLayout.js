import { navigateTo } from "/static/js/utils/router.js";
import state from '/static/js/utils/state.js'; // Import your state manager

export default class MainLayout extends HTMLElement {
    constructor() {
        super();
        this.root = null;
    }

    connectedCallback() {
        this.attachShadow({ mode: "open" });
        const currentUserStr = state.getCurrentUserAsStrring();
        this.render(currentUserStr);
        this.subscribeToState(); // Subscribe to state changes
    }

    subscribeToState() {
        state.subscribe(currentUser => {
            if (currentUser) {
                navigateTo("/users/" + currentUser.user.id);
            } else {
                navigateTo("/")
            }
            console.log("feedback recieved");
        });
    }

    render(currentUserStr = null) {
        this.shadowRoot.innerHTML = /*html*/`
            <link rel="stylesheet" href="/static/css/common.css"/>
            <link rel="stylesheet" href="/static/css/mainlayout.css"/>
            <div id="root" class="wrapper padding-view">
                <navbar-c></navbar-c>
            </div>
        `;
        this.root = this.shadowRoot.querySelector("#root");
    }


    renderView(view) {
        const screenLoader = document.getElementById('appLoader');
        if (screenLoader) screenLoader.show(); // Show loader before rendering

        this.root.classList.add("hidden"); // Hide content during rendering
        this.root.classList.remove("wrapper");

        // Use a DocumentFragment to batch DOM updates
        const fragment = document.createDocumentFragment();

        const navbar = this.shadowRoot.querySelector("navbar-c");
        if (navbar) fragment.appendChild(navbar.cloneNode(true)); // Keep existing navbar

        // Render the new view in the fragment
        const viewNode = view;
        fragment.appendChild(viewNode);

        // Replace root content with the fragment
        this.root.innerHTML = '';
        this.root.appendChild(fragment);

        // Show content and hide loader after rendering
        setTimeout(() => {
            this.root.classList.remove("hidden");
            this.root.classList.add("wrapper");
            if (screenLoader) screenLoader.hide();
        },300); // Optional delay to ensure smooth transitions
    }


}

window.customElements.define("main-layout", MainLayout);
