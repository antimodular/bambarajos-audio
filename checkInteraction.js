//--------key events

document.addEventListener("keyup", function(e) {
  //uncommnet the following line so the pressed key info is printed to the console and you can see which is its code or key value if you want to add more behaviors.
  console.log("key event " + e);

  if (e.code === "Space") {
    if (player.paused()) {
      player.play();
    } else {
      player.pause();
    }
  }
  if (e.code === "ArrowRight") {
//     //          var temp_r = Math.random()*jsonData.length;
//     //      temp_r = parseInt(temp_r);
//     //        console.log('temp_r', temp_r);
//     //       display_jsonObj(jsonData[temp_r]);

//     player.currentTime((player.currentTime() + 3) % player.duration());
  } else if (e.code === "ArrowLeft") {
    // let t = player.currentTime() - 3;
    // if (t < 0) {
    //   t += player.duration();
    // }
    // player.currentTime(t);
  } else if (e.key === "d") {
    // toggleFullWindow();
  } else if (e.key === "w") {
    // setToWindowSize();
  } else if (e.key === "f") {
    // player.requestFullscreen();
    // toggleFullScreen();
     setFullScreen(!document.fullscreen);
  } else if (e.key === "[") {
    window.orientationMillis = Date.now();
    setFullScreen(true);
  } else if (e.key === "]") {
    window.orientationMillis = Date.now();
    setFullScreen(false);
  } else if (e.key === "g") {
    // bShowGui;
  }
});

//--------mouse or touch events
//window.mousePressed = false;
//window.mouseStartX;
//window.mouseStartY;
//window.mouseMoveX;
//window.mouseMoveY;
//window.mouseChangeX;
//window.mouseChangeY;
//
//// register for the mouse events of the document
//document.addEventListener("mousedown", function(e) {
//  window.mouseStartX = e.x;
//  window.mouseStartY = e.y;
//  window.mousePressed = true;
//    info_mouse_pressed.innerHTML = "pressed: " + window.mousePressed;
//});
//
//document.addEventListener("mouseup", function(e) {
//  window.mousePressed = false;
//     info_mouse_pressed.innerHTML = "pressed: " + window.mousePressed;
//});
//
//document.addEventListener("mousemove", function(e) {
//
//  window.mouseChangeX = e.x - window.mouseMoveX;
//  window.mouseChangeY = e.y - window.mouseMoveY;
//  window.mouseMoveX = e.x;
//  window.mouseMoveY = e.y;
//
////  console.log("mouseChangeY "+window.mouseChangeY);
//
//  info_mouse_position.innerHTML = "x: " + e.x + " y: " + e.y;
//
//});

//click event happens when the mouse is pressed and released over the same element. In this case, as we are using the "document" it will always trigger
document.addEventListener("click", function(e) {
  info_mouse_clicked_position.innerHTML = "x: " + e.x + " y: " + e.y;
  // toggleFullScreen();
});

//----touch screen interaction via touch-------
/*
var pre = document.querySelector('pre');
function log( message ) {
  pre.innerText = message;
}
 */

//https://bodyscrolllock.now.sh/
//https://github.com/willmcpo/body-scroll-lock#readme
const targetElement = document.querySelector("body");
bodyScrollLock.disableBodyScroll(targetElement);

// const targetElement2 = document.querySelector('audio_Canvas');
// bodyScrollLock.enableBodyScroll(targetElement2);
// const targetElement3 = document.querySelector('audio_Canvas');
// 2. ...in some event handler after showing the target element...disable body scroll
// bodyScrollLock.disableBodyScroll(targetElement, {
//   allowTouchMove: el => el.document.getElementById("audio_Canvas").tagName === 'audio_Canvas',
// });

// bodyScrollLock.disableBodyScroll(targetElement, {
//   allowTouchMove: el => el.tagName === 'audio_Canvas',
// });

// bodyScrollLock.disableBodyScroll(targetElement, {
//   allowTouchMove: el => {
//     while (el && el !== document.body) {
//       if (el.getAttribute('body-scroll-lock-ignore') !== null) {
//         return true;
//       }

//       el = el.parentNode;
//     }
//   },
// });

// var identifier;
// window.isTouching = false;
// window.touchMoveY;

// disableBodyScroll(container, {
//   allowTouchMove: el => el.tagName === 'TEXTAREA',
// });

// 3. ...in some event handler after hiding the target element...
// bodyScrollLock.enableBodyScroll(targetElement2);
// bodyScrollLock.disableBodyScroll(targetElement2);
// bodyScrollLock.enableBodyScroll(targetElement3);

// window.addEventListener(
//   "touchstart",
//   function(event) {
//     // dismiss after-touches
//     if (window.isTouching == true) {
//       return;
//     }
//     //    event.preventDefault();
//     // only care about the first touch
//     var touch = event.changedTouches[0];

//     //

//     identifier = touch.identifier;
//     // log('touch START; indentifer ' + touch.identifier);
//     window.addEventListener("touchmove", onTouchMove, false);
//     window.addEventListener("touchend", onTouchEnd, false);
//     window.isTouching = true;

//     var out = { x: 0, y: 0 };
//     out.x = touch.pageX;
//     out.y = touch.pageY;

//     console.log(" touch x " + out.x + " y " + out.y);

//     if (out.x < 100 && out.y < 100) {
//       jumpTo(-1);

//       // console.log(" touch in 100x100 ");
//     }

//     info_touch_state.innerHTML = "touchstart ";
//     // bShowInfo = !bShowInfo;
//     // setFullWindow(false);
//     // toggleFullWindow();

//     // toggleFullScreen();
//     // toggleFullWindow();
//   },
//   false
// );

// function getTouch(event) {
//   // cycle through every change touch and get one that matches
//   for (var i = 0, len = event.changedTouches.length; i < len; i++) {
//     var touch = event.changedTouches[i];
//     if (touch.identifier === identifier) {
//       return touch;
//     }
//   }
// }

// function onTouchMove(event) {
//   var touch = getTouch(event);

//  window.touchMoveY = touch.pageY;
//   if (!touch) {
//     return;
//   }

//   // log('touch move ' + touch.pageX + ' ' + touch.pageY);
//   // info_touch_state.innerHTML = "touch moved ";

//   info_mouse_position.innerHTML = "x: " + touch.pageX + " y: " + touch.pageY;
// }

// function onTouchEnd(event) {

//   var touch = getTouch(event);

//    touch.preventDefault();

//   if (!touch) {
//     return;
//   }
//   //  log('touch _ENDED_ ' + touch.pageX + ' ' + touch.pageY);
//   window.removeEventListener("touchmove", onTouchMove, false);
//   window.removeEventListener("touchend", onTouchEnd, false);

//   info_touch_state.innerHTML = "touchend ";
//   window.isTouching = false;
// }

window.orientationMillis;
//https://stackoverflow.com/questions/5298467/prevent-orientation-change-in-ios-safari
//important to call any function before setting document.getElementById('orient').className =
window.addEventListener(
  "orientationchange",
  function() {
    if (window.orientation == -90) {
      deviceOrientation = -90;
      // setFullWindow(true, true);
      // toggleFullScreen();
      setFullScreen(true);
      // displayWindowSize();
      setToWindowSize();
      // jumpTo(1);
      window.orientationMillis = Date.now();
      // document.getElementById('orient').className = 'orientright';
      //
      // element.style.webkitTransform = "rotate(-90deg) translateX(600px) translateY(160px)"

      var element = document.getElementById("audio_Canvas");
      element.style.webkitTransform =
        "translateX(160px) translateY(160px) rotate(90eg)"; //for safari and chrome
      element.style.MozTransform =
        "translateX(160px) translateY(160px) rotate(90deg)"; //for firefox
    }
    if (window.orientation == 90) {
      deviceOrientation = 90;
      // toggleFullScreen();
      setFullScreen(true);
      // displayWindowSize();
      // setFullWindow(true, true);
      setToWindowSize();
      window.orientationMillis = Date.now();

      var element = document.getElementById("audio_Canvas");
      element.style.webkitTransform =
        "translateX(230px) translateY(230px) rotate(-90eg)"; //for safari and chrome
      element.style.MozTransform =
        "translateX(230px) translateY(230px) rotate(-90deg)"; //for firefox

      // jumpTo(10);
      // document.getElementById('orient').className = 'orientleft';
      // setToWindowSize();
    }
    if (window.orientation == 0) {
      deviceOrientation = 0;
      // setFullWindow(false, false);
      setFullScreen(false);
      // jumpTo(20);
      // document.getElementById('orient').className = '';
      console.log("window.orientation == 0");
      window.orientationMillis = Date.now();
    }
  },
  true
);
