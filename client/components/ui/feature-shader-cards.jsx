"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function FeatureShaderCards({ features = [] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8 mb-16">
      {features.map((feature, index) => {
        return (
          <div key={index} className="relative h-[420px] sm:h-[480px] group rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
            {/* Full Background Image */}
            <div className="absolute inset-0">
              <Image
                src={feature.imageUrl}
                alt={feature.title}
                fill
                className="object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              {/* Dark Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
            </div>

            {/* Inner Content Layer */}
            <div className="relative z-10 p-6 sm:p-8 h-full flex flex-col">
              
              {/* Floating Badge (Top Left) */}
              <div className="w-12 h-12 bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center text-cream font-bold text-[16px] shadow-sm mb-auto">
                0{index + 1}
              </div>

              {/* Text Content at the Bottom */}
              <div className="mt-auto transform transition-transform duration-500">
                <h3 className="text-[24px] md:text-[28px] font-heading font-semibold mb-3 text-white leading-tight">
                  {feature.title}
                </h3>

                <p className="leading-relaxed text-white/80 font-sans text-[15px] sm:text-[16px] line-clamp-2 sm:line-clamp-3 mb-5">
                  {feature.description}
                </p>

                <Link
                  href={`/services#${feature.slug}`}
                  className="inline-flex items-center font-semibold text-gold hover:text-white transition-colors text-[16px] group/link"
                >
                  <span className="mr-2">View Packages</span>
                  <ArrowUpRight className="w-5 h-5 transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
