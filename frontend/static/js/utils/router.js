import HomeView from '/static/js/views/HomeView.js';
import ProfileView from '/static/js/views/ProfileView.js';

function pathToRegex(path){
    return new RegExp("^" + path.replace(/\//g,"\\/").replace(/:\w+/g,"(.+)") + "$");
}

function getParams(match){
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

    return Object.fromEntries(keys.map((key, index)=>{
        return [key, values[index]];
    }))
}

export async function navigateTo(url) {
    const screenLoader = document.getElementById("appLoader");
    if (screenLoader) screenLoader.show(); // Show loader before navigation

    // Minimum loader display time
    const minimumDisplayTime =300; // Set a minimum time in milliseconds (e.g., 300ms)

    const start = Date.now();
    window.history.pushState({}, "", url); 
    await router();

    // Calculate the remaining time to maintain minimum display time
    const remainingTime = minimumDisplayTime - (Date.now() - start);
    setTimeout(() => {
        if (screenLoader) screenLoader.hide(); // Hide loader after minimum time
    }, Math.max(0, remainingTime)); // Ensure the remaining time is not negative
}


export function router(){

    return new Promise( async(res, rej)=>{
        const routes = [
            {path: "/", view: HomeView},
            {path: "/users/:id", view: ProfileView},
        ];
    
        const potentialMatches = routes.map(route =>{
            return {
                route: route,
                result: window.location.pathname.match(pathToRegex(route.path))
            }
        });
    
        let match = potentialMatches.find(potentialMatch => potentialMatch.result);
    
        if(!match){
            match = {
                route: routes[0],
                result: window.location.pathname
            }
        };
    
        const params = getParams(match);
        const view =  new match.route.view(params);
        await document.querySelector("main-layout").renderView(view);
        res(true);
    } )

}


document.addEventListener("load", e =>{
    e.preventDefault();
})

window.addEventListener("popstate", router)
