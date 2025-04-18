const staticThresholds = {
  "water-mixable": {
    pH: { min: 6, max: 8, cautionMin: 5, cautionMax: 9, unit: "-" },
    "Refractometric Concentration": {
      min: 5,
      max: 10,
      cautionMin: 3,
      unit: "%BR",
    },
    "Bacterial Count": { max: 5000, cautionMax: 10000, unit: "UF" },
    Conductivity: { max: 2, cautionMax: 5, unit: "mS" },
  },
  neat: {
    "Viscosity @ 40°C": { min: 30, max: 50, unit: "cSt" },
  },
};

const getThresholds = async (oilType) => {
  console.log(`Fetching thresholds for oilType: ${oilType}`);
  return staticThresholds[oilType] || staticThresholds["neat"];
};

module.exports = { getThresholds };
