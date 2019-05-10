# CameraWithLineUp
This is a sample for line up module base on [Flask](http://flask.pocoo.org) server.


## Server

### install (shell)
install python package `gevent-websocket`
```shell
pip install gevent-websocket
```
or use `requirements.txt`
```shell
pip install -r requirements.txt
```

### usage (python)
import the `lineup.py` module
```python
import lineup
```

add route to the line up handler
```python
app.add_url_rule('/lineup', 'lineup', lineup.handler)
```

run the server by line up(websocket support) instead of defaule `app.run()`
```python
server = lineup.server(app)
server.serve_forever()
```

## Client

### usage
load `lineup.js` in the html
```html
<script src="static/js/lineup.js"></script>
```

write your callback function when server announce
```javascript
function onmessage(data) {
  // data = {'number': <your position in line>,
  //         'total': <total person in line>}
  if (data.number == 0) {
    // do what you want to do 
  } else {
    // you should still waiting
  }
}
```

finally start the lineup module
```javascript
lineup.init(websocket_url, onmessage);
```
