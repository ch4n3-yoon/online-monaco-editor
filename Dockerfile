FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN sed -i 's/archive.ubuntu.com/mirror.kakao.com/g' /etc/apt/sources.list
RUN sed -i 's/security.ubuntu.com/mirror.kakao.com/g' /etc/apt/sources.list
RUN sed -i 's/extras.ubuntu.com/mirror.kakao.com/g' /etc/apt/sources.list

RUN apt-get update -y
RUN apt-get upgrade -y

RUN apt-get install -y python3 python3-pip 
RUN apt-get install -y nginx
RUN apt-get install -y curl net-tools

WORKDIR /app/
COPY ./backend/requirements.txt ./
RUN pip3 install -r requirements.txt

COPY ./backend/app.py ./

RUN pip3 install uwsgi
COPY ./backend/uwsgi.ini ./

COPY ./default.conf /etc/nginx/sites-available/default
COPY ./frontend/build/ /var/www/html

COPY start.sh /app/
RUN chmod +x start.sh

CMD ["./start.sh"]