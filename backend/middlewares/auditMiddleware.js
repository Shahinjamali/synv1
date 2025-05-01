const mongoose = require("mongoose");

const auditLog = (action, detailsFn) => {
  return async (req, res, next) => {
    try {
      const AuditLog = mongoose.model("AuditLog");
      const details = detailsFn(req, res);
      const auditEntry = new AuditLog({
        userId: req.user?._id || null,
        action,
        entity: {
          entityType: "Equipment",
          entityId: req.params.id || null,
        },
        details,
        metadata: {
          ipAddress: req.ip,
          userAgent: req.headers["user-agent"] || "",
          context: "API Request",
        },
      });
      await auditEntry.save();
      next();
    } catch (err) {
      console.error("[auditMiddleware] Audit log error:", err);
      next(); // Continue even if audit logging fails
    }
  };
};

module.exports = { auditLog };
