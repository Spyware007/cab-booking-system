"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Car } from "lucide-react";
import { useBookingStore } from "@/store/bookingStore";

const BookingForm = () => {
  const [locations, setLocations] = useState([]);
  const [cabs, setCabs] = useState([]);
  const { booking, setBooking, submitBooking } = useBookingStore();

  useEffect(() => {
    fetchLocations();
    fetchCabs();
  }, []);

  const fetchLocations = async () => {
    const res = await fetch("/api/locations");
    const data = await res.json();
    setLocations(data.data);
  };

  const fetchCabs = async () => {
    const res = await fetch("/api/cabs");
    const data = await res.json();
    setCabs(data.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitBooking();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="email"
        placeholder="Email"
        value={booking.email}
        onChange={(e) => setBooking({ ...booking, email: e.target.value })}
        required
      />
      <Select
        onValueChange={(value) => setBooking({ ...booking, source: value })}
        required
      >
        <SelectTrigger>
          <SelectValue placeholder="Select source" />
        </SelectTrigger>
        <SelectContent>
          {locations.map((loc) => (
            <SelectItem key={loc._id} value={loc._id}>
              {loc.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        onValueChange={(value) =>
          setBooking({ ...booking, destination: value })
        }
        required
      >
        <SelectTrigger>
          <SelectValue placeholder="Select destination" />
        </SelectTrigger>
        <SelectContent>
          {locations.map((loc) => (
            <SelectItem key={loc._id} value={loc._id}>
              {loc.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        onValueChange={(value) => setBooking({ ...booking, cabId: value })}
        required
      >
        <SelectTrigger>
          <SelectValue placeholder="Select cab" />
        </SelectTrigger>
        <SelectContent>
          {cabs.map((cab) => (
            <SelectItem key={cab._id} value={cab._id}>
              {cab.name} (${cab.pricePerMinute}/min)
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="submit">
        <Car className="mr-2 h-4 w-4" /> Book Cab
      </Button>
      {booking.result && (
        <div className="mt-4 p-4 bg-green-100 rounded">
          <p>Booking confirmed!</p>
          <p>Path: {booking.result.path.join(" -> ")}</p>
          <p>Duration: {booking.result.duration} minutes</p>
          <p>Cost: ${booking.result.cost.toFixed(2)}</p>
        </div>
      )}
    </form>
  );
};

export default BookingForm;
