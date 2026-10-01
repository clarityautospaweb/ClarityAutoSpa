"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ServiceCard({ service, onBookMiniDetail }) {
  const getPriceLabel = () => {
    if (!service.price || service.price === "0" || service.price === "") {
      return "Quote";
    }
    switch (service.pricingType) {
      case "starts_at":
        return `From $${service.price}`;
      case "inspection":
      case "fixed":
      default:
        return `$${service.price}`;
    }
  };

  const handlePrimaryClick = (e) => {
    if (service.categoryId === "mini-detail") {
      e.preventDefault();
      onBookMiniDetail(service);
    }
  };

  return (
    <div className="relative rounded-[2rem] overflow-hidden aspect-[3/4] md:aspect-[4/5] flex flex-col group shadow-lg border border-white/10">
      {/* Background Image */}
      <Image
        src={service.imageUrl || "/img-6.jpg"}
        alt={service.name}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover absolute inset-0 z-0 group-hover:scale-105 transition-transform duration-700"
      />

      {/* Gradient Overlay (Smooth and dark) */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#111618] via-[#111618]/80 to-transparent z-10" />

      {/* Content Container */}
      <div className="relative z-20 flex flex-col justify-end h-full p-6">
        
        {/* Decorative Dots */}
        <div className="flex justify-center gap-1.5 mb-5 opacity-70">
          <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
        </div>

        {/* Title & Price Row */}
        <div className="flex items-start justify-between mb-2 gap-4">
          <h3 className="font-heading font-semibold text-[22px] md:text-2xl text-white leading-tight">
            {service.name}
          </h3>
          <div className="bg-black/40 backdrop-blur-md rounded-full px-3 py-1 shrink-0 border border-white/5">
            <span className="text-white font-medium text-sm tabular-nums whitespace-nowrap">
              {getPriceLabel()}
            </span>
          </div>
        </div>

        {/* Description */}
        {service.description && (
          <p className="text-white/70 text-sm leading-relaxed mb-4 line-clamp-3">
            {service.description}
          </p>
        )}

        {/* Tags / Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(service.vehicleSize || service.carType) && (
            <span className="bg-white/10 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[11px] font-medium tracking-wide">
              {(service.vehicleSize || service.carType).replace("_", " ")}
            </span>
          )}
          {(service.turnaround || service.time) && (
            <span className="bg-white/10 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[11px] font-medium tracking-wide">
              {service.turnaround || service.time}
            </span>
          )}
          {service.categoryId === "specialty" && service.requiresAssessment && (
            <span className="bg-white/10 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[11px] font-medium tracking-wide">
              Assessment
            </span>
          )}
        </div>

        {/* CTA Button */}
        {service.acuityLink ? (
          <a
            href={service.acuityLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handlePrimaryClick}
            className="w-full bg-white text-charcoal py-3 rounded-full font-semibold text-[15px] text-center hover:bg-cream transition-colors"
          >
            Book Now
          </a>
        ) : (
          <Link
            href={`/getquote?service=${encodeURIComponent(service.name)}`}
            className="w-full bg-white text-charcoal py-3 rounded-full font-semibold text-[15px] text-center hover:bg-cream transition-colors block"
          >
            Get Quote
          </Link>
        )}
      </div>
    </div>
  );
}
