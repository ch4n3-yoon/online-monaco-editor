#!/bin/sh
# Launch NGINX
# nginx -g daemon off

service nginx start
uwsgi --ini /app/uwsgi.ini & 

tail -f /dev/null