FROM node:18-bullseye-slim

# Install Python and core dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

# Install streamgrabber and its browser dependencies
RUN pip3 install streamgrabber
RUN python3 -m playwright install chromium --with-deps

# Set up the Node environment
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 8000
CMD ["npm", "start"]
