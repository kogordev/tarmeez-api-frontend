export default class DashboardComponent extends  HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode: "open"});
    }

    connectedCallback(){
        this.render();
    }

    render(){
        let user = this.dataset.user || null;

        if(!user) return;

        user = JSON.parse(user);

        //setup for new render
        this.shadowRoot.innerHTML = "";

        this.shadowRoot.innerHTML = /*html*/`
        <link rel="stylesheet" href="/static/css/common.css"/>
        <link rel="stylesheet" href="/static/css/dashboard.css"/>
        <div class="card padding grid col-3">
           <div class="col padding flex flex-col gap">
                <div class="flex flex-col flex-center">
                    <img src="${user.profile_image}" alt="profile image"/>
                    <h2>${user.username}</h2>
                    <h2>${user.email}</h2>
                </div>
           </div>
           <div class="col padding flex flex-col flex-center">
                <span class="number">${user.posts_count}</span>
                <sub class="label">Post</sub>
           </div>
           <div class="col padding flex flex-col flex-center">
                <span class="number">${user.comments_count}</span>
                <span class="label">Comment</span>
           </div>
        </div>
        `
    }

}

window.customElements.define("dashboard-c", DashboardComponent);