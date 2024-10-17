// app/api/driver/cab/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import { Cab, User } from "@/models";

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

    return NextResponse.json({ success: true, data: cab });
  } catch (error) {
    console.error("Error fetching cab details:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "cabDriver") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const { name, pricePerMinute } = await req.json();
    const user = await User.findOne({ email: session.user.email });

    const cab = await Cab.create({
      name,
      pricePerMinute,
      driver: user._id,
    });

    return NextResponse.json({ success: true, data: cab }, { status: 201 });
  } catch (error) {
    console.error("Error creating cab:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "cabDriver") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const { name, pricePerMinute } = await req.json();
    const user = await User.findOne({ email: session.user.email });
    const cab = await Cab.findOneAndUpdate(
      { driver: user._id },
      { name, pricePerMinute },
      { new: true }
    );

    if (!cab) {
      return NextResponse.json(
        { success: false, error: "Cab not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: cab });
  } catch (error) {
    console.error("Error updating cab:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred" },
      { status: 500 }
    );
  }
}
