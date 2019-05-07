#!/usr/bin/env python3
from flask import Flask, render_template

import lineup

app = Flask(__name__)
app.secret_key = ''


@app.route('/', methods=['GET'])
def root():
    return render_template('index.html')

# add lineup websocket handler
app.add_url_rule('/lineup', 'lineup', lineup.handler)

if __name__ == "__main__":
    server = lineup.server(app)
    server.serve_forever()
