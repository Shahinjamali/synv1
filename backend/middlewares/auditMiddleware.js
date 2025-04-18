const mongoose = require("mongoose");
const AuditLog = require("../models/auditLogModel");

const auditLog = (entityType, action, getDetails) => {
  return async (req, res, next) => {
    try {
      // Proceed to the route handler
      await next();

      // Log only on successful responses (200-299)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const entityId =
          req.params.id || res.locals.entityId || req.body.equipmentId;
        if (!entityId || !mongoose.Types.ObjectId.isValid(entityId)) {
          console.warn("[Audit] Skipping log: Invalid entityId", { entityId });
          return;
        }

        const auditEntry = new AuditLog({
          userId: req.user?._id,
          action,
          entity: { entityType, entityId },
          details: getDetails ? getDetails(req, res) : {},
          metadata: {
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.headers["user-agent"],
          },
        });
        await auditEntry.save();
      }
    } catch (err) {
      console.error("[Audit Middleware] Error:", err);
      // Pass error to Express error handler
      next(err);
    }
  };
};

module.exports = { auditLog };
