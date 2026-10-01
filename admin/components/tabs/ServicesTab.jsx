"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Plus, Edit2, Trash2, Image as ImageIcon, CircleDollarSign, Car, GripVertical } from "lucide-react";
import ConfirmModal from "../ui/ConfirmModal";

export default function ServicesTab() {
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null, type: null, customText: null });
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [carCategories, setCarCategories] = useState(['All Vehicles', 'Sedan', 'SUV', 'XLSUV']);
  const [serviceCategories, setServiceCategories] = useState(['Detailing', 'Exterior Wash', 'Interior Detailing']);


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    carType: "All Vehicles",
    displayOrder: 0
  });
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
      if (res.ok) {
        const data = await res.json();
        if (data.carCategories?.length) setCarCategories(data.carCategories);
        if (data.serviceCategories?.length) setServiceCategories(data.serviceCategories);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services?t=${Date.now()}`, {
        cache: 'no-store'
      });
      if (!res.ok) throw new Error("Failed to fetch services");
      const data = await res.json();
      setServices(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (service = null) => {
    if (service) {
      setEditingId(service._id);
      setFormData({
        name: service.name,
        description: service.description,
        price: service.price,
        category: service.category,
        time: service.time || "",
        acuityLink: service.acuityLink || "",
        carType: service.carType || "All Vehicles",
        imageUrl: service.imageUrl || "",
        displayOrder: service.displayOrder || 0
      });
    } else {
      setEditingId(null);
      setFormData({ name: "", description: "", price: "", time: "", acuityLink: "", category: serviceCategories[0] || "Detailing", carType: "All Vehicles", imageUrl: "", displayOrder: 0 });
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    
    
    try {
      const token = Cookies.get("admin_token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to delete service");
      
      // Update local state instantly and fetch fresh data
      setServices(prev => prev.filter(service => service._id !== id));
      fetchServices();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = Cookies.get("admin_token");

    try {
      const url = editingId 
        ? `${process.env.NEXT_PUBLIC_API_URL}/services/${editingId}` 
        : `${process.env.NEXT_PUBLIC_API_URL}/services`;
      
      const res = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save service");
      }

      const savedService = await res.json();

      // Handle Image Upload if a file was selected
      if (imageFile) {
        const imgData = new FormData();
        imgData.append("image", imageFile);

        const imgRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/${savedService._id}/image`, {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` },
          body: imgData
        });

        if (!imgRes.ok) {
          throw new Error("Service saved, but failed to upload image.");
        }
      }

      setIsModalOpen(false);
      fetchServices();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 text-primary font-bold text-[10px] tracking-widest uppercase mb-2">
          <CircleDollarSign className="w-3 h-3" /> Workspace
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Services & Pricing</h1>
            <p className="text-sm text-gray-500">Manage your service menu and pricing.</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark"
          >
            <Plus className="w-4 h-4" /> Add New Service
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input type="text" placeholder="Search services & pricing..." className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" />
        </div>
      </div>

      {error && <div className="text-red-600 mb-4 font-bold">{error}</div>}
      
      {loading ? (
        <div className="text-gray-500 font-bold uppercase tracking-widest">Loading services...</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
            <div className="text-sm font-bold text-gray-900">
              Active services
            </div>
            <div className="text-[10px] font-bold text-gray-700 bg-gray-200 px-2 py-1 rounded-full uppercase tracking-widest">{services.length} services</div>
          </div>
          <div className="divide-y divide-gray-100">
            {services.map((service) => (
              <div key={service._id} className="p-4 flex items-center hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                  {service.imageUrl ? (
                    <img src={service.imageUrl} alt={service.name} className="w-full h-full object-cover" />
                  ) : (
                    <Car className="w-6 h-6 text-primary" />
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-bold text-gray-900">{service.name}</div>
                    {service.carType && service.carType !== 'All Vehicles' && (
                      <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-[10px] uppercase font-bold rounded-sm tracking-wider">
                        {service.carType}
                      </span>
                    )}
                    {service.time && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] uppercase font-bold rounded-sm tracking-wider">
                        {service.time}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{service.description}</div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-primary font-bold text-lg">${service.price}</div>
                  <button onClick={() => handleOpenModal(service)} className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200">
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button onClick={() => setConfirmModal({ isOpen: true, id: service._id, type: "Delete Service", customText: "Are you sure you want to delete this service?" })} className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 text-sm font-medium rounded-md hover:bg-red-100">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                  <button className="text-gray-400 hover:text-gray-600 cursor-grab">
                    <GripVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
            {services.length === 0 && (
              <div className="p-8 text-center text-gray-500 font-medium">No services found. Add one to get started.</div>
            )}
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingId ? "Edit Service" : "Add new service"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Service name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="e.g. Premium Hand Wash" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Price</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">$</div>
                  <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="0" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Estimated Time</label>
                <input type="text" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="e.g. 2 hours 45 minutes" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Acuity Booking Link</label>
                <input type="url" value={formData.acuityLink} onChange={e => setFormData({...formData, acuityLink: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="https://clarityautospa.as.me/..." />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Description</label>
                <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none" placeholder="What's included in this package?" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Service Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                  {serviceCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Car Type</label>
                <select value={formData.carType} onChange={e => setFormData({...formData, carType: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                  {carCategories.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Service Image</label>
                <div 
                  className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-primary transition-colors cursor-pointer"
                  onClick={() => document.getElementById('service-image-upload').click()}
                >
                  <div className="space-y-1 text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label htmlFor="service-image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                        <span>Upload a file</span>
                        <input 
                          id="service-image-upload" 
                          name="image" 
                          type="file" 
                          className="sr-only" 
                          accept="image/*" 
                          onChange={(e) => setImageFile(e.target.files[0])} 
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">
                      {imageFile ? imageFile.name : "PNG, JPG, GIF up to 10MB"}
                    </p>
                  </div>
                </div>
                                {(imageFile || formData.imageUrl) && (
                  <div className="mt-4 flex justify-center relative w-fit mx-auto group">
                    <img 
                      src={imageFile ? URL.createObjectURL(imageFile) : formData.imageUrl} 
                      alt="Preview" 
                      className="w-32 h-32 object-cover rounded-lg border border-gray-300" 
                    />
                    <button 
                      type="button" 
                      onClick={() => {
                        setImageFile(null);
                        setFormData({ ...formData, imageUrl: "", imageId: "" });
                      }}
                      className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full p-1.5 shadow-md hover:bg-red-50 border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-4 flex gap-3 justify-end mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg font-medium text-sm bg-gray-100 text-gray-700 hover:bg-gray-200">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm bg-primary text-white hover:bg-primary-dark disabled:opacity-50">
                  {isSubmitting ? "Saving..." : <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Save Service</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
          <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, id: null, type: null, customText: null })}
        onConfirm={() => {
          if (confirmModal.type === 'Delete Service Category') {
             handleDeleteServiceCat(confirmModal.id);
          } else {
             handleDelete(confirmModal.id); // for CategoriesTab it's handleDelete(cat)
          }
        }}
        title={confirmModal.type}
        message={confirmModal.customText}
      />
    </div>
  );
}
