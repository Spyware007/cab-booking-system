// scripts/migrateCabs.ts

import dbConnect from "../lib/dbConnect";
import { Cab, CabType } from "../models";

async function migrateCabs() {
  await dbConnect();

  try {
    const updateResult = await Cab.updateMany(
      { type: { $exists: false } },
      { $set: { type: CabType.UBERX } }
    );

    console.log(`Updated ${updateResult.nModified} documents`);
  } catch (error) {
    console.error("Error migrating cabs:", error);
  }
}

migrateCabs().then(() => process.exit());
