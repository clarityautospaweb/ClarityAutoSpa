"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import ServiceCard from "@/components/cards/ServiceCard";
import ServiceQuiz from "@/components/features/ServiceQuiz";

function VehicleTypeTabs({
  carTypes,
  groupedServices,
  isSpecialty,
  onBookMiniDetail,
}) {
  const [activeTab, setActiveTab] = useState(carTypes[0]);

  if (carTypes.length === 1) {
    return (
      <div className={`grid gap-6 xl:gap-8 ${isSpecialty ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
        {groupedServices[carTypes[0]].map((service) => (
          <ServiceCard
            key={service._id || service.id}
            service={service}
            onBookMiniDetail={onBookMiniDetail}
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
            className={`px-6 py-2.5 rounded-full font-semibold text-[14px] tracking-wide uppercase transition-all duration-300 ${activeTab === type ? 'bg-white text-black shadow-[0_2px_10px_rgba(0,0,0,0.3)]' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
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
              onBookMiniDetail={onBookMiniDetail}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function ServicesContent({ services, categories }) {
  const [miniDetailModal, setMiniDetailModal] = useState({
    isOpen: false,
    service: null,
  });
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [ackChecked, setAckChecked] = useState(false);

  const handleBookMiniDetail = (service) => {
    setAckChecked(false);
    setMiniDetailModal({ isOpen: true, service });
  };

  const handleContinueBooking = () => {
    if (!ackChecked || !miniDetailModal.service) return;
    const url = miniDetailModal.service.acuityLink || "https://claritybk.as.me";
    window.open(url, "_blank");
    setMiniDetailModal({ isOpen: false, service: null });
  };

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

  console.log("ServicesContent SSR Log: ", {
    totalServices: services.length,
    totalCategories: categories.length,
    activeCategories: activeCategories.map((c) => c.slug),
    servicesPreview: services
      .slice(0, 2)
      .map((s) => ({
        name: s.name,
        categoryId: s.categoryId,
        category: s.category,
      })),
  });

  return (
    <div className="pb-24">
      {/* Intro */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-12 md:pt-20 mb-12">
        <div className="inline-flex items-center gap-2 bg-gold/10 text-gold px-4 py-1.5 rounded-full tracking-[0.15em] uppercase mb-6 text-[12px] md:text-[14px] font-bold shadow-sm border border-gold/20">
          <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
          Our Offerings
        </div>
        <h1 className="font-heading font-medium text-white capitalize text-[clamp(3rem,6vw,5rem)] leading-[1.05] tracking-[-0.02em]">
          Services & Pricing
        </h1>
        <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8">
          Premium detailing packages tailored to your vehicle's specific needs. Explore our extensive range of services below.
        </p>
        <button 
          onClick={() => setIsQuizModalOpen(true)}
          className="bg-white text-black font-medium px-8 py-3.5 rounded-full hover:bg-gold transition-colors shadow-sm text-[15px]"
        >
          Not sure what you need? Take the Quiz
        </button>
      </div>

      {/* Jump Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-wrap overflow-x-auto pb-4 hide-scrollbar gap-3 md:justify-center md:sticky md:top-24 z-30 bg-[#111618]/90 backdrop-blur-md pt-2">
          {activeCategories.map((cat) => (
            <button
              key={cat.slug}
              onPointerDown={(e) => {
                e.preventDefault();
                const el = document.getElementById(cat.slug);
                if (el) {
                  const y =
                    el.getBoundingClientRect().top + window.scrollY - 150;
                  window.scrollTo({ top: y, behavior: "smooth" });
                }
              }}
              className="whitespace-nowrap px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[13px] font-semibold text-white/80 hover:text-white hover:bg-white/10 active:border-gold active:text-gold active:bg-gold/10 transition-colors shadow-sm"
            >
              {cat.title}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
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
          const isSpecialty = cat.slug === "specialty";

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
              className="scroll-mt-32 animate-fade-in-up"
            >
              <div className="mb-10 text-center md:text-left">
                <h2 className="font-medium text-white capitalize text-4xl md:text-[3rem] leading-tight font-heading mb-4">
                  {cat.title}
                </h2>
                {cat.description && (
                  <p className="text-white/80 text-lg leading-relaxed max-w-3xl">
                    {cat.description}
                  </p>
                )}
                {cat.slug === "mini-detail" && (
                  <p className="text-white/80 text-sm mt-4 bg-white/5 p-4 rounded-xl border border-white/10 max-w-2xl">
                    Mini Detail covers light maintenance cleaning. It does not
                    include shampooing, stain treatment, embedded pet-hair
                    removal or odor treatment.
                  </p>
                )}
              </div>

              <div>
                <VehicleTypeTabs
                  carTypes={sortedTypes}
                  groupedServices={groupedServices}
                  isSpecialty={isSpecialty}
                  onBookMiniDetail={handleBookMiniDetail}
                />
              </div>

              {cat.slug === "specialty" &&
                catServices.some(
                  (s) => s.name.includes("Water") || s.name.includes("Mold"),
                ) && (
                  <div className="mt-8 bg-white/5 p-4 rounded-xl border border-white/10 text-sm text-white/80 italic">
                    We clean, dry and treat vehicle interiors. We do not repair
                    mechanical or electrical damage caused by flooding.
                  </div>
                )}
            </div>
          );
        })}
      </div>

      {/* Quiz Modal */}
      {isQuizModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2rem] p-6 md:p-10 shadow-2xl relative">
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
                onBookMiniDetail={handleBookMiniDetail}
              />
            </div>
          </div>
        </div>
      )}

      {/* Mini Detail Acknowledgement Modal */}
      {miniDetailModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-charcoal/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-[2rem] p-6 shadow-2xl relative animate-slide-up">
            <button
              onClick={() =>
                setMiniDetailModal({ isOpen: false, service: null })
              }
              className="absolute top-4 right-4 text-gray-400 hover:text-charcoal transition-colors p-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>

            <h3 className="font-heading font-semibold text-2xl text-charcoal mb-4 pr-8">
              Booking a Mini Detail
            </h3>

            <div className="bg-cream-alt rounded-xl p-4 mb-6">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center mt-1">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={ackChecked}
                    onChange={(e) => setAckChecked(e.target.checked)}
                  />
                  <div
                    className={`w-5 h-5 border-2 rounded transition-colors flex items-center justify-center ${ackChecked ? "bg-gold border-gold" : "border-gray-300 group-hover:border-gold"}`}
                  >
                    {ackChecked && (
                      <svg
                        className="w-3.5 h-3.5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-charcoal leading-[1.65]">
                  I understand that a Mini Detail covers light maintenance
                  cleaning. It does not include shampooing, stain treatment,
                  embedded pet-hair removal or odor treatment. If my vehicle
                  requires deeper cleaning, Clarity Auto SPA will discuss any
                  service and price changes with me before work begins.
                </span>
              </label>
            </div>

            <button
              disabled={!ackChecked}
              onClick={handleContinueBooking}
              className="w-full bg-gold text-charcoal font-semibold py-3.5 rounded-full hover:bg-gold-hover disabled:opacity-50 disabled:hover:bg-gold transition-colors"
            >
              Continue to booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
