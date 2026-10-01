const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
    pricingType: {
      type: String,
      enum: ["fixed", "starts_at", "inspection"],
      default: "fixed",
    },
    category: { type: String, required: true },
    time: { type: String, default: "" },
    acuityLink: { type: String, default: "" },
    carType: { type: String, default: "All Vehicles" },
    displayOrder: { type: Number, default: 0 },
    imageUrl: { type: String },
    imageId: { type: String }, // Used by ImageKit to delete/replace
    enabled: { type: Boolean, default: true },
    bestFor: { type: String, default: "" },
    categoryId: { type: String }, // slug of ServiceCategory
    vehicleSize: { type: String }, // 'sedan', 'suv', 'xl_suv', or null
    turnaround: { type: String, default: "" },
    ctaType: {
      type: String,
      enum: ["book", "quote", "assessment"],
      default: "book",
    },
    includedItems: [{ type: String }],
    isSpecialty: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Service", serviceSchema);
