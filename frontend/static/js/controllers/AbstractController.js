export default class AbstractController{
    constructor(){
        this.loader = document.querySelector("screenloader-c");
        this.headers = {
            "X-Requested-With": "XMLHttpRequest",
            "Access-Control-Allow-Origin": "*",
        }
    }
}