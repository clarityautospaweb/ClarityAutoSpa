"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Reusable Button component styled like in the image
export const ActionButton = ({ children, className }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={cn(
      "mt-8 px-8 py-3 rounded-full bg-red-500 text-white font-semibold shadow-lg transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75",
      className
    )}
  >
    {children}
  </motion.button>
);

// The main hero component
export const AnimatedMarqueeHero = ({
  tagline,
  title,
  description,
  ctaText,
  images = [],
  className,
  children
}) => {
  // Animation variants for the text content
  const FADE_IN_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
  };

  // Duplicate images for a seamless loop
  const imageList = Array.isArray(images) ? images : [];
  const duplicatedImages = imageList.length > 0
    ? [...imageList, ...imageList, ...imageList]
    : [];

  return (
    <section
      className={cn(
        "relative w-full min-h-screen overflow-hidden bg-[#0b0e10] flex flex-col justify-between items-center text-center px-4",
        className
      )}
    >
      {/* ─── FULL-BLEED VISIBLE PORSCHE FRONT BACKGROUND ─── */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        <Image
          src="/porche_front.jpeg"
          alt="Clarity Auto Spa - Porsche GT3 RS Front"
          fill
          priority
          sizes="100vw"
          quality={90}
          className="object-cover object-center"
        />
        {/* Subtle cinematic scrim: keeps car completely visible while providing readability */}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-[#0b0e10]" />
      </div>

      {/* ─── CENTER CONTENT AREA (NEVER OVERLAPS CARDS) ─── */}
      <div className="relative z-10 flex flex-col items-center max-w-5xl mx-auto my-auto pt-28 sm:pt-32 md:pt-36 pb-4">
        {/* Tagline */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={FADE_IN_ANIMATION_VARIANTS}
          className="mb-4 inline-block rounded-full border border-white/20 bg-black/40 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md shadow-md"
        >
          {tagline}
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]"
        >
          {typeof title === 'string' ? (
            title.split(" ").map((word, i) => (
              <motion.span
                key={i}
                variants={FADE_IN_ANIMATION_VARIANTS}
                className="inline-block"
              >
                {word}&nbsp;
              </motion.span>
            ))
          ) : (
            title
          )}
        </motion.h1>

        {/* Description */}
        {description && (
          <motion.div
            initial="hidden"
            animate="show"
            variants={FADE_IN_ANIMATION_VARIANTS}
            transition={{ delay: 0.5 }}
            className="mt-5 max-w-2xl text-base sm:text-lg text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] leading-relaxed font-medium"
          >
            {description}
          </motion.div>
        )}

        {/* Call to Action Button */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={FADE_IN_ANIMATION_VARIANTS}
          transition={{ delay: 0.6 }}
          className="mt-6 sm:mt-8"
        >
          {ctaText && <ActionButton>{ctaText}</ActionButton>}
          {children}
        </motion.div>
      </div>

      {/* ─── SHOWCASE CARDS (POSITIONED NATURALLY BELOW BUTTONS) ─── */}
      {duplicatedImages.length > 0 && (
        <div className="relative z-10 w-full mt-6 md:mt-8 pb-6 md:pb-8 pointer-events-none flex flex-col justify-end overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-black/20 to-transparent z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[#0b0e10] to-transparent z-10 pointer-events-none" />

          <motion.div
            className="flex gap-4 w-max items-end"
            style={{ willChange: "transform" }}
            animate={{
              x: ["0%", "-33.333%"],
              transition: {
                ease: "linear",
                duration: 35,
                repeat: Infinity,
              },
            }}
          >
            {duplicatedImages.map((src, index) => (
              <div
                key={index}
                className="relative aspect-[4/3] h-36 sm:h-44 md:h-52 flex-shrink-0"
                style={{
                  rotate: `${(index % 2 === 0 ? -1 : 1.5)}deg`,
                }}
              >
                <img
                  src={src}
                  alt={`Showcase image ${index + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover rounded-2xl shadow-2xl border border-white/20 pointer-events-none"
                />
              </div>
            ))}
          </motion.div>
        </div>
      )}
    </section>
  );
};
