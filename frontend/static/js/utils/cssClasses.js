export const reset = `        
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }`;

export const backdrop = `
    .backdrop {
        position: fixed;
        inset: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.9);
        z-index: 99999;
    }`;

export const flex = `
    .flex{
        display: flex;
    }
    .flex-col{
        flex-direction: column;
    }
    .flex-center{
        align-items: center;
        justify-content: center;
    }
    .justify-content-center{
        justify-content: center;
    }
    .justify-content-between{
        justify-content: space-between;
    }
    .justify-content-start {
        justify-content: start;
    }
    .justify-content-end {
        justify-content: end;
    }
    .align-items-center{
        align-items: center;
    }
    .gap{
        gap: 1.5rem;
    }
    `

export const card = `  
  .card {
      width: 680px;
      background-color: rgb(var(--clr-bg-secondary));
      color: rgb(var(--clr-text-primary));
      border-radius: var(--br);
    }`;

export const grid = `  
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

export const niceScrollbar = `
    .niceScrollbar{
        scroll-behavior: smooth;
        scrollbar-width: thin;
        scrollbar-color: rgb(var(--clr-text-secondary)) rgb(var(--clr-bg-secondary));
    }`