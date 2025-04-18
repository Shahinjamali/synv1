const validSections = ["oilAnalysis", "equipment", "logs"];
const validLevels = ["readOnly", "readWrite", "writeOnly", "unauthorized"];

const validatePermission = (section, level) => {
  return validSections.includes(section) && validLevels.includes(level);
};

module.exports = { validSections, validLevels, validatePermission };
