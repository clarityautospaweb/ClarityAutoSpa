import Image from "next/image";
import AboutUsSection from "@/components/sections/AboutUsSection";
import WhyUsSection from "@/components/sections/WhyUsSection";
import CTABanner from "@/components/layout/CTABanner";

export const metadata = {
  title: "About Us | Clarity Auto Spa, Brooklyn NY",
  description: "Learn about Brooklyn's #1 trusted auto spa. Dedicated professionals combining meticulous detailing craftsmanship with eco-friendly practices.",
};

export default function AboutPage() {
  return (
    <div className="relative pt-24 min-h-screen bg-[#0b0e10]">
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-12 md:pt-20 mb-8">
          <div className="inline-flex items-center gap-2 bg-gold/10 text-gold px-4 py-1.5 rounded-full tracking-[0.15em] uppercase mb-5 text-[12px] font-bold border border-gold/20">
            <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
            Our Story & Craftsmanship
          </div>
          <h1 className="font-heading font-medium text-white capitalize text-[clamp(2.75rem,5.5vw,4.75rem)] leading-[1.05] tracking-[-0.02em] mb-6">
            About Clarity Auto Spa
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg leading-relaxed font-sans">
            Located in the heart of Park Slope, Brooklyn. We treat every vehicle like a bespoke work of art, delivering uncompromising clarity, protection, and shine.
          </p>
        </div>

        <WhyUsSection />
        <CTABanner />
      </div>
    </div>
  );
}
