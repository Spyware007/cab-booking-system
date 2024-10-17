import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Booking, Route, Cab, Location } from "@/models";
import { findShortestPath } from "@/utils/graph";

async function updateBookingStatus(booking) {
  const now = new Date();
  if (booking.status === "Pending" && now > new Date(booking.endTime)) {
    booking.status = "Completed";
    await booking.save();
  }
  return booking;
}

export async function POST(req: Request) {
  await dbConnect();
  const { email, source, destination, cabId } = await req.json();

  try {
    const routes = await Route.find({}).populate("from to");
    const graph = {};
    routes.forEach((route) => {
      if (!graph[route.from.name]) graph[route.from.name] = {};
      if (!graph[route.to.name]) graph[route.to.name] = {};

      // Add route in both directions
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
      userEmail: email,
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
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function GET() {
  await dbConnect();
  try {
    let bookings = await Booking.find({}).populate("cab source destination");

    // Update status for each booking
    bookings = await Promise.all(bookings.map(updateBookingStatus));

    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function PUT(req: Request) {
  await dbConnect();
  const { id, status } = await req.json();

  try {
    let booking = await Booking.findById(id).populate("cab source destination");

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    // Check if the booking should be automatically completed
    booking = await updateBookingStatus(booking);

    // Only update the status if it's not already completed
    if (booking.status !== "Completed") {
      booking.status = status;
      await booking.save();
    }

    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
