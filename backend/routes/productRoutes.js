// Updated: src/routes/productRoutes.js
const express = require("express");
const router = express.Router();
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const MediaAsset = require("../models/mediaAssetModel");
const { protect, authorize } = require("../middlewares/authMiddleware");

const formatResponse = (status, message, data = null) => ({
  status,
  message,
  data,
});

const mapProductForResponse = async (product, user) => {
  const isAuthenticated = !!user;
  const roles = user?.roles || [];
  const isAdmin = roles.includes("admin");
  const isSuperadmin = roles.includes("superadmin");
  const isAnalyst = roles.includes("analyst");
  const isSubscriber = roles.includes("subscriber");

  const mediaAssets = await MediaAsset.find({
    "owner.type": "product",
    "owner.id": product._id,
  }).lean();

  const thumbnails = mediaAssets.filter(
    (m) => m.type === "thumbnail" && (m.access === "public" || isAuthenticated)
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
    applications: isAuthenticated ? product.applications || [] : undefined,
    compatibility: isAuthenticated ? product.compatibility || [] : undefined,
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

// GET /products
router.get("/", async (req, res) => {
  try {
    const {
      categorySlug,
      subcategorySlug,
      search,
      page = 1,
      limit = 10,
    } = req.query;
    const filter = { "metadata.status": "active" };
    if (!req.user) filter["visibility.isPublic"] = true;
    if (categorySlug) filter.categorySlug = categorySlug;
    if (subcategorySlug) filter.subcategorySlug = subcategorySlug;
    if (search) filter.$text = { $search: search };

    const products = await Product.find(filter)
      .populate("category", "title slug")
      .populate("subcategory", "title slug")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    const total = await Product.countDocuments(filter);
    const mapped = await Promise.all(
      products.map((p) => mapProductForResponse(p, req.user))
    );

    res.json(
      formatResponse("success", "Products fetched", {
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit),
        items: mapped,
      })
    );
  } catch (err) {
    console.error("[GET /products] Error:", err);
    res.status(500).json(formatResponse("error", "Server error"));
  }
});

// GET /products/categories
// GET /products/categories - Get all top-level product categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find({
      isSubcategory: false,
      "metadata.status": "active",
      scope: "product",
    }).lean();

    res.json(
      formatResponse("success", "Top-level product categories fetched", {
        total: categories.length,
        items: categories,
      })
    );
  } catch (err) {
    console.error("[GET /products/categories] Error:", err);
    res.status(500).json(formatResponse("error", "Server error"));
  }
});

// GET /products/:categorySlug/subcategories - Get subcategories for a product category
router.get("/:categorySlug/subcategories", async (req, res) => {
  try {
    const parent = await Category.findOne({
      slug: req.params.categorySlug,
      isSubcategory: false,
      "metadata.status": "active",
      scope: "product",
    }).lean();

    if (!parent) {
      return res
        .status(404)
        .json(formatResponse("error", "Parent product category not found"));
    }

    const subcategories = await Category.find({
      parent: parent._id,
      isSubcategory: true,
      "metadata.status": "active",
      scope: "product",
    }).lean();

    res.json(
      formatResponse("success", "Subcategories fetched", {
        total: subcategories.length,
        items: subcategories,
      })
    );
  } catch (err) {
    console.error("[GET /products/:categorySlug/subcategories] Error:", err);
    res.status(500).json(formatResponse("error", "Server error"));
  }
});

// GET /products/:slug - Get full product details by slug
router.get("/:slug", async (req, res) => {
  try {
    const filter = { slug: req.params.slug, "metadata.status": "active" };
    if (!req.user) filter["visibility.isPublic"] = true;

    const product = await Product.findOne(filter)
      .populate("category", "title slug")
      .populate("subcategory", "title slug")
      .lean();

    if (!product) {
      return res.status(404).json(formatResponse("error", "Product not found"));
    }

    const mappedProduct = await mapProductForResponse(product, req.user);
    res.json(formatResponse("success", "Product fetched", mappedProduct));
  } catch (err) {
    console.error("[GET /products/:slug] Error:", err);
    res.status(500).json(formatResponse("error", "Server error"));
  }
});

module.exports = router;
