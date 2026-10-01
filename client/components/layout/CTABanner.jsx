import { Phone } from "lucide-react";

export default async function CTABanner() {
  let settings = null;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings`, { cache: 'no-store' });
    if (res.ok) {
      settings = await res.json();
    }
  } catch (error) {
    console.error("Failed to fetch settings for CTA:", error);
  }

  const phone = settings?.phone || "+1 347-227-8485";
  const address = settings?.address || "117 14th St, Brooklyn, NY 11215";
  const hours = settings?.weeklyHours?.[0]?.hours || "8:00 AM - 6:30 PM";

  return (
    <section className="bg-[#E6B21E] py-20 relative overflow-hidden">
      {/* Decorative subtle texture/shapes in background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -top-[50%] -left-[10%] w-[70%] h-[200%] bg-white/20 blur-3xl rounded-full transform -rotate-12"></div>
        <div className="absolute -bottom-[50%] -right-[10%] w-[70%] h-[200%] bg-black/20 blur-3xl rounded-full transform rotate-12"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="font-display capitalize text-charcoal mb-4 text-[clamp(2.5rem,4vw,3.5rem)] leading-[1.1] font-heading font-semibold">
          Ready to make your car shine?
        </h2>
        <p className="text-charcoal/80 text-lg md:text-xl font-medium mb-10 max-w-2xl mx-auto">
          Drive in today for an express wash or call us to schedule a premium detailing service.
        </p>
        
        <a
          href={`tel:${phone.replace(/\D/g, "")}`}
          className="inline-flex items-center gap-3 bg-charcoal text-cream px-10 py-5 rounded-full font-display text-xl uppercase tracking-wider hover:bg-black transition-colors group shadow-2xl"
        >
          <Phone className="w-6 h-6 motion-safe:group-hover:animate-wiggle text-gold" />
          Call {phone}
        </a>
        
        <div className="mt-8 text-charcoal/70 font-semibold uppercase tracking-widest text-sm">
          {address} • {hours}
        </div>
      </div>
    </section>
  );
}
