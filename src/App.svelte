<script>
	import Nudges from '$lib/Nudges.svelte';
	import Login from '$lib/Login.svelte';
	import { authStore } from '$lib/stores/auth.store';
</script>

<main class="app-main app-main-dark">
	{#if !$authStore}
		<Login />
	{/if}
	<Nudges />
</main>
