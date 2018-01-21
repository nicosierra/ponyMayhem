FROM node:9-alpine

# Install dumb-init to pass termination signals
# dumb-init installation:
# https://github.com/joelnb/dumb-init-docker/blob/master/alpine/Dockerfile
RUN \
  apk add --update \
  python \
  python-dev \
  py-pip \
  build-base \
  && \
  pip install dumb-init && \
  apk del \
  python \
  python-dev \
  py-pip \
  build-base \
  && \
  rm -rf /var/cache/apk/* && \
  :

RUN mkdir /pony
WORKDIR pony
COPY ./src /pony/src
COPY ./config /pony/config

COPY package.json .
COPY package-lock.json /tmp

RUN cp package.json /tmp && cd /tmp && npm install --production
RUN cp -a /tmp/node_modules /pony

ENTRYPOINT ["dumb-init", "node", "src/index.js"]
