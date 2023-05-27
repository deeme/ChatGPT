#!/bin/bash
URL=${HOSTNAME}-8081.csb.app
while true; do curl -s "https://$URL" >/dev/null 2>&1 && echo "$(date +'%Y%m%d%H%M%S') Keeping online ..." && sleep 300; done &

cd api
npm run server-dev &

nginx -g 'daemon off;'