import NavLinkComponent from "/static/js/components/NavLinkComponent.js";
import ModalComponent from "/static/js/components/ModalComponent.js";
import ThemeToggleBtnComponent from "/static/js/components/ThemeToggleBtnComponent.js";
import DropdownComponent from "/static/js/components/DropdownComponent.js";
import NavBarComponent from "/static/js/components/NavBarComponent.js";
import AuthComponent from "/static/js/components/AuthComponent.js";
import ScreenLoader from "/static/js/components/ScreenLoader.js";
import PostCreator from "/static/js/components/PostCreator.js";
import CommentCreator from "/static/js/components/CommentCreator.js";
import DashboardComponent from "/static/js/components/DashboardComponent.js";
import MainLayout from "/static/js/layouts/MainLayout.js";

import {router} from "/static/js/utils/router.js";


export const App = {
        async init(){
            await router();
        }
    }





