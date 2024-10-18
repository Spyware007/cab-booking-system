import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import { Booking, Cab, User } from "@/models";
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "cabDriver") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const user = await User.findOne({ email: session.user.email });
    const cab = await Cab.findOne({ driver: user._id });

    if (!cab) {
      return NextResponse.json(
        { success: false, error: "No cab found" },
        { status: 404 }
      );
    }

    const bookings = await Booking.find({ cab: cab._id })
      .populate("source destination")
      .sort({ startTime: -1 });

    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    console.error("Error fetching driver bookings:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred" },
      { status: 500 }
    );
  }
}
