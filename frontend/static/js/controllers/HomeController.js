import AbstractController from "/static/js/controllers/AbstractController.js";

export default class UserController extends AbstractController {
    #baseUrl = "https://tarmeezacademy.com/api/v1";
    #page = 1;

    constructor() {
        super();
        this.postPerPage = 5;
    }

    async fetchPosts() {

        const url = `${this.#baseUrl}/posts?page=${this.#page}&limit=${this.postPerPage}`;

        return new Promise(async (res, rej) => {
            try {

                this.loader.show();
                const response = await fetch(url);

                const json = await response.json(); // Attempt to parse the response body regardless of status

                if (!response.ok) {
                    // Reject the promise and pass the API error response
                    this.loader.hide();
                    return rej({
                        data: json,  // Error response data (e.g., "user is already registered")
                        msg: json.message || response.statusText || 'Request failed',
                        status: response.status
                    });
                }

                // Resolve the promise when the request is successful
                //check last page
                if (this.#page <= json.meta.last_page) {
                    this.#page ++;
                }
                res({
                    data: json.data,
                    msg: 'Success',
                    status: response.status
                });
            } catch (error) {
                // Catch and reject in case of unexpected errors
                rej({
                    data: null,
                    msg: error.message || 'Request error',
                    status: 500
                });
            } finally {
                this.loader.hide();
            }
        });
        //      
    }

    async fetchPost(id){
        const url = `${this.#baseUrl}/posts/${id}`;

        return new Promise(async (res, rej) => {
            try {

                this.loader.show();
                const response = await fetch(url);

                const json = await response.json(); // Attempt to parse the response body regardless of status

                if (!response.ok) {
                    // Reject the promise and pass the API error response
                    this.loader.hide();
                    return rej({
                        data: json,  // Error response data (e.g., "user is already registered")
                        msg: json.message || response.statusText || 'Request failed',
                        status: response.status
                    });
                }

                // Resolve the promise when the request is successful
                res({
                    data: json.data,
                    msg: 'Success',
                    status: response.status
                });
            } catch (error) {
                // Catch and reject in case of unexpected errors
                rej({
                    data: null,
                    msg: error.message || 'Request error',
                    status: 500
                });
            } finally {
                this.loader.hide();
            }
        });
        // 
    }
}