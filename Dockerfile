FROM node:20-bookworm-slim

# Install Python and core dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Fix: Create a standard python symlink if missing
RUN ln -sf /usr/bin/python3 /usr/bin/python

# Install streamgrabber and its required headless browser dependencies
RUN pip3 install --break-system-packages streamgrabber
RUN python3 -m playwright install chromium --with-deps

# Set up the Node API project environment
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 8080
CMD ["npm", "start"]
