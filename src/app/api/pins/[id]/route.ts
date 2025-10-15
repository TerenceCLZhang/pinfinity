import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ message: "No ID provided" }, { status: 400 });
  }

  try {
    const pin = await db.pin.findUnique({ where: { id } });

    if (!pin) {
      return NextResponse.json(
        { message: "Pin does not exist" },
        { status: 404 }
      );
    }

    return NextResponse.json(pin);
  } catch (error) {
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
};
