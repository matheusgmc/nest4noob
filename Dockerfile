FROM node:16.17-slim

RUN apt-get update && apt-get install -y procps
RUN apt update && apt install openssl libc6 

WORKDIR /nest4noobs/

COPY yarn.lock package.json ./
COPY prisma ./prisma/

RUN yarn

COPY . .

