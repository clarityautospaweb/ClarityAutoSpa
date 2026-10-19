"use client";

import { useState } from "react";
import { Check, Clock, Sparkles, Shield, ArrowUpRight, Info } from "lucide-react";
import { optionalAddons } from "@/config/addons";
import ServiceBookingModal from "@/components/features/ServiceBookingModal";

export default function PricingContent({ services = [], categories = [] }) {
  const [selectedVehicle, setSelectedVehicle] = useState("Sedan");
  const [activeCategorySlug, setActiveCategorySlug] = useState("all");
  const [activeBookingService, setActiveBookingService] = useState(null);

  const vehicleSizes = ["Sedan", "SUV", "XL SUV"];

  // Filter services based on vehicle and category
  const filteredServices = services.filter((s) => {
    if (!s.enabled) return false;
    
    // Category filter
    if (activeCategorySlug !== "all" && s.categoryId !== activeCategorySlug) {
      return false;
    }

    // Vehicle size filter
    if (s.carType && s.carType !== "All Vehicles") {
      return s.carType === selectedVehicle;
    }
    return true;
  });

  const formatPrice = (service) => {
    const p = service.price || "";
    if (p.toLowerCase().includes("quote")) return "Custom Quote";
    if (p.toLowerCase().includes("confirm")) return "Price TBA";
    if (service.pricingType === "starts_at") return `Starting $${p.replace(/[^0-9.]/g, "")}`;
    if (service.pricingType === "inspection") return p.startsWith("$") ? p : (p.match(/\d/) ? `$${p}` : p);
    return p.startsWith("$") ? p : `$${p}`;
  };

  return (
    <div className="pb-24">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-12 md:pt-20 mb-12">
        <div className="inline-flex items-center gap-2 bg-gold/10 text-gold px-4 py-1.5 rounded-full tracking-[0.15em] uppercase mb-6 text-[12px] md:text-[14px] font-bold shadow-sm border border-gold/20">
          <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
          Transparent Brooklyn Detailing Rates
        </div>
        <h1 className="font-heading font-medium text-white capitalize text-[clamp(2.75rem,5.5vw,4.75rem)] leading-[1.05] tracking-[-0.02em]">
          Pricing & Package Comparison
        </h1>
        <p className="mt-5 text-base sm:text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-8 font-sans leading-relaxed">
          Select your vehicle type below to view exact pricing, estimated service durations, and optional detailing add-ons.
        </p>

        {/* Pricing notice alert */}
        <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-4 mb-8 text-left text-xs sm:text-sm text-white/75 flex items-start gap-3">
          <Info className="w-5 h-5 text-gold shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p>
              <strong>Pricing Notice:</strong> Standard detailing prices exclude applicable New York sales tax. Listed rates are synchronized with our official Acuity booking portal.
            </p>
            <p className="text-white/50 text-[11px]">
              Specialty remediation (mold, flood, rodent, persistent odor) requires an initial assessment before final pricing.
            </p>
          </div>
        </div>

        {/* Vehicle Size Selector */}
        <div className="inline-flex p-1.5 bg-white/5 border border-white/10 rounded-full shadow-2xl mb-10">
          {vehicleSizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedVehicle(size)}
              className={`px-8 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                selectedVehicle === size
                  ? "bg-gold text-charcoal shadow-lg"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              {size}
            </button>
          ))}
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center justify-center flex-wrap gap-2 max-w-4xl mx-auto mb-14">
          <button
            onClick={() => setActiveCategorySlug("all")}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border ${
              activeCategorySlug === "all"
                ? "bg-white text-charcoal border-white"
                : "bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            All Packages
          </button>
          {categories.filter(c => c.enabled).map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategorySlug(cat.slug)}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border ${
                activeCategorySlug === cat.slug
                  ? "bg-white text-charcoal border-white"
                  : "bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              {cat.title.split("—")[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Comparison Spotlight: Mini Detail vs Full Detail */}
        {(activeCategorySlug === "all" || activeCategorySlug === "mini-detail" || activeCategorySlug === "full-detail") && (
          <div className="mb-16">
            <h2 className="text-2xl font-heading font-semibold text-white mb-6 text-center">
              Core Detailing Comparison ({selectedVehicle})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Mini Detail Card */}
              <div className="bg-[#111618] border border-amber-400/30 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl">
                <div>
                  <div className="inline-block bg-amber-400/10 text-amber-300 border border-amber-400/30 text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full mb-4">
                    Exterior Hand Wash + Interior Wipe
                  </div>
                  <h3 className="text-2xl font-heading font-semibold text-white mb-2">
                    Mini Detail
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed mb-6">
                    Routine upkeep package. Hand wash, wheel cleaning, tire shine, interior vacuuming, windows, and light interior cleaning.
                  </p>
                  
                  <div className="text-3xl font-bold text-amber-400 font-heading mb-6">
                    {selectedVehicle === "Sedan" ? "$114.99" : selectedVehicle === "SUV" ? "$124.99" : "$134.99"}
                    <span className="text-xs text-white/50 font-sans font-normal ml-2">
                      | {selectedVehicle === "Sedan" ? "1 hr 25 min" : selectedVehicle === "SUV" ? "1 hr 40 min" : "1 hr 55 min"}
                    </span>
                  </div>

                  <ul className="space-y-2 text-xs sm:text-sm text-white/80 mb-6">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Full exterior hand wash & microfiber dry</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Wheel face cleaning & high-gloss tire shine</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Cabin and trunk vacuuming</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Interior & exterior streak-free glass</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="text-[11px] text-white/40 mb-3 italic">
                    *Does not include shampooing, stain removal, pet hair removal, or odor treatment.
                  </div>
                  <button
                    onClick={() => {
                      const svc = services.find(s => s.categoryId === "mini-detail" && s.carType === selectedVehicle) ||
                                  services.find(s => s.categoryId === "mini-detail");
                      setActiveBookingService(svc);
                    }}
                    className="w-full bg-white/10 hover:bg-gold hover:text-charcoal text-white font-bold py-3.5 rounded-full text-xs uppercase tracking-wider transition-all"
                  >
                    Select Mini Detail
                  </button>
                </div>
              </div>

              {/* Full Detail Card */}
              <div className="bg-[#111618] border-2 border-gold rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative">
                <div className="absolute -top-3.5 right-6 bg-gold text-charcoal font-bold text-[10px] uppercase tracking-widest px-4 py-1 rounded-full shadow-md">
                  Recommended
                </div>
                <div>
                  <div className="inline-block bg-gold/15 text-gold border border-gold/30 text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full mb-4">
                    Comprehensive Detailing
                  </div>
                  <h3 className="text-2xl font-heading font-semibold text-white mb-2">
                    Full Detail
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed mb-6">
                    Comprehensive detailing including deep interior cleaning, carpet and upholstery treatment, exterior washing, wheels, and protective finishing.
                  </p>
                  
                  <div className="text-3xl font-bold text-gold font-heading mb-6">
                    {selectedVehicle === "Sedan" ? "$349" : selectedVehicle === "SUV" ? "$425" : "$475"}
                    <span className="text-xs text-white/50 font-sans font-normal ml-2">
                      | {selectedVehicle === "Sedan" ? "2 hr 45 min" : selectedVehicle === "SUV" ? "3 hr" : "3 hr 15 min"}
                    </span>
                  </div>

                  <ul className="space-y-2 text-xs sm:text-sm text-white/80 mb-6">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-gold shrink-0" />
                      <span>Deep carpet & upholstery shampooing & extraction</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-gold shrink-0" />
                      <span>Targeted spot & stain treatment</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-gold shrink-0" />
                      <span>Full exterior hand wash & protective sealant finish</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-gold shrink-0" />
                      <span>Deep wheel barrels & tire conditioning</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-gold shrink-0" />
                      <span>Door jambs, trunk seals, and crevice detailing</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="text-[11px] text-gold/80 mb-3 font-medium">
                    ★ The ultimate reset for your vehicle inside and out.
                  </div>
                  <button
                    onClick={() => {
                      const svc = services.find(s => s.categoryId === "full-detail" && s.carType === selectedVehicle) ||
                                  services.find(s => s.categoryId === "full-detail");
                      setActiveBookingService(svc);
                    }}
                    className="w-full bg-gold text-charcoal font-bold py-3.5 rounded-full text-xs uppercase tracking-wider hover:bg-gold-hover transition-colors shadow-lg"
                  >
                    Select Full Detail
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Filtered Services Table / Cards */}
        <div className="mb-20">
          <h2 className="text-2xl font-heading font-semibold text-white mb-6">
            All Available Services for {selectedVehicle}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service._id || service.id}
                className="bg-[#111618] border border-white/10 hover:border-gold/40 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold text-gold uppercase tracking-wider">
                      {service.category.split("—")[0].trim()}
                    </span>
                    <span className="text-xs text-white/50 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gold" />
                      {service.turnaround || service.time || "Duration on request"}
                    </span>
                  </div>

                  <h3 className="text-xl font-heading font-semibold text-white mb-2">
                    {service.name}
                  </h3>
                  
                  <p className="text-white/70 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3">
                    {service.description}
                  </p>

                  <div className="text-2xl font-bold text-white font-heading mb-4">
                    {formatPrice(service)}
                  </div>

                  {service.includedItems && service.includedItems.length > 0 && (
                    <div className="space-y-1.5 mb-6 bg-white/[0.02] border border-white/5 rounded-xl p-3">
                      {service.includedItems.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-xs text-white/80">
                          <Check className="w-3.5 h-3.5 text-gold shrink-0" />
                          <span className="truncate">{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setActiveBookingService(service)}
                  className="w-full bg-white text-charcoal hover:bg-gold font-bold py-3 rounded-full text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                >
                  <span>{service.ctaType === "assessment" || service.ctaType === "quote" ? "Request Quote" : "Customize & Book"}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ─── OPTIONAL ADD-ONS CATALOG ─── */}
        <div className="bg-[#111618] border border-white/10 rounded-3xl p-8 sm:p-12 mb-20 shadow-2xl">
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-2 bg-gold/10 text-gold px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border border-gold/20">
              <Sparkles className="w-3.5 h-3.5" />
              Upgrade Your Detailing Package
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-semibold text-white mb-3">
              Optional Add-Ons
            </h2>
            <p className="text-white/75 text-sm sm:text-base leading-relaxed">
              Add any of the following specialized enhancements to eligible detailing services. Prices are confirmed upon vehicle inspection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {optionalAddons.map((addon) => (
              <div
                key={addon.id}
                className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-gold/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h4 className="font-heading font-semibold text-lg text-white">
                    {addon.name}
                  </h4>
                  <span className="text-[11px] text-gold font-medium bg-gold/10 px-2 py-0.5 rounded-full border border-gold/20 shrink-0">
                    Add-on
                  </span>
                </div>
                <p className="text-white/70 text-xs sm:text-sm leading-relaxed mb-3">
                  {addon.description}
                </p>
                <div className="text-[11px] text-white/40 italic">
                  {addon.pricingNote}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Acuity Direct CTA */}
        <div className="text-center bg-gradient-to-r from-gold/10 via-gold/20 to-gold/10 border border-gold/30 rounded-3xl p-8 sm:p-12">
          <h3 className="text-2xl sm:text-3xl font-heading font-semibold text-white mb-3">
            Ready to Restore Your Vehicle?
          </h3>
          <p className="text-white/80 max-w-xl mx-auto mb-6 text-sm sm:text-base">
            Appointments can be scheduled directly online through our Acuity portal, or contact us for a customized estimate.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://Claritybk.as.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gold text-charcoal font-bold px-10 py-4 rounded-full text-sm uppercase tracking-wider hover:bg-gold-hover transition-colors shadow-xl inline-flex items-center gap-2"
            >
              <span>Book Online (Acuity)</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <a
              href="tel:+13472278485"
              className="bg-white/10 hover:bg-white hover:text-charcoal text-white font-bold px-8 py-4 rounded-full text-sm uppercase tracking-wider transition-all"
            >
              Call (347) 227-8485
            </a>
          </div>
        </div>

      </div>

      {/* Service Booking Modal */}
      <ServiceBookingModal
        isOpen={!!activeBookingService}
        onClose={() => setActiveBookingService(null)}
        service={activeBookingService}
        allServices={services}
        categories={categories}
      />
    </div>
  );
}
