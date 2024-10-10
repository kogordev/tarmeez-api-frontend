import Controller from "/static/js/controllers/controller.js";
import state from "/static/js/utils/state.js";

export default class AuthComponent extends HTMLElement {
    constructor() {
        super();
        this.controller = new Controller();
        this.formId = Object.freeze({
            login: "login-form",
            signup: "signup-form"
        });
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        document.body.style.overflowY = "hidden";
        this.addStyle();
        this.render();
        this.setupEventListeners();
    }

    disconnectedCallback() {
        document.body.style.overflowY = "auto";
    }

    addStyle() {
        const style = document.createElement("style");
        style.textContent = this.getCSS().trim();
        this.shadowRoot.appendChild(style);
    }

    getCSS() {
        return /*css*/`
        *{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        :host{
            height: 700px;
            width: 600px;
            background-color: rgb(var(--clr-secondary-background));
            border-radius: var(--br);
            transition: visibility .3s, opacity .3s;
            
            /* user-select: none; */
        }
        .container{
            position: relative;
        }
        .flex{
            display: flex;
        }
        .flex-col{
            flex-direction: column ;
        }
        .flex-center{
            align-items: center;
            justify-content: center;
        }
        .form{
            display: none;
            padding: 4rem;
            position: absolute;
            inset: 0 0 0 0;
        }
        .header{
            padding-block: 5rem;
            font-size: 3rem;
            color: rgb(var(--clr-main-foreground))
        }
        .header > h2 > span{
            font-weight: 500;
            letter-spacing: .5rem;
        }
        .body{
            gap: 1rem;
        }
        .input,.button,.custom-file-upload{
            background-color: rgb(var(--clr-tertiary-background));
            color: rgb(var(--clr-tertiary-foreground));
            border: none;
            height: 4rem;
            width: 280px;
            padding: 2rem 1rem;
            border-radius: var(--br);
            outline: none;
            font-size: 1.4rem;
        }
        input[type="file"]{
            color: rgb(var(--clr-main-foreground));
            padding: 1rem;
        }
        input[type="file"]::-webkit-file-upload-button{
            background-color: rgb(var(--clr-tertiary-background));
            color: rgb(var(--clr-tertiary-foreground));
            padding: .5rem;
            height: auto;
            text-align: center;
            border-radius: var(--br);
            cursor: pointer;
        }
        .button{
            width: 30%;
            background-color: rgb(var(--clr-submit-background));
            color: rgb(var(--clr-submit-foreground));
            border: none;
            text-align: center;
            cursor: pointer;
            margin-top: .5rem;
            font-size: 1.6rem;
            font-weight: 600;
            transition: background-color .3s;
        }
        .button:hover{
            background-color: rgb(var(--clr-submit-hover-background));
            transform: scale(1.01);
        }
        .custom-file-upload{
            display: inline-block;
            padding-block: 12px;
            height: 6rem;
            background-color: rgb(var(--clr-tertiary-background));
        }
        .footer{
            font-size: 1.6rem;
            padding-block: 3rem;
            color: rgb(var(--clr-main-foreground));
        }
        .hidden{
            display: none;
        }
        .active{
            display: block;
        }
        .login{
            padding-inline: 10rem;
        }
        .login .body{
            background-color: rgb(var(--clr-tertiary-background));
            padding-block: 7rem 5rem;
            border-radius: var(--br)
        }
        .login input{
            width: 280px;
            background-color: rgb(var(--clr-secondary-background)) 
        }
        input:focus{
            border: 1px solid rgb(var(--clr-active-background));
            background-color: rgb(var(--clr-secondary-background))
        }
        a{
            color: var(--clr-main-foreground);
        }
        .display-info{
            display: none;
            padding-block: 1rem;
            font-size: 1.6rem;
            color: red;
        }
        `
    }

    render() {
        const template = document.createElement("template");
        template.innerHTML =  /*html*/`
        <div class="wrapper">
            ${this.renderSignupForm()}
            ${this.renderLoginForm()}
        </div>`;
        this.shadowRoot.appendChild(template.content.cloneNode(true))
    }

    renderSignupForm() {
        return `
            <form id="${this.formId.signup}" class="form container">
                <div class="header flex flex-center">
                    <h2>Join <span>TARMEEZ</span></h2>
                </div>
                <div class="body flex flex-col flex-center">
                    ${this.renderInput("name", "Enter name")}
                    ${this.renderInput("username", "Enter username")}
                    ${this.renderInput("email", "Enter email", "email")}
                    ${this.renderInput("password", "Enter password", "password")}
                    <input class="custom-file-upload" name="image" type="file" accept="image/png, image/gif, image/jpeg" />
                    <p id="signup-display-info" class="display-info"></p>
                    <button class="button flex flex-center" type="submit" id="signup-button">Signup</button>
                </div>
                <div class="footer flex flex-center">
                    <p>Already have an account? <a class="link" id="login-link" href="#">Login here</a></p>
                </div>
            </form>
        `;
    }

    renderLoginForm() {
        return `
            <form id="${this.formId.login}" class="form login container">
                <div class="header flex flex-center">
                    <h2>Login</h2>
                </div>
                <div class="body flex flex-col flex-center">
                    ${this.renderInput("username", "Enter username")}
                    ${this.renderInput("password", "Enter password", "password")}
                    <p id="login-display-info" class="display-info"></p>
                    <button class="button flex flex-center" type="submit" id="login-button">Login</button>
                </div>
                <div class="footer flex flex-center">
                    <p>Don't have an account? <a class="link" id="signup-link" href="#">Create account</a></p>
                </div>
            </form>
        `;
    }

    renderInput(name, placeholder, type = "text") {
        return `<input class="input" name="${name}" type="${type}" placeholder="${placeholder}" required/>`;
    }

    setupEventListeners() {
        const wrapper = this.shadowRoot.querySelector(".wrapper");

        // Centralized event delegation for inputs, links, and form submissions
        wrapper.addEventListener("input", event => this.clearDisplayInfo(event));
        wrapper.addEventListener("click", event => this.handleLinkClick(event));
        wrapper.addEventListener("submit", event => this.handleSubmit(event));
    }

    handleLinkClick(event) {
        if (event.target.matches("#login-link")) {
            event.preventDefault();
            this.setActiveForm(this.formId.login);
        } else if (event.target.matches("#signup-link")) {
            event.preventDefault();
            this.setActiveForm(this.formId.signup);
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        const target = event.target;

        // Determine the form being submitted and gather data
        const formData = new FormData(target);
        if (target.id === this.formId.signup) {
            this.submitForm("/register", formData);
        } else if (target.id === this.formId.login) {
            this.submitForm("/login", formData);
        }
    }

    async submitForm(url, formData) {
        const activeForm = this.getActiveForm();
        const loader = document.createElement("processing-c");
        activeForm.appendChild(loader);

        try {
            const response = await this.controller.post(url, formData);
            state.updateCurrentUser(response.data);
            this.remove(); // Remove component after successful submission
        } catch (error) {
            setTimeout(() => {
                this.showErrorMessage(activeForm, error.msg);
                loader.remove()
            }, 500);
        }
    }

    getActiveForm() {
        return this.shadowRoot.querySelector(".form.active");
    }

    setActiveForm(formId) {
        this.shadowRoot.querySelectorAll(".form").forEach(form => {
            form.style.display = form.id === formId ? 'block' : 'none'; // Toggle display property
        });
        this.clearInputs();
    }

    clearDisplayInfo(event) {
        const form = event.target.closest(".form");
        if (form) {
            const displayInfo = form.querySelector(".display-info");
            if (displayInfo) {
                displayInfo.style.display = "none";
                displayInfo.textContent = "";
            }
        }
    }

    showErrorMessage(form, message) {
        const displayInfo = form.querySelector(".display-info");
        if (displayInfo) {
            displayInfo.style.display = "block";
            displayInfo.textContent = message;
        }
    }

    displayLoader(form, show) {
        const loader = document.createElement("processing-c");

        if (show) {
            form.appendChild(loader)
            //   form.appendChild(this.screenLoader);
            this.screenLoader.show();
        } else {
            this.screenLoader.hide();
        }
    }

    clearInputs() {
        // Clear input fields and hide display info
        this.shadowRoot.querySelectorAll("input").forEach(input => (input.value = ""));
        this.shadowRoot.querySelectorAll(".display-info").forEach(info => {
            info.textContent = "";
            info.style.display = "none";
        });
    }
}

window.customElements.define("auth-c", AuthComponent);




// import Controller from "/static/js/controllers/controller.js";
// import state from "/static/js/utils/state.js";

// export default class AuthComponent extends HTMLElement {
//     constructor() {
//         super();
//         this.controller = new Controller();
//         this.formId = Object.freeze({
//             login: "login-form",
//             signup: "signup-form"
//         });
//         this.attachShadow({ mode: "open" });
//     }

//     async connectedCallback() {
//         document.body.style.overflowY = "hidden";
//         this.addStyle();
//         this.render();
//         this.setupEventListeners();
//         this.setActiveForm(this.formId.signup); // Set default active form
//     }

//     disconnectedCallback() {
//         document.body.style.overflowY = "auto";
//     }

//     addStyle() {
//         const style = document.createElement("style");
//         style.textContent = this.getCSS().trim();
//         this.shadowRoot.appendChild(style);
//     }

//     getCSS() {
//         return /*css*/`
//         *{
//             margin: 0;
//             padding: 0;
//             box-sizing: border-box;
//         }
//         :host{
//             height: 700px;
//             width: 600px;
//             background-color: rgb(var(--clr-secondary-background));
//             border-radius: var(--br);
//             transition: visibility .3s, opacity .3s;
            
//             /* user-select: none; */
//         }
//         .container{
//             position: relative;
//         }
//         .flex{
//             display: flex;
//         }
//         .flex-col{
//             flex-direction: column ;
//         }
//         .flex-center{
//             align-items: center;
//             justify-content: center;
//         }
//         .form{
//             display: none;
//             padding: 4rem;
//             position: absolute;
//             inset: 0 0 0 0;
//         }
//         .header{
//             padding-block: 5rem;
//             font-size: 3rem;
//             color: rgb(var(--clr-main-foreground))
//         }
//         .header > h2 > span{
//             font-weight: 500;
//             letter-spacing: .5rem;
//         }
//         .body{
//             gap: 1rem;
//         }
//         .input,.button,.custom-file-upload{
//             background-color: rgb(var(--clr-tertiary-background));
//             color: rgb(var(--clr-tertiary-foreground));
//             border: none;
//             height: 4rem;
//             width: 280px;
//             padding: 2rem 1rem;
//             border-radius: var(--br);
//             outline: none;
//             font-size: 1.4rem;
//         }
//         input[type="file"]{
//             color: rgb(var(--clr-main-foreground));
//             padding: 1rem;
//         }
//         input[type="file"]::-webkit-file-upload-button{
//             background-color: rgb(var(--clr-tertiary-background));
//             color: rgb(var(--clr-tertiary-foreground));
//             padding: .5rem;
//             height: auto;
//             text-align: center;
//             border-radius: var(--br);
//             cursor: pointer;
//         }
//         .button{
//             width: 30%;
//             background-color: rgb(var(--clr-submit-background));
//             color: rgb(var(--clr-submit-foreground));
//             border: none;
//             text-align: center;
//             cursor: pointer;
//             margin-top: .5rem;
//             font-size: 1.6rem;
//             font-weight: 600;
//             transition: background-color .3s;
//         }
//         .button:hover{
//             background-color: rgb(var(--clr-submit-hover-background));
//             transform: scale(1.01);
//         }
//         .custom-file-upload{
//             display: inline-block;
//             padding-block: 12px;
//             height: 6rem;
//             background-color: rgb(var(--clr-tertiary-background));
//         }
//         .footer{
//             font-size: 1.6rem;
//             padding-block: 3rem;
//             color: rgb(var(--clr-main-foreground));
//         }
//         .hidden{
//             display: none;
//         }
//         .active{
//             display: block;
//         }
//         .login{
//             padding-inline: 10rem;
//         }
//         .login .body{
//             background-color: rgb(var(--clr-tertiary-background));
//             padding-block: 7rem 5rem;
//             border-radius: var(--br)
//         }
//         .login input{
//             width: 280px;
//             background-color: rgb(var(--clr-secondary-background)) 
//         }
//         input:focus{
//             border: 1px solid rgb(var(--clr-active-background));
//             background-color: rgb(var(--clr-secondary-background))
//         }
//         a{
//             color: var(--clr-main-foreground);
//         }
//         .display-info{
//             display: none;
//             padding-block: 1rem;
//             font-size: 1.6rem;
//             color: red;
//         }
//         `
//     }

//     render() {
//         const template = document.createElement("template");
//         template.innerHTML =  /*html*/`
//         <div class="wrapper">
//             ${this.renderSignupForm()}
//             ${this.renderLoginForm()}
//         </div>`;
//         this.shadowRoot.appendChild(template.content.cloneNode(true))
//     }

//     renderSignupForm() {
//         return `
//             <form id="${this.formId.signup}" class="form container">
//                 <div class="header flex flex-center">
//                     <h2>Join <span>TARMEEZ</span></h2>
//                 </div>
//                 <div class="body flex flex-col flex-center">
//                     ${this.renderInput("name", "Enter name")}
//                     ${this.renderInput("username", "Enter username")}
//                     ${this.renderInput("email", "Enter email", "email")}
//                     ${this.renderInput("password", "Enter password", "password")}
//                     <input class="custom-file-upload" name="image" type="file" accept="image/png, image/gif, image/jpeg" />
//                     <p id="signup-display-info" class="display-info"></p>
//                     <button class="button flex flex-center" type="submit" id="signup-button">Signup</button>
//                 </div>
//                 <div class="footer flex flex-center">
//                     <p>Already have an account? <a class="link" id="login-link" href="#">Login here</a></p>
//                 </div>
//             </form>
//         `;
//     }

//     renderLoginForm() {
//         return `
//             <form id="${this.formId.login}" class="form login container">
//                 <div class="header flex flex-center">
//                     <h2>Login</h2>
//                 </div>
//                 <div class="body flex flex-col flex-center">
//                     ${this.renderInput("username", "Enter username")}
//                     ${this.renderInput("password", "Enter password", "password")}
//                     <p id="login-display-info" class="display-info"></p>
//                     <button class="button flex flex-center" type="submit" id="login-button">Login</button>
//                 </div>
//                 <div class="footer flex flex-center">
//                     <p>Don't have an account? <a class="link" id="signup-link" href="#">Create account</a></p>
//                 </div>
//             </form>
//         `;
//     }

//     renderInput(name, placeholder, type = "text") {
//         return `<input class="input" name="${name}" type="${type}" placeholder="${placeholder}" required/>`;
//     }

//     setupEventListeners() {
//         const wrapper = this.shadowRoot.querySelector(".wrapper");

//         // Centralized event delegation for inputs, links, and form submissions
//         wrapper.addEventListener("input", event => this.clearDisplayInfo(event));
//         wrapper.addEventListener("click", event => this.handleLinkClick(event));
//         wrapper.addEventListener("submit", event => this.handleSubmit(event));
//     }

//     handleLinkClick(event) {
//         if (event.target.matches("#login-link")) {
//             event.preventDefault();
//             this.setActiveForm(this.formId.login);
//         } else if (event.target.matches("#signup-link")) {
//             event.preventDefault();
//             this.setActiveForm(this.formId.signup);
//         }
//     }

//     handleSubmit(event) {
//         event.preventDefault();
//         const target = event.target;

//         // Determine the form being submitted and gather data
//         const formData = new FormData(target);
//         if (target.id === this.formId.signup) {
//             this.submitForm("/register", formData);
//         } else if (target.id === this.formId.login) {
//             this.submitForm("/login", formData);
//         }
//     }

//     async submitForm(url, formData) {
//         const activeForm = this.getActiveForm();
//         const loader = document.createElement("processing-c");
//         activeForm.appendChild(loader);

//         try {
//             const response = await this.controller.post(url, formData);
//             state.updateCurrentUser(response.data);
//             this.remove(); // Remove component after successful submission
//         } catch (error) {
//             setTimeout(() => {
//                 this.showErrorMessage(activeForm, error.msg);
//                 loader.remove()
//             }, 500);
//         }
//     }

//     getActiveForm() {
//         return this.shadowRoot.querySelector(".form.active");
//     }

//     setActiveForm(formId) {
//         // Toggle the active class between forms
//         this.shadowRoot.querySelectorAll(".form").forEach(form => {
//             form.classList.toggle("active", form.id === formId);
//         });
//         this.clearInputs();
//     }

//     clearDisplayInfo(event) {
//         const form = event.target.closest(".form");
//         if (form) {
//             const displayInfo = form.querySelector(".display-info");
//             if (displayInfo) {
//                 displayInfo.style.display = "none";
//                 displayInfo.textContent = "";
//             }
//         }
//     }

//     showErrorMessage(form, message) {
//         const displayInfo = form.querySelector(".display-info");
//         if (displayInfo) {
//             displayInfo.style.display = "block";
//             displayInfo.textContent = message;
//         }
//     }

//     displayLoader(form, show) {
//         const loader = document.createElement("processing-c");

//         if (show) {
//             form.appendChild(loader)
//             //   form.appendChild(this.screenLoader);
//             this.screenLoader.show();
//         } else {
//             this.screenLoader.hide();
//         }
//     }

//     clearInputs() {
//         // Clear input fields and hide display info
//         this.shadowRoot.querySelectorAll("input").forEach(input => (input.value = ""));
//         this.shadowRoot.querySelectorAll(".display-info").forEach(info => {
//             info.textContent = "";
//             info.style.display = "none";
//         });
//     }
// }

// window.customElements.define("auth-c", AuthComponent);

