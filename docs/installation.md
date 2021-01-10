# Installation

## Requirements

- Node.JS >=14.x
- A MySQL or MariaDB database
- Minecraft servers running on Pterodactyl

## Instructions

### For hosting on Pterodactyl

1. Create a new server with [a Node.JS egg](https://github.com/parkervcp/eggs/tree/master/bots/discord/discord.js), using this repository
2. Set the "Bot js file" to `src/index.js`
3. On the host machine, create a new file called `Dockerfile`:
```
t chrome dev package and fonts to support major charsets (Chinese, Japanese, Arabic, Hebrew, Thai and a few others)
# Note: this installs the necessary libs to make the bundled version of Chromium that Puppeteer
# installs, work.
RUN apt-get update \
    && apt-get install -y wget gnupg git \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

USER        container
ENV         USER=container HOME=/home/container
WORKDIR     /home/container

COPY        ./entrypoint.sh /entrypoint.sh
CMD         ["/bin/bash", "/entrypoint.sh"]
```

4. Copy the [nodejs entrypoint.sh file](https://github.com/pterodactyl/images/blob/nodejs/entrypoint.sh) into the same directory as Dockerfile, and save it as `entrypoint.sh`
```
#!/bin/ash
cd /home/container

# Make internal Docker IP address available to processes.
export INTERNAL_IP=`ip route get 1 | awk '{print $NF;exit}'`

# Replace Startup Variables
MODIFIED_STARTUP=`eval echo $(echo ${STARTUP} | sed -e 's/{{/${/g' -e 's/}}/}/g')`
echo ":/home/container$ ${MODIFIED_STARTUP}"

# Run the Server
eval ${MODIFIED_STARTUP}
```
5. Build the docker image: `docker build -t puppeteer-chrome-linux .`

6. In your server's startup settings, change the docker image to `puppeteer-chrome-linux:latest`

7. [Configure](../configuration/env)

### For standalone hosting

1. Clone this repository
2. Install dependencies with `npm i`
3. Start with `npm start` or `node src/`
4. [Configure](../configuration/env)
