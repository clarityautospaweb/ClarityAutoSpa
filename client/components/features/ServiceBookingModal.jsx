"use client";

import { useState, useEffect } from "react";
import { X, Check, ShieldCheck, Sparkles, Clock, Upload, AlertCircle, ArrowUpRight, Phone } from "lucide-react";
import Image from "next/image";
import { optionalAddons } from "@/config/addons";

export default function ServiceBookingModal({
  isOpen,
  onClose,
  service,
  allServices = [],
  categories = []
}) {
  const [selectedVehicleType, setSelectedVehicleType] = useState("Sedan");
  const [vehicleDetails, setVehicleDetails] = useState({ year: "", make: "", model: "" });
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [miniAck, setMiniAck] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: "", phone: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [viewMode, setViewMode] = useState("default"); // 'default' | 'quoteForm'

  // Lock body scroll and prevent Lenis / window scroll while modal is open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (service) {
      if (service.carType && ["Sedan", "SUV", "XL SUV"].includes(service.carType)) {
        setSelectedVehicleType(service.carType);
      } else {
        setSelectedVehicleType("Sedan");
      }
      setSelectedAddons([]);
      setMiniAck(false);
      setPhotos([]);
      setSubmitSuccess(false);
      setSubmitError("");
      setViewMode(service.ctaType === "assessment" || service.ctaType === "quote" ? "quoteForm" : "default");
    }
  }, [service]);

  if (!isOpen || !service) return null;

  // Find matching variation if service has sibling sizes in same category
  const siblingServices = allServices.filter(s => 
    s.categoryId === service.categoryId && 
    s.enabled && 
    (s.carType === "Sedan" || s.carType === "SUV" || s.carType === "XL SUV")
  );

  const activeService = siblingServices.find(s => s.carType === selectedVehicleType) || service;

  const isMiniDetail = activeService.categoryId === "mini-detail" || 
                       activeService.name.toLowerCase().includes("mini detail");

  const isSpecialty = activeService.isSpecialty || 
                      activeService.categoryId === "specialty-restoration" || 
                      activeService.ctaType === "assessment";

  const handleAddonToggle = (addonName) => {
    setSelectedAddons(prev => 
      prev.includes(addonName) ? prev.filter(a => a !== addonName) : [...prev, addonName]
    );
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (photos.length + files.length > 5) {
      alert("You can only upload up to 5 photos.");
      return;
    }
    const valid = files.filter(f => f.size <= 10 * 1024 * 1024);
    setPhotos(prev => [...prev, ...valid]);
  };

  const handleProceedAcuity = () => {
    if (isMiniDetail && !miniAck) {
      alert("Please confirm the Mini Detail acknowledgment to proceed.");
      return;
    }
    const acuityUrl = activeService.acuityLink || "https://Claritybk.as.me/";
    window.open(acuityUrl, "_blank");
    onClose();
  };

  const handleSubmitQuote = async (e) => {
    e.preventDefault();
    if (isMiniDetail && !miniAck) {
      setSubmitError("Please confirm the Mini Detail acknowledgment before submitting.");
      return;
    }
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const data = new FormData();
      data.append("name", customerInfo.name);
      data.append("phone", customerInfo.phone);
      data.append("email", customerInfo.email);
      data.append(
        "vehicle",
        `${vehicleDetails.year} ${vehicleDetails.make} ${vehicleDetails.model} (${selectedVehicleType})`.trim()
      );
      data.append("serviceNeeded", activeService.name);
      
      let combinedMessage = customerInfo.message || "";
      if (selectedAddons.length > 0) {
        combinedMessage += `\n\nSelected Add-ons: ${selectedAddons.join(", ")}`;
      }
      data.append("message", combinedMessage.trim());

      photos.forEach(file => data.append("photos", file));

      if (isMiniDetail) {
        data.append("miniDetailAcknowledged", "true");
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/submissions`, {
        method: "POST",
        body: data
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to submit request.");
      }

      setSubmitSuccess(true);
    } catch (err) {
      console.error(err);
      setSubmitError(err.message || "An error occurred. Please call us at (347) 227-8485.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedPrice = () => {
    const p = activeService.price || "";
    if (p.toLowerCase().includes("quote") || p.toLowerCase().includes("confirm")) return p;
    if (activeService.pricingType === "starts_at") return `Starting $${p.replace(/[^0-9.]/g, "")}`;
    if (activeService.pricingType === "inspection") return p.startsWith("$") ? p : (p.match(/\d/) ? `$${p}` : p);
    return p.startsWith("$") ? p : `$${p}`;
  };

  return (
    <div 
      data-lenis-prevent
      className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in overscroll-contain overflow-hidden select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        data-lenis-prevent
        className="bg-[#111618] border border-white/15 text-white w-full max-w-2xl rounded-3xl shadow-2xl relative flex flex-col max-h-[88vh] sm:max-h-[85vh] overscroll-contain overflow-hidden select-text"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Fixed Header */}
        <div className="p-5 sm:p-7 pb-4 sm:pb-5 border-b border-white/10 shrink-0 relative pr-14 bg-[#111618]">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 p-2.5 rounded-full transition-colors z-20"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center gap-2 bg-gold/10 text-gold px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 border border-gold/20">
            <Sparkles className="w-3.5 h-3.5" />
            {activeService.category}
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-heading font-semibold text-white leading-tight">
            {activeService.name}
          </h2>
          {activeService.description && (
            <p className="text-white/70 text-xs sm:text-sm mt-1.5 leading-relaxed line-clamp-2">
              {activeService.description}
            </p>
          )}
        </div>

        {submitSuccess ? (
          <div className="p-8 sm:p-12 text-center flex flex-col items-center justify-center flex-1">
            <div className="w-16 h-16 rounded-full bg-gold/20 text-gold flex items-center justify-center mb-6">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-heading font-medium text-white mb-3">
              Request Received!
            </h3>
            <p className="text-white/70 max-w-md mx-auto mb-6 text-sm sm:text-base leading-relaxed">
              Thank you! Our detailing specialists have received your vehicle details and will follow up shortly with a tailored assessment.
            </p>
            <button
              onClick={onClose}
              className="px-8 py-3 bg-gold text-charcoal font-semibold rounded-full hover:bg-gold-hover transition-colors"
            >
              Close Window
            </button>
          </div>
        ) : (
          <>
            {/* Scrollable Content Area */}
            <div 
              data-lenis-prevent
              className="overflow-y-auto overscroll-contain flex-1 p-5 sm:p-7 space-y-6"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {/* Price & Duration banner */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs uppercase text-white/50 tracking-wider block font-medium">Estimated Pricing</span>
                  <span className="text-2xl sm:text-3xl font-bold text-gold font-heading">
                    {formattedPrice()}
                  </span>
                  <span className="text-[11px] text-white/40 block mt-0.5">Excludes applicable sales tax</span>
                </div>
                <div className="flex items-center gap-2 text-white/80 bg-white/5 px-4 py-2 rounded-xl text-sm border border-white/5">
                  <Clock className="w-4 h-4 text-gold" />
                  <span>{activeService.turnaround || activeService.time || "Duration on request"}</span>
                </div>
              </div>

              {/* Step 1: Vehicle Size Selection (if variations exist) */}
              {siblingServices.length > 1 && (
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/70 font-semibold mb-2.5">
                    1. Select Vehicle Size
                  </label>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {["Sedan", "SUV", "XL SUV"].map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setSelectedVehicleType(type)}
                        className={`py-2.5 px-3 rounded-xl text-sm font-semibold border transition-all ${
                          selectedVehicleType === type
                            ? "bg-gold text-charcoal border-gold shadow-md font-bold"
                            : "bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Vehicle Year / Make / Model */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 font-semibold mb-2.5">
                  2. Enter Vehicle Info (Optional)
                </label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <input
                    type="text"
                    placeholder="Year (e.g. 2022)"
                    value={vehicleDetails.year}
                    onChange={e => setVehicleDetails({ ...vehicleDetails, year: e.target.value })}
                    className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold"
                  />
                  <input
                    type="text"
                    placeholder="Make (e.g. BMW)"
                    value={vehicleDetails.make}
                    onChange={e => setVehicleDetails({ ...vehicleDetails, make: e.target.value })}
                    className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold"
                  />
                  <input
                    type="text"
                    placeholder="Model (e.g. X5)"
                    value={vehicleDetails.model}
                    onChange={e => setVehicleDetails({ ...vehicleDetails, model: e.target.value })}
                    className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              {/* Step 3: Optional Add-ons (Full natural flow, no scroll trapping!) */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-xs uppercase tracking-wider text-white/70 font-semibold">
                    3. Select Optional Add-Ons
                  </label>
                  <span className="text-[11px] text-gold/80 font-medium">Prices to be confirmed</span>
                </div>
                <div className="space-y-2 border border-white/10 rounded-2xl p-3 bg-white/[0.02]">
                  {optionalAddons.map(addon => {
                    const isChecked = selectedAddons.includes(addon.name);
                    return (
                      <label
                        key={addon.id}
                        onClick={() => handleAddonToggle(addon.name)}
                        className={`flex items-start gap-3 p-2.5 rounded-xl cursor-pointer border transition-colors ${
                          isChecked 
                            ? "bg-gold/10 border-gold/40 text-white" 
                            : "bg-white/5 border-transparent hover:bg-white/10 text-white/70"
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center shrink-0 ${
                          isChecked ? "bg-gold border-gold" : "border-white/30"
                        }`}>
                          {isChecked && <Check className="w-3 h-3 text-charcoal stroke-[3]" />}
                        </div>
                        <div className="flex-1 text-xs">
                          <div className="font-semibold text-white">{addon.name}</div>
                          <div className="text-white/50 text-[11px] mt-0.5">{addon.description}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Mini Detail Acknowledgment */}
              {isMiniDetail && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={miniAck}
                      onChange={e => setMiniAck(e.target.checked)}
                    />
                    <div className={`w-5 h-5 rounded border mt-0.5 flex items-center justify-center shrink-0 ${
                      miniAck ? "bg-gold border-gold" : "border-amber-400/50"
                    }`}>
                      {miniAck && <Check className="w-3.5 h-3.5 text-charcoal stroke-[3]" />}
                    </div>
                    <span className="text-xs text-amber-200/90 leading-relaxed font-sans">
                      <strong>Important Note:</strong> Mini Detail is strictly our Exterior Hand Wash + Basic Interior Cleaning package. It covers light maintenance and does not include carpet shampooing, stain treatment, embedded pet-hair removal, or odor eradication. If your vehicle needs deeper remediation, Clarity Auto Spa will discuss service and price adjustments before work begins.
                    </span>
                  </label>
                </div>
              )}

              {/* Quote Form Fields (if Quote mode) */}
              {viewMode === "quoteForm" && (
                <form id="quote-modal-form" onSubmit={handleSubmitQuote} className="space-y-4 pt-4 border-t border-white/10">
                  <div className="text-xs uppercase tracking-wider text-gold font-bold">
                    {isSpecialty ? "Specialty Diagnostic Quote Request" : "Custom Quote Request"}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      required
                      type="text"
                      placeholder="Your Full Name *"
                      value={customerInfo.name}
                      onChange={e => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-gold"
                    />
                    <input
                      required
                      type="tel"
                      placeholder="Phone Number *"
                      value={customerInfo.phone}
                      onChange={e => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-gold"
                    />
                  </div>

                  <input
                    required
                    type="email"
                    placeholder="Email Address *"
                    value={customerInfo.email}
                    onChange={e => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-gold"
                  />

                  <textarea
                    rows="3"
                    placeholder="Tell us about the condition of the vehicle, odors, or specific concerns..."
                    value={customerInfo.message}
                    onChange={e => setCustomerInfo({ ...customerInfo, message: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-gold resize-none"
                  />

                  {/* Photo upload */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-white/70 font-semibold">Upload Vehicle Photos (Optional, Max 5)</span>
                      <span className="text-[11px] text-white/40">Up to 10MB each</span>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {photos.map((p, i) => (
                        <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/20">
                          <Image src={URL.createObjectURL(p)} alt="preview" fill className="object-cover" />
                          <button
                            type="button"
                            onClick={() => setPhotos(photos.filter((_, idx) => idx !== i))}
                            className="absolute top-1 right-1 bg-black/60 rounded-full p-1 text-white hover:bg-black"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      {photos.length < 5 && (
                        <label className="w-16 h-16 rounded-lg border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-gold hover:text-gold text-white/40 transition-colors">
                          <Upload className="w-5 h-5" />
                          <span className="text-[9px] uppercase mt-1">Add</span>
                          <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
                        </label>
                      )}
                    </div>
                  </div>
                </form>
              )}

              {/* Error Message */}
              {submitError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-3.5 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}
            </div>

            {/* Pinned Action Footer */}
            <div className="p-4 sm:p-5 border-t border-white/10 bg-[#13181b] shrink-0">
              {viewMode === "quoteForm" ? (
                <div className="flex gap-3">
                  <button
                    type="submit"
                    form="quote-modal-form"
                    disabled={isSubmitting || (isMiniDetail && !miniAck)}
                    className="flex-1 bg-gold text-charcoal font-bold py-3.5 rounded-full hover:bg-gold-hover transition-colors shadow-lg disabled:opacity-50 text-xs sm:text-sm uppercase tracking-wider"
                  >
                    {isSubmitting ? "Submitting Request..." : "Submit Quote Request"}
                  </button>
                  {!isSpecialty && (
                    <button
                      type="button"
                      onClick={() => setViewMode("default")}
                      className="px-5 py-3.5 bg-white/5 hover:bg-white/10 rounded-full text-white/70 text-xs sm:text-sm transition-colors"
                    >
                      Back
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-2.5">
                  <button
                    type="button"
                    disabled={isMiniDetail && !miniAck}
                    onClick={handleProceedAcuity}
                    className="w-full bg-gold text-charcoal font-bold py-3.5 sm:py-4 rounded-full hover:bg-gold-hover transition-colors shadow-[0_0_25px_rgba(220,165,70,0.25)] flex items-center justify-center gap-2 text-xs sm:text-sm uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span>Book Appointment on Acuity</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-between text-xs pt-0.5">
                    <button
                      type="button"
                      onClick={() => setViewMode("quoteForm")}
                      className="text-white/60 hover:text-gold transition-colors underline underline-offset-4"
                    >
                      Prefer a custom quote or need special inspection?
                    </button>
                    <a
                      href="tel:+13472278485"
                      className="text-gold hover:underline font-semibold"
                    >
                      Call (347) 227-8485
                    </a>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
