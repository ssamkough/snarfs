<script lang="ts">
	import { invalidate } from '$app/navigation';
	import type { EventHandler } from 'svelte/elements';

	let { data } = $props();
	let { links, supabase, user } = $derived(data);

	const handleSubmit: EventHandler<SubmitEvent, HTMLFormElement> = async (evt) => {
		console.log('submit');
		evt.preventDefault();
		if (!evt.target) return;

		console.log('hi');

		const form = evt.target as HTMLFormElement;

		const url = (new FormData(form).get('url') ?? '') as string;
		console.log('url', url);
		if (!url) {
			console.debug('Failed to retrieve URL!');
			return;
		}

		const { data, error } = await supabase.from('Link').insert({ url }).select();
		if (error) {
			console.error(error);
			return;
		}

		const { error: userLinkError } = await supabase
			.from('UserLink')
			.insert({ user_id: user?.id, link_id: data[0].id });
		if (userLinkError) console.error(userLinkError);

		invalidate('supabase:db:Link');
		form.reset();
	};
</script>

<h1>Signed-in user: {user?.email}</h1>
<form onsubmit={handleSubmit}>
	<label for="url">Add a link</label>
	<input name="url" type="url" />
	<button type="submit">submit</button>
</form>

<h2>Links</h2>
<ul>
	{#each links as link}
		<li>{link.url}</li>
	{/each}
</ul>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 1em;
		width: 600px;
	}
	button {
		width: fit-content;
	}
</style>
