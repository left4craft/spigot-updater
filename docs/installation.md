# Installation

## Requirements

- Node.JS >=14.x
- A MySQL or MariaDB database
- Minecraft servers running on Pterodactyl

## Instructions

### For hosting on Pterodactyl

1. Create a new server with [a Node.JS egg](https://github.com/parkervcp/eggs/tree/master/bots/discord/discord.js), using this repository
2. Set the "Bot js file" to `src/index.js`
3. [Configure](../configuration/env)

### For standalone hosting

1. Clone this repository
2. Install dependencies with `npm i`
3. Start with `npm start` or `node src/`
4. [Configure](../configuration/env)
