const mongoose = require("mongoose");

const weeklyHoursSchema = new mongoose.Schema({
  day: { type: String, required: true },
  hours: { type: String, required: true },
});

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  photoUrl: { type: String },
  bio: { type: String },
});

const settingsSchema = new mongoose.Schema(
  {
    // Contact & Location
    weeklyHours: [weeklyHoursSchema],
    address: { type: String, default: "117 14th St, Brooklyn, NY 11215" },
    phone: { type: String, default: "+1 347-227-8485" },
    email: { type: String, default: "clarityautospabk@gmail.com" },
    appointmentRequirements: {
      type: String,
      default:
        "Appointment required for specialty services. Walk-ins welcome for basic washes.",
    },

    // Reviews & Rating
    rating: { type: Number, default: 4.6 },
    reviewCount: { type: Number, default: 133 },
    googleReviewsUrl: { type: String, default: "https://google.com" },

    // Brand & Badges (Admin toggleable, default off)
    showBlackOwnedBadge: { type: Boolean, default: false },
    showLgbtqBadge: { type: Boolean, default: false },

    // Hero Image
    heroImageUrl: { type: String, default: "" },

    // About Us Team
    team: [teamMemberSchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Settings", settingsSchema);
