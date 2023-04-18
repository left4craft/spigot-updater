# Plumber

**An automated update system for Pterodactyl Minecraft servers and their plugins.**


?> **Tip** test

!> **Important** test

Originally made for [Left4Craft](https://www.left4craft.org), this tool integrates with Discord, Pterodactyl, and various other APIs to keep your servers and their plugins up to date with minimal input from owners and admins.

## What it does

This periodically checks your servers and plugins for updates and alerts you through Discord when when it finds a new version. You will be prompted to approve updates and are usually given links to the build/version's changelog.

Once per hour it downloads any updates you have approved, then twice a day it will attempt to upload the downloads JARs. Before uploading, it checks each server's player count, and doesn't update unless and admin reacts to a Discord message to approve it. This it to avoid servers being restarted with lots of players online and when there isn't an admin around to fix it if there is an issue after updating.

## How it works

Look at the code if you want to know exactly how it works.

You can choose between PaperMC or the ServerJars API for your servers.

Plugins can be sourced from GitHub Releases, a Jenkins build server, or SpigotMC.

The server is automatically stopped before and started after uploading, to avoid corruption.

## Limitations

- You can't update a plugin on some servers and not others (except if you have servers with different Minecraft versions, you could have multiple plugins from the same source).

## Installation & setup

[Installation](./installation) and [configuration](./configuration/env).

## Support

[![Discord server](https://discordapp.com/api/guilds/424571587413540874/widget.png?style=banner2)](https://discord.left4craft.org)

## Donate

Sponsor this project at [left4craft.org/shop](https://www.left4craft.org/shop).
