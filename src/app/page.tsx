// app/page.tsx
"use client";

import { useSession } from "next-auth/react";
import BookingForm from "@/components/BookingForm";
import LocationMap from "@/components/LocationMap";
import { Business, DriveWithUs } from "@/components/Services";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <main className="">
      <>
        <BookingForm />
        <DriveWithUs />
        <Business />
        {/* <LocationMap /> */}
      </>
    </main>
  );
}
