FROM node:10-alpine

LABEL name "Listen"
LABEL version "0.1.0"
LABEL maintainer "iCrawl <icrawltogo@gmail.com>"

WORKDIR /usr/src/Listen

COPY package.json yarn.lock ./

RUN apk add --update \
&& apk add --no-cache ca-certificates \
&& apk add --no-cache --virtual .build-deps git curl build-base python g++ make \
&& yarn install \
&& apk del .build-deps

COPY . .

RUN yarn build

ENV NODE_ENV= \
	COMMAND_PREFIX= \
	ID= \
	OWNERS= \
	DISCORD_SERVER_INVITE= \
	DISCORD_BOT_INVITE= \
	TOKEN= \
	WEBSOCKET= \
	WEBSOCKET_KPOP= \
	DB= \
	RADIO_CHANNELS=

CMD ["node", "dist/listen.js"]
