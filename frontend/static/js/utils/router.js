import HomeView from '/static/js/views/HomeView.js';
import ProfileView from '/static/js/views/ProfileView.js';

function pathToRegex(path) {
    return new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");
}

function getParams(match) {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

    return Object.fromEntries(keys.map((key, index) => {
        return [key, values[index]];
    }))
}

export function navigateTo(url) {
    window.history.pushState({}, "", url);
    router();
}


export async function router() {

    const routes = [
        { path: "/", view: HomeView },
        { path: "/users/:id", view: ProfileView },
    ];

    const potentialMatches = routes.map(route => {
        return {
            route: route,
            result: window.location.pathname.match(pathToRegex(route.path))
        }
    });

    let match = potentialMatches.find(potentialMatch => potentialMatch.result);

    if (!match) {
        match = {
            route: routes[0],
            result: window.location.pathname
        }
    };

    const params = getParams(match);
    const view = await new match.route.view(params);
    await document.querySelector("main-layout").renderView(view);
}


document.addEventListener("load", e => {
    e.preventDefault();
})

window.addEventListener("popstate", router)
