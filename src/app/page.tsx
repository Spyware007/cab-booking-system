// app/page.tsx
"use client";

import { useSession } from "next-auth/react";
import BookingForm from "@/components/BookingForm";
import LocationMap from "@/components/LocationMap";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cab Booking System</h1>
      {session ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BookingForm />
          <LocationMap />
        </div>
      ) : (
        <div className="text-center">
          <p className="mb-4">Please log in or sign up to book a cab.</p>
          <div className="space-x-4">
            <Button asChild>
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}
