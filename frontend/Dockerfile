# Build nestjs app
FROM node:latest
WORKDIR /app
COPY package.json yarn.lock ./
RUN npm i pm2 -g
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build
EXPOSE 3000
CMD ["yarn", "start:build"]
