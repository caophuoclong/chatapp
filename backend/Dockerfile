# Build nestjs app
FROM node:latest
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build
EXPOSE 3003
CMD ["yarn", "start:prod"]
