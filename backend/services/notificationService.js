// backend/services/notificationService.js
const Notification = require("../models/notificationModel");
const { getThresholds } = require("../controllers/thresholds");
const { getSolutions } = require("../controllers/solutions");

async function computeNotifications(analyses, oilType, userId, companyId) {
  console.log("computeNotifications - Inputs:", {
    analysesLength: analyses.length,
    oilType,
    userId,
    companyId,
  });
  console.log(
    "computeNotifications - Analyses:",
    JSON.stringify(analyses, null, 2)
  );

  if (!analyses.length) {
    console.log("computeNotifications - No analyses, returning empty array");
    return [];
  }

  const notifications = [];
  const thresholds = await getThresholds(oilType);
  console.log("computeNotifications - Thresholds:", thresholds);

  const equipmentIds = [...new Set(analyses.map((a) => a.equipmentId))];
  const existingNotifications = await Notification.find({
    userId,
    companyId,
    "relatedData.entityId": { $in: equipmentIds },
    "relatedData.entityType": "equipment", // Fixed from "Sensor"
  }).lean();
  console.log(
    "computeNotifications - Existing notifications:",
    JSON.stringify(existingNotifications, null, 2)
  );

  const conditionMap = new Map();
  analyses.forEach((analysis) => {
    analysis.parameters.forEach((param) => {
      const rule = thresholds[param.name];
      if (!rule) return;

      const conditionKey = `${analysis.equipmentId}-${param.name}`;
      if (!conditionMap.has(conditionKey)) {
        conditionMap.set(conditionKey, { analysis, param });
      } else {
        const existingParam = conditionMap.get(conditionKey).param;
        if (
          ("max" in rule &&
            param.value > existingParam.value &&
            param.value > rule.max) ||
          ("min" in rule &&
            param.value < existingParam.value &&
            param.value < rule.min)
        ) {
          conditionMap.set(conditionKey, { analysis, param });
        }
      }
    });
  });
  console.log(
    "computeNotifications - Condition map:",
    Array.from(conditionMap.entries())
  );

  for (const [conditionKey, { analysis, param }] of conditionMap) {
    console.log(`computeNotifications - Processing condition: ${conditionKey}`);
    const rule = thresholds[param.name];

    const existing = existingNotifications.find(
      (n) =>
        n.relatedData.entityId.toString() === analysis.equipmentId &&
        n.shortMessage === `${param.name} Alert`
    );
    console.log(
      `computeNotifications - Existing match for ${param.name}:`,
      existing ? existing._id : "none"
    );

    if (existing) {
      notifications.push({
        _id: existing._id.toString(),
        shortMessage: existing.shortMessage,
        detailedMessage: existing.detailedMessage,
        sentAt: existing.sentAt.toISOString(),
        actionUrl: existing.metadata.actionUrl,
        status: existing.status,
        equipmentId: existing.equipmentId?.toString(),
        priority: existing.priority,
        type: existing.type,
        oilTypeId: existing.oilTypeId?.toString() || null, // Add for existing too
        oilName: existing.oilName || null, // Add for existing too
      });
      continue;
    }

    let notificationData = null;
    if ("min" in rule && param.value < rule.min) {
      const severity =
        rule.cautionMin && param.value < rule.cautionMin
          ? "critical"
          : "caution";
      const solutions = await getSolutions(
        param.name,
        severity,
        oilType,
        param.value
      );

      notificationData = {
        equipmentId: analysis.equipmentId,
        companyId,
        userId,
        oilTypeId: analysis.oilTypeId?._id || null,
        oilName: analysis.oilTypeId?.name || null,
        type: "system-update",
        shortMessage: `${param.name} Alert`,
        detailedMessage: `${param.name} is ${param.value} ${
          param.unit || ""
        }, below threshold (${rule.min}). Recommended actions: ${solutions.join(
          ", "
        )}.`,
        relatedData: {
          entityType: "equipment",
          entityId: analysis.equipmentId,
        },
        status: "unread",
        priority: severity === "critical" ? "high" : "medium",
        sentAt: new Date(),
        metadata: {
          sender: "system",
          actionUrl: `/equipment/${analysis.equipmentId}/oil-analysis`,
        },
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        parameter: param.name,
        value: param.value,
      };
    } else if ("max" in rule && param.value > rule.max) {
      const severity =
        rule.cautionMax && param.value > rule.max ? "critical" : "caution";
      const solutions = await getSolutions(
        param.name,
        severity,
        oilType,
        param.value
      );

      notificationData = {
        equipmentId: analysis.equipmentId,
        companyId,
        userId,
        oilTypeId: analysis.oilTypeId?._id || null, // Added
        oilName: analysis.oilTypeId?.name || null, // Added
        type: "system-update",
        shortMessage: `${param.name} Alert`,
        detailedMessage: `${param.name} is ${param.value} ${
          param.unit || ""
        }, exceeding limit (${rule.max}). Recommended actions: ${solutions.join(
          ", "
        )}.`,
        relatedData: {
          entityType: "equipment",
          entityId: analysis.equipmentId,
        },
        status: "unread",
        priority: severity === "critical" ? "high" : "medium",
        sentAt: new Date(),
        metadata: {
          sender: "system",
          actionUrl: `/equipment/${analysis.equipmentId}/oil-analysis`,
        },
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        parameter: param.name,
        value: param.value,
      };
    }

    if (notificationData) {
      const savedNotification = await saveNotification(notificationData);
      console.log(
        "[computeNotifications] Saved notification:",
        savedNotification
      );
      notifications.push({
        _id: savedNotification._id.toString(),
        shortMessage: savedNotification.shortMessage,
        detailedMessage: savedNotification.detailedMessage,
        sentAt: savedNotification.sentAt.toISOString(),
        actionUrl: savedNotification.metadata.actionUrl,
        status: savedNotification.status,
        equipmentId: savedNotification.equipmentId?.toString(),
        priority: savedNotification.priority,
        type: savedNotification.type,
        oilTypeId: savedNotification.oilTypeId?.toString() || null,
        oilName: savedNotification.oilName || null,
      });
    }
  }

  return notifications;
}

async function saveNotification(notificationData) {
  try {
    const notification = new Notification(notificationData); // Simplified, no redundant assignment
    await notification.save();
    console.log(
      "✅ Notification saved to database:",
      notification.shortMessage
    );
    return notification;
  } catch (error) {
    console.error("❌ Error saving notification:", error);
    throw error;
  }
}

async function createSystemNotification({
  equipmentId,
  companyId,
  userId,
  type,
  shortMessage,
  detailedMessage,
  priority = "low",
  oilTypeId = null, // ✅ Accept oilTypeId
  oilName = null, // ✅ Accept oilName
}) {
  try {
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const existing = await Notification.findOne({
      equipmentId,
      type,
      shortMessage,
      createdAt: { $gte: oneMinuteAgo },
    });
    if (existing) {
      console.log("Duplicate notification skipped:", shortMessage);
      return existing;
    }

    const notificationData = {
      equipmentId,
      companyId,
      userId,
      type,
      shortMessage,
      detailedMessage,
      oilTypeId, // ✅ Store oilTypeId
      oilName, // ✅ Store oilName
      relatedData: equipmentId
        ? { entityType: "equipment", entityId: equipmentId }
        : undefined,
      status: "unread",
      priority,
      sentAt: new Date(),
      metadata: {
        sender: "system",
        actionUrl: `/equipment/${equipmentId}/oil-analysis`,
      },
    };

    const notification = await saveNotification(notificationData);
    return notification;
  } catch (error) {
    console.error("Error creating system notification:", error);
    throw error;
  }
}

module.exports = {
  computeNotifications,
  saveNotification,
  createSystemNotification,
};
