<script>
    export let filter
    export let who

    function filterNudges() {
        filter = who === 'Show All' ? 'all' : who
    }
    
    function generateColor () {
        const colors = ['bg-red-600', 'bg-blue-600', 'bg-green-600', 'bg-yellow-600', 'bg-purple-600', 'bg-pink-600', 'bg-indigo-600', 'bg-cyan-600']
        const charCode = who.charCodeAt(0)
        return colors[charCode % colors.length]
    }
</script>

<button on:click={filterNudges} class="filter-btn-dark {generateColor()}">{who}</button>