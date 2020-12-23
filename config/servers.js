module.exports = {
	bungee: {
		host: 'mc.left4craft.org:25565', // direct query
		// left4status: 'proxy', // get from left4status
		version: '1.16',
		max_players: 1,
		plugins_dir: '/plugins/',
		plugins: [
			'btlp_bungee',
		]
	},
	hub: {
		// host: 'mc.left4craft.org:25566',
		left4status: 'hub',
		version: '1.16',
		max_players: 1,
		plugins_dir: '/plugins/',
		plugins: [
			'btlp_bukkit',
			'spartan',
		]
	},
	survival: {
		left4status: 'survival',
		version: '1.16',
		max_players: 1,
		plugins_dir: '/plugins/',
		plugins: [
			'btlp_bukkit',
			'spartan',
		]
	},
	creative: {
		left4status: 'creative',
		version: '1.16',
		max_players: 1,
		plugins_dir: '/plugins/',
		plugins: [
			'btlp_bukkit',
			'spartan',
		]
	},
	minigames: {
		left4status: 'minigames',
		version: '1.16',
		max_players: 1,
		plugins_dir: '/plugins/',
		plugins: [
			'btlp_bukkit',
			'spartan',
		]
	},
	build: {
		left4status: 'build',
		version: '1.16',
		max_players: 1,
		plugins_dir: '/plugins/',
		plugins: [
			'btlp_bukkit',
			'spartan',
		]
	}
};