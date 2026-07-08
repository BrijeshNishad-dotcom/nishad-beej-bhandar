'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Check, RefreshCw, Sparkles } from 'lucide-react';

type Category = {
  id: number;
  name: string;
  slug: string;
  icon?: string | null;
  createdAt: Date;
};

type CategoriesClientProps = {
  initialCategories: Category[];
};

export default function CategoriesClient({ initialCategories }: CategoriesClientProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  // Form fields
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🌱');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openAddForm = () => {
    setEditingCategory(null);
    setName('');
    setIcon('🌱');
    setIsFormOpen(true);
  };

  const openEditForm = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setIcon(cat.icon || '🌱');
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      alert('कृपया श्रेणी का नाम भरें।');
      return;
    }

    setIsSubmitting(true);
    const payload = { name, icon };

    try {
      let res;
      if (editingCategory) {
        res = await fetch(`/api/categories/${editingCategory.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (data.success) {
        if (editingCategory) {
          setCategories((prev) =>
            prev.map((c) => (c.id === editingCategory.id ? data.category : c))
          );
        } else {
          setCategories((prev) => [data.category, ...prev]);
        }
        setIsFormOpen(false);
        setEditingCategory(null);
      } else {
        alert(data.error || 'सहेजने में विफलता।');
      }
    } catch (err) {
      console.error(err);
      alert('सहेजते समय समस्या आई।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (
      !confirm(
        'चेतावनी: इस श्रेणी को हटाने से इससे जुड़े सभी उत्पाद भी हटा दिए जाएंगे! क्या आप वास्तव में हटाना चाहते हैं?'
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert('श्रेणी हटाने में विफलता।');
      }
    } catch (err) {
      console.error(err);
      alert('हटाते समय त्रुटि।');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-agri-dark">
            श्रेणी प्रबंधन (Category Management)
          </h1>
          <p className="font-sans text-sm text-gray-500 mt-1">
            फसलों और स्टोर उत्पादों के लिए श्रेणियां जोड़ें, संपादित करें या हटाएं
          </p>
        </div>

        <button
          onClick={openAddForm}
          className="bg-agri-green-800 hover:bg-agri-green-900 text-white font-sans font-bold py-2.5 px-4 rounded-xl text-sm flex items-center space-x-1.5 cursor-pointer shadow-sm shrink-0"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>श्रेणी जोड़ें (+ Add Category)</span>
        </button>
      </div>

      {/* Categories Grid list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div 
            key={cat.id}
            className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className="text-4xl bg-gray-50 p-2.5 rounded-xl border border-gray-100 flex items-center justify-center shrink-0">
                {cat.icon || '🌱'}
              </div>
              <div>
                <span className="font-display font-extrabold text-base text-agri-dark block">
                  {cat.name}
                </span>
                <span className="font-sans text-xs text-gray-400 block mt-0.5">
                  Slug: {cat.slug}
                </span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => openEditForm(cat)}
                className="bg-gray-100 hover:bg-gray-200 text-agri-dark p-2 rounded-lg transition-colors cursor-pointer"
                title="Edit Category"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDeleteCategory(cat.id)}
                className="border border-red-100 hover:bg-red-50 text-red-600 p-2 rounded-lg transition-colors cursor-pointer"
                title="Delete Category"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Category Dialog Modal */}
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
                {editingCategory ? 'श्रेणी संपादित करें' : 'नई श्रेणी जोड़ें'}
              </span>
            </h3>
            <p className="font-sans text-xs text-gray-400 mb-6">
              श्रेणी का नाम और प्रतीक (emoji) चुनें।
            </p>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">श्रेणी का नाम (Category Name) *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="जैसे: Vegetable Seeds, Millet Seeds"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">श्रेणी आइकन (Emoji Icon)</label>
                <input
                  type="text"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  placeholder="जैसे: 🥬, 🌾, 🌽, 💧, 🐛"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                />
              </div>

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

    </div>
  );
}
