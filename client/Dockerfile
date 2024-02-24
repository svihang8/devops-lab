# pull official base image
FROM node:13.12.0-alpine

# set working directory
WORKDIR /app

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent

# install app
COPY . .

# expose port
EXPOSE 3000

# start app
CMD ["npm", "start"]
