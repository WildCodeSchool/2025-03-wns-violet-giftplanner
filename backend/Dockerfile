FROM node:lts-alpine
WORKDIR /app
RUN apk --no-cache add curl

COPY jest.config.js .
COPY *.json .
RUN npm i
COPY public public
COPY tests tests
COPY src src

CMD npm run dev