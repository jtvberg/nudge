<script>
    export let nudge
    export let deleteNudge
    export let toggleNudge
</script>

<!-- <div class="nudge-primary">
    <div class="font-mono font-bold">{nudge.who}</div>
    <div class="text-slate-400 outline-none" contenteditable="true">{nudge.topic}</div>
    <input type="checkbox" checked={nudge.nudgeCompleted} on:change={() => toggleNudge(nudge.id)} class="m-2"/>
    <button on:click={() => deleteNudge(nudge.id)} class="bg-red-500 text-white p-2 m-2 rounded-full border border-slate-700">X</button>
</div> -->

<div class="nudge-dark">
    <div class="flex-grow">
        <div class="font-mono text-sm text-gray-600 mb-1">{nudge.who}</div>
        <div class="text-gray-500 outline-none focus:ring-2 focus:ring-blue-200 rounded px-1" contenteditable="true">{nudge.topic}</div>
    </div>
    <div class="flex items-center space-x-3">
        <input 
            type="checkbox" 
            checked={nudge.nudgeCompleted} 
            on:change={() => toggleNudge(nudge.id)} 
            class="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
        />
        <button 
            on:click={() => deleteNudge(nudge.id)} 
            class="text-red-500 hover:text-red-700 transition-colors"
            aria-label="Delete nudge"
        >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
        </button>
    </div>
</div>