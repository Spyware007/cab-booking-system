// app/api/bookings/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import { Booking, Route, Cab, Location, updateBookingStatus } from "@/models";
import { findShortestPath } from "@/utils/graph";
import mongoose from "mongoose";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (
    !session ||
    (session.user?.role !== "user" && session.user?.role !== "admin")
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const { source, destination, cabId } = await req.json();

    // Validate inputs
    if (!source || !destination || !cabId) {
      console.log({ source, destination, cabId });
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate ObjectIds
    if (
      !mongoose.isValidObjectId(source) ||
      !mongoose.isValidObjectId(destination) ||
      !mongoose.isValidObjectId(cabId)
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid ID format" },
        { status: 400 }
      );
    }

    const routes = await Route.find({}).populate("from to");
    const graph: { [key: string]: { [key: string]: number } } = {};
    routes.forEach((route) => {
      if (!graph[route.from.name]) graph[route.from.name] = {};
      if (!graph[route.to.name]) graph[route.to.name] = {};

      graph[route.from.name][route.to.name] = route.duration;
      graph[route.to.name][route.from.name] = route.duration;
    });

    const sourceLocation = await Location.findById(source);
    const destinationLocation = await Location.findById(destination);

    if (!sourceLocation || !destinationLocation) {
      return NextResponse.json(
        { success: false, error: "Invalid source or destination" },
        { status: 400 }
      );
    }

    const { path, duration } = findShortestPath(
      graph,
      sourceLocation.name,
      destinationLocation.name
    );

    if (duration === Infinity) {
      return NextResponse.json(
        { success: false, error: "No valid route found" },
        { status: 400 }
      );
    }

    const cab = await Cab.findById(cabId);
    if (!cab) {
      return NextResponse.json(
        { success: false, error: "Invalid cab selected" },
        { status: 400 }
      );
    }

    const cost = duration * cab.pricePerMinute;

    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + duration * 60000);

    const overlappingBooking = await Booking.findOne({
      cab: cabId,
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
        { startTime: { $gte: startTime, $lt: endTime } },
        { endTime: { $gt: startTime, $lte: endTime } },
      ],
    });

    if (overlappingBooking) {
      return NextResponse.json(
        {
          success: false,
          error: "Selected cab is not available for the requested time",
        },
        { status: 400 }
      );
    }

    const booking = await Booking.create({
      userEmail: session.user.email,
      source,
      destination,
      cab: cabId,
      startTime,
      endTime,
      cost,
      status: "Pending",
    });

    return NextResponse.json(
      { success: true, data: { booking, path, duration, cost } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred while creating the booking" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (
    !session ||
    (session.user?.role !== "user" && session.user?.role !== "admin")
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const bookings = await Booking.find({
      userEmail: session.user.email,
    }).populate("cab source destination");

    // Update status for each booking
    const updatedBookings = await Promise.all(
      bookings.map(async (booking) => {
        return await updateBookingStatus(booking);
      })
    );

    // Sort the updated bookings based on start time
    const sortedBookings = updatedBookings.sort((a, b) => {
      return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
    });

    return NextResponse.json({ success: true, data: sortedBookings });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred" },
      { status: 500 }
    );
  }
}
export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const { bookingId } = await req.json();
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    if (
      session.user?.role !== "admin" &&
      booking.userEmail !== session.user?.email
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updatedBooking = await updateBookingStatus(booking);

    return NextResponse.json({ success: true, data: updatedBooking });
  } catch (error) {
    console.error("Error updating booking status:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred" },
      { status: 500 }
    );
  }
}
