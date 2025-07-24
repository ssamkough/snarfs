<script>
	let { data, children } = $props();
	let { supabase, user } = $derived(data);

	const logout = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error(error);
		}
	};
</script>

<header>
	<img src="logo.svg" alt="snarfs logo" width="60" />
	<button onclick={logout}>Logout</button>
</header>
<main>
	{@render children()}
</main>

<style>
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 0.4em;
		font-size: 1.2em;
		padding-bottom: 0.4em;
		border-bottom: 1px solid black;
	}
	header > button {
		height: fit-content;
		font-size: 1em;
	}
</style>
