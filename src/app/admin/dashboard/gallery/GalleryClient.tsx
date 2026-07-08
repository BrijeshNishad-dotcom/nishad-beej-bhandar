'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
  Plus, Trash2, X, Upload, Check, 
  RefreshCw, Sparkles, Calendar, Edit2, AlertCircle 
} from 'lucide-react';

type Banner = {
  id: number;
  imageUrl: string;
  title: string;
  subtitle?: string | null;
  link?: string | null;
  order: number;
};

type GalleryItem = {
  id: number;
  imageUrl: string;
  title: string;
  description?: string | null;
  createdAt: Date;
};

type GalleryClientProps = {
  initialBanners: Banner[];
  initialGallery: GalleryItem[];
};

export default function GalleryClient({ initialBanners, initialGallery }: GalleryClientProps) {
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [gallery, setGallery] = useState<GalleryItem[]>(initialGallery);
  
  // Tab states
  const [activeSection, setActiveSection] = useState<'banners' | 'gallery'>('banners');

  // Add Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Add Form fields
  const [imageUrl, setImageUrl] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [link, setLink] = useState('');
  const [order, setOrder] = useState('0');
  const [description, setDescription] = useState('');

  // Edit Form states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [isEditUploading, setIsEditUploading] = useState(false);

  // Toast Notification states
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const openAddForm = () => {
    setImageUrl('');
    setTitle('');
    setSubtitle('');
    setLink('');
    setOrder('0');
    setDescription('');
    setIsFormOpen(true);
  };

  const openEditModal = (item: GalleryItem) => {
    setEditingItem(item);
    setEditTitle(item.title);
    setEditImageUrl(item.imageUrl);
    setEditDescription(item.description || '');
    setIsEditModalOpen(true);
  };

  // Image validation utility
  const validateImageFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showToast('अमान्य फ़ाइल प्रकार। केवल JPG, JPEG, PNG, और WEBP चित्र स्वीकार्य हैं।', 'error');
      return false;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB limit
    if (file.size > maxSize) {
      showToast('फ़ाइल का आकार 5MB से कम होना चाहिए।', 'error');
      return false;
    }

    return true;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateImageFile(file)) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setImageUrl(data.url);
        showToast('चित्र अपलोड हो गया।', 'success');
      } else {
        showToast(data.error || 'अपलोड विफल रहा।', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('अपलोड करते समय त्रुटि आई।', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateImageFile(file)) return;

    setIsEditUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setEditImageUrl(data.url);
        showToast('नया चित्र सफलतापूर्वक अपलोड हो गया।', 'success');
      } else {
        showToast(data.error || 'अपलोड विफल रहा।', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('अपलोड करते समय त्रुटि आई।', 'error');
    } finally {
      setIsEditUploading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl || !title) {
      showToast('चित्र और शीर्षक दोनों आवश्यक हैं।', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      if (activeSection === 'banners') {
        const res = await fetch('/api/banners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl, title, subtitle, link, order }),
        });
        const data = await res.json();
        if (data.success) {
          setBanners((prev) => [data.banner, ...prev]);
          setIsFormOpen(false);
          showToast('बैनर सफलतापूर्वक जोड़ा गया।', 'success');
        } else {
          showToast(data.error || 'बैनर सहेजने में विफल।', 'error');
        }
      } else {
        // gallery
        const res = await fetch('/api/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl, title, description }),
        });
        const data = await res.json();
        if (data.success) {
          setGallery((prev) => [data.image, ...prev]);
          setIsFormOpen(false);
          showToast('फोटो सफलतापूर्वक जोड़ा गया।', 'success');
        } else {
          showToast(data.error || 'चित्र सहेजने में विफल।', 'error');
        }
      }
    } catch (err) {
      console.error(err);
      showToast('सहेजते समय समस्या आई।', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    if (!editImageUrl || !editTitle) {
      showToast('शीर्षक और चित्र दोनों आवश्यक हैं।', 'error');
      return;
    }

    setIsEditSubmitting(true);

    try {
      const res = await fetch(`/api/gallery/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          imageUrl: editImageUrl,
          description: editDescription,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setGallery((prev) =>
          prev.map((g) => (g.id === editingItem.id ? data.image : g))
        );
        setIsEditModalOpen(false);
        showToast('Photo updated successfully.', 'success');
      } else {
        showToast(data.error || 'अपडेट करने में विफल।', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('सहेजते समय समस्या आई।', 'error');
    } finally {
      setIsEditSubmitting(false);
    }
  };

  const handleDeleteBanner = async (id: number) => {
    if (!confirm('क्या आप सचमुच इस बैनर को हटाना चाहते हैं?')) return;
    try {
      const res = await fetch(`/api/banners/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBanners((prev) => prev.filter((b) => b.id !== id));
        showToast('बैनर हटा दिया गया।', 'success');
      } else {
        showToast('हटाने में विफल।', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('त्रुटि आई।', 'error');
    }
  };

  const handleDeleteGalleryItem = async (id: number) => {
    if (!confirm('क्या आप सचमुच इस चित्र को हटाना चाहते हैं?')) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setGallery((prev) => prev.filter((g) => g.id !== id));
        showToast('फोटो हटा दिया गया।', 'success');
      } else {
        showToast('हटाने में विफल।', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('त्रुटि आई।', 'error');
    }
  };

  return (
    <div className="space-y-6 relative">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 z-50 flex items-center space-x-2 border px-4 py-3.5 rounded-xl shadow-lg transition-all duration-300 transform translate-y-0 font-sans text-sm font-semibold ${
          toastType === 'success'
            ? 'bg-green-50 text-green-800 border-green-200'
            : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          {toastType === 'success' ? <Check className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-agri-dark">
            बैनर एवं फोटो गैलरी (Gallery & Banners)
          </h1>
          <p className="font-sans text-sm text-gray-500 mt-1">
            वेबसाइट के मुख्य होम बैनर और गैलरी फोटो को प्रबंधित करें
          </p>
        </div>

        <button
          onClick={openAddForm}
          className="bg-agri-green-800 hover:bg-agri-green-900 text-white font-sans font-bold py-2.5 px-4 rounded-xl text-sm flex items-center space-x-1.5 cursor-pointer shadow-sm shrink-0"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>{activeSection === 'banners' ? 'नया बैनर जोड़ें' : 'नया फोटो जोड़ें'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-150 font-display text-sm font-bold pb-2 space-x-4">
        <button
          onClick={() => setActiveSection('banners')}
          className={`px-4 py-2 border-b-4 transition-all cursor-pointer ${
            activeSection === 'banners'
              ? 'border-agri-green-800 text-agri-green-800'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          होम बैनर (Hero Banners)
        </button>
        <button
          onClick={() => setActiveSection('gallery')}
          className={`px-4 py-2 border-b-4 transition-all cursor-pointer ${
            activeSection === 'gallery'
              ? 'border-agri-green-800 text-agri-green-800'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          फोटो गैलरी (Photo Gallery)
        </button>
      </div>

      {/* 1. Banners Section */}
      {activeSection === 'banners' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((banner) => (
            <div 
              key={banner.id}
              className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
            >
              <div className="relative h-48 w-full bg-gray-50">
                <Image
                  src={banner.imageUrl}
                  alt={banner.title}
                  fill
                  className="object-cover object-center"
                />
              </div>
              
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-extrabold text-base text-agri-dark leading-snug">
                    {banner.title}
                  </h3>
                  {banner.subtitle && (
                    <p className="font-sans text-xs text-gray-400 mt-1.5 leading-relaxed">
                      {banner.subtitle}
                    </p>
                  )}
                  {banner.link && (
                    <span className="inline-block bg-gray-50 text-gray-500 font-mono text-[10px] px-2 py-0.5 rounded border border-gray-100 mt-2">
                      Link: {banner.link}
                    </span>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between font-sans text-xs">
                  <span className="bg-agri-green-50 text-agri-green-800 font-bold px-2 py-0.5 rounded">
                    क्रम (Order): {banner.order}
                  </span>
                  
                  <button
                    onClick={() => handleDeleteBanner(banner.id)}
                    className="border border-red-100 hover:bg-red-50 text-red-600 px-2.5 py-1.5 rounded-lg transition-colors flex items-center space-x-1 font-bold cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>हटाएं</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. Gallery Section */}
      {activeSection === 'gallery' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {gallery.map((item) => (
            <div 
              key={item.id}
              className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between group"
            >
              <div className="relative h-40 w-full bg-gray-50">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover object-center"
                />
              </div>
              <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-bold text-xs sm:text-sm text-agri-dark line-clamp-2 min-h-[36px]">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="font-sans text-[10px] text-gray-400 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
                <div className="mt-3 pt-2.5 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 font-sans flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    <span>{new Date(item.createdAt).toLocaleDateString('hi-IN')}</span>
                  </span>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => openEditModal(item)}
                      className="text-agri-green-800 hover:text-agri-green-900 p-1.5 rounded-lg hover:bg-agri-green-50 transition-colors cursor-pointer"
                      title="Edit Photo"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteGalleryItem(item.id)}
                      className="text-red-600 hover:text-red-800 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete Photo"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Form Dialog Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl relative">
            
            {/* Close */}
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 p-1.5 rounded-lg cursor-pointer"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Title */}
            <h3 className="font-display text-lg font-bold text-agri-dark mb-1 flex items-center">
              <Sparkles className="h-5 w-5 text-agri-yellow-500 mr-2" />
              <span>
                {activeSection === 'banners' ? 'नया होम बैनर जोड़ें' : 'नया फोटो गैलरी आइटम जोड़ें'}
              </span>
            </h3>
            <p className="font-sans text-xs text-gray-400 mb-6">
              कृपया सभी आवश्यक विवरण सही से भरें।
            </p>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              {/* Row 1: Title */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">शीर्षक (Title) *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={activeSection === 'banners' ? 'जैसे: धान के उन्नत बीज' : 'जैसे: रबी सरसों की हरी फसल'}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                />
              </div>

              {/* Row 2: Subtitle (Banner only) */}
              {activeSection === 'banners' && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">उपशीर्षक (Subtitle)</label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="जैसे: उचित दामों पर उपलब्ध"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                  />
                </div>
              )}

              {/* Row 3: Description (Gallery only) */}
              {activeSection === 'gallery' && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">विवरण (Description)</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="चित्र के बारे में कुछ शब्द..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800 h-20 resize-none"
                  />
                </div>
              )}

              {/* Row 4: Image URL & Upload */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">चित्र अपलोड या URL *</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="URL या फ़ाइल चुनें..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                  />
                  
                  <label className="bg-gray-150 hover:bg-gray-200 text-agri-dark font-semibold px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer shrink-0 flex items-center justify-center">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    {isUploading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                  </label>
                </div>
              </div>

              {/* Row 5: Link & Order (Banner only) */}
              {activeSection === 'banners' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">लिंक URL (Link)</label>
                    <input
                      type="text"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      placeholder="जैसे: /products"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">प्रदर्शन क्रम (Order)</label>
                    <input
                      type="number"
                      value={order}
                      onChange={(e) => setOrder(e.target.value)}
                      placeholder="जैसे: 1, 2"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                    />
                  </div>
                </div>
              )}

              {/* Preview image */}
              {imageUrl && (
                <div className="relative h-28 w-full rounded-xl border border-gray-100 overflow-hidden bg-gray-50 mt-2">
                  <Image
                    src={imageUrl}
                    alt="Preview"
                    fill
                    className="object-cover object-center"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100 font-sans text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-agri-dark px-4 py-2 rounded-lg cursor-pointer"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-agri-green-800 hover:bg-agri-green-900 text-white px-5 py-2.5 rounded-lg flex items-center space-x-1 cursor-pointer disabled:bg-gray-400"
                >
                  {isSubmitting ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  <span>सहेजें (Save)</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Edit Form Dialog Modal */}
      {isEditModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl relative">
            
            {/* Close */}
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 p-1.5 rounded-lg cursor-pointer"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Title */}
            <h3 className="font-display text-lg font-bold text-agri-dark mb-1 flex items-center">
              <Edit2 className="h-5 w-5 text-agri-green-800 mr-2" />
              <span>गैलरी फोटो संपादित करें (Edit Photo)</span>
            </h3>
            <p className="font-sans text-xs text-gray-400 mb-6">
              गैलरी फोटो के शीर्षक, विवरण या चित्र को संपादित करें।
            </p>

            {/* Form */}
            <form onSubmit={handleEditSubmit} className="space-y-4">
              
              {/* Row 1: Title */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">शीर्षक (Title) *</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="शीर्षक दर्ज करें..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                />
              </div>

              {/* Row 2: Description */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">विवरण (Description)</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="चित्र का नया विवरण..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800 h-20 resize-none"
                />
              </div>

              {/* Row 3: Image URL & Upload */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">नया चित्र अपलोड या URL</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    required
                    value={editImageUrl}
                    onChange={(e) => setEditImageUrl(e.target.value)}
                    placeholder="URL या फ़ाइल चुनें..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                  />
                  
                  <label className="bg-gray-150 hover:bg-gray-200 text-agri-dark font-semibold px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer shrink-0 flex items-center justify-center">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleEditImageUpload}
                      className="hidden"
                    />
                    {isEditUploading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                  </label>
                </div>
              </div>

              {/* Preview image */}
              {editImageUrl && (
                <div className="space-y-1.5">
                  <span className="block text-[10px] font-bold text-gray-400">चित्र पूर्वावलोकन (Preview):</span>
                  <div className="relative h-32 w-full rounded-xl border border-gray-100 overflow-hidden bg-gray-50">
                    <Image
                      src={editImageUrl}
                      alt="Edit Preview"
                      fill
                      className="object-cover object-center"
                    />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100 font-sans text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-agri-dark px-4 py-2 rounded-lg cursor-pointer"
                >
                  रद्द करें (Cancel)
                </button>
                <button
                  type="submit"
                  disabled={isEditSubmitting || isEditUploading}
                  className="bg-agri-green-800 hover:bg-agri-green-900 text-white px-5 py-2.5 rounded-lg flex items-center space-x-1 cursor-pointer disabled:bg-gray-400"
                >
                  {isEditSubmitting ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  <span>सहेजें (Save Changes)</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
