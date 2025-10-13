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
	<div style="display: flex; gap: 1em;">
		<img src="logo.svg" alt="snarfs logo" width="60" />
		<button onclick={logout}>Logout</button>
	</div>
	<div>
		<input id="color-mode" type="checkbox" name="color-mode" />
		<label for="color-mode">
			<span class="dark-mode-hide">Dark Mode</span>
			<span class="light-mode-hide">Light Mode</span>
		</label>
	</div>
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
