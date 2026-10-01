import { LandingHero } from "@/components/sections/LandingHero";
import GallerySection from "@/components/sections/GallerySection";
import WhyUsSection from "@/components/sections/WhyUsSection";
import ReviewsSection from "@/components/sections/ReviewsSection";
import LocationSection from "@/components/sections/LocationSection";
import CTABanner from "@/components/layout/CTABanner";
import CurvedLoop from "@/components/animations/CurvedLoop";
import ServicesSection from "@/components/sections/ServicesSection";
import AboutUsSection from "@/components/sections/AboutUsSection";

export default async function Home() {
  let services = [];
  let settings = null;
  try {
    const [servicesRes, settingsRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`, {
        cache: "no-store",
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings`, {
        cache: "no-store",
      }),
    ]);
    if (servicesRes.ok) services = await servicesRes.json();
    if (settingsRes.ok) settings = await settingsRes.json();
  } catch (error) {
    console.error("Failed to fetch data for homepage:", error);
  }

  return (
    <>
      <LandingHero settings={settings} />
      <ServicesSection />
      <ReviewsSection />
      {/* <AboutUsSection /> */}
      <CurvedLoop
        marqueeText="PREMIUM ✦ AUTO ✦ DETAILING ✦ UNMATCHED ✦ CLARITY ✦ "
        speed={2}
        curveAmount={0}
        direction="right"
      />
      <div className="bg-[#1a2124] py-4 border-y border-white/10 text-center">
        <a
          href="/services#quiz"
          className="text-gold font-bold hover:text-white transition-colors flex items-center justify-center gap-2"
        >
          Not sure what your vehicle needs? Take the 30-second quiz
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </a>
      </div>
      <GallerySection />
      <WhyUsSection />
      <LocationSection />
      <CTABanner />
    </>
  );
}
