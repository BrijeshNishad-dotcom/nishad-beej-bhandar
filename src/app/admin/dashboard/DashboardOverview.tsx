'use client';

import { useState } from 'react';
import { 
  ShoppingBag, FolderOpen, MailOpen, Users, 
  Check, Trash2, Calendar, MapPin, Phone, RefreshCw 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';
import { useAppTranslation } from '@/lib/translation';

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

type DashboardOverviewProps = {
  stats: {
    totalProducts: number;
    totalCategories: number;
    totalEnquiries: number;
    totalVisitors: number;
    visitorsToday: number;
    visitorHistory: { date: string; count: number }[];
  };
  recentEnquiries: Enquiry[];
};

export default function DashboardOverview({ stats, recentEnquiries }: DashboardOverviewProps) {
  const [enquiries, setEnquiries] = useState<Enquiry[]>(recentEnquiries);
  const [isUpdating, setIsUpdating] = useState<number | null>(null);
  const { t } = useAppTranslation();

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
        alert(t('admin.dashboard.errorUpdate'));
      }
    } catch (err) {
      console.error(err);
      alert(t('admin.dashboard.errorGeneric'));
    } finally {
      setIsUpdating(null);
    }
  };

  const handleDeleteEnquiry = async (id: number) => {
    if (!confirm(t('admin.dashboard.confirmDelete'))) return;
    setIsUpdating(id);
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setEnquiries((prev) => prev.filter((e) => e.id !== id));
      } else {
        alert(t('admin.dashboard.errorDelete'));
      }
    } catch (err) {
      console.error(err);
      alert(t('admin.dashboard.errorGeneric'));
    } finally {
      setIsUpdating(null);
    }
  };

  const statCards = [
    { name: t('admin.dashboard.totalProducts'), value: stats.totalProducts, icon: ShoppingBag, color: 'text-blue-600 bg-blue-50 border-blue-100' },
    { name: t('admin.dashboard.categories'), value: stats.totalCategories, icon: FolderOpen, color: 'text-amber-600 bg-amber-50 border-amber-100' },
    { name: t('admin.dashboard.receivedEnquiries'), value: stats.totalEnquiries, icon: MailOpen, color: 'text-green-600 bg-green-50 border-green-100' },
    { name: t('admin.dashboard.totalVisitors'), value: stats.totalVisitors, icon: Users, color: 'text-indigo-600 bg-indigo-50 border-indigo-100', subText: t('admin.dashboard.todayVisitors', { count: stats.visitorsToday }) },
  ];

  return (
    <div className="space-y-10">
      
      {/* Page Title */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-agri-dark">
          {t('admin.dashboard.title')}
        </h1>
        <p className="font-sans text-sm text-gray-500 mt-1">
          {t('admin.dashboard.subtitle')}
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className={`border rounded-2xl p-6 flex items-center justify-between shadow-sm bg-white`}>
              <div className="space-y-1">
                <span className="text-xs text-gray-400 font-bold block">{card.name}</span>
                <span className="text-2xl font-black text-agri-dark block">{card.value}</span>
                {card.subText && <span className="text-[10px] text-agri-green-800 font-semibold block">{card.subText}</span>}
              </div>
              <div className={`p-3 rounded-xl border ${card.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart Section */}
      <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm">
        <h3 className="font-display font-bold text-base text-agri-dark mb-6 flex items-center">
          <Calendar className="h-5 w-5 text-agri-yellow-500 mr-2" />
          <span>{t('admin.dashboard.visitorGraph')}</span>
        </h3>
        
        <div className="h-80 w-full font-sans text-xs">
          {stats.visitorHistory.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-400">
              {t('admin.dashboard.noVisitorData')}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={stats.visitorHistory}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="visitorColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2e7d32" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#2e7d32" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="date" stroke="#9ca3af" tickLine={false} />
                <YAxis stroke="#9ca3af" tickLine={false} axisLine={false} />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  name={t('admin.dashboard.totalVisitors')}
                  stroke="#2e7d32" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#visitorColor)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Enquiries Table */}
      <div className="bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-display font-bold text-base text-agri-dark">
            {t('admin.dashboard.recentEnquiries')}
          </h3>
          <span className="bg-agri-green-50 text-agri-green-800 text-xs font-bold px-2.5 py-1 rounded-lg">
            {t('admin.dashboard.lastMessages')}
          </span>
        </div>

        <div className="overflow-x-auto">
          {enquiries.length === 0 ? (
            <div className="p-12 text-center text-gray-400 font-sans text-sm">
              {t('admin.dashboard.noPending')}
            </div>
          ) : (
            <table className="w-full text-left font-sans text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold text-xs uppercase">
                  <th className="p-4">{t('admin.dashboard.farmerDetails')}</th>
                  <th className="p-4">{t('admin.dashboard.crop')}</th>
                  <th className="p-4">{t('admin.dashboard.message')}</th>
                  <th className="p-4">{t('admin.dashboard.status')}</th>
                  <th className="p-4 text-center">{t('admin.dashboard.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {enquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-gray-50 transition-colors">
                    {/* Farmer details */}
                    <td className="p-4">
                      <div>
                        <span className="font-bold text-agri-dark block">{enq.name}</span>
                        <div className="flex flex-col text-xs text-gray-400 space-y-0.5 mt-1">
                          <span className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" /> {t('admin.dashboard.villageLabel')}: {enq.village}
                          </span>
                          <span className="flex items-center">
                            <Phone className="h-3 w-3 mr-1" /> {enq.mobile}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Crop */}
                    <td className="p-4">
                      <span className="bg-agri-green-50 text-agri-green-850 text-xs font-semibold px-2 py-0.5 rounded-md">
                        {enq.cropName || t('admin.dashboard.generalAdvice')}
                      </span>
                    </td>

                    {/* Message */}
                    <td className="p-4 max-w-xs">
                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed" title={enq.message}>
                        {enq.message}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      {enq.status === 'PENDING' ? (
                        <span className="bg-yellow-50 text-yellow-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-yellow-250">
                          {t('admin.dashboard.pending')}
                        </span>
                      ) : (
                        <span className="bg-green-50 text-green-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-green-250">
                          {t('admin.dashboard.contacted')}
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
                            title={t('admin.dashboard.markContacted')}
                          >
                            {isUpdating === enq.id ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                          </button>
                        )}
                        <button
                          disabled={isUpdating === enq.id}
                          onClick={() => handleDeleteEnquiry(enq.id)}
                          className="border border-red-200 hover:bg-red-50 text-red-600 p-2 rounded-lg transition-colors cursor-pointer"
                          title={t('admin.dashboard.delete')}
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
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
}
