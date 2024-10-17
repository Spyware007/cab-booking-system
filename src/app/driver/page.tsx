// app/driver/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Cab {
  _id: string;
  name: string;
  pricePerMinute: number;
}

interface Booking {
  _id: string;
  userEmail: string;
  source: { name: string };
  destination: { name: string };
  startTime: string;
  endTime: string;
  status: string;
}

export default function DriverDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cab, setCab] = useState<Cab | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [name, setName] = useState("");
  const [pricePerMinute, setPricePerMinute] = useState("");

  useEffect(() => {
    if (
      status === "unauthenticated" ||
      (session?.user?.role !== "cabDriver" && status !== "loading")
    ) {
      router.push("/");
    } else if (status === "authenticated") {
      fetchCabDetails();
      fetchBookings();
    }
  }, [session, status]);

  const fetchCabDetails = async () => {
    const res = await fetch("/api/driver/cab");
    const data = await res.json();
    if (data.success) {
      setCab(data.data);
      setName(data.data.name);
      setPricePerMinute(data.data.pricePerMinute.toString());
    }
  };

  const fetchBookings = async () => {
    const res = await fetch("/api/driver/bookings");
    const data = await res.json();
    if (data.success) {
      setBookings(data.data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/driver/cab", {
      method: cab ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        pricePerMinute: parseFloat(pricePerMinute),
      }),
    });
    const data = await res.json();
    if (data.success) {
      toast({
        title: "Success",
        description: cab
          ? "Cab details updated"
          : "Cab registered successfully",
      });
      fetchCabDetails();
    } else {
      toast({
        title: "Error",
        description: data.error,
        variant: "destructive",
      });
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Driver Dashboard</h1>
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <Input
          type="text"
          placeholder="Cab Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          type="number"
          step="0.01"
          placeholder="Price per Minute"
          value={pricePerMinute}
          onChange={(e) => setPricePerMinute(e.target.value)}
          required
        />
        <Button type="submit">
          {cab ? "Update Cab Details" : "Register Cab"}
        </Button>
      </form>
      <h2 className="text-xl font-semibold mb-4">Your Bookings</h2>
      <Table>
        <TableCaption>List of your bookings</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>User Email</TableHead>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking._id}>
              <TableCell>{booking.userEmail}</TableCell>
              <TableCell>{booking.source.name}</TableCell>
              <TableCell>{booking.destination.name}</TableCell>
              <TableCell>
                {new Date(booking.startTime).toLocaleString()}
              </TableCell>
              <TableCell>
                {new Date(booking.endTime).toLocaleString()}
              </TableCell>
              <TableCell>{booking.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
