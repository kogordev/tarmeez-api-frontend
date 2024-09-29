class State {
    constructor() {
        this.subscribers = [];
        this.loadCurrentUser();
    }

    loadCurrentUser() {
        try {
            const userObjectStr = window.localStorage.getItem("currentUser");
            if (userObjectStr) {
                this.currentUser = JSON.parse(userObjectStr);
            } else {
                this.currentUser = null;
            }
        } catch (error) {
            console.error("Failed to load current user:", error);
            this.currentUser = null;
        }
    }

    getCurrentUser() {
        return this.currentUser;
    }

    setCurrentUser(userObject) {
        if (userObject) {
            try {
                this.currentUser = userObject;
                const userObjectStr = JSON.stringify(userObject);
                window.localStorage.setItem("currentUser", userObjectStr);
                this.notifySubscribers();
            } catch (error) {
                console.error("Failed to update current user:", error);
            }
        }
    }

    subscribe(callback) {
        if (typeof callback === 'function') {
            this.subscribers.push(callback);
        }
    }

    notifySubscribers() {
        this.subscribers.forEach(callback => callback(this.currentUser));
    }
}

export default new State();
