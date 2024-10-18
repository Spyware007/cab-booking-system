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
  submitBooking: () => Promise<{ success: boolean; error?: string }>;
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
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking),
      });
      const data = await response.json();
      if (data.success) {
        set((state) => ({ booking: { ...state.booking, result: data.data } }));
        return { success: true };
      } else {
        console.error("Booking failed:", data.error);
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      return {
        success: false,
        error: "An error occurred while submitting the booking",
      };
    }
  },
}));
