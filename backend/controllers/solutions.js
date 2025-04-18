const { getThresholds } = require("./thresholds");

const getSolutions = async (paramName, severity, oilType, value) => {
  const solutionMap = {
    pH: {
      critical: {
        tooLow: ["Increase pH with additive", "Check for contamination"],
        tooHigh: ["Dilute with water", "Inspect system balance"],
      },
      caution: {
        tooLow: ["Monitor trends", "Prepare additive"],
        tooHigh: ["Monitor trends", "Check dilution"],
      },
    },
    "Bacterial Count": {
      critical: {
        tooHigh: ["Check coolant filters", "Apply biocide treatment"],
      },
      caution: {
        tooHigh: ["Inspect filters", "Schedule maintenance"],
      },
    },
  };

  const thresholds = await getThresholds(oilType);
  const condition =
    value < (thresholds[paramName]?.min || 0) ? "tooLow" : "tooHigh";
  return (
    solutionMap[paramName]?.[severity]?.[condition] || ["Investigate further"]
  );
};

module.exports = { getSolutions };
