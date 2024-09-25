<script>
    export let nudge
    export let deleteNudge
    export let toggleNudge
    export let updateNudge
    const colors = ['bg-red-500',
            'bg-orange-500',
            'bg-yellow-500',
            'bg-green-500',
            'bg-blue-500',
            'bg-red-600',
            'bg-orange-600',
            'bg-yellow-600',
            'bg-green-600',
            'bg-blue-600',
            'bg-red-700',
            'bg-orange-700',
            'bg-yellow-700',
            'bg-green-700',
            'bg-blue-700',
        ]

    function generateColor () {
        const colorSaturation = 600
        const timeDelta = Date.now() - nudge.createdAt
        let color = `bg-green-${colorSaturation}`
        if (timeDelta > 1000 * 60 * 60 * 1) {
            color = `bg-blue-${colorSaturation}`
        }
        if (timeDelta > 1000 * 60 * 60 * 12) {
            color = `bg-yellow-${colorSaturation}`
        }
        if (timeDelta > 1000 * 60 * 60 * 24) {
            color = `bg-red-${colorSaturation}`
        }
        console.log(color)
        return color
    }
    function getAge () {
        const timeDelta = Date.now() - nudge.createdAt
        const hoursDelta = Math.floor(timeDelta / (1000 * 60 * 60))
        return hoursDelta
    }
</script>

<div class="flex flex-row gap-1 items-center">
    <div class="font-mono text-sm text-gray-500 pt-0.5 user-select-none">{nudge.who}</div>
    <div bind:textContent={nudge.what} on:input={() => updateNudge(nudge.id, nudge.what)} 
        class="flex-grow px-1 rounded-md {generateColor()} text-gray-200 outline-none focus:ring-2 focus:ring-blue-200"
        contenteditable="true">{nudge.what}</div>
    <div class="font-mono text-sm text-gray-500 pt-0.5 user-select-none">{getAge()} hours ago</div>
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