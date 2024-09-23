<script>
    export let nudge
    export let deleteNudge
    export let toggleNudge
    export let updateNudge
</script>

<div class="flex flex-row gap-1 items-center">
    <div class="font-mono text-sm text-gray-500 pt-0.5 user-select-none">{nudge.who}</div>
    <div bind:textContent={nudge.what} on:input={() => updateNudge(nudge.id, nudge.what)} 
        class="flex-grow px-1 rounded-md bg-gray-900 text-gray-500 outline-none focus:ring-2 focus:ring-blue-200" 
        contenteditable="true">{nudge.what}</div>
    <div class="flex items-center space-x-1">
        <input 
            type="checkbox" 
            checked={nudge.complete} 
            on:change={() => toggleNudge(nudge.id)}
            class="checkbox checkbox-dark"
        />
        <button 
            on:click={() => deleteNudge(nudge)}
            class="delete-btn delete-btn-dark"
            aria-label="Delete nudge"
        >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
        </button>
    </div>
</div>