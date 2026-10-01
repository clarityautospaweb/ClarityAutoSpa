"use client";

import { useState, useRef, useEffect } from "react";
import { quizOptions, DEEP, SPECIALTY, NONE, quizResults } from "@/config/quizConfig";
import ServiceCard from "@/components/cards/ServiceCard";
import Link from "next/link";
import { PawPrint, CupSoda, Armchair, Mountain, Wind, Bug, CheckCircle2 } from "lucide-react";

export default function ServiceQuiz({ services = [], categories = [], onBookMiniDetail }) {
  const [selected, setSelected] = useState([]);
  const [result, setResult] = useState(null);
  const [followUpResponse, setFollowUpResponse] = useState(null); // 'yes' | 'no' | null
  const [announcement, setAnnouncement] = useState("");
  const resultRef = useRef(null);

  const handleToggle = (id) => {
    let newSelected;
    if (id === NONE) {
      newSelected = [NONE];
      setAnnouncement("Selected: None of these. Other options cleared.");
    } else {
      if (selected.includes(NONE)) {
        newSelected = [id];
      } else {
        newSelected = selected.includes(id) 
          ? selected.filter(x => x !== id) 
          : [...selected, id];
      }
      const optionLabel = quizOptions.find(o => o.id === id)?.label;
      setAnnouncement(selected.includes(id) ? `Unselected: ${optionLabel}` : `Selected: ${optionLabel}`);
    }
    setSelected(newSelected);
    setResult(null); // Clear result if user changes selection
    setFollowUpResponse(null);
  };

  const handleRecommend = () => {
    let res = null;
    
    const hasSpecialty = selected.some(s => SPECIALTY.includes(s));
    const hasDeep = selected.some(s => DEEP.includes(s));
    
    if (hasSpecialty) {
      res = quizResults.SPECIALTY;
    } else if (hasDeep) {
      res = quizResults.DEEP;
    } else if (selected.includes(NONE)) {
      res = quizResults.MINI;
    }

    setResult(res);
    setAnnouncement(`Result: ${res?.title}`);
    
    // Scroll to result after a short delay to let it render
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleStartOver = (e) => {
    e.preventDefault();
    setSelected([]);
    setResult(null);
    setFollowUpResponse(null);
    setAnnouncement("Quiz reset");
  };

  const getResultCards = () => {
    if (!result) return [];
    
    let targetSlug = null;
    if (result.id === "MINI") targetSlug = "mini-detail";
    if (result.id === "DEEP") {
      if (followUpResponse === 'yes') targetSlug = "full-detail";
      else if (followUpResponse === 'no') targetSlug = "interior-detail";
      else return []; // No cards until follow-up answered
    }
    
    if (!targetSlug) return [];

    const targetCat = categories.find(c => c.slug === targetSlug);

    return services.filter(s => {
      if (!s.enabled) return false;
      return s.categoryId === targetSlug || 
             (targetCat && s.category && s.category.toLowerCase() === targetCat.title.toLowerCase());
    }).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  };

  const resultCards = getResultCards();

  const getQuoteUrl = () => {
    const selectedLabels = selected.map(id => quizOptions.find(o => o.id === id)?.label).join('; ');
    const msg = `Quiz selections: ${selectedLabels}`;
    return `/getquote?service=Not%20sure&message=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="mx-auto relative">
      <div aria-live="polite" className="sr-only">{announcement}</div>
      
      {!result ? (
        <div className="flex flex-col">
          <div className="mb-10 text-center">
            <h2 className="font-heading font-medium text-3xl md:text-4xl text-charcoal mb-3">
              Not sure which service you need?
            </h2>
            <p className="text-charcoal-soft text-lg">Select any conditions that apply to your vehicle.</p>
          </div>

          <fieldset className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
            <legend className="sr-only">Vehicle conditions</legend>
            {quizOptions.map((opt) => {
              const isChecked = selected.includes(opt.id);
              let Icon;
              if (opt.id === 1) Icon = PawPrint;
              else if (opt.id === 2) Icon = CupSoda;
              else if (opt.id === 3) Icon = Armchair;
              else if (opt.id === 4) Icon = Mountain;
              else if (opt.id === 5) Icon = Wind;
              else if (opt.id === 6) Icon = Bug;
              else if (opt.id === 7) Icon = CheckCircle2;
              else Icon = CheckCircle2;

              return (
                <label 
                  key={opt.id} 
                  className={`group relative flex flex-col items-center justify-center text-center p-6 rounded-2xl transition-all cursor-pointer border ${isChecked ? 'bg-charcoal border-charcoal shadow-[0_8px_30px_rgb(0,0,0,0.12)] -translate-y-1' : 'bg-white border-gray-100 hover:border-gold/50 hover:shadow-sm'}`}
                >
                  <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${isChecked ? 'bg-gold border-gold' : 'border-gray-200 group-hover:border-gold/50'}`}>
                    {isChecked && <svg className="w-3 h-3 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>}
                  </div>

                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isChecked}
                    onChange={() => handleToggle(opt.id)}
                  />
                  
                  <div className={`mb-4 p-3.5 rounded-full transition-colors ${isChecked ? 'bg-white/10 text-gold' : 'bg-cream text-charcoal-soft group-hover:bg-gold/10 group-hover:text-gold'}`}>
                    <Icon className="w-6 h-6" strokeWidth={1.5} />
                  </div>
                  
                  <span className={`text-[14px] font-medium leading-snug transition-colors ${isChecked ? 'text-white' : 'text-charcoal'}`}>
                    {opt.label}
                  </span>
                </label>
              );
            })}
          </fieldset>

          <div className="text-center">
            <button
              disabled={selected.length === 0}
              onClick={handleRecommend}
              className="bg-charcoal text-white font-medium px-8 py-3 rounded-full hover:bg-gold hover:text-charcoal transition-colors disabled:opacity-30 disabled:hover:bg-charcoal disabled:hover:text-white"
            >
              Get Recommendation
            </button>
          </div>
        </div>
      ) : (
        <div ref={resultRef} className="animate-fade-in scroll-mt-24">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 bg-charcoal text-white px-4 py-1.5 rounded-full text-[12px] tracking-[0.12em] font-semibold uppercase mb-6">
              Recommendation
            </div>
            <h2 className="font-heading font-medium text-3xl md:text-4xl leading-[1.15] text-charcoal mb-4 capitalize">
              {result.title}
            </h2>
            <p className="text-charcoal-soft leading-relaxed text-[16px] md:text-[17px] mb-8">
              {result.copy}
            </p>
            
            {result.id === "DEEP" && (
              <div className="bg-transparent border border-gray-200 p-6 rounded-2xl inline-block text-left mb-8 w-full max-w-md relative z-10 text-center">
                <p className="font-medium text-charcoal mb-5">Would you like comprehensive exterior detailing too?</p>
                <div className="flex gap-3 justify-center">
                  <button 
                    onClick={() => setFollowUpResponse('yes')}
                    className={`px-8 py-2.5 rounded-full font-medium transition-colors border ${followUpResponse === 'yes' ? 'bg-charcoal border-charcoal text-white' : 'bg-white border-gray-200 text-charcoal hover:border-gray-300'}`}
                  >
                    Yes
                  </button>
                  <button 
                    onClick={() => setFollowUpResponse('no')}
                    className={`px-8 py-2.5 rounded-full font-medium transition-colors border ${followUpResponse === 'no' ? 'bg-charcoal border-charcoal text-white' : 'bg-white border-gray-200 text-charcoal hover:border-gray-300'}`}
                  >
                    No
                  </button>
                </div>
              </div>
            )}

            {result.id === "SPECIALTY" && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Link 
                  href={getQuoteUrl()}
                  className="bg-charcoal text-white font-medium px-8 py-3 rounded-full hover:bg-gold hover:text-charcoal transition-colors"
                >
                  Request an Assessment
                </Link>
                <a 
                  href="tel:+13472278485"
                  className="bg-white text-charcoal font-medium border border-gray-200 px-8 py-3 rounded-full hover:border-gray-300 transition-colors"
                >
                  Call Us
                </a>
              </div>
            )}
            
            <div className="mt-8">
              <a href="#" onClick={handleStartOver} className="text-sm font-medium text-charcoal-soft hover:text-charcoal transition-colors">
                ← Start over
              </a>
            </div>
          </div>

          {resultCards.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 xl:gap-8 mt-10 animate-fade-in-up">
              {resultCards.map(service => (
                <ServiceCard key={service._id || service.id} service={service} onBookMiniDetail={onBookMiniDetail} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
