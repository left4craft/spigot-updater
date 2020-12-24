module.exports = {	
	Spartan: {
		source: 'spigot', // spigot | github | jenkins | direct
		url: 'https://www.spigotmc.org/resources/spartan-advanced-anti-cheat-hack-blocker.25638/',
		jar: 'Spartan.jar'
	},
	BTLP_Bungee: {
		source: 'spigot',
		url: 'https://www.spigotmc.org/resources/bungeetablistplus.313/',
		// zip_path: 'BungeeTabListPlus_Bungee.jar', // exact name
		zip_path: /BungeeTabListPlus-\S*\.jar/g, // regex for versioned names
		jar: 'BTLP-Bungee.jar'
	},
	BTLP_Bukkit: {
		source: 'spigot',
		url: 'https://www.spigotmc.org/resources/bungeetablistplus.313/',
		// zip_path: 'BungeeTabListPlus_BukkitBridge.jar', // exact name
		zip_path: /BungeeTabListPlus_BukkitBridge-\S*\.jar/g, // regex for versioned names
		jar: 'BTLP-Bukkit.jar'
	},
	Left4Chat: {
		source: 'github',
		repository: 'left4craft/left4chat',
		asset: 'Left4Chat.jar',
		jar: 'Left4Chat.jar'
	},
	/* EssentialsX: {
		source: 'jenkins',
		host: 'https://ci.ender.zone/',
		job: 'EssentialsX',
		artifact: /EssentialsX-\S*\.jar/g, // regex for versioned names,
		jar: 'EssentialsX.jar'
	}, */
	EssentialsX: {
		source: 'github',
		repository: 'essentialsx/essentials',
		asset: /EssentialsX-\S*\.jar/g, // regex for versioned names,
		jar: 'EssentialsX.jar'
	},
	ProtocolLib: {
		source: 'github',
		repository: 'dmulloy2/protocollib',
		asset: 'ProtocolLib.jar',
		jar: 'ProtocolLib.jar'
	},
};