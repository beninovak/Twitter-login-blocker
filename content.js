// Image class: css-9pa8cd - all images seem to have this class
// Profile pic: <div class="css-1dbjc4n r-i49rur r-172uzmj r-1pi2tsx r-1ny4l3l r-o7ynqc r-6416eg r-13qz1uu"></div>
// Any image on feed: <img alt="Image" draggable="true" src="https://pbs.twimg.com/media/FOhlsXWUYAAyRBc?format=jpg&name=small" class="css-9pa8cd">
//-------------------------------------------------------------------------------------------------------------------------------------//



// layersNode is the div with id of "layers", which contains all the popups (good and bad ones).
let layersNode;

let nextLayerChildImmune = false;

// The <html> tag
const target = document.documentElement;

// Change the overflow and scrollBehavior back to enable scrolling
const htmlObserver = new MutationObserver(() => {
  target.style.overscrollBehaviorY = "auto";
  target.style.overflow = "visible";
});

// Monitors change of the <div id="layers">'s children.
// A new child gets added when a popup appears (good or bad).
const layersObserver = new MutationObserver((mutation) => {

  // Happens after a 1ms delay so that it doesn't happen-
  // before nextLayerChildImmune is updated in the window "click" EventListener.
  setTimeout(() => {
    if(nextLayerChildImmune) {
      nextLayerChildImmune = false;
 
      // The added child gets a "data-immune" attribute. This is later used in-
      // dontDisplayBadChildren to determine whether or not a child should be hidden.
      mutation[0].addedNodes[0].setAttribute("data-immune", "true");
    }
   
    dontDisplayBadChildren();
  }, 1);
});

// Gets called when "layers" div gets new child
function dontDisplayBadChildren () {

  // Popup class: css-1dbjc4n r-aqfbo4 r-1d2f490 r-12vffkv r-1xcajam r-zchlnj r-ipm5af-
  // every div in the "layers" div has this class.

  // Bottom popup class: css-1dbjc4n r-aqfbo4 r-1p0dtai r-1d2f490 r-12vffkv r-1xcajam r-zchlnj-
  // containts both the "log in/sign up" prompt and the "Enable cookies" prompt.
  const badChildClasses = ["css-1dbjc4n r-aqfbo4 r-1d2f490 r-12vffkv r-1xcajam r-zchlnj r-ipm5af",
  "css-1dbjc4n r-aqfbo4 r-1p0dtai r-1d2f490 r-12vffkv r-1xcajam r-zchlnj"];

  // Changes <html> overflow and scrollBehaviour back to enable scrolling
  target.style.overscrollBehaviorY = "auto";
  target.style.overflow = "visible";

  for(child of layersNode.childNodes) {
    // If a child has the "data-immune" attribute, skip it
    if(child.getAttribute("data-immune") === "true") continue;

    for(badClass of badChildClasses) {
      if(child.className = badClass)
      {
        child.style.display = "none";
      }
    }
  }
}

// Is called when the script loads and looks for the "layers" div.
function lookForLayersNode() {

  // Checks if "layers" div exists every 100ms.
  // This is done because the element might not exist when script loads.
  layersNode = document.getElementById("layers");
  if(!layersNode) {
    setTimeout(lookForLayersNode, 100);
  }
 
  // When "layers" div is found observe it's childList
  else {
    clearTimeout(lookForLayersNode, 100);
    layersObserver.observe(layersNode, {childList: true});
  }
}

// Monitors change of overflow and scrollBehaviour inline styles.
htmlObserver.observe(document.documentElement, {attributes: true, attributeFilter: ["style"]});

// Keeps track of clicks on the page
window.addEventListener("click", (e) => {
  // If user clicked on either the profile picture or any image in the feed, set-
  // nextLayerChildImmune to true. This is used in the layersObserver to give immunity to some elements.
  let element = e.target;
  
  // Profile picture check - only the profile picture has these classes
  if(element.className == "css-1dbjc4n r-i49rur r-172uzmj r-1pi2tsx r-1ny4l3l r-o7ynqc r-6416eg r-13qz1uu") {
    nextLayerChildImmune = true;
  }

  // Check for any image in the feed - they all have the "css-9pa8cd" class
  else if(element.tagName == "IMG" && element.className == "css-9pa8cd") {
    nextLayerChildImmune = true;
  }

  else {
    nextLayerChildImmune = false;
  }
});

lookForLayersNode();