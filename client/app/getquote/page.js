import Image from "next/image";
import QuoteForm from "@/components/features/QuoteForm";
import CTABanner from "@/components/layout/CTABanner";

export const metadata = {
  title: "Get a Quote | Clarity Auto Spa",
  description: "Request a custom quote for your auto detailing and restoration needs in Brooklyn.",
};

export default function GetQuotePage() {
  return (
    <div className="relative pt-24 bg-[#0b0e10] min-h-screen flex flex-col overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <Image
          src="/porche_front.jpeg"
          alt="Clarity Auto Spa Request a Quote"
          fill
          priority
          sizes="100vw"
          quality={90}
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-[#0b0e10]" />
      </div>
      <div className="relative z-10 flex-grow flex flex-col justify-center py-12 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center mb-12">
            <h1 className="font-heading font-medium text-white capitalize text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] tracking-[-0.02em]">
              Request a <span className="text-gold">Quote</span>
            </h1>
            <p className="mt-4 text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              Tell us about your vehicle and the services you're interested in, and our team will get back to you with a free assessment.
            </p>
          </div>
          <QuoteForm />
        </div>
      </div>
      <CTABanner />
    </div>
  );
}
