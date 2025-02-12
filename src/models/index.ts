import mongoose from "mongoose";

export enum CabType {
  UBERX = "uberx",
  BLACK_SUV = "blacksuv",
  BLACK = "black",
  XL = "xl",
  SMALL = "s",
  PREMIUM = "premium",
}

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

const routeSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    required: true,
  },
  to: { type: mongoose.Schema.Types.ObjectId, ref: "Location", required: true },
  duration: { type: Number, required: true },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin", "cabDriver"], default: "user" },
});

const cabSchema = new mongoose.Schema({
  name: { type: String, required: true },
  pricePerMinute: { type: Number, required: true },
  type: {
    type: String,
    enum: Object.values(CabType),
    default: CabType.UBERX,
    required: true,
  },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const bookingSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  source: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    required: true,
  },
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    required: true,
  },
  cab: { type: mongoose.Schema.Types.ObjectId, ref: "Cab", required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  cost: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed", "Cancelled"],
    default: "Pending",
  },
});

export async function updateBookingStatus(booking) {
  const now = new Date();
  if (
    booking.status === "Pending" &&
    now >= booking.startTime &&
    now < booking.endTime
  ) {
    booking.status = "In Progress";
  } else if (
    (booking.status === "Pending" || booking.status === "In Progress") &&
    now >= booking.endTime
  ) {
    booking.status = "Completed";
  }
  return await booking.save();
}

cabSchema.set("toJSON", { virtuals: true });

export const Location =
  mongoose.models.Location || mongoose.model("Location", locationSchema);
export const Route =
  mongoose.models.Route || mongoose.model("Route", routeSchema);
export const User = mongoose.models.User || mongoose.model("User", userSchema);
export const Cab = mongoose.models.Cab || mongoose.model("Cab", cabSchema);
export const Booking =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
