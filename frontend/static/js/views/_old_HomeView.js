import PostComponent from '/static/js/components/PostComponent.js';
import Controller from '/static/js/controllers/controller.js';

export default class HomeView extends HTMLElement{
    constructor(params){
        super();
        this.attachShadow({mode: "open"});
        this.controller = new Controller();
        document.addEventListener("scroll", ()=>{
            this.infiniteScroll();
        });
    }

    connectedCallback(){
        this.render();
    }

    async render(){
        this.shadowRoot.innerHTML = /*html*/`
        <link rel="stylesheet" href="/static/css/common.css"/>
        <link rel="stylesheet" href="/static/css/homeview.css"/>
        <div id="posts-wrapper" class="wrapper padding-view main-color flex flex-col align-items-center gap">

        </div>    
        `

        this.renderPosts();

        this.addEventListener("click", e =>{
            e.stopPropagation();
            e.preventDefault();
        })
    }

    rerender(){
        this.shadowRoot.innerHTML = '';
        this.render();
    }

    async renderPosts(){
        let posts = [];
        try {  
            const pageNumber = this.controller.page;
            const json = await this.controller.request(`/posts?page=${pageNumber}&limit=5`);
            posts = json.data;

        } catch (error) {
            console.log(error)
            console.log(error.msg);
        }


        if (posts.length <= 0) return ;

        const postsWrapper = this.shadowRoot.querySelector("#posts-wrapper");
        for(let post of posts){
            
            const postComp = new PostComponent();
            postComp.state = post;

            try {              
                let json = await this.controller.request(`/posts/${post["id"]}`);
                postComp.state.comments = json.data.comments;
            } catch (error) {
                console.log(error);
                console.log(error.msg);
            }

            postsWrapper.appendChild(postComp);
        }
    }

    infiniteScroll() {
        const endOfPage = window.scrollY + window.innerHeight  >= document.body.scrollHeight;
        if (endOfPage) {
            this.renderPosts();
        };
    }
    
}


window.customElements.define("home-view", HomeView);
