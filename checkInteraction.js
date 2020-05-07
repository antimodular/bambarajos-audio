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
    //          var temp_r = Math.random()*jsonData.length;
    //      temp_r = parseInt(temp_r);
    //        console.log('temp_r', temp_r);
    //       display_jsonObj(jsonData[temp_r]);

    player.currentTime((player.currentTime() + 3) % player.duration());
  } else if (e.code === "ArrowLeft") {
    let t = player.currentTime() - 3;
    if (t < 0) {
      t += player.duration();
    }
    player.currentTime(t);
  } else if (e.key === "f") {
    // player.requestFullscreen();
    toggleFullScreen();
  } else if (e.key === "j") {
    // player.play();
    jumpTo(-1);
  } else if (e.key === "n") {
    // player.play();
    jumpTo(vidCounter);
    vidCounter++;
    vidCounter %= 200;
  } else if (e.key === "1") {
    //      var temp_speed = Math.random() * 2 ;
    //      temp_speed = temp_speed - 1;
    console.log("rewind(-1)");
    //      speed = -1;
    //      rewind = true;
    //      player.pause();
    setup_rewind(1);

    //      player.playbackRate(speed);
  } else if (e.key === "2") {
    console.log("rewind(-0.5)");

    //         speed = -0.5;
    //      rewind = true;
    //      player.pause();
    setup_rewind(0.5);
    //      player.playbackRate(speed);
  } else if (e.key === "3") {
    console.log("playbackRate(0.5)");

    speed = 0.5;
    rewinding = false;

    player.playbackRate(speed);
  } else if (e.key === "4") {
    console.log("playbackRate(1)");
    speed = 1;
    rewinding = false;
    player.playbackRate(speed);
  } else if (e.key === "d") {
    toggleFullWindow();
  } else if (e.key === "w") {
    setToWindowSize();
  }
});



//--------mouse or touch events
window.mousePressed = false;
window.mouseStartX;
window.mouseStartY;
window.mouseMoveX;
window.mouseMoveY;
window.mouseChangeX;
window.mouseChangeY;

// register for the mouse events of the document
document.addEventListener("mousedown", function(e) {
  window.mouseStartX = e.x;
  window.mouseStartY = e.y;
  window.mousePressed = true;
});

document.addEventListener("mouseup", function(e) {
  window.mousePressed = false;
});

document.addEventListener("mousemove", function(e) {
  
  window.mouseChangeX = e.x - window.mouseMoveX;
  window.mouseChangeY = e.y - window.mouseMoveY;
  window.mouseMoveX = e.x;
  window.mouseMoveY = e.y;
  
  console.log("mouseChangeY "+window.mouseChangeY);
  
  info_mouse_pressed.innerHTML = "x: " + e.x + " y: " + e.y;
  info_mouse_position.innerHTML = "x: " + e.x + " y: " + e.y;
});

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
var identifier;
var isTouching = false;

window.addEventListener(
  "touchstart",
  function(event) {
    // dismiss after-touches
    if (isTouching == true) {
      return;
    }
    //    event.preventDefault();
    // only care about the first touch
    var touch = event.changedTouches[0];
    identifier = touch.identifier;
    // log('touch START; indentifer ' + touch.identifier);
    window.addEventListener("touchmove", onTouchMove, false);
    window.addEventListener("touchend", onTouchEnd, false);
    isTouching = true;

    var out = { x: 0, y: 0 };
    out.x = touch.pageX;
    out.y = touch.pageY;

    console.log(" touch x " + out.x + " y " + out.y);

    if (out.x < 200 && out.y < 200) {
      jumpTo(-1);

      console.log(" touch in 100x100 ");
    }

    info_touch_state.innerHTML = "touchstart ";
    // bShowInfo = !bShowInfo;
    // setFullWindow(false);
    // toggleFullWindow();
    
    // toggleFullScreen();
    toggleFullWindow();
  },
  false
);

function getTouch(event) {
  // cycle through every change touch and get one that matches
  for (var i = 0, len = event.changedTouches.length; i < len; i++) {
    var touch = event.changedTouches[i];
    if (touch.identifier === identifier) {
      return touch;
    }
  }
}

function onTouchMove(event) {
  var touch = getTouch(event);
  if (!touch) {
    return;
  }
  // log('touch move ' + touch.pageX + ' ' + touch.pageY);
  info_touch_state.innerHTML = "touch moved ";
}

function onTouchEnd(event) {
  var touch = getTouch(event);
  if (!touch) {
    return;
  }
  //  log('touch _ENDED_ ' + touch.pageX + ' ' + touch.pageY);
  window.removeEventListener("touchmove", onTouchMove, false);
  window.removeEventListener("touchend", onTouchEnd, false);

  info_touch_state.innerHTML = "touchend ";
  isTouching = false;
}

//https://stackoverflow.com/questions/5298467/prevent-orientation-change-in-ios-safari
//important to call any function before setting document.getElementById('orient').className = 
window.addEventListener('orientationchange', function () {
    if (window.orientation == -90) {
         setFullWindow(true, true);
      // setToWindowSize();
      // jumpTo(1);
      
        document.getElementById('orient').className = 'orientright';
      // 
   
    }
    if (window.orientation == 90) {
         setFullWindow(true, true);
      // setToWindowSize();
      // jumpTo(10);
        document.getElementById('orient').className = 'orientleft';
      // setToWindowSize();
   
    }
    if (window.orientation == 0) {
       setFullWindow(false, false);
       // jumpTo(20);
        document.getElementById('orient').className = '';
     
     
    }
}, true);