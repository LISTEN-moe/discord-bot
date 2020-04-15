FROM node:12-alpine
LABEL name "Listen"
LABEL version "0.1.0"
LABEL maintainer "iCrawl <icrawltogo@gmail.com>"
WORKDIR /usr/src/Listen
COPY package.json pnpm-lock.yaml ./
RUN apk add --update \
&& apk add --no-cache ca-certificates \
&& apk add --no-cache --virtual .build-deps git curl build-base python g++ make \
&& curl -L https://unpkg.com/@pnpm/self-installer | node \
&& pnpm i \
&& apk del .build-deps
COPY . .
RUN pnpm run build
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
