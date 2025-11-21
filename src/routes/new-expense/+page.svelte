<!-- src/routes/new-expense/+page.svelte -->
<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  let category = "";
  let amount = 0;
  let categories: { category: string; monthly_limit?: number }[] = [];

  onMount(async () => {
    categories = await fetch("/api/budget").then((r) => r.json());
  });

  async function save() {
    await fetch("/api/expense", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, amount }),
    });
    goto("/");
  }
</script>

<h1 class="text-xl font-bold mb-4">Add Expense</h1>

<select bind:value={category} class="border p-2 block">
  <option value="">Select category</option>
  {#each categories as c}
    <option value={c.category}>{c.category}</option>
  {/each}
</select>

<input
  type="number"
  bind:value={amount}
  class="border p-2 block mt-2"
  placeholder="Amount used"
/>
<button class="bg-green-500 text-white px-4 py-2 mt-3 rounded" on:click={save}>
  Save
</button>
