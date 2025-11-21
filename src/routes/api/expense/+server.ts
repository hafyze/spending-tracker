import { json } from "@sveltejs/kit";
import { db } from "$lib/mongo";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const category = String(body.category ?? "").trim();
  const amount = Number(body.amount ?? 0);

  if (!category || Number.isNaN(amount)) {
    return json({ error: "category & amount required" }, { status: 400 });
  }

  const expenses = db.collection("expenses");
  await expenses.insertOne({ category, amount, created_at: new Date() });

  return json({ success: true });
};

export const GET: RequestHandler = async () => {
  const expenses = db.collection("expenses");
  const list = await expenses.find({}).toArray();
  return json(list);
};
