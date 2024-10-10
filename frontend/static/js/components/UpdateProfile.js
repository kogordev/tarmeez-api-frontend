class UpdateProfile extends HTMLElement{
    constructor(){
        super();
        this.shadow = this.attachShadow({mode: "open"});
        this.state = null;
    }

    connectedCallback(){
        this.initializeComponent();
    }

    checkState(){
        // if (!this.state) {
        //     this.dispatchEvent(new CustomEvent("onError",{detail: "Provide state to proceed!"} ))
        //     this.remove();
        // }
    }

    initializeComponent(){
        this.checkState();
        this.addStyle();
        this.render();
        this.attachEvents();
    }

    getCss(){
        return /*css*/`
        :host{
            position: absolute;
            bottom: 0px;
            right: 0px;
            left: 0px;
            height: 40px;
            cursor: pointer;
        }
        .btn{
            height: 100%;
            width: 100%;
            border-radius: var(--br);
            background-color: red;
            box-shadow: 0 0 30px rgba(0,0,0, .3);
            cursor: pointer;
            background-color: rgb(var(--clr-edit-btn-background));
            color: rgb(var(--clr-edit-btn-foreground));
        }
        .btn:hover{
            background-color: rgb(var(--clr-edit-btn-hover-background));
            color: rgb(var(--clr-edit-btn-hover-foreground));
        }
        `
    }

    addStyle(){
        const style = document.createElement("style");
        style.textContent = this.getCss().trim();
        this.shadow.appendChild(style);
    }
    
    getHTMLTemplate(){
        return /*html*/`
        <button class="btn">Update Profile</button>
        `
    }

    render(){
        const template  = document.createElement("template");
        template.innerHTML = this.getHTMLTemplate().trim();
        this.shadow.appendChild(template.content.cloneNode(true));
    }

    attachEvents(){

    }

}

export default UpdateProfile;
window.customElements.define("update-profile", UpdateProfile);