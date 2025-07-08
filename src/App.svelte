<script>
	import Nudges from '$lib/Nudges.svelte';
	import Login from '$lib/Login.svelte';
	import { authStore } from '$lib/stores/auth.store';
	import Signup from './lib/Signup.svelte';
</script>

<main class="app-main app-main-dark">
	{#if !$authStore}
		<Login />
		<Signup />
	{/if}
	<Nudges />
</main>
