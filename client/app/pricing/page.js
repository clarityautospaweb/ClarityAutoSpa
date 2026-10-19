import Image from "next/image";
import PricingContent from "@/components/sections/PricingContent";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Pricing & Detailing Packages | Clarity Auto Spa, Brooklyn",
  description: "Complete pricing menu for Sedan, SUV, and XL SUV detailing packages, ceramic window tinting, PPF, and specialty restoration in Brooklyn, NY.",
};

export default async function PricingPage() {
  let services = [];
  let categories = [];
  try {
    const [resSvc, resCat] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`, { cache: 'no-store' }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/categories`, { cache: 'no-store' })
    ]);
    
    if (resSvc.ok) services = await resSvc.json();
    if (resCat.ok) categories = await resCat.json();
  } catch (error) {
    console.error("Failed to fetch services/categories for Pricing:", error);
  }

  return (
    <div className="relative pt-24 min-h-screen bg-[#0b0e10] overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <Image
          src="/porche_front.jpeg"
          alt="Clarity Auto Spa Pricing"
          fill
          priority
          sizes="100vw"
          quality={90}
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-[#0b0e10]/90 to-[#0b0e10]" />
      </div>
      <div className="relative z-10">
        <PricingContent services={services} categories={categories} />
      </div>
    </div>
  );
}
