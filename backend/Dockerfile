# Build nestjs app
FROM node:latest
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build:docker
ENV NODE_ENV=production
EXPOSE 3003
CMD ["yarn", "start:prod"]
