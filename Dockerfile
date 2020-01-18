FROM node:10 AS deps
WORKDIR /usr/src/app
RUN apt update \
    && apt install -y build-essential python
COPY package.json package-lock.json ./
RUN npm install


FROM node:10
WORKDIR /usr/src/app
RUN npm i -g typeorm \
    && apt update \
    && apt-get install -y build-essential python sudo \
    && echo "node ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers
COPY --from=deps /usr/src/app/node_modules node_modules/
COPY . .
RUN npm run build \
    && chown -R node:node .
USER node
