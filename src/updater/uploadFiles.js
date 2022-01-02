const Panel = require('../pterodactyl');
const { getPlayerCount } = require('../utils/minecraft');
const { path } = require('../utils/fs');
const { wait } = require('../utils/');

const {
	PTERO_HOST,
	PTERO_CLIENT_KEY
} = process.env;
const panel = new Panel(PTERO_HOST, PTERO_CLIENT_KEY);

module.exports = async (bot) => {

	let pinged = false;

	for (let server in bot.config.servers) {
		const ID = bot.config.servers[server].pterodactyl_id; // pterodactyl server ID

		// server row
		let s = await bot.db.Servers.findOne({
			where: {
				name: server
			}
		});

		if (!s) {
			s = await bot.db.Servers.create({
				name: server,
				plugins: '{}'
			});
		}

		// server jar row
		let sjar = await bot.db.ServerJars.findOne({
			where: {
				type: bot.config.servers[server].jar.type,
				version: bot.config.servers[server].jar.version
			}
		});

		// an array of plugins that this server uses which need to be uploaded
		let plugins = bot.config.servers[server].plugins
			.filter(async p => {
				let plugin = await bot.db.Plugins.findOne({
					where: {
						name: p
					}
				});
				if (!plugin) return;
				let current = JSON.parse(s.get('plugins'))[p];
				return current !== plugin.get('downloaded');
			});
	
		let jar_needs_updating = s.get('current') !== sjar.get('downloaded');
		if (plugins.length < 1 && !jar_needs_updating) { // if no plugins, and server jar is up to date
			bot.log.info(`${server} has no plugins that need to be uploaded, skipping`);
			continue; // skip this server
		}

		if (!pinged) {
			await bot.channel.send('@here');
			pinged = true;
		}

		let message;

		let max = bot.config.servers[server].max_players;
		let players = await getPlayerCount(bot, server); // server's player count
		if (players > max) {
			message = await bot.channel.send({
				embeds: [bot.utils.createEmbed()
					.setColor('RED')
					.setTitle(`⚠️ ${server} needs to update, but there are more than ${max} players online`)
					.setDescription(`React with ⚠️ to update the server now, whilst there are **${players} players online**, react with ❌ to dismiss.`)
					.addField('Plugins', plugins.map(p => `\`${p}\``).join(', ') || 'None')]
			});
			await message.react('⚠️');
			await message.react('❌');
		} else {
			message = await bot.channel.send({
				embeds: [bot.utils.createEmbed()
					.setColor('ORANGE')
					.setTitle(`📣 ${server} needs to update`)
					.setDescription(`React with ✅ to update the server now, whilst there are **${players} players online**, react with ❌ to dismiss.`)
					.addField('Plugins', plugins.map(p => `\`${p}\``).join(', ') || 'None')]
			});
			await message.react('✅');
			await message.react('❌');
		}

		let updated;
		let dismissed;
		const collector = message.createReactionCollector(
			r => ['✅', '⚠️', '❌'].includes(r.emoji.name) , {
				time: 15 * 60000
			});

		/* let minutes = 14;
		let countdown = setInterval(async () => {
			minutes = minutes--;
			if (minutes > 0)
				await message.edit(
					bot.utils.createEmbed(message.embeds[0])
						.setFooter(`Expires in ${minutes} minutes`)
				);
		}, 60000); */

		collector.on('collect', async (r, u) => {
			collector.stop();
			if (r.emoji.name === '❌') {
				dismissed = u;
				return;
			}

			updated = u;

			// stop the server
			await panel.stop(ID);

			if (jar_needs_updating) {
				// upload the file
				bot.log.info(`Uploading server jar for ${server}`);
				await panel.upload(ID, '/', [
					path(`data/servers/${sjar.get('id')}/server.jar`),
				]);

				await s.update({
					current: sjar.get('downloaded')
				});
			}

			let data = JSON.parse(s.get('plugins'));
			if (plugins.length >= 1) {
				for (let p of plugins) {
					let plugin = await bot.db.Plugins.findOne({
						where: {
							name: p
						}
					});
					data[p] = plugin.get('downloaded');
				}

				await s.update({
					plugins: JSON.stringify(data)
				});
	
				let jars = plugins.map(p => path(`data/plugins/${bot.config.plugins[p].jar}`));
				bot.log.info(`Uploading ${plugins.length} plugins for ${server}`);
				panel.upload(ID, '/plugins/', jars); // upload the files
			}

			/* let tries = 0;
			const check = async () => {
				if (await panel.getPowerState(ID) === 'offline') {
					await panel.start(ID); // start the server
				} else if (tries >= bot.config.kill_after) {
					await panel.kill(ID);
				} else {
					tries = tries ++;
					setTimeout(check, 5000);
				}
					
			};
			check(); */

			if (await panel.getPowerState(ID) === 'offline') {
				await panel.start(ID); // start the server
			} else {
				await wait(5000);
				if (await panel.getPowerState(ID) !== 'offline')
					await panel.kill(ID); // kill the server
				await panel.start(ID); // start the server
			}
			

		});

		collector.on('end', async () => {
			// clearInterval(countdown);
			await message.reactions.removeAll();

			if (updated) {
				bot.log.info(`${updated.tag} authorised ${server} to update`);
				await message.edit(
					bot.utils.createEmbed(message.embeds[0])
						.setColor('DARK_GREEN')
						.setTitle(`✅ ${server} has been updated`)
						.setDescription(`Updated by ${updated}.`)
				);
			} else if (dismissed) {
				bot.log.info(`${dismissed.tag} blocked ${server} from updating`);
				await message.edit(
					bot.utils.createEmbed(message.embeds[0])
						.setColor('DARK_GREEN')
						.setDescription(`Dismissed by ${dismissed}.`)
				);
			} else {
				message.edit(
					bot.utils.createEmbed(message.embeds[0])
						.setColor('DARK_GREEN')
						.setDescription('Timed out')
				);	
			}
		});

	}
	
};
