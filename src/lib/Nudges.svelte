<script>
    import Nudge from "$lib/Nudge.svelte"
    import Who from "$lib/Who.svelte"
    let nudge = { who: '', topic: '' }
    let nudges = JSON.parse(localStorage.getItem('nudges')) ?? []
    $: { localStorage.setItem('nudges', JSON.stringify(nudges)) }

    function generateId() {
        return Math.random().toString(36).substr(2, 9)
    }

    function addNudge() {
        console.log('Adding Nudge')
        nudges = [...nudges, { id: generateId(), who: nudge.who, topic: nudge.topic, nudgeCompleted: false }]
    }

    function toggleNudge(id) {
        console.log('Toggling Nudge')
        nudges = nudges.map(nudge => {
            if (nudge.id === id) {
                return { ...nudge, nudgeCompleted: !nudge.nudgeCompleted }
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
        nudge = { who: '', topic: '' }
        document.querySelectorAll('input').forEach(ele => ele.blur())
    }

    $: filter = 'all'
    $: console.log(filter)
    $: uniqueWhos = [...new Set(nudges.map(nudge => nudge.who)).add('Show All')]
    $: filteredNudges = nudges.filter(nudge => nudge.who === filter)

</script>

<!-- <main class="p-4 w-full bg-slate-900">
    <section>
        <form on:submit|preventDefault={handleSubmit}>
            <label for="new-nudge-title" class="text-white">Who</label>
            <input bind:value={nudge.who} name="new-nudge-title" type="text" placeholder="AA" class="bg-slate-900 text-white p-2 m-2 rounded-sm border border-slate-700" />
            <label for="new-nudge-body" class="text-white">What</label>
            <input bind:value={nudge.topic} name="new-nudge-body" type="text" placeholder="Topic" class="bg-slate-900 text-white p-2 m-2 rounded-sm border border-slate-700" />
            <button class="bg-cyan-400 text-slate-900 p-2 m-2 rounded-sm border border-slate-700">Add Nudge</button>
        </form>
    </section>
    <section>
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
    <section class="flex">
        {#if uniqueWhos.length > 0}
            {#each uniqueWhos as who}
                <Who bind:filter {who}/>
            {/each}
        {/if}
    </section>
</main> -->

<main class="p-6 w-full bg-gray-100 min-h-screen">
    <section class="mb-8">
        <form on:submit|preventDefault={handleSubmit} class="bg-white shadow-sm rounded-lg p-6 space-y-4">
            <div class="flex flex-col sm:flex-row sm:space-x-4">
                <div class="flex-1 mb-4 sm:mb-0">
                    <label for="new-nudge-title" class="block text-sm font-medium text-gray-700 mb-1">Who</label>
                    <input bind:value={nudge.who} name="new-nudge-title" type="text" placeholder="AA" 
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div class="flex-1">
                    <label for="new-nudge-body" class="block text-sm font-medium text-gray-700 mb-1">What</label>
                    <input bind:value={nudge.topic} name="new-nudge-body" type="text" placeholder="Topic" 
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
            </div>
            <button class="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                Add Nudge
            </button>
        </form>
    </section>

    <section class="space-y-4 mb-8">
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

    <section class="flex flex-wrap gap-2">
        {#if uniqueWhos.length > 0}
            {#each uniqueWhos as who}
                <Who bind:filter {who}/>
            {/each}
        {/if}
    </section>
</main>