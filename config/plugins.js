module.exports = {	
    /*
    Spartan: {
		source: 'spigot', // spigot | github | jenkins | direct
		// url: 'https://www.spigotmc.org/resources/spartan-advanced-anti-cheat-hack-blocker.25638/',
		resource: 25638,
		jar: 'Spartan.jar'
	},
	BTLP_Bungee: {
		source: 'spigot',
		// url: 'https://www.spigotmc.org/resources/bungeetablistplus.313/',
		resource: 313,
		// zip_path: 'BungeeTabListPlus_Bungee.jar', // exact name
		zip_path: /BungeeTabListPlus-\S*\.jar/g, // regex for versioned names
		jar: 'BTLP-Bungee.jar'
	},
	BTLP_Bukkit: {
		source: 'spigot',
		// url: 'https://www.spigotmc.org/resources/bungeetablistplus.313/',
		resource: 313,
		// zip_path: 'BungeeTabListPlus_BukkitBridge.jar', // exact name
		zip_path: /BungeeTabListPlus_BukkitBridge-\S*\.jar/g, // regex for versioned names
		jar: 'BTLP-Bukkit.jar'
	},
	Companies: {
		source: 'spigot',
		resource: 16712,
		jar: 'Companies.jar'
	},
	Left4Chat: {
		source: 'github',
		repository: 'left4craft/left4chat',
		asset: 'Left4Chat.jar',
		jar: 'Left4Chat.jar'
	},
    */
    CMILib: {
        source: 'spigot',
        url: 'https://www.spigotmc.org/resources/cmilib.87610/',
        resource: 87610,
        jar: 'CMILib.jar'
    },
    CoreProtect: {
        source: 'spigot',
        url: 'https://www.spigotmc.org/resources/coreprotect.8631/',
        resource: 8631,
        jar: 'CoreProtect.jar'
    },
    GriefPrevention: {
        source: 'bukkit',
        url: 'https://dev.bukkit.org/projects/grief-prevention/',
        jar: 'GriefPrevention.jar'
    },
    LeaderHeads: {
        source: 'spigot',
        url: 'https://www.spigotmc.org/resources/leaderheads.2079/',
        resource: 2079,
        jar: 'LeaderHeads.jar'
    },
    LiteBans: {
		source: 'spigot', // spigot | github | jenkins | direct
		url: 'https://www.spigotmc.org/resources/litebans.3715/',
		resource: 3715,
		jar: 'LiteBans.jar'
	},
    MarketPlace: {
        source: 'spigot',
        url: 'https://www.spigotmc.org/resources/marketplace-safe-and-easy-player-market-discord-notifications-web-client-db-logs.48526/',
        resource: 48526,
        jar: 'MarketPlace.jar'
    },
    MyCommand: {
		source: 'spigot', // spigot | github | jenkins | direct
		url: 'https://www.spigotmc.org/resources/mycommand.22272/',
		resource: 22272,
		jar: 'MyCommand.jar'
	},
    PlaceholderAPI: {
        source: 'spigot',
        url: 'https://www.spigotmc.org/resources/placeholderapi.6245/',
        resource: 6245,
        jar: 'PlaceholderAPI.jar'
    },
    PlotSquared: {
        source: 'spigot',
        url: 'https://www.spigotmc.org/resources/plotsquared-v6.77506/',
        resource: 77506,
        jar: 'PlotSquared.jar'
    },
    ProCosmetics: {
		source: 'spigot', // spigot | github | jenkins | direct
		url: 'https://www.spigotmc.org/resources/procosmetics-300-cosmetics-treasurechests-eula-compliant-1-8-1-18-support.49106/',
		resource: 49106,
		jar: 'ProCosmetics.jar'
	},
    SleepMost: {
        source: 'spigot',
        url: 'https://www.spigotmc.org/resources/sleep-most-1-8-1-18-1-the-most-advanced-sleep-plugin-available.60623/',
        resource: 60623,
        jar: 'SleepMost.jar'
    },
    StackMob: {
        source: 'spigot',
        url: 'https://www.spigotmc.org/resources/stackmob-enhance-your-servers-performance-without-the-sacrifice.29999/',
        resource: 29999,
        jar: 'StackMob.jar'
    },
    SuperbVote: {
        source: 'spigot',
        url: 'https://www.spigotmc.org/resources/superbvote.11626/',
        resource: 11626,
        jar: 'SuperbVote.jar'
    },
    TradeMe: {
        source: 'spigot',
        url: 'https://www.spigotmc.org/resources/trademe-with-api-to-create-custom-trades-1-7-10-1-17-x.7544/',
        resource: 7544,
        jar: 'TradeMe.jar'
    },
    TreeAssist: {
        source: 'spigot',
        url: 'https://www.spigotmc.org/resources/treeassist.67436/',
        resource: 67436,
        jar: 'TreeAssist.jar'
    },
    Vulcan: {
		source: 'spigot', // spigot | github | jenkins | direct
		url: 'https://www.spigotmc.org/resources/vulcan-anti-cheat-advanced-cheat-detection-1-7-1-18-1.83626/',
		resource: 83626,
		jar: 'Vulcan.jar'
	},
    VulcanBungee: {
        source: 'spigot',
        url: 'https://www.spigotmc.org/resources/vulcanbungee-bungee-hook-for-vulcan-anti-cheat.94194/',
        resource: 94194,
        jar: 'VulcanBungee.jar'
    },
    WorldEdit: {
        source: 'bukkit',
        url: 'https://dev.bukkit.org/projects/worldedit/',
        jar: 'WorldEdit.jar'
    },
    WorldGuard: {
        source: 'bukkit',
        url: 'https://dev.bukkit.org/projects/worldguard/',
        jar: 'WorldGuard.jar'
    },
    BTLP_Bukkit: {
		source: 'jenkins',
		job: 'BungeeTabListPlus',
        host: 'https://ci.codecrafter47.de/',
		artifact: /BungeeTabListPlus_BukkitBridge-.*\.jar/g,
		jar: 'BungeeTabListPlus-Bukkit.jar'
    },
    BTLP_Bungee: {
		source: 'jenkins',
		job: 'BungeeTabListPlus',
        host: 'https://ci.codecrafter47.de/',
		artifact: /BungeeTabListPlus-.*\.jar/g,
		jar: 'BungeeTabListPlus.jar'
    },
	EssentialsX: {
		source: 'jenkins',
		job: 'EssentialsX',
        host: 'https://ci.ender.zone/',
		// artifact: /EssentialsX-\S*\.jar/g, // regex for versioned names
		artifact: /EssentialsX-.*\.jar/g, // {{build}} placeholder for jenkins
		jar: 'EssentialsX.jar'
    },
	EssentialsX_Spawn: {
		source: 'jenkins',
		job: 'EssentialsX',
        host: 'https://ci.ender.zone/',
		// artifact: /EssentialsX-\S*\.jar/g, // regex for versioned names
		artifact: /EssentialsXSpawn-.*\.jar/g, // {{build}} placeholder for jenkins
		jar: 'EssentialsXSpawn.jar'
    },
	FAWE: {
		source: 'jenkins',
		job: 'FastAsyncWorldEdit',
        host: 'https://ci.athion.net/',
		artifact: /FastAsyncWorldEdit-Bukkit-.*\.jar/g,
		jar: 'FastAsyncWorldEdit.jar'
    },
    LibsDisguises: {
		source: 'jenkins',
		job: 'LibsDisguises',
        host: 'https://ci.md-5.net/',
		artifact: 'LibsDisguises.jar',
		jar: 'LibsDisguises.jar'
    },
    LuckPerms_Bukkit: {
		source: 'jenkins',
		job: 'LuckPerms',
        host: 'https://ci.lucko.me/',
		// artifact: /EssentialsX-\S*\.jar/g, // regex for versioned names
		artifact: /LuckPerms-Bukkit-.*\.jar/g, // {{build}} placeholder for jenkins
		jar: 'LuckPerms-Bukkit.jar'
    },
    LuckPerms_Bungee: {
		source: 'jenkins',
		job: 'LuckPerms',
        host: 'https://ci.lucko.me/',
		// artifact: /EssentialsX-\S*\.jar/g, // regex for versioned names
		artifact: /LuckPerms-Bungee-.*\.jar/g, // {{build}} placeholder for jenkins
		jar: 'LuckPerms-Bungee.jar'
    },
    ProtocolLib: {
		source: 'jenkins',
		job: 'ProtocolLib',
        host: 'https://ci.dmulloy2.net/',
		artifact: 'ProtocolLib.jar',
		// artifact: /LuckPerms-Bukkit-.*\.jar/g, // {{build}} placeholder for jenkins
		jar: 'ProtocolLib.jar'
    },
    CoreProtect: {
        source: 'github',
        repository: 'PlayPro/CoreProtect',
        asset: /CoreProtect-.*\.jar/g,
        jar: 'CoreProtect.jar'
    },
    NuVotifier: {
        source: 'github',
        repository: 'NuVotifier/NuVotifier',
        asset: 'nuvotifier.jar',
        jar: 'NuVotifier.jar'
    },
    SimplePortals: {
        source: 'github',
		repository: 'XZot1K/SimplePortals',
		asset: /SimplePortals.*\.jar/g,
		jar: 'SimplePortals.jar'
    },
    Vault: {
        source: 'github',
		repository: 'milkbowl/Vault',
		asset: 'Vault.jar',
		jar: 'Vault.jar'
    }
    /*
	ProtocolLib: {
		source: 'github',
		repository: 'dmulloy2/protocollib',
		asset: 'ProtocolLib.jar',
		jar: 'ProtocolLib.jar'
	},
	FAWE: {
		source: 'jenkins',
		host: 'https://ci.athion.net',
		job: 'FastAsyncWorldEdit-1.17',
		artifact: 'FastAsyncWorldEdit-1.17-{{build}}.jar', // {{build}} placeholder for jenkins
		jar: 'FastAsyncWorldEdit.jar'
	}
    */
};