module.exports = {
	Bungee: {
		host: 'mc.left4craft.org:25565', // direct query
		pterodactyl_id: 'c1cf5e87',
		jar: {
			type: 'waterfall',
			version: '1.19',
		},
		max_players: 4,
		plugins: [
			'BTLP_Bungee',
            'LiteBans',
            'LuckPerms_Bungee',
            'VulcanBungee'
		]
	},
	Hub: {
		host: '10.8.0.2:25566',
		// left4status: 'hub',
		pterodactyl_id: '3103304e',
		jar: {
			type: 'paper',
			version: '1.19',
		},
		max_players: 1,
		plugins: [
            'BTLP_Bukkit',
            'FAWE',
            'LiteBans',
            'LibsDisguises',
            'LuckPerms_Bukkit',
            'MyCommand',
            'ProtocolLib',
            'SimplePortals',
            'Vault',
			'Vulcan'
		]
	},
	Survival: {
		host: '10.8.0.2:25567',
		// left4status: 'survival',
		pterodactyl_id: '340e015b',
		jar: {
			type: 'paper',
			version: '1.19',
		},
		max_players: 1,
		plugins: [
			'BTLP_Bukkit',
            'CMILib',
            'CoreProtect',
			'EssentialsX',
            'EssentialsX_Spawn',
            'GriefPrevention',
            'LibsDisguises',
            'LuckPerms_Bukkit',
            'MarketPlace',
            'MyCommand',
            'NuVotifier',
            'PlaceholderAPI',
            'ProtocolLib',
            'SleepMost',
            'StackMob',
            'SuperbVote',
            'TradeMe',
            'TreeAssist',
            'Vault',
            'Vulcan',
            'WorldEdit',
            'WorldGuard'
		]
	},
	Creative: {
		host: '10.8.0.2:25568',
		// left4status: 'creative',
		pterodactyl_id: '518cfb0e',
		jar: {
			type: 'paper',
			version: '1.19',
		},
		max_players: 1,
		plugins: [
            'BTLP_Bukkit',
            'EssentialsX',
            'EssentialsX_Spawn',
            'FAWE',
            'LibsDisguises',
            'LuckPerms_Bukkit',
            'MyCommand',
            'PlotSquared',
            'ProtocolLib',
            'Vault',
			'Vulcan',
            'WorldGuard'
		]
	},
	PartyGames: {
		host: '10.8.0.2:25569',
		// left4status: 'partygames',
		pterodactyl_id: 'c3e508fd',
		jar: {
			type: 'paper',
			version: '1.19',
		},
		max_players: 1,
		plugins: [
            'BTLP_Bukkit',
            'FAWE',
            'LeaderHeads',
            'LuckPerms_Bukkit',
            'MyCommand',
            'PlaceholderAPI',
            'ProtocolLib',
            'Vault',
			'Vulcan'
		]
	},
    /*
	Build: {
		// host: 'mc.left4craft.org:25570',
		left4status: 'build',
		pterodactyl_id: '1df7f409',
		jar: {
			type: 'paper',
			version: '1.16',
		},
		max_players: 1,
		plugins: [
			'BTLP_Bukkit',
			'EssentialsX',
			'Left4Chat',
			// 'Spartan',
		]
	}
    */
};