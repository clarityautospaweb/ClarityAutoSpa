const mongoose = require("mongoose");

const galleryImageSchema = new mongoose.Schema(
  {
    title: { type: String, required: false },
    category: { type: String, default: "Detailing" },
    imageType: { type: String, default: "Plain Image" },
    imageUrl: { type: String, required: false }, // For Plain Image
    imageId: { type: String, required: false }, // For Plain Image
    beforeImageUrl: { type: String, required: false }, // For Before/After
    beforeImageId: { type: String, required: false }, // For Before/After
    afterImageUrl: { type: String, required: false }, // For Before/After
    afterImageId: { type: String, required: false }, // For Before/After
    displayOrder: { type: Number, default: 0 },
    showOnLandingPage: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("GalleryImage", galleryImageSchema);
