<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  let category = "";
  let amount: number;
  let categories: { category: string; monthly_limit?: number }[] = [];
  let loading = false;

  onMount(async () => {
    categories = await fetch("/api/budget").then((r) => r.json());
  });

  async function save() {
    if (!category || amount <= 0) return alert("Please enter valid values");
    loading = true;
    await fetch("/api/expense", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, amount }),
    });
    goto('/');
    loading = false;
  }
</script>

<div class="p-4 max-w-md mx-auto">
  <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">Add Expense</h1>

  <div class="flex flex-col gap-4">
    <select
      bind:value={category}
      class="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 w-full"
    >
      <option value="">Select category</option>
      {#each categories as c}
        <option value={c.category}>{c.category}</option>
      {/each}
    </select>

    <input
      type="number"
      bind:value={amount}
      placeholder="Amount used (RM)"
      class="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 w-full"
    />

    <button
      disabled={loading}
      class="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-all"
      on:click={save}
    >
      Save Expense
    </button>
  </div>
</div>
