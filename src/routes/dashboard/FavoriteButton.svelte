<script lang="ts">
	import { invalidate } from '$app/navigation';

	let { id, isFavorited, supabase } = $props();

	// TODO: make policy more strict by using joins
	async function update() {
		const { data, error } = await supabase
			.from('Link')
			.update({ is_favorited: !isFavorited })
			.eq('id', id)
			.select();

		invalidate('supabase:db:Link');
	}
</script>

<button on:click={update}
	><img src={`/assets/${isFavorited ? 'filled' : 'empty'}-star.png`} alt="" width="20" /></button
>
