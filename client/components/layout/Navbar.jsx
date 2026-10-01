"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

const navItems = [
  { label: "Services", href: "/services" },
  { label: "Our Work", href: "/gallery" },
  { label: "Reviews", href: "/testimonials" },
  { label: "Location", href: "/location" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[96%]">
      <div className="flex items-center justify-between w-full py-2 md:py-4 px-2 md:px-6">
        
        {/* Left: Logo */}
        <div className="flex-shrink-0 z-50 pl-2 md:pl-6">
          <Link href="/" className="flex items-center">
            <motion.div
              className="relative flex items-center"
              animate={{ height: scrolled ? 50 : 80 }}
              initial={false}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
            >
              <Image
                src="/logo.png"
                alt="Clarity Auto Spa"
                width={240}
                height={80}
                className="h-full w-auto object-contain drop-shadow-xl"
                priority
              />
            </motion.div>
          </Link>
        </div>

        {/* Right: Links & CTAs (Desktop) & Mobile Toggle */}
        <div className="flex items-center justify-end gap-3 md:gap-4 flex-1 pr-2 md:pr-6 z-50">
          
          <nav className="hidden lg:flex items-center bg-white/90 backdrop-blur-xl border border-white/50 shadow-sm rounded-full p-2 pl-8">
            <div className="flex items-center gap-8 mr-6">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-[12.5px] font-bold text-charcoal hover:text-gold transition-colors uppercase tracking-[0.15em] relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gold transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/services"
                className="flex items-center justify-center bg-gold text-charcoal px-6 py-2.5 rounded-full text-[12.5px] font-bold tracking-[0.15em] uppercase hover:bg-gold-hover transition-all shadow-sm"
              >
                Book Appointment
              </Link>
              <Link
                href="tel:+13472278485"
                className="flex items-center justify-center bg-white border border-gray-200 text-charcoal px-6 py-2.5 rounded-full text-[12.5px] font-bold tracking-[0.15em] uppercase hover:border-gold hover:text-gold transition-colors shadow-sm"
              >
                Call Us
              </Link>
            </div>
          </nav>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-3.5 bg-white/90 backdrop-blur-xl border border-white/50 shadow-md rounded-full text-charcoal hover:text-gold transition-colors"
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            className="absolute top-24 left-0 w-full bg-white/95 backdrop-blur-3xl rounded-[2rem] shadow-2xl overflow-hidden lg:hidden border border-white/50"
          >
            <div className="flex flex-col p-6">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-6 py-4 text-charcoal font-bold text-[15px] uppercase tracking-[0.15em] hover:bg-black/5 rounded-2xl transition-colors border-b border-gray-100 last:border-0"
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex gap-3 mt-8 mb-2">
                <Link
                  href="tel:+13472278485"
                  className="flex-1 flex justify-center items-center bg-gray-100 border border-gray-200 text-charcoal py-4 rounded-2xl font-bold uppercase tracking-[0.15em] text-[13px] hover:bg-gray-200 transition-all"
                >
                  Call
                </Link>
                <Link
                  href="/getquote"
                  className="flex-1 flex justify-center items-center bg-gold text-charcoal py-4 rounded-2xl font-bold uppercase tracking-[0.15em] text-[13px] hover:bg-gold-hover transition-all shadow-md"
                >
                  Quote
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
