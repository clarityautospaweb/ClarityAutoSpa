"use client";

import { ArrowUpRight, Clock, Check, Sparkles } from "lucide-react";
import Image from "next/image";

export default function ServiceCard({ service, onSelectService }) {
  const getPriceLabel = () => {
    if (!service.price || service.price === "0" || service.price === "") {
      return "Quote";
    }
    const p = service.price.trim();
    if (p.toLowerCase().includes("quote")) return "Custom Quote";
    if (p.toLowerCase().includes("confirm")) return "Price TBA";
    if (service.pricingType === "starts_at") {
      return `From $${p.replace(/[^0-9.]/g, "")}`;
    }
    if (service.pricingType === "inspection") {
      return p.startsWith("$") ? p : (p.match(/\d/) ? `$${p}` : p);
    }
    return p.startsWith("$") ? p : `$${p}`;
  };

  const isMiniDetail = service.categoryId === "mini-detail" || service.name.toLowerCase().includes("mini detail");
  const isFullDetail = service.categoryId === "full-detail" || service.name.toLowerCase().includes("full detail");

  return (
    <div className="relative rounded-[2rem] overflow-hidden aspect-[3/4] md:aspect-[4/5] flex flex-col group shadow-xl border border-white/10 hover:border-gold/40 transition-all duration-500 bg-[#111618]">
      {/* Background Image */}
      <Image
        src={service.imageUrl || "/porche_front.jpeg"}
        alt={service.name}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover absolute inset-0 z-0 group-hover:scale-105 transition-transform duration-700"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e10] via-[#0b0e10]/80 to-black/30 z-10" />

      {/* Distinction Badge for Mini vs Full Detail */}
      {isMiniDetail && (
        <div className="absolute top-4 left-4 z-20">
          <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
            Wash & Basic Interior
          </span>
        </div>
      )}
      {isFullDetail && (
        <div className="absolute top-4 left-4 z-20">
          <span className="bg-gold/25 text-gold border border-gold/40 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm">
            Comprehensive Deep Detail
          </span>
        </div>
      )}

      {/* Content Container */}
      <div className="relative z-20 flex flex-col justify-end h-full p-6">
        
        {/* Title & Price Row */}
        <div className="flex items-start justify-between mb-2 gap-3">
          <h3 className="font-heading font-semibold text-[20px] md:text-2xl text-white leading-tight">
            {service.name}
          </h3>
          <div className="bg-black/60 backdrop-blur-md rounded-full px-3 py-1 shrink-0 border border-white/15">
            <span className="text-gold font-bold text-sm tabular-nums whitespace-nowrap">
              {getPriceLabel()}
            </span>
          </div>
        </div>

        {/* Description */}
        {service.description && (
          <p className="text-white/75 text-xs sm:text-sm leading-relaxed mb-3 line-clamp-2">
            {service.description}
          </p>
        )}

        {/* Included Items preview */}
        {service.includedItems && service.includedItems.length > 0 && (
          <div className="mb-4 space-y-1 hidden sm:block">
            {service.includedItems.slice(0, 2).map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-[11.5px] text-white/80">
                <Check className="w-3.5 h-3.5 text-gold shrink-0" />
                <span className="truncate">{item}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tags / Duration / Car Type */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {(service.vehicleSize || service.carType) && (
            <span className="bg-white/10 backdrop-blur-md text-white/90 px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide border border-white/5">
              {(service.vehicleSize || service.carType).replace("_", " ")}
            </span>
          )}
          {(service.turnaround || service.time) && (
            <span className="inline-flex items-center gap-1 bg-white/10 backdrop-blur-md text-white/90 px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide border border-white/5">
              <Clock className="w-3 h-3 text-gold" />
              {service.turnaround || service.time}
            </span>
          )}
          {service.isSpecialty && (
            <span className="bg-red-500/20 text-red-300 border border-red-500/30 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide">
              Inspection Required
            </span>
          )}
        </div>

        {/* CTA Button */}
        <button
          type="button"
          onClick={() => onSelectService(service)}
          className="w-full bg-white text-charcoal py-3 rounded-full font-bold text-[14px] uppercase tracking-wider text-center hover:bg-gold hover:text-charcoal transition-all shadow-md flex items-center justify-center gap-2 group/btn"
        >
          <span>{service.ctaType === "assessment" || service.ctaType === "quote" ? "Request Quote" : "Customize & Book"}</span>
          <ArrowUpRight className="w-4 h-4 transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}
