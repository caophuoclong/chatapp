# Build nestjs app
FROM node:14-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
RUN npm i -g pm2
COPY . .
RUN yarn build:docker
EXPOSE 3000
CMD ["yarn", "start:build"]
