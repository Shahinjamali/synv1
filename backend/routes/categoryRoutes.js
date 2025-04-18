// categoryRoutes.js
const express = require("express");
const router = express.Router();
const Category = require("../models/categoryModel"); // Adjust path as needed
const mongoose = require("mongoose");

// Helper function for consistent API response format
const apiResponse = (success, data = null, error = null) => ({
  success,
  data,
  error,
});

// GET /categories - General category query (optional scoped filtering)
router.get("/", async (req, res) => {
  try {
    const { scope, isSubcategory, parentSlug } = req.query;

    const filter = {
      "metadata.status": { $in: ["active", "draft"] },
    };

    if (scope) filter.scope = scope;
    if (isSubcategory !== undefined)
      filter.isSubcategory = isSubcategory === "true";
    if (parentSlug) filter.parentSlug = parentSlug;

    const categories = await Category.find(filter)
      .select("title subtitle slug scope isSubcategory parent parentSlug")
      .lean();

    res.json(apiResponse(true, categories));
  } catch (error) {
    console.error("Error fetching categories:", error);
    res
      .status(500)
      .json(apiResponse(false, null, "Failed to fetch categories"));
  }
});

// GET /api/categories/:categoryId/subcategories - Fetch subcategories for a category
router.get("/:categoryId/subcategories", async (req, res) => {
  try {
    const { categoryId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res
        .status(400)
        .json(apiResponse(false, null, "Invalid category ID"));
    }

    const subcategories = await Category.find({
      parent: categoryId,
      isSubcategory: true,
      "metadata.status": { $in: ["active", "draft"] },
    })
      .select("title slug")
      .lean();

    res.json(apiResponse(true, subcategories));
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    res
      .status(500)
      .json(apiResponse(false, null, "Failed to fetch subcategories"));
  }
});

// POST /api/categories - Create a new category
router.post("/", async (req, res) => {
  try {
    const categoryData = req.body;

    // Validate required fields
    if (!categoryData.title || !categoryData.slug || !categoryData.scope) {
      return res
        .status(400)
        .json(apiResponse(false, null, "Missing required fields"));
    }

    // Ensure slug is unique
    const existingSlug = await Category.findOne({ slug: categoryData.slug });
    if (existingSlug) {
      return res
        .status(400)
        .json(apiResponse(false, null, "Slug already exists"));
    }

    // If subcategory, validate parent exists
    if (categoryData.isSubcategory && categoryData.parent) {
      if (!mongoose.Types.ObjectId.isValid(categoryData.parent)) {
        return res
          .status(400)
          .json(apiResponse(false, null, "Invalid parent category ID"));
      }
      const parentCategory = await Category.findById(categoryData.parent);
      if (!parentCategory) {
        return res
          .status(400)
          .json(apiResponse(false, null, "Parent category not found"));
      }
    }

    const category = new Category(categoryData);
    const savedCategory = await category.save();

    res.status(201).json(apiResponse(true, savedCategory));
  } catch (error) {
    console.error("Error creating category:", error);
    if (error.name === "ValidationError") {
      res.status(400).json(apiResponse(false, null, error.message));
    } else {
      res
        .status(500)
        .json(apiResponse(false, null, "Failed to create category"));
    }
  }
});

// GET /api/categories/slug/:slug - Fetch category by slug (for getCategoryBySlug)
router.get("/slug/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug })
      .select(
        "title subtitle slug scope isSubcategory parent parentSlug description metadata"
      )
      .lean();

    if (!category) {
      return res
        .status(404)
        .json(apiResponse(false, null, "Category not found"));
    }

    res.json(apiResponse(true, category));
  } catch (error) {
    console.error("Error fetching category by slug:", error);
    res.status(500).json(apiResponse(false, null, "Failed to fetch category"));
  }
});

module.exports = router;
