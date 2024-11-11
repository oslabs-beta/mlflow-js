# Set the base image, node v22.7
FROM node:22.7
# Set up a WORKDIR for application in the container and set it to /usr/src/app
WORKDIR /usr/src/app
# Copy all of your application files to the WORKDIR in the container
COPY . .
# RUN a command to npm install your node_modules in the container
RUN npm install
# RUN a command to build your application in the container
RUN npm run build
# EXPOSE your server port (5001)
EXPOSE 5001
# Set up a CMD to run this Docker container
ENTRYPOINT ["mlflow.js"]