<script>
    import Nudge from "$lib/Nudge.svelte"
    import Who from "$lib/Who.svelte"
    let nudge = { who: '', what: '' }
    let nudges = JSON.parse(localStorage.getItem('nudges')) ?? []
    $: { localStorage.setItem('nudges', JSON.stringify(nudges)) }

    function generateId() {
        return Math.random().toString(36).substr(2, 9)
    }

    function addNudge() {
        console.log('Adding Nudge')
        nudges = [...nudges, { id: generateId(), who: nudge.who, what: nudge.what, complete: false, createdAt: new Date() }]
    }

    function toggleNudge(id) {
        console.log('Toggling Nudge')
        nudges = nudges.map(nudge => {
            if (nudge.id === id) {
                return { ...nudge, complete: !nudge.complete }
            }
            return nudge
        })
    }

    function deleteNudge(id) {
        console.log('Deleting Nudge')
        nudges = nudges.filter(nudge => nudge.id !== id)
    }

    function handleSubmit() {
        addNudge()
        nudge = { who: '', what: '' }
        document.querySelectorAll('input').forEach(ele => ele.blur())
    }

    $: filter = 'all'
    $: console.log(filter)
    $: uniqueWhos = [...new Set(nudges.map(nudge => nudge.who))] //.sort(function (a, b) {return a.toLowerCase().localeCompare(b.toLowerCase())})
    $: console.log(uniqueWhos)
    $: filteredNudges = nudges.filter(nudge => nudge.who === filter)

</script>

<section class="p-2 w-full h-screen grid grid-rows-[min-content_1fr_min-content]">
    <section class="mb-2">
        <form on:submit|preventDefault={handleSubmit} class="form-container form-container-dark">
            <div class="flex gap-2">
                <div class="flex-1">
                    <input bind:value={nudge.who} name="new-nudge-who" type="text" placeholder="Who" class="input-field input-field-dark" />
                </div>
                <div class="flex-1">
                    <input bind:value={nudge.what} name="new-nudge-what" type="text" placeholder="What" class="input-field input-field-dark" />
                </div>
                <button class="btn-primary btn-primary-dark">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                </button>
            </div>
        </form>
    </section>

    <section class="space-y-2 mb-2 overflow-y-auto no-draggable">
        {#if filter === 'all'}
            {#each nudges as nudge(nudge.id)}
                <Nudge {nudge} {deleteNudge} {toggleNudge}/>
            {/each}
        {:else}
            {#each filteredNudges as nudge(nudge.id)}
                <Nudge {nudge} {deleteNudge} {toggleNudge}/>
            {/each}
        {/if}
    </section>

    <section class="flex flex-wrap justify-center gap-2">
        {#if uniqueWhos.length > 0}
            <button on:click={() => filter = 'all'} class="btn-primary btn-primary-dark">Show All</button>
            {#each uniqueWhos as who}
                <Who bind:filter {who}/>
            {/each}
        {/if}
    </section>
</section>