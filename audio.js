// :: Beat Detect Variables
// how many draw loop frames before the beatCutoff starts to decay
// so that another beat can be triggered.
// frameRate() is usually around 60 frames per second,
// so 20 fps = 3 beats per second, meaning if the song is over 180 BPM,
// we wont respond to every beat.
var beatHoldFrames = 10; //30;

// what amplitude level can trigger a beat?
var beatThreshold = 0.5; //1.75; //0.05; //0.11;

// When we have a beat, beatCutoff will be reset to 1.1*beatThreshold, and then decay
// Level must be greater than beatThreshold and beatCutoff before the next beat can trigger.
var beatCutoff = 0;
var beatDecayRate = 0.95; //0.985; // how fast does beat cutoff decay?
var framesSinceLastBeat = 0; // once this equals beatHoldFrames, beatCutoff starts to decay.

var beatRectSize = 100;
var bAudioTrigger = false;

var audioLevel;
var old_audioLevel;
var volMax = 0.001;
var volNorm = 0;
var volume;
var vol_smoothing = 0.5;
let levelHistory = [];
var millisStart;

var canvas;

var track,
  gUM = c => navigator.mediaDevices.getUserMedia(c);

(async () => {
  spectrum((audio.srcObject = await gUM({ audio: true })));
  track = audio.srcObject.getAudioTracks()[0];
  update();
})().catch(e => log(e));

function log(msg) {
  // divLog.innerHTML += "<br>" + msg;
  // document.getElementById("divLog").innerHTML += "<br>" + msg;
}
//https://glitch.com/edit/#!/join/2a1594f0-19f3-4732-8585-abe2ce18b31a
//for simple example
var audio_echo = document.getElementById("echo");
var audio_noise = document.getElementById("noise");
var audio_gain = document.getElementById("gain");
var audio_mute = document.getElementById("mutedMic");

audio_echo.onclick = function(e) {
  apply({ echoCancellation: audio_echo.checked });
  console.log("audio_echo.onclick " + e);
};
audio_noise.onclick = function(e) {
  apply({ noiseSuppression: audio_noise.checked });
  console.log("audio_noise.onclick " + e);
};
audio_gain.onclick = function(e) {
  apply({ autoGainControl: audio_gain });
  console.log("audio_gain.onclick " + e);
};
audio_mute.onclick = function(e) {
  track.enabled = !audio_mute.checked;
  console.log("audio_mute.onclick " + e);
};

// function update() {
// document.getElementById("mute").checked = !track.enabled;

// }

//  document.getElementById("mute").onclick = e => {
//   track.enabled = !document.getElementById("mute").checked;
// };

function update() {
  //   let set = track.getSettings();
  //   audio_echo = set.echoCancellation;
  //   audio_noise = set.noiseSuppression;
  //   audio_gain = set.autoGainControl;
  //   audio_mute = !track.enabled;
  //   // console.log("audioOutputLevel "+track.audioOutputLevel);
}

// window.echo.onclick = e => apply({ echoCancellation: window.echo.checked });
// window.noise.onclick = e => apply({ noiseSuppression: window.noise.checked });
// window.gain.onclick = e => apply({ autoGainControl: window.gain.checked });
// window.muted.onclick = e => {
//   track.enabled = !window.muted.checked;
// };

async function apply(c) {
  await track.applyConstraints(Object.assign(track.getSettings(), c));
  update();
}

// var audioCtx = new AudioContext();

function updateCanvasSize(w, h) {
  canvas.width = w; //window.innerWidth / 4 - 20;
  canvas.height = h;
}

window.canvas_mousePressed = false;
//window.mouseStartX;
//window.mouseStartY;
window.canvas_mouseMoveX;
window.canvas_mouseMoveY;
//window.mouseChangeX;
//window.mouseChangeY;


var lastTouchMillis;

function spectrum(stream) {
  // var audioCtx = new AudioContext();
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  //   var audioCtx =  new AudioContext // Default
  //     || window.webkitAudioContext // Safari and old versions of Chrome
  //     || false;

  if (audioCtx == false) {
    // Web Audio API is not supported
    // Alert the user
    alert(
      "Sorry, but the Web Audio API is not supported by your browser. Please, consider upgrading to the latest version or downloading Google Chrome or Mozilla Firefox"
    );
  } else {
    var analyser = audioCtx.createAnalyser();
    var source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);

    // var canvas = document.createElement("canvas");
    // var canvas = document.getElementsByClassName('audio_Canvas');
    canvas = document.getElementById("audio_Canvas");
    var canvasCtx = canvas.getContext("2d");

    // register for the mouse events of the document
    canvas.addEventListener("mousedown", function(e) {
      window.canvas_mousePressed = true;
      info_mouse_pressed.innerHTML = "pressed: " + window.canvas_mousePressed;

      lastTouchMillis = Date.now();
    });

    canvas.addEventListener("mouseup", function(e) {
      window.canvas_mousePressed = false;
      info_mouse_pressed.innerHTML = "pressed: " + window.canvas_mousePressed;
    });

    canvas.addEventListener("mousemove", function(e) {
      //  window.mouseChangeX = e.x - window.mouseMoveX;
      //   window.mouseChangeY = e.y - window.mouseMoveY;
      window.canvas_mouseMoveX = e.x;
      window.canvas_mouseMoveY = e.y;

      //  console.log("mouseChangeY "+window.mouseChangeY);
      if(window.canvas_mousePressed == true) lastTouchMillis = Date.now();
      info_mouse_position.innerHTML = "x: " + e.x + " y: " + e.y;
    });

    
    //these need to be inside function spectrum(stream) otherwise body-scroll-lock library blocks canvas touch
    var identifier;
var isTouching = false;
var touchMoveY;

    
    canvas.addEventListener(
      "touchstart",
      function(event) {
        // dismiss after-touches
        if (isTouching == true) {
          return;
        }
        //    event.preventDefault();
        // only care about the first touch
        var touch = event.changedTouches[0];

        //
        lastTouchMillis = Date.now();
        
        identifier = touch.identifier;
        // log('touch START; indentifer ' + touch.identifier);
        window.addEventListener("touchmove", onTouchMove, false);
        window.addEventListener("touchend", onTouchEnd, false);
        window.isTouching = true;

        var out = { x: 0, y: 0 };
        out.x = touch.pageX;
        out.y = touch.pageY;

        console.log(" touch x " + out.x + " y " + out.y);

//         if (out.x < 100 && out.y < 100) {
//           jumpTo(-1);

//           // console.log(" touch in 100x100 ");
//         }

        info_touch_state.innerHTML = "touchstart ";
        // bShowInfo = !bShowInfo;
        // setFullWindow(false);
        // toggleFullWindow();

        // toggleFullScreen();
        // toggleFullWindow();
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

      window.touchMoveY = touch.pageY;
      if (!touch) {
        return;
      }

      lastTouchMillis = Date.now();
      // log('touch move ' + touch.pageX + ' ' + touch.pageY);
      // info_touch_state.innerHTML = "touch moved ";

      info_mouse_position.innerHTML =
        "x: " + touch.pageX + " y: " + touch.pageY;
    }

    function onTouchEnd(event) {
      var touch = getTouch(event);

      touch.preventDefault();

      if (!touch) {
        return;
      }
      //  log('touch _ENDED_ ' + touch.pageX + ' ' + touch.pageY);
      window.removeEventListener("touchmove", onTouchMove, false);
      window.removeEventListener("touchend", onTouchEnd, false);

      info_touch_state.innerHTML = "touchend ";
      window.isTouching = false;
    }

    canvasCtx.font = "30px Arial";

    // canvas.width = 400; //window.player.width; //window.innerWidth / 4 - 20;
    // canvas.height = 320; //window.player.height; //window.innerHeight / 4 - 20;
    canvas.width = window.playerW; //window.innerWidth / 4 - 20;
    canvas.height = window.playerH; //window.innerHeight / 4 - 20;
    // canvas.height = canvas.width * (4/5);
    //  canvas.width = player.width(); //window.innerWidth / 4 - 20;
    // canvas.height = player.height(); //indow.playerH; //window.innerHeight / 4 - 20;

    console.log("canvas.width " + canvas.width);
    // window.audio_Canvas.appendChild(canvas);

    var data = new Uint8Array(400); //canvas.width);
    var mainAlpha = 1;

    setInterval(() => {
      var graph_y = (canvas.height / 4) * 3;

      if (window.canvas_mousePressed == true) {
        //           var rect = document.querySelector('div').getBoundingClientRect(),
        var rect = canvas.getBoundingClientRect();
        //          console.log("rect top "+rect.top + " left "+ rect.left);
        var temp_v = window.canvas_mouseMoveY - rect.top; //-graph_y;
        //          var temp_max = graph_y - rect.top;
        temp_v = ofClamp(temp_v, 0, graph_y);
        //     console.log("temp_v "+temp_v + " mY "+window.canvas_mouseMoveY + " rect.top "+rect.top);

        beatThreshold = mapRange(temp_v, [0, graph_y], [2, 0]);
        // beatThreshold += mouseChangeX;
      } else if (window.isTouching == true) {
        var rect = canvas.getBoundingClientRect();
        var temp_v = window.touchMoveY - rect.top;
        temp_v = ofClamp(temp_v, 0, graph_y);
        beatThreshold = mapRange(temp_v, [0, graph_y], [2, 0]);
        // canvasCtx.fillStyle = "#a0a0a0";
        // canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
        // canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      }
      //---draw FFT bins
      // canvasCtx.fillStyle = "#a0a0a0";
      // canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      canvasCtx.lineWidth = 5;
      canvasCtx.strokeStyle = "rgb(255, 255, 0)";
      // canvasCtx.strokeRect(0, 0, canvas.width, canvas.height);
      canvasCtx.strokeRect(2, 2, canvas.width - 7, canvas.height - 7);
canvasCtx.lineWidth = 2;
      audioLevel = 0;
      var total = 0;
      var sum = 0;
      analyser.getByteFrequencyData(data);
      canvasCtx.lineWidth = 1;

      var dataLength = data.length;
      if (dataLength > 0) {
        // console.log("dataLength "+dataLength);

        if (Date.now() - lastTouchMillis < 5000) {
          mainAlpha += 0.3;
        } else {
          mainAlpha -= 0.1;
        }
        mainAlpha = ofClamp(mainAlpha, 0, 1);

        var bin_w = canvas.width / dataLength;
        var temp_x = 0;
        canvasCtx.fillStyle = "rgb(0,0,0," + 0.5 * mainAlpha + ")";
        data.forEach((y, x) => {
          var yy = y;
          audioLevel += yy / 128;
          total += yy;
          sum += yy * yy;

          y = canvas.height - ((y / 128) * canvas.height) / 4;
          var c = Math.floor((x * 255) / canvas.width);
          //          canvasCtx.fillStyle = "rgb(" + c + ",0," + (255 - x) + ")";
          canvasCtx.fillRect(temp_x, y, bin_w, canvas.height - y);
          temp_x += bin_w;
        });

        //---draw line of all 400 samples
        //       analyser.getByteTimeDomainData(data);
        //       canvasCtx.strokeStyle = "rgb(0, 125, 0)";
        //       canvasCtx.lineWidth = 1;
        //       canvasCtx.beginPath();

        //       data.forEach((y, x) => {
        //         y = canvas.height - ((y / 128) * canvas.height) / 2;
        //         x ? canvasCtx.lineTo(x, y) : canvasCtx.moveTo(x, y);
        //       });
        //       canvasCtx.stroke();

        //---calculate audioLevel line
        // var average = total/ data.length;
        // ... then take the square root of the sum.
        var rms = Math.sqrt(sum / dataLength);
        // volume = Math.max(rms, volume); //*vol_smoothing);
        // console.log("volume "+rms);
        audioLevel = audioLevel / dataLength;

        volMax = Math.max(audioLevel, volMax);

        volNorm = Math.min(1, Math.max(0, audioLevel));
        // volNorm = Math.constrain(audioLevel/volMax, 0, 1);

        // audioLevel = audioLevel / 2;

        vol_smoothing = 0.95; //0.1; //999999;
        var average =
          vol_smoothing * old_audioLevel + (1 - vol_smoothing) * volNorm;

        // average = Math.min(average,4);
        // console.log("average "+average + " raw " + audioLevel + " old " + old_audioLevel);
        detectBeat(average);
        // detectBeat(audioLevel);
        old_audioLevel = volNorm;
        // detectBeat(rms);

        canvasCtx.fillStyle = "white";
        //        canvasCtx.textAlign = "center";
        //        canvasCtx.fillText("average: "+average, 300, 50);
        canvasCtx.fillText(
          "screen: " + window.playerW + " x " + window.playerH,
          300,
          70
        );
        //
        //        canvasCtx.fillRect(25, 25, beatRectSize, beatRectSize);
        // canvasCtx.clearRect(45, 45, 60, 60);
        //        canvasCtx.strokeRect(25, 25, beatRectSize, beatRectSize);

        //        var graph_scaler = 100;
        //---draw audioLevel line

        canvasCtx.strokeStyle = "rgb(255,255,255," + 1 * mainAlpha + ")";
        // "rgb(0, 0, 0)";
        canvasCtx.lineWidth = 1;
        canvasCtx.beginPath();

        // console.log("levelHistory "+levelHistory.length + " [0] " +levelHistory[0].y);

        var step_w = canvas.width / levelHistory.length;
        temp_x = 0;

        for (let i = 1; i < levelHistory.length; i++) {
          //          let y = graph_y - (levelHistory[i].y * graph_scaler);
          let y = mapRange(levelHistory[i].y, [0, 2], [graph_y, 0]);
          // let x = i;
          canvasCtx.lineTo(temp_x, y);
          canvasCtx.moveTo(temp_x, y);
          temp_x += step_w;
        }
        canvasCtx.stroke();

        //---draw beatCutoff line
        canvasCtx.strokeStyle = "rgb(255,255,255," + 0.5 * mainAlpha + ")";
        canvasCtx.beginPath();

        //        let mapped_cutOff = graph_y - (beatCutoff * graph_scaler);
        let mapped_cutOff = mapRange(beatCutoff, [0, 2], [graph_y, 0]);

        // console.log("beatCutoff " + mapped_cutOff);
        canvasCtx.moveTo(0, mapped_cutOff);
        canvasCtx.lineTo(canvas.width, mapped_cutOff);
        // line(0, temp_cutOff, levelHistory.length, temp_cutOff);
        canvasCtx.stroke();

        //---draw beatThreshold line
        canvasCtx.strokeStyle = "rgb(255,255,255," + 1 * mainAlpha + ")";
        canvasCtx.beginPath();

        //        let mapped_beatThres = graph_y - (beatThreshold * graph_scaler);
        let mapped_beatThres = mapRange(beatThreshold, [0, 2], [graph_y, 0]);
        // console.log("mapped_beatThres " + mapped_beatThres);
        canvasCtx.moveTo(0, mapped_beatThres);
        canvasCtx.lineTo(canvas.width, mapped_beatThres);
        canvasCtx.stroke();

        // console.log((1000 * canvas.width) / audioCtx.sampleRate); is equal 2
        var bogus = source; // avoid GC or the whole thing stops
      }
    }, 30); //(1000 * canvas.width) / audioCtx.sampleRate);
  }
}

function detectBeat(level) {
  // console.log("level "+level);

  levelHistory.push({
    y: level
  });

  // console.log("detectBeat() level "+level);

  if (levelHistory.length > 100) levelHistory.shift();

  if (level > beatCutoff && level > beatThreshold) {
    onBeat();
    beatCutoff = level * 1.2;
    framesSinceLastBeat = 0;
  } else {
    if (framesSinceLastBeat <= beatHoldFrames) {
      framesSinceLastBeat++;
    } else {
      beatCutoff *= beatDecayRate;
      beatCutoff = Math.max(beatCutoff, beatThreshold);
    }
  }

  beatRectSize -= 1;
  if (beatRectSize < 50) beatRectSize = 50;
  // line(0, temp_cutOff, levelHistory.length, temp_cutOff);
}

function onBeat() {
  // backgroundColor = color( random(0,255), random(0,255), random(0,255) );
  // rectRotate = !rectRotate;
  beatRectSize = 100;
  bAudioTrigger = true;

  var millisSince = Date.now();
  var millisDiff = millisSince - millisStart;

  console.log("onBeat == true");
  if (millisDiff > 200) jumpTo(-1);

  millisStart = Date.now();
  // onEnd();
}
