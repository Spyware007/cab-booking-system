import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import { Booking } from "@/models";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const bookings = await Booking.find({})
      .populate("cab source destination")
      .sort({ startTime: -1 });

    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    console.error("Error fetching all bookings:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred" },
      { status: 500 }
    );
  }
}
