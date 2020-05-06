// :: Beat Detect Variables
// how many draw loop frames before the beatCutoff starts to decay
// so that another beat can be triggered.
// frameRate() is usually around 60 frames per second,
// so 20 fps = 3 beats per second, meaning if the song is over 180 BPM,
// we wont respond to every beat.
var beatHoldFrames = 10; //30;

// what amplitude level can trigger a beat?
var beatThreshold = 0.25; //0.05; //0.11;

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

var track,
  gUM = c => navigator.mediaDevices.getUserMedia(c);

(async () => {
  spectrum((audio.srcObject = await gUM({ audio: true })));
  track = audio.srcObject.getAudioTracks()[0];
  update();
})().catch(e => log(e));

function log(msg) {
  divLog.innerHTML += "<br>" + msg;
}

function update() {
  let set = track.getSettings();
  echo.checked = set.echoCancellation;
  noise.checked = set.noiseSuppression;
  gain.checked = set.autoGainControl;
  muted.checked = !track.enabled;
  // console.log("audioOutputLevel "+track.audioOutputLevel);
}

echo.onclick = e => apply({ echoCancellation: echo.checked });
noise.onclick = e => apply({ noiseSuppression: noise.checked });
gain.onclick = e => apply({ autoGainControl: gain.checked });
muted.onclick = e => {
  track.enabled = !muted.checked;
};

async function apply(c) {
  await track.applyConstraints(Object.assign(track.getSettings(), c));
  update();
}

// var audioCtx = new AudioContext();

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

    var canvas = document.createElement("canvas");
    var canvasCtx = canvas.getContext("2d");
    canvas.width = window.innerWidth / 4 - 20;
    canvas.height = window.innerHeight / 4 - 20;
    audio_Canvas.appendChild(canvas);

    var data = new Uint8Array(400); //canvas.width);

    setInterval(() => {
      //---draw FFT bins
      canvasCtx.fillStyle = "#a0a0a0";
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
      audioLevel = 0;
      var total = 0;
      var sum = 0;
      analyser.getByteFrequencyData(data);
      canvasCtx.lineWidth = 1;

      data.forEach((y, x) => {
        var yy = y;
        audioLevel += yy / 128;
        total += yy;
        sum += yy * yy;

        y = canvas.height - ((y / 128) * canvas.height) / 4;
        var c = Math.floor((x * 255) / canvas.width);
        canvasCtx.fillStyle = "rgb(" + c + ",0," + (255 - x) + ")";
        canvasCtx.fillRect(x, y, 2, canvas.height - y);
      });

      //---draw line?
      analyser.getByteTimeDomainData(data);
      canvasCtx.strokeStyle = "rgb(0, 125, 0)";
      canvasCtx.lineWidth = 1;
      canvasCtx.beginPath();

      data.forEach((y, x) => {
        y = canvas.height - ((y / 128) * canvas.height) / 2;
        x ? canvasCtx.lineTo(x, y) : canvasCtx.moveTo(x, y);
      });
      canvasCtx.stroke();

      //---calculate audioLevel line
       // var average = total/ data.length;
          // ... then take the square root of the sum.
    var rms = Math.sqrt(sum / data.length);
      // volume = Math.max(rms, volume); //*vol_smoothing);
      // console.log("volume "+rms);
        audioLevel = audioLevel / data.length;
      
      volMax = Math.max(audioLevel,volMax);
  
      volNorm= Math.min(1, Math.max(0, audioLevel));
      // volNorm = Math.constrain(audioLevel/volMax, 0, 1);
      
  
      // audioLevel = audioLevel / 2;
      
vol_smoothing = 0.95; //0.1; //999999;
      var  average = (vol_smoothing * old_audioLevel) + ((1 - vol_smoothing) * volNorm);
      
      // console.log("average "+average + " raw " + audioLevel + " old " + old_audioLevel);
  detectBeat(average);
      // detectBeat(audioLevel);
      old_audioLevel = volNorm;
      // detectBeat(rms);

      //
      canvasCtx.fillRect(25, 25, beatRectSize, beatRectSize);
      // canvasCtx.clearRect(45, 45, 60, 60);
      canvasCtx.strokeRect(25, 25, beatRectSize, beatRectSize);
      
var graph_scaler = 100;
      //---draw audioLevel line
      var graph_y = canvas.height /4 * 3;
      canvasCtx.strokeStyle = "rgb(0, 0, 0)";
      canvasCtx.lineWidth = 1;
      canvasCtx.beginPath();

      // console.log("levelHistory "+levelHistory.length + " [0] " +levelHistory[0].y);

      for (let i = 1; i < levelHistory.length; i++) {
        let y = graph_y - levelHistory[i].y * graph_scaler;
        let x = i;
        canvasCtx.lineTo(x, y);
        canvasCtx.moveTo(x, y);
      }
      canvasCtx.stroke();

      //---draw beatCutoff line
      canvasCtx.strokeStyle = "rgb(255,255,255)";
      canvasCtx.beginPath();

      let mapped_cutOff = graph_y - beatCutoff * graph_scaler;
      // console.log("beatCutoff " + mapped_cutOff);
      canvasCtx.moveTo(0, mapped_cutOff);
      canvasCtx.lineTo(canvas.width, mapped_cutOff);
      // line(0, temp_cutOff, levelHistory.length, temp_cutOff);
      canvasCtx.stroke();

      //---draw beatThreshold line
      canvasCtx.strokeStyle = "rgb(100,100,100)";
      canvasCtx.beginPath();

      let mapped_beatThres = graph_y - beatThreshold * graph_scaler;
      // console.log("mapped_beatThres " + mapped_beatThres);
      canvasCtx.moveTo(0, mapped_beatThres);
      canvasCtx.lineTo(canvas.width, mapped_beatThres);
      canvasCtx.stroke();
// console.log((1000 * canvas.width) / audioCtx.sampleRate); is equal 2
      var bogus = source; // avoid GC or the whole thing stops
    }, 30); //(1000 * canvas.width) / audioCtx.sampleRate);
  }
}



function detectBeat(level) {
  // console.log("level "+level);

  levelHistory.push({
    y: level
  });

  // console.log("level "+level);

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
  
  if(millisDiff > 200) jumpTo(-1);
  console.log("onBeat == true");
  millisStart = Date.now();
  // onEnd();
}
