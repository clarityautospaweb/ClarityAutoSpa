import Image from "next/image";
import LocationSection from "@/components/sections/LocationSection";
import CTABanner from "@/components/layout/CTABanner";
import QuoteForm from "@/components/features/QuoteForm";

export const metadata = {
  title: "Location & Contact | Clarity Auto Spa",
  description: "Visit Clarity Auto Spa in the heart of Park Slope, Brooklyn or request a quote online.",
};

export default function LocationPage() {
  return (
    <div className="relative pt-24 bg-[#0b0e10] min-h-screen flex flex-col overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <Image
          src="/porche_back.jpeg"
          alt="Clarity Auto Spa Location"
          fill
          priority
          sizes="100vw"
          quality={90}
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-[#0b0e10]" />
      </div>
      <div className="relative z-10 flex-grow">
        <LocationSection />
        <section className="bg-transparent py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <QuoteForm />
          </div>
        </section>
      </div>
      <CTABanner />
    </div>
  );
}
