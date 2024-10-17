"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const res = await fetch("/api/bookings");
    const data = await res.json();
    setBookings(data.data);
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const res = await fetch(`/api/bookings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: bookingId, status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.data.status !== newStatus) {
          toast({
            title: "Status Update",
            description: `The booking was automatically marked as ${data.data.status}. Manual update to ${newStatus} was not applied.`,
            variant: "warning",
          });
        } else {
          toast({
            title: "Status Updated",
            description: `Booking status updated to ${newStatus}`,
            variant: "success",
          });
        }
        fetchBookings(); // Refresh the bookings list
      } else {
        toast({
          title: "Error",
          description: "Failed to update booking status",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast({
        title: "Error",
        description: "An error occurred while updating the booking status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Bookings</h1>
      <Table>
        <TableCaption>List of all bookings</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Booking ID</TableHead>
            <TableHead>User Email</TableHead>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Cab</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking._id}>
              <TableCell>{booking._id}</TableCell>
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
              <TableCell>
                <Select
                  onValueChange={(value) =>
                    handleStatusChange(booking._id, value)
                  }
                  defaultValue={booking.status}
                  disabled={booking.status === "Completed"}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Change status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
