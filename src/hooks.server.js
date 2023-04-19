import { SvelteKitAuth } from "@auth/sveltekit";
import Discord from "@auth/core/providers/discord";
import { ADMINS, DISCORD_ID, DISCORD_SECRET } from "$env/static/private";
import { redirect } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

export const handle = sequence(
	SvelteKitAuth({
		providers: [Discord({ clientId: DISCORD_ID, clientSecret: DISCORD_SECRET })],
		callbacks: {
			redirect: ({ baseUrl }) => baseUrl + '/admin',
			signIn: (params) => {
				const admins = ADMINS.split(",");
				const allowed = admins.includes(params.profile.id);
				if (allowed) return true;
				else return '/auth/unauthorised';
			}
		}
	}),
	async function auth({ event, resolve }) {
		if (event.url.pathname.startsWith("/admin")) {
			const session = await event.locals.getSession();
			if (!session?.user) throw redirect(303, "/auth/login");
		}

		return resolve(event);
	}
);