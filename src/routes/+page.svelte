<script lang="ts">
  import type { PageData } from "./$types";
  import { goto } from "$app/navigation";

  export let data: PageData;

  const { budgets = [], expenses = [] } = data;
  let editingBudget: (typeof budgets)[0] | null = null;

  function totalSpent(cat: string) {
    return expenses
      .filter((e: any) => e.category === cat)
      .reduce((s: any, e: any) => s + Number(e.amount ?? 0), 0);
  }

  function editBudget(b: any) {
    editingBudget = { ...b };
  }

  async function saveEdit() {
    await fetch("/api/budget", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingBudget),
    });
    editingBudget = null;
    goto("/");
  }
</script>

<h1 class="text-2xl font-bold mb-4">Spending Tracker</h1>

<a href="/new-budget" class="underline text-blue-500">Add Budget Category</a><br
/>
<a href="/new-expense" class="underline text-blue-500">Add Spending</a>

<h2 class="text-xl font-semibold mt-6">Summary</h2>

{#if editingBudget}
  <div
    class="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center p-4"
  >
    <div class="bg-white p-4 rounded-lg w-full max-w-sm">
      <h2 class="font-bold mb-2">Edit Budget</h2>
      <input
        bind:value={editingBudget.category}
        placeholder="Category"
        class="border p-2 w-full mb-2"
      />
      <input
        type="number"
        bind:value={editingBudget.monthly_limit}
        placeholder="Limit (RM)"
        class="border p-2 w-full mb-2"
      />
      <div class="flex justify-between">
        <button
          class="bg-blue-500 text-white px-4 py-2 rounded"
          on:click={saveEdit}>Save</button
        >
        <button
          class="bg-gray-300 px-4 py-2 rounded"
          on:click={() => (editingBudget = null)}>Cancel</button
        >
      </div>
    </div>
  </div>
{/if}

{#if budgets.length === 0}
  <p class="mt-2 text-gray-600">No budgets yet. Add one to get started.</p>
{/if}

{#each budgets as b}
  <div class="border p-3 mt-2 rounded-lg shadow-sm">
    <div class="flex justify-between items-center mb-2">
      <p class="font-semibold">{b.category}</p>
      <button class="text-blue-500 text-sm" on:click={() => editBudget(b)}>
        Edit
      </button>
    </div>
    <p>Limit: RM {b.monthly_limit}</p>
    <p>Used: RM {totalSpent(b.category)}</p>
    <p>Remaining: RM {b.monthly_limit - totalSpent(b.category)}</p>
  </div>
{/each}
