#!/usr/bin/env python3
from flask import Flask, render_template, request

import lineup
import genQRcode
from config import qrcode_url

app = Flask(__name__)
app.secret_key = ''

@app.route('/', methods=['GET'])
def root():
    return render_template('index.html')

# add lineup websocket handler
app.add_url_rule('/lineup', 'lineup', lineup.handler)

@app.route('/qrcode', methods=['GET'])
def qrcode():
    return render_template('qrcode.html')


if __name__ == "__main__":
    genQRcode.genQRimg(qrcode_url)
    server = lineup.server(app)
    server.serve_forever()
