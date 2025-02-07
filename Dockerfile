# This image will be published as dspace/dspace-angular
# See https://github.com/DSpace/dspace-angular/tree/main/docker for usage details

FROM node:14-bullseye

WORKDIR /app
ADD . /app/

# We run yarn install with an increased network timeout (5min) to avoid "ESOCKETTIMEDOUT" errors from hub.docker.com
# See, for example https://github.com/yarnpkg/yarn/issues/5540
RUN yarn install --network-timeout 300000
# Set this to control the environmental config used
RUN yarn run config:apption
# Set again to control the type of build to be performed
RUN yarn run build:prod

ENV NODE_ENV=production

# Install OpenSSH and set the password for root to "Docker!"
ENV SSH_PASSWD "root:Docker!"
RUN apt-get update \
        && apt-get install -y --no-install-recommends dialog \
        && apt-get update \
  && apt-get install -y --no-install-recommends openssh-server \
  && echo "$SSH_PASSWD" | chpasswd

# Copy the sshd_config file to the /etc/ssh/ directory
COPY sshd_config /etc/ssh/

# Copy and configure the ssh_setup file
RUN mkdir -p /tmp
COPY ssh_setup.sh /tmp
RUN sed -i 's/\r//g' /tmp/ssh_setup.sh
RUN chmod +x /tmp/ssh_setup.sh \
    && (sleep 1;/tmp/ssh_setup.sh 2>&1 > /dev/null)

# Expose
EXPOSE 4000 2222

# Start the Angular Universal server
#CMD yarn run serve:ssr
#CMD NODE_ENV=production && yarn run serve:ssr
CMD ["sh", "-c", "/usr/sbin/sshd && export NODE_ENV=production && node dist/server"]
