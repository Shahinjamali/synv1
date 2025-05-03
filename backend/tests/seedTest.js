const mongoose = require("mongoose");
require("dotenv").config();
const Product = require("../models/productModel"); // Adjust this path as needed
const Category = require("../models/categoryModel"); // Adjust this path as needed
const MediaAsset = require("../models/mediaAssetModel"); // Adjust this path as needed

async function seedTest() {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/synix_dev",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    // Clear old collections
    await Promise.all([
      Product.deleteMany({}),
      Category.deleteMany({}),
      MediaAsset.deleteMany({}),
    ]);

    // Sync indexes to ensure schema consistency
    await Product.syncIndexes();
    await Category.syncIndexes();
    await MediaAsset.syncIndexes();

    const parentCategory = await Category.create({
      title: "Metalworking Fluids",
      subtitle: "All coolants and cutting fluids",
      slug: "metalworking-fluids",
      description: {
        short: "Base category for MWF",
        detailed: "Includes water-miscible and neat oils",
      },
      overview: "Category for industrial metal cutting fluids.",
      isSubcategory: false,
      metadata: {
        industryFocus: ["automotive", "aerospace"],
      },
    });

    const subCategory = await Category.create({
      title: "Water-Miscible",
      subtitle: "Soluble oils and synthetics",
      slug: "water-miscible",
      parent: parentCategory._id,
      isSubcategory: true,
      description: {
        short: "For emulsions and synthetics",
        detailed: "Used in CNC operations and machining centers",
      },
      overview: "Used in precision metal machining.",
      metadata: {
        industryFocus: ["automotive"],
      },
    });

    const media = await MediaAsset.create({
      type: "document",
      url: "https://cdn.synix.com/files/ECOCOOL68CF_TDS_EN.pdf",
      title: "ECOCOOL 68 CF - TDS English",
      format: "pdf",
      language: "en",
      access: "public",
      metadata: {
        documentType: "TDS",
        version: "v2.1",
        publicationDate: new Date("2024-01-10"),
      },
      owner: {
        type: "product",
        id: new mongoose.Types.ObjectId(), // temporary, to be updated
      },
    });

    const product = await Product.create({
      title: "ECOCOOL 68 CF",
      subtitle: "Synthetic high-performance coolant",
      tagline: "Next-generation water-miscible coolant",
      slug: "ecocool-68-cf",
      category: parentCategory._id,
      subcategory: subCategory._id,
      categorySlug: parentCategory.slug,
      subcategorySlug: subCategory.slug,
      description: {
        short: "High-lubricity synthetic cutting fluid",
        detailed:
          "Suitable for ferrous and non-ferrous metals in CNC applications.",
      },
      overview: "Synthetic emulsion for high-speed machining.",
      keyFeatures: [
        "Low foam",
        "Long sump life",
        "Boron-free",
        "High lubricity",
      ],
      applications: [
        {
          industry: "Automotive Manufacturing",
          useCase: "CNC Machining",
          materials: ["Steel", "Aluminum"],
        },
      ],
      packaging: [
        {
          type: "Drum",
          size: 200,
          unit: "L",
          sku: "EC68CF-200",
        },
      ],
      properties: {
        baseOil: "synthetic_ester",
        viscosityGrade: "ISO VG 68",
        flashPoint: { value: 180, unit: "°C", testMethod: "ASTM D92" },
        pourPoint: { value: -20, unit: "°C", testMethod: "ASTM D97" },
        foodGrade: false,
        biodegradable: true,
      },
      compliance: {
        sds: {
          available: true,
          documentId: media._id,
          version: "v2.1",
        },
        reachCompliant: true,
        rohsCompliant: true,
      },
      mediaAssets: [media._id],
      visibility: { isPublic: true },
      metadata: {
        version: "1.0.0",
        tags: ["coolant", "synthetic", "CNC"],
      },
    });

    media.owner.id = product._id;
    await media.save();

    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error during seed:", err);
    process.exit(1);
  }
}

seedTest();
