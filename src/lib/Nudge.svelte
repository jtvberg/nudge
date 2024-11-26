<script>
    import { onMount, onDestroy } from 'svelte';

    export let nudge;
    export let onDelete;
    export let onToggle;
    export let onUpdate;

    const colors = [
        'text-red-500',
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
    ];

    $: ({ complete, created_at } = nudge);
    $: currentColor = generateColor(complete, created_at);
    $: currentAge = getAge(created_at);

    function generateColor(complete, created_at) {
        const colorSaturation = 500;
        const hour = 1000 * 60 * 60;
        const timeDelta = Date.now() - Date.parse(created_at);
        if (complete) return `text-blue-${colorSaturation}`;
        if (timeDelta > hour * 24) return `text-red-${colorSaturation}`;
        if (timeDelta > hour * 3) return `text-yellow-${colorSaturation}`;
        return `text-green-${colorSaturation}`;
    }

    function getAge(created_at) {
        const timeDelta = Date.now() - Date.parse(created_at);
        const hoursDelta = Math.floor(timeDelta / (1000 * 60 * 60));
        return hoursDelta;
    }

    let intervalId;
    let updateTimeout;

    // Debounced update function
    function handleUpdate(event) {
        if (updateTimeout) clearTimeout(updateTimeout);
        updateTimeout = setTimeout(() => {
            onUpdate(nudge.id, event.target.textContent);
        }, 300);
    }

    async function handleDelete() {
        if (!nudge.complete) return;
        try {
            await onDelete(nudge.id);
        } catch (error) {
            console.error('Failed to delete:', error);
        }
    }

    async function handleToggle() {
        try {
            await onToggle(nudge.id);
        } catch (error) {
            console.error('Failed to toggle:', error);
        }
    }

    onMount(() => {
        intervalId = setInterval(
            () => {
                currentAge = getAge(created_at);
                currentColor = generateColor(complete, created_at);
            },
            60 * 5 * 1000,
        );
    });

    onDestroy(() => {
        clearInterval(intervalId);
        clearTimeout(updateTimeout);
    });
</script>

<div class="flex flex-row py-0.5 gap-1 items-center even:bg-[#111111]">
    <div class="font-mono text-sm text-gray-500 pt-0.5 user-select-none">
        {nudge.who}
    </div>
    <div
        bind:textContent={nudge.what}
        on:input={handleUpdate}
        on:keydown={(e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                e.target.blur();
            }
        }}
        class="flex-grow px-1 rounded-md text-gray-200 outline-none focus:ring-2 focus:ring-blue-200"
        contenteditable="true"
        role="textbox"
        tabindex="0"
    >
        {nudge.what}
    </div>
    <div class="font-mono text-sm {currentColor} pt-0.5 user-select-none">
        {currentAge}hrs
    </div>
    <div class="flex items-center space-x-1">
        <input
            type="checkbox"
            checked={nudge.complete}
            on:change={handleToggle}
            class="checkbox checkbox-dark"
        />
        <button
            on:click={handleDelete}
            class="delete-btn delete-btn-dark disabled:opacity-50 disabled:text-gray-500 disabled:cursor-not-allowed"
            aria-label="Delete nudge"
            disabled={!nudge.complete}
        >
            <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                ></path>
            </svg>
        </button>
    </div>
</div>
