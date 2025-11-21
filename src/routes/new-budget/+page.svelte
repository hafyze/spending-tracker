<script lang="ts">
  import { goto } from "$app/navigation";
  let category = "";
  let monthly_limit = 0;

  async function save() {
    await fetch("/api/budget", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, monthly_limit }),
    });
    goto("/");
  }
</script>

<h1 class="text-xl font-bold mb-4">Add Budget Category</h1>

<input bind:value={category} placeholder="Category" class="border p-2 block" />
<input
  type="number"
  bind:value={monthly_limit}
  class="border p-2 block mt-2"
  placeholder="Limit (RM)"
/>

<button class="bg-blue-500 text-white px-4 py-2 mt-3 rounded" on:click={save}>
  Save
</button>
