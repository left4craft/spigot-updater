# ENV

Rename `example.env` to `.env`.

It should look like this:

```env
DISCORD_TOKEN=

DB_HOST=
DB_USER=
DB_PASS=
DB_NAME=

PTERO_HOST=
PTERO_CLIENT_KEY=

SPIGOT_EMAIL=
SPIGOT_PASSWORD=
```

## Options

??? summary "DISCORD_TOKEN"
	### DISCORD_TOKEN

	Create a new bot application on the [Discord Developer Portal](https://discord.com/developers/applications) and copy the token.

??? summary "DB_HOST"
	### DB_HOST

	You need to create a MySQL or MariaDB database. You **don't** need to create any tables, it will be done automatically. For a non-standard port, append `:port` (eg: `127.0.0.1:3306`)

??? summary "DB_USER"
	### DB_USER

	The database username.

??? summary "DB_PASS"
	### DB_PASS

	The database password.

??? summary "DB_NAME"
	### DB_NAME

	The name of the database.

??? summary "PTERO_HOST"
	### PTERO_HOST

	The address for your Pterodactyl installation - eg: `https://panel.example.org`

??? summary "PTERO_CLIENT_KEY"
	### PTERO_CLIENT_KEY

	Create a new API key at `/account/api` (panel.example.org/account/api)

??? summary "SPIGOT_EMAIL"
	### SPIGOT_EMAIL

	:octicons-info-24: Optional
	{: .details }

	Only required if you have premium plugins. The email address for your SpigotMC account.

??? summary "SPIGOT_PASSWORD"
	### SPIGOT_PASSWORD

	:octicons-info-24: Optional
	{: .details }

	Only required if you have premium plugins. The password for your SpigotMC account.

	2FA is not supported.
