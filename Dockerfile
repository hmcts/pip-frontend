# ---- Base image ----
FROM hmctspublic.azurecr.io/base/node:18-alpine as base
COPY --chown=hmcts:hmcts . .
USER root
RUN corepack enable
WORKDIR /opt/app
USER hmcts

# ---- Build image ----
FROM base as build
RUN yarn install && yarn build:prod

# ---- Runtime image ----
FROM build as runtime
RUN rm -rf webpack/ webpack.config.js
# TODO: expose the right port for your application
EXPOSE 8080
