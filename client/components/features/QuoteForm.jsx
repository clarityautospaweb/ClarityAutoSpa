"use client";

import { useState, useEffect } from "react";
import { Upload, X, CheckCircle2, AlertCircle } from "lucide-react";
import Image from "next/image";

export default function QuoteForm() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    vehicle: "",
    serviceNeeded: "",
    message: ""
  });
  const [photos, setPhotos] = useState([]);
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [miniAck, setMiniAck] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/categories`)
    ])
    .then(async ([svcRes, catRes]) => {
      if (svcRes.ok) setServices((await svcRes.json()).filter(s => s.enabled));
      if (catRes.ok) setCategories(await catRes.json());
    })
    .catch(err => console.error("Failed to load services", err));

    // Check URL params
    const params = new URLSearchParams(window.location.search);
    const qsService = params.get('service');
    const qsMsg = params.get('message');
    if (qsService || qsMsg) {
      setFormData(prev => ({
        ...prev,
        serviceNeeded: qsService || prev.serviceNeeded,
        message: qsMsg || prev.message
      }));
    }
  }, []);

  const isMiniDetailSelected = formData.serviceNeeded.includes("Mini Detail");

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (photos.length + files.length > 5) {
      alert("You can only upload up to 5 images.");
      return;
    }
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} is too large. Max 10MB.`);
        return false;
      }
      return true;
    });
    setPhotos(prev => [...prev, ...validFiles]);
  };

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    photos.forEach(file => data.append('photos', file));
    
    if (isMiniDetailSelected) {
      data.append('miniDetailAcknowledged', 'true');
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/submissions`, {
        method: 'POST',
        body: data
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Something went wrong.");
      }
      
      setStatus("success");
      setFormData({
        name: "", phone: "", email: "", vehicle: "", serviceNeeded: "", message: ""
      });
      setPhotos([]);
      setMiniAck(false);
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMsg(err.message);
    }
  };

  if (status === "success") {
    return (
      <div className="bg-cream rounded-3xl p-8 shadow-xl text-center flex flex-col items-center justify-center min-h-[400px]">
        <CheckCircle2 className="w-20 h-20 text-green-500 mb-6" />
        <h3 className="font-semibold text-charcoal mb-4 capitalize text-[1.5rem] font-heading">Request Received!</h3>
        <p className="text-gray-600 mb-8 max-w-md">
          Thank you for reaching out. We have sent a confirmation email and our team will get back to you shortly with an assessment.
        </p>
        <button 
          onClick={() => setStatus("idle")}
          className="bg-gold text-charcoal px-8 py-3 rounded-full font-semibold hover:bg-gold-hover transition-all shadow-lg"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div className="bg-cream rounded-3xl p-6 md:p-10 shadow-xl" id="quote">
      <div className="mb-8 text-center">
        <h2 className="font-medium text-charcoal capitalize mb-3 text-[clamp(2rem,3.5vw,2.75rem)] leading-[1.15] font-heading">Get In Touch</h2>
        <p className="text-gray-500 font-medium text-sm md:text-base">Fill out the form below for a free assessment of your vehicle.</p>
      </div>

      {status === "error" && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-start gap-3 border border-red-100">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Error submitting request</p>
            <p className="text-sm mt-1">{errorMsg}. Please call us at <a href="tel:+13472278485" className="underline font-semibold">(347) 227-8485</a> instead.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Name *</label>
            <input 
              required
              type="text" 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone *</label>
            <input 
              required
              type="tel" 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
            <input 
              required
              type="email" 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Vehicle (Year/Make/Model) *</label>
            <input 
              required
              type="text" 
              placeholder="e.g. 2021 Honda Civic"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
              value={formData.vehicle}
              onChange={e => setFormData({...formData, vehicle: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Service Needed *</label>
          <select 
            required
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors appearance-none"
            value={formData.serviceNeeded}
            onChange={e => setFormData({...formData, serviceNeeded: e.target.value})}
          >
            <option value="" disabled>Select a service...</option>
            {categories.filter(c => c.enabled).map(cat => {
              const catServices = services.filter(s => 
                s.categoryId === cat.slug ||
                (s.categoryId && s.categoryId.replace(/_/g, '-') === cat.slug) ||
                (s.category && s.category.toLowerCase().replace(/[^a-z0-9]/g, '') === cat.title.toLowerCase().replace(/[^a-z0-9]/g, '')) ||
                (s.category && cat.title.toLowerCase().includes(s.category.toLowerCase()))
              ).sort((a,b) => (a.displayOrder||0) - (b.displayOrder||0));

              if (catServices.length === 0) return null;

              return (
                <optgroup key={cat.slug} label={cat.title}>
                  {catServices.map(s => (
                    <option key={s._id || s.id} value={s.name}>{s.name}</option>
                  ))}
                </optgroup>
              );
            })}
            <option value="Not sure">Not sure / Need assessment</option>
          </select>
        </div>
        
        {isMiniDetailSelected && (
          <div className="bg-cream-alt rounded-xl p-4 border border-gray-200">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center mt-1">
                <input 
                  type="checkbox" 
                  className="sr-only"
                  checked={miniAck}
                  onChange={(e) => setMiniAck(e.target.checked)}
                  required
                />
                <div className={`w-5 h-5 border-2 rounded transition-colors flex items-center justify-center ${miniAck ? 'bg-gold border-gold' : 'border-gray-300 group-hover:border-gold'}`}>
                  {miniAck && <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                </div>
              </div>
              <span className="text-sm text-charcoal leading-[1.65]">
                I understand that a Mini Detail covers light maintenance cleaning. It does not include shampooing, stain treatment, embedded pet-hair removal or odor treatment. If my vehicle requires deeper cleaning, Clarity Auto SPA will discuss any service and price changes with me before work begins.
              </span>
            </label>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
          <textarea 
            rows="4"
            placeholder="Tell us more about the condition of the vehicle..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors resize-none"
            value={formData.message}
            onChange={e => setFormData({...formData, message: e.target.value})}
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Photos (Optional)</label>
          <p className="text-xs text-gray-500 mb-3">Upload up to 5 images (max 10MB each) showing the vehicle's condition.</p>
          
          <div className="flex flex-wrap gap-4 mb-4">
            {photos.map((photo, index) => (
              <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                <Image src={URL.createObjectURL(photo)} alt="preview" fill className="object-cover" />
                <button 
                  type="button" 
                  onClick={() => removePhoto(index)}
                  className="absolute top-1 right-1 bg-black/50 text-cream rounded-full p-1 hover:bg-black/70 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {photos.length < 5 && (
              <label className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-gold hover:bg-gold/5 transition-colors text-gray-400 hover:text-gold">
                <Upload className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-semibold uppercase">Upload</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  className="hidden" 
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>
        </div>

        <button 
          type="submit" 
          disabled={status === "loading" || (isMiniDetailSelected && !miniAck)}
          className="w-full bg-gold text-charcoal py-4 rounded-xl font-semibold uppercase tracking-widest hover:bg-gold-hover hover:text-charcoal transition-all shadow-lg flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {status === "loading" ? (
            <span className="animate-pulse">Submitting...</span>
          ) : (
            "Request Assessment"
          )}
        </button>
      </form>
    </div>
  );
}
