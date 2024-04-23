# build stage
FROM node:19 as build-stage
WORKDIR /app

# copy package files and install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# input arg VUE_APP_OUTPUT_DIR and default value is dist
ARG VUE_APP_OUTPUT_DIR=dist
# input arg NODE_ENV and default value is production
ARG NODE_ENV=production

COPY . .
RUN VUE_APP_OUTPUT_DIR=$VUE_APP_OUTPUT_DIR NODE_ENV=$NODE_ENV yarn build

# copy the dist folder to the nginx container
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY --from=build-stage /app/docker-nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
