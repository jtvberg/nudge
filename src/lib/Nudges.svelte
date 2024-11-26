<script>
    import { onDestroy } from 'svelte';
    import { nudgeStore } from './stores/nudges.store';
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

    onDestroy(() => {
        nudgeStore.destroy();
    });
</script>

<section
    class="gap-2 p-2 w-full h-screen grid grid-rows-[min-content_1fr_min-content]"
>
    <section>
        <form
            on:submit|preventDefault={handleSubmit}
            class="form-container form-container-dark"
        >
            <div class="flex gap-1">
                <div class="flex-1">
                    <input
                        bind:value={nudge.who}
                        name="new-nudge-who"
                        type="text"
                        placeholder="Who"
                        class="input-field input-field-dark"
                    />
                </div>
                <div class=" flex-[2]">
                    <input
                        bind:value={nudge.what}
                        name="new-nudge-what"
                        type="text"
                        placeholder="What"
                        class="input-field input-field-dark"
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

    <section class="flex flex-wrap justify-center gap-1.5">
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
</section>
