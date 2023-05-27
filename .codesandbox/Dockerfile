FROM ubuntu
RUN apt update -y && apt install -y nginx curl curl
RUN bash -c "curl -sL https://deb.nodesource.com/setup_18.x | bash -"
RUN apt update -y && apt install -y nodejs
COPY nginx.conf /etc/nginx/nginx.conf