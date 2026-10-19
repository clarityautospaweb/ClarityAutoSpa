import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Check, Sparkles, Shield, Clock, Droplets } from "lucide-react";
import FeatureShaderCards from "@/components/ui/feature-shader-cards";

const getCategoryImage = (slug) => {
  if (!slug) return "/services/full_detail.jpg";
  const s = slug.toLowerCase();
  if (s.includes("mini")) return "/services/mini_detail.jpg";
  if (s.includes("full")) return "/services/full_detail.jpg";
  if (s.includes("interior")) return "/Quiz/interior.jpg";
  if (s.includes("engine")) return "/services/full_detail.jpg";
  if (s.includes("paint") || s.includes("ceramic")) return "/porche_front.jpeg";
  if (s.includes("tint")) return "/porche_back.jpeg";
  if (s.includes("wrap")) return "/porche_back.jpeg";
  if (s.includes("ppf") || s.includes("film")) return "/services/ppf.jpg";
  if (s.includes("custom") || s.includes("enhancement")) return "/services/specialised.jpg";
  if (s.includes("specialty") || s.includes("restoration")) return "/whyus/flood.jpg";
  return "/services/full_detail.jpg";
};

export default async function ServicesSection() {
  let categories = [];
  try {
    const resCat = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/categories`, { cache: 'no-store' });
    if (resCat.ok) categories = await resCat.json();
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }

  const activeCategories = categories.filter(c => c.enabled).sort((a, b) => (a.order || 0) - (b.order || 0));

  // Premium services for FeatureShaderCards
  const premiumCategories = activeCategories.filter(c => 
    !["mini-detail", "full-detail", "interior-detail", "specialty-restoration"].includes(c.slug)
  );

  const features = premiumCategories.map(cat => ({
    title: cat.title,
    description: cat.description,
    slug: cat.slug,
    imageUrl: cat.imageUrl || getCategoryImage(cat.slug)
  }));

  return (
    <section className="py-24 sm:py-32 bg-[#0b0e10] relative z-10" id="services">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 text-gold px-4 py-1.5 rounded-full tracking-[0.15em] uppercase mb-5 text-[12px] font-bold shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></span>
            Brooklyn's Premier Auto Spa
          </div>
          <h2 className="font-heading font-medium text-white capitalize text-[clamp(2.5rem,4.5vw,3.75rem)] leading-[1.1] mb-6">
            Core Detailing & Restoration
          </h2>
          <p className="text-white/80 font-sans leading-relaxed text-base sm:text-lg">
            Clearly organized detailing packages tailored to your vehicle's specific condition. Routine upkeep to master restorations.
          </p>
        </div>

        {/* ─── PROMINENT 4 CORE CARDS: Mini Detail, Full Detail, Interior Detail, Specialty Restoration ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8 mb-24">
          
          {/* Card 1: Mini Detail */}
          <div className="bg-[#111618] border border-white/10 hover:border-amber-400/50 rounded-[2rem] p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-xl group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="bg-amber-400/10 text-amber-300 border border-amber-400/20 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  Exterior + Basic Interior
                </span>
                <span className="text-xs text-white/50">1 hr 25m – 1 hr 55m</span>
              </div>
              <h3 className="font-heading font-semibold text-2xl text-white mb-2 group-hover:text-amber-300 transition-colors">
                Mini Detail
              </h3>
              <p className="text-white/70 text-xs sm:text-sm leading-relaxed mb-5">
                Exterior hand wash, wheel cleaning, tire shine, interior vacuuming, windows, and light interior wipe-down.
              </p>
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3 mb-6 space-y-1.5">
                <div className="text-[12px] text-white/90 flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Sedan: $114.99</span>
                </div>
                <div className="text-[12px] text-white/90 flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>SUV: $124.99</span>
                </div>
                <div className="text-[12px] text-white/90 flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>XL SUV: $134.99</span>
                </div>
              </div>
            </div>
            <div>
              <div className="text-[11px] text-white/40 mb-4 italic">
                *Routine maintenance. Does not include shampooing or stain removal.
              </div>
              <Link
                href="/services#mini-detail"
                className="w-full bg-white/10 hover:bg-gold hover:text-charcoal text-white font-semibold py-3 rounded-full text-xs uppercase tracking-wider text-center block transition-all"
              >
                View Mini Detail
              </Link>
            </div>
          </div>

          {/* Card 2: Full Detail */}
          <div className="bg-[#111618] border-2 border-gold/40 hover:border-gold rounded-[2rem] p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-2xl relative group">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gold text-charcoal font-bold text-[10px] uppercase tracking-widest px-4 py-1 rounded-full shadow-md">
              Most Comprehensive
            </div>
            <div>
              <div className="flex items-center justify-between mb-4 mt-1">
                <span className="bg-gold/15 text-gold border border-gold/30 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  Deep Interior & Exterior
                </span>
                <span className="text-xs text-white/50">2 hr 45m – 3 hr 15m</span>
              </div>
              <h3 className="font-heading font-semibold text-2xl text-white mb-2 group-hover:text-gold transition-colors">
                Full Detail
              </h3>
              <p className="text-white/70 text-xs sm:text-sm leading-relaxed mb-5">
                Comprehensive deep detailing: carpet & upholstery shampooing, stain treatment, hand wash, wheels, and protective finishing.
              </p>
              <div className="bg-gold/[0.05] border border-gold/20 rounded-xl p-3 mb-6 space-y-1.5">
                <div className="text-[12px] text-white/90 flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-gold shrink-0" />
                  <span>Sedan: $349</span>
                </div>
                <div className="text-[12px] text-white/90 flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-gold shrink-0" />
                  <span>SUV: $425</span>
                </div>
                <div className="text-[12px] text-white/90 flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-gold shrink-0" />
                  <span>XL SUV: $475</span>
                </div>
              </div>
            </div>
            <div>
              <div className="text-[11px] text-gold/80 mb-4 font-medium">
                ★ Ideal for restoring daily drivers and leased vehicles.
              </div>
              <Link
                href="/services#full-detail"
                className="w-full bg-gold text-charcoal font-bold py-3 rounded-full text-xs uppercase tracking-wider text-center block hover:bg-gold-hover transition-colors shadow-lg"
              >
                Book Full Detail
              </Link>
            </div>
          </div>

          {/* Card 3: Interior Detail Only */}
          <div className="bg-[#111618] border border-white/10 hover:border-white/30 rounded-[2rem] p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-xl group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="bg-white/10 text-white/90 border border-white/15 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  Cabin Deep Cleanse
                </span>
                <span className="text-xs text-white/50">2 hr 15m – 2 hr 30m</span>
              </div>
              <h3 className="font-heading font-semibold text-2xl text-white mb-2 group-hover:text-gold transition-colors">
                Interior Detail Only
              </h3>
              <p className="text-white/70 text-xs sm:text-sm leading-relaxed mb-5">
                Deep interior cleaning, carpet & upholstery shampooing, targeted stain extraction, interior surfaces, and high-power vacuuming.
              </p>
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3 mb-6 space-y-1.5">
                <div className="text-[12px] text-white/90 flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-gold shrink-0" />
                  <span>Sedan: $274.99</span>
                </div>
                <div className="text-[12px] text-white/90 flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-gold shrink-0" />
                  <span>SUV: $374.99</span>
                </div>
                <div className="text-[12px] text-white/90 flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-gold shrink-0" />
                  <span>XL SUV: Price TBA</span>
                </div>
              </div>
            </div>
            <div>
              <div className="text-[11px] text-white/40 mb-4 italic">
                *Focused cabin care for pet owners, spills, and family rides.
              </div>
              <Link
                href="/services#interior-detail"
                className="w-full bg-white/10 hover:bg-gold hover:text-charcoal text-white font-semibold py-3 rounded-full text-xs uppercase tracking-wider text-center block transition-all"
              >
                View Interior Detail
              </Link>
            </div>
          </div>

          {/* Card 4: Specialty Restoration */}
          <div className="bg-[#111618] border border-red-500/30 hover:border-red-500/60 rounded-[2rem] p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-xl group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="bg-red-500/15 text-red-300 border border-red-500/30 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  Specialized Remediation
                </span>
                <span className="text-xs text-red-400 font-semibold">Diagnostic</span>
              </div>
              <h3 className="font-heading font-semibold text-2xl text-white mb-2 group-hover:text-red-300 transition-colors">
                Specialty Restoration
              </h3>
              <p className="text-white/70 text-xs sm:text-sm leading-relaxed mb-5">
                Mold & mildew remediation, flood water extraction, rodent contamination cleanup, and molecular odor removal.
              </p>
              <div className="bg-red-500/[0.04] border border-red-500/15 rounded-xl p-3 mb-6 space-y-1.5">
                <div className="text-[12px] text-white/90 flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span>Mold: $800–$1,650+</span>
                </div>
                <div className="text-[12px] text-white/90 flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span>Flood & Water: Custom Quote</span>
                </div>
                <div className="text-[12px] text-white/90 flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span>Rodent Cleanup: Custom Quote</span>
                </div>
              </div>
            </div>
            <div>
              <div className="text-[11px] text-red-300/80 mb-4 font-medium">
                *Requires inspection before final pricing.
              </div>
              <Link
                href="/specialty"
                className="w-full bg-red-500/20 text-red-200 border border-red-500/40 hover:bg-red-600 hover:text-white font-semibold py-3 rounded-full text-xs uppercase tracking-wider text-center block transition-all"
              >
                Specialty Assessment
              </Link>
            </div>
          </div>

        </div>

        {/* ─── PREMIUM & CUSTOM ENHANCEMENTS SHOWCASE ─── */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white/80 px-4 py-1.5 rounded-full tracking-[0.15em] uppercase mb-4 text-[11px] font-bold">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            Paint Correction, PPF, Wraps & Lighting
          </div>
          <h3 className="font-heading font-medium text-white capitalize text-[clamp(2rem,3.5vw,2.75rem)] leading-[1.15] mb-4">
            Premium Automotive Enhancements
          </h3>
          <p className="text-white/70 text-base leading-relaxed">
            Elevate your vehicle with state-of-the-art XPEL Paint Protection Film, 3M vinyl color changes, ceramic window tints, starlight headliners, and ambient lighting.
          </p>
        </div>

        <FeatureShaderCards features={features} />

        {/* Bottom CTA Row */}
        <div className="text-center mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/pricing" 
            className="inline-flex items-center justify-center bg-gold text-charcoal px-10 py-4 rounded-full font-bold tracking-[0.1em] uppercase hover:bg-gold-hover transition-colors shadow-[0_0_20px_rgba(220,165,70,0.25)] text-sm"
          >
            Compare All Pricing & Packages
          </Link>
          <a
            href="https://Claritybk.as.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-white/10 border border-white/20 text-white hover:bg-white hover:text-charcoal px-10 py-4 rounded-full font-bold tracking-[0.1em] uppercase transition-all text-sm"
          >
            Direct Acuity Booking
          </a>
        </div>

      </div>
    </section>
  );
}
