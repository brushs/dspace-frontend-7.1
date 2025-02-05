# This image will be published as dspace/dspace-angular
# See https://github.com/DSpace/dspace-angular/tree/main/docker for usage details

FROM node:14-alpine

WORKDIR /app
ADD . /app/

# We run yarn install with an increased network timeout (5min) to avoid "ESOCKETTIMEDOUT" errors from hub.docker.com
# See, for example https://github.com/yarnpkg/yarn/issues/5540
RUN yarn install --network-timeout 300000
# Set this to control the environmental config used
#ENV NODE_ENV apption
RUN yarn run config:apption
# Set again to control the type of build to be performed
# ENV NODE_ENV development
RUN yarn run build:prod
#RUN yarn run postinstall


# Expose the port the app runs on
EXPOSE 4000

# Start the Angular Universal server
CMD yarn run serve:ssr
# ENTRYPOINT ["tail", "-f", "/dev/null"]
