import Controller from "/static/js/controllers/controller.js";
import state from "/static/js/utils/state.js";

function getCss() {
    return /*css*/`
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-size: 1.8rem;
        border-radius: var(--br);
    }
    .flex{
        display: flex;
    }
    .flex-col{
        flex-direction: column;
    }
    .flex-center{
        align-items: center;
        justify-content: center;
    }
    .justify-content-center{
        justify-content: center;
    }
    .justify-content-between{
        justify-content: space-between;
    }
    .align-items-center{
        align-items: center;
    }
    .gap{
        gap: 1.5rem;
    }
    .backdrop{
        position: fixed;
        inset: 0 0 0 0;
        height: 100vh;
        width: 100vw;
        background-color: rgba(0,0,0, 0.9);
        z-index: 99999;
    }
    .wrapper{
        width: 50rem;
        height: 70rem;
        padding: 2rem;
        background-color: rgb(var(--clr-bg-secondary));
        color: rgb(var(--clr-text-primary));
        position: relative;
        overflow: hidden;
    }
    .slider-wrapper{
        height: 6rem;
        position: absolute;
        top: 16rem;
        right: 5rem;
        border: 1px solid rgb(var(--clr-border));
        border-radius: var(--br);
        overflow: hidden;
        z-index: 100;
    }

    .slider-wrapper, form{
        width: 40rem;
    }
    .slider{
        width: 20rem;
        height: 6rem;
        background-color: rgb(var(--clr-action-bg));
        position: absolute;
        top: 0;
        right: 0;
    }
    .radio{
        display: none;
    }
    .slider, label, form{
        transition: all 0.5s cubic-bezier(.8, -.6, .4, -.3);
    }
    label{
        display: inline-block;
        height: 100%;
        width: 50%;
        padding-inline: 5rem;
        font-size: 1.6rem;
        font-weight: 700;
        color: rgb(var(--clr-text-primary));
        z-index: 10;
        cursor: pointer;
    }
    input, button{
        width: 40rem;
    }
    input{
        border: 1px solid rgb(var(--clr-border));
        height: 5rem;
        padding: 1rem;
        outline: none;
        background-color: inherit;
        color: rgb(var(--clr-text-primary));
    }
    input:focus{
        border: 2px solid rgb(var(--clr-action-bg));
    }
    form{
        height: 100%;
        width: 100%;
    }
    form h2{
        font-size: 4rem;
        margin-top: 4rem;
        margin-bottom:16rem;
    }
    .btn{
        border: none;
        background-color: rgb(var(--clr-action-bg));
        color: rgb(var(--clr-action-text));
        font-weight: 600;
        padding: 2rem;
        cursor: pointer
    }
    .signupHide{
        transform:translateX(500px);
    }
    .loginHide{
        transform: translateX(-500px);
    }
    .container{
        display: block;
        width: 100%;
        height:100%;
    }
    .translateCenter{
        transform:translateX(50%);
    }
    .centerSignup{
        transform: translateX(-50%);
    }
    .centerLogin{
        transform: translateX(50%);
    }
    .footer{
        margin-top: 5rem;
    }
    .slider-container{
        height: 100%;
        position: relative
    }
    .active{
        color: rgb(var(--clr-action-text))
    }
    .footer p{
        font-size: 1.8rem;
        padding-block: 4rem;
    }
    #signupLink{
        font-size: 1.8rem;
        color: rgb(var(--clr-link));
        text-decoration: none;
    }
    #fileInput{
        display: none;
    }
    .displayInfo{
        padding: 1rem;
        font-size: 1.4rem;
        display: flex;
        justify-content: center;
        align-items: center;
        display: none;
        color: rgb(var(--clr-danger-bg));
        position: absolute;
        bottom: -3.5rem;
    }
    .position-relative{
        position: relative;
    }
    .circle-btn {
        border: none;
        border-radius: 50%;
        height: 2.5rem;
        width: 2.5rem;
        background-color: rgb(var(--clr-action-bg));
        cursor: pointer;
    }
    
    .close-btn {
        mask-image: url("/static/assets/images/close-button.svg");
        mask-position: center;
        mask-repeat: no-repeat;
        position: absolute;
        top: 1.25rem;
        right: 1.5rem;
    }
    `
}

export default class AuthForm extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
        this.controller = new Controller();
        this.elements = {};
    }

    connectedCallback() {
        this.initializeComponent();
    }

    initializeComponent() {
        this.addStyle();
        this.render();
        this.setElementsObject();
        this.attachEvents();
    }

    addStyle() {
        const style = document.createElement("style");
        style.textContent = getCss().trim();
        this.shadow.appendChild(style);
    }

    getHTMLTemplate() {
        return /*html*/`
        <div id="backdrop" class="backdrop flex flex-center">
            <div class="wrapper flex flex-center">
                    <button id="closeBtn" class="circle-btn close-btn"></button>
                    <div class="slider-wrapper">
                        <div class="slider-container flex justify-content-between">
                            <label id="loginLabel" class="flex flex-center" for="loginRadio">Login</label>
                            <input class="radio"  id="loginRadio" type="radio" name="form" value="login" data-form="loginForm"/>
                            <label id="signupLabel" class="flex flex-center" for="signupRadio" >Signup</label>                    
                            <input class="radio" id="signupRadio" type="radio" name="form" value="signup" data-form="signupForm"/>
                            <div id="slider" class="slider"></div>
                        </div>
                    </div>
                    ${this.renderLoginForm()}
                    ${this.renderSignupForm()}
            </div>
        </div>
        `
    }

    render() {
        const template = document.createElement("template");
        template.innerHTML = this.getHTMLTemplate().trim();
        this.shadow.appendChild(template.content.cloneNode(true));
    }

    renderLoginForm() {
        return /*html*/`
        <form id="loginForm" class="container flex flex-col gap loginHide">
            <div class="header flex flex-center">
                <h2>Login Form</h2>
            </div>
            <div class="form-inputs-wrapper flex flex-col gap position-relative">
                <input type="text" id="loginUsernameInput" name="username" placeholder="Enter username..." required/>
                <input type="password" id="loginPasswordInput" name="password" placeholder="Enter password..." required/>
                <p id="loginDisplayInfo" class="displayInfo red"></p>
            </div>
            <div class="footer flex flex-col flex-center">
                <button id="loginBtn" class="btn" type="submit">Login</button>
                <p>Not a member? <a href="" id="signupLink">Signup now</a></p>
            </div>
        </form>
        `
    }

    renderSignupForm() {
        return /*html*/`
        <form id="signupForm" class="signupHide">
            <div class="header flex flex-center">
                <h2>Signup Form</h2>
            </div>
            <div class="form-inputs-wrapper flex flex-col gap position-relative">
                <input class="input" type="text" id="nameInput" name="name" placeholder="Enter name..."/>
                <input class="input" type="text" id="usernameInput" name="username" placeholder="Enter username..." required/>
                <input class="input" type="email" id="emailInput" name="email" placeholder="Enter email..."/>
                <input class="input" type="password" id="passwordInput" name="password" placeholder="Enter password..." required/>
                <input class="input" type="file" id="fileInput" name="image" />
                <p id="signupDisplayInfo" class="displayInfo red"></p>
            </div>
            <div class="footer flex flex-center">
                <button id="signupBtn" class="btn" type="submit">Signup</button>
            </div>
        </form>
        `
    }

    setElementsObject() {
        const singupInputs = Array.from(this.shadow.querySelectorAll("#signupForm .form-inputs-wrapper input")) || [];
        const loginInputs = Array.from(this.shadow.querySelectorAll("#loginForm .form-inputs-wrapper  input")) || [];

        this.elements = {
            closeBtn: this.shadow.querySelector("#closeBtn"),
            radios: Array.from(this.shadow.querySelectorAll(".radio")),
            backdrop: this.shadow.querySelector("#backdrop"),
            signupLink: this.shadow.querySelector("#signupLink"),
            slider: this.shadow.querySelector("#slider"),
            loginLabel: this.shadow.querySelector("#loginLabel"),
            signupLabel: this.shadow.querySelector("#signupLabel"),
            signupForm: this.shadow.querySelector("#signupForm"),
            loginForm: this.shadow.querySelector("#loginForm"),
            signupInputs: singupInputs,
            loginInputs: loginInputs,
            signupBtn: this.shadow.querySelector("#signupBtn"),
            loginBtn: this.shadow.querySelector("#loginBtn"),
            loginDisplayInfo: this.shadow.querySelector("#loginDisplayInfo"),
            signupDisplayInfo: this.shadow.querySelector("#signupDisplayInfo")
        }
    }

    attachEvents() {
        this.elements.loginForm.addEventListener("submit", e => this.handleSubmit(e))
        this.elements.signupForm.addEventListener("submit", e => this.handleSubmit(e))

        this.elements.backdrop.addEventListener("click", e => {
            e.stopPropagation();
            if (e.target.id !== "backdrop") return;
            this.remove();
        });

        this.elements.closeBtn.addEventListener("click", () => {
            this.remove();
        });

        this.elements.radios.map(radio => {
            radio.addEventListener("change", e => this.setActiveForm(e));
        });

        this.elements.signupLink.addEventListener("click", e => {
            e.preventDefault();
            this.elements.signupLabel.click();
        });

        this.elements.signupInputs.forEach(input => input.addEventListener("input", this.clearSignupError.bind(this)))

        this.elements.loginInputs.forEach(input => input.addEventListener("input", this.clearLoginError.bind(this)))
    }

    clearSignupInputs() {
        this.elements.signupInputs.forEach(input => {
            input.value = ""
        });
    }

    clearLoginInputs() {
        this.elements.loginInputs.forEach(input => {
            input.value = ""
        });
    }

    setActiveForm(e) {
        try {
            const formId = e.target.dataset?.form;
            switch (formId) {
                case "signupForm":
                    this.showSignupForm();
                    break;
                case "loginForm":
                    this.showLoginForm();
                    break;
            }
        } catch (error) {

        }
    }

    hideLoginForm() {
        // hide loginform
        this.elements.loginLabel.classList.remove("active");
        this.elements.loginForm.classList.remove("centerLogin");
        this.elements.loginForm.className = ""
        this.elements.loginForm.classList.add("loginHide");
    }

    hideSignupForm() {
        //hide signupform
        this.elements.signupLabel.classList.remove("active");
        this.elements.signupForm.classList.remove("centerSignup");
        this.elements.signupForm.className = "";
        this.elements.signupForm.classList.add("signupHide");

    }

    showLoginForm() {
        this.hideSignupForm();

        // show loginform
        this.clearLoginInputs();
        this.clearLoginError();
        this.elements.loginLabel.classList.add("active");
        this.elements.slider.style.left = 0;
        this.elements.loginForm.classList.remove("loginHide");
        this.elements.loginForm.classList.add("centerLogin");
    }

    showSignupForm() {
        this.hideLoginForm();

        // show signupform
        this.clearSignupInputs();
        this.clearSignupError();
        this.elements.signupLabel.classList.add("active");
        this.elements.slider.style.left = "20rem";
        this.elements.slider.classList.add("loginActive");
        this.elements.signupForm.classList.remove("signupHide");
        this.elements.signupForm.classList.add("centerSignup");
    }

    displayLoginError(msg) {
        this.elements.loginDisplayInfo.textContent = msg;
        this.elements.loginDisplayInfo.style.display = "block";
        this.elements.loginDisplayInfo.classList.add("danger");
    }

    clearLoginError() {
        this.elements.loginDisplayInfo.textContent = "";
        this.elements.loginDisplayInfo.style.display = "none";
        this.elements.loginDisplayInfo.classList.remove("danger");
    }

    displaySignupError(msg) {
        this.elements.signupDisplayInfo.textContent = msg;
        this.elements.signupDisplayInfo.style.display = "block";
        this.elements.signupDisplayInfo.classList.add("danger")
    }

    clearSignupError() {
        this.elements.signupDisplayInfo.textContent = "";
        this.elements.signupDisplayInfo.style.display = "none";
        this.elements.signupDisplayInfo.classList.remove("danger")
    }

    handleSubmit(event) {
        event.preventDefault();
        const target = event.target;

        // Determine the form being submitted and gather data
        const formData = new FormData(target);

        if (target.id === "signupForm") {
            this.submitForm("/register", formData, target.id);
        } else if (target.id === "loginForm") {
            this.submitForm("/login", formData, target.id);
        }
    }

    async submitForm(url, formData, formId) {
        const loader = document.createElement("processing-c");
        this.shadow.querySelector(".wrapper").appendChild(loader);

        try {
            const response = await this.controller.post(url, formData);
            state.updateCurrentUser(response.data);
            this.remove(); // Remove component after successful submission
        } catch (error) {
            setTimeout(() => {
                if (formId === "loginForm") {
                    this.displayLoginError(error.msg);
                } else if (formId === "signupForm")
                    this.displaySignupError(error.msg);
                loader.remove()
            }, 500);
        }
    }
}

window.customElements.define("auth-form", AuthForm);