import { json } from "@sveltejs/kit";
import { db } from "../../../../lib/mongo";

export async function POST({ request }) {
  const { category } = await request.json();
  if (!category) return json({ error: "Missing category" }, { status: 400 });

  const expenses = db.collection("expenses");
  await expenses.deleteMany({ category });

  return json({ success: true });
}
