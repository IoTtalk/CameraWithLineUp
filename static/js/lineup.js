var lineup = (function(){
  let socket = null;
  let uuid = null;
  let onopen_callback = null;
  let onerror_callback = null;
  let onmessage_callback = null;
  let onclose_callback = null;

  function _onopen(event) {
    socket.send('online');
    if (onopen_callback){
      onopen_callback();
    }
  }

  function _onclose(event) {
    console.log("Websocket closed. code = " + event.code);
    if (onclose_callback) {
      onclose_callback(event.code);
    }
  }

  function _onerror(event) {
    console.error("There is an error with Websocket.");
    if (onerror_callback) {
      onerror_callback();
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

  function init(url, onmessage, onopen, onerror, onclose) {
    if (!onmessage) {
      console.error('lineup init should given onmessage.');
      return;
    }
    onopen_callback = onopen;
    onerror_callback = onerror;
    onmessage_callback = onmessage;
    onclose_callback = onclose;

    // create socket
    socket = new WebSocket(url);
    socket.onopen = _onopen;
    socket.onerror = _onerror;
    socket.onmessage = _onmessage;
    socket.onclose = _onclose;
  }

  return {
    'init': init,
  };
})();
