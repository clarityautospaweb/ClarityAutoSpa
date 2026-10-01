const mongoose = require("mongoose");

const serviceCategorySchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    order: { type: Number, default: 0 },
    enabled: { type: Boolean, default: true },
    requiresAssessment: { type: Boolean, default: false },
    requiresAcknowledgement: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("ServiceCategory", serviceCategorySchema);
