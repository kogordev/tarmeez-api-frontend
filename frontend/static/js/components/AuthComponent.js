import Controller from "/static/js/controllers/controller.js";

export default class AuthComponent extends HTMLElement {
    constructor() {
        super();
        this.formId = Object.freeze({
            login: "login-form",
            signup: "signup-form"
        });
        this.modal = null;
        this.controller = new Controller(); // Use the new Controller class
        this.displayInfo = "";
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = /*html*/`
        <link rel="stylesheet" href="/static/css/auth.css"/>
        <div class="wrapper">
            <form id="${this.formId.signup}" class="form active">
                <div class="header flex flex-center">
                    <h2>Join <span>TARMEEZ</span></h2>
                </div>
                <div class="body flex flex-col flex-center">
                    <input class="input" name="name" type="text" placeholder="Enter name" required/>
                    <input class="input" name="username" type="text" placeholder="Enter username" required/>
                    <input class="input" name="email" type="email" placeholder="Enter email" required/>
                    <input class="input" name="password" type="password" placeholder="Enter password" required/>
                    <input class="custom-file-upload" name="image" type="file" accept="image/png, image/gif, image/jpeg" />
                    <p id="signup-display-info" class="display-info">${this.displayInfo}</p>
                    <button class="button flex flex-center" type="submit" id="signup-button">Signup</button>
                </div>
                <div class="footer flex flex-center">
                    <p>
                        Already have an account?
                        <a class="link" id="login-link" href="#">Login here</a>
                    </p>
                </div>
            </form>
            <form id="${this.formId.login}" class="form login">
                <div class="header flex flex-center">
                    <h2>Login</h2>
                </div>
                <div class="body flex flex-col flex-center">
                    <input class="input" name="username" type="text" placeholder="Enter username" required/>
                    <input class="input" name="password" type="password" placeholder="Enter password" required/>
                    <p id="login-display-info" class="display-info">${this.displayInfo}</p>
                    <button class="button flex flex-center" type="submit" id="login-button">Login</button>
                </div>
                <div class="footer flex flex-center">
                    <p>
                        Don't have an account?
                        <a class="link" id="signup-link" href="#">Create account</a>
                    </p>
                </div>
            </form>
        </div>
        `;

        const elements = this.elements();

        elements.links.forEach(link => {
            link.addEventListener("click", e => {
                e.preventDefault();
                const target = e.composedPath()[0]

                if (target.contains(elements.loginLink)) {
                    this.setActiveForm(this.formId.login);
                } else if (target.contains(elements.signupLink)) {
                    this.setActiveForm(this.formId.signup);
                }
            });
        });

        elements.signupBtn.addEventListener("click", e => {
            e.preventDefault();
            const frmData = new FormData(elements.frmSignup);
            this.post("/register", frmData, elements);
        });

        elements.loginBtn.addEventListener("click", e => {
            e.preventDefault();
            const frmData = new FormData(elements.frmLogin);
            this.post("/login", frmData, elements)
        });
    }

    async post(pathname, frmData, elements){
        let response = null;
        try {
            response = await this.controller.post(pathname, frmData);
            const { user, token } = response.data;

            const currentUser = { user, token };
            window.localStorage.setItem("currentUser", JSON.stringify(currentUser));

        } catch (error) {
            elements.signupDisplayInfo.style.display = "block";
            elements.signupDisplayInfo.textContent = error.msg;
        }

        const event = new CustomEvent("auth-finished", {detail: response});
        this.dispatchEvent(event);
    }


    elements() {
        return {
            signupLink: this.shadowRoot.querySelector("#signup-link"),
            loginLink: this.shadowRoot.querySelector("#login-link"),

            links: Array.from(this.shadowRoot.querySelectorAll(".link")),
            loginBtn: this.shadowRoot.querySelector("#login-button"),
            signupBtn: this.shadowRoot.querySelector("#signup-button"),
            frmLogin: this.shadowRoot.querySelector(`#${this.formId.login}`),
            frmSignup: this.shadowRoot.querySelector(`#${this.formId.signup}`),
            loginDisplayInfo: this.shadowRoot.querySelector("#login-display-info"),
            signupDisplayInfo: this.shadowRoot.querySelector("#signup-display-info")
        };
    }

    setActiveForm(formId) {
        this.clearInputs();
        const forms = Array.from(this.shadowRoot.querySelectorAll(".form"));
        forms.forEach(form => form.classList.remove("active"));
        this.shadowRoot.querySelector(`#${formId}`).classList.add("active");
    }

    clearInputs() {
        Array.from(this.shadowRoot.querySelectorAll("input")).forEach(input => {
            input.value = "";
        });
        Array.from(this.shadowRoot.querySelectorAll(".display-info")).forEach(infoDisplay => {
            infoDisplay.textContent = "";
            infoDisplay.style.display = "none";
        });
    }
}

window.customElements.define("auth-c", AuthComponent);
