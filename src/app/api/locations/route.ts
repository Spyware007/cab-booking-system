import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Location } from "@/models";

export async function GET() {
  await dbConnect();

  try {
    const locations = await Location.find({});
    return NextResponse.json({ success: true, data: locations });
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
    const location = await Location.create(data);
    return NextResponse.json(
      { success: true, data: location },
      { status: 201 }
    );
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
    const location = await Location.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!location) {
      return NextResponse.json(
        { success: false, error: "Location not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: location });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function DELETE(req: Request) {
  await dbConnect();
  const { id } = await req.json();

  try {
    const location = await Location.findByIdAndDelete(id);
    if (!location) {
      return NextResponse.json(
        { success: false, error: "Location not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
