![GitHub issues](https://img.shields.io/github/issues/Left4Craft/spigot-updater?style=for-the-badge)
![GitHub pull requests](https://img.shields.io/github/issues-pr/Left4Craft/spigot-updater?style=for-the-badge)
![GitHub Repo stars](https://img.shields.io/github/stars/Left4Craft/spigot-updater?style=for-the-badge)
![GitHub deployments](https://img.shields.io/github/deployments/Left4Craft/spigot-updater/github-pages?label=GitHub%20Pages&style=for-the-badge)
![GitHub top language](https://img.shields.io/github/languages/top/Left4Craft/spigot-updater?color=yellow&style=for-the-badge)
![GitHub tag (latest SemVer pre-release)](https://img.shields.io/github/v/tag/Left4Craft/spigot-updater?include_prereleases&style=for-the-badge)
![GitHub](https://img.shields.io/github/license/Left4Craft/spigot-updater?style=for-the-badge)
<!-- ![GitHub package.json version](https://img.shields.io/github/package-json/v/Left4Craft/spigot-updater?style=for-the-badge) -->

# Spigot updater

**An automated update system for Pterodactyl Minecraft servers and their plugins.**

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

Visit [the docs](https://left4craft.github.io/spigot-updater/) for installation, setup, and configuration instructions.

## Support

[![Discord server](https://discordapp.com/api/guilds/424571587413540874/widget.png?style=banner2)](https://discord.left4craft.org)

## Donate

Sponsor this project at [left4craft.org/shop](https://www.left4craft.org/shop).
