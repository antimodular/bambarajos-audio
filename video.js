// the first argument corresponds to the id of the video tag in the html file

//change buffer amounts 
//https://github.com/videojs/videojs-contrib-hls/issues/1302

var version = "v12";

var player = videojs("vid", {});

//https://stackoverflow.com/questions/3437786/get-the-size-of-the-screen-current-web-page-and-browser-window
var screenWidth = window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;

var screenHeight = window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight;


 // window.playerW = screenWidth; //window.screen.width; //400;
 // window.playerH = screenHeight; //window.screen.height; //320;

window.playerW = 400;
window.playerH = 320;

var json_src = "l-001-200_047.json";
// var vid_src = "l-001-200_047.mp4";
var vid_src = "https://cdn.glitch.com/b1e475c8-3489-4513-8664-2d0f29f610de%2Fl-001-200_047.mp4?v=1588351308938";
// var vid_src = "https://stephanschulz.ca/bamba/l-001-200_047.mp4";
var millisStart;

var vidCounter = 0;
var jumpCounter = 0;

var new_startTime = 0;
var new_endTime = 10;
var new_duration = 0;
var startOffsetTime = 0.05; //0.3; //in order to not start right at start time but a bit later
var endOffsetTime = 0.2;
var new_eye_contact = 0;

//var rewind = false;
var speed = 1;
var loopDirection = 1;

// var bShowInfo = false; //true;
var isFullScreen = true;

var playSpeed = 1; //0.5;

//player.src([{src:'//vjs.zencdn.net/v/oceans.mp4',type:'video/mp4'},
//            {src:'//vjs.zencdn.net/v/oceans.webm',type:'video/webm'},
//            {src:'//vjs.zencdn.net/v/oceans.ogv',type:'video/ogg'}
//            ]);
//player.poster('//vjs.zencdn.net/v/oceans.png');
//player.src([{src:'https://stephanschulz.ca/bamba/l-001-20min_h264.mp4',type:'video/mp4'}
//            ]);

//var URL = window.URL || window.webkitURL;
//var src_url = URL.createObjectURL(vid_src);
player.src([
  { src: vid_src, type: "video/mp4" }
  //            ]);

  //player.src([{src:src_url,type:'video/mp4'}
  //            ]);

  //player.src([{src:src_url,type: blob.type}
]);

player.poster("https://stephanschulz.ca/bamba/l-001-20min_h264.png");

player.autoplay(true);
//https://coolestguidesontheplanet.com/videodrome/videojs/
//player.fluid(true); //set to window size
player.width(window.playerW); //80
player.height(window.playerH); //64

/// player GUI controls
//use the following functions to show or hide the controls
player.loadingSpinner.hide();
player.playsinline(true);
player.bigPlayButton.show();
//player.resizeManager.show(); //https://docs.videojs.com/resizemanager
//player.controlBar.show();

//player.bigPlayButton.hide();
player.controlBar.hide();

player.controlBar.playToggle.hide();
player.controlBar.volumePanel.hide();
player.controlBar.currentTimeDisplay.hide();
player.controlBar.timeDivider.hide();
player.controlBar.durationDisplay.hide();
player.controlBar.progressControl.hide();
player.controlBar.liveDisplay.hide();
player.controlBar.seekToLive.hide();
player.controlBar.remainingTimeDisplay.hide();
player.controlBar.customControlSpacer.hide();
player.controlBar.playbackRateMenuButton.hide();
player.controlBar.chaptersButton.hide();
player.controlBar.descriptionsButton.hide();
player.controlBar.subsCapsButton.hide();
player.controlBar.audioTrackButton.hide();
// player.controlBar.pictureInPictureToggle.hide();
player.controlBar.fullscreenToggle.hide();

// use the following to show specific elements of the COntrolBar
//player.controlBar.playToggle.show();
//player.controlBar.volumePanel.show();
//player.controlBar.currentTimeDisplay.show();
//player.controlBar.timeDivider.show();
//player.controlBar.durationDisplay.show();
//player.controlBar.progressControl.show();
//player.controlBar.liveDisplay.show();
//player.controlBar.seekToLive.show();
//player.controlBar.remainingTimeDisplay.show();
//player.controlBar.customControlSpacer.show();
//player.controlBar.playbackRateMenuButton.show();
//player.controlBar.chaptersButton.show();
//player.controlBar.descriptionsButton.show();
//player.controlBar.subsCapsButton.show();
//player.controlBar.audioTrackButton.show();
//player.controlBar.pictureInPictureToggle.show();
//player.controlBar.fullscreenToggle.show();

//Number.prototype.map = function (in_min, in_max, out_min, out_max) {
//  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
//}
//
//Number.prototype.mapTo1 = function (in_min, in_max) {
//  return (this - in_min) * (1) / (in_max - in_min);
//}


function show(target) {
    console.log("show " +target);
    document.getElementById(target).style.display = 'block';
}

function hide(target) {
     console.log("hide " +target);
    document.getElementById(target).style.display = 'none';
}

//negative playback http://jsfiddle.net/uvLgbqoa/
//https://stackoverflow.com/questions/18053261/play-a-video-in-reverse-using-html5-video-element/24587893

var info_json = document.getElementById("json");

var jsonData; // this is defined here, outside the function below so it becomes "global"
var jsonData_length;

//this function gets called when the window has loaded.
// It is something like the setup function in p5js

//loading the json file. currently it only loads it into the
//fetch("vData2.json")
//  .then(response => response.json())
//  .then(json => jsonData = json);
//
//    info_json.innerHTML = jsonData.text();

//https://www.w3schools.com/js/js_json_objects.asp
window.onload = function(e) {
  millisStart = Date.now();

  loadJsonData();
  
  // bShowInfo = false;
   // hide("info");
   //    hide("audioInfo");
      // setFullWindow(true);
  
  
  
  document.getElementById("version").innerHTML = "version "+version;
  
};

function loadJsonData(){
  console.log("fetch(json_src)");
  fetch(json_src)
    //    fetch('vData2.json')
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      jsonData = json;
      // var myJson = JSON.stringify(json);
      // var idx = 20;
      jsonData_length = jsonData.length;
      console.log("fetch json with length " + jsonData_length);
    
      // var arr = [];
  // arr.push({
  //       key: oFullResponse.results[i].label,
  //       sortable: true,
  //       resizeable: true
  //   });
    
      display_jsonObj(jsonData[1]);
      // console.log("parsed json", json);
    })
    .catch(function(ex) {
      console.log("parsing failed", ex);
    });
  
}
function update_loop() {
  //    var time = new Date();
  var millisSince = Date.now();
  var millisDiff = millisSince - millisStart;
  //    var millis = time.getMilliseconds();
  document.getElementById("fps").innerHTML = millisDiff;
  //    console.log (time);
}

window.setInterval(update_loop, 33); //33 ms = 30 fps 1000/30

function display_jsonObj(oneObj) {
  document.getElementById("chapter_name").innerHTML = oneObj.name;

  document.getElementById("chapter_duration").innerHTML = new_duration;
  document.getElementById("chapter_startTime").innerHTML = new_startTime;
  document.getElementById("chapter_endTime").innerHTML = new_endTime; //temp_v.toFixed(2);
document.getElementById("chapter_eye_contact").innerHTML = new_eye_contact; 

  
  time_slider.value = player.currentTime() / player.duration();

  //     document.getElementById("j_duration").innerHTML = oneObj.duration;
  //    document.getElementById("j_durationVid").innerHTML = oneObj.duration_vid;
  // document.getElementById("j_extro_end").innerHTML = oneObj.extro_end;
  // document.getElementById("j_extro_start").innerHTML = oneObj.extro_start;
  // document.getElementById("j_eye_contact_end").innerHTML = oneObj.eye_contact_end;
  // document.getElementById("j_eye_contact_start").innerHTML = oneObj.eye_contact_start;
  // document.getElementById("j_intro_end").innerHTML = oneObj.intro_end;
  // document.getElementById("j_intro_start").innerHTML = oneObj.intro_start;
  //    document.getElementById("j_timecode").innerHTML = oneObj.timecode;
  //     document.getElementById("j_timecodeVid").innerHTML = oneObj.timecode_vid;
  //document.getElementById("j_name").innerHTML = oneObj.name;
}


//jumpTo function
function jumpTo(idx) {
  
  //it seems to take a bit of time before json file is loaded
  //either add wait time or check json.length
  // if (performance.now() > 5000) {
  if (jsonData_length > idx) {
    rewinding = false;

    player.play();
    player.playbackRate(playSpeed);
    jumpCounter++;
    document.getElementById("jumpCounter").innerHTML = jumpCounter;

    if (idx == -1) {
      // var temp_r = Math.random();
      idx = Math.random() * jsonData_length; //jsonData.length;
      idx = parseInt(idx);
      vidCounter = idx;

      // console.log(
      //   "jumpt to jsonData_length " +
      //     jsonData_length +
      //     " idx " +
      //     idx
      // );
    }

    console.log("jumpt to idx:" + idx);

    // new_startTime = Math.random()*200;
    new_startTime = Math.round(jsonData[idx].timecode_vid * 1e6) / 1e6;
    // new_duration = 2 + Math.random() * 5;
    new_duration = Math.round(jsonData[idx].duration_vid * 1e6) / 1e6;
    new_endTime = new_startTime + new_duration; //jsonData[idx].duration_vid;

    loopDirection = 1;
    // Math.round(someNumber * 1e2) / 1e2

    console.log(
      "name: "+jsonData[idx].name + " , start " + new_startTime + " , end " + new_endTime
    );

    display_jsonObj(jsonData[idx]);

    new_eye_contact = Math.round(jsonData[idx].eye_contact_start * 1e6) / 1e6; //jsonData[idx].eye_contact_start;
   
    var temp_time = new_startTime + new_eye_contact + startOffsetTime;
      player.currentTime(temp_time);
     // player.play();
    console.log("new time: " + temp_time);
  } else {
    //for some reason the json fetch() is not always ready or executed when we get to this jumpTo function
    console.log("NOT jsonData_length > idx: " + jsonData_length + " > " + idx);
    loadJsonData();
  }
}

//get the elements defined in the HTML file using their id so we can change these programatically

var info_video_name = document.getElementById("video_name");
var info_current_time = document.getElementById("current_time");
var info_duration = document.getElementById("duration");
var info_progress = document.getElementById("progress");
var info_paused_state = document.getElementById("paused_state");
var info_muted_state = document.getElementById("muted_state");
var info_volume = document.getElementById("volume");
var info_height_width = document.getElementById("height_width");
var info_network_state = document.getElementById("network_state");
var info_ready_state = document.getElementById("ready_state");

var info_mouse_clicked_position = document.getElementById(
  "mouse_clicked_position"
);
var info_mouse_position = document.getElementById("mouse_position");
var info_mouse_pressed = document.getElementById("mouse_pressed");
var info_touch_state = document.getElementById("touch_state");

var play_btn = document.getElementById("play");
var pause_btn = document.getElementById("pause");
var muted_btn = document.getElementById("muted");
var volume_slider = document.getElementById("volume_slider");
var time_slider = document.getElementById("time_slider");

var info_speed = document.getElementById("speed");




function update_info_height_width() {
  info_height_width.innerHTML =
    player.currentWidth() + " x " + player.currentWidth();
}

function update_info_duration() {
  var temp_dur = player.duration();
  info_duration.innerHTML = temp_dur;
}

var rewind_startSystemTime;
var rewind_startVideoTime;
var rewindSpeed;
var rewinding = false;

function setup_rewind(_speed) {
  console.log("setup_rewind speed " + _speed);
  rewinding = true;
  rewindSpeed = _speed;
  info_speed.innerHTML = _speed;
  rewind_startSystemTime = new Date().getTime();
  rewind_startVideoTime = player.currentTime();

  player.pause();
}

//-------------UPDATE LOOP-----------
// we use this to avoid an infinite loop between the time_updated function and the timeslider change
var ignore_time_slider_change = false;
function time_updated() {
 
  
  if (loopDirection == 1) {
    if (player.currentTime() >= new_endTime - endOffsetTime) {
      //            player.pause();
      //            player.currentTime(new_startTime + startOffsetTime);
      setup_rewind(playSpeed);
      //            rewinding = true;
      loopDirection = -1;
    }
  } else {
    var elapsed = new Date().getTime() - rewind_startSystemTime;
    var temp_s = (elapsed * rewindSpeed) / 1000.0;
    var rewind_time = Math.max(rewind_startVideoTime - temp_s, 0);

    player.currentTime(rewind_time);

    if (player.currentTime() <= new_startTime + startOffsetTime) {
      player.play();
      //            player.currentTime(new_startTime + startOffsetTime);
      rewinding = false;
      loopDirection = 1;
      info_speed.innerHTML = 1;
    }
  }

  //function (in_min, in_max, out_min, out_max)
  //    let temp_time = player.currentTime();
  //        temp_time.map(new_startTime,new_endTime,0,100);
  var map_time =
    (player.currentTime() - new_startTime) / (new_endTime - new_startTime);
  // console.log(
  //   "map_time " +
  //     map_time +
  //     " new_startTime " +
  //     new_startTime +
  //     " new_endTime " +
  //     new_endTime +
  //     " currentTime " +
  //     player.currentTime()
  // );
  document.getElementById("chapter_slider").value = map_time;

  info_current_time.innerHTML = player.currentTime();

  if (ignore_time_slider_change == false) {
    time_slider.value = player.currentTime() / player.duration();
  }
  // you can check in this function the json file to determine what to do.
}

function time_slider_changed() {
  ignore_time_slider_change = true;
  player.currentTime(time_slider.valueAsNumber * player.duration());
  ignore_time_slider_change = false;
}

// we can register to an event passing an already defined function
// or passing an anonymous function
// player.on is an event
//https://docs.videojs.com/module-events.html
//https://docs.videojs.com/tutorial-event-target.html
player.on("timeupdate", time_updated);

//the correct event to use is oninput, although InternetExplorer does not recognize it, while it only recognizes onchange
time_slider.oninput = time_slider_changed;
time_slider.onchange = time_slider_changed;

player.on("play", function(
  e // this is a listener function.
) {
  info_paused_state.innerHTML = "false";
});

player.on("pause", function(e) {
  info_paused_state.innerHTML = "true";
});

player.on("loadeddata", function(e) {
  info_video_name.innerHTML = player.currentSrc();
  update_info_height_width();
  update_info_duration();
  
  // player.play();
  jumpTo(-1);
  
});

player.on("resize", update_info_height_width);
player.on("durationchange", update_info_duration);

player.on("progress", function(e) {
  var temp_buf = player.bufferedPercent();
  info_progress.innerHTML = temp_buf;
});

//player.on('ready', function(e)
//{
//    console.log(e);
//
//    info_ready_state.innerHTML = player.readyState();
//
//});
//
//player.on('network', function(e)
//{
//    console.log(e);
//
//    info_network_state.innerHTML = player.networkState();
//
//});

play_btn.onclick = function(e) {
  player.play();
};
pause_btn.onclick = function(e) {
  player.pause();
};
muted_btn.onclick = function(e) {
  player.muted(muted_btn.checked);
};

function volume_slider_changed() {
  player.volume(volume_slider.valueAsNumber);
}

//the correct event to use is oninput, although InternetExplorer does not recognize it, while it only recognizes onchange
volume_slider.onchange = volume_slider_changed;
volume_slider.oninput = volume_slider_changed;


function toggleFullScreen() {
  console.log("toggleFullScreen()");
  
  //https://developers.google.com/web/fundamentals/native-hardware/fullscreen
  var doc = window.document;
  var docEl = doc.documentElement;

  var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
  var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

  if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
    requestFullScreen.call(docEl);
    // setFullWindow(true);
    isFullScreen = true;
  }
  else {
    cancelFullScreen.call(doc);
    // setFullWindow(false);
    isFullScreen = false;
  }
}

function toggleFullWindow(){
  isFullScreen = !isFullScreen;
  setFullWindow(isFullScreen);
}

function setFullWindow(_fullWindow, _flipWH) {
  isFullScreen = _fullWindow;
  // console.log("fullScreen "+fullScreen);
  // console.log("screen.width "+screen.width + " screen.height "+ screen.height);
  //   var w = window.innerWidth;
  // var h = window.innerHeight;

     screenWidth =
       window.innerWidth ||
       document.documentElement.clientWidth ||
       document.body.clientWidth;

     screenHeight =
       window.innerHeight ||
       document.documentElement.clientHeight ||
       document.body.clientHeight;
  
  if(_flipWH == true){
    //swap to numbers
    //https://stackoverflow.com/questions/16201656/how-to-swap-two-variables-in-javascript
    screenHeight = [screenWidth, screenWidth = screenHeight][0];
  }

  

  // bShowInfo = !_fullWindow;
  if (isFullScreen == true) {
    window.playerW = screenWidth; //window.screen.width;
    window.playerH = screenHeight; //window.screen.height;
    
      hide("info");
     hide("audioInfo");
  } else {
    window.playerW = 400;
    window.playerH = 320;
    
     show("info");
      show("audioInfo");
    // player.width(400); //80
    // player.height(320); //64
  }
  player.width(window.playerW);
  player.height(window.playerH);
  
  updateCanvasSize(window.playerW,window.playerH);
}

function setToWindowSize(){
   screenWidth = window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;

 screenHeight = window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight;
  
   window.playerW = screenWidth; //window.screen.width;
    window.playerH = screenHeight; //window.screen.height;
  
    player.width(window.playerW);
  player.height(window.playerH);
  
  updateCanvasSize(window.playerW,window.playerH);
}