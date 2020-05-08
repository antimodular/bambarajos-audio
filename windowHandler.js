window.addEventListener("resize", displayWindowSize);

function displayWindowSize() {
  // Get width and height of the window excluding scrollbars
  var w = document.documentElement.clientWidth;
  var h = document.documentElement.clientHeight;

  // // Display result inside a div element
  // document.getElementById("result").innerHTML =
  //   "Width: " + w + ", " + "Height: " + h;
  console.log("Width: " + w + ", " + "Height: " + h);
  screenWidth = w;
    screenHeight =  h;
        window.playerW = screenWidth; //window.screen.width;
  window.playerH = screenHeight; //window.screen.height;
  
  updateCanvasSize(window.playerW, window.playerH);
}

function toggleFullScreen() {
  console.log("toggleFullScreen()");

  //https://developers.google.com/web/fundamentals/native-hardware/fullscreen
  var doc = window.document;
  var docEl = doc.documentElement;

  var requestFullScreen =
    docEl.requestFullscreen ||
    docEl.mozRequestFullScreen ||
    docEl.webkitRequestFullScreen ||
    docEl.msRequestFullscreen;
  var cancelFullScreen =
    doc.exitFullscreen ||
    doc.mozCancelFullScreen ||
    doc.webkitExitFullscreen ||
    doc.msExitFullscreen;

  if (
    !doc.fullscreenElement &&
    !doc.mozFullScreenElement &&
    !doc.webkitFullscreenElement &&
    !doc.msFullscreenElement
  ) {
    console.log("requestFullScreen.call(docEl)");
    // setFullWindow(true);
    isFullScreen = true;
    hide("info");
    hide("audioInfo");
    //any other function calls should happen before requestFullScreen.call
    requestFullScreen.call(docEl);
  } else {
    isFullScreen = false;
    show("info");
    show("audioInfo");
    
    console.log("cancelFullScreen.call");
    //any other function calls should happen before cancelFullScreen.call
    cancelFullScreen.call(doc);

    // setFullWindow(false);
  }
  
  updateCanvasSize(window.playerW, window.playerH);
}

function setFullScreen(full , _flipWH) {
  console.log("setFullScreen() " + full + " _flipWH "+_flipWH);

  //https://developers.google.com/web/fundamentals/native-hardware/fullscreen
  var doc = window.document;
  var docEl = doc.documentElement;

  var requestFullScreen =
    docEl.requestFullscreen ||
    docEl.mozRequestFullScreen ||
    docEl.webkitRequestFullScreen ||
    docEl.msRequestFullscreen;
  var cancelFullScreen =
    doc.exitFullscreen ||
    doc.mozCancelFullScreen ||
    doc.webkitExitFullscreen ||
    doc.msExitFullscreen;

  
  
  if (full == true) {
    // setFullWindow(true);
    isFullScreen = true;
    hide("info");
    hide("audioInfo");
    
    // screenWidth = window.screen.availWidth;
    // screenHeight = window.screen.availHeight;
    // screenWidth = window.screen.width;
    // screenHeight = window.screen.height;
//      screenWidth = window.screen.width * window.devicePixelRatio;

//  screenHeight = window.screen.height * window.devicePixelRatio;
  //     window.playerW = screenWidth; //window.screen.width;
  // window.playerH = screenHeight; //window.screen.height;
  
    // player.videoWidth(screenWidth);
    // player.height(screenHeight);
      console.log("screenHeight " + screenHeight + " screenWidth "+screenWidth);

//    window.playerW = screenWidth; //window.screen.width;
//   window.playerH = screenHeight; //window.screen.height;
  
//     player.width(screenWidth);
//     player.height(screenHeight);
  
//   updateCanvasSize(window.playerW, window.playerH);
    
    //any other function calls should happen before requestFullScreen.call
    requestFullScreen.call(docEl);
  } else {
    // setFullWindow(false);
    isFullScreen = false;
    show("info");
    show("audioInfo");
    //any other function calls should happen before cancelFullScreen.call
    
      console.log("screenHeight " + screenHeight + " screenWidth "+screenWidth);

 
  
    // player.videoWidth(screenWidth);
    // player.height(screenHeight);
    cancelFullScreen.call(doc);
    
  //    screenWidth =  window.innerWidth;
  // screenHeight = window.innerHeight ;
  //     window.playerW = screenWidth; //window.screen.width;
  // window.playerH = screenHeight; //window.screen.height;
  }

//    screenWidth =
//     window.innerWidth ||
//     document.documentElement.clientWidth ||
//     document.body.clientWidth;

//   screenHeight =
//     window.innerHeight ||
//     document.documentElement.clientHeight ||
//     document.body.clientHeight;
  
 
  
  
  // updateCanvasSize(window.playerW, window.playerH);
 
  //   if (_flipWH == true) {
  //   //swap to numbers
  //   //https://stackoverflow.com/questions/16201656/how-to-swap-two-variables-in-javascript
  //   screenHeight = [screenWidth, (screenWidth = screenHeight)][0];
  // }

}

function toggleFullWindow() {
  isFullScreen = !isFullScreen;
  setFullWindow(isFullScreen);
}

// function setFullWindow2(_fullWindow, _flipWH) {
//   isFullScreen = _fullWindow;
//   // console.log("fullScreen "+fullScreen);
//   // console.log("screen.width "+screen.width + " screen.height "+ screen.height);
//   //   var w = window.innerWidth;
//   // var h = window.innerHeight;

//   screenWidth =
//     window.innerWidth ||
//     document.documentElement.clientWidth ||
//     document.body.clientWidth;

//   screenHeight =
//     window.innerHeight ||
//     document.documentElement.clientHeight ||
//     document.body.clientHeight;

//    window.playerW = screenWidth; //window.screen.width;
//   window.playerH = screenHeight; //window.screen.height;
  
//   if (_flipWH == true) {
//     //swap to numbers
//     //https://stackoverflow.com/questions/16201656/how-to-swap-two-variables-in-javascript
//     screenHeight = [screenWidth, (screenWidth = screenHeight)][0];
//   }

//   //iphone 1472 x 980
//   // bShowInfo = !_fullWindow;
//   if (isFullScreen == true) {
//     // window.playerW = 960; //1920/2; //screenWidth; //window.screen.width;
//     // window.playerH = 540; //1080/2; //screenHeight; //window.screen.height;
//     //  window.playerW = screenWidth; //window.screen.width;
//     // window.playerH = screenHeight; //window.screen.height;
//     hide("info");
//     hide("audioInfo");

//     // player.fluid(true);
//   } else {
//     // window.playerW = 400;
//     // window.playerH = 320;

//     show("info");
//     show("audioInfo");
//     // player.width(400); //80
//     // player.height(320); //64
//     // player.fluid(false);
//     //    player.width(window.playerW);
//     // player.height(window.playerH);
//   }

//   updateCanvasSize(window.playerW, window.playerH);
// }

function setFullWindow(_fullWindow, _flipWH) {
  isFullScreen = _fullWindow;
  // console.log("fullScreen "+fullScreen);
  // console.log("screen.width "+screen.width + " screen.height "+ screen.height);
  //   var w = window.innerWidth;
  // var h = window.innerHeight;

 

  if (_flipWH == true) {
    //swap to numbers
    //https://stackoverflow.com/questions/16201656/how-to-swap-two-variables-in-javascript
    screenHeight = [screenWidth, (screenWidth = screenHeight)][0];
  }

 
  //iphone 1472 x 980
  // bShowInfo = !_fullWindow;
  if (isFullScreen == true) {
    // window.playerW = 960; //1920/2; //screenWidth; //window.screen.width;
    // window.playerH = 540; //1080/2; //screenHeight; //window.screen.height;
    // window.playerW = screenWidth; //window.screen.width;
    // window.playerH = screenHeight; //window.screen.height;
    hide("info");
    hide("audioInfo");

    screenWidth = screen.width;
    screenHeight = screen.height;
    // player.aspectRatio("1:1");  //5:4
    // player.fluid(true); //set to window size
    // player.fluid(true);

  } else {
    // window.playerW = 400;
    // window.playerH = 320;
 screenWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  screenHeight =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;
    
    show("info");
    show("audioInfo");
    // player.width(400); //80
    // player.height(320); //64
    // player.fluid(false);
    //    player.width(window.playerW);
    // player.height(window.playerH);
  }
  // console.log("player.videoWidth() "+player.videoWidth())
  // updateCanvasSize(player.videoWidth(),player.videoHeight());
  
   window.playerW = screenWidth; //window.screen.width;
  window.playerH = screenHeight; //window.screen.height;
  
  updateCanvasSize(window.playerW, window.playerH);
}

function setToWindowSize() {
  screenWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  screenHeight =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;

  window.playerW = screenWidth; //window.screen.width;
  window.playerH = screenHeight; //window.screen.height;

  player.width(window.playerW);
  player.height(window.playerH);

  updateCanvasSize(window.playerW, window.playerH);
}
