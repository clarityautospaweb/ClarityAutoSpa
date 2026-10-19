"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, AlertCircle, Info, CheckCircle2 } from "lucide-react";
import ServiceCard from "@/components/cards/ServiceCard";
import ServiceQuiz from "@/components/features/ServiceQuiz";
import ServiceBookingModal from "@/components/features/ServiceBookingModal";

function VehicleTypeTabs({
  carTypes,
  groupedServices,
  isSpecialty,
  onSelectService,
}) {
  const [activeTab, setActiveTab] = useState(carTypes[0]);

  if (carTypes.length === 1) {
    return (
      <div className={`grid gap-6 xl:gap-8 ${isSpecialty ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
        {groupedServices[carTypes[0]].map((service) => (
          <ServiceCard
            key={service._id || service.id}
            service={service}
            onSelectService={onSelectService}
          />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8 bg-white/5 p-1.5 rounded-full inline-flex border border-white/10">
        {carTypes.map(type => (
          <button
            key={type}
            onClick={() => setActiveTab(type)}
            className={`px-6 py-2.5 rounded-full font-semibold text-[13px] sm:text-[14px] tracking-wide uppercase transition-all duration-300 ${
              activeTab === type 
                ? 'bg-gold text-charcoal font-bold shadow-[0_2px_12px_rgba(220,165,70,0.3)]' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={`grid gap-6 xl:gap-8 ${isSpecialty ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}
        >
          {groupedServices[activeTab].map((service) => (
            <ServiceCard
              key={service._id || service.id}
              service={service}
              onSelectService={onSelectService}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function ServicesContent({ services = [], categories = [] }) {
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [activeBookingService, setActiveBookingService] = useState(null);

  // Filter categories to only those that have enabled services
  const activeCategories = categories.filter((cat) => {
    if (!cat.enabled) return false;
    const catServices = services.filter(
      (s) =>
        s.enabled &&
        (s.categoryId === cat.slug ||
          (s.categoryId && s.categoryId.replace(/_/g, '-') === cat.slug) ||
          (s.category && s.category.toLowerCase().replace(/[^a-z0-9]/g, '') === cat.title.toLowerCase().replace(/[^a-z0-9]/g, '')) ||
          (s.category && cat.title.toLowerCase().includes(s.category.toLowerCase()))),
    );
    return catServices.length > 0;
  });

  return (
    <div className="pb-24">
      {/* Intro Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-12 md:pt-20 mb-12">
        <div className="inline-flex items-center gap-2 bg-gold/10 text-gold px-4 py-1.5 rounded-full tracking-[0.15em] uppercase mb-6 text-[12px] md:text-[14px] font-bold shadow-sm border border-gold/20">
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></span>
          Brooklyn’s #1 Detailing & Restoration
        </div>
        <h1 className="font-heading font-medium text-white capitalize text-[clamp(2.75rem,5.5vw,4.75rem)] leading-[1.05] tracking-[-0.02em]">
          Services & Pricing
        </h1>
        <p className="mt-5 text-base sm:text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-8 font-sans leading-relaxed">
          Explore our complete service menu. From routine hand washes to master paint correction, ceramic coatings, and specialty biohazard restoration.
        </p>

        {/* Clear Distinction Notice Banner */}
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-white/[0.07] via-white/[0.04] to-white/[0.07] border border-white/15 rounded-2xl p-5 mb-8 text-left shadow-xl backdrop-blur-md">
          <div className="flex items-start gap-3.5">
            <Info className="w-5 h-5 text-gold shrink-0 mt-0.5" />
            <div className="space-y-2 text-xs sm:text-sm text-white/80 leading-relaxed">
              <p>
                <strong className="text-white">Mini Detail vs. Full Detail:</strong> A <strong>Mini Detail</strong> is our exterior hand wash + basic interior maintenance cleaning (vacuuming, wipe-down, windows). A <strong>Full Detail</strong> is our comprehensive deep restorative treatment with hot carpet & upholstery shampooing, extensive stain removal, and exterior surface sealant.
              </p>
              <p className="text-white/60 text-[12px]">
                * Standard detailing prices listed exclude applicable sales tax. Specialty remediation services require an in-person assessment before final pricing.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button 
            onClick={() => setIsQuizModalOpen(true)}
            className="bg-white text-charcoal font-bold px-8 py-3.5 rounded-full hover:bg-gold transition-colors shadow-md text-[14px] uppercase tracking-wider"
          >
            Not sure what you need? Take the Quiz
          </button>
          <a
            href="https://Claritybk.as.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gold text-charcoal font-bold px-8 py-3.5 rounded-full hover:bg-gold-hover transition-colors shadow-[0_0_20px_rgba(220,165,70,0.25)] text-[14px] uppercase tracking-wider"
          >
            Direct Acuity Booking
          </a>
        </div>
      </div>

      {/* Sticky Jump Bar */}
      <div className="sticky top-20 md:top-24 z-30 flex justify-center px-4 sm:px-6 lg:px-8 mb-16 pointer-events-none">
        <div className="w-fit max-w-full pointer-events-auto flex items-center overflow-x-auto p-1.5 sm:p-2 hide-scrollbar gap-2 rounded-full backdrop-blur-xl bg-[#0b0e10]/95 border border-white/15 shadow-2xl">
          {activeCategories.map((cat) => (
            <button
              key={cat.slug}
              onPointerDown={(e) => {
                e.preventDefault();
                const el = document.getElementById(cat.slug);
                if (el) {
                  const y = el.getBoundingClientRect().top + window.scrollY - 140;
                  window.scrollTo({ top: y, behavior: "smooth" });
                }
              }}
              className="whitespace-nowrap px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[12.5px] font-semibold text-white/80 hover:text-white hover:bg-white/15 active:border-gold active:text-gold active:bg-gold/15 transition-all shadow-sm"
            >
              {cat.title.split("—")[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {/* Categories & Services */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {activeCategories.map((cat) => {
          const catServices = services
            .filter(
              (s) =>
                s.enabled &&
                (s.categoryId === cat.slug ||
                  (s.categoryId && s.categoryId.replace(/_/g, '-') === cat.slug) ||
                  (s.category && s.category.toLowerCase().replace(/[^a-z0-9]/g, '') === cat.title.toLowerCase().replace(/[^a-z0-9]/g, '')) ||
                  (s.category && cat.title.toLowerCase().includes(s.category.toLowerCase()))),
            )
            .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

          const isSpecialty = cat.slug === "specialty-restoration" || cat.requiresAssessment;

          // Group by carType
          const groupedServices = catServices.reduce((acc, service) => {
            const type = service.carType || "All Vehicles";
            if (!acc[type]) acc[type] = [];
            acc[type].push(service);
            return acc;
          }, {});

          const typeOrder = {
            Sedan: 1,
            SUV: 2,
            "XL SUV": 3,
            "All Vehicles": 4,
          };
          const sortedTypes = Object.keys(groupedServices).sort(
            (a, b) => (typeOrder[a] || 99) - (typeOrder[b] || 99),
          );

          return (
            <div
              key={cat.slug}
              id={cat.slug}
              className="scroll-mt-36 animate-fade-in-up"
            >
              {/* Category Header */}
              <div className="mb-10 text-center md:text-left">
                <div className="inline-flex items-center gap-2 text-gold text-xs font-bold uppercase tracking-widest mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                  Category {cat.order || ""}
                </div>
                <h2 className="font-heading font-medium text-white capitalize text-3xl sm:text-4xl md:text-[2.75rem] leading-tight mb-3">
                  {cat.title}
                </h2>
                {cat.description && (
                  <p className="text-white/75 text-base sm:text-lg leading-relaxed max-w-3xl">
                    {cat.description}
                  </p>
                )}

                {/* Category specific disclaimers */}
                {cat.slug === "mini-detail" && (
                  <div className="mt-4 bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl max-w-2xl text-xs sm:text-sm text-amber-200/90 leading-relaxed">
                    <strong>Note:</strong> Mini Detail is strictly routine upkeep (Hand Wash + Basic Interior Vacuum & Wipe Down). It does not include shampooing, heavy stain removal, embedded pet hair extraction, or odor treatment.
                  </div>
                )}

                {cat.slug === "specialty-restoration" && (
                  <div className="mt-4 bg-red-500/10 border border-red-500/30 p-4 rounded-2xl max-w-2xl text-xs sm:text-sm text-red-200/90 leading-relaxed">
                    <strong>Specialty Service Protocol:</strong> All specialty remediation services (mold, flood, rodent contamination, persistent odor) require an in-person diagnostic inspection before final quote and procedure schedule.
                  </div>
                )}
              </div>

              {/* Service Cards / Vehicle Type Tabs */}
              <div>
                <VehicleTypeTabs
                  carTypes={sortedTypes}
                  groupedServices={groupedServices}
                  isSpecialty={isSpecialty}
                  onSelectService={(svc) => setActiveBookingService(svc)}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Booking & Quote Modal */}
      <ServiceBookingModal
        isOpen={!!activeBookingService}
        onClose={() => setActiveBookingService(null)}
        service={activeBookingService}
        allServices={services}
        categories={categories}
      />

      {/* Quiz Modal */}
      {isQuizModalOpen && (
        <div data-lenis-prevent className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in overscroll-contain">
          <div data-lenis-prevent className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto overscroll-contain rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative">
            <button
              onClick={() => setIsQuizModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-charcoal transition-colors p-2 bg-gray-50 rounded-full hover:bg-gray-100 z-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <div className="pt-4">
              <ServiceQuiz
                services={services}
                categories={categories}
                onBookMiniDetail={(svc) => {
                  setIsQuizModalOpen(false);
                  setActiveBookingService(svc);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
