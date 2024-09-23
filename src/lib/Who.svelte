<script>
    export let filter
    export let who

    function filterNudges() {
        filter = who === 'Show All' ? 'all' : who
    }
    
    function generateColor (val) {
        const colors = ['bg-red-700', 
            'bg-orange-700', 
            'bg-amber-700', 
            'bg-yellow-700', 
            'bg-lime-700', 
            'bg-green-700', 
            'bg-emerald-700', 
            'bg-teal-700', 
            'bg-cyan-700', 
            'bg-sky-700', 
            'bg-blue-700', 
            'bg-indigo-700', 
            'bg-violet-700', 
            'bg-purple-700', 
            'bg-fuchsia-700', 
            'bg-pink-700', 
            'bg-rose-700']
        const charCode = val.who.toLowerCase().charCodeAt(0)
        return colors[charCode % colors.length]
    }
</script>

<button on:click={filterNudges} class="filter-btn filter-btn-dark {generateColor({who})}">{who}</button>