const globalStyles = /*css*/`
* {
margin: 0;
padding: 0;
box-sizing: border-box;
}

.position-relative{
position: relative;
}

.p-2{
padding: 2rem;
}

.pb-2{
padding-block: 2rem;
}

.padding-view{
padding-top: calc(var(--nav-h) + 4rem);
}

.container{
display: block;
width: 100%;
height: 100%;
}

.ml-1{
margin-left: 1rem;
}

.mb-1 {
margin-bottom: 1rem;
} 

.d-none{
display: none;
}

.br{
  border-radius: var(--br);
}
`;

const basicFlex = /*css*/`
.flex
{
display: flex;
}
.flex-col
{
flex-direction: column;
}
.flex-center
{
justify-content: center;
align-items: center;
}
.flex-nowrap
{
flex-wrap: nowrap;
}
.gap
{
gap: 1rem;
}
`;

const advancedFlex = basicFlex.concat(`
.justify-content-center {
justify-content: center;
}  
.justify-content-between {
justify-content: space-between;
}
.justify-content-end {
justify-content: end;
}
.align-items-center {
align-items: center;
}
.align-items-start{
align-items: start;
}
.align-items-end{
align-items: end;
}
`);

const basicGrid = /*css*/`
.grid {
display: grid;
gap: 1rem;
}
.col-3 {
grid-template-columns: repeat(3, 1fr);
}
.col-3-custom {
grid-template-columns: 45px 1fr 45px;
}
`;

const modal = /*css*/`
.backdrop{
position: fixed;
inset: 0 0 0 0;
height: 100vh;
width: 100vw;
background-color: rgba(0,0,0, 0.9);
z-index: 99999;
}
`;

const colors = `
.action{
background-color: rgb(var(--clr-action-bg));
color: rgb(var(--clr-action-text));
}

.action:hover{
background-color: rgb(var(--clr-action-hover-bg));
color: rgb(var(--clr-action-hover-text));
}

.action:disabled{
background-color: rgb(var(--clr-disabled-bg)); 
color: rgb(var(--clr-disabled-text));
}

.active{
background-color: rgb(var(--clr-active-bg)); 
color: rgb(var(--clr-active-text));
}

.active:hover{
background-color: rgb(var(--clr-active-hover-bg)); 
color: rgb(var(--clr-active-hover-text));
}

.inactive{
background-color: rgb(var(--clr-inactive-bg)); 
color: rgb(var(--clr-inactive-text));
}

.inactive:hover{
background-color: rgb(var(--clr-inactive-hover-bg)); 
color: rgb(var(--clr-inactive-hover-text));
}
`

const buttons = /*css*/`
.btn{
border: none;
font-weight: 600;
cursor: pointer;
transition: all .3s;
}

.close-btn {
mask-image: url("/static/assets/images/close-button.svg");
mask-position: center;
mask-repeat: no-repeat;
position: absolute;
top: 1.25rem;
right: 1.5rem;
height: 2.5rem;
width: 2.5rem;
}
.upload-btn{
margin-top: 1rem;
padding: 1.25rem;
height: 1.25rem;
width: 1rem;
mask-image: url("/static/assets/images/img.svg");
-webkit-mask-image: url("/static/assets/images/img.svg");
mask-position: center;
mask-size: cover;
background-color: rgb(var(--clr-inactive-bg)); /* Accent color for upload button */
cursor: pointer;
}
.submit-btn{
padding: 1rem;
font-size: 1.6rem;
font-weight: 600;  
border: 0;
background-color: rgb(var(--clr-action-bg)); /* Submit button background */
color: rgb(var(--clr-action-text)); /* Submit button text */
border-radius: var(--br);
cursor: pointer;
transition: background-color .3s;
}

.submit-btn:hover{
background-color: rgb(var(--clr-submit-hover-bg)); /* Hover state */
color: rgb(var(--clr-submit-hover-text)); /* Hover text color */
}

.submit-btn:disabled{
background-color: rgb(var(--clr-disabled-bg)); /* Disabled button */
color: rgb(var(--clr-disabled-text));
}

.delete-btn{
background-color: rgb(var(--clr-danger)); /* Danger background */
mask-image: url("/static/assets/images/trash.svg");
mask-position: center;
mask-size: cover;
}

.btn-sm{
height: 16px;
width: 16px;
}

.floating-btn{
position: absolute;
top: 0;
right: 0; 
}

.delete-btn:hover{
background-color: rgb(var(--clr-danger-alert)); /* Hover state for delete */
transform: scale(1.15);
}
`;

const error = /*css*/`
.error-message{
position: absolute;
top: 1rem;
left: 1rem;
font-size: 1.5rem;
font-weight: 600;
width: 100%;
}
.text-danger{
color: rgb(var(--clr-danger)) !important;
}
`

const card = /*css*/`
.card {
width: 680px;
background-color: rgb(var(--clr-bg-secondary));
color: rgb(var(--clr-text-primary));
border-radius: var(--br);
box-shadow: var(--shadow-sm);
overflow: hidden;
}
`

// A dictionary holding different style levels
const styleLevels = {
  "global": globalStyles,  // Global styles
  "basicFlex": basicFlex,
  "advancedFlex": advancedFlex,
  "basicGrid": basicGrid,
  "shared": "",            // Shared styles
  "module": "",            // Module-specific styles
  "component": "",         // Component-specific styles
  "instance": "",          // Instance-specific styles
  "variant": "",            // Variant styles
  "modal": modal,
  "buttons": buttons,
  "card": card,
  "error": error
};

// Enhanced StyleBuilder class
class StyleBuilder {
  constructor() {
    this.styles = '';
  }

  // Add a style level (e.g., 'global', 'shared')
  add(level) {
    if (styleLevels[level]) {
      this.styles += styleLevels[level];
    } else {
      console.warn(`Style level '${level}' s not found.`);
    }
  }

  // Build the final style block
  build() {
    return this.styles ? `<style>${this.styles}</style>` : '';
  }
}

// Main function to get styles
export default function getStyles(levels = []) {
  if (levels.length === 0) return '';

  const styleBuilder = new StyleBuilder();

  levels.forEach(level => styleBuilder.add(level));

  return styleBuilder.build();
}
