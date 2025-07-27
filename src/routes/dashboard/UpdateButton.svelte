<script lang="ts">
	import { invalidate } from '$app/navigation';

	let { id, status, supabase } = $props();

	const newStatus = status === 'save' ? 'archive' : 'save';

	// TODO: make policy more strict by using joins
	async function update() {
		const { data, error } = await supabase
			.from('Link')
			.update({ status: newStatus })
			.eq('id', id)
			.select();

		invalidate('supabase:db:Link');
	}
</script>

<button on:click={update}>{newStatus}</button>
