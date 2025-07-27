<script>
	import { invalidate } from '$app/navigation';

	let { id, url, supabase } = $props();

	// TODO: make policy more strict by using joins
	async function trash() {
		const message = `Do you want to remove this link? ${id}`;
		if (confirm(message)) {
			// Performs a cascade that deletes the appropriate `UserLink` row
			const { data: linkDeleteData } = await supabase.from('Link').delete().eq('id', id).select();
			console.log('link delete data', linkDeleteData);
			if (linkDeleteData?.length < 1) {
				alert(`Failed to delete link with url: ${url}`);
				return;
			}
		}

		invalidate('supabase:db:Link');
	}
</script>

<button on:click={trash}>trash</button>
