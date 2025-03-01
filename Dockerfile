# Use an official Node.js image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (for efficient caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Expose the application port
EXPOSE 3000

# Compile TypeScript to JavaScript
RUN npm run build

# Start the application using the compiled JavaScript
CMD ["node", "dist/index.js"]
