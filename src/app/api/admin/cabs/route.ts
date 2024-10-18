import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import { Cab } from "@/models";

export async function GET() {
  const session = await getServerSession(authOptions);

  // Check if the user is authenticated and is an admin
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const cabs = await Cab.find({});
    return NextResponse.json({ success: true, data: cabs });
  } catch (error) {
    console.error("Error fetching cabs:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred while fetching cabs" },
      { status: 500 }
    );
  }
}
