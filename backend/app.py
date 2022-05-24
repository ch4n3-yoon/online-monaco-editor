import os
from flask import Flask
from flask import request
from flask import jsonify

from flask_cors import CORS

app = Flask(
    __name__,
)
CORS(app, resources={r'*': {'origins': 'http://172.16.11.11:3000'}})


def success(data):
    return jsonify({
        "status": True,
        "data": data,
        "message": ""
    })


def fail(message):
    return jsonify({
        "status": False,
        "data": {},
        "message": message
    })


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
    
    path = os.path.join("/code", path)

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
    
    path = os.path.join("/code", path)
    
    try:
        with open(path) as f:
            content = f.read()
    except Exception as e:
        print("[ ERROR ]", e)
        return ""
    
    return jsonify({
        "status": True, 
        "data": {"path": path, "content": content},
        "message": "",
    })


@app.route("/api/save", methods=["POST"])
def save():
    """ 
    A function that saves file content for a given file path
    """
    params = request.get_json()
    path = params.get("path", "")
    content = params.get("content", "")
    
    if not path:
        return fail("path was not provided.")
    
    if path.find("../") > -1:
        return fail("no hack ~_~")
    
    path = os.path.join("/code", path)
    
    if not os.path.isfile(path):
        return fail("not valid file")

    with open(path, "w") as f:
        f.write(content)
    
    return success({})
    

if __name__ == "__main__":
    app.run(
        host="0.0.0.0", 
        port=8000, 
        debug=True,
    )
