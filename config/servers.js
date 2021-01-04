module.exports = {
	Bungee: {
		host: 'mc.left4craft.org:25565', // direct query
		// left4status: 'proxy', // get from left4status
		pterodactyl_id: 'b7eefb65',
		jar: {
			type: 'waterfall',
			version: '1.16',
			name: 'server.jar' // filename on remote server
		},
		max_players: 1,
		plugins_dir: '/plugins/',
		plugins: [
			'BTLP_Bungee',
		]
	},
	Hub: {
		// host: 'mc.left4craft.org:25566',
		left4status: 'hub',
		pterodactyl_id: 'b7eefb65',
		jar: {
			type: 'paper',
			version: '1.16',
			name: 'server.jar' // filename on remote server
		},
		max_players: 1,
		plugins_dir: '/plugins/',
		plugins: [
			'BTLP_Bukkit',
			'EssentialsX',
			'Left4Chat',
			'Spartan',
		]
	},
	Survival: {
		// host: 'mc.left4craft.org:25567',
		left4status: 'survival',
		pterodactyl_id: 'ae2d225a',
		jar: {
			type: 'paper',
			version: '1.16',
			name: 'server.jar' // filename on remote server
		},
		max_players: 1,
		plugins_dir: '/plugins/',
		plugins: [
			'BTLP_Bukkit',
			'EssentialsX',
			'Left4Chat',
			'Spartan',
		]
	},
	Creative: {
		// host: 'mc.left4craft.org:25568',
		left4status: 'creative',
		pterodactyl_id: 'b9357746',
		jar: {
			type: 'paper',
			version: '1.16',
			name: 'server.jar' // filename on remote server
		},
		max_players: 1,
		plugins_dir: '/plugins/',
		plugins: [
			'BTLP_Bukkit',
			'EssentialsX',
			'Left4Chat',
			'Spartan',
		]
	},
	PartyGames: {
		// host: 'mc.left4craft.org:25569',
		left4status: 'partygames',
		pterodactyl_id: '',
		jar: {
			type: 'paper',
			version: '1.16',
			name: 'server.jar' // filename on remote server
		},
		max_players: 1,
		plugins_dir: '/plugins/',
		plugins: [
			'BTLP_Bukkit',
			'EssentialsX',
			'Left4Chat',
			'Spartan',
		]
	},
	Build: {
		// host: 'mc.left4craft.org:25570',
		left4status: 'build',
		pterodactyl_id: '1df7f409',
		jar: {
			type: 'paper',
			version: '1.16',
			name: 'server.jar' // filename on remote server
		},
		max_players: 1,
		plugins_dir: '/plugins/',
		plugins: [
			'BTLP_Bukkit',
			'EssentialsX',
			'Left4Chat',
			'Spartan',
		]
	}
};