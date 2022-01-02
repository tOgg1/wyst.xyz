FROM node:16.9.0-alpine

RUN npm install -g serve

ADD build /app

CMD ["serve", "-s", "/app"]
