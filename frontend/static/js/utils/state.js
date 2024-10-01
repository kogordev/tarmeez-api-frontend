class State {
    constructor() {
        this.subscribers = [];
        this.currentUser = null; // Initialize currentUser here
        this.loadCurrentUser();
    }

    loadCurrentUser() {
        try {
            const userObjectStr = window.localStorage.getItem("currentUser");
            if (userObjectStr) {
                this.currentUser = JSON.parse(userObjectStr);
            }
        } catch (error) {
            console.error("Failed to load current user:", error);
            this.currentUser = null;
        }
    }

    getCurrentUserAsStrring() {
        if (this.currentUser) {
            try {
                const currentUserStr = JSON.stringify(this.currentUser);
                return currentUserStr;
            } catch (error) {
                return null;
            }
        }
        return null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    // Method to update the current user in both the state and localStorage
    updateCurrentUser(userObject) {
        try {
            if (userObject) {
                // Update with a new user object
                this.currentUser = userObject;
                window.localStorage.setItem("currentUser", JSON.stringify(userObject));
            } else {
                // If null, remove the user from localStorage (logging out)
                this.currentUser = null;
                window.localStorage.removeItem("currentUser");
            }
            this.notifySubscribers(this.currentUser);
        } catch (error) {
            console.error("Failed to update current user:", error);
        }
    }

    subscribe(callback) {
        if (typeof callback === 'function') {
            this.subscribers.push(callback);
        }
    }

    notifySubscribers(state) {
        this.subscribers.forEach(callback => callback(state));
    }
}

export default new State();
