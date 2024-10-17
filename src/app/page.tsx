import BookingForm from "@/components/BookingForm";
import LocationMap from "@/components/LocationMap";

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cab Booking System</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BookingForm />
        <LocationMap />
      </div>
    </main>
  );
}
