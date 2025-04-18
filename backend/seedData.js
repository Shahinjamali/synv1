const mongoose = require("mongoose");
const faker = require("@faker-js/faker").faker;
const OilType = require("./models/oilTypeModel");
const Equipment = require("./models/equipmentModel");
const Lab = require("./models/labModel");
const Report = require("./models/reportModel");
const Notification = require("./models/NotificationModel");

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/synix_dev")
  .then(() => console.log("✅ MongoDB Connected for Seeding"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

const companyId = new mongoose.Types.ObjectId("507f1f77bcf86cd799439011");
const userId = new mongoose.Types.ObjectId("67c1d23652d2a4d9b7a6334a"); // Replace with a valid User _id
const shouldReseed = process.argv.includes("--reseed");

// Parameter Templates (unchanged)
const neatParams = [
  {
    name: "Viscosity @ 40°C",
    initialValue: 68,
    unit: "cSt",
    category: "fluidProperties",
  },
  {
    name: "Viscosity @ 100°C",
    initialValue: 10,
    unit: "cSt",
    category: "fluidProperties",
  },
  {
    name: "Acid Number",
    initialValue: 0.1,
    unit: "mg KOH/g",
    category: "fluidProperties",
  },
  {
    name: "Base Number",
    initialValue: 8,
    unit: "mg KOH/g",
    category: "fluidProperties",
  },
  {
    name: "Oxidation",
    initialValue: 5,
    unit: "abs/cm",
    category: "fluidProperties",
  },
  {
    name: "Nitration",
    initialValue: 3,
    unit: "abs/cm",
    category: "fluidProperties",
  },
  { name: "Water", initialValue: 0.1, unit: "%vol", category: "contamination" },
  { name: "Soot", initialValue: 0.2, unit: "%vol", category: "contamination" },
  {
    name: "Fuel Dilution",
    initialValue: 0.5,
    unit: "%vol",
    category: "contamination",
  },
  {
    name: "Particle Count",
    initialValue: 18,
    unit: "ISO 4406",
    category: "contamination",
  },
  { name: "Iron", initialValue: 10, unit: "ppm", category: "wearMetals" },
  { name: "Chromium", initialValue: 2, unit: "ppm", category: "wearMetals" },
  { name: "Nickel", initialValue: 1, unit: "ppm", category: "wearMetals" },
  { name: "Aluminum", initialValue: 5, unit: "ppm", category: "wearMetals" },
  { name: "Copper", initialValue: 8, unit: "ppm", category: "wearMetals" },
  { name: "Lead", initialValue: 3, unit: "ppm", category: "wearMetals" },
  { name: "Tin", initialValue: 1, unit: "ppm", category: "wearMetals" },
  { name: "Cadmium", initialValue: 0.5, unit: "ppm", category: "wearMetals" },
  { name: "Silver", initialValue: 0.2, unit: "ppm", category: "wearMetals" },
  { name: "Vanadium", initialValue: 1, unit: "ppm", category: "wearMetals" },
  {
    name: "Silicon",
    initialValue: 5,
    unit: "ppm",
    category: "contaminantParticles",
  },
  {
    name: "Sodium",
    initialValue: 2,
    unit: "ppm",
    category: "contaminantParticles",
  },
  {
    name: "Potassium",
    initialValue: 3,
    unit: "ppm",
    category: "contaminantParticles",
  },
  {
    name: "Titanium",
    initialValue: 1,
    unit: "ppm",
    category: "multiSourceMetals",
  },
  {
    name: "Molybdenum",
    initialValue: 10,
    unit: "ppm",
    category: "multiSourceMetals",
  },
  {
    name: "Antimony",
    initialValue: 1,
    unit: "ppm",
    category: "multiSourceMetals",
  },
  {
    name: "Manganese",
    initialValue: 2,
    unit: "ppm",
    category: "multiSourceMetals",
  },
  {
    name: "Lithium",
    initialValue: 1,
    unit: "ppm",
    category: "multiSourceMetals",
  },
  {
    name: "Boron",
    initialValue: 3,
    unit: "ppm",
    category: "multiSourceMetals",
  },
  {
    name: "Magnesium",
    initialValue: 50,
    unit: "ppm",
    category: "additiveMetals",
  },
  {
    name: "Calcium",
    initialValue: 1000,
    unit: "ppm",
    category: "additiveMetals",
  },
  { name: "Barium", initialValue: 20, unit: "ppm", category: "additiveMetals" },
  {
    name: "Phosphorus",
    initialValue: 800,
    unit: "ppm",
    category: "additiveMetals",
  },
  { name: "Zinc", initialValue: 600, unit: "ppm", category: "additiveMetals" },
];

const waterMixableParams = [
  { name: "Appearance", initialValue: 0, unit: "visual", category: "emulsion" },
  { name: "pH", initialValue: 8, unit: "-", category: "emulsion" },
  { name: "Concentration", initialValue: 7, unit: "%", category: "emulsion" },
  {
    name: "Refractometric Concentration",
    initialValue: 6,
    unit: "%BR",
    category: "emulsion",
  },
  {
    name: "Nitrate Content",
    initialValue: 10,
    unit: "ppm",
    category: "emulsion",
  },
  {
    name: "Bacterial Count",
    initialValue: 1000,
    unit: "UF",
    category: "emulsion",
  },
  { name: "Fungus Count", initialValue: 100, unit: "UF", category: "emulsion" },
  { name: "Chloride", initialValue: 50, unit: "ppm", category: "emulsion" },
  { name: "Conductivity", initialValue: 1, unit: "mS", category: "emulsion" },
  { name: "TDS", initialValue: 500, unit: "ppm", category: "emulsion" },
  { name: "Tramp Oil", initialValue: 1, unit: "%", category: "emulsion" },
  {
    name: "Corrosion Test",
    initialValue: 0,
    unit: "scale",
    category: "emulsion",
  },
  {
    name: "Water Hardness",
    initialValue: 150,
    unit: "ppm",
    category: "emulsion",
  },
];

const greaseParams = [
  {
    name: "Consistency",
    initialValue: 2,
    unit: "NLGI",
    category: "greaseProperties",
  },
  {
    name: "Dropping Point",
    initialValue: 200,
    unit: "°C",
    category: "greaseProperties",
  },
  {
    name: "Viscosity of Base Oil @ 40°C",
    initialValue: 100,
    unit: "cSt",
    category: "greaseProperties",
  },
  {
    name: "Water Resistance",
    initialValue: 5,
    unit: "% loss",
    category: "greaseProperties",
  },
  {
    name: "Oxidation Stability",
    initialValue: 3,
    unit: "kPa",
    category: "greaseProperties",
  },
  {
    name: "Wear Protection",
    initialValue: 0.5,
    unit: "mm",
    category: "greaseProperties",
  },
  {
    name: "Calcium",
    initialValue: 800,
    unit: "ppm",
    category: "additiveMetals",
  },
  { name: "Zinc", initialValue: 400, unit: "ppm", category: "additiveMetals" },
  { name: "Iron", initialValue: 15, unit: "ppm", category: "wearMetals" },
  { name: "Copper", initialValue: 10, unit: "ppm", category: "wearMetals" },
];

async function seedData() {
  try {
    // Step 1: Clear Data and Indexes
    if (shouldReseed) {
      console.log("🧹 Clearing existing data and indexes...");
      await OilType.deleteMany({});
      await OilType.collection.dropIndexes();
      await Equipment.deleteMany({});
      await Equipment.collection.dropIndexes();
      await Lab.deleteMany({});
      await Lab.collection.dropIndexes();
      await Report.deleteMany({});
      await Report.collection.dropIndexes();
      await Notification.deleteMany({});
      await Notification.collection.dropIndexes();
      console.log("✅ Collections cleared.");
    } else {
      console.log("🔍 Skipping clear—using existing data if present.");
    }

    // Step 2: Seed OilTypes (11)
    let oilTypeDocs = await OilType.find();
    if (oilTypeDocs.length === 0) {
      const oilTypes = [
        {
          name: "Omala 68",
          brand: "Shell",
          type: "neat",
          properties: neatParams,
        },
        {
          name: "Hydraul 32",
          brand: "Mobil",
          type: "neat",
          properties: neatParams,
        },
        {
          name: "GearOil 100",
          brand: "Castrol",
          type: "neat",
          properties: neatParams,
        },
        {
          name: "LubriMax 46",
          brand: "Exxon",
          type: "neat",
          properties: neatParams,
        },
        {
          name: "Turbo 150",
          brand: "BP",
          type: "neat",
          properties: neatParams,
        },
        {
          name: "CoolCut 10",
          brand: "Total",
          type: "water-mixable",
          properties: waterMixableParams,
        },
        {
          name: "AquaMix 5",
          brand: "Shell",
          type: "water-mixable",
          properties: waterMixableParams,
        },
        {
          name: "MetalFluid 20",
          brand: "Mobil",
          type: "water-mixable",
          properties: waterMixableParams,
        },
        {
          name: "EmulsiPro 15",
          brand: "Castrol",
          type: "water-mixable",
          properties: waterMixableParams,
        },
        {
          name: "Lithium EP2",
          brand: "Exxon",
          type: "grease",
          properties: greaseParams,
        },
        {
          name: "Polyurea Grease",
          brand: "BP",
          type: "grease",
          properties: greaseParams,
        },
      ];
      oilTypeDocs = await OilType.insertMany(oilTypes);
      console.log(
        "✅ Seeded 11 OilTypes:",
        oilTypeDocs.map((o) => o.name)
      );
    } else {
      console.log("✅ OilTypes already seeded.");
    }

    // Step 3: Seed Equipment (10)
    let equipmentDocs = await Equipment.find();
    if (equipmentDocs.length === 0) {
      const equipmentNames = [
        "Op-30",
        "Pump-12",
        "GearBox-5",
        "Hydra-8",
        "Cutter-1",
        "Press-25",
        "Turbine-3",
        "Mill-7",
        "Lathe-9",
        "Comp-15",
      ];
      const equipment = equipmentNames.map((name) => ({
        name,
        companyId,
        type: faker.helpers.arrayElement([
          "pump",
          "gearbox",
          "cutter",
          "turbine",
        ]),
        location: faker.location.city(),
        status: "active",
        oilHistory: faker.helpers
          .arrayElements(oilTypeDocs, { min: 1, max: 2 })
          .map((oil) => ({
            oilTypeId: oil._id,
            brand: oil.brand,
            name: oil.name,
            fillDate: new Date("2024-09-01"),
            volume: faker.number.int({ min: 100, max: 1000 }),
            application: faker.helpers.arrayElement([
              "hydraulics",
              "cutting",
              "lubrication",
            ]),
          })),
        operationalHours: faker.number.int({ min: 100, max: 1000 }),
        hoursPerDay: 8,
        section: faker.helpers.arrayElement([
          "InSitus",
          "Factory Floor",
          "Maintenance Bay",
        ]),
      }));
      equipmentDocs = await Equipment.insertMany(equipment);
      console.log(
        "✅ Seeded 10 Equipment:",
        equipmentDocs.map((e) => e.name)
      );
    } else {
      console.log("✅ Equipment already seeded.");
    }

    // Step 4: Seed Lab (260 reports)
    let labDocs = await Lab.find();
    if (labDocs.length === 0) {
      const labReports = [];
      const startDate = new Date("2024-09-01");
      for (const equip of equipmentDocs) {
        for (let week = 0; week < 26; week++) {
          const oil = faker.helpers.arrayElement(equip.oilHistory);
          const oilType = oilTypeDocs.find((o) => o._id.equals(oil.oilTypeId));
          const paramSubset = faker.helpers
            .arrayElements(oilType.properties, { min: 2, max: 5 })
            .map((p) => {
              let value = p.initialValue;
              if (p.category === "wearMetals") value += week * 0.5;
              else if (p.name === "pH")
                value = faker.number.float({ min: 6, max: 9, precision: 0.1 });
              else if (p.name === "Viscosity @ 40°C") value += week * 0.2;
              else if (p.name === "Concentration")
                value = faker.number.float({ min: 5, max: 10, precision: 0.1 });
              else if (p.name === "Corrosion Test")
                value = faker.number.int({ min: 0, max: 5 });
              else if (p.name === "Bacterial Count")
                value = faker.number.int({ min: 100, max: 10000 });
              return {
                name: p.name,
                value,
                unit: p.unit,
                category: p.category,
              };
            });
          const status = paramSubset.some(
            (p) =>
              (p.name === "Iron" && p.value > 30) ||
              (p.name === "pH" && p.value < 6) ||
              (p.name === "Bacterial Count" && p.value > 5000)
          )
            ? "caution"
            : "good";
          labReports.push({
            equipmentId: equip._id,
            companyId,
            oilTypeId: oil.oilTypeId,
            timestamp: new Date(
              startDate.getTime() + week * 7 * 24 * 60 * 60 * 1000
            ),
            parameters: paramSubset,
            status,
          });
        }
      }
      labDocs = await Lab.insertMany(labReports);
      console.log("✅ Seeded 260 Lab Reports with parameter subsets");
    } else {
      console.log("✅ Lab Reports already seeded.");
    }

    // Step 5: Seed Report (260 reports)
    let reportDocs = await Report.find();
    if (reportDocs.length === 0) {
      const reports = labDocs.map((lab) => ({
        companyId,
        equipmentId: lab.equipmentId,
        type: "oil-analysis",
        labReportId: lab._id,
        generatedAt: lab.timestamp,
        status: lab.status,
        insights: faker.lorem.sentence(),
        reportFile: `/reports/oil-analysis-${lab._id}.pdf`,
        metadata: {
          sources: [{ type: "lab", refId: lab._id }],
          exportFormat: "pdf",
        },
      }));
      reportDocs = await Report.insertMany(reports);
      console.log("✅ Seeded 260 Reports");

      for (const equip of equipmentDocs) {
        const equipReports = reportDocs.filter((r) =>
          r.equipmentId.equals(equip._id)
        );
        equip.reportIds = equipReports.map((r) => r._id);
        await equip.save();
        console.log(
          `✅ Updated ${equip.name} with ${equipReports.length} reportIds`
        );
      }
    } else {
      console.log("✅ Reports already seeded.");
    }

    // Step 6: Seed Notifications (based on Equipment)
    let notificationDocs = await Notification.find();
    if (
      notificationDocs.length === 0 ||
      process.argv.includes("--seed-notifications")
    ) {
      const notifications = [];

      // Sensor Alerts (from Lab data)
      labDocs.forEach((lab) => {
        const equip = equipmentDocs.find((e) => e._id.equals(lab.equipmentId));
        const oil = equip.oilHistory.find((o) =>
          o.oilTypeId.equals(lab.oilTypeId)
        );
        lab.parameters.forEach((param) => {
          if (
            (param.name === "Iron" && param.value > 30) ||
            (param.name === "pH" && param.value < 6) ||
            (param.name === "Bacterial Count" && param.value > 5000)
          ) {
            notifications.push({
              userId,
              companyId,
              type: "sensor-alert",
              shortMessage: `${param.name} alert on ${equip.name}`,
              detailedMessage: `${param.name} is ${param.value} ${param.unit} on ${equip.name} (${oil.name}), exceeding safe limits.`,
              relatedData: { entityType: "Sensor", entityId: lab.equipmentId },
              status: "unread",
              priority: param.value > 50 ? "critical" : "high",
              sentAt: lab.timestamp,
              metadata: {
                sender: "system",
                actionUrl: `/equipment/${lab.equipmentId}/oil-analysis`,
              },
              expiresAt: new Date(
                lab.timestamp.getTime() + 7 * 24 * 60 * 60 * 1000
              ),
            });
          }
        });
      });

      // Maintenance Reminders (every 3 months from equipment fill date)
      equipmentDocs.forEach((equip) => {
        const oil = faker.helpers.arrayElement(equip.oilHistory);
        const fillDate = new Date(oil.fillDate);
        const maintenanceDate = new Date(
          fillDate.getTime() + 90 * 24 * 60 * 60 * 1000
        ); // 3 months
        if (maintenanceDate < new Date()) {
          notifications.push({
            userId,
            companyId,
            type: "maintenance-reminder",
            shortMessage: `Maintenance due for ${equip.name}`,
            detailedMessage: `Scheduled maintenance for ${equip.name} (${
              oil.name
            }) is overdue since ${maintenanceDate.toLocaleDateString()}.`,
            relatedData: { entityType: "Maintenance", entityId: equip._id },
            status: "unread",
            priority: "medium",
            sentAt: maintenanceDate,
            metadata: {
              sender: "system",
              actionUrl: `/equipment/${equip._id}/maintenance`,
            },
            expiresAt: new Date(
              maintenanceDate.getTime() + 7 * 24 * 60 * 60 * 1000
            ),
          });
        }
      });

      // Report Ready (from Report data)
      reportDocs.forEach((report) => {
        const equip = equipmentDocs.find((e) =>
          e._id.equals(report.equipmentId)
        );
        notifications.push({
          userId,
          companyId,
          type: "report-ready",
          shortMessage: `Report ready for ${equip.name}`,
          detailedMessage: `Oil analysis report for ${equip.name} is available.`,
          relatedData: { entityType: "Report", entityId: report._id },
          status: "unread",
          priority: "low",
          sentAt: report.generatedAt,
          metadata: { sender: "system", actionUrl: `/reports/${report._id}` },
          expiresAt: new Date(
            report.generatedAt.getTime() + 7 * 24 * 60 * 60 * 1000
          ),
        });
      });

      notificationDocs = await Notification.insertMany(notifications);
      console.log(`✅ Seeded ${notificationDocs.length} Notifications`);
    } else {
      console.log("✅ Notifications already seeded.");
    }

    // Step 7: Dynamic Notification Addition (optional via CLI)
    const addNotification = process.argv.indexOf("--add-notification");
    if (addNotification !== -1) {
      const equipmentIdArg = process.argv[addNotification + 1];
      if (!equipmentIdArg || !mongoose.Types.ObjectId.isValid(equipmentIdArg)) {
        console.error(
          "❌ Invalid or missing equipmentId for --add-notification"
        );
      } else {
        const equipmentId = new mongoose.Types.ObjectId(equipmentIdArg);
        const equip = equipmentDocs.find((e) => e._id.equals(equipmentId));
        if (!equip) {
          console.error(`❌ Equipment with ID ${equipmentId} not found`);
        } else {
          const oil = faker.helpers.arrayElement(equip.oilHistory);
          const newNotification = {
            userId,
            companyId,
            type: "sensor-alert",
            shortMessage: `Critical alert on ${equip.name}`,
            detailedMessage: `Iron level spiked to 60 ppm on ${equip.name} (${oil.name}).`,
            relatedData: { entityType: "Sensor", entityId: equipmentId },
            status: "unread",
            priority: "critical",
            sentAt: new Date(),
            metadata: {
              sender: "system",
              actionUrl: `/equipment/${equipmentId}/oil-analysis`,
            },
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          };
          const inserted = await Notification.create(newNotification);
          console.log(
            `✅ Added new notification for ${equip.name}:`,
            inserted.shortMessage
          );
        }
      }
    }

    console.log("✅ Seeding Complete!");
  } catch (err) {
    console.error("❌ Seeding Error:", err);
  } finally {
    mongoose.connection.close();
    console.log("✅ MongoDB Connection Closed");
  }
}

seedData();
