FROM hypriot/rpi-node

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
COPY .npmrc /usr/src/app/.npmrc
RUN npm install --production

# Delete .npmrc
RUN rm -f .npmrc

# Bundle app source
COPY . /usr/src/app

# Expose port
EXPOSE 9000

# Start the server
ENV NODE_ENV local
CMD [ "npm", "start" ]
