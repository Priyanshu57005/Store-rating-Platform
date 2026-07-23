import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { StoreRatingItem } from '../../types/rating.types';
import { StatCard } from '../ui/StatCard';
import { StarRating } from '../ui/StarRating';
import {
  Star,
  Users,
  Building2,
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Calendar,
  MessageSquare,
  Mail,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export const OwnerDashboard: React.FC = () => {
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalRatings, setTotalRatings] = useState<number>(0);
  const [ratingBreakdown, setRatingBreakdown] = useState<{ 1: number; 2: number; 3: number; 4: number; 5: number }>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });

  const [ratings, setRatings] = useState<StoreRatingItem[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(true);

  const fetchOwnerData = async (page = 1) => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        search,
        sortBy,
        sortOrder,
      });

      const res = await api.get(`/ratings/owner?${queryParams.toString()}`);
      if (res.data.success) {
        setAverageRating(res.data.averageRating);
        setTotalRatings(res.data.totalRatings);
        setRatingBreakdown(res.data.ratingBreakdown);
        setRatings(res.data.ratings);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('Failed to load store owner data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerData(1);
  }, [search, sortBy, sortOrder]);

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const chartData = [
    { star: '5 Stars', count: ratingBreakdown[5] || 0, color: '#10b981' },
    { star: '4 Stars', count: ratingBreakdown[4] || 0, color: '#3b82f6' },
    { star: '3 Stars', count: ratingBreakdown[3] || 0, color: '#8b5cf6' },
    { star: '2 Stars', count: ratingBreakdown[2] || 0, color: '#f59e0b' },
    { star: '1 Star', count: ratingBreakdown[1] || 0, color: '#ef4444' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Building2 className="w-6 h-6 text-emerald-400" /> Store Owner Performance Portal
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Monitor your store's average rating, customer feedback, and reviewer history.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <StatCard
          title="Store Average Rating"
          value={averageRating > 0 ? `${averageRating} / 5.0` : 'No ratings yet'}
          description="Overall customer satisfaction score"
          gradient="emerald"
          icon={<Star className="w-6 h-6" />}
        />
        <StatCard
          title="Total User Reviews"
          value={totalRatings}
          description="Number of individual ratings received"
          gradient="indigo"
          icon={<Users className="w-6 h-6" />}
        />
      </div>

      {/* Rating Analytics Chart */}
      <div className="glass-card p-6 border border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-400" /> Ratings Breakdown
          </h3>
          <span className="text-xs text-zinc-400 font-mono">1 to 5 Stars Distribution</span>
        </div>
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="star" tick={{ fill: '#a1a1aa', fontSize: 11 }} axisLine={false} />
              <YAxis allowDecimals={false} tick={{ fill: '#a1a1aa', fontSize: 11 }} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '8px', fontSize: '12px', color: '#fff' }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* User Reviews Table Header & Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Customer Reviewers</h3>
            <p className="text-[11px] text-zinc-400">List of users who submitted ratings for your store</p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none z-10" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reviewer Name or Email..."
              className="input-field !pl-9 py-2 text-xs"
            />
          </div>
        </div>

        {/* User Ratings Table */}
        <div className="glass-card overflow-hidden border border-zinc-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-950/80 uppercase text-[11px] text-zinc-400 font-semibold border-b border-zinc-800">
                <tr>
                  <th className="py-3.5 px-4 cursor-pointer hover:text-white" onClick={() => toggleSort('userName')}>
                    <div className="flex items-center gap-1.5">
                      User Name <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4 cursor-pointer hover:text-white" onClick={() => toggleSort('userEmail')}>
                    <div className="flex items-center gap-1.5">
                      Email Address <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4 cursor-pointer hover:text-white" onClick={() => toggleSort('rating')}>
                    <div className="flex items-center gap-1.5">
                      Submitted Rating <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4">Comment</th>
                  <th className="py-3.5 px-4 cursor-pointer hover:text-white" onClick={() => toggleSort('createdAt')}>
                    <div className="flex items-center gap-1.5">
                      Date <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-zinc-500 font-medium">
                      Loading store reviews...
                    </td>
                  </tr>
                ) : ratings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-zinc-500 font-medium">
                      No ratings found for your store.
                    </td>
                  </tr>
                ) : (
                  ratings.map((r) => (
                    <tr key={r.id} className="hover:bg-zinc-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-white">{r.userName}</td>
                      <td className="py-3.5 px-4 text-zinc-400">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-zinc-500" /> {r.userEmail}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <StarRating rating={r.rating} readOnly size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-zinc-300 max-w-[280px]">
                        {r.comment ? (
                          <span className="flex items-start gap-1 text-zinc-300">
                            <MessageSquare className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
                            <span>"{r.comment}"</span>
                          </span>
                        ) : (
                          <span className="text-zinc-600 italic">No comment provided</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-zinc-400 font-mono text-[11px]">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-zinc-500" />
                          {new Date(r.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-3 bg-zinc-950/80 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
            <span>
              Page {pagination.page} of {pagination.totalPages || 1} ({pagination.total} reviewers)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => fetchOwnerData(pagination.page - 1)}
                className="p-1.5 rounded bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchOwnerData(pagination.page + 1)}
                className="p-1.5 rounded bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
