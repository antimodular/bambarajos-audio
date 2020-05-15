// the first argument corresponds to the id of the video tag in the html file

//change buffer amounts
//https://github.com/videojs/videojs-contrib-hls/issues/1302

var version = "v27";
console.log("version" + version);
            
//var player = videojs("vid", {});
window.player = document.getElementById("vid");
var source = document.createElement('source');

//https://stackoverflow.com/questions/3437786/get-the-size-of-the-screen-current-web-page-and-browser-window
// var screenWidth =
//   window.innerWidth ||
//   document.documentElement.clientWidth ||
//   document.body.clientWidth;

// var screenHeight =
//   window.innerHeight ||
//   document.documentElement.clientHeight ||
//   document.body.clientHeight;

// var screenWidth = window.screen.width * window.devicePixelRatio;

// var screenHeight = window.screen.height * window.devicePixelRatio;

// window.playerW = screenWidth; //window.screen.width; //400;
// window.playerH = screenHeight; //window.screen.height; //320;

// window.playerW = screenWidth; //400;
// window.playerH = screenHeight; //320;

// var json_src = "l-001-200_047.json";
// var json_srcArray = {};
var json_srcArray = [
// "https://cdn.glitch.com/91812b4c-a1b7-4816-958b-e44e496b0835%2Fgroup_00.json?v=1589301289192",
"https://cdn.glitch.com/91812b4c-a1b7-4816-958b-e44e496b0835%2Fgroup_01.json?v=1589302176190",
"https://cdn.glitch.com/91812b4c-a1b7-4816-958b-e44e496b0835%2Fgroup_02.json?v=1589302180128",
 "https://cdn.glitch.com/91812b4c-a1b7-4816-958b-e44e496b0835%2Fgroup_03.json?v=1589306913469",
 "https://cdn.glitch.com/91812b4c-a1b7-4816-958b-e44e496b0835%2Fgroup_04.json?v=1589306918618",
 "https://cdn.glitch.com/91812b4c-a1b7-4816-958b-e44e496b0835%2Fgroup_05.json?v=1589306926036",
 "https://cdn.glitch.com/91812b4c-a1b7-4816-958b-e44e496b0835%2Fgroup_06.json?v=1589306932106"
];
var vid_srcArray = [
// "https://cdn.glitch.com/91812b4c-a1b7-4816-958b-e44e496b0835%2Fgroup_00.mp4?v=1589301371128",
"https://cdn.glitch.com/91812b4c-a1b7-4816-958b-e44e496b0835%2Fgroup_01.mp4?v=1589302239633",
"https://cdn.glitch.com/91812b4c-a1b7-4816-958b-e44e496b0835%2Fgroup_02.mp4?v=1589302248282",
 "https://cdn.glitch.com/91812b4c-a1b7-4816-958b-e44e496b0835%2Fgroup_03.mp4?v=1589306972187",
 "https://cdn.glitch.com/91812b4c-a1b7-4816-958b-e44e496b0835%2Fgroup_04.mp4?v=1589307007186",
 "https://cdn.glitch.com/91812b4c-a1b7-4816-958b-e44e496b0835%2Fgroup_05.mp4?v=1589307020395",
 "https://cdn.glitch.com/91812b4c-a1b7-4816-958b-e44e496b0835%2Fgroup_06.mp4?v=1589307010407"
];

// var json_srcArray = [
//     //   "assets/group_00.json",
//     "assets/group_01.json",
//     "assets/group_02.json",
//     "assets/group_03.json",  
//     "assets/group_04.json",
//     "assets/group_05.json",
//     "assets/group_06.json"
// ];
// var vid_srcArray = [
//     //     "assets/group_00.mp4",
//     "assets/group_01.mp4",
//     "assets/group_02.mp4", 
//     "assets/group_03.mp4",
//     "assets/group_04.mp4",
//     "assets/group_05.mp4", 
//     "assets/group_06.mp4"
// ];

var info_json = document.getElementById("json");

var jsonData; // this is defined here, outside the function below so it becomes "global"
var jsonData_length;
var availableIndices = [];

var millisStart;

//var vidCounter = 0;
var jumpCounter = 0;

window.new_index = 0;
var new_startTime = 0;
var new_endTime = 10;
var new_duration = 0;
var startOffsetTime = 0.05; //0.3; //in order to not start right at start time but a bit later
var endOffsetTime = 0.25;
var new_eye_contact = 0;

//var rewind = false;
var speed = 1;
var loopDirection = 1;

// var bShowInfo = false; //true;

var playSpeed = 1; //0.5;


var w = document.documentElement.clientWidth;
var h = document.documentElement.clientHeight;

window.player.width = w;
window.player.height = w * 4/5;

//https://stackoverflow.com/questions/14161516/html5-video-completely-hide-controls

window.player.playsinline = true;
window.player.mute = true;
window.player.autoplay = true;
 window.player.play();
window.player.controls = false;
//    document.getElementById("myVideo").poster = "/images/w3schoolscomlogo.png";
// player.poster = "assets/poster.png";
window.player.poster = "https://cdn.glitch.com/91812b4c-a1b7-4816-958b-e44e496b0835%2Fposter.png?v=1589294040845";

var json_src;
var vid_src;

window.videoLoadPercent = 0;
window.firstLoadIsDone = false;
window.receivedLength = 0;
window.contentLength = 0;
//async
 function setUpNewVideo(downloadFirst){
    downloadFirst = false;
    console.log("setUpNewVideo() with downloadFirst = "+downloadFirst);

    var temp_r = Math.floor(Math.random() * json_srcArray.length);
    json_src = json_srcArray[temp_r];
    vid_src = vid_srcArray[temp_r];
    console.log("json src idx: " + temp_r + " json_name: " + json_src + " vid_name "+ vid_src);

    loadJsonData(json_src);

//    if(downloadFirst == true){
//        //http://dinbror.dk/blog/how-to-preload-entire-html5-video-before-play-solved/
//        //https://javascript.info/fetch-progress
//        // Step 1: start the fetch and obtain a reader
//        let response = await fetch(vid_src);
//
//        const reader = response.body.getReader();
//        // Step 2: get total length
//        window.contentLength = +response.headers.get('Content-Length');
//
//        // Step 3: read the data
//        window.receivedLength = 0; // received that many bytes at the moment
//        let chunks = []; // array of received binary chunks (comprises the body)
//        while(true) {
//            const {done, value} = await reader.read();
//
//            if (done) {
//                break;
//            }
//
//            chunks.push(value);
//            window.receivedLength += value.length;
//
//            window.videoLoadPercent = window.receivedLength/window.contentLength;
//            if(window.videoLoadPercent >= 1) window.firstLoadIsDone = true;
//            
//            console.log(`Received ${window.receivedLength} of ${window.contentLength}`)
//             console.log("videoLoadPercent "+window.videoLoadPercent +" loadIsDOne "+window.firstLoadIsDone);
//        }
//
//        let myBlob = new Blob(chunks);
//        player.src = URL.createObjectURL(myBlob);
//         console.log("URL.createObjectURL(myBlob) " + player.src);
//    }else{
//        player.src = vid_src;
//        player.preload = true;
//         console.log(" player.src " + player.src);
//    }
   
   window.player.type = "video/mp4";
      window.player.src = vid_src;
   
//        player.preload = true;
      // window.player.autoplay = true;
         console.log(" player.src " + window.player.src);
 window.player.play();
    //    var w = document.documentElement.clientWidth;
    //    var h = document.documentElement.clientHeight;
    //
    //    player.width = w;
    //    player.height = w * 4/5;

    //    document.getElementById("myVideo").poster = "/images/w3schoolscomlogo.png";
    //    player.poster = "assets/poster.png";
    //  // update the tech's poster
    //  this.techCall('setPoster', src);





    //    //    (async () => { 
    //    await fetch(vid_src)
    //        .then(response => {
    //        if (!response.ok) {
    //            throw new Error('Network response was not ok');
    //        }
    //        getLoadProgress(response);
    //        return response.blob();
    //    })
    //        .then(myBlob => {
    //        player.src = URL.createObjectURL(myBlob);
    //        console.log("URL.createObjectURL(myBlob) " + player.src);
    //
    //    })
    //        .catch(error => {
    //        console.error('There has been a problem with your fetch operation:', error);
    //    });
    //    //    })().catch(e => log(e));
    //    //    player.play();
    //
    //    //     player.src = vid_src;
    //
    //    var w = document.documentElement.clientWidth;
    //    var h = document.documentElement.clientHeight;
    //
    //    player.width = w;
    //    player.height = w * 4/5;
    //
    //    //    document.getElementById("myVideo").poster = "/images/w3schoolscomlogo.png";
    //    player.poster = "assets/poster.png";
    //    //  // update the tech's poster
    //    //  this.techCall('setPoster', src);
    //
    //    //https://stackoverflow.com/questions/14161516/html5-video-completely-hide-controls
    //    player.controls = false;

    /*
    player.src([{ src: vid_src, type: "video/mp4" }]);

    //    player.preload(true);
    player.autoplay(true);
    //https://coolestguidesontheplanet.com/videodrome/videojs/

    // player.width(window.playerW); //80
    // player.height(window.playerH); //64
    //   player.controls.aspectRatio("5:4");
    player.aspectRatio('5:4'); //fluid will scale video, but setting ratio here helps with correct poster size
    player.fluid(true); //set to window size
    //player.poster(
    // "https://cdn.glitch.com/91812b4c-a1b7-4816-958b-e44e496b0835%2Fposter.png?v=1589294040845"
    //);

    /// player GUI controls
    //use the following functions to show or hide the controls
    player.loadingSpinner.hide();
    player.playsinline(true); //avoid ios fullscreen player
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

    player.poster(
        "assets/poster.png"
    );
    */
}

//console.log("hello");
//setUpNewVideo(true);
// var json_src =
// "https://cdn.glitch.com/91812b4c-a1b7-4816-958b-e44e496b0835%2Fgroup_00.json?v=1589301289192";
// var vid_src =
//   "https://cdn.glitch.com/91812b4c-a1b7-4816-958b-e44e496b0835%2Fgroup_00.mp4?v=1589301371128";
// var vid_src = "l-001-200_047.mp4";
// var vid_src = "https://cdn.glitch.com/b1e475c8-3489-4513-8664-2d0f29f610de%2Fl-001-200_047.mp4?v=1588351308938";
// var vid_src = "https://stephanschulz.ca/bamba/l-001-200_047.mp4";

//player.src([{src:'//vjs.zencdn.net/v/oceans.mp4',type:'video/mp4'},
//            {src:'//vjs.zencdn.net/v/oceans.webm',type:'video/webm'},
//            {src:'//vjs.zencdn.net/v/oceans.ogv',type:'video/ogg'}
//            ]);
//player.poster('//vjs.zencdn.net/v/oceans.png');
//player.src([{src:'https://stephanschulz.ca/bamba/l-001-20min_h264.mp4',type:'video/mp4'}
//            ]);

// console.log("fetch(vid blob)");
//   // fetch("https://stephanschulz.ca/bamba/mp4/g-001.mp4")
//        fetch('https://stephanschulz.ca/bamba/l-001-200_047.mp4')
//     .then(function(response) {
//       return response.blob();
//     })
//     .then(function(blob) {
//       // jsonData = json;
//       // var myJson = JSON.stringify(json);
//       // var idx = 20;
//       // jsonData_length = jsonData.length;
//     const blobURL = URL.createObjectURL(blob);
//       // console.log("fetch json with length " + jsonData_length);
// console.log("blobURL "+blobURL);

//     })
//     .catch(function(ex) {
//       console.log("blob failed", ex);
//     });

//player.src([{ src: vid_src, type: "video/mp4" }]);

//var URL = window.URL || window.webkitURL;
//var src_url = URL.createObjectURL(vid_src);
// player.src([
//   { src: vid_src, type: "video/mp4" }
//   //            ]);

//   //player.src([{src:src_url,type:'video/mp4'}
//   //            ]);

//   //player.src([{src:src_url,type: blob.type}
// ]);

// player.poster("https://stephanschulz.ca/bamba/l-001-20min_h264.png");

//player.autoplay(true);
////https://coolestguidesontheplanet.com/videodrome/videojs/
//
//// player.width(window.playerW); //80
//// player.height(window.playerH); //64
//// player.controls.aspectRatio("16:9");
//// player.aspectRatio('16:9');
//player.fluid(true); //set to window size
////player.poster(
//// "https://cdn.glitch.com/91812b4c-a1b7-4816-958b-e44e496b0835%2Fposter.png?v=1589294040845"
////);
// player.poster(
//   "assets/poster.png"
// );
///// player GUI controls
////use the following functions to show or hide the controls
//player.loadingSpinner.hide();
//player.playsinline(true);
//player.bigPlayButton.show();
////player.resizeManager.show(); //https://docs.videojs.com/resizemanager
////player.controlBar.show();
//
////player.bigPlayButton.hide();
//player.controlBar.hide();
//
//player.controlBar.playToggle.hide();
//player.controlBar.volumePanel.hide();
//player.controlBar.currentTimeDisplay.hide();
//player.controlBar.timeDivider.hide();
//player.controlBar.durationDisplay.hide();
//player.controlBar.progressControl.hide();
//player.controlBar.liveDisplay.hide();
//player.controlBar.seekToLive.hide();
//player.controlBar.remainingTimeDisplay.hide();
//player.controlBar.customControlSpacer.hide();
//player.controlBar.playbackRateMenuButton.hide();
//player.controlBar.chaptersButton.hide();
//player.controlBar.descriptionsButton.hide();
//player.controlBar.subsCapsButton.hide();
//player.controlBar.audioTrackButton.hide();
//// player.controlBar.pictureInPictureToggle.hide();
//player.controlBar.fullscreenToggle.hide();

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

//negative playback http://jsfiddle.net/uvLgbqoa/
//https://stackoverflow.com/questions/18053261/play-a-video-in-reverse-using-html5-video-element/24587893


//this function gets called when the window has loaded.
// It is something like the setup function in p5js

//loading the json file. currently it only loads it into the
//fetch("vData2.json")
//  .then(response => response.json())
//  .then(json => jsonData = json);
//
//    info_json.innerHTML = jsonData.text();

function loadJsonData(_src) {
    console.log("loadJsonData() "+_src);
    fetch(_src)
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

        for(var i=0; i<jsonData_length; i++){
            availableIndices[i] = i;   
        }
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
    document.getElementById("chapter_index").innerHTML = window.new_index;

    document.getElementById("chapter_duration").innerHTML = new_duration;
    document.getElementById("chapter_startTime").innerHTML = new_startTime;
    document.getElementById("chapter_endTime").innerHTML = new_endTime; //temp_v.toFixed(2);
    document.getElementById("chapter_eye_contact").innerHTML = new_eye_contact;

    time_slider.value = window.player.currentTime / window.player.duration;

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

        window.player.play();
        window.player.playbackRate = playSpeed;
        jumpCounter++;
        document.getElementById("jumpCounter").innerHTML = jumpCounter;

        if (idx == -1) {

            //      idx = Math.random() * jsonData_length; //jsonData.length;
            //      idx = parseInt(idx);

            console.log("A availableIndices.length "+availableIndices.length);
            var random_idx = Math.random() * availableIndices.length; //jsonData.length;
            random_idx = parseInt(random_idx);
            console.log("random idx "+random_idx);
            //        
            var array_idx = availableIndices[random_idx];
            console.log("array idx "+array_idx);

            availableIndices.splice(array_idx,1); //delete element via index

            idx = array_idx;
            //        var result = arrayRemove(availableIndices, array_idx);

            console.log("B availableIndices.length "+availableIndices.length);

            if(availableIndices.length <= 0){
                //because it takes a while to load new video, let's jump through old ones in the meantime
                for(var i=0; i<jsonData_length; i++){
                    availableIndices[i] = i;   

                }
                //                console.log("fill array again ");
                console.log("array is emoty. get new source ");
                setUpNewVideo(true);
            }
            //      vidCounter = idx;

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
        new_index = idx;
        loopDirection = 1;
        // Math.round(someNumber * 1e2) / 1e2

        console.log(
            "name: " +
            jsonData[idx].name +
            " , start " +
            new_startTime +
            " , end " +
            new_endTime
        );

        display_jsonObj(jsonData[idx]);

        new_eye_contact = Math.round(jsonData[idx].eye_contact_start * 1e6) / 1e6; //jsonData[idx].eye_contact_start;

        var temp_time = new_startTime + new_eye_contact + startOffsetTime;
        window.player.currentTime = temp_time;
        // player.play();
        console.log("new time: " + temp_time);
    } else {
        //for some reason the json fetch() is not always ready or executed when we get to this jumpTo function
        console.log("NOT jsonData_length > idx: " + jsonData_length + " > " + idx);
        loadJsonData(json_src);
    }
}

//get the elements defined in the HTML file using their id so we can change these programatically

var info_video_name = document.getElementById("video_name");
var info_json_name = document.getElementById("json_name");
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
    //    info_height_width.innerHTML =
    //        player.currentWidth() + " x " + player.currentWidth();
    info_height_width.innerHTML =  window.player.width + " x " + window.player.height; //currentWidth();
}

function update_info_duration() {
    var temp_dur = window.player.duration;
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
    rewind_startVideoTime = window.player.currentTime;

    window.player.pause();
}

//-------------UPDATE LOOP-----------
// we use this to avoid an infinite loop between the time_updated function and the timeslider change
var ignore_time_slider_change = false;
function time_updated() {
    if (loopDirection == 1) {
        if (window.player.currentTime >= new_endTime - endOffsetTime) {
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

        window.player.currentTime = rewind_time ;

        if (window.player.currentTime <= new_startTime + startOffsetTime) {
            window.player.play();
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
        (window.player.currentTime - new_startTime) / (new_endTime - new_startTime);
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

    info_current_time.innerHTML = window.player.currentTime;

    if (ignore_time_slider_change == false) {
        time_slider.value = window.player.currentTime / window.player.duration;
    }
    // you can check in this function the json file to determine what to do.
}

function time_slider_changed() {
    ignore_time_slider_change = true;
    window.player.currentTime = (time_slider.valueAsNumber * window.player.duration);
    ignore_time_slider_change = false;
}

//https://www.w3schools.com/tags/ref_av_dom.asp

// we can register to an event passing an already defined function
// or passing an anonymous function
// player.on is an event
//https://docs.videojs.com/module-events.html
//https://docs.videojs.com/tutorial-event-target.html
//player.on("timeupdate", time_updated);
window.player.ontimeupdate = function() {time_updated()};

//the correct event to use is oninput, although InternetExplorer does not recognize it, while it only recognizes onchange
time_slider.oninput = time_slider_changed;
time_slider.onchange = time_slider_changed;


window.player.onplay = function(e) { info_paused_state.innerHTML = "false";};

window.player.onpause = function(e) {
    info_paused_state.innerHTML = "true";
};

window.player.onloadeddata = function(e) {
    info_video_name.innerHTML = window.player.src;
    info_json_name.innerHTML = json_src;
    update_info_height_width();
    update_info_duration();

    player.play();
    jumpTo(-1);
};

//player.on("resize", update_info_height_width);
window.player.ondurationchange = function() {update_info_duration()};

window.player.onprogress = function() {
//    console.log("Start: " + player.buffered.start(0)
//                + " End: " + player.buffered.end(0));


//    var range = 0;
//    var bf = this.buffered;
//    var time = this.currentTime;
//
//    while(!(bf.start(range) <= time && time <= bf.end(range))) {
//        range += 1;
//    }
//    var loadStartPercentage = bf.start(range) / this.duration;
//    var loadEndPercentage = bf.end(range) / this.duration;
//    var loadPercentage = loadEndPercentage - loadStartPercentage;
//
//    //         var temp_buf = player.bufferedPercent();
//    info_progress.innerHTML = loadPercentage;
};

//https://docs.videojs.com/player#event:playerresize
//player.on("playerresize", function(e) {
//    updateCanvasSize(window.player.currentWidth(), window.player.currentHeight());
//});
window.player.onloadstart = function() {
    //    updateCanvasSize(window.player.currentWidth(), window.player.currentHeight());
    windowResizing();
//    updateCanvasSize(window.player.width, window.player.height);
};


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
    window.player.play();
};
pause_btn.onclick = function(e) {
    window.player.pause();
};
muted_btn.onclick = function(e) {
    window.player.muted(muted_btn.checked);
};

function volume_slider_changed() {
    window.player.volume(volume_slider.valueAsNumber);
}

//the correct event to use is oninput, although InternetExplorer does not recognize it, while it only recognizes onchange
volume_slider.onchange = volume_slider_changed;
volume_slider.oninput = volume_slider_changed;
