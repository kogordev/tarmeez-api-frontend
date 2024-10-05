export async function loader(
    callback,
    timeoutCallback = () => {},
    elemToShowIn = document.body,
    showDelay = 50,
    hideDelay = 150,
    hideTransitionDuration = 300 // New parameter for hide transition duration
  ) {
    // Create a new screen loader element and attach it to the DOM
    const screenLoader = document.createElement("screen-loader");
    elemToShowIn.appendChild(screenLoader);
    screenLoader.show();
  
    try {
      // Smoothly delay before calling the main callback
      await new Promise((res) => setTimeout(res, showDelay));
      await callback();
  
      // Optional timeout callback (e.g., for showing hidden content)
      await new Promise((res) => setTimeout(res, hideDelay));
      timeoutCallback();
  
      // Smoothly hide the loader and wait for the CSS transition to complete
      screenLoader.hide();
      await new Promise((res) => setTimeout(res, hideTransitionDuration));
    } catch (error) {
      console.error("An error occurred during the loading process:", error);
    } finally {
      // Ensure the loader is always removed after the transition ends
      screenLoader.remove();
    }
  }
  