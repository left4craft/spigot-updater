module.exports = {	
	spartan: {
		source: 'spigot', // spigot | github | direct
		url: 'https://www.spigotmc.org/resources/spartan-advanced-anti-cheat-hack-blocker.25638/',
		jar: 'Spartan.jar'
	},
	btlp_bungee: {
		source: 'spigot',
		url: 'https://www.spigotmc.org/resources/bungeetablistplus.313/',
		// zip_path: 'BungeeTabListPlus_Bungee.jar', // exact name
		zip_path: /BungeeTabListPlus-\S*\.jar/g, // regex for versioned names
		jar: 'BTLP-Bungee.jar'
	},
	btlp_bukkit: {
		source: 'spigot',
		url: 'https://www.spigotmc.org/resources/bungeetablistplus.313/',
		// zip_path: 'BungeeTabListPlus_BukkitBridge.jar', // exact name
		zip_path: /BungeeTabListPlus_BukkitBridge-\S*\.jar/g, // regex for versioned names
		jar: 'BTLP-Bungee.jar'
	},
	left4chat: {
		source: 'github',
		repository: 'left4craft/left4chat',
		jar: 'Left4Chat.jar'
	},
};