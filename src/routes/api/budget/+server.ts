// src/routes/api/budget/+server.ts
import { json } from "@sveltejs/kit";
import { db } from "$lib/mongo";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const category = String(body.category ?? "").trim();
  const monthly_limit = Number(body.monthly_limit ?? 0);

  if (!category) {
    return json({ error: "category required" }, { status: 400 });
  }

  const budgets = db.collection("budgets");
  await budgets.insertOne({ category, monthly_limit, created_at: new Date() });

  return json({ success: true });
};

export const GET: RequestHandler = async () => {
  const budgets = db.collection("budgets");
  const list = await budgets.find({}).toArray();
  return json(list);
};
