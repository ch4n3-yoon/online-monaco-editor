import os
import json
from flask import Flask
from flask import request
from flask import jsonify

from flask_cors import CORS

app = Flask(
    __name__,
    static_folder="static"
)
CORS(app, resources={r'*': {'origins': 'http://172.16.11.11:3000'}})


@app.route("/")
def root():
    with open("./editor.html") as f:
        content = f.read()
    return content


@app.route("/api/ls")
def ls():
    """
    A function that returns a file tree in JSON format for a given path.
    """
    
    path = request.args.get("path", "")
    if path.find("..") > -1:
        return jsonify({})
    
    if path[-1] == "/":
        path = path[0:-1]
    
    path = os.path.join("./code", path)

    def filetree_to_dict(path):
        file = {
            "name": os.path.basename(path),
            "path": path,
        }
        if os.path.isdir(path):
            file["type"] = "directory"
            file["children"] = [
                filetree_to_dict(os.path.join(path, child)) for child in os.listdir(path)
            ]
        else:
            file['type'] = "file"
        return file

    filetree = filetree_to_dict(path)
    return jsonify({
        "status": True,
        "data": filetree,
        "message": "",
    })


@app.route("/api/cat")
def cat():
    """
    A function that returns file content for a given file path
    """
    path = request.args.get("path")
    
    if not os.path.isfile(path):
        return ""
    
    if path.find("../") > -1:
        return ""
    
    try:
        with open(path) as f:
            content = f.read()
    except Exception as e:
        print("[ ERROR ]", e)
        return ""
    
    return jsonify({
        "status": True, 
        "data": content,
        "message": "",
    })


if __name__ == "__main__":
    app.run(
        host="0.0.0.0", 
        port=8000, 
        debug=True,
    )
