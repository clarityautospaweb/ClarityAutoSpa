"use client";

import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { Image as ImageIcon, Trash2, Upload, Edit2, Plus } from "lucide-react";
import ConfirmModal from "../ui/ConfirmModal";

export default function GalleryTab() {
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null, type: null, customText: null });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serviceCategories, setServiceCategories] = useState(['Detailing', 'Exterior Wash', 'Interior Detailing']);
  const [selectedFile, setSelectedFile] = useState(null);
  const [beforeFile, setBeforeFile] = useState(null);
  const [afterFile, setAfterFile] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "Detailing",
    imageType: "Plain Image",
    showOnLandingPage: false
  });

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    category: "Detailing",
    showOnLandingPage: false
  });
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchImages();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
      if (res.ok) {
        const data = await res.json();
        if (data.serviceCategories?.length) setServiceCategories(data.serviceCategories);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchImages = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery?t=${Date.now()}`, {
        cache: 'no-store'
      });
      if (res.ok) setImages(await res.json());
    } catch (error) {
      console.error("Failed to fetch gallery", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setIsModalOpen(true);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (formData.imageType === 'Plain Image' && !selectedFile) {
      return alert('Please select an image.');
    }
    if (formData.imageType === 'Before/After' && (!beforeFile || !afterFile)) {
      return alert('Please select both before and after images.');
    }

    setUploading(true);
    try {
      const token = Cookies.get("admin_token");
      const data = new FormData();
      if (formData.imageType === 'Plain Image') {
        data.append("image", selectedFile);
      } else {
        data.append("beforeImage", beforeFile);
        data.append("afterImage", afterFile);
      }
      data.append("title", formData.title);
      data.append("category", formData.category);
      data.append("imageType", formData.imageType);
      data.append("showOnLandingPage", formData.showOnLandingPage);
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        setSelectedFile(null);
        setBeforeFile(null);
        setAfterFile(null);
        setFormData({ title: "", category: serviceCategories[0] || "Detailing", imageType: "Plain Image", showOnLandingPage: false });
        fetchImages();
      } else {
        const errData = await res.json();
        alert("Failed to upload image: " + (errData.error || "Unknown"));
      }
    } catch (error) {
      alert("Network error");
    } finally {
      setUploading(false);
    }
  };

  const handleOpenEditModal = (img) => {
    setEditingImage(img);
    setEditFormData({
      title: img.title || "",
      category: img.category || "Detailing",
      showOnLandingPage: img.showOnLandingPage || false,
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsEditSubmitting(true);
    try {
      const token = Cookies.get("admin_token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery/${editingImage._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editFormData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update image");
      }

      setIsEditModalOpen(false);
      setEditingImage(null);
      fetchImages();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsEditSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    
    // Optimistic UI: remove immediately
    setImages(prev => prev.filter(img => img._id !== id));
    try {
      const token = Cookies.get("admin_token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to delete");
      fetchImages();
    } catch (error) {
      alert("Failed to delete");
      fetchImages(); // Re-fetch to restore if delete failed
    }
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 text-primary font-bold text-[10px] tracking-widest uppercase mb-2">
          <ImageIcon className="w-3 h-3" /> Workspace
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gallery</h1>
            <p className="text-sm text-gray-500">Update the photos showcased to potential customers.</p>
          </div>
          <div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark"
            >
              <Plus className="w-4 h-4" /> Add image
            </button>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
            <ImageIcon className="w-4 h-4 text-primary" /> Gallery images
          </div>
          <div className="text-xs text-gray-500 font-medium">{images.length} images</div>
        </div>
        
        {loading ? (
          <div className="p-8 text-center font-bold text-gray-500">Loading gallery...</div>
        ) : (
          <div className="p-4 space-y-8 bg-gray-50">
            {serviceCategories.map(category => {
              const catImages = images.filter(img => img.category === category);
              if (catImages.length === 0) return null;
              return (
                <div key={category}>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {catImages.map(img => (
                      <div key={img._id} className="group relative bg-gray-200 rounded-lg overflow-hidden border border-gray-200">
                        {/* Image Preview */}
                        <div className="aspect-square">
                          {img.imageType === 'Plain Image' ? (
                            <img src={img.imageUrl} alt="Gallery" className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full">
                              <img src={img.beforeImageUrl} alt="Before" className="w-1/2 h-full object-cover border-r border-cream/50" />
                              <img src={img.afterImageUrl} alt="After" className="w-1/2 h-full object-cover" />
                            </div>
                          )}
                        </div>

                        {/* Type Badge */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          <span className="bg-black/70 text-white text-[10px] px-2 py-1 rounded-sm uppercase tracking-widest font-bold">
                            {img.imageType}
                          </span>
                        </div>

                        {/* Hover Overlay with Edit + Delete */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          <button 
                            onClick={() => handleOpenEditModal(img)} 
                            className="bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 shadow-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(img._id)} 
                            className="bg-white text-red-500 p-2 rounded-full hover:bg-red-50 shadow-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Title Bar */}
                        {img.title && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2">
                            <p className="text-white text-xs font-medium truncate">{img.title}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            {images.length === 0 && (
              <div className="p-8 text-center text-gray-500">No images uploaded yet.</div>
            )}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Upload Gallery Image</h3>
              <button onClick={() => { setIsModalOpen(false); setSelectedFile(null); setBeforeFile(null); setAfterFile(null); }} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            {selectedFile && (
              <div className="mb-4 flex justify-center">
                <img 
                  src={URL.createObjectURL(selectedFile)} 
                  alt="Preview" 
                  className="w-full h-48 object-cover rounded-lg border border-gray-200"
                />
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Title (Optional)</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  className="w-full px-3 py-2 border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  placeholder="e.g. Jeep Grand Cherokee Before/After"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Category</label>
                <select 
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value})} 
                  className="w-full px-3 py-2 border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                >
                  {serviceCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Image Type</label>
                <select 
                  value={formData.imageType} 
                  onChange={e => {
                    setFormData({...formData, imageType: e.target.value});
                    setSelectedFile(null);
                    setBeforeFile(null);
                    setAfterFile(null);
                  }} 
                  className="w-full px-3 py-2 border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none mb-4"
                >
                  <option value="Plain Image">Plain Image</option>
                  <option value="Before/After">Before/After</option>
                </select>
              </div>

                            

                            <div className="flex items-center gap-2 mb-4">
                <input 
                  type="checkbox" 
                  id="showOnLandingPage"
                  checked={formData.showOnLandingPage} 
                  onChange={e => setFormData({...formData, showOnLandingPage: e.target.checked})} 
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="showOnLandingPage" className="text-sm font-medium text-gray-900">
                  Show on Landing Page
                </label>
              </div>
              {formData.imageType === 'Plain Image' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">Image</label>
                  <input type="file" accept="image/*" onChange={e => setSelectedFile(e.target.files[0])} className="w-full px-3 py-2 border rounded-lg" />
                  {selectedFile && (
                    <div className="relative w-fit mt-2 group">
                      <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="h-32 object-cover rounded-lg" />
                      <button type="button" onClick={() => setSelectedFile(null)} className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full p-1 shadow hover:bg-red-50 border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Before Image</label>
                    <input type="file" accept="image/*" onChange={e => setBeforeFile(e.target.files[0])} className="w-full px-3 py-2 border rounded-lg" />
                    {beforeFile && (
                      <div className="relative w-fit mt-2 group">
                        <img src={URL.createObjectURL(beforeFile)} alt="Before" className="h-32 object-cover rounded-lg" />
                        <button type="button" onClick={() => setBeforeFile(null)} className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full p-1 shadow hover:bg-red-50 border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">After Image</label>
                    <input type="file" accept="image/*" onChange={e => setAfterFile(e.target.files[0])} className="w-full px-3 py-2 border rounded-lg" />
                    {afterFile && (
                      <div className="relative w-fit mt-2 group">
                        <img src={URL.createObjectURL(afterFile)} alt="After" className="h-32 object-cover rounded-lg" />
                        <button type="button" onClick={() => setAfterFile(null)} className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full p-1 shadow hover:bg-red-50 border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="pt-4 flex gap-3 justify-end">
                <button type="button" onClick={() => { setIsModalOpen(false); setSelectedFile(null); setBeforeFile(null); setAfterFile(null); }} className="px-4 py-2 bg-gray-100 rounded-lg font-medium text-sm text-gray-700 hover:bg-gray-200">Cancel</button>
                <button type="submit" disabled={uploading} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium text-sm disabled:opacity-50 hover:bg-primary-dark">
                  {uploading ? "Uploading..." : <><Upload className="w-4 h-4" /> Upload</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editingImage && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Edit Gallery Image</h3>
              <button onClick={() => { setIsEditModalOpen(false); setEditingImage(null); }} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            {/* Current image preview */}
            <div className="mb-4 rounded-lg overflow-hidden border border-gray-200">
              {editingImage.imageType === 'Plain Image' ? (
                <img src={editingImage.imageUrl} alt="Current" className="w-full h-40 object-cover" />
              ) : (
                <div className="flex h-40 w-full">
                  <div className="w-1/2 relative">
                    <img src={editingImage.beforeImageUrl} alt="Before" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded uppercase font-bold">Before</span>
                  </div>
                  <div className="w-1/2 relative">
                    <img src={editingImage.afterImageUrl} alt="After" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded uppercase font-bold">After</span>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Title</label>
                <input 
                  type="text" 
                  value={editFormData.title} 
                  onChange={e => setEditFormData({...editFormData, title: e.target.value})} 
                  className="w-full px-3 py-2 border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  placeholder="Image title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Category</label>
                <select 
                  value={editFormData.category} 
                  onChange={e => setEditFormData({...editFormData, category: e.target.value})} 
                  className="w-full px-3 py-2 border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                >
                  {serviceCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <input 
                  type="checkbox" 
                  id="editShowOnLandingPage"
                  checked={editFormData.showOnLandingPage} 
                  onChange={e => setEditFormData({...editFormData, showOnLandingPage: e.target.checked})} 
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="editShowOnLandingPage" className="text-sm font-medium text-gray-900">
                  Show on Landing Page
                </label>
              </div>
              <div className="pt-4 flex gap-3 justify-end">
                <button type="button" onClick={() => { setIsEditModalOpen(false); setEditingImage(null); }} className="px-4 py-2 bg-gray-100 rounded-lg font-medium text-sm text-gray-700 hover:bg-gray-200">Cancel</button>
                <button type="submit" disabled={isEditSubmitting} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium text-sm disabled:opacity-50 hover:bg-primary-dark">
                  {isEditSubmitting ? "Saving..." : <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Save Changes</>}
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
