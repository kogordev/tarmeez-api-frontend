export default class ScreenLoader extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
        this.loaderWrapper = null;
        this.render();
    }

    connectedCallback() {
        this.hide(); // Initially hide the loader
    }

    render() {
        this.shadow.innerHTML = /*html*/ `
            <link rel="stylesheet" href="/static/css/screenloader.css"/>
            <link rel="stylesheet" href="/static/css/common.css"/>
            <div class="loader-wrapper wrapper flex flex-center">
                <img src="/static/assets/images/loader1.gif" alt="loader"/>
            </div>
        `;
        this.loaderWrapper = this.shadow.querySelector('.loader-wrapper');
    }

    show() {
        this.loaderWrapper.classList.remove('hidden', 'fade-out');
        this.loaderWrapper.style.visibility = 'visible';
        this.loaderWrapper.style.opacity = 1; // Ensure opacity is reset
    }

    hide() {
        this.loaderWrapper.classList.add('fade-out');
        
        this.loaderWrapper.addEventListener('transitionend', () => {
            this.loaderWrapper.classList.add('hidden');
            this.loaderWrapper.style.visibility = 'hidden';
        }, )//{ once: true });
    }
}

customElements.define("screenloader-c", ScreenLoader);
