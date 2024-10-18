import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import { Route, Cab, Location } from "@/models";
import { findShortestPath } from "@/utils/graph";

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
    const { source, destination } = await req.json();

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

    const availableCabs = await Cab.find({});

    return NextResponse.json({
      success: true,
      data: { path, duration, availableCabs },
    });
  } catch (error) {
    console.error("Error calculating path and finding cabs:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred" },
      { status: 500 }
    );
  }
}
