"use client";

import { useState } from "react";
import Image from "next/image";
import { ShieldCheck, AlertTriangle, Droplets, Wind, Bug, Flame, CheckCircle2, Upload, X, ArrowUpRight, Phone } from "lucide-react";
import QuoteForm from "@/components/features/QuoteForm";

const specialtyServicesList = [
  {
    title: "Mold & Mildew Remediation",
    pricing: "$800 – $1,650+",
    icon: Droplets,
    badge: "Antimicrobial Protocol",
    description: "Targeted biohazard treatment to safely eliminate active fungal growth, spores, and deep musty moisture from vehicle carpets, foam padding, seat fabrics, and ventilation passages.",
    highlights: [
      "EPA-registered botanical antimicrobial fogging",
      "HEPA-filter particulate extraction",
      "Thermal subfloor and underpadding drying",
      "High-output ozone air sterilization"
    ]
  },
  {
    title: "Flood & Water Damage Cleaning",
    pricing: "Custom Quote",
    icon: AlertTriangle,
    badge: "Emergency Extraction",
    description: "Rapid response extraction of standing rainwater, street runoff, or stormwater flooding. Industrial dehumidifiers and continuous air movers eliminate moisture before mold takes root.",
    highlights: [
      "Commercial extractor water removal",
      "Industrial thermal dehumidification",
      "Antimicrobial chemical barrier application",
      "Full cabin moisture meter diagnostics"
    ]
  },
  {
    title: "Rodent Infestation / Engine Bay Cleanup",
    pricing: "Custom Quote",
    icon: Bug,
    badge: "Biohazard Disinfection",
    description: "Comprehensive biohazard cleanup for mice and rat intrusion in engine bays and cabin ductwork. Safe extraction of droppings, nesting debris, and biological contaminants.",
    highlights: [
      "Protected biohazard removal & containment",
      "Enzyme disinfectant wash to dissolve pheromones",
      "Engine bay steam degreasing & decontamination",
      "Odor eradication to prevent return nesting"
    ]
  },
  {
    title: "Interior Odor Removal",
    pricing: "Custom Quote",
    icon: Wind,
    badge: "Molecular Neutralization",
    description: "Permanent molecular eradication of stubborn odors that ordinary air fresheners cannot mask — including heavy cigarette smoke, spoiled dairy, gasoline, and pet urine.",
    highlights: [
      "Targeted chemical neutralization of source contaminants",
      "Headliner and fabric deep steam cleaning",
      "Medical-grade ozone gas and chlorine dioxide vapor",
      "A/C evaporator and duct sanitization"
    ]
  },
  {
    title: "Waterlogged Carpet & Interior Restoration",
    pricing: "Custom Quote",
    icon: ShieldCheck,
    badge: "Subfloor Drying",
    description: "Specialized recovery for soaked vehicle floors caused by sunroof drain clogs, failed door weatherstripping, or backed-up A/C condensation pans.",
    highlights: [
      "Carpet unbolting & subfloor inspection",
      "Deep moisture extraction from foam underpad",
      "Mildew inhibitor and fiber reconditioning",
      "Thermal hot-air drying chambers"
    ]
  }
];

export default function SpecialtyContent() {
  const [selectedServiceForQuote, setSelectedServiceForQuote] = useState("");

  const scrollToQuote = (serviceTitle) => {
    setSelectedServiceForQuote(serviceTitle);
    const el = document.getElementById("quote-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="pb-24">
      {/* Hero Intro */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-12 md:pt-20 mb-16">
        <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/25 text-red-300 px-4 py-1.5 rounded-full tracking-[0.15em] uppercase mb-6 text-[12px] md:text-[14px] font-bold shadow-sm">
          <ShieldCheck className="w-4 h-4 text-red-400" />
          Brooklyn’s Dedicated Biohazard & Restoration Facility
        </div>
        <h1 className="font-heading font-medium text-white capitalize text-[clamp(2.75rem,5.5vw,4.75rem)] leading-[1.05] tracking-[-0.02em]">
          Specialty Cleaning & Restoration
        </h1>
        <p className="mt-5 text-base sm:text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-8 font-sans leading-relaxed">
          Ordinary car washes cannot handle biohazards, floodwaters, or toxic mold. We specialize in scientific interior decontamination and remediation in Park Slope, Brooklyn.
        </p>

        {/* Clear Disclaimer Alert */}
        <div className="max-w-3xl mx-auto bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 text-left text-xs sm:text-sm text-amber-200/90 flex items-start gap-3.5 shadow-xl">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-white">
              Specialty Service Inspection Requirement:
            </p>
            <p>
              Specialty services require an in-person diagnostic inspection before final pricing. We clean, dry, disinfect, and treat vehicle interiors. We do not repair mechanical or electrical damage caused by flooding.
            </p>
          </div>
        </div>
      </div>

      {/* Specialty Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {specialtyServicesList.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#111618] border border-white/10 hover:border-red-500/40 rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-2xl relative group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="bg-white/5 border border-white/10 text-white/80 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl font-heading font-semibold text-white mb-2 group-hover:text-red-300 transition-colors">
                    {item.title}
                  </h3>

                  <div className="text-xl font-bold text-gold font-heading mb-4">
                    {item.pricing}
                  </div>

                  <p className="text-white/70 text-sm leading-relaxed mb-6">
                    {item.description}
                  </p>

                  <div className="space-y-2 mb-6 pt-4 border-t border-white/5">
                    {item.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-white/80">
                        <CheckCircle2 className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <button
                    onClick={() => scrollToQuote(item.title)}
                    className="w-full bg-red-500/20 text-red-200 border border-red-500/30 hover:bg-red-600 hover:text-white font-bold py-3.5 rounded-full text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    <span>Request Assessment</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quote & Assessment Form Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-20" id="quote-section">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-gold/10 text-gold px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border border-gold/20">
            Fast Response Within 2–4 Business Hours
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-semibold text-white mb-3">
            Request an Assessment & Quote
          </h2>
          <p className="text-white/75 text-sm sm:text-base max-w-xl mx-auto">
            Provide your vehicle info and upload clear photos of affected areas so our remediation specialists can evaluate the damage.
          </p>
        </div>

        <QuoteForm initialService={selectedServiceForQuote} />
      </div>

      {/* Direct Phone Assistance Banner */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-[#111618] border border-white/10 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="text-left">
            <h4 className="text-xl font-heading font-semibold text-white mb-1">
              Need Urgent Flood or Biohazard Help?
            </h4>
            <p className="text-white/70 text-sm">
              Call our shop directly for expedited emergency drying and remediation instructions.
            </p>
          </div>
          <a
            href="tel:+13472278485"
            className="bg-gold text-charcoal font-bold px-8 py-3.5 rounded-full text-sm uppercase tracking-wider hover:bg-gold-hover transition-colors shadow-lg shrink-0 flex items-center gap-2"
          >
            <Phone className="w-4 h-4" />
            <span>(347) 227-8485</span>
          </a>
        </div>
      </div>
    </div>
  );
}
