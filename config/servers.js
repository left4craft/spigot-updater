module.exports = {
	bungee: {
		host: 'mc.left4craft.org:25565', // direct query
		// left4status: 'proxy', // get from left4status
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
	hub: {
		// host: 'mc.left4craft.org:25566',
		left4status: 'hub',
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
	survival: {
		// host: 'mc.left4craft.org:25567',
		left4status: 'survival',
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
	creative: {
		// host: 'mc.left4craft.org:25568',
		left4status: 'creative',
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
	partygames: {
		// host: 'mc.left4craft.org:25569',
		left4status: 'partygames',
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
	build: {
		// host: 'mc.left4craft.org:25570',
		left4status: 'build',
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