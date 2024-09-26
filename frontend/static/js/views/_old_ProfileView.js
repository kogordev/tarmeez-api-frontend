import PostComponent from '/static/js/components/PostComponent.js';
import Controller from '/static/js/controllers/controller.js';

export default class ProfileView extends HTMLElement{
    constructor(params){
        super();
        this.attachShadow({mode: "open"});
        this.params = params;
        this.controller = new Controller()
        this.user = null;
    }

    connectedCallback(){
        this.render();
    }

    async render(){

        try {
            const json = await this.controller.request(`/users/${this.params.id}`);
            this.user = JSON.stringify(json.data);
        } catch (error) {
            console.log(error.msg);
        }
        
        //setup for new render
        this.shadowRoot.innerHTML = "";
        this.shadowRoot.innerHTML = /*html*/`
        <link rel="stylesheet" href="/static/css/common.css"/>
        <link rel="stylesheet" href="/static/css/profileview.css"/>
        <div class="wrapper padding-view main-color flex flex-col align-items-center gap">
            <dashboard-c data-user='${this.user}' ></dashboard-c>
            <PostCreator-c></postcreator-c>
            <div id="posts-wrapper" class="card flex flex-col gap">
            </div>
        </div>    
        `

        try {
            const userPosts = await this.controller.request(`/users/${this.params.id}/posts`);
            this.renderPosts(userPosts.data)
        } catch (error) {
            console.log(error)    
            console.log(error.msg)    
        }

        this.addEventListener("click", e =>{
            e.stopPropagation();
            e.preventDefault();
        })
    }

    rerender(){
        this.shadowRoot.innerHTML = '';
        this.render();
    }

    renderPosts(posts){
        if (!posts) return ;
        if (posts.length <= 0) return ;

        
        const postsWrapper = this.shadowRoot.querySelector("#posts-wrapper");
        console.log("rednerposts", postsWrapper)
        for(let post of posts){
            const postComp = new PostComponent();
            postComp.state = post;
            postsWrapper.appendChild(postComp);
        }
    }
}

window.customElements.define("profile-view", ProfileView);