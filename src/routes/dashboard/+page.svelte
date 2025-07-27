<script lang="ts">
	import { invalidate } from '$app/navigation';
	import type { EventHandler } from 'svelte/elements';
	import DeleteButton from './DeleteButton.svelte';
	import FavoriteButton from './FavoriteButton.svelte';
	import SwitchButton from './SwitchButton.svelte';
	import UpdateButton from './UpdateButton.svelte';

	let { data } = $props();
	let { links, status, supabase, user } = $derived(data);

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
			alert(linkError.message);
			return;
		}

		const { error: userLinkError } = await supabase
			.from('UserLink')
			.insert({ user_id: user?.id, link_id: data[0].id });
		if (userLinkError) {
			console.error(userLinkError);
			alert(userLinkError.message);
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
	<div class="container">
		<form onsubmit={handleSubmit}>
			<label for="url">Add a link</label>
			<input autofocus name="url" type="url" />
			<button type="submit">submit</button>
		</form>
		<div>
			<h2>Links: {status}</h2>
			<SwitchButton {status} />
		</div>
	</div>
	<ul>
		{#each links as link}
			<li>
				<div>
					<a href={link.url}>{formattedUrl(link.url)}</a>
					<div>
						{formattedDate(link.created_at)}
					</div>
				</div>
				<div>
					<FavoriteButton id={link.id} isFavorited={link.is_favorited} {supabase} />
					<UpdateButton id={link.id} status={link.status} {supabase} />
					<DeleteButton id={link.id} url={link.url} {supabase} />
				</div>
			</li>
		{/each}
	</ul>
</div>

<style>
	.container {
		width: 100svw;
	}
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
	form + div {
		display: flex;
		justify-content: space-between;
	}
	ul {
		margin: 0px;
		padding: 0px;
		display: flex;
		flex-direction: column;
		gap: 1em;
	}
	ul > li {
		padding-inline: 0.2em;
		word-wrap: break-word;
		display: flex;
		justify-content: space-between;
		gap: 0.2em;
	}
	div:has(a) {
		width: 240px;
	}
	ul li a {
		text-overflow: ellipsis;
		font-size: 1.2em;
	}
	ul > li > div:nth-child(2) {
		display: flex;
		gap: 0.4em;
		height: 50px;
	}
	ul > li > div > div {
		display: flex;
		gap: 1em;
	}
</style>
