import { db } from "@/lib/prisma";

export const GET = async () => {
  try {
    const pins = await db.pin.findMany({ orderBy: { createdAt: "desc" } });

    return Response.json(pins, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
};
