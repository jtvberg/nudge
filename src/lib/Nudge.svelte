<script>
    import { onMount, onDestroy } from 'svelte'

    export let nudge
    export let deleteNudge
    export let toggleNudge
    export let updateNudge

    const colors = ['text-red-500',
            'text-orange-500',
            'text-yellow-500',
            'text-green-500',
            'text-blue-500',
            'text-red-600',
            'text-orange-600',
            'text-yellow-600',
            'text-green-600',
            'text-blue-600',
            'text-red-700',
            'text-orange-700',
            'text-yellow-700',
            'text-green-700',
            'text-blue-700',
        ]

    function generateColor () {
        const colorSaturation = 500
        const timeDelta = Date.now() - nudge.createdAt
        let color = `text-green-${colorSaturation}`
        if (timeDelta > 1000 * 60 * 60 * 12) {
            color = `text-yellow-${colorSaturation}`
        }
        if (timeDelta > 1000 * 60 * 60 * 24) {
            color = `text-red-${colorSaturation}`
        }
        if (nudge.complete) {
            color = `text-blue-${colorSaturation}`
        }
        return color
    }
    function getAge () {
        const timeDelta = Date.now() - nudge.createdAt
        const hoursDelta = Math.floor(timeDelta / (1000 * 60 * 60))
        return hoursDelta
    }

    $: currentColor = generateColor()
    $: currentAge = getAge()
    
    $: {
        if (nudge) {
            currentColor = generateColor()
            currentAge = getAge()
        }
    }

    let intervalId;

    onMount(() => {
        intervalId = setInterval(() => {
            currentAge = getAge()
            currentColor = generateColor()
        }, 5 * 60 * 1000)
    })

    onDestroy(() => {
        if (intervalId) clearInterval(intervalId);
    })
</script>

<div class="flex flex-row py-0.5 gap-1 items-center even:bg-[#111111]">
    <div class="font-mono text-sm text-gray-500 pt-0.5 user-select-none">{nudge.who}</div>
    <div bind:textContent={nudge.what} on:input={() => updateNudge(nudge.id, nudge.what)} 
        class="flex-grow px-1 rounded-md text-gray-200 outline-none focus:ring-2 focus:ring-blue-200"
        contenteditable="true">{nudge.what}</div>
            <div class="font-mono text-sm {currentColor} pt-0.5 user-select-none">{currentAge}hrs</div>
    <div class="flex items-center space-x-1">
        <input 
            type="checkbox" 
            checked={nudge.complete} 
            on:change={() => toggleNudge(nudge.id)}
            class="checkbox checkbox-dark"
        />
        <button 
            on:click={() => deleteNudge(nudge)}
            class="delete-btn delete-btn-dark disabled:opacity-50 disabled:text-gray-500 disabled:cursor-not-allowed"
            aria-label="Delete nudge"
            disabled={!nudge.complete}
        >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
        </button>
    </div>
</div>