<script>
    export let nudge
    export let deleteNudge
    export let toggleNudge
    export let updateNudge
</script>

<div class="nudge nudge-dark">
    <div class="flex-grow">
        <span class="font-mono text-sm text-gray-600 mb-1">{nudge.who}</span>
        <span bind:textContent={nudge.what} on:input={() => updateNudge(nudge.id, nudge.what)} class="py-1 text-gray-500 outline-none focus:ring-2 focus:ring-blue-200 rounded px-1" contenteditable="true">{nudge.what}</span>
    </div>
    <div class="flex items-center space-x-3">
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
        </button>
    </div>
</div>