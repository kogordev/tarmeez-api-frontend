import AbstractController from "/static/js/controllers/AbstractController.js";

export default class UserController extends AbstractController {
    #baseUrl = "https://tarmeezacademy.com/api/v1";

    constructor() {
        super();
    }

    createUser(formData) {
        const url = `${this.#baseUrl}/register`;

        const options = {
            method: "POST",
            headers: this.headers,
            body: formData,
        };
        
        return new Promise(async (res, rej) => {
            try {
                const response = await fetch(url, options);
    
                const json = await response.json(); // Attempt to parse the response body regardless of status
    
                if (!response.ok) {
                    // Reject the promise and pass the API error response
                    return rej({
                        data: json,  // Error response data (e.g., "user is already registered")
                        msg: json.message || response.statusText || 'Request failed',
                        status: response.status
                    });
                }
    
                // Resolve the promise when the request is successful
                res({
                    data: json,
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
            }
        });
        //      
    }

    login(formData){
        const url = `${this.#baseUrl}/login`;

        const options = {
            method: "POST",
            headers: this.headers,
            body: formData,
        };
        
        return new Promise(async (res, rej) => {
            try {
                const response = await fetch(url, options);
    
                const json = await response.json(); // Attempt to parse the response body regardless of status
    
                if (!response.ok) {
                    // Reject the promise and pass the API error response
                    return rej({
                        data: json,  // Error response data (e.g., "user is already registered")
                        msg: json.message || response.statusText || 'Request failed',
                        status: response.status
                    });
                }
    
                // Resolve the promise when the request is successful
                res({
                    data: json,
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
            }
        });
        //      
    }

    user(id){
        const url = `${this.#baseUrl}/users/${id}`;

        return new Promise(async (res, rej) => {
            try {
                const response = await fetch(url);
    
                const json = await response.json(); // Attempt to parse the response body regardless of status
    
                if (!response.ok) {
                    // Reject the promise and pass the API error response
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
            }
        });
        //      
    }

    userPosts(id){
        const url = `${this.#baseUrl}/users/${id}/posts`;

        return new Promise(async (res, rej) => {
            try {
               // this.loader.show()
                const response = await fetch(url);
    
                const json = await response.json(); // Attempt to parse the response body regardless of status
    
                if (!response.ok) {
                    // Reject the promise and pass the API error response
                    //this.loader.hide()
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
            }finally{
                //this.loader.hide()
            }
        });
        //      
    }

}