class ThemesMenu extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.initializeComponent();
        this.loadTheme(); // Load the theme when the component is connected
    }

    initializeComponent() {
        this.addStyle();
        this.render();
        this.attachEvents();
    }

    getCss() {
        return /*css*/`
        *{
            padding: 0;
            margin: 0;
            box-sizing: border-box;
        }
        .themes-menu {
            position: relative;
            background-color: rgb(var(--clr-secondary-background));
            border-radius: var(--br);
            transform:translateY(5px)
        }

        .themes-menu h2 {
            margin-bottom: 1rem;
            padding: 1rem;
            cursor: pointer;
            user-select: none
        }

        .themes-menu h2:hover{
            background-color: rgb(var(--clr-hover));
        }

        .themes-menu ul {
            position: absolute;
            background-color: rgb(var(--clr-secondary-background));
            font-size: 1.2rem;
            width: 100%;
            list-style-type: none;
            box-shadow: 0 0 10px rgba(0,0,0, .5);
        }

        .themes-menu li {
            cursor: pointer;
            padding: 0.5rem;
            margin: 0.5rem 0;
            border-radius: var(--br);
            transition: background-color 0.3s;
        }

        .themes-menu li:hover {
            background-color: rgba(0, 0, 0, 0.1);
        }

        .themes-menu li.active {
            font-weight: bold; /* Indicate selected theme */
        }
        .hidden{
            display:none;
        }
        `;
    }

    addStyle() {
        const style = document.createElement("style");
        style.textContent = this.getCss().trim();
        this.shadow.appendChild(style);
    }

    getHTMLTemplate() {
        return /*html*/`
        <div class="themes-menu">
            <h2 id="menu-toggler">Select a Theme</h2>
            <ul class="hidden">
                <li data-theme="light">Light</li>
                <li data-theme="dark">Dark</li>
                <li data-theme="dracula">Dracula</li>
                <!-- Add more themes as needed -->
            </ul>
        </div>
        `;
    }

    render() {
        const template = document.createElement("template");
        template.innerHTML = this.getHTMLTemplate().trim();
        this.shadow.appendChild(template.content.cloneNode(true));
    }

    attachEvents() {
        const menuToggler = this.shadow.querySelector("#menu-toggler");
        menuToggler?.addEventListener("click", this.toggleMenu.bind(this));
        const themeItems = this.shadowRoot.querySelectorAll('li[data-theme]');
        themeItems.forEach(item => {
            item.addEventListener('click', () => this.selectTheme(item));
        });
    }

    toggleMenu(){
        const ul = this.shadow.querySelector("ul");
        ul.classList.toggle("hidden");
    }

    selectTheme(selectedItem) {
        const selectedTheme = selectedItem.getAttribute('data-theme');

        // Remove previously selected theme classes
        document.body.classList.remove('light', 'dark', 'dracula');

        // Add the selected theme class
        document.body.classList.add(selectedTheme);

        // Save the selected theme in localStorage
        localStorage.setItem('selectedTheme', selectedTheme);

        // Update the active class in the menu
        this.updateActiveItem(selectedItem);

        this.shadow.querySelector("ul").classList.add("hidden");
    }

    updateActiveItem(selectedItem) {
        const themeItems = this.shadowRoot.querySelectorAll('li');
        themeItems.forEach(item => item.classList.remove('active'));
        selectedItem.classList.add('active');
    }

    loadTheme() {
        // Load the selected theme from localStorage
        const selectedTheme = localStorage.getItem('selectedTheme');

        if (selectedTheme) {
            // Remove previously selected theme classes
            document.body.classList.remove('light', 'dark', 'dracula');

            // Add the loaded theme class
            document.body.classList.add(selectedTheme);

            // Set the active item in the menu
            const activeItem = this.shadowRoot.querySelector(`li[data-theme="${selectedTheme}"]`);
            if (activeItem) {
                this.updateActiveItem(activeItem);
            }
        }
    }
}

export default ThemesMenu;
window.customElements.define("themes-menu", ThemesMenu);


// class ThemesMenu extends HTMLElement {
//     constructor() {
//         super();
//         this.shadow = this.attachShadow({ mode: "open" });
//     }

//     connectedCallback() {
//         this.initializeComponent();
//     }

//     initializeComponent() {
//         this.addStyle();
//         this.render();
//         this.attachEvents();
//     }


//     getCss() {
//         return /*css*/`
//         .themes-menu {
//             position: absolute;
//             top: 0;
//             left: 30%;
//             background-color: rgb(var(--clr-secondary-background));
//             padding: 1rem;
//             border-radius: var(--br);
//           }
          
//           .themes-menu h2 {
//             margin-bottom: 1rem;
//           }
          
//           .themes-menu ul {
//             list-style-type: none;
//             padding: 0;
//           }
          
//           .themes-menu li {
//             cursor: pointer;
//             padding: 0.5rem;
//             margin: 0.5rem 0;
//             border-radius: var(--br);
//             transition: background-color 0.3s;
//           }
          
//           .themes-menu li:hover {
//             background-color: rgba(0, 0, 0, 0.1);
//           }
          
//           .themes-menu li.active {
//             font-weight: bold; /* Indicate selected theme */
//           }
          
//         `
//     }

//     addStyle() {
//         const style = document.createElement("style");
//         style.textContent = this.getCss().trim();
//         this.shadow.appendChild(style);
//     }

//     getHTMLTemplate() {
//         return /*html*/`
//         <div class="themes-menu">
//             <h2>Select a Theme</h2>
//             <ul>
//                 <li data-theme="light">Light</li>
//                 <li data-theme="dark">Dark</li>
//                 <li data-theme="dracula">Dracula</li>
//                 <!-- Add more themes as needed -->
//             </ul>
//         </div>
//         `
//     }

//     render() {
//         const template = document.createElement("template");
//         template.innerHTML = this.getHTMLTemplate().trim();
//         this.shadow.appendChild(template.content.cloneNode(true));
//     }

//     attachEvents() {
//         const themeItems = this.shadowRoot.querySelectorAll('li[data-theme]');
//         themeItems.forEach(item => {
//             item.addEventListener('click', () => this.selectTheme(item));
//         });
//     }

//     selectTheme(selectedItem) {
//         const selectedTheme = selectedItem.getAttribute('data-theme');

//         // Remove previously selected theme classes
//         document.body.classList.remove('light', 'dark', 'dracula');

//         console.log(selectedTheme)

//         // Add the selected theme class
//         document.body.classList.add(selectedTheme);

//         // Update the active class in the menu
//         this.updateActiveItem(selectedItem);
//     }

//     updateActiveItem(selectedItem) {
//         const themeItems = this.shadowRoot.querySelectorAll('li');
//         themeItems.forEach(item => item.classList.remove('active'));
//         selectedItem.classList.add('active');
//     }
// }

// export default ThemesMenu;
// window.customElements.define("themes-menu", ThemesMenu);