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
  const isSubscriber = roles.includes("subscriber");

  const mediaAssetsRaw = await MediaAsset.find({
    owner: {
      $elemMatch: {
        type: "service",
        id: service._id,
      },
    },
  }).lean();

  const allowedAccess = (asset) => {
    if (asset.access === "public") return true;
    if (!isAuthenticated) return false;

    if (asset.access === "authenticated") return true;
    if (asset.access === "subscriber") {
      return isSubscriber || isAdmin || isSuperadmin;
    }
    if (asset.access === "restricted") {
      return (
        asset.restrictedRoles?.some((r) => roles.includes(r)) ||
        isAdmin ||
        isSuperadmin
      );
    }
    return false;
  };

  // Return flat array, not grouped object
  const mediaAssets = mediaAssetsRaw.filter(allowedAccess);

  return {
    ...service,
    mediaAssets, // flat array instead of grouped object
  };
};

// Utility to map a Product for response based on user access
const mapProductForResponse = async (
  product,
  user,
  options = { groupMedia: false }
) => {
  const roles = user?.roles || [];
  const isAuthenticated = !!user;
  const isAdmin = roles.includes("admin");
  const isSuperadmin = roles.includes("superadmin");
  const isSubscriber = roles.includes("subscriber");

  const mediaAssetsRaw = await MediaAsset.find({
    owner: {
      $elemMatch: {
        type: "product",
        id: product._id,
      },
    },
  }).lean();

  const allowedAccess = (asset) => {
    if (asset.access === "public") return true;
    if (!isAuthenticated) return false;

    if (asset.access === "authenticated") return true;
    if (asset.access === "subscriber") {
      return isSubscriber || isAdmin || isSuperadmin;
    }
    if (asset.access === "restricted") {
      return (
        asset.restrictedRoles?.some((r) => roles.includes(r)) ||
        isAdmin ||
        isSuperadmin
      );
    }
    return false;
  };

  const filteredAssets = mediaAssetsRaw.filter(allowedAccess);

  const groupedMedia = options.groupMedia
    ? filteredAssets.reduce((acc, asset) => {
        if (!acc[asset.type]) acc[asset.type] = [];
        acc[asset.type].push(asset);
        return acc;
      }, {})
    : filteredAssets;

  return {
    id: product._id,
    title: product.title,
    subtitle: product.subtitle,
    slug: product.slug,
    category: product.category,
    subcategory: product.subcategory,
    description: {
      short: product.description?.short || "",
      detailed: isAuthenticated ? product.description?.detailed : undefined,
    },
    keyFeatures: product.keyFeatures || [],
    applications: product.applications || [],
    mediaAssets: groupedMedia,
  };
};

module.exports = {
  formatResponse,
  mapProductForResponse,
  mapServiceForResponse,
};
