"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Pause, Play } from "lucide-react";
import Link from "next/link";

export default function ReviewsCarousel({ reviews, rating, reviewCount, googleUrl }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplaying, setIsAutoplaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  const carouselItems = reviews.slice(0, 8);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const shouldAutoplay = isAutoplaying && !isExpanded && carouselItems.length > 1;

  useEffect(() => {
    let interval;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsAutoplaying(false); 
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    if (shouldAutoplay) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % carouselItems.length);
        setIsExpanded(false);
      }, 6000);
    }
    
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [shouldAutoplay, carouselItems.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % carouselItems.length);
    setIsExpanded(false);
  }, [carouselItems.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
    setIsExpanded(false);
  }, [carouselItems.length]);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") goToPrev();
    if (e.key === "ArrowRight") goToNext();
  };

  const touchStartX = useRef(null);
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 50) goToNext();
    if (diff < -50) goToPrev();
    touchStartX.current = null;
  };

  if (carouselItems.length === 0) return null;

  const currentReview = carouselItems[currentIndex];
  
  const getInitials = (name) => {
    if (!name) return "CA";
    const parts = name.trim().split(" ");
    if (parts.length > 1) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const showTrustLink = googleUrl && googleUrl !== "https://google.com" && googleUrl !== "#";

  const slideVariants = {
    initial: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 80, y: 20 },
    animate: { opacity: 1, x: 0, y: 0 },
    exit: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -20 },
  };
  
  const transitionProps = prefersReducedMotion 
    ? { duration: 0.15, ease: "linear" } 
    : { duration: 0.6, ease: [0.16, 1, 0.3, 1] };

  return (
    <section 
      aria-roledescription="carousel" 
      aria-label="Customer reviews"
      className="w-full bg-[#111618] py-24 md:py-32 overflow-hidden border-t border-white/10 outline-none"
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-[40%_1fr] items-center gap-16 lg:gap-24">
          
          <div className="flex flex-col gap-8 items-center lg:items-start text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-gold/10 text-gold px-4 py-2 rounded-full w-fit shadow-sm border border-gold/20">
              <Star className="w-[16px] h-[16px] fill-gold text-gold" />
              <span className="font-sans text-[14px] font-semibold tracking-wide uppercase">Rated {rating} on Google</span>
            </div>
            
            <h2 className="font-heading font-medium text-white text-[clamp(2.5rem,4.5vw,4rem)] leading-[1.05] tracking-tight">
              What our customers say
            </h2>
            
            <p className="font-sans text-[18px] md:text-[20px] text-white/70 max-w-[480px] leading-relaxed">
              At Clarity Auto Spa, every vehicle matters and every customer is treated with care. We're proud of the trust our community places in us.
            </p>
            <p className="font-sans text-[18px] md:text-[20px] text-white/70 max-w-[480px] leading-relaxed">
            Take a moment to read what they have to say. When you're ready, we'd love to help you too.
            </p>
            
            {carouselItems.length > 1 && (
              <div className="flex items-center gap-3 mt-4">
                <div 
                  className="flex items-center gap-2"
                  aria-live={isAutoplaying ? "off" : "polite"}
                >
                  {carouselItems.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setCurrentIndex(idx); setIsExpanded(false); }}
                      aria-label={`Show review ${idx + 1} of ${carouselItems.length}`}
                      aria-current={currentIndex === idx}
                      className={`h-2.5 rounded-full transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                        currentIndex === idx ? "w-12 bg-white" : "w-2.5 bg-white/20 hover:bg-white/40"
                      }`}
                    />
                  ))}
                </div>
                
                <button
                  onClick={() => setIsAutoplaying(!isAutoplaying)}
                  aria-label={isAutoplaying ? "Pause rotation" : "Play rotation"}
                  className="w-10 h-10 flex items-center justify-center text-white/50 hover:text-white ml-2 outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-full transition-colors bg-white/5 shadow-sm border border-white/10"
                >
                  {isAutoplaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>
              </div>
            )}
            
            {showTrustLink && (
              <a 
                href={googleUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white font-sans font-semibold hover:text-gold transition-colors mt-6 text-[17px] underline underline-offset-4 decoration-white/20 hover:decoration-gold"
              >
                Read all reviews on Google
              </a>
            )}
          </div>
          
          <div className="relative w-full max-w-[640px] mx-auto lg:ml-auto">
            {/* Decorative Offset Shadows/Squares */}
            <div className="absolute -top-[30px] -right-[30px] w-32 h-32 bg-white/5 rounded-2xl -z-10 hidden sm:block aria-hidden border border-white/10" />
            <div className="absolute -bottom-[30px] -left-[30px] w-32 h-32 bg-white/5 rounded-2xl -z-10 hidden sm:block aria-hidden border border-white/10" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={transitionProps}
                role="group"
                aria-roledescription="slide"
                aria-label={`Review ${currentIndex + 1} of ${carouselItems.length}`}
                className="w-full min-h-[420px] md:min-h-[460px] bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10 p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col relative z-10"
              >
                {currentReview.rating ? (
                  <div className="flex gap-1.5 h-[28px]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-[26px] h-[26px] ${i < currentReview.rating ? "fill-gold text-gold" : "fill-transparent text-gold/30"}`} />
                    ))}
                  </div>
                ) : (
                  <div className="h-[28px]" />
                )}
                
                <div className="absolute top-24 md:top-28 left-6 md:left-10 text-[100px] font-heading leading-none text-white/[0.03] select-none pointer-events-none">
                  “
                </div>
                
                <div className="relative z-10 mt-8">
                  <p className={`font-sans text-[18px] md:text-[22px] font-medium leading-[1.7] text-white/80 ${!isExpanded ? "line-clamp-5" : ""}`}>
                    "{currentReview.text}"
                  </p>
                  
                  {currentReview.text.length > 200 && (
                    <button 
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="mt-4 text-gold text-[15px] font-semibold tracking-wide uppercase hover:underline outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      {isExpanded ? "Show less" : "Read more"}
                    </button>
                  )}
                </div>
                
                <div className="mt-auto pt-8 border-t border-white/10 w-full flex items-center gap-5">
                  <div className="w-[56px] h-[56px] flex-shrink-0 rounded-full bg-gold/10 ring-[2px] ring-gold flex items-center justify-center text-white font-sans font-bold text-[18px]">
                    {getInitials(currentReview.name)}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-sans font-bold text-[18px] text-white">{currentReview.name}</span>
                    <span className="font-sans text-[15px] font-medium text-white/50">{currentReview.source || "Google review"}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
