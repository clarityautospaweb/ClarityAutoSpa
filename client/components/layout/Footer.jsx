import Link from "next/link";
import { Phone, MapPin, Mail } from "lucide-react";
import Image from "next/image";

export default async function Footer() {
  const currentYear = new Date().getFullYear();

  let settings = null;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings`, { cache: 'no-store' });
    if (res.ok) {
      settings = await res.json();
    }
  } catch (error) {
    console.error("Failed to fetch settings for Footer:", error);
  }

  const phone = settings?.phone || "+1 347-227-8485";
  const address = settings?.address || "117 14th St, Brooklyn, NY 11215";
  const email = settings?.email || "clarityautospabk@gmail.com";

  return (
    <footer className="bg-black relative overflow-hidden pt-24 pb-8">
      {/* Massive Background Text */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none pointer-events-none select-none flex justify-center translate-y-[28%] z-0">
        <span className="text-[22vw] font-heading font-bold text-white/[0.03] whitespace-nowrap tracking-tighter">
          CLARITY
        </span>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between w-full lg:px-20 gap-12 mb-16">
          
          {/* Col 1: Brand */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link href="/" className="block mb-6">
              <Image src="/logo.png" alt="Clarity Auto Spa Logo" width={300} height={192} className="h-40 md:h-48 w-auto object-contain mx-auto md:mx-0 drop-shadow-2xl" />
            </Link>
            <p className="text-cream/70 leading-relaxed mb-4 max-w-sm">
              Premium auto detailing services. 
              We combine expert care with eco-friendly practices to keep your vehicle looking its best.
            </p>
            {/* Badges */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
              {settings?.showBlackOwnedBadge && (
                <span className="bg-cream/10 text-cream px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-cream/20 backdrop-blur-sm">Black-Owned Business</span>
              )}
              {settings?.showLgbtqBadge && (
                <span className="bg-cream/10 text-cream px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-cream/20 backdrop-blur-sm">LGBTQ+ Friendly</span>
              )}
            </div>
          </div>

          {/* Col 2: Contact */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="font-semibold text-gold uppercase tracking-widest mb-6 text-sm">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-3 text-cream/70">
                <MapPin className="w-5 h-5 text-gold shrink-0" />
                <span>{address}</span>
              </li>
              <li className="flex flex-col md:flex-row items-center gap-2 md:gap-3 text-cream/70">
                <Phone className="w-5 h-5 text-gold shrink-0" />
                <a href={`tel:${phone.replace(/\D/g, "")}`} className="hover:text-gold transition-colors">
                  {phone}
                </a>
              </li>
              <li className="flex flex-col md:flex-row items-center gap-2 md:gap-3 text-cream/70">
                <Mail className="w-5 h-5 text-gold shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-gold transition-colors">
                  {email}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="font-semibold text-gold uppercase tracking-widest mb-6 text-sm">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/#services" className="text-cream/70 hover:text-gold transition-colors">
                  Services & Pricing
                </Link>
              </li>
              <li>
                <Link href="/#why-us" className="text-cream/70 hover:text-gold transition-colors">
                  Why Choose Us
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="text-cream/70 hover:text-gold transition-colors">
                  Client Reviews
                </Link>
              </li>
              <li>
                <Link href="#quote" className="text-cream/70 hover:text-gold transition-colors">
                  Get a Quote
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-cream/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left text-sm text-cream/40">
          <p>© {currentYear} Clarity Auto Spa. All rights reserved.</p>
          <p>
            Designed and Developed by <span className="text-cream/70 font-medium">GhostForm Studios</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
