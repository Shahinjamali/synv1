require("dotenv").config(); // Add this at the top
const mongoose = require("mongoose");
const Equipment = require("../models/equipmentModel");
const EquipmentHealth = require("../models/equipmentHealthModel");
const OilAnalysis = require("../models/oilAnalysisModel");
const Alert = require("../models/alertModel");

dotenv.config(); // ✅ Ensure `.env` is loaded before connecting

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not defined. Check your .env file.");
  process.exit(1); // ✅ Stop execution if no connection string is found
}

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });

const seedData = async () => {
  try {
    console.log("🚀 Clearing existing data...");
    await Equipment.deleteMany({});
    await EquipmentHealth.deleteMany({});
    await OilAnalysis.deleteMany({});
    await Alert.deleteMany({});
    console.log("✅ Old data cleared!");

    console.log("🌱 Seeding new data...");

    // ✅ Creating Equipment
    const fakeEquipment = await Equipment.create([
      {
        _id: new mongoose.Types.ObjectId(),
        equipmentId: new mongoose.Types.ObjectId(),
        name: "Gearbox OP-10",
        companyId: new mongoose.Types.ObjectId("507f1f77bcf86cd799439011"),
        type: "Gearbox",
        location: "Plant A",
        status: "active",
      },
    ]);
    console.log("✅ Equipment Seeded:", fakeEquipment);

    // ✅ Creating Equipment Health
    const fakeEquipmentHealth = await EquipmentHealth.create([
      {
        equipmentId: fakeEquipment[0]._id,
        companyId: fakeEquipment[0].companyId,
        healthScore: 85,
        oilStatus: "good",
      },
    ]);
    console.log("✅ Equipment Health Seeded:", fakeEquipmentHealth);

    // ✅ Creating Oil Analysis
    const fakeOilAnalysis = await OilAnalysis.create([
      {
        companyId: fakeEquipment[0].companyId,
        equipmentId: fakeEquipment[0]._id,
        oilTypeId: new mongoose.Types.ObjectId(),
        source: "lab",
        timestamp: new Date(),
        parameters: [
          { name: "pH", value: 7.5, unit: "pH" },
          { name: "Viscosity", value: 50, unit: "cSt" },
        ],
      },
    ]);
    console.log("✅ Oil Analysis Seeded:", fakeOilAnalysis);

    // ✅ Creating Alerts
    const fakeAlerts = await Alert.create([
      {
        equipmentId: fakeEquipment[0]._id,
        companyId: fakeEquipment[0].companyId,
        message: "High temperature detected",
        severity: "high",
        parameter: "Temperature",
        value: 90,
        timestamp: new Date(),
        isResolved: false,
      },
    ]);
    console.log("✅ Alerts Seeded:", fakeAlerts);

    console.log("✅ Seeding complete!");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};
