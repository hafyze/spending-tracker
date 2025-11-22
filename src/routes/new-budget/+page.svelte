<script lang="ts">
  import { goto } from "$app/navigation";

  let category = "";
  let monthly_limit = 0;

  async function save() {
    if (!category || monthly_limit <= 0)
      return alert("Please enter valid values");
    await fetch("/api/budget", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, monthly_limit }),
    });
    goto('/');
  }
</script>

<div class="p-4 max-w-md mx-auto">
  <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">
    Add Budget Category
  </h1>

  <div class="flex flex-col gap-4">
    <input
      bind:value={category}
      placeholder="Category"
      class="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
    />
    <input
      type="number"
      bind:value={monthly_limit}
      placeholder="Limit (RM)"
      class="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
    />
    <button
      class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-all"
      on:click={save}
    >
      Save Budget
    </button>
  </div>
</div>
