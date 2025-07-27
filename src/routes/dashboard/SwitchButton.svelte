<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	let { status } = $props();

	// TODO: better invalidate somehow to prevent the buttons from not updating
	function switchStatus() {
		let query = new URLSearchParams(page.url.searchParams.toString());
		const newStatus = status === 'save' ? 'archive' : 'save';
		query.set('status', newStatus);
		goto(`?${query.toString()}`);

		// invalidate('supabase:db:Link');
	}
</script>

<button on:click={switchStatus}>Switch</button>

<style>
	button {
		font-size: 1.4em;
	}
</style>
