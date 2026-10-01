"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LayoutGroup, motion } from "motion/react";
import Image from "next/image";
import { TextRotate } from "@/components/animations/TextRotate";
import { AnimatedMarqueeHero } from "@/components/ui/hero-3";

const exampleImages = [
  {
    url: "/hero/car.jpg",
    title: "Luxury car detailing",
  },
  {
    url: "/hero/wash.jpg",
    title: "Exterior detailing",
  },
  {
    url: "/hero/paint.jpg",
    title: "Paint correction",
  },
  {
    url: "/hero/interior.jpg",
    title: "Interior detailing",
  },
  {
    url: "/hero/car1.jpg",
    title: "Premium finish",
  },
];

export function LandingHero({ settings }) {
  const rating = settings?.rating || 4.6;
  const reviewsCount = settings?.reviewCount || 133;
  const googleUrl = settings?.googleReviewsUrl || "#";

  const [heroImages, setHeroImages] = useState(exampleImages);

  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery`);
        if (res.ok) {
          const data = await res.json();
          const landingImages = data
            .filter((img) => img.showOnLandingPage)
            .map((img) => ({
              url: img.imageUrl || img.afterImageUrl,
              title: img.title || "Clarity Auto Spa",
            }))
            .filter((img) => img.url);

          if (landingImages.length > 0) {
            const finalImages = [...exampleImages];
            for (let i = 0; i < Math.min(landingImages.length, 5); i++) {
              finalImages[i] = landingImages[i];
            }
            setHeroImages(finalImages);
          }
        }
      } catch (error) {
        console.error("Failed to fetch landing hero images:", error);
      }
    }
    fetchImages();
  }, []);

  const items = [
    {
      image: "https://picsum.photos/id/1015/600/400",
      title: "Peaks",
      href: "https://example.com/one",
    },
    {
      image: "https://picsum.photos/id/1025/600/400",
      title: "Pup",
      href: "https://example.com/two",
    },
    {
      image: "https://picsum.photos/id/1039/600/400",
      title: "Falls",
      href: "https://example.com/three",
    },
  ];

  return (
    <AnimatedMarqueeHero
      className="bg-[#111618] text-white pt-32 pb-20"
      tagline={
        <a href={googleUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-white hover:text-gold transition-colors">
          <div className="flex items-center text-gold">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="font-semibold tracking-wide text-sm">{rating} Google Rating</span>
        </a>
      }
      title={
        <>
          Brooklyn’s #1 and Most Trusted
          <br />
          <span className="text-gold">Auto Detailing Shop.</span>
          <br />
          <span className="text-[0.4em] tracking-wider text-white/80 font-medium block mt-6 uppercase">
            Located in the heart of Brooklyn , Park Slope.
          </span>
          <span className="text-[0.35em] inline-block px-5 py-2 mt-5 rounded-full border-[1.5px] border-gold bg-gold/10 text-gold tracking-widest font-bold uppercase shadow-sm">
            Mold & Mildew Restoration Experts
          </span>
        </>
      }
      description="Welcome to Clarity Auto Spa! We are a dedicated team of detailing professionals. We combine expert care, meticulous attention to detail, and a passion for perfection to deliver an unmatched auto spa experience."
      images={heroImages.map((i) => i.url)}
    >
      <div className="flex flex-col md:flex-row items-center justify-center gap-5 mt-10">
        <div className="flex flex-col sm:flex-row items-center gap-4 border border-white/20 p-2 pr-2 pl-6 rounded-full bg-white/5 backdrop-blur-md">
           <span className="text-lg font-bold tracking-[0.1em] text-white">
             (347) 227-8485
           </span>
           <Link href="tel:+13472278485" className="px-8 py-3.5 rounded-full bg-white text-charcoal font-bold tracking-[0.15em] uppercase shadow-lg transition-colors hover:bg-gray-200">
             Call Now
           </Link>
        </div>
        <Link href="/services" className="px-10 py-4 rounded-full bg-gold text-charcoal border-[1.5px] border-gold font-bold tracking-[0.15em] uppercase transition-colors hover:bg-gold-hover shadow-[0_0_20px_rgba(220,165,70,0.3)]">
          Book Now
        </Link>
      </div>
    </AnimatedMarqueeHero>
  );
}
