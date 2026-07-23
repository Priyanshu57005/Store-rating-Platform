import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Store } from '../../types/store.types';
import { StarRating } from '../ui/StarRating';
import { RateStoreModal } from './RateStoreModal';
import { Search, MapPin, Mail, Star, Edit3, ArrowUpDown, ChevronLeft, ChevronRight, Store as StoreIcon } from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(true);

  // Rate Modal State
  const [selectedStore, setSelectedStore] = useState<{ id: string; name: string; userRating?: number | null } | null>(null);

  const fetchStores = async (page = 1) => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        search: searchQuery,
        sortBy,
        sortOrder,
      });

      const res = await api.get(`/stores?${queryParams.toString()}`);
      if (res.data.success) {
        setStores(res.data.stores);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('Failed to load stores:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStores(1);
  }, [searchQuery, sortBy, sortOrder]);

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl glass-card border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-zinc-900/60 to-zinc-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <StoreIcon className="w-6 h-6 text-indigo-400" /> Explore Registered Stores
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Browse registered stores, search by store name or address, view overall ratings, and share your feedback.
          </p>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none z-10" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stores by Name or Address..."
            className="input-field !pl-9 py-2.5 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field py-2 text-xs bg-zinc-900 w-auto"
          >
            <option value="name">Store Name</option>
            <option value="address">Address</option>
            <option value="overallRating">Overall Rating</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white"
            title="Toggle sort direction"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Store Listings Table */}
      <div className="glass-card overflow-hidden border border-zinc-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950/80 uppercase text-[11px] text-zinc-400 font-semibold border-b border-zinc-800">
              <tr>
                <th className="py-3.5 px-4 cursor-pointer hover:text-white" onClick={() => toggleSort('name')}>
                  <div className="flex items-center gap-1.5">
                    Store Name <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                  </div>
                </th>
                <th className="py-3.5 px-4 cursor-pointer hover:text-white" onClick={() => toggleSort('address')}>
                  <div className="flex items-center gap-1.5">
                    Address <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                  </div>
                </th>
                <th className="py-3.5 px-4 cursor-pointer hover:text-white" onClick={() => toggleSort('overallRating')}>
                  <div className="flex items-center gap-1.5">
                    Overall Rating <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Your Rating</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-zinc-500 font-medium">
                    Loading store directory...
                  </td>
                </tr>
              ) : stores.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-zinc-500 font-medium">
                    No stores found matching your search.
                  </td>
                </tr>
              ) : (
                stores.map((s) => (
                  <tr key={s.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="py-4 px-4 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold shrink-0">
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <span>{s.name}</span>
                          <span className="text-[11px] text-zinc-500 block font-normal flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {s.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-zinc-400 max-w-[260px]">
                      <span className="flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
                        <span>{s.address}</span>
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <StarRating rating={s.overallRating} readOnly size="sm" />
                      <span className="text-[10px] text-zinc-500 font-mono block mt-0.5">
                        {s.totalRatings} user reviews
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {s.userRating ? (
                        <div className="flex items-center gap-1.5 text-amber-400 font-semibold font-mono">
                          <Star className="w-4 h-4 fill-amber-400" />
                          <span>{s.userRating} / 5</span>
                        </div>
                      ) : (
                        <span className="text-zinc-500 text-[11px] font-mono">Not rated yet</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => setSelectedStore({ id: s.id, name: s.name, userRating: s.userRating })}
                        className={s.userRating ? 'btn-secondary py-1.5 px-3 text-xs' : 'btn-primary py-1.5 px-3 text-xs'}
                      >
                        {s.userRating ? (
                          <>
                            <Edit3 className="w-3.5 h-3.5" /> Modify Rating
                          </>
                        ) : (
                          <>
                            <Star className="w-3.5 h-3.5" /> Submit Rating
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-3 bg-zinc-950/80 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
          <span>
            Page {pagination.page} of {pagination.totalPages || 1} ({pagination.total} stores total)
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={pagination.page <= 1}
              onClick={() => fetchStores(pagination.page - 1)}
              className="p-1.5 rounded bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => fetchStores(pagination.page + 1)}
              className="p-1.5 rounded bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Rate Store Modal */}
      <RateStoreModal
        storeId={selectedStore?.id || null}
        storeName={selectedStore?.name || null}
        currentRating={selectedStore?.userRating}
        isOpen={!!selectedStore}
        onClose={() => setSelectedStore(null)}
        onSuccess={() => fetchStores(pagination.page)}
      />
    </div>
  );
};
