import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Cab } from "@/models";

export async function GET() {
  await dbConnect();
  try {
    const cabs = await Cab.find({});
    return NextResponse.json({ success: true, data: cabs });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function POST(req: Request) {
  await dbConnect();
  const data = await req.json();
  try {
    const cab = await Cab.create(data);
    return NextResponse.json({ success: true, data: cab }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function PUT(req: Request) {
  await dbConnect();
  const { id, ...updateData } = await req.json();
  try {
    const updatedCab = await Cab.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedCab) {
      return NextResponse.json(
        { success: false, error: "Cab not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: updatedCab });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
