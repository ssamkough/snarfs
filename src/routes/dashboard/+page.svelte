<script lang="ts">
	import { invalidate } from '$app/navigation';
	import type { EventHandler } from 'svelte/elements';

	let { data } = $props();
	let { links, supabase, user } = $derived(data);

	const handleSubmit: EventHandler<SubmitEvent, HTMLFormElement> = async (evt) => {
		evt.preventDefault();
		if (!evt.target) return;
		const form = evt.target as HTMLFormElement;

		const url = (new FormData(form).get('url') ?? '') as string;
		if (!url) {
			console.debug('Failed to retrieve URL!');
			return;
		}

		const { data, error: linkError } = await supabase.from('Link').insert({ url }).select();
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
	<h2>Dashboard</h2>
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
					<span>{link.is_favorited}</span>
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
		width: 600px;
		font-size: 1.4em;
	}
	form > input {
		height: 30px;
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
	ul > li > a {
		font-size: 1.4em;
	}
</style>
