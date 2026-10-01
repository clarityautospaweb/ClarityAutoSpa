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
    <div className="pt-24 min-h-screen bg-[#111618]">
      <ServicesContent services={services} categories={categories} />
    </div>
  );
}
