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
	<nav>
		<a href="/"><img src="logo.png" alt="snarfs logo" width="60" /></a>
	</nav>
	<div>
		<span>{user?.email}</span>
		<button onclick={logout}>Logout</button>
	</div>
</header>
<br />
<hr />
<main>
	<h1>snarfs</h1>
	{@render children()}
</main>

<style>
	header {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 0.4em;
		font-size: 1.2em;
	}
	header > div {
		display: flex;
		gap: 1em;
		flex-wrap: wrap;
	}
	header > div > span {
		font-style: italic;
	}
	header button {
		font-size: 1em;
	}
	h1 {
		padding: 0px;
		margin: 0px;
	}
</style>
