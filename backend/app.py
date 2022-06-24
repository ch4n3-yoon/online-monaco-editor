import os
import sys
import time
from functools import wraps
from flask import Flask
from flask import request
from flask import jsonify
from flask_cors import CORS
from apscheduler.schedulers.background import BackgroundScheduler


BASEDIR = os.environ.get("BASEDIR", "../code")



class LastUsedCheck:
    def __init__(self) -> None:
        self.filename = "/tmp/last_used"
        self.set_now()
        self.duration = 60 * 60 * 3 # 3 hours
        # self.duration = 10 # for debugging

    def set_now(self):
        with open(self.filename, "w") as f:
            f.write(str(int(time.time())))
    
    def check_using(self):
        with open(self.filename, "r") as f:
            content = f.read()
        
        now = int(time.time())
        last_used_time = int(content)
        
        if now - last_used_time > self.duration:
            os._exit(-1)
        


time_checker = LastUsedCheck()
def function():
    global time_checker
    
    time_checker.check_using()


sched = BackgroundScheduler(daemon=False)
sched.add_job(function, 'interval', seconds=30)
sched.start()


app = Flask(
    __name__,
)
CORS(app, resources={r'*': {'origins': 'http://localhost:3001'}})


def set_now_working_when_access():
    def _set_now_working_when_access(f):
        @wraps(f)
        def __set_now_working_when_access(*args, **kwargs):
            global time_checker
            time_checker.set_now()
            
            result = f(*args, **kwargs)
            return result
        return __set_now_working_when_access
    return _set_now_working_when_access


def success(data):
    response = jsonify({
        "status": True,
        "data": data,
        "message": ""
    })
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


def fail(message):
    response = jsonify({
        "status": False,
        "data": {},
        "message": message
    })
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


@app.route("/api/ls")
@set_now_working_when_access()
def ls():
    """
    A function that returns a file tree in JSON format for a given path.
    """
    global BASEDIR
    global time_checker
    
    time_checker.set_now()
    
    path = BASEDIR
    root_path = BASEDIR
    
    if not root_path.endswith("/"):
        root_path += "/"

    def filetree_to_dict(path):
        file = {
            "name": os.path.basename(path),
            "path": path.replace(root_path, ""),
        }
        if os.path.isdir(path):
            file["type"] = "directory"
            file["children"] = [
                filetree_to_dict(os.path.join(path, child)) for child in os.listdir(path)
            ]
        else:
            file['type'] = "file"
        return file

    filetree = filetree_to_dict(root_path)
    return jsonify({
        "status": True,
        "data": filetree,
        "message": "",
    })


@app.route("/api/cat")
@set_now_working_when_access()
def cat():
    """
    A function that returns file content for a given file path
    """
    global BASEDIR
    global time_checker
    
    time_checker.set_now()
    
    root_path = BASEDIR
    if not root_path.endswith("/"):
        root_path += "/"
    
    path = request.args.get("path", "")
    path = os.path.join(BASEDIR, path)
    
    if not os.path.isfile(path):
        return ""
    
    if path.find("../") > 0:
        return ""

    try:
        with open(path, "r") as f:
            content = f.read()
    except Exception as e:
        print("[ ERROR ]", e)
        return ""
    
    return jsonify({
        "status": True, 
        "data": {"path": path.replace(root_path, ""), "content": content},
        "message": "",
    })


@app.route("/api/save", methods=["POST"])
@set_now_working_when_access()
def save():
    """ 
    A function that saves file content for a given file path
    """
    global time_checker
    time_checker.set_now()
    
    params = request.get_json()
    path = params.get("path", "")
    content = params.get("content", "")
    
    if not path:
        return fail("path was not provided.")
    
    if path.find("../") > -1:
        return fail("no hack ~_~")
    
    path = os.path.join(BASEDIR, path)
    
    if not os.path.isfile(path):
        return fail("not valid file")

    with open(path, "w") as f:
        f.write(content)
    
    return success({})
    

if __name__ == "__main__":
    app.run(
        host="0.0.0.0", 
        port=5000, 
        debug=True,
    )
