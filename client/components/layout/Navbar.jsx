"use client";

import { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "Specialty Services", href: "/specialty" },
  { label: "Gallery", href: "/gallery" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] w-[97%]">
      <div className="flex items-center justify-between w-full py-1.5 md:py-2 px-2 md:px-4">
        
        {/* Left: Logo */}
        <div className="flex-shrink-0 z-50 pl-1 md:pl-2">
          <Link href="/" className="flex items-center">
            <motion.div
              className="relative flex items-center origin-left"
              animate={{ scale: scrolled ? 0.85 : 1, y: scrolled ? -1 : 0 }}
              initial={false}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
            >
              <Image
                src="/logo.png"
                alt="Clarity Auto Spa"
                width={130}
                height={80}
                className="h-10 md:h-12 w-auto object-contain drop-shadow-xl"
                priority
              />
            </motion.div>
          </Link>
        </div>

        {/* Right: Links & CTAs (Desktop) & Mobile Toggle */}
        <div className="flex items-center justify-end gap-3 flex-1 pr-1 md:pr-2 z-50">
          
          <nav className="hidden xl:flex items-center bg-[#111618]/90 backdrop-blur-xl border border-white/15 shadow-xl rounded-full p-1.5 pl-6">
            <div className="flex items-center gap-6 mr-5">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-[12px] font-semibold text-white/80 hover:text-gold transition-colors uppercase tracking-[0.12em] relative group py-1"
                >
                  {item.label}
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gold transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <a
                href="https://Claritybk.as.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-gold text-charcoal px-5 py-2.5 rounded-full text-[12px] font-bold tracking-[0.12em] uppercase hover:bg-gold-hover transition-all shadow-md"
              >
                <span>Book Now</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <Link
                href="tel:+13472278485"
                className="flex items-center justify-center bg-white/10 border border-white/15 text-white px-4 py-2.5 rounded-full text-[12px] font-semibold tracking-[0.12em] uppercase hover:bg-white hover:text-charcoal transition-colors"
              >
                Call
              </Link>
            </div>
          </nav>

          {/* Fallback for medium/large desktop (lg to xl) */}
          <div className="hidden lg:flex xl:hidden items-center gap-3 bg-[#111618]/90 backdrop-blur-xl border border-white/15 shadow-xl rounded-full p-1.5 px-4">
            <Link href="/services" className="text-xs font-semibold text-white/90 hover:text-gold uppercase tracking-wider">Services</Link>
            <Link href="/pricing" className="text-xs font-semibold text-white/90 hover:text-gold uppercase tracking-wider">Pricing</Link>
            <Link href="/specialty" className="text-xs font-semibold text-white/90 hover:text-gold uppercase tracking-wider">Specialty</Link>
            <Link href="/gallery" className="text-xs font-semibold text-white/90 hover:text-gold uppercase tracking-wider">Gallery</Link>
            <a
              href="https://Claritybk.as.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gold text-charcoal px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-gold-hover"
            >
              Book Now
            </a>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="xl:hidden p-3 bg-[#111618]/90 backdrop-blur-xl border border-white/15 shadow-md rounded-full text-white hover:text-gold transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            className="absolute top-20 left-0 w-full bg-[#111618]/98 backdrop-blur-3xl rounded-[2rem] shadow-2xl overflow-hidden xl:hidden border border-white/15 text-white"
          >
            <div className="flex flex-col p-6">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3.5 text-white/90 font-semibold text-[15px] uppercase tracking-[0.12em] hover:text-gold hover:bg-white/5 rounded-xl transition-colors border-b border-white/10 last:border-0"
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex gap-3 mt-6 pt-2">
                <Link
                  href="tel:+13472278485"
                  className="flex-1 flex justify-center items-center bg-white/10 border border-white/15 text-white py-3.5 rounded-xl font-bold uppercase tracking-[0.12em] text-[13px] hover:bg-white/20 transition-all"
                >
                  Call Us
                </Link>
                <a
                  href="https://Claritybk.as.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex justify-center items-center gap-1.5 bg-gold text-charcoal py-3.5 rounded-xl font-bold uppercase tracking-[0.12em] text-[13px] hover:bg-gold-hover transition-all shadow-md"
                >
                  <span>Book Now</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
