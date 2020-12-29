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
			'btlp_bungee',
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
			'btlp_bukkit',
			'spartan',
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
			'btlp_bukkit',
			'spartan',
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
			'btlp_bukkit',
			'spartan',
		]
	},
	minigames: {
		// host: 'mc.left4craft.org:25569',
		left4status: 'minigames',
		jar: {
			type: 'paper',
			version: '1.16',
			name: 'server.jar' // filename on remote server
		},
		max_players: 1,
		plugins_dir: '/plugins/',
		plugins: [
			'btlp_bukkit',
			'spartan',
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
			'btlp_bukkit',
			'spartan',
		]
	}
};