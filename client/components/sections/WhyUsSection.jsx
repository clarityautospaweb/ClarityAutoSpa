import { whyUsPoints } from "@/lib/siteData";
import { Clock, Leaf, BadgeCheck, ThumbsUp } from "lucide-react";
import Image from "next/image";

const iconMap = {
  Clock,
  Leaf,
  BadgeCheck,
  ThumbsUp,
};

export default function WhyUsSection() {
  return (
    <section id="why-us" className="py-32 bg-[#111618] border-t border-white/10 relative overflow-hidden">
      <div className="mx-auto px-4 sm:px-6 lg:px-20 relative z-10">
        
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 bg-gold/10 text-gold px-4 py-1.5 rounded-full tracking-[0.15em] uppercase mb-6 text-[11px] font-semibold border border-gold/20">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></span>
            The Clarity Difference
          </div>
          <h2 className="font-heading font-medium text-white capitalize text-[clamp(2.5rem,4vw,3.5rem)] leading-[1.1] tracking-tight">
            Why Choose Us
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mx-auto">
          {whyUsPoints.map((point, index) => {
            const Icon = iconMap[point.icon];
            
            return (
              <div 
                key={index} 
                className="group flex flex-col bg-white/5 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.2)] border border-white/10 transition-all duration-500 ease-out hover:-translate-y-2 hover:border-gold/50 relative overflow-hidden backdrop-blur-sm"
              >
                {/* Top Image Area */}
                <div className="relative w-full h-56 sm:h-64 overflow-hidden rounded-t-[2rem]">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                  {point.image && (
                    <Image 
                      src={point.image} 
                      alt={point.title}
                      fill
                      className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  )}
                  {/* Floating Icon Over Image */}
                  <div className="absolute bottom-4 left-6 z-20">
                    <div className="relative w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg transition-colors duration-500 group-hover:bg-gold border border-white/20">
                      {Icon && (
                        <Icon 
                          className="w-5 h-5 text-white group-hover:text-charcoal transform transition-all duration-500 group-hover:scale-110" 
                          strokeWidth={1.5} 
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-8 pt-8 relative z-10 flex flex-col flex-grow">
                  {/* Subtle Watermark Number */}
                  <div className="absolute top-6 right-6 text-[3.5rem] leading-none font-heading font-medium text-white/5 transition-transform duration-700 group-hover:-translate-y-2 group-hover:text-gold/15 pointer-events-none select-none">
                    0{index + 1}
                  </div>

                  <h3 className="font-heading font-semibold text-[22px] tracking-tight text-white mb-3 transition-colors duration-300 group-hover:text-gold pr-12">
                    {point.title}
                  </h3>
                  <p className="leading-[1.7] text-[15px] text-white/70 max-w-[65ch]">
                    {point.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
