FROM node:8.12.0

RUN mkdir /usr/src/app

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

## Set environment to "development" by default
ENV NODE_ENV development

RUN npm install
# If you are building your code for production
#RUN npm install --only=production

#RUN npm i -g cross-env

# Bundle app source
COPY . .

EXPOSE 9003
CMD [ "npm", "start" ]
