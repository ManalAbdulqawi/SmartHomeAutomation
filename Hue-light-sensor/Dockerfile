FROM node:20.1.0

WORKDIR /hueapp

COPY ./ ./

RUN npm install

EXPOSE 7070

CMD [ "npm", "start" ]