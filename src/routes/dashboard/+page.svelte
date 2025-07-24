<script lang="ts">
	import { invalidate } from '$app/navigation';
	import type { EventHandler } from 'svelte/elements';

	let { data } = $props();
	let { links, supabase, user } = $derived(data);

	function formatUrl(url: string) {
		let newUrl = url;

		// remove trailing slash
		newUrl = newUrl.replace(/\/$/, '');

		return newUrl;
	}

	const handleSubmit: EventHandler<SubmitEvent, HTMLFormElement> = async (evt) => {
		evt.preventDefault();
		if (!evt.target) return;
		const form = evt.target as HTMLFormElement;

		const url = (new FormData(form).get('url') ?? '') as string;
		if (!url) {
			const message = 'Failed to retrieve URL!';
			alert(message);
			console.debug(message);
			return;
		}

		const rawUrl = new URL(url);
		if (!rawUrl) {
			const message = 'Not a URL!';
			alert(message);
			console.error(message);
			return;
		}

		const cleanUrl = formatUrl(url);

		const { data, error: linkError } = await supabase
			.from('Link')
			.insert({ url: cleanUrl })
			.select();
		if (linkError) {
			console.error(linkError);
			return;
		}

		const { error: userLinkError } = await supabase
			.from('UserLink')
			.insert({ user_id: user?.id, link_id: data[0].id });
		if (userLinkError) {
			console.error(userLinkError);
			return;
		}

		invalidate('supabase:db:Link');
		form.reset();
		document.getElementsByTagName('input')[0].focus();
	};

	function formattedUrl(urlString: string) {
		const url = new URL(urlString);
		return `${url.hostname}${url.pathname}`;
	}

	function formattedDate(dateString: string) {
		const dateObj = new Date(dateString);
		const month = dateObj.getUTCMonth() + 1; // months from 1-12
		const day = dateObj.getUTCDate();
		const year = dateObj.getUTCFullYear();

		const pMonth = month.toString().padStart(2, '0');
		const pDay = day.toString().padStart(2, '0');
		return `${year}/${pMonth}/${pDay}`;
	}
</script>

<div>
	<form onsubmit={handleSubmit}>
		<label for="url">Add a link</label>
		<input autofocus name="url" type="url" />
		<button type="submit">submit</button>
	</form>
	<h2>Links</h2>
	<ul>
		{#each links as link}
			<li>
				<a href={link.url}>{formattedUrl(link.url)}</a>
				<div>
					<span>{formattedDate(link.created_at)}</span>
					<span>{link.status}</span>
					<span
						><img
							src={`/assets/${link.is_favorited ? 'filled' : 'empty'}-star.png`}
							alt=""
							width="20"
						/></span
					>
				</div>
			</li>
		{/each}
	</ul>
</div>

<style>
	div:has(form) {
		padding-top: 1em;
		display: flex;
		flex-direction: column;
		gap: 1em;
	}
	h2 {
		margin: 0px;
	}
	form {
		display: flex;
		flex-direction: column;
		gap: 0.4em;
		max-width: 600px;
		font-size: 1.4em;
	}
	form > input {
		height: 30px;
		font-size: 1.2em;
	}
	form > button {
		width: fit-content;
		font-size: 1em;
		padding: 0.4em;
	}
	ul {
		margin: 0px;
		display: flex;
		flex-direction: column;
		gap: 1em;
	}
	ul > li {
		padding-inline: 0.2em;
		word-wrap: break-word;
	}
	ul > li > a {
		font-size: 1.4em;
	}
	ul > li > div {
		display: flex;
		gap: 1em;
	}
</style>
