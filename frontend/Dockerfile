# Use an official Ubuntu base image
FROM ubuntu:latest

# Install curl and other necessary packages
RUN apt-get update && \
    apt-get install -y curl gnupg2

# Add NodeSource repository for Node.js
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -

# Install Node.js
RUN apt-get install -y nodejs

# Set npm version
RUN npm install -g npm@8.11.0

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code, including .env and tailwind.config.js
COPY . .

# Set environment variables
ENV PORT=5011

# Expose the port on which the app will run
EXPOSE 5011

# Start the app
CMD ["npm", "start"]
