var websocket_url = "ws://" + location.host + "/lineup";

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

//set url for IP cam and start automatically
//some part can't work in $(()=>{})
window.addEventListener('load', ()=>{

  // lineup
  function onmessage(data) {
    // data = {'number': <your position in line>,
    //         'total': <total person in line>}
    if (data.number == 0) {
      document.getElementById('waiting_anno').innerHTML = "You can control now...";
      fadeOutEffect(document.getElementById('waiting_anno'));
    } else {
      document.getElementById('waiting_number').innerHTML = data.number;
      document.getElementById('waiting_total').innerHTML = data.total;
    }
  }
  lineup.init(websocket_url, onmessage);

  console.log("start");
})
