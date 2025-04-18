// File: backend/services/healthService.js
const Equipment = require("../models/equipmentModel");
const Lab = require("../models/labModel");

async function calculateHealth(equipmentId, oilId = null) {
  const equipment = await Equipment.findById(equipmentId);
  if (!equipment) throw new Error("Equipment not found");

  let oilHealth = 100;
  if (oilId) {
    const labData = await Lab.findOne({ oilId, isDeleted: false }).sort({
      timestamp: -1,
    });
    if (labData) {
      // Placeholder: Reduce health based on parameter deviation (example logic)
      oilHealth =
        100 -
        labData.parameters.reduce((sum, p) => {
          const deviation = p.value > 10 ? 5 : 0; // Arbitrary threshold
          return sum + deviation;
        }, 0);
      oilHealth = Math.max(0, Math.min(100, oilHealth));
    }
    equipment.oilHistory.id(oilId).healthScore = oilHealth;
    equipment.oilHistory.id(oilId).lastHealthUpdate = new Date();
  }

  // Equipment health: Average of active oil health scores + event impact
  const activeOils = equipment.oilHistory.filter((o) => !o.deletedAt);
  const avgOilHealth = activeOils.length
    ? activeOils.reduce((sum, oil) => sum + (oil.healthScore || 100), 0) /
      activeOils.length
    : 100;
  const eventImpact = equipment.events.reduce(
    (sum, e) => sum + (e.impactOnHealth || 0),
    0
  );
  const equipmentHealth = Math.max(
    0,
    Math.min(100, 0.9 * avgOilHealth + 0.1 * eventImpact)
  );

  return { oilHealth, equipmentHealth };
}

module.exports = { calculateHealth };
