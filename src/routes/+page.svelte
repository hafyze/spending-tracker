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

<div class="p-4 max-w-md mx-auto">
  <h1 class="text-3xl font-bold mb-6 text-center text-gray-800">
    Spending Tracker
  </h1>

  <div class="flex flex-col gap-3 mb-6">
    <a
      href="/new-budget"
      class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg text-center transition-all"
    >
      + Add Budget Category
    </a>
    <a
      href="/new-expense"
      class="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg text-center transition-all"
    >
      + Add Spending
    </a>
  </div>

  <h2 class="text-2xl font-semibold mt-4 mb-4 text-gray-700">Summary</h2>

  {#if editingBudget}
    <div
      class="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center p-4 z-50"
    >
      <div class="bg-white p-6 rounded-lg w-full max-w-sm shadow-lg">
        <h2 class="font-bold text-lg mb-4 text-gray-800">Edit Budget</h2>
        <input
          bind:value={editingBudget.category}
          placeholder="Category"
          class="border p-2 w-full mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="number"
          bind:value={editingBudget.monthly_limit}
          placeholder="Limit (RM)"
          class="border p-2 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div class="flex justify-between gap-2">
          <button
            class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all flex-1"
            on:click={saveEdit}
          >
            Save
          </button>
          <button
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-all flex-1"
            on:click={() => (editingBudget = null)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  {/if}

  {#if budgets.length === 0}
    <p class="mt-4 text-gray-500 text-center">
      No budgets yet. Add one to get started.
    </p>
  {/if}

  <div class="flex flex-col gap-4">
    {#each budgets as b}
      <div
        class="border p-4 rounded-lg shadow hover:shadow-md transition-shadow"
      >
        <div class="flex justify-between items-center mb-2">
          <p class="font-semibold text-gray-800 text-lg">{b.category}</p>
          <button
            class="text-blue-500 hover:text-blue-600 font-medium text-sm"
            on:click={() => editBudget(b)}
          >
            Edit
          </button>
        </div>
        <p class="text-gray-600">Limit: RM {b.monthly_limit}</p>
        <p class="text-gray-600">Used: RM {totalSpent(b.category)}</p>
        <p
          class={`font-semibold ${
            totalSpent(b.category) > b.monthly_limit
              ? "text-red-500"
              : "text-green-600"
          }`}
        >
          Remaining: RM {b.monthly_limit - totalSpent(b.category)}
        </p>
      </div>
    {/each}
  </div>
</div>
