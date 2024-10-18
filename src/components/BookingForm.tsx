"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, Car, X, RotateCcw } from "lucide-react";
import { useBookingStore } from "@/store/bookingStore";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Location, Cab, CabType, Booking } from "@/types";

export default function BookingForm() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [availableCabs, setAvailableCabs] = useState<Cab[]>([]);
  const [selectedCab, setSelectedCab] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [latestBooking, setLatestBooking] = useState<Booking | null>(null);
  const { booking, setBooking, submitBooking } = useBookingStore();
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();

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

  const resetForm = () => {
    setBooking({
      source: "",
      destination: "",
      path: [],
      duration: 0,
      cabId: "",
      email: "",
      result: null,
    });
    setAvailableCabs([]);
    setSelectedCab("");
    setIsSidebarOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "You need to login to access this feature",
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
        setIsSidebarOpen(true);
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
        setIsModalOpen(true);
        setIsSidebarOpen(false);
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

  useEffect(() => {
    if (session) {
      fetchLatestBooking();
      const interval = setInterval(fetchLatestBooking, 60000); // Fetch every minute
      return () => clearInterval(interval);
    }
  }, [session]);

  const fetchLatestBooking = async () => {
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        setLatestBooking(data.data[0]);
      }
    } catch (error) {
      console.error("Error fetching latest booking:", error);
    }
  };

  const CAB_IMAGES: Record<CabType, string> = {
    [CabType.UBERX]: "/cars/uberx.png",
    [CabType.BLACK_SUV]: "/cars/uberblacksuv.png",
    [CabType.BLACK]: "/cars/uberblack.png",
    [CabType.XL]: "/cars/uberxl.png",
    [CabType.SMALL]: "/cars/ubers.png",
    [CabType.PREMIUM]: "/cars/uberpremium.png",
  };

  const CarImage = ({ type, name }: { type: CabType; name: string }) => {
    return (
      <div className="relative w-20 h-20">
        <Image
          src={CAB_IMAGES[type] || "/cars/uberx.png"}
          alt={`${name} car`}
          fill
          className="object-contain"
          sizes="80px"
          priority={false}
        />
      </div>
    );
  };

  return (
    <div className="relative bg-black text-white min-h-screen">
      <div className="container mx-auto px-4 py-12 lg:py-24">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
          <div className="w-full lg:w-1/2 z-10">
            <div className="max-w-lg">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Go anywhere with Uber
              </h1>
              <p className="text-xl mb-8">Request a ride, hop in, and go</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Select
                  value={booking.source}
                  onValueChange={(value) =>
                    setBooking({ ...booking, source: value })
                  }
                  required
                >
                  <SelectTrigger className="bg-white text-black">
                    <SelectValue placeholder="Select pickup location" />
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
                  value={booking.destination}
                  onValueChange={(value) =>
                    setBooking({ ...booking, destination: value })
                  }
                  required
                >
                  <SelectTrigger className="bg-white text-black">
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
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    className="flex-1 bg-white text-black hover:bg-gray-200"
                  >
                    <Car className="mr-2 h-4 w-4" />
                    {availableCabs.length > 0 && !isSidebarOpen
                      ? "Show Available Cabs"
                      : "Find Cabs"}
                  </Button>
                  {(booking.source ||
                    booking.destination ||
                    availableCabs.length > 0) && (
                    <Button
                      type="button"
                      onClick={resetForm}
                      variant="outline"
                      className="bg-transparent border-white text-white hover:bg-white/10"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </form>
              {latestBooking && (
                <div className="mt-4 p-4 bg-green-100 text-black rounded">
                  <h3 className="font-semibold">Latest Booking</h3>
                  <p>Status: {latestBooking.status}</p>
                  <p>From: {latestBooking.source.name}</p>
                  <p>To: {latestBooking.destination.name}</p>
                  <p>
                    Start Time:{" "}
                    {new Date(latestBooking.startTime).toLocaleString()}
                  </p>
                  <p>
                    End Time: {new Date(latestBooking.endTime).toLocaleString()}
                  </p>
                  <p>Cost: ${latestBooking.cost.toFixed(2)}</p>
                </div>
              )}
            </div>
          </div>
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[558px] aspect-[558/698]">
              <Image
                className="object-contain"
                src="/banners/hero.png"
                alt="hero"
                fill
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {availableCabs.length > 0 && (
        <>
          <div
            className={`fixed top-0 right-0 w-full lg:w-1/3 h-full bg-white text-black p-8 overflow-y-auto shadow-lg transform transition-transform duration-300 ease-in-out z-20 ${
              isSidebarOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Available Cabs</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(false)}
                className="hover:bg-gray-100"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {availableCabs.map((cab) => (
                <div
                  key={cab._id}
                  className={`p-4 border rounded-md ${
                    selectedCab === cab._id
                      ? "border-blue-500"
                      : "border-gray-200"
                  } cursor-pointer hover:border-blue-300 transition-colors duration-200`}
                  onClick={() => setSelectedCab(cab._id)}
                >
                  <div className="w-full flex justify-start items-start gap-4">
                    <CarImage type={cab.type} name={cab.name} />
                    <div>
                      <h3 className="font-semibold">{cab.name}</h3>
                      <p>Price per minute: ${cab.pricePerMinute.toFixed(2)}</p>
                      <p>
                        Estimated cost: $
                        {(cab.pricePerMinute * booking.duration).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button
              onClick={handleBookCab}
              disabled={!selectedCab}
              className="w-full mt-4 bg-black text-white hover:bg-gray-800"
            >
              Book Selected Cab
            </Button>
          </div>
        </>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking Confirmed!</DialogTitle>
            <DialogDescription>
              <p>Path: {booking.result?.path.join(" -> ")}</p>
              <p>Duration: {booking.result?.duration} minutes</p>
              <p>Cost: ${booking.result?.cost.toFixed(2)}</p>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
