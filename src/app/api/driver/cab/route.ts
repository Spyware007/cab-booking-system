import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import { Cab, User, CabType } from "@/models";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "cabDriver") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
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
    const { name, pricePerMinute, type = CabType.UBERX } = await req.json();

    if (!Object.values(CabType).includes(type)) {
      return NextResponse.json(
        { success: false, error: "Invalid cab type" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: session.user.email });

    const cab = await Cab.create({
      name,
      pricePerMinute,
      type,
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
    const { name, pricePerMinute, type } = await req.json();
    console.log("Received data:", { name, pricePerMinute, type });
    console.log("Valid CabTypes:", Object.values(CabType));

    if (!type || !Object.values(CabType).includes(type)) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing cab type" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    let cab = await Cab.findOne({ driver: user._id });
    console.log("Found cab:", JSON.stringify(cab, null, 2));

    if (!cab) {
      return NextResponse.json(
        { success: false, error: "Cab not found" },
        { status: 404 }
      );
    }

    cab.name = name;
    cab.pricePerMinute = pricePerMinute;
    cab.type = type;
    console.log({ cab });

    console.log("Cab before save:", JSON.stringify(cab, null, 2));

    cab = await cab.save();
    console.log({ cab });

    console.log("Updated cab after save:", JSON.stringify(cab, null, 2));

    return NextResponse.json({ success: true, data: cab });
  } catch (error) {
    console.error("Error updating cab:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred" },
      { status: 500 }
    );
  }
}
