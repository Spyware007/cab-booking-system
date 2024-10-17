// app/api/signup/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/models";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  await dbConnect();

  const { name, email, password, role } = await req.json();

  // Basic validation
  if (!name || !email || !password || !role) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return NextResponse.json(
      { message: "User created successfully", userId: user._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in signup:", error);
    return NextResponse.json(
      { error: "An error occurred during signup" },
      { status: 500 }
    );
  }
}
