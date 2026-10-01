import LocationSection from "@/components/sections/LocationSection";
import CTABanner from "@/components/layout/CTABanner";
import QuoteForm from "@/components/features/QuoteForm";

export const metadata = {
  title: "Location & Contact | Clarity Auto Spa",
  description: "Visit Clarity Auto Spa in the heart of Park Slope, Brooklyn or request a quote online.",
};

export default function LocationPage() {
  return (
    <div className="pt-24 bg-[#111618] min-h-screen flex flex-col">
      <div className="flex-grow">
        <LocationSection />
        <section className="bg-[#111618] py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <QuoteForm />
          </div>
        </section>
      </div>
      <CTABanner />
    </div>
  );
}
