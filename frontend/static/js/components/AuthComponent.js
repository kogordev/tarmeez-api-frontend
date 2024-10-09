import Controller from "/static/js/controllers/controller.js";
import state from "/static/js/utils/state.js";


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
        this.screenLoader = document.createElement("screen-loader");
    }

    async connectedCallback() {
        this.style.visibility = "hidden";
        setTimeout(() => {
            this.render();
            this.style.visibility = "visible";
        }, 30);
    }

    render() {
        this.shadowRoot.innerHTML = /*html*/`
        <link rel="stylesheet" href="/static/css/auth.css"/>
        <div class="wrapper">
            <form id="${this.formId.signup}" class="form container active">
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
            <form id="${this.formId.login}" class="form login container">
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

        elements.inputs.forEach(input => {
            input.addEventListener("input", this.clearDisplayInfo.bind(this));
        })


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

    getActiveForm() {
        return Array.from(this.shadowRoot.querySelectorAll(".form")).find(form => form.classList.contains("active"));
    }

    clearDisplayInfo() {
        const activeForm = this.getActiveForm()
        const dipslayInfo = activeForm.querySelector(".display-info");
        dipslayInfo.style.textContent = "";
        dipslayInfo.style.display = "none";
    }

    async post(pathname, frmData, elements) {
        // console.log(this.getActiveForm())
        const activeForm = this.getActiveForm();
        activeForm.appendChild(this.screenLoader);
        this.screenLoader.show()
        let response = null;
        try {
            response = await this.controller.post(pathname, frmData);
            state.updateCurrentUser(response.data);
            this.parentElement.remove();
        } catch (error) {
            const displayInfo = activeForm.querySelector(".display-info");
            displayInfo.style.display = "block";
            displayInfo.textContent = error.msg;
        } finally {
            // Minimum loader display time
            const minimumDisplayTime = 300; // Set a minimum time in milliseconds (e.g., 300ms)

            const start = Date.now();
            // Calculate the remaining time to maintain minimum display time
            const remainingTime = minimumDisplayTime - (Date.now() - start);
            setTimeout(() => {
                if (this.screenLoader) this.screenLoader.hide(); // Hide loader after minimum time
            }, Math.max(0, remainingTime)); // Ensure the remaining time is not negativ

        }

    }

    elements() {
        return {
            inputs: Array.from(this.shadowRoot.querySelectorAll(".input")),
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
