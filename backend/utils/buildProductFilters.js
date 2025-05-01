const buildProductFilters = (query, isAuthenticated) => {
  const filter = {};

  filter["metadata.status"] = query.status || "active";

  if (!isAuthenticated) {
    filter["visibility.isPublic"] = true;
  }

  if (query.keyword) {
    filter.$text = { $search: query.keyword };
  }

  const exactMatchFields = [
    { queryParam: "category", dbField: "categorySlug" },
    { queryParam: "subcategory", dbField: "subcategorySlug" },
    { queryParam: "baseOil", dbField: "properties.baseOil" },
  ];

  exactMatchFields.forEach(({ queryParam, dbField }) => {
    if (query[queryParam]) {
      filter[dbField] = query[queryParam];
    }
  });

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
