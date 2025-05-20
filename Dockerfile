# 1. Official Node.js 14 (Debian Bullseye)
FROM node:14-bullseye

# 2. Non-interactive APT (avoid prompts)
ARG DEBIAN_FRONTEND=noninteractive
ENV TZ=Etc/UTC

# 3. Install system dependencies for native modules and legacy Python 2
#    - build-essential: gcc, g++, make for native builds
#    - python2.7 & python2.7-dev: legacy Python 2.7 and headers for node-gyp
#    - python-is-python2: symlink /usr/bin/python → python2.7 for compatibility
#    - libasound2-dev: ALSA headers for MIDI support
#    - libudev-dev: hardware access
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
       build-essential \
       python2.7 \
       python2.7-dev \
       python-is-python2 \
       libasound2-dev \
       libudev-dev \
       ca-certificates \
       curl \
       gnupg && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 4. Create & set workdir Create & set workdir
WORKDIR /usr/src/app

# 5. Copy package manifests and install dependencies
COPY package*.json ./
RUN npm install

# 6. Copy application source
COPY . ./

# 7. Expose any ports if your service listens
# EXPOSE 3000

# 8. Default command: start Node.js app
#
# Note: ALSA sequencer device access must be enabled at runtime via Docker options.
# For example:
#   docker build -t roompad .
#   docker run -it --rm \
#     --device /dev/snd:/dev/snd \
#     --group-add $(getent group audio | cut -d: -f3) \
#     roompad

CMD ["node", "."]
