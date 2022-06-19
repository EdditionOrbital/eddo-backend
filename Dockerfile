#  Dockerfile for Node Express Backend

FROM node:current-alpine

# Create App Directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install Dependencies
COPY package*.json ./

RUN npm install -g npm@8.12.2
RUN npm install

# Copy app source code
COPY . .

# Exports
EXPOSE 4000

CMD ["npm","start"]
