"use client";

import { useSession } from "next-auth/react";
import BookingForm from "@/components/BookingForm";
import LocationMap from "@/components/LocationMap";
import { Business, DriveWithUs } from "@/components/Services";
import Loader from "@/components/Loader";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <>
        <Loader />
      </>
    );
  }

  return (
    <main className="">
      <>
        <BookingForm />
        <LocationMap />
        <DriveWithUs />
        <Business />
      </>
    </main>
  );
}
