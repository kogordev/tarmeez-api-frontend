import { loader } from "/static/js/utils/loader.js";
import { navigateTo } from "/static/js/utils/router.js";
import state from '/static/js/utils/state.js'; // Import your state manager

export default class MainLayout extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.root = null;
    }

    connectedCallback() {
        this.initializeComponent();
    }

    initializeComponent(){
        this.render();
        this.subscribeToState(); // Subscribe to state changes
    }

    subscribeToState() {
        state.subscribe(currentUser => {
            if (currentUser) {
                navigateTo("/users/" + currentUser.user.id);
            } else {
                navigateTo("/")
            }
        });
    }

    render() {
        this.shadowRoot.innerHTML = /*html*/`
            <link rel="stylesheet" href="/static/css/common.css"/>
            <link rel="stylesheet" href="/static/css/mainlayout.css"/>
            <div id="root" class="wrapper padding-view">
                <navbar-c></navbar-c>
            </div>
        `;
    }

    renderView(view) {
        loader(() => this.viewCallback(view), this.timeoutCallback.bind(this));
    }

    viewCallback(view) {
        const root = this.shadowRoot.querySelector("#root");
        root.classList.add("hidden"); // Hide content during rendering
        root.classList.remove("wrapper");

        // Use a DocumentFragment to batch DOM updates
        const fragment = document.createDocumentFragment();

        const navbar = this.shadowRoot.querySelector("navbar-c");
        if (navbar) fragment.appendChild(navbar.cloneNode(true)); // Keep existing navbar

        // Render the new view in the fragment
        const viewNode = view;
        fragment.appendChild(viewNode);

        // Replace root content with the fragment
        root.innerHTML = '';
        root.appendChild(fragment);
    }

    timeoutCallback() {
        const root = this.shadowRoot.querySelector("#root");
        root.classList.remove("hidden");
        root.classList.add("wrapper");
    }
}


window.customElements.define("main-layout", MainLayout);
