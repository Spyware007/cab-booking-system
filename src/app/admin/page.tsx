// app/admin/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Booking {
  _id: string;
  userEmail: string;
  source: { name: string };
  destination: { name: string };
  cab: { name: string };
  startTime: string;
  endTime: string;
  cost: number;
  status: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (
      status === "unauthenticated" ||
      (session?.user?.role !== "admin" && status !== "loading")
    ) {
      router.push("/");
    } else if (status === "authenticated") {
      fetchBookings();
    }
  }, [session, status]);

  const fetchBookings = async () => {
    const res = await fetch("/api/admin/bookings");
    const data = await res.json();
    if (data.success) {
      setBookings(data.data);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <h2 className="text-xl font-semibold mb-4">All Bookings</h2>
      <Table>
        <TableCaption>List of all bookings</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>User Email</TableHead>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Cab</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking._id}>
              <TableCell>{booking.userEmail}</TableCell>
              <TableCell>{booking.source.name}</TableCell>
              <TableCell>{booking.destination.name}</TableCell>
              <TableCell>{booking.cab.name}</TableCell>
              <TableCell>
                {new Date(booking.startTime).toLocaleString()}
              </TableCell>
              <TableCell>
                {new Date(booking.endTime).toLocaleString()}
              </TableCell>
              <TableCell>${booking.cost.toFixed(2)}</TableCell>
              <TableCell>{booking.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
