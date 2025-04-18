// specificationModel.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SpecificationSchema = new Schema(
  {
    key: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
    unit: { type: String, trim: true },
    testMethod: { type: String, trim: true },
    dataType: {
      type: String,
      enum: ["number", "string", "boolean", "range"],
      default: "string",
    },
    isVisible: { type: Boolean, default: true },
    group: { type: String, trim: true },
  },
  { _id: false }
);

module.exports = SpecificationSchema; // Export just the schema, not a model
