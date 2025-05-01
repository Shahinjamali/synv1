// utils/responseMappers.js

const MediaAsset = require("../models/mediaAssetModel"); // Assuming your media model is here

// Utility to standardize API responses
const formatResponse = (status, message, data = null) => ({
  status,
  message,
  data,
});

// Utility to map a Service for response based on user access
const mapServiceForResponse = async (service, user) => {
  const isAuthenticated = !!user;
  const roles = user?.roles || [];
  const isAdmin = roles.includes("admin");
  const isSuperadmin = roles.includes("superadmin");
  const isAnalyst = roles.includes("analyst");
  const isSubscriber = roles.includes("subscriber");

  const mediaAssets = await MediaAsset.find({
    "owner.type": "service",
    "owner.id": service._id,
  }).lean();

  const thumbnails = mediaAssets.filter(
    (m) =>
      m.type === "thumbnail" &&
      (m.access === "public" ||
        (isAuthenticated && ["authenticated", "subscriber"].includes(m.access)))
  );

  const documents = mediaAssets.filter(
    (m) =>
      m.type === "document" &&
      (isSuperadmin ||
        (isAdmin && ["authenticated", "public"].includes(m.access)) ||
        (isSubscriber &&
          ["subscriber", "authenticated", "public"].includes(m.access)) ||
        (!isAuthenticated && m.access === "public"))
  );

  const media = {
    thumbnails,
    documents,
  };

  const response = {
    id: service._id,
    title: service.title,
    subtitle: service.subtitle,
    tagline: service.tagline,
    slug: service.slug,
    overview: service.overview,
    description: {
      short: service.description?.short || "",
      detailed: isAuthenticated ? service.description?.detailed : undefined,
    },
    category: service.category,
    categorySlug: service.categorySlug,
    keyBenefits: service.keyBenefits || [],
    targetAudience: service.targetAudience || "",
    methodology: service.methodology || "",
    deliverables: service.deliverables || [],
    serviceLevels: service.serviceLevels || [],
    parametersMonitored: service.parametersMonitored || [],
    technologyUsed: service.technologyUsed || [],
    duration: service.duration || "",
    reportingDetails: service.reportingDetails || {},
    applicableIndustries: service.applicableIndustries || [],
    applicableEquipment: service.applicableEquipment || [],
    prerequisites: service.prerequisites || [],
    mediaAssets: media,
    visibility:
      isSubscriber || isAdmin || isSuperadmin
        ? service.visibility || {}
        : undefined,
    metadata: isSuperadmin ? service.metadata || {} : undefined,
    tags: service.metadata?.tags || [],
  };

  return response;
};

// Utility to map a Product for response based on user access
const mapProductForResponse = async (product, user) => {
  const isAuthenticated = !!user;
  const roles = user?.roles || [];
  const isAdmin = roles.includes("admin");
  const isSuperadmin = roles.includes("superadmin");
  const isAnalyst = roles.includes("analyst");
  const isSubscriber = roles.includes("subscriber");

  // Fetch related media assets
  const mediaAssets = await MediaAsset.find({
    "owner.type": "product",
    "owner.id": product._id,
  }).lean();

  // Filter media visibility
  const thumbnails = mediaAssets.filter(
    (m) =>
      m.type === "thumbnail" &&
      (m.access === "public" ||
        (isAuthenticated && ["authenticated", "subscriber"].includes(m.access)))
  );

  const documents = mediaAssets.filter(
    (m) =>
      m.type === "document" &&
      (isSuperadmin ||
        (isAdmin && ["authenticated", "public"].includes(m.access)) ||
        (isSubscriber &&
          ["subscriber", "authenticated", "public"].includes(m.access)) ||
        (!isAuthenticated && m.access === "public"))
  );

  const media = {
    thumbnails,
    documents,
  };

  // Build the dynamic product response
  const response = {
    id: product._id,
    title: product.title,
    subtitle: product.subtitle,
    tagline: product.tagline,
    slug: product.slug,
    overview: product.overview,
    description: {
      short: product.description?.short || "",
      detailed: isAuthenticated ? product.description?.detailed : undefined,
    },
    category: product.category,
    subcategory: product.subcategory,
    categorySlug: product.categorySlug,
    subcategorySlug: product.subcategorySlug,
    keyFeatures: product.keyFeatures || [],
    specifications:
      isAnalyst || isAdmin || isSuperadmin
        ? product.specifications || []
        : undefined,
    approvals:
      isAnalyst || isAdmin || isSuperadmin
        ? product.approvals || []
        : undefined,
    packaging:
      isAnalyst || isAdmin || isSuperadmin
        ? product.packaging || []
        : undefined,
    applications: product.applications || [],
    compatibility: product.compatibility || [],
    compliance:
      isSubscriber || isAdmin || isSuperadmin
        ? product.compliance || {}
        : undefined,
    visibility:
      isSubscriber || isAdmin || isSuperadmin
        ? product.visibility || {}
        : undefined,
    relatedProducts: product.relatedProducts || [],
    mediaAssets: media,
    properties: product.properties || {},
    metadata: isSuperadmin ? product.metadata || {} : undefined,
    tags: product.metadata?.tags || [],
  };

  return response;
};

module.exports = {
  formatResponse,
  mapProductForResponse,
  mapServiceForResponse,
};
