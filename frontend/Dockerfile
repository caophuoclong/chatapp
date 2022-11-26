# Build nestjs app
FROM node:latest
WORKDIR /app
COPY package.json yarn.lock ./
RUN npm i -g pm2 yarn
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build
ENV REACT_APP_SERVER_URL=https://api.bebes.site
ENV REACT_APP_WS_URL=wss://api.bebes.site
EXPOSE 3000
CMD ["yarn", "start:build"]
