FROM node:18.18.0

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose API port to the outside
ENV ADDRESS=0.0.0.0 PORT=3000

# Transpile TypeScript to JavaScript
RUN npm run build

# Command to run the application
CMD ["npm", "run", "start"]