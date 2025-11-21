<!-- src/routes/+page.svelte -->
<script lang="ts">
  import type { PageData } from "./$types";
  export let data: PageData;

  const { budgets = [], expenses = [] } = data;

  function totalSpent(cat: string) {
    return expenses
      .filter((e) => e.category === cat)
      .reduce((s, e) => s + Number(e.amount ?? 0), 0);
  }
</script>

<h1 class="text-2xl font-bold mb-4">Spending Tracker</h1>

<a href="/new-budget" class="underline text-blue-500">Add Budget Category</a><br />
<a href="/new-expense" class="underline text-blue-500">Add Spending</a>

<h2 class="text-xl font-semibold mt-6">Summary</h2>

{#if budgets.length === 0}
  <p class="mt-2 text-gray-600">No budgets yet. Add one to get started.</p>
{/if}

{#each budgets as b}
  <div class="border p-3 mt-2 rounded">
    <p><strong>{b.category}</strong></p>
    <p>Limit: RM {b.monthly_limit}</p>
    <p>Used: RM {totalSpent(b.category)}</p>
    <p>Remaining: RM {Number(b.monthly_limit) - totalSpent(b.category)}</p>
  </div>
{/each}
