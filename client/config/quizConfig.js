export const quizOptions = [
  { id: 1, label: "Embedded or heavy pet hair" },
  { id: 2, label: "Spilled drinks, sticky residue or food stains" },
  { id: 3, label: "Stained seats or carpets that need shampooing" },
  { id: 4, label: "Heavy dirt, sand or mud" },
  { id: 5, label: "Lingering smoke, food or pet odors" },
  { id: 6, label: "Mold, mildew, rodent debris or water-soaked carpets" },
  {
    id: 8,
    label: "Does your vehicle have bird droppings, tree sap, dirt, mud, bug splatter, or other exterior buildup—or do you simply want it to sparkle and shine like new?",
  },
  {
    id: 7,
    label: "None of these—just light dust, loose crumbs and routine cleaning",
  },
];

export const DEEP = [1, 2, 3, 4, 5];
export const SPECIALTY = [6];
export const EXTERIOR = [8];
export const NONE = 7;

export const quizResults = {
  MINI: {
    id: "MINI",
    title: "Mini Detail",
    copy: "Perfect for routine upkeep: a hand wash, vacuum and interior surface wipe-down.",
    targetSlug: "mini-detail",
  },
  DEEP: {
    id: "DEEP",
    title: "Deep Cleaning Needed",
    copy: "Choose an Interior-Only Detail for the cabin, or a Full Detail for interior and exterior care. Heavy contamination or persistent odors may require an assessment and additional charges.",
  },
  SPECIALTY: {
    id: "SPECIALTY",
    title: "Specialty Cleaning Assessment",
    copy: "Contact us before booking so we can assess the condition and recommend the appropriate treatment.",
    targetSlug: "specialty",
  },
  FULL: {
    id: "FULL",
    title: "Full Detail",
    copy: "Based on your selections, we recommend a Full Detail for comprehensive interior and exterior care.",
    targetSlug: "full-detail",
  }
};
