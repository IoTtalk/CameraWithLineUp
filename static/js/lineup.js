var lineup = (function(){
  let socket = null;
  let uuid = null;
  let open_callback = null;
  let onmessage_callback = null;

  function _onopen(event) {
    socket.send('online');
    if (open_callback){
      open_callback();
    }
  }

  function _onmessage(event) {
    let data = JSON.parse(event.data);
    // data = {'number': <your position in line>,
    //         'total': <total person in line>}
    console.debug('lineup receive:', data);
    if (data.op =="start") {
      uuid = data.uuid;
    } else if (data.uuid == uuid && data.op == "number") {
      if (data.number == 0) {
        socket.onmessage = null;
      }
      if (onmessage_callback) {
        onmessage_callback(data);
      }
    }
  }

  function init(url, onmessage, onopen) {
    if (!onmessage) {
      console.error('lineup init should given onmessage.');
      return;
    }
    open_callback = onopen;
    onmessage_callback = onmessage;

    // create socket
    socket = new WebSocket(url);
    socket.onopen = _onopen;
    socket.onmessage = _onmessage;
  }

  return {
    'init': init,
  };
})();
