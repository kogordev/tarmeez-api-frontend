import Controller from "/static/js/controllers/controller.js";
//import UserController from "/static/js/controllers/UserController.js";

export default class AuthComponent extends HTMLElement {
    constructor() {
        super();
        this.formId = Object.freeze({
            login: "login-form",
            signup: "signup-form"
        });
        this.modal = null;
        //this.controller = new UserController();
        this.controller = new Controller();
    }

    async connectedCallback() {
       this.render();
    }

    render(){
        const shadow = this.attachShadow({ mode: "open" });
        console.log();
        shadow.innerHTML = /*html*/`
        <link rel="stylesheet" href="/static/css/auth.css"/>
        <div class="wrapper">
            <form id="${this.formId.signup}" class="form active">
                <div class="header flex flex-center">
                    <h2>Join <span>TARMEEZ</span></h2>
                </div>
                <div class="body flex flex-col flex-center">
                    <input class="input" name="name" type="text" placeholder="Enter name" value="kogordev" required/>
                    <input class="input" name="username" type="text" placeholder="Enter username" 
                    value="kogordev2025" required/>
                    <input class="input" name="email" type="email" placeholder="Enter email" value="test1@email.com" required/>
                    <input class="input" name="password" type="password" placeholder="Enter password" value="123456" required/>
                    <input class="custom-file-upload" name="image" type="file" accept="image/png, image/gif, image/jpeg" />
                    <p id="signup-display-info" class="display-info">${this.displayInfo}</p>
                    <button class="button flex flex-center" type="submit" id="signup-button">Signup</button>
                </div>
                <div class="footer flex flex-center">
                    <p>
                        Have already an account?
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
                        Don't have an account yet?
                        <a class="link" id="signup-link" href="#">create account</a>
                    </p>
                </div>
            </form>
        </div>
        `

        const elements = this.elements();

        // when click on login here or sign up links open the corelated form
        elements.links.forEach(link => {
            link.addEventListener("click", e => {
                e.preventDefault();
                const target = e.composedPath()[0];

                if (target.contains(elements.loginLink)) {
                    this.setActiveForm(this.formId.login)
                }
                else if (target.contains(elements.signupLink)) {
                    this.setActiveForm(this.formId.signup)
                }

            })
        });


        //clear display info when start typing
        elements.inputs.map(input => {
            //check if already display info paragraph is hidden
            if (
                elements.loginDisplayInfo.style.display  === "none" && elements.signupDisplayInfo.style.display === "none"
            ) return ;

            input.addEventListener("input", ()=>{
                Array.from(this.shadowRoot.querySelectorAll(".display-info")).map(infoDisplay => {
                    infoDisplay.textContent = "";
                    infoDisplay.style.setProperty("display", "none");
                });
            })
        })


        elements.signupBtn.addEventListener("click", async  e => {
            e.preventDefault();
            const frmData = new FormData(elements.frmSignup);

            try {
                //const response = await this.controller.createUser(frmData);
                const response = await this.controller.request(frmData);
                const {user, token} = response.data;

                const currentUser = {
                    user: user,
                    token: token
                }
                
                //save current user to localstorage
                window.localStorage.setItem("currentUser", JSON.stringify(currentUser));

                elements.navbar.toggleAuthSection();

                elements.navbar.setCurrentUser(currentUser);

                this.modal.hide();
                
            } catch (error) {
                elements.signupDisplayInfo.style.setProperty("display", "block");
                elements.signupDisplayInfo.textContent = error.msg;                
            }
            //
        });


        elements.loginBtn.addEventListener("click",async e => {
            e.preventDefault();
            const frmData = new FormData(elements.frmLogin);

            try {
                const response = await this.controller.login(frmData);
                const {user, token} = response.data;

                const currentUser = {
                    user: user,
                    token: token
                }
                
                //save current user to localstorage
                window.localStorage.setItem("currentUser", JSON.stringify(currentUser));
                                
                elements.navbar.toggleAuthSection();
                elements.navbar.setCurrentUser(currentUser);

                this.modal.hide();
                
            } catch (error) {
                elements.loginDisplayInfo.style.setProperty("display", "block");
                elements.loginDisplayInfo.textContent = error.msg;                
            }
            //
        });

        //
    }


    rerender(){
        this.shadowRoot.innerHTML = ``;

        this.render();
    }


    elements(){
        const _links = Array.from(this.shadowRoot.querySelectorAll(".link"));

        const _inputs = Array.from(this.shadowRoot.querySelectorAll("input"));

        const _authSection = document.querySelector("main-layout").shadowRoot.querySelector("navbar-c").shadowRoot.querySelector(".user-management").querySelector("#auth");

        const _userSection = document.querySelector("main-layout").shadowRoot.querySelector("navbar-c").shadowRoot.querySelector(".user-management").querySelector("#user");

        const _userImg = _userSection.querySelector(".profile-link");

        const _navbar = document.querySelector("main-layout").shadowRoot.querySelector("navbar-c");

        return {
            links: _links,
            inputs: _inputs,
            loginLink: this.shadowRoot.querySelector("#login-link"),
            signupLink: this.shadowRoot.querySelector("#signup-link"),
            loginBtn: this.shadowRoot.querySelector("#login-button"),
            signupBtn: this.shadowRoot.querySelector("#signup-button"),
            frmLogin : this.shadowRoot.querySelector(`#${this.formId.login}`),
            frmSignup : this.shadowRoot.querySelector(`#${this.formId.signup}`),
            loginDisplayInfo : this.shadowRoot.querySelector("#login-display-info"),
            signupDisplayInfo : this.shadowRoot.querySelector("#signup-display-info"),
            authSection : _authSection, 
            userSection : _userSection,
            userImg: _userImg,
            navbar: _navbar,      
        }
    }


    clearInputs(){
        Array.from(this.shadowRoot.querySelectorAll("input")).map(input => {
            input.value = "";
        });
        Array.from(this.shadowRoot.querySelectorAll(".display-info")).map(infoDisplay => {
            infoDisplay.textContent = "";
            infoDisplay.style.setProperty("display", "none");
        });
    }


    setActiveForm(formId) {
        this.clearInputs();
        const forms = Array.from(this.shadowRoot.querySelectorAll(".form"));
        forms.forEach(form => form.classList.remove("active"));
        const form = this.shadowRoot.querySelector(`#${formId}`);
        form.classList.add("active");
    }
    //

}


window.customElements.define("auth-c", AuthComponent);