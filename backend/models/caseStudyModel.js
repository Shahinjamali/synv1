// models/caseStudyModel.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CaseStudySchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  metadata: {
    status: {
      type: String,
      enum: ["active", "draft", "archived"],
      default: "active",
    },
  },
});

module.exports = mongoose.model("CaseStudy", CaseStudySchema);
