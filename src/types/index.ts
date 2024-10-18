export enum CabType {
  UBERX = "uberx",
  BLACK_SUV = "blacksuv",
  BLACK = "black",
  XL = "xl",
  SMALL = "s",
  PREMIUM = "premium",
}
export interface Location {
  _id: string;
  name: string;
}

export interface Route {
  _id: string;
  from: Location;
  to: Location;
  duration: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "cabDriver";
}

export interface Cab {
  _id: string;
  name: string;
  pricePerMinute: number;
  type: CabType;
  driver: User;
}

export interface Booking {
  _id: string;
  userEmail: string;
  source: Location;
  destination: Location;
  cab: Cab;
  startTime: Date;
  endTime: Date;
  cost: number;
  status: "Pending" | "In Progress" | "Completed" | "Cancelled";
}
