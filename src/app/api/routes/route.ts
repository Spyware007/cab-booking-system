import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Route } from "@/models";

export async function GET() {
  await dbConnect();

  try {
    const routes = await Route.find({}).populate("from to");
    return NextResponse.json({ success: true, data: routes });
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
    const route = await Route.create(data);
    return NextResponse.json({ success: true, data: route }, { status: 201 });
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
    const route = await Route.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("from to");
    if (!route) {
      return NextResponse.json(
        { success: false, error: "Route not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: route });
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
    const route = await Route.findByIdAndDelete(id);
    if (!route) {
      return NextResponse.json(
        { success: false, error: "Route not found" },
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
