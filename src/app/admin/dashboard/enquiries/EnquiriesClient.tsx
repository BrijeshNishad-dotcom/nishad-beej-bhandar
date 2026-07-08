'use client';

import { useState } from 'react';
import { 
  MapPin, Phone, Check, Trash2, 
  RefreshCw, Search, Calendar 
} from 'lucide-react';

type Enquiry = {
  id: number;
  name: string;
  mobile: string;
  village: string;
  cropName: string | null;
  message: string;
  status: string;
  createdAt: Date;
};

type EnquiriesClientProps = {
  initialEnquiries: Enquiry[];
};

export default function EnquiriesClient({ initialEnquiries }: EnquiriesClientProps) {
  const [enquiries, setEnquiries] = useState<Enquiry[]>(initialEnquiries);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'PENDING' | 'CONTACTED'>('all');
  const [isUpdating, setIsUpdating] = useState<number | null>(null);

  const handleMarkContacted = async (id: number) => {
    setIsUpdating(id);
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CONTACTED' }),
      });
      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: 'CONTACTED' } : e))
        );
      } else {
        alert('अपडेट करने में विफल।');
      }
    } catch (err) {
      console.error(err);
      alert('एक त्रुटि आई।');
    } finally {
      setIsUpdating(null);
    }
  };

  const handleDeleteEnquiry = async (id: number) => {
    if (!confirm('क्या आप सचमुच इस पूछताछ को हटाना चाहते हैं?')) return;
    setIsUpdating(id);
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setEnquiries((prev) => prev.filter((e) => e.id !== id));
      } else {
        alert('हटाने में विफल।');
      }
    } catch (err) {
      console.error(err);
      alert('एक त्रुटि आई।');
    } finally {
      setIsUpdating(null);
    }
  };

  // Filter list
  const filteredEnquiries = enquiries.filter((e) => {
    const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase()) || 
                          e.village.toLowerCase().includes(search.toLowerCase()) || 
                          e.mobile.includes(search) || 
                          (e.cropName && e.cropName.toLowerCase().includes(search.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-agri-dark">
            किसान पूछताछ (Farmer Enquiries)
          </h1>
          <p className="font-sans text-sm text-gray-500 mt-1">
            वेबसाइट से प्राप्त सभी पूछताछ, सवाल और आवश्यकताओं की सूची
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-gray-150 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 font-sans text-sm">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="किसान, गाँव, मोबाइल या फसल से खोजें..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-agri-green-800"
          />
        </div>

        {/* Status filters */}
        <div className="flex bg-gray-100 p-1 rounded-xl w-full md:w-auto">
          {(['all', 'PENDING', 'CONTACTED'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === filter 
                  ? 'bg-white text-agri-dark shadow-sm' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {filter === 'all' ? 'All' : filter === 'PENDING' ? 'लंबित (Pending)' : 'संपर्कित (Contacted)'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {filteredEnquiries.length === 0 ? (
            <div className="p-12 text-center text-gray-400 font-sans text-sm">
              कोई पूछताछ नहीं मिली।
            </div>
          ) : (
            <table className="w-full text-left font-sans text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold text-xs uppercase">
                  <th className="p-4">किसान विवरण (Farmer Info)</th>
                  <th className="p-4">फसल (Crop)</th>
                  <th className="p-4">सन्देश / प्रश्न (Message)</th>
                  <th className="p-4">दिनांक (Date)</th>
                  <th className="p-4">स्थिति (Status)</th>
                  <th className="p-4 text-center">क्रियाएं (Actions)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEnquiries.map((enq) => {
                  const formattedDate = new Date(enq.createdAt).toLocaleDateString('hi-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });

                  return (
                    <tr key={enq.id} className="hover:bg-gray-50 transition-colors">
                      {/* Farmer details */}
                      <td className="p-4">
                        <div>
                          <span className="font-bold text-agri-dark block leading-tight">{enq.name}</span>
                          <div className="flex flex-col text-xs text-gray-400 space-y-0.5 mt-1.5">
                            <span className="flex items-center">
                              <MapPin className="h-3.5 w-3.5 mr-1" /> ग्राम: {enq.village}
                            </span>
                            <span className="flex items-center">
                              <Phone className="h-3.5 w-3.5 mr-1" />
                              <a href={`tel:${enq.mobile}`} className="hover:text-agri-green-800 hover:underline">
                                {enq.mobile}
                              </a>
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Crop */}
                      <td className="p-4">
                        <span className="bg-agri-green-50 text-agri-green-850 text-xs font-semibold px-2 py-0.5 rounded-md">
                          {enq.cropName || 'सामान्य सलाह'}
                        </span>
                      </td>

                      {/* Message */}
                      <td className="p-4 max-w-sm">
                        <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                          {enq.message}
                        </p>
                      </td>

                      {/* Date */}
                      <td className="p-4 whitespace-nowrap text-gray-500">
                        <span className="flex items-center text-xs">
                          <Calendar className="h-3.5 w-3.5 mr-1 text-gray-400" />
                          <span>{formattedDate}</span>
                        </span>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        {enq.status === 'PENDING' ? (
                          <span className="bg-yellow-50 text-yellow-750 text-xs font-bold px-2.5 py-0.5 rounded-full border border-yellow-250">
                            लंबित (Pending)
                          </span>
                        ) : (
                          <span className="bg-green-50 text-green-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-green-250">
                            संपर्कित (Contacted)
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          {enq.status === 'PENDING' && (
                            <button
                              disabled={isUpdating === enq.id}
                              onClick={() => handleMarkContacted(enq.id)}
                              className="bg-green-600 hover:bg-green-750 text-white p-2 rounded-lg transition-colors cursor-pointer"
                              title="Mark Contacted"
                            >
                              {isUpdating === enq.id ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <Check className="h-4 w-4" />
                              )}
                            </button>
                          )}
                          
                          {/* Call shortcut */}
                          <a
                            href={`tel:${enq.mobile}`}
                            className="bg-gray-100 hover:bg-gray-200 text-agri-dark p-2 rounded-lg transition-colors flex items-center justify-center"
                            title="Call Farmer"
                          >
                            <Phone className="h-4 w-4" />
                          </a>

                          <button
                            disabled={isUpdating === enq.id}
                            onClick={() => handleDeleteEnquiry(enq.id)}
                            className="border border-red-100 hover:bg-red-50 text-red-600 p-2 rounded-lg transition-colors cursor-pointer"
                            title="Delete Enquiry"
                          >
                            {isUpdating === enq.id ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
}
