FROM node:10 AS deps
WORKDIR /usr/src/app
RUN apt update \
    && apt install -y build-essential python
COPY package.json package-lock.json ./
RUN npm install


FROM node:10
WORKDIR /usr/src/app
RUN npm i -g typeorm
COPY --from=deps /usr/src/app/node_modules node_modules/
COPY . .
RUN npm run build
