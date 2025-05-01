// utils/groupMediaAssets.js

function groupMediaAssets(mediaAssets = []) {
  const grouped = {};

  // 1. Group by type dynamically
  for (const asset of mediaAssets) {
    const type = asset.type || "other";

    if (!grouped[type]) {
      grouped[type] = [];
    }
    grouped[type].push(asset);
  }

  // 2. (Optional) Collect "weird" assets into 'other'
  const allowedTypes = ["thumbnail", "document", "icon", "banner"];
  const otherAssets = [];

  for (const [type, assets] of Object.entries(grouped)) {
    if (!allowedTypes.includes(type)) {
      otherAssets.push(...assets);
      delete grouped[type];
    }
  }

  if (otherAssets.length > 0) {
    grouped.other = otherAssets;
  }

  return grouped;
}

module.exports = { groupMediaAssets };
