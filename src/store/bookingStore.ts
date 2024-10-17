import { create } from "zustand";

interface BookingState {
  booking: {
    email: string;
    source: string;
    destination: string;
    cabId: string;
    result: any;
  };
  setBooking: (booking: Partial<BookingState["booking"]>) => void;
  submitBooking: () => Promise<void>;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  booking: {
    email: "",
    source: "",
    destination: "",
    cabId: "",
    result: null,
  },
  setBooking: (newBooking) =>
    set((state) => ({ booking: { ...state.booking, ...newBooking } })),
  submitBooking: async () => {
    const { booking } = get();
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking),
    });
    const data = await response.json();
    if (data.success) {
      set((state) => ({ booking: { ...state.booking, result: data.data } }));
    } else {
      console.error("Booking failed:", data.error);
    }
  },
}));
