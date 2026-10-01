"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Plus, Trash2, Edit2, LayoutList } from "lucide-react";
import ConfirmModal from "../ui/ConfirmModal";

export default function ServiceCategoriesTab() {
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null, type: null, customText: null });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    enabled: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/categories`, { cache: 'no-store' });
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingId(category._id);
      setFormData({
        title: category.title,
        description: category.description || "",
        enabled: category.enabled
      });
    } else {
      setEditingId(null);
      setFormData({ title: "", description: "", enabled: true });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const token = Cookies.get("admin_token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete category");
      }

      setCategories(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setIsSubmitting(true);
    try {
      const token = Cookies.get("admin_token");
      const url = editingId 
        ? `${process.env.NEXT_PUBLIC_API_URL}/services/categories/${editingId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/services/categories`;
      
      const res = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save category");
      }
      
      setIsModalOpen(false);
      fetchCategories();
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
          <LayoutList className="w-3 h-3" /> Management
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Home Page Service Categories</h1>
            <p className="text-sm text-gray-500">Manage the service categories and descriptions shown on your home page and services page.</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark"
          >
            <Plus className="w-4 h-4" /> Add Category
          </button>
        </div>
      </div>

      {error && <div className="text-red-600 mb-4 font-bold">{error}</div>}

      {loading ? (
        <div className="text-gray-500 font-bold uppercase tracking-widest">Loading categories...</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
              <LayoutList className="w-4 h-4 text-primary" /> Active Categories
            </div>
            <div className="text-[10px] font-bold text-gray-700 bg-gray-200 px-2 py-1 rounded-full uppercase tracking-widest">
              {categories.length} categories
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {categories.map((cat) => (
              <div key={cat._id} className={`p-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${!cat.enabled ? 'opacity-60' : ''}`}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center shrink-0 mt-1">
                    <LayoutList className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      {cat.title} 
                      {!cat.enabled && <span className="bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded-sm uppercase tracking-widest">Disabled</span>}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 max-w-2xl mt-1">{cat.description || "No description provided."}</p>
                    <p className="text-xs text-gray-400 mt-1 font-mono">Slug: {cat.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenModal(cat)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-md hover:bg-gray-200"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => setConfirmModal({ isOpen: true, id: cat._id, type: "Delete Category", customText: "Are you sure you want to delete this category? This will not delete the services under it, but they may become orphaned." })}
                    className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 text-xs font-medium rounded-md hover:bg-red-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </div>
            ))}
            {categories.length === 0 && (
              <div className="p-8 text-center text-gray-500 font-medium">No categories found.</div>
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
                {editingId ? "Edit Category" : "Add new category"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Category Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="e.g. Full Detail Services" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Description</label>
                <textarea rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none" placeholder="Category description to show on the website..." />
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="enabled"
                  checked={formData.enabled} 
                  onChange={e => setFormData({...formData, enabled: e.target.checked})} 
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="enabled" className="text-sm font-medium text-gray-900">
                  Visible on website
                </label>
              </div>

              <div className="pt-4 flex gap-3 justify-end mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg font-medium text-sm bg-gray-100 text-gray-700 hover:bg-gray-200">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm bg-primary text-white hover:bg-primary-dark disabled:opacity-50">
                  {isSubmitting ? "Saving..." : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, id: null, type: null, customText: null })}
        onConfirm={() => handleDelete(confirmModal.id)}
        title={confirmModal.type}
        message={confirmModal.customText}
      />
    </div>
  );
}
