from flask import request
from geventwebsocket.handler import WebSocketHandler
from gevent.pywsgi import WSGIServer

import logging
import json
import uuid

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("lineup")

__server = None
__socket_client_dict = {}


class SocketClient():
    def __init__(self, uuid, socket):
        self.uuid = str(uuid)
        self.socket = socket

    def send(self, msg):
        logger.debug('send [{}]: {}'.format(self.uuid, msg))
        try:
            if type(msg) is not str:
                msg = json.dumps(msg)
            self.socket.send(msg)
        except Exception as e:
            print(e)

    def receive(self):
        msg = self.socket.receive()
        try:
            msg = json.load(msg)
        except:
            pass
        logger.info('recv [{}]: {}'.format(self.uuid, msg))

        return msg

    def notify_start(self):
        self.send({"uuid": self.uuid,
                   "op": "start"})

    def notify_number(self, num="-", total="-"):
        self.send({"uuid": self.uuid,
                   "op": "number",
                   "number": num,
                   "total": total})


# TODO: check race condition
def handler():
    # check websocket
    websocket = request.environ.get('wsgi.websocket')
    if not websocket:
        return 'use websocket'

    # check client list
    uri = request.url_rule.rule
    if not __socket_client_dict.get(uri):
        __socket_client_dict[uri] = []

    # Create client instance
    client = SocketClient(uuid.uuid4(), websocket)
    client.notify_start()

    # Notify everyone that there is a new client
    __socket_client_dict[uri].append(client)
    for idx, c in enumerate(__socket_client_dict[uri]):
        c.notify_number(idx, len(__socket_client_dict[uri]) - 1)

    while True:
        message = client.receive()

        # Close socket, mesaage = None
        if message is None:
            # Notify everyone that someone is offline
            __socket_client_dict[uri].remove(client)
            for idx, c in enumerate(__socket_client_dict[uri]):
                c.notify_number(idx, len(__socket_client_dict[uri]) - 1)
            break

    return 'Done'


def server(app, host="0.0.0.0", port=5000, handler_class=WebSocketHandler, *args, **argv):
    global __server
    if not __server:
        __server = WSGIServer((host, port),
                              app,
                              handler_class=WebSocketHandler,
                              *args, **argv)
    return __server

def serve_forever():
    global __server
    if not __server:
        raise Exception("You need call server() first")
    __server.serve_forever()
