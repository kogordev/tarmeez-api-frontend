import PostComponent from '/static/js/components/PostComponent.js';

export default class PostsWrapperComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.posts = []; // Initialize with an empty array of posts
    }

    connectedCallback() {
        this.render();
    }

    // Method to set the posts array
    setPosts(postsArray, sort = "desc") {
        this.posts = postsArray;
        this.renderPosts(sort); // Re-render posts whenever the array is updated
    }

    // Method to set posts for pagination
    loadPostsPage(newPostsArray, sort = "desc") {
        this.posts = [...this.posts, ...newPostsArray];
        this.renderPostsPagination(newPostsArray, sort);
    }

    // Method to add a single post dynamically
    addPost(post, sort = "desc") {
        if (sort === "desc") {
            this.posts.unshift(post); // Add new post to the beginning of the array
        } else {
            this.posts.push(post);
        }

        this.renderSinglePost(post, sort);

        // Dispatch post-added event
        this.dispatchEvent(new CustomEvent('post-added', {
            detail: { post },
            bubbles: true, // Allow event to propagate to parent components
            composed: true
        }));
    }

    // Method to handle a single post deletion
    removePost(postId) {
        this.posts = this.posts.filter(post => post.id !== postId);
        this.renderPosts(); // Re-render the updated list of posts
    }

    render() {
        this.shadowRoot.innerHTML = /*html*/ `
            <link rel="stylesheet" href="/static/css/common.css"/>
            <div id="posts-wrapper" class="card flex flex-col justify-content-center gap bg-transparent"></div>
        `;
    }

    // Method to render all posts from the array
    renderPosts(sort) {
        const postsWrapper = this.shadowRoot.querySelector('#posts-wrapper');
        postsWrapper.innerHTML = ''; // Clear previous posts

        if (!this.posts || this.posts.length === 0) {
            postsWrapper.innerHTML = '<p>No posts available.</p>';
            return;
        }

        for (let post of this.posts) {
            this.renderSinglePost(post, sort);
        }
    }

    // Method to render all posts from the array
    renderPostsPagination(newPostsArray, sort) {
        const postsWrapper = this.shadowRoot.querySelector('#posts-wrapper');

        if (!newPostsArray || newPostsArray.length === 0) {
            postsWrapper.innerHTML = '<p>No posts available.</p>';
            return;
        }

        for (let post of newPostsArray) {
            this.renderSinglePost(post, sort);
        }
    }

    // Method to render a single post
    renderSinglePost(post, sort = "desc") {
        const postsWrapper = this.shadowRoot.querySelector('#posts-wrapper');

        const postComp = new PostComponent();
        postComp.state = post;
        postComp.id = post.id;

        // Add post component to the DOM
        if (sort === "desc")
            postsWrapper.prepend(postComp);
        else if (sort === "asc") {
            postsWrapper.append(postComp);
        }

        // Listen for post deletion and handle it
        postComp.addEventListener('post-deleted', (e) => this.handlePostDelete(e, postComp));
    }

    // Handler for post deletion event
    handlePostDelete(event, postComp) {
        const { detail } = event;
        if (detail?.isDeleted) {
            postComp.remove();
            this.posts = this.posts.filter(p => p.id !== postComp.id);

            // Dispatch post-removed event
            this.dispatchEvent(new CustomEvent('post-removed', {
                detail: { postId: postComp.id },
                bubbles: true, // Allow event to propagate to parent components
                composed: true
            }));
        }
    }
}

window.customElements.define('postswrapper-c', PostsWrapperComponent);
