import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const getCategoryImage = (slug) => {
  if (!slug) return "/hero/car.jpg";
  const s = slug.toLowerCase();
  if (s.includes("mini")) return "/services/full_detail.jpg";
  if (s.includes("full")) return "/services/mini_detail.jpg";
  if (s.includes("interior")) return "/hero/interior.jpg";
  if (s.includes("wrap") || s.includes("ppf")) return "/services/ppf.jpg";
  if (s.includes("specialty") || s.includes("restoration")) return "/services/specialised.jpg";
  return "/hero/car.jpg";
};

import FeatureShaderCards from "@/components/ui/feature-shader-cards";

export default async function ServicesSection() {
  let categories = [];
  try {
    const resCat = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/categories`, { cache: 'no-store' });
    if (resCat.ok) categories = await resCat.json();
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }

  const activeCategories = categories.filter(c => c.enabled).sort((a,b) => (a.order||0) - (b.order||0));

  const features = activeCategories.map(cat => ({
    title: cat.title,
    description: cat.description,
    slug: cat.slug,
    imageUrl: cat.imageUrl || getCategoryImage(cat.slug)
  }));

  return (
    <section className="py-24 bg-[#111618] relative z-10" id="services">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 text-gold px-4 py-1.5 rounded-full tracking-[0.15em] uppercase mb-5 text-[12px] font-bold shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
            Our Offerings
          </div>
          <h2 className="font-heading font-medium text-white capitalize text-[clamp(2.5rem,4vw,3.5rem)] leading-[1.1] mb-6">
            Find the Right Service for Your Vehicle
          </h2>
          <p className="text-white/80 font-sans leading-[1.65] text-[17px]">
            Explore our clearly organized service categories below. From routine maintenance to deep interior restoration, choose the perfect package for your vehicle's specific needs.
          </p>
        </div>

        <FeatureShaderCards features={features} />

        <div className="text-center mt-12">
          <Link href="/services" className="inline-flex items-center justify-center bg-gold text-charcoal px-10 py-4 rounded-full font-bold tracking-[0.1em] uppercase hover:bg-gold-hover transition-colors shadow-[0_0_20px_rgba(220,165,70,0.2)]">
            See All Pricing & Services
          </Link>
        </div>

      </div>
    </section>
  );
}
