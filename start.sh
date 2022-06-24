#!/bin/sh
# Launch NGINX
# nginx -g daemon off

service nginx start
# uwsgi --ini /app/uwsgi.ini & 
python3 /app/app.py

# tail -f /dev/null
