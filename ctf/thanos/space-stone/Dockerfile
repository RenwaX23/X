FROM node:24-alpine

# Set working directory
WORKDIR /app

# Disable NPM scripts via environment variable
ENV NPM_CONFIG_IGNORE_SCRIPTS=true

# Create a non-root user to run the application
RUN addgroup -S appuser && adduser -S -G appuser appuser

# Copy package.json
COPY package.json ./

# Disable NPM scripts and install dependencies
RUN npm config set ignore-scripts true && \
    npm i

# Copy application code
COPY . .

# Expose the port your app runs on (adjust if different)
EXPOSE 8085

# Switch to non-root user
USER appuser

# Run the server
CMD [ "node", "index.js" ]