export default class Controller {
    constructor(baseUrl = "https://tarmeezacademy.com/api/v1", defaultHeaders = {}) {
        this.baseUrl = baseUrl;
        this.defaultHeaders = {
            "X-Requested-With": "XMLHttpRequest",
            "Access-Control-Allow-Origin": "*",
            ...defaultHeaders, // Allow overriding headers
        };
        this.page = 1; // Pagination default
    }

    // Generic request handler
    async request(pathname, method = 'GET', data = null, customHeaders = {}) {
        const url = `${this.baseUrl}${pathname}`;
        const headers = { ...this.defaultHeaders, ...customHeaders };
        const options = {
            method,
            headers,
        };

        // Handle data payloads
        if (data && method !== 'GET') {
            if (data instanceof FormData) {
                options.body = data; // FormData should be directly added to the body
                delete headers['Content-Type']; // Let the browser set the Content-Type for FormData
            } else {
                options.body = JSON.stringify(data); // Assuming JSON payload
                headers['Content-Type'] = 'application/json'; // Ensure JSON content-type for non-FormData payloads
            }
        }

        try {
            const response = await fetch(url, options);
            const json = await this.parseJson(response);

            if (!response.ok) {
                throw new Error(json.message || response.statusText || 'Request failed');
            }

            if(json.hasOwnProperty("meta")){
                this.handlePagination(json)
            }

            return {
                data: json.data || json,
                msg: 'Success',
                status: response.status,
            };
        } catch (error) {
            return Promise.reject({
                data: null,
                msg: error.message || 'Request error',
                status: 500,
            });
        }
    }

    // Parse response JSON with error handling
    async parseJson(response) {
        try {
            return await response.json();
        } catch (e) {
            throw new Error('Invalid JSON response');
        }
    }

    // GET method
    get(pathname, params = {}, customHeaders = {}) {
        const queryString = new URLSearchParams(params).toString();
        const urlWithParams = queryString ? `${pathname}?${queryString}` : pathname;
        return this.request(urlWithParams, 'GET', null, customHeaders);
    }

    // POST method
    post(pathname, data, customHeaders = {}) {
        return this.request(pathname, 'POST', data, customHeaders);
    }

    // Pagination handling (example)
    handlePagination(json) {
        if (json.meta && this.page <= json.meta.last_page) {
            this.page++;
        }
    }
}
