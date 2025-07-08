<script>
    import { onDestroy, onMount } from 'svelte';
    import { nudgeStore } from './stores/nudges.store';
    import { authStore } from './stores/auth.store';
    import Nudge from '$lib/Nudge.svelte';
    import Who from '$lib/Who.svelte';

    let nudge = { who: '', what: '' };
    $: nudges = $nudgeStore;

    function sortNudges(nudges) {
        return nudges.sort((a, b) => {
            if (a.complete !== b.complete) {
                return a.complete ? 1 : -1;
            }
            return a.created_at - b.created_at;
        });
    }

    async function handleSubmit() {
        try {
            await nudgeStore.add(nudge);
            nudge = { who: '', what: '' };
            document.querySelectorAll('input').forEach((ele) => ele.blur());
        } catch (error) {
            console.error('Failed to add nudge:', error);
        }
    }

    async function handleLogout() {
        try {
            await authStore.signOut();
        } catch (error) {
            console.error('Failed to logout:', error);
        }
    }

    $: filter = 'all';
    $: uniqueWhos = [...new Set(nudges.map((nudge) => nudge.who))].sort(
        function (a, b) {
            return a.toLowerCase().localeCompare(b.toLowerCase());
        },
    );
    $: sortedNudges = sortNudges(nudges);
    $: filteredNudges = sortNudges(
        nudges.filter((nudge) => nudge.who === filter),
    );

    window.addEventListener('auth-signout', () => {
        nudgeStore.clear();
    });

    window.addEventListener('auth-signin', () => {
        nudgeStore.initializeSync();
    });

    onDestroy(() => {
        nudgeStore.destroy();
        window.removeEventListener('auth-signout', () => nudgeStore.clear());
        window.removeEventListener('auth-signin', () =>
            nudgeStore.initializeSync(),
        );
    });


    let whoInput;
    let whatInput;
    let whoSuggestions = [];
    let showSuggestions = false;
    let selectedSuggestionIndex = 0;

    $: userWhos = [...new Set(nudges.map(n => n.who).filter(Boolean))];

    $: if (nudge.who) {
        whoSuggestions = userWhos
            .filter(who => who.toLowerCase().startsWith(nudge.who.toLowerCase()) && who.toLowerCase() !== nudge.who.toLowerCase());
        showSuggestions = whoSuggestions.length > 0;
        selectedSuggestionIndex = 0;
    } else {
        whoSuggestions = [];
        showSuggestions = false;
    }

    function handleWhoKeydown(e) {
        if (showSuggestions && (e.key === 'Tab' || e.key === 'ArrowRight')) {
            e.preventDefault();
            nudge.who = whoSuggestions[selectedSuggestionIndex];
            showSuggestions = false;
            whatInput && whatInput.focus();
        } else if (showSuggestions && e.key === 'ArrowDown') {
            e.preventDefault();
            selectedSuggestionIndex = (selectedSuggestionIndex + 1) % whoSuggestions.length;
        } else if (showSuggestions && e.key === 'ArrowUp') {
            e.preventDefault();
            selectedSuggestionIndex = (selectedSuggestionIndex - 1 + whoSuggestions.length) % whoSuggestions.length;
        }
    }

    function handleSuggestionClick(suggestion) {
        nudge.who = suggestion;
        showSuggestions = false;
        whatInput && whatInput.focus();
    }
</script>

<section
    class="gap-2 p-2 w-full h-screen grid grid-rows-[min-content_1fr_min-content]"
>
    <section>
        <form
            on:submit|preventDefault={handleSubmit}
            class="form-container form-container-dark"
        >
            <div class="flex gap-1 relative">
                <div class="flex-1 relative">
                    <input
                        bind:this={whoInput}
                        bind:value={nudge.who}
                        name="new-nudge-who"
                        type="text"
                        placeholder="Who"
                        class="input-field input-field-dark py-0"
                        autocomplete="off"
                        on:keydown={handleWhoKeydown}
                    />
                    {#if showSuggestions}
                        <ul class="absolute z-10 bg-gray-800 border border-gray-700 rounded mt-1 w-full max-h-32 overflow-auto">
                            {#each whoSuggestions as suggestion, i}
                                <li>
                                    <button type="button" class="w-full text-left px-2 py-1 cursor-pointer {i === selectedSuggestionIndex ? 'bg-blue-700 text-white' : ''}" on:mousedown|preventDefault={() => handleSuggestionClick(suggestion)}>
                                        {suggestion}
                                    </button>
                                </li>
                            {/each}
                        </ul>
                    {/if}
                </div>
                <div class=" flex-[2]">
                    <input
                        bind:this={whatInput}
                        bind:value={nudge.what}
                        name="new-nudge-what"
                        type="text"
                        placeholder="What"
                        class="input-field input-field-dark py-0"
                    />
                </div>
                <button class="btn-primary btn-primary-dark">
                    <svg
                        class="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        ></path>
                    </svg>
                </button>
            </div>
        </form>
    </section>

    <section
        class="flex flex-col py-0.5 h-fit max-h-full overflow-y-auto no-draggable"
    >
        {#if filter === 'all'}
            {#each sortedNudges as nudge (nudge.id)}
                <Nudge
                    {nudge}
                    onDelete={nudgeStore.delete}
                    onToggle={nudgeStore.toggle}
                    onUpdate={nudgeStore.update}
                />
            {/each}
        {:else}
            {#each filteredNudges as nudge (nudge.id)}
                <Nudge
                    {nudge}
                    onDelete={nudgeStore.delete}
                    onToggle={nudgeStore.toggle}
                    onUpdate={nudgeStore.update}
                />
            {/each}
        {/if}
    </section>

    <section class="flex flex-wrap justify-center gap-1.5 mx-10">
        {#if uniqueWhos.length > 0}
            {#if filter === 'all'}
                {#each uniqueWhos as who}
                    <Who bind:filter {who} />
                {/each}
            {:else}
                <button
                    on:click={() => (filter = 'all')}
                    class="filter-btn filter-btn-dark">Show All</button
                >
            {/if}
        {/if}
    </section>
    {#if $authStore}
        <div class="h-4 w-4 absolute right-5 bottom-5">
            <button
                on:click={handleLogout}
                class="btn-primary btn-primary-dark p-[3px]"
                title="Logout"
            >
                <svg
                    class="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 21 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    ></path>
                </svg>
            </button>
        </div>
    {/if}
</section>
