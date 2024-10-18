import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/models";

export async function GET() {
  const session = await getServerSession(authOptions);

  // Check if the user is authenticated and is an admin
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    // Fetch all users, but exclude sensitive information like passwords
    const users = await User.find({}).select("email role -_id");
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred while fetching users" },
      { status: 500 }
    );
  }
}
