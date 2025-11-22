import { json } from "@sveltejs/kit";
import { db } from "$lib/mongo";
import type { RequestHandler } from "./$types";
import { ObjectId } from "mongodb";

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

export async function DELETE({ request }) {
  const { _id } = await request.json();
  const expenses = db.collection("expenses");
  await expenses.deleteOne({ _id: new ObjectId(_id) });
  return json({ success: true });
}

export async function PUT({ request }) {
  const body = await request.json();
  const { _id, category, amount } = body;

  if (!_id || !category || Number.isNaN(Number(amount))) {
    return json({ error: "_id, category, and amount required" }, { status: 400 });
  }

  const expenses = db.collection("expenses");
  await expenses.updateOne(
    { _id: new ObjectId(_id) },
    { $set: { category: String(category), amount: Number(amount) } }
  );

  return json({ success: true });
}