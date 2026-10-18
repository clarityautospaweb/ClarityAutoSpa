import Image from "next/image";
import ServicesContent from "@/components/sections/ServicesContent";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Auto Detailing & Specialty Cleaning Services | Clarity Auto Spa, Brooklyn",
  description: "Mini, Full and Interior details plus mold, rodent and flood-affected interior cleaning in Park Slope, Brooklyn.",
};

export default async function ServicesPage() {
  let services = [];
  let categories = [];
  try {
    const [resSvc, resCat] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`, { cache: 'no-store' }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/categories`, { cache: 'no-store' })
    ]);
    
    if (resSvc.ok) services = await resSvc.json();
    if (resCat.ok) categories = await resCat.json();
    
    console.log(`Fetched ${services.length} services and ${categories.length} categories on server.`);
  } catch (error) {
    console.error("Failed to fetch services/categories:", error);
  }

  return (
    <div className="relative pt-24 min-h-screen bg-[#0b0e10] overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <Image
          src="/porche_front.jpeg"
          alt="Clarity Auto Spa Services"
          fill
          priority
          sizes="100vw"
          quality={90}
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-[#0b0e10]" />
      </div>
      <div className="relative z-10">
        <ServicesContent services={services} categories={categories} />
      </div>
    </div>
  );
}
