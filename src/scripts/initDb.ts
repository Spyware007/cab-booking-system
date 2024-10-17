import dbConnect from "@/lib/dbConnect";
import { Location, Route, Cab } from "@/models";

const locations = ["A", "B", "C", "D", "E", "F"];
const routes = [
  { from: "A", to: "B", duration: 5 },
  { from: "A", to: "C", duration: 7 },
  { from: "B", to: "D", duration: 15 },
  { from: "B", to: "C", duration: 20 },
  { from: "C", to: "D", duration: 5 },
  { from: "C", to: "E", duration: 35 },
  { from: "D", to: "E", duration: 20 },
  { from: "D", to: "F", duration: 20 },
  { from: "E", to: "F", duration: 10 },
];

const cabs = [
  { name: "Economy", pricePerMinute: 1 },
  { name: "Comfort", pricePerMinute: 1.5 },
  { name: "Premium", pricePerMinute: 2 },
  { name: "SUV", pricePerMinute: 2.5 },
  { name: "Luxury", pricePerMinute: 3 },
];

async function initDb() {
  await dbConnect();

  // Clear existing data
  await Location.deleteMany({});
  await Route.deleteMany({});
  await Cab.deleteMany({});

  // Create locations
  const locationDocs = await Location.create(
    locations.map((name) => ({ name }))
  );
  const locationMap = locationDocs.reduce((map, loc) => {
    map[loc.name] = loc._id;
    return map;
  }, {} as { [key: string]: any });

  // Create routes
  await Route.create(
    routes.map((route) => ({
      from: locationMap[route.from],
      to: locationMap[route.to],
      duration: route.duration,
    }))
  );

  // Create cabs
  await Cab.create(cabs);

  console.log("Database initialized successfully");
  process.exit(0);
}

initDb().catch(console.error);
