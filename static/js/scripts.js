var IP_CAM_HOST = "";
var IP_CAM_API_PORT = "";
var IP_CAM_RTSP_PORT = "";
var IP_CAM_USERNAME = "";
var IP_CAM_PASSWORD = "";
var IP_CAM_AUTO_AUTH = 1; //1: TRUE, 0: FALSE

var KURENTO_SERVER_HOST = "";  
var KURENTO_SERVER_PORT = "";

var REMOTE_CONTROL_URL = "";

var websocket_url = "ws://" + location.host + "/lineup"

var socket = null;
var uuid = null;

function UUID () {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}

function fadeOutEffect(target) {
    var fadeEffect = setInterval(function () {
        if (!target.style.opacity) {
            target.style.opacity = 1;
        }
        if (target.style.opacity > 0) {
            target.style.opacity -= 0.1;
        } else {
            clearInterval(fadeEffect);
            target.remove();
        }
    }, 100);
}

function CamControl(movetype, direction)
{
  var joystickcmd = "";
  if (movetype == "move")
  {
    switch(direction) {
      case 'up':
        //joystickcmd = "vx=0&vy=1";  //move continuously on mouse down and stop on mouse up
        joystickcmd = "move=up";  //move ~10 degree per click
        break;

      case 'down':
        //joystickcmd = "vx=0&vy=-1";
        joystickcmd = "move=down";
        break;

      case 'left':
        //joystickcmd = "vx=-1&vy=0";
        joystickcmd = "move=left";
        break;

      case 'right':
        //joystickcmd = "vx=1&vy=0";
        joystickcmd = "move=right";
        break;

      case 'stop':
        joystickcmd = "vx=0&vy=0";
        break;

      case 'home':
        joystickcmd = "move=home";
        break;

      default:
        break;
    }
    try {
      parent.retframe.location.href = 'http://' + IP_CAM_HOST + ':' + IP_CAM_API_PORT + '/cgi-bin/camctrl/camctrl.cgi?' + joystickcmd;
    } 
    catch (err) {
      retframe.location.href = 'http://' + IP_CAM_HOST + ':' + IP_CAM_API_PORT + '/cgi-bin/camctrl/camctrl.cgi?' + joystickcmd;
    }
  }
  else if (movetype == "zoom")
  {
    switch(direction) {
      case 'wide':
        //joystickcmd = "zooming=wide";  //zoom continuously on mouse down and stop on mouse up
        joystickcmd = "zoom=wide";  //zoom per click
        break;

      case 'tele':
        //joystickcmd = "zooming=tele";
        joystickcmd = "zoom=tele";
        break;

      case 'stop':
        joystickcmd = "zoom=stop&zs=0";
        break;
    }
    try {
            parent.retframe.location.href = 'http://' + IP_CAM_HOST + ':' + IP_CAM_API_PORT + '/cgi-bin/camctrl/eCamCtrl.cgi?channel=0&stream=1&' + joystickcmd;  //ePTZ
    }
    catch (err) {
            retframe.location.href = 'http://' + IP_CAM_HOST + ':' + IP_CAM_API_PORT + '/cgi-bin/camctrl/eCamCtrl.cgi?channel=0&stream=1&' + joystickcmd;  //ePTZ
    }
  }
  else if (movetype == "focus")
  { 
    switch(direction) {
      case 'near':
        joystickcmd = "focusing=near";
        break;

      case 'far':
        joystickcmd = "focusing=far";
        break;

      case 'auto':
        joystickcmd = "focus=auto";
        break;

      case 'stop':
        joystickcmd = "focusing=stop";
        break;
    }
    try {
      parent.retframe.location.href = '/cgi-bin/camctrl/camctrl.cgi?' + joystickcmd;
    }
    catch (err) {
      retframe.location.href = '/cgi-bin/camctrl/camctrl.cgi?' + joystickcmd;
    }
  }
  else
  {
    try {
      parent.retframe.location.href = '/cgi-bin/camctrl/camctrl.cgi?'+ movetype +'='+ direction;
    }
    catch (err) {
      retframe.location.href = '/cgi-bin/camctrl/camctrl.cgi?'+ movetype +'='+ direction;
    }
  }
}

function bodyOnUnload() {
  //Note: $(window).on('unload') not working
  document.getElementById('stop').click();
  console.log("stop");
}

function toggleFullScreen() {
  //the element you want to make fullscreen
  let videoFSContainer = document.getElementById("videoFSContainer");
  let requestFullscreen = videoFSContainer.requestFullscreen || videoFSContainer.webkitRequestFullScreen || videoFSContainer.mozRequestFullScreen || videoFSContainer.msRequestFullscreen;
  let exitFullscreen = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen|| document.msExitFullscreen;

  if(!(document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement)) {
    //Note: these functions `requestFullscreen` can't call directly (requestFullscreen())
    //      these context will be `document`, not `elem`
    //      So, these should use `call` function to reassign these context
    requestFullscreen.call(videoFSContainer);
    videoFSContainer.style.backgroundColor = "black";
  }
  else {
    exitFullscreen.call(document);
    videoFSContainer.style.backgroundColor = "";
  }
}

//set url for IP cam and start automatically
//some part can't work in $(()=>{})
window.addEventListener('load', ()=>{
  //toggleFullScreen when click the video 
  $(document).on('click', '#videoOutput', toggleFullScreen);

  //set the WebSocket Secure url for https of the kurento server
  args.ws_uri = 'wss://' + KURENTO_SERVER_HOST + ':' + KURENTO_SERVER_PORT + '/kurento';

  //set kurento video address
  if(IP_CAM_AUTO_AUTH == 1) {
    document.getElementById("address").value = "rtsp://" + IP_CAM_USERNAME + ":" + IP_CAM_PASSWORD + "@" + IP_CAM_HOST + ":" + IP_CAM_RTSP_PORT + "/live2.sdp";
  } else {
    document.getElementById("address").value = "rtsp://" + IP_CAM_HOST + ":" + IP_CAM_RTSP_PORT + "/live2.sdp";
  }

  //start the video
  document.getElementById('start').click();

  console.log("start");

  function startControl(){
    //logging video page  (for zoom control)
    document.getElementById("login").action = "http://" + IP_CAM_USERNAME + ":" + IP_CAM_PASSWORD + "@" + IP_CAM_HOST + ":" + IP_CAM_API_PORT;

    //set remote_control ifram
    document.getElementById("remotecontrol").src = REMOTE_CONTROL_URL;

    //iottalk register
    iottalk_register();

    $('#PTZ_panel').removeClass('hidden');
  }

  socket = new WebSocket(websocket_url);
  socket.onopen = (event) => {
    socket.send('online');
  }
  socket.onmessage = (event) => {
    let response = JSON.parse(event.data);
    console.log(response);
    if (response.op =="start") {
      uuid = response.uuid;
    } else if (response.uuid == uuid && response.op == "number") {
      if (response.number == 0) {
        $('#waiting_anno').text("You can control now...");
        fadeOutEffect($('#waiting_anno')[0]);
        startControl();
        socket.onmessage = null;
      } else {
        $('#waiting_number').text(response.number);
        $('#waiting_total').text(response.total);
      }
    }
  }
})
