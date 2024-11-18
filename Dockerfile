# Use the official Node.js image as the base image
FROM node:20-bullseye

# Set the working directory in the container
WORKDIR /app

COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Update the package list and upgrade existing packages
RUN apt-get update --fix-missing && apt-get upgrade -y && rm -rf /var/lib/apt/lists/*

# Install system dependencies in one step to reduce layer size
RUN apt-get update && apt-get install -y \
    ca-certificates \
    curl \
    libgtk-3-0 \
    libx11-xcb1 \
    libasound2 \
    libnss3 \
    libxss1 \
    libxrandr2 \
    libatk-bridge2.0-0 \
    libgbm-dev \
    libpangocairo-1.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdrm2 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    xvfb \
    dbus-x11 \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/*

# Run the build step
RUN npm run build

# Set DISPLAY environment variable for Xvfb
ENV DISPLAY=:99

# Expose any port that the app may use
EXPOSE 5173

# Use a command to start the Electron app in development mode
CMD ["sh", "-c", "service dbus start && xvfb-run -a npm run dev"]
