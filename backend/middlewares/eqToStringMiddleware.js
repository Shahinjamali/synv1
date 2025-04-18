/**
 * Middleware to convert equipmentId ObjectId fields to strings in API responses.
 * Handles both top-level equipmentId and nested equipmentId._id from populate.
 * Ensures consistency for frontend usage (e.g., React keys, API queries).
 */
const eqToStringMiddleware = (req, res, next) => {
  const originalJson = res.json;

  res.json = function (data) {
    const convertObjectIds = (obj) => {
      if (!obj || typeof obj !== "object") return obj;

      // Handle arrays (e.g., lists of equipment or analyses)
      if (Array.isArray(obj)) {
        return obj.map((item) => convertObjectIds(item));
      }

      // Convert `equipmentId` to string ONLY for non-query responses
      if (req.path.includes("/search") || req.path.includes("/list")) {
        if (obj.equipmentId) {
          if (typeof obj.equipmentId === "object" && obj.equipmentId._id) {
            obj.equipmentId._id = obj.equipmentId._id.toString();
          } else if (typeof obj.equipmentId.toString === "function") {
            obj.equipmentId = obj.equipmentId.toString();
          }
        }
      }

      // Recursively process nested objects
      for (const key in obj) {
        if (typeof obj[key] === "object" && obj[key] !== null) {
          convertObjectIds(obj[key]);
        }
      }
      return obj;
    };

    const convertedData = convertObjectIds(data);
    return originalJson.call(this, convertedData);
  };

  next();
};

module.exports = eqToStringMiddleware;
