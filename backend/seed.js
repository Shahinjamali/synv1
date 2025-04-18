require("dotenv").config(); // Add this at the top
const mongoose = require("mongoose");
const OilType = require("./models/oilTypeModel");
const Equipment = require("./models/equipmentModel");
const OilAnalysis = require("./models/oilAnalysisModel");
const Company = require("./models/companyModel");

mongoose
  .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(async () => {
    console.log("Connected to MongoDB for seeding");

    // Seed Company
    const company = await Company.create({
      name: "Mock Company",
      industryId: null,
      subscriptionPlan: "free",
      address: {
        street: "123 Mock St",
        city: "Mock City",
        postalCode: "12345",
        country: "Mockland",
      },
      contact: { email: "mock@company.com", phone: "+1234567890" },
      status: "active",
    });

    // Seed OilType
    const oilType = await OilType.create({
      name: "Mock Oil 5W-30",
      brand: "MockBrand",
      properties: [
        { name: "Viscosity", initialValue: 10, unit: "cSt" },
        { name: "pH", initialValue: 7, unit: "pH" },
      ],
    });

    // Seed Equipment
    const equipment = await Equipment.create({
      equipmentId: "MOCK-EQ-001",
      name: "Mock Gearbox",
      companyId: company._id,
      type: "Gearbox",
      location: "Factory Floor 1",
      status: "active",
      oilHistory: [
        {
          oilTypeId: oilType._id,
          fillDate: new Date(),
          volume: 5,
          notes: "Initial fill",
        },
      ],
    });

    // Seed OilAnalysis
    await OilAnalysis.create({
      companyId: company._id,
      equipmentId: equipment._id,
      oilTypeId: oilType._id,
      source: "lab",
      timestamp: new Date(),
      parameters: [{ name: "pH", value: 7, unit: "pH" }],
    });

    console.log("Seeding complete");
    console.log("Company ID:", company._id.toString());
    console.log("Equipment ID:", equipment._id.toString());
    console.log("OilType ID:", oilType._id.toString());
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Seeding error:", err);
    mongoose.connection.close();
  });
