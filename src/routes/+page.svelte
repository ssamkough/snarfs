<script>
	let { data } = $props();
	let { session } = $derived(data);
</script>

<h1>snarfs</h1>

<h2>
	{#if session}
		<a href="/dashboard">go to dashboard</a>
	{:else}
		<a href="/auth">login</a>
	{/if}
</h2>
