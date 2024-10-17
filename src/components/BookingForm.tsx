// components/BookingForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";
import { useBookingStore } from "@/store/bookingStore";
import { toast } from "@/hooks/use-toast";

interface Cab {
  _id: string;
  name: string;
  pricePerMinute: number;
}

interface Location {
  _id: string;
  name: string;
}

const BookingForm = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [availableCabs, setAvailableCabs] = useState<Cab[]>([]);
  const [selectedCab, setSelectedCab] = useState<string>("");
  const { booking, setBooking, submitBooking } = useBookingStore();
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await fetch("/api/locations");
      const data = await res.json();
      if (data.success) {
        setLocations(data.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch locations",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
      toast({
        title: "Error",
        description: "An error occurred while fetching locations",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast({
        title: "Error",
        description: "You must be logged in to book a cab",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }

    if (!booking.source || !booking.destination) {
      toast({
        title: "Error",
        description: "Please select both source and destination",
        variant: "destructive",
      });
      return;
    }

    try {
      const pathRes = await fetch("/api/bookings/path", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: booking.source,
          destination: booking.destination,
        }),
      });

      const pathData = await pathRes.json();

      if (pathData.success) {
        setAvailableCabs(pathData.data.availableCabs);
        setBooking({
          ...booking,
          path: pathData.data.path,
          duration: pathData.data.duration,
        });
      } else {
        toast({
          title: "Error",
          description: pathData.error || "Failed to find a path",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error finding path:", error);
      toast({
        title: "Error",
        description: "An error occurred while finding a path",
        variant: "destructive",
      });
    }
  };

  const handleBookCab = async () => {
    if (!selectedCab) {
      toast({
        title: "Error",
        description: "Please select a cab",
        variant: "destructive",
      });
      return;
    }

    setBooking({
      ...booking,
      cabId: selectedCab,
      email: session?.user?.email || "",
    });

    try {
      const result = await submitBooking();

      if (result.success) {
        toast({
          title: "Success",
          description: "Booking confirmed!",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to book the cab",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error booking cab:", error);
      toast({
        title: "Error",
        description: "An error occurred while booking the cab",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
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
        <Button type="submit">
          <Car className="mr-2 h-4 w-4" /> Find Cabs
        </Button>
      </form>

      {availableCabs.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Available Cabs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableCabs.map((cab) => (
              <div
                key={cab._id}
                className={`p-4 border rounded-md ${
                  selectedCab === cab._id ? "border-primary" : "border-gray-200"
                } cursor-pointer`}
                onClick={() => setSelectedCab(cab._id)}
              >
                <h3 className="font-semibold">{cab.name}</h3>
                <p>Price per minute: ${cab.pricePerMinute.toFixed(2)}</p>
                <p>
                  Estimated cost: $
                  {(cab.pricePerMinute * booking.duration).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <Button onClick={handleBookCab} disabled={!selectedCab}>
            Book Selected Cab
          </Button>
        </div>
      )}

      {booking.result && (
        <div className="mt-4 p-4 bg-green-100 rounded">
          <p>Booking confirmed!</p>
          <p>Path: {booking.result.path.join(" -> ")}</p>
          <p>Duration: {booking.result.duration} minutes</p>
          <p>Cost: ${booking.result.cost.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default BookingForm;
