FROM node:alpine

# App setup

ADD client/docker-bundle.tgz /

ADD client/package.json /tmp/package.json
RUN cd /tmp && yarn --prod
RUN mkdir -p /app && cp -a /tmp/node_modules /app/

WORKDIR /app

# Configuration

ENV NODE_CONFIG_DIR=/config
ENV PORT 80
EXPOSE 80
VOLUME /snacksable
VOLUME /config

CMD yarn start -p ${PORT}
