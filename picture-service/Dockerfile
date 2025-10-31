FROM node:lts-alpine
WORKDIR /app
RUN apk --no-cache add curl

COPY *.json .
RUN npm i
COPY public public
COPY src src

CMD npm run dev