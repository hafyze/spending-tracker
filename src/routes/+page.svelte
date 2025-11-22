<script lang="ts">
  import type { PageData } from "./$types";
  import { invalidateAll } from "$app/navigation";
  import { ChartPie, BanknoteArrowUp } from "lucide-svelte";
  import { categoryIcons } from "$lib/assets/categoryIcons";

  export let data: PageData;

  const { budgets = [], expenses = [] } = data;

  let editingBudget: (typeof budgets)[0] | null = null;
  let editingExpense: (typeof expenses)[0] | null = null;

  function totalSpent(cat: string) {
    return expenses
      .filter((e: any) => e.category === cat)
      .reduce((s: any, e: any) => s + Number(e.amount ?? 0), 0);
  }

  function getIcon(category: string) {
    const key = category.toLowerCase();
    return categoryIcons[key] || categoryIcons.default;
  }

  //  Budget edit
  function editBudget(b: any) {
    editingBudget = { ...b };
  }

  async function saveEditBudget() {
    await fetch("/api/budget", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingBudget),
    });
    editingBudget = null;
    await invalidateAll();
  }

  //  Expense edit
  function editExpense(e: any) {
    editingExpense = { ...e };
  }

  async function saveEditExpense() {
    await fetch("/api/expense", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingExpense),
    });
    editingExpense = null;
    await invalidateAll();
  }

  //  Delete an expense
  async function deleteExpense(e: any) {
    if (
      !confirm(
        `Are you sure you want to delete this expense of RM ${e.amount}?`
      )
    )
      return;

    await fetch("/api/expense", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: e._id }), // assuming _id is stored in MongoDB
    });

    // refresh page
    await invalidateAll();
  }

  //  Reset spending
  async function resetCategory(cat: string) {
    if (!confirm(`Are you sure you want to reset all spending for ${cat}?`))
      return;
    await fetch("/api/expense/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: cat }),
    });
    await invalidateAll();
  }
</script>

<div class="p-4 max-w-md mx-auto">
  <h1 class="text-3xl font-bold mb-6 text-center text-gray-800">
    Spending Tracker
  </h1>

  <div class="flex flex-col gap-3 mb-6">
    <a
      href="/new-budget"
      class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg text-center transition-all
           flex items-center justify-center gap-2"
    >
      <span>Add Budget Category</span>
      <ChartPie size={20} />
    </a>

    <a
      href="/new-expense"
      class="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg text-center transition-all
           flex items-center justify-center gap-2"
    >
      <span>Add Spending</span>
      <BanknoteArrowUp size={20} />
    </a>
  </div>

  <h2 class="text-2xl font-semibold mt-4 mb-4 text-gray-700">Summary</h2>

  <!-- Edit Budget Modal -->
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
            on:click={saveEditBudget}
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

  <!-- Edit Expense Modal -->
  {#if editingExpense}
    <div
      class="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center p-4 z-50"
    >
      <div class="bg-white p-6 rounded-lg w-full max-w-sm shadow-lg">
        <h2 class="font-bold text-lg mb-4 text-gray-800">Edit Expense</h2>
        <input
          type="text"
          bind:value={editingExpense.category}
          placeholder="Category"
          class="border p-2 w-full mb-3 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          type="number"
          bind:value={editingExpense.amount}
          placeholder="Amount (RM)"
          class="border p-2 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <div class="flex justify-between gap-2">
          <button
            class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-all flex-1"
            on:click={saveEditExpense}
          >
            Save
          </button>
          <button
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-all flex-1"
            on:click={() => (editingExpense = null)}
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
      {@const Icon = getIcon(b.category)}
      <div
        class="border p-4 rounded-lg shadow hover:shadow-md transition-shadow"
      >
        <div class="flex justify-between items-center mb-2">
          <div class="flex items-center gap-2">
            <Icon size={20} class="text-gray-700" />
            <p class="font-semibold text-gray-800 text-lg">{b.category}</p>
          </div>
          <div class="flex gap-2">
            <button
              class="text-blue-500 hover:text-blue-600 text-sm font-medium"
              on:click={() => editBudget(b)}
            >
              Edit
            </button>
            <button
              class="text-red-500 hover:text-red-600 text-sm font-medium"
              on:click={() => resetCategory(b.category)}
            >
              Reset Spending
            </button>
          </div>
        </div>

        <p class="text-gray-600">Limit: RM {b.monthly_limit}</p>

        <!-- Progress bar -->
        <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            class={`h-2 rounded-full transition-all ${
                  totalSpent(b.category) > b.monthly_limit ? 'bg-red-500' : 'bg-green-500'
                }`}
            style="width: {Math.min(
              (totalSpent(b.category) / b.monthly_limit) * 100,
              100
            )}%"
          ></div>
        </div>

        <p
          class={`font-semibold mt-2 ${
            totalSpent(b.category) > b.monthly_limit
              ? "text-red-500"
              : "text-green-600"
          }`}
        >
          Remaining: RM {b.monthly_limit - totalSpent(b.category)}
        </p>

        <!-- List of expenses -->
        <div class="mt-2">
          <h3 class="text-gray-700 font-semibold mb-1">Expenses:</h3>
          {#each expenses.filter((e: any) => e.category === b.category) as e}
            <div
              class="flex justify-between items-center bg-gray-100 p-2 rounded mb-1"
            >
              <span>RM {e.amount}</span>
              <div class="flex gap-2">
                <button
                  class="text-blue-500 text-sm"
                  on:click={() => editExpense(e)}
                >
                  Edit
                </button>
                <button
                  class="text-red-500 text-sm"
                  on:click={() => deleteExpense(e)}
                >
                  Delete
                </button>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</div>
