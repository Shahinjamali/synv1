const buildProductFilters = (query, isAuthenticated) => {
  const filter = {};

  filter["metadata.status"] = query.status || "active";

  if (!isAuthenticated) {
    filter["visibility.isPublic"] = true;
  }

  if (query.keyword) {
    filter.$text = { $search: query.keyword };
  }

  // ✅ Use explicit slugs only
  if (query.categorySlug) {
    filter["categorySlug"] = query.categorySlug;
  }

  if (query.subcategorySlug) {
    filter["subcategorySlug"] = query.subcategorySlug;
  }

  if (query.viscosityGrade) {
    filter["properties.viscosityGrade"] = {
      $regex: query.viscosityGrade,
      $options: "i",
    };
  }

  if (query.foodGrade !== undefined) {
    filter["properties.foodGrade"] = query.foodGrade === "true";
  }

  if (query.application) {
    filter.applications = { $in: [query.application] };
  }

  if (query.keyFeature) {
    filter.keyFeatures = { $in: [query.keyFeature] };
  }

  if (query.compatibilityName) {
    filter.compatibility = {
      $elemMatch: { name: query.compatibilityName },
    };
  }

  return filter;
};

// ✅ Export function
module.exports = {
  buildProductFilters,
};
