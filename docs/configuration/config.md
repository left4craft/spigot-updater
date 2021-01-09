# Config

The general configuration file, [`config/config.js`](https://github.com/Left4Craft/spigot-updater/blob/master/config/config.js).

## Options

??? summary "server"
	### server_name

	The name of your Minecraft server.

??? summary "color"
	### color

	Your primary colour, used in Discord message embeds.

??? summary "channel_id"
	### channel_id

	The ID of a channel in your Discord server that will be used for update messages. Only admins should have access to this channel.

??? summary "server_jars_api"
	### server_jars_api

	The API you want to use to get updates and downloads for server jars (spigot, paper, bungeecord, etc).

	=== "papermc (recommended)"
		Supports **major versions only** (`1.15`, `1.16` etc)

		- `waterfall`
		- `paper`
		- `taverntine`

	=== "serverjars"
		Supports minor versions (`1.16.1`, `1.16.2` etc) and `latest`.

		- `nukkitx`
		- `pocketmine`
		- `magma`
		- `mohist`
		- `travertine`
		- `bungeecord`
		- `velocity`
		- `waterfall`
		- `bukkit`
		- `paper`
		- `spigot`
		- `snapshot`
		- `vanilla`

??? summary "left4status"
	### left4status

	:octicons-info-24: Optional
	{ : .details }

	Used for getting the server count if a server has the `left4status` property and not the `host` property. Must be an instance of [Left4Status](https://github.com/Left4Craft/Left4Status).

??? summary "headless_browser"
	### headless_browser

	:octicons-milestone-24: Default: `true`
	{ : .details }

	Whether or not the SpigotMC browser should run in headless mode.

??? summary "download_time"
	### download_time

	:octicons-milestone-24: Default: `10000`
	{ : .details }

	Number of milliseconds to wait for plugins to download from SpigotMC. Include at least an additional 5 seconds (5000) for Cloudflare. 10 seconds should be ok for fast connections.

??? summary "save_logs"
	### save_logs

	:octicons-milestone-24: Default: `true`
	{ : .details }

	Save log files to `logs/`?

??? summary "debug"
	### debug

	:octicons-milestone-24: Default: `false`
	{ : .details }

	Enable additional debug logging?
