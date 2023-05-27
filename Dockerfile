FROM node:18.16.0
WORKDIR /api
COPY /api/package*.json /api/
RUN npm install
COPY /api/ /api/
EXPOSE 3080
ENV HOST=0.0.0.0
CMD ["npm", "start"]