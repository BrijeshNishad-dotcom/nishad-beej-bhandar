'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
  Plus, Search, Edit2, Trash2, X, Upload, 
  RefreshCw, Check, Sparkles 
} from 'lucide-react';

type Category = {
  id: number;
  name: string;
  nameEn?: string | null;
  slug: string;
};

type Product = {
  id: number;
  name: string;
  nameEn?: string | null;
  company: string;
  price: number;
  discountPrice?: number | null;
  stock: number;
  imageUrl?: string | null;
  status: string;
  categoryId: number;
  category: Category;
  type: 'seed' | 'fertilizer' | 'pesticide';
  // Seed fields
  variety?: string;
  varietyEn?: string | null;
  cropType?: string;
  description?: string;
  germination?: number | null;
  seedRate?: string | null;
  maturityDuration?: string | null;
  yield?: string | null;
  benefits?: string | null;
  usageInstructions?: string | null;
  dosage?: string | null;
  // Fertilizer
  weight?: string;
  // Pesticide
  targetDisease?: string;
  targetDiseaseEn?: string | null;
  pesticideType?: string | null;
  activeIngredient?: string | null;
  formulation?: string | null;
  targetCrop?: string | null;
  applicationMethod?: string | null;
  waitingPeriod?: string | null;
  toxicityClass?: string | null;
  safetyPrecautions?: string | null;
  packSize?: string | null;
  manufacturingCompany?: string | null;
  registrationNumber?: string | null;
  storageInstructions?: string | null;
};

type ProductsClientProps = {
  initialProducts: Product[];
  categories: Category[];
};

export default function ProductsClient({ initialProducts, categories }: ProductsClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'seed' | 'fertilizer' | 'pesticide'>('all');
  
  // Form States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productType, setProductType] = useState<'seed' | 'fertilizer' | 'pesticide'>('seed');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const getFilteredCategories = (type: 'seed' | 'fertilizer' | 'pesticide') => {
    return categories.filter((c) => {
      const slug = c.slug.toLowerCase();
      if (type === 'seed') {
        return slug.includes('seeds') || slug.includes('seed');
      }
      if (type === 'pesticide') {
        return slug.includes('pesticide') || slug.includes('insecticide') || slug.includes('fungicide') || slug.includes('herbicide');
      }
      if (type === 'fertilizer') {
        return !slug.includes('seeds') && !slug.includes('seed') && !slug.includes('pesticide') && !slug.includes('insecticide') && !slug.includes('fungicide') && !slug.includes('herbicide');
      }
      return true;
    });
  };

  // Form Fields
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [company, setCompany] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  
  // Seed specific fields
  const [variety, setVariety] = useState('');
  const [varietyEn, setVarietyEn] = useState('');
  const [cropType, setCropType] = useState('Kharif');
  const [germination, setGermination] = useState('');
  const [seedRate, setSeedRate] = useState('');
  const [maturityDuration, setMaturityDuration] = useState('');
  const [yieldVal, setYieldVal] = useState('');
  const [benefits, setBenefits] = useState('');
  const [usageInstructions, setUsageInstructions] = useState('');
  const [dosage, setDosage] = useState('');
  
  // Fertilizer specific fields
  const [weight, setWeight] = useState('');
  
  // Pesticide specific fields
  const [targetDisease, setTargetDisease] = useState('');
  const [targetDiseaseEn, setTargetDiseaseEn] = useState('');
  const [pesticideType, setPesticideType] = useState('Insecticide');
  const [activeIngredient, setActiveIngredient] = useState('');
  const [formulation, setFormulation] = useState('EC');
  const [targetCrop, setTargetCrop] = useState('');
  const [applicationMethod, setApplicationMethod] = useState('Foliar Spray');
  const [waitingPeriod, setWaitingPeriod] = useState('');
  const [toxicityClass, setToxicityClass] = useState('Green (Slightly Toxic)');
  const [safetyPrecautions, setSafetyPrecautions] = useState('');
  const [packSize, setPackSize] = useState('');
  const [manufacturingCompany, setManufacturingCompany] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [storageInstructions, setStorageInstructions] = useState('');

  const openAddForm = (type: 'seed' | 'fertilizer' | 'pesticide') => {
    setEditingProduct(null);
    setProductType(type);
    
    // Reset form values
    setName('');
    setNameEn('');
    setCompany('');
    const filteredCats = getFilteredCategories(type);
    setCategoryId(filteredCats[0]?.id.toString() || '');
    setPrice('');
    setDiscountPrice('');
    setStock('');
    setImageUrl('');
    setDescription('');
    setVariety('');
    setVarietyEn('');
    setCropType('Kharif');
    setGermination('');
    setSeedRate('');
    setMaturityDuration('');
    setYieldVal('');
    setBenefits('');
    setUsageInstructions('');
    setDosage('');
    setWeight('');
    setTargetDisease('');
    setTargetDiseaseEn('');
    setPesticideType('Insecticide');
    setActiveIngredient('');
    setFormulation('EC');
    setTargetCrop('');
    setDosage('');
    setApplicationMethod('Foliar Spray');
    setWaitingPeriod('');
    setToxicityClass('Green (Slightly Toxic)');
    setSafetyPrecautions('');
    setPackSize('');
    setManufacturingCompany('');
    setRegistrationNumber('');
    setStorageInstructions('');
    
    setIsFormOpen(true);
  };

  const openEditForm = (prod: Product) => {
    setEditingProduct(prod);
    setProductType(prod.type);
    
    // Prefill fields
    setName(prod.name || '');
    setNameEn(prod.nameEn || '');
    setCompany(prod.company || '');
    setCategoryId(prod.categoryId.toString() || '');
    setPrice(prod.price.toString() || '');
    setDiscountPrice(prod.discountPrice?.toString() || '');
    setStock(prod.stock.toString() || '0');
    setImageUrl(prod.imageUrl || '');
    setDescription(prod.description || '');
    
    if (prod.type === 'seed') {
      setVariety(prod.variety || '');
      setVarietyEn(prod.varietyEn || '');
      setCropType(prod.cropType || 'Kharif');
      setGermination(prod.germination?.toString() || '');
      setSeedRate(prod.seedRate || '');
      setMaturityDuration(prod.maturityDuration || '');
      setYieldVal(prod.yield || '');
      setBenefits(prod.benefits || '');
      setUsageInstructions(prod.usageInstructions || '');
      setDosage(prod.dosage || '');
    } else if (prod.type === 'fertilizer') {
      setWeight(prod.weight || '');
    } else if (prod.type === 'pesticide') {
      setTargetDisease(prod.targetDisease || '');
      setTargetDiseaseEn(prod.targetDiseaseEn || '');
      setPesticideType(prod.pesticideType || 'Insecticide');
      setActiveIngredient(prod.activeIngredient || '');
      setFormulation(prod.formulation || 'EC');
      setTargetCrop(prod.targetCrop || '');
      setDosage(prod.dosage || '');
      setApplicationMethod(prod.applicationMethod || 'Foliar Spray');
      setWaitingPeriod(prod.waitingPeriod || '');
      setToxicityClass(prod.toxicityClass || 'Green (Slightly Toxic)');
      setSafetyPrecautions(prod.safetyPrecautions || '');
      setPackSize(prod.packSize || '');
      setManufacturingCompany(prod.manufacturingCompany || '');
      setRegistrationNumber(prod.registrationNumber || '');
      setStorageInstructions(prod.storageInstructions || '');
    }
    
    setIsFormOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
      } else {
        alert('इमेज अपलोड विफल रहा।');
      }
    } catch (err) {
      console.error(err);
      alert('अपलोड करते समय त्रुटि।');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !categoryId || !price) {
      alert('कृपया आवश्यक फ़ील्ड भरें (Name, Category, Price)');
      return;
    }

    setIsSubmitting(true);

    const payload: any = {
      type: productType,
      name,
      nameEn: nameEn || null,
      company,
      categoryId,
      price,
      discountPrice: discountPrice || null,
      stock: stock || '0',
      imageUrl,
      description,
    };

    if (productType === 'seed') {
      payload.variety = variety;
      payload.varietyEn = varietyEn || null;
      payload.cropType = cropType;
      payload.germination = germination || null;
      payload.seedRate = seedRate;
      payload.maturityDuration = maturityDuration;
      payload.yield = yieldVal;
      payload.benefits = benefits;
      payload.usageInstructions = usageInstructions;
      payload.dosage = dosage;
    } else if (productType === 'fertilizer') {
      payload.weight = weight;
    } else if (productType === 'pesticide') {
      payload.targetDisease = targetDisease;
      payload.targetDiseaseEn = targetDiseaseEn || null;
      payload.pesticideType = pesticideType;
      payload.activeIngredient = activeIngredient;
      payload.formulation = formulation;
      payload.targetCrop = targetCrop;
      payload.dosage = dosage;
      payload.applicationMethod = applicationMethod;
      payload.waitingPeriod = waitingPeriod;
      payload.toxicityClass = toxicityClass;
      payload.safetyPrecautions = safetyPrecautions;
      payload.packSize = packSize;
      payload.manufacturingCompany = manufacturingCompany;
      payload.registrationNumber = registrationNumber || null;
      payload.storageInstructions = storageInstructions;
    }

    try {
      let res;
      if (editingProduct) {
        // Edit PUT request
        res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        // Add POST request
        res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (data.success) {
        const catObj = categories.find((c) => c.id === parseInt(categoryId, 10))!;
        const savedProd: Product = {
          ...data.product,
          category: catObj,
        };

        if (editingProduct) {
          setProducts((prev) =>
            prev.map((p) => (p.id === editingProduct.id && p.type === productType ? savedProd : p))
          );
        } else {
          setProducts((prev) => [savedProd, ...prev]);
        }

        setIsFormOpen(false);
        setEditingProduct(null);
      } else {
        alert(data.error || 'सहेजने में विफल।');
      }
    } catch (err) {
      console.error(err);
      alert('सहेजते समय समस्या आई।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: number, type: 'seed' | 'fertilizer' | 'pesticide') => {
    if (!confirm('क्या आप सचमुच इस उत्पाद को हटाना चाहते हैं?')) return;
    
    try {
      const res = await fetch(`/api/products/${id}?type=${type}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => !(p.id === id && p.type === type)));
      } else {
        alert('हटाने में विफलता।');
      }
    } catch (err) {
      console.error(err);
      alert('हटाते समय त्रुटि आई।');
    }
  };

  // Filter products by type and search query
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.company.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || p.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-agri-dark">
            उत्पाद प्रबंधन (Product Inventory)
          </h1>
          <p className="font-sans text-sm text-gray-500 mt-1">
            स्टोर के सभी बीज, खाद और दवाओं को जोड़ें, संपादित करें या हटाएं
          </p>
        </div>

        {/* Add Product Dropdown */}
        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            onClick={() => openAddForm('seed')}
            className="bg-agri-green-800 hover:bg-agri-green-900 text-white font-sans font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center space-x-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>+ Seed (बीज)</span>
          </button>
          <button
            onClick={() => openAddForm('fertilizer')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-sans font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center space-x-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>+ Fertilizer (खाद)</span>
          </button>
          <button
            onClick={() => openAddForm('pesticide')}
            className="bg-red-600 hover:bg-red-700 text-white font-sans font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center space-x-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>+ Pesticide (दवा)</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="bg-white border border-gray-150 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 font-sans text-sm">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="नाम या कंपनी से खोजें..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-agri-green-800"
          />
        </div>

        {/* Tabs for Type filters */}
        <div className="flex bg-gray-100 p-1 rounded-xl w-full md:w-auto">
          {(['all', 'seed', 'fertilizer', 'pesticide'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setTypeFilter(filter)}
              className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                typeFilter === filter 
                  ? 'bg-white text-agri-dark shadow-sm' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {filter === 'all' ? 'All' : filter}
            </button>
          ))}
        </div>
      </div>

      {/* Products Listing Table */}
      <div className="bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center text-gray-400 font-sans text-sm">
              कोई उत्पाद नहीं मिला। नया उत्पाद जोड़ने के लिए ऊपर बटन पर क्लिक करें।
            </div>
          ) : (
            <table className="w-full text-left font-sans text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold text-xs uppercase">
                  <th className="p-4 w-20">चित्र (Image)</th>
                  <th className="p-4">उत्पाद का नाम (Product)</th>
                  <th className="p-4">श्रेणी (Category)</th>
                  <th className="p-4">मूल्य (Price)</th>
                  <th className="p-4">स्टॉक (Stock)</th>
                  <th className="p-4 text-center">क्रियाएं (Actions)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((prod) => (
                  <tr key={`${prod.type}-${prod.id}`} className="hover:bg-gray-50 transition-colors">
                    {/* Image */}
                    <td className="p-4">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-150 bg-gray-50 shrink-0 flex items-center justify-center">
                        {prod.imageUrl ? (
                          <Image
                            src={prod.imageUrl}
                            alt={prod.name}
                            fill
                            className="object-cover object-center"
                          />
                        ) : (
                          <span className="text-[9px] text-gray-400 font-bold uppercase select-none text-center leading-none">No Image</span>
                        )}
                      </div>
                    </td>

                    {/* Name */}
                    <td className="p-4">
                      <div>
                        <span className="font-bold text-agri-dark block leading-tight">{prod.name}</span>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-[10px] text-gray-400 font-semibold uppercase">{prod.company}</span>
                          <span className="text-[9px] bg-gray-100 text-gray-600 font-bold px-1.5 py-0.5 rounded uppercase">
                            {prod.type}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-4">
                      <span className="text-gray-600 font-medium">{prod.category?.name || 'Unassigned'}</span>
                    </td>

                    {/* Price */}
                    <td className="p-4">
                      {prod.discountPrice ? (
                        <div>
                          <span className="font-bold text-agri-green-800">₹{prod.discountPrice}</span>
                          <span className="text-gray-400 text-xs line-through block">₹{prod.price}</span>
                        </div>
                      ) : (
                        <span className="font-bold text-agri-green-800">₹{prod.price}</span>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="p-4">
                      <div className="flex flex-col space-y-1">
                        <span className="font-black text-agri-dark">{prod.stock} पैकेट/बोरी</span>
                        {prod.stock > 10 ? (
                          <span className="text-[10px] text-green-600 font-bold">उपलब्ध</span>
                        ) : prod.stock > 0 ? (
                          <span className="text-[10px] text-yellow-600 font-bold animate-pulse">सीमित</span>
                        ) : (
                          <span className="text-[10px] text-red-600 font-bold">समाप्त</span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => openEditForm(prod)}
                          className="bg-gray-100 hover:bg-gray-200 text-agri-dark p-2 rounded-lg transition-colors cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id, prod.type)}
                          className="border border-red-100 hover:bg-red-50 text-red-600 p-2 rounded-lg transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add / Edit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
            
            {/* Close Button */}
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 p-1.5 rounded-lg cursor-pointer"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Title */}
            <h3 className="font-display text-xl font-bold text-agri-dark mb-1 flex items-center">
              <Sparkles className="h-5 w-5 text-agri-yellow-500 mr-2" />
              <span>
                {editingProduct ? 'उत्पाद संपादित करें (Edit Product)' : `नया उत्पाद जोड़ें (Add ${productType.toUpperCase()})`}
              </span>
            </h3>
            <p className="font-sans text-xs text-gray-400 mb-6">
              कृपया सभी आवश्यक विवरण सही से भरें।
            </p>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="space-y-6">
              
              {/* Row 1: Common parameters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">उत्पाद का नाम - हिंदी (Name - Hindi) *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="जैसे: Bayer Arize 6444 Gold"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Product Name - English *</label>
                  <input
                    type="text"
                    required
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="e.g. Bayer Arize 6444 Gold"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">कंपनी का नाम (Company) *</label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="जैसे: Bayer CropScience"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                  />
                </div>
              </div>

              {/* Row 2: Category, Price, Discount, Stock */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">श्रेणी (Category) *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                  >
                    {getFilteredCategories(productType).map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">मूल मूल्य (Price) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="MRP ₹"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">छूट मूल्य (Discount Price)</label>
                  <input
                    type="number"
                    min="0"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    placeholder="छूट रेट ₹"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">स्टॉक मात्रा (Stock Qty) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="संख्या"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                  />
                </div>
              </div>

              {/* Row 3: Image Upload & Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
                <div className="sm:col-span-8">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">उत्पाद का चित्र (Image URL / Upload)</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="चित्र का URL दर्ज करें या फाइल अपलोड करें..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                    />
                    
                    <label className="bg-gray-150 hover:bg-gray-200 text-agri-dark font-semibold px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer shrink-0 flex items-center justify-center">
                      <input
                        type="file"
                        accept="image/*"
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

                <div className="sm:col-span-4 flex justify-center">
                  <div className="relative w-16 h-16 rounded-xl border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center text-xs text-gray-400 font-semibold font-sans">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt="Preview"
                        fill
                        className="object-cover object-center"
                      />
                    ) : (
                      'No Image'
                    )}
                  </div>
                </div>
              </div>

              {/* Row 4: Description */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">उत्पाद का विवरण (Description)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="उत्पाद के उपयोग, गुणवत्ता और विशेषता के बारे में लिखें..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800 resize-none"
                />
              </div>

              {/* Row 5: Type Specific fields */}
              
              {/* Seed Fields */}
              {productType === 'seed' && (
                <div className="border-t border-gray-150 pt-6 space-y-4">
                  <h4 className="font-display text-sm font-bold text-agri-green-900 mb-4">
                    बीज विशिष्टता (Seed Specifications)
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">हाइब्रिड/किस्म (Variety) - हिंदी</label>
                      <input
                        type="text"
                        value={variety}
                        onChange={(e) => setVariety(e.target.value)}
                        placeholder="जैसे: हाइब्रिड धान"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Variety - English</label>
                      <input
                        type="text"
                        value={varietyEn}
                        onChange={(e) => setVarietyEn(e.target.value)}
                        placeholder="e.g. Hybrid Paddy"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">फसल मौसम (Season)</label>
                      <select
                        value={cropType}
                        onChange={(e) => setCropType(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                      >
                        <option value="Kharif">Kharif (खरीफ)</option>
                        <option value="Rabi">Rabi (रबी)</option>
                        <option value="Zaid">Zaid (जायद)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">अंकुरण दर (Germination %)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={germination}
                        onChange={(e) => setGermination(e.target.value)}
                        placeholder="जैसे: 85"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">बीज दर (Seed Rate)</label>
                      <input
                        type="text"
                        value={seedRate}
                        onChange={(e) => setSeedRate(e.target.value)}
                        placeholder="जैसे: 6 kg / acre"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">पकने की अवधि (Maturity)</label>
                      <input
                        type="text"
                        value={maturityDuration}
                        onChange={(e) => setMaturityDuration(e.target.value)}
                        placeholder="जैसे: 135-140 Days"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">औसत पैदावार (Yield)</label>
                      <input
                        type="text"
                        value={yieldVal}
                        onChange={(e) => setYieldVal(e.target.value)}
                        placeholder="जैसे: 25-30 Quintal/acre"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-1">
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">बीज उपचार खुराक (Dosage)</label>
                      <input
                        type="text"
                        value={dosage}
                        onChange={(e) => setDosage(e.target.value)}
                        placeholder="जैसे: 2-3 gm per kg seed"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">मुख्य लाभ (Benefits, comma separated)</label>
                      <input
                        type="text"
                        value={benefits}
                        onChange={(e) => setBenefits(e.target.value)}
                        placeholder="जैसे: रोगरोधी, अधिक कल्ले, भारी दाना"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">बुवाई के निर्देश (Usage Instructions)</label>
                    <textarea
                      value={usageInstructions}
                      onChange={(e) => setUsageInstructions(e.target.value)}
                      rows={2}
                      placeholder="समतल क्यारी तैयार कर 2-3 सेमी गहराई में बुवाई करें..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800 resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Fertilizer Fields */}
              {productType === 'fertilizer' && (
                <div className="border-t border-gray-150 pt-6">
                  <h4 className="font-display text-sm font-bold text-blue-800 mb-4">
                    खाद विवरण (Fertilizer details)
                  </h4>
                  
                  <div className="w-1/2">
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">वजन प्रति बैग (Weight/Pack size)</label>
                    <input
                      type="text"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="जैसे: 50 kg, 1 kg, 500 ml"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                    />
                  </div>
                </div>
              )}

              {/* Pesticide Fields */}
              {productType === 'pesticide' && (
                <div className="border-t border-gray-150 pt-6 space-y-4">
                  <h4 className="font-display text-sm font-bold text-red-700 mb-4">
                    कीटनाशक विशिष्टता (Pesticide Specifications)
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">कीटनाशक का प्रकार (Pesticide Type)</label>
                      <select
                        value={pesticideType}
                        onChange={(e) => setPesticideType(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                      >
                        <option value="Insecticide">Insecticide (कीटनाशक)</option>
                        <option value="Fungicide">Fungicide (फफूंदनाशक)</option>
                        <option value="Herbicide">Herbicide (खरपतवारनाशक)</option>
                        <option value="Rodenticide">Rodenticide (चूहानाशक)</option>
                        <option value="Nematicide">Nematicide (कृमिनाशक)</option>
                        <option value="Bio-Pesticide">Bio-Pesticide (जैविक कीटनाशक)</option>
                        <option value="Plant Growth Regulator">Plant Growth Regulator (PGR)</option>
                        <option value="Others">Others (अन्य)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">सक्रिय सामग्री (Active Ingredient)</label>
                      <input
                        type="text"
                        value={activeIngredient}
                        onChange={(e) => setActiveIngredient(e.target.value)}
                        placeholder="जैसे: Fipronil 5% SC"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">फॉर्मूलेशन (Formulation)</label>
                      <select
                        value={formulation}
                        onChange={(e) => setFormulation(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                      >
                        <option value="EC">EC (Emulsifiable Concentrate)</option>
                        <option value="SC">SC (Suspension Concentrate)</option>
                        <option value="WP">WP (Wettable Powder)</option>
                        <option value="WG">WG (Water Dispersible Granules)</option>
                        <option value="SL">SL (Soluble Liquid)</option>
                        <option value="GR">GR (Granules)</option>
                        <option value="SP">SP (Soluble Powder)</option>
                        <option value="DP">DP (Dustable Powder)</option>
                        <option value="Others">Others (अन्य)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">लक्षित फसल (Target Crop)</label>
                      <input
                        type="text"
                        value={targetCrop}
                        onChange={(e) => setTargetCrop(e.target.value)}
                        placeholder="जैसे: धान, गेहूं, टमाटर, बैंगन"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">लक्षित रोग - हिंदी (Target Pests) *</label>
                      <input
                        type="text"
                        value={targetDisease}
                        onChange={(e) => setTargetDisease(e.target.value)}
                        placeholder="जैसे: तना छेदक, फंगस"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Target Pests - English</label>
                      <input
                        type="text"
                        value={targetDiseaseEn}
                        onChange={(e) => setTargetDiseaseEn(e.target.value)}
                        placeholder="e.g. Stem Borer, Fungus"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">खुराक (Dosage)</label>
                      <input
                        type="text"
                        value={dosage}
                        onChange={(e) => setDosage(e.target.value)}
                        placeholder="जैसे: 2 ml / Litre, 250 ml / acre"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">प्रयोग विधि (Application Method)</label>
                      <select
                        value={applicationMethod}
                        onChange={(e) => setApplicationMethod(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                      >
                        <option value="Foliar Spray">Foliar Spray (पर्ण छिड़काव)</option>
                        <option value="Soil Application">Soil Application (मिट्टी अनुप्रयोग)</option>
                        <option value="Seed Treatment">Seed Treatment (बीज उपचार)</option>
                        <option value="Drip Irrigation">Drip Irrigation (ड्रिप सिंचाई)</option>
                        <option value="Root Drenching">Root Drenching (जड़ सराबोर)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">प्रतीक्षा अवधि (Pre-Harvest Interval)</label>
                      <input
                        type="text"
                        value={waitingPeriod}
                        onChange={(e) => setWaitingPeriod(e.target.value)}
                        placeholder="जैसे: 7-10 Days"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">विषाक्तता वर्ग (Toxicity Class)</label>
                      <select
                        value={toxicityClass}
                        onChange={(e) => setToxicityClass(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                      >
                        <option value="Green (Slightly Toxic)">Green (न्यूनतम विषाक्त)</option>
                        <option value="Blue (Moderately Toxic)">Blue (मध्यम विषाक्त)</option>
                        <option value="Yellow (Highly Toxic)">Yellow (अत्यधिक विषाक्त)</option>
                        <option value="Red (Extremely Toxic)">Red (अति तीव्र विषाक्त)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">पैक आकार (Pack Size)</label>
                      <input
                        type="text"
                        value={packSize}
                        onChange={(e) => setPackSize(e.target.value)}
                        placeholder="जैसे: 100 ml, 250 ml, 1 L, 1 kg"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">विनिर्माता (Manufacturing Co)</label>
                      <input
                        type="text"
                        value={manufacturingCompany}
                        onChange={(e) => setManufacturingCompany(e.target.value)}
                        placeholder="जैसे: Syngenta India Ltd"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">पंजीकरण संख्या (Reg No)</label>
                      <input
                        type="text"
                        value={registrationNumber}
                        onChange={(e) => setRegistrationNumber(e.target.value)}
                        placeholder="जैसे: CIR-12345/2026 (Optional)"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">सुरक्षा सावधानियां (Safety Precautions)</label>
                      <textarea
                        value={safetyPrecautions}
                        onChange={(e) => setSafetyPrecautions(e.target.value)}
                        rows={2}
                        placeholder="जैसे: सुरक्षात्मक कपड़े पहनें, हवा की दिशा में स्प्रे करें..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800 resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">भंडारण निर्देश (Storage Instructions)</label>
                      <textarea
                        value={storageInstructions}
                        onChange={(e) => setStorageInstructions(e.target.value)}
                        rows={2}
                        placeholder="जैसे: बच्चों की पहुंच से दूर रखें, ठंडी सूखी जगह पर रखें..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800 resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Save / Cancel buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100 font-sans text-sm font-bold">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-agri-dark px-5 py-2.5 rounded-lg cursor-pointer"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-agri-green-800 hover:bg-agri-green-900 text-white px-6 py-2.5 rounded-lg flex items-center space-x-1.5 cursor-pointer disabled:bg-gray-400"
                >
                  {isSubmitting ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  <span>उत्पाद सहेजें (Save)</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
