import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
  const budgets = await fetch("/api/budget").then((r) => r.json());
  const expenses = await fetch("/api/expense").then((r) => r.json());

  return {
    budgets,
    expenses,
  };
};
