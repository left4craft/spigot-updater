/** @type {import('./$types').LayoutServerLoad} */
export function load() {
	return {
		servers: [
			{
				name: 'Bungee',
				id: 'c1cf5e87',
				console: 'https://panel.left4craft.org/',
				// https://dashflo.net/docs/api/pterodactyl/v1/#req_a8875d2840c64cbdb40e9bdb6cba4f75
				state: 'online', // updating or online/offline
				playerCount: 1,
				plugins: {
					installedCount: 8,
					updatableCount: 2
				},
				software: {
					type: 'waterfall',
					versionsBehind: 0,
				},
			},
			{
				name: 'Hub',
				id: '3103304e',
				console: 'https://panel.left4craft.org/',
				state: 'offline',
				playerCount: 0,
				plugins: {
					installedCount: 10,
					updatableCount: 3
				},
				software: {
					type: 'paper',
					versionsBehind: 7,
				},
			},
			{
				name: 'Survival',
				id: '340e015b',
				console: 'https://panel.left4craft.org/',
				state: 'updating',
				playerCount: 0,
				plugins: {
					installedCount: 27,
					updatableCount: 4
				},
				software: {
					type: 'paper',
					versionsBehind: 7,
				},
			},
			{
				name: 'Creative',
				id: '',
				console: 'https://panel.left4craft.org/',
				state: 'online',
				playerCount: 0,
				plugins: {
					installedCount: 27,
					updatableCount: 4
				},
				software: {
					type: 'paper',
					versionsBehind: 7,
				},
			},
			{
				name: 'Party Games',
				id: '',
				console: 'https://panel.left4craft.org/',
				state: 'online',
				playerCount: 0,
				plugins: {
					installedCount: 27,
					updatableCount: 4
				},
				software: {
					type: 'paper',
					versionsBehind: 7,
				},
			}
		]
	}
}