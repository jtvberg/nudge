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

<!-- <button on:click={filterNudges} class="{generateColor()} rounded-3xl p-1 m-1">{who}</button> -->

<button
    on:click={filterNudges} 
    class="{generateColor()} px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ease-in-out hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50">
    {who}
</button>