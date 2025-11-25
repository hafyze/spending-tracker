import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/mongo';

export const DELETE: RequestHandler = async ({ request }) => {
  const { category } = await request.json();

  if (!category) return new Response(JSON.stringify({ error: "Category required" }), { status: 400 });

  await db.collection('expenses').deleteMany({ category });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
