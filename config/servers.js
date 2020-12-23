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