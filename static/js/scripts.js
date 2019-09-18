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
      $('#waiting_anno').text("You can control now...");
      fadeOutEffect($('#waiting_anno')[0]);
    } else {
      $('#waiting_number').text(data.number);
      $('#waiting_total').text(data.total);
    }
  }
  lineup.init(websocket_url, onmessage);

  console.log("start");
})
