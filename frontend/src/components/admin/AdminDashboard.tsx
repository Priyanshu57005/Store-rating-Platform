import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { StatCard } from '../ui/StatCard';
import { StarRating } from '../ui/StarRating';
import { AddUserModal } from './AddUserModal';
import { AddStoreModal } from './AddStoreModal';
import { UserDetailModal } from './UserDetailModal';
import { User, Role } from '../../types/user.types';
import { Store as StoreType } from '../../types/store.types';
import {
  Users,
  Store,
  Star,
  UserPlus,
  PlusCircle,
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  BarChart3,
  Shield,
  Building2,
  User as UserIcon,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export const AdminDashboard: React.FC = () => {
  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
    roleBreakdown: { ADMIN: 0, USER: 0, STORE_OWNER: 0 },
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });

  // Active Tab: 'users' | 'stores'
  const [activeTab, setActiveTab] = useState<'users' | 'stores'>('users');

  // Users table state
  const [users, setUsers] = useState<User[]>([]);
  const [usersPagination, setUsersPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('');
  const [userSortBy, setUserSortBy] = useState('createdAt');
  const [userSortOrder, setUserSortOrder] = useState<'asc' | 'desc'>('desc');

  // Stores table state
  const [stores, setStores] = useState<StoreType[]>([]);
  const [storesPagination, setStoresPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [storeSearch, setStoreSearch] = useState('');
  const [storeSortBy, setStoreSortBy] = useState('name');
  const [storeSortOrder, setStoreSortOrder] = useState<'asc' | 'desc'>('asc');

  // Modals state
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isAddStoreOpen, setIsAddStoreOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      const res = await api.get('/dashboard/admin');
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    }
  };

  const fetchUsers = async (page = 1) => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        search: userSearch,
        sortBy: userSortBy,
        sortOrder: userSortOrder,
      });
      if (userRoleFilter) queryParams.append('role', userRoleFilter);

      const res = await api.get(`/users?${queryParams.toString()}`);
      if (res.data.success) {
        setUsers(res.data.users);
        setUsersPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const fetchStores = async (page = 1) => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        search: storeSearch,
        sortBy: storeSortBy,
        sortOrder: storeSortOrder,
      });

      const res = await api.get(`/stores?${queryParams.toString()}`);
      if (res.data.success) {
        setStores(res.data.stores);
        setStoresPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('Failed to fetch stores:', err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchUsers(1);
  }, [userSearch, userRoleFilter, userSortBy, userSortOrder]);

  useEffect(() => {
    fetchStores(1);
  }, [storeSearch, storeSortBy, storeSortOrder]);

  const toggleUserSort = (field: string) => {
    if (userSortBy === field) {
      setUserSortOrder(userSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setUserSortBy(field);
      setUserSortOrder('asc');
    }
  };

  const toggleStoreSort = (field: string) => {
    if (storeSortBy === field) {
      setStoreSortOrder(storeSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setStoreSortBy(field);
      setStoreSortOrder('asc');
    }
  };

  const ratingChartData = [
    { star: '5 Star', count: stats.ratingDistribution[5] || 0, color: '#10b981' },
    { star: '4 Star', count: stats.ratingDistribution[4] || 0, color: '#3b82f6' },
    { star: '3 Star', count: stats.ratingDistribution[3] || 0, color: '#8b5cf6' },
    { star: '2 Star', count: stats.ratingDistribution[2] || 0, color: '#f59e0b' },
    { star: '1 Star', count: stats.ratingDistribution[1] || 0, color: '#ef4444' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">System Administrator Dashboard</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Platform control center: Manage users, stores, and platform analytics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddStoreOpen(true)}
            className="btn-secondary text-xs"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>Add Store</span>
          </button>
          <button
            onClick={() => setIsAddUserOpen(true)}
            className="btn-primary text-xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          description="Normal users, Store owners & Admins"
          gradient="indigo"
          icon={<Users className="w-6 h-6" />}
        />
        <StatCard
          title="Total Registered Stores"
          value={stats.totalStores}
          description="Active stores registered on platform"
          gradient="emerald"
          icon={<Store className="w-6 h-6" />}
        />
        <StatCard
          title="Total Submitted Ratings"
          value={stats.totalRatings}
          description="User ratings across all stores"
          gradient="amber"
          icon={<Star className="w-6 h-6" />}
        />
      </div>

      {/* Rating Breakdown Chart */}
      <div className="glass-card p-6 border border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-400" /> Rating Distribution Overview
          </h3>
          <span className="text-xs text-zinc-400 font-mono">1 to 5 Stars Scale</span>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ratingChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="star" tick={{ fill: '#a1a1aa', fontSize: 11 }} axisLine={false} />
              <YAxis allowDecimals={false} tick={{ fill: '#a1a1aa', fontSize: 11 }} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '8px', fontSize: '12px', color: '#fff' }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {ratingChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="border-b border-zinc-800 flex items-center gap-6">
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 text-sm font-medium transition-colors relative flex items-center gap-2 ${
            activeTab === 'users' ? 'text-indigo-400 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Users className="w-4 h-4" /> Users Directory ({stats.totalUsers})
          {activeTab === 'users' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />}
        </button>
        <button
          onClick={() => setActiveTab('stores')}
          className={`pb-3 text-sm font-medium transition-colors relative flex items-center gap-2 ${
            activeTab === 'stores' ? 'text-indigo-400 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Store className="w-4 h-4" /> Stores Directory ({stats.totalStores})
          {activeTab === 'stores' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />}
        </button>
      </div>

      {/* USERS DIRECTORY TAB */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none z-10" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Filter by Name, Email, Address..."
                className="input-field !pl-9 py-2 text-xs"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-zinc-400" />
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="input-field py-2 text-xs bg-zinc-900"
              >
                <option value="">All User Roles</option>
                <option value="ADMIN">System Administrator</option>
                <option value="USER">Normal User</option>
                <option value="STORE_OWNER">Store Owner</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="glass-card overflow-hidden border border-zinc-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="bg-zinc-950/80 uppercase text-[11px] text-zinc-400 font-semibold border-b border-zinc-800">
                  <tr>
                    <th className="py-3.5 px-4 cursor-pointer hover:text-white" onClick={() => toggleUserSort('name')}>
                      <div className="flex items-center gap-1.5">
                        Name <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 cursor-pointer hover:text-white" onClick={() => toggleUserSort('email')}>
                      <div className="flex items-center gap-1.5">
                        Email <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 cursor-pointer hover:text-white" onClick={() => toggleUserSort('address')}>
                      <div className="flex items-center gap-1.5">
                        Address <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 cursor-pointer hover:text-white" onClick={() => toggleUserSort('role')}>
                      <div className="flex items-center gap-1.5">
                        Role <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4">Rating / Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-zinc-500 font-medium">
                        No users found matching search criteria.
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.id} className="hover:bg-zinc-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-medium text-white max-w-[200px] truncate">{u.name}</td>
                        <td className="py-3.5 px-4 text-zinc-400">{u.email}</td>
                        <td className="py-3.5 px-4 text-zinc-400 max-w-[240px] truncate">{u.address}</td>
                        <td className="py-3.5 px-4">
                          {u.role === 'ADMIN' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20">
                              <Shield className="w-3 h-3" /> ADMIN
                            </span>
                          )}
                          {u.role === 'STORE_OWNER' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <Building2 className="w-3 h-3" /> STORE OWNER
                            </span>
                          )}
                          {u.role === 'USER' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                              <UserIcon className="w-3 h-3" /> NORMAL USER
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            {u.role === 'STORE_OWNER' && u.ownerRating ? (
                              <StarRating rating={u.ownerRating.averageRating} readOnly size="sm" />
                            ) : (
                              <span className="text-zinc-600 font-mono text-[11px]">N/A</span>
                            )}
                            <button
                              onClick={() => setSelectedUserId(u.id)}
                              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                              title="View Full Profile Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-3 bg-zinc-950/80 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
              <span>
                Page {usersPagination.page} of {usersPagination.totalPages || 1} ({usersPagination.total} total users)
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={usersPagination.page <= 1}
                  onClick={() => fetchUsers(usersPagination.page - 1)}
                  className="p-1.5 rounded bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={usersPagination.page >= usersPagination.totalPages}
                  onClick={() => fetchUsers(usersPagination.page + 1)}
                  className="p-1.5 rounded bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STORES DIRECTORY TAB */}
      {activeTab === 'stores' && (
        <div className="space-y-4">
          {/* Search Controls */}
          <div className="flex items-center justify-between bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none z-10" />
              <input
                type="text"
                value={storeSearch}
                onChange={(e) => setStoreSearch(e.target.value)}
                placeholder="Search stores by Name or Address..."
                className="input-field !pl-9 py-2 text-xs"
              />
            </div>
          </div>

          {/* Stores Table */}
          <div className="glass-card overflow-hidden border border-zinc-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="bg-zinc-950/80 uppercase text-[11px] text-zinc-400 font-semibold border-b border-zinc-800">
                  <tr>
                    <th className="py-3.5 px-4 cursor-pointer hover:text-white" onClick={() => toggleStoreSort('name')}>
                      <div className="flex items-center gap-1.5">
                        Store Name <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 cursor-pointer hover:text-white" onClick={() => toggleStoreSort('email')}>
                      <div className="flex items-center gap-1.5">
                        Email <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 cursor-pointer hover:text-white" onClick={() => toggleStoreSort('address')}>
                      <div className="flex items-center gap-1.5">
                        Address <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4">Owner</th>
                    <th className="py-3.5 px-4 cursor-pointer hover:text-white" onClick={() => toggleStoreSort('overallRating')}>
                      <div className="flex items-center gap-1.5">
                        Overall Rating <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {stores.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-zinc-500 font-medium">
                        No stores found.
                      </td>
                    </tr>
                  ) : (
                    stores.map((s) => (
                      <tr key={s.id} className="hover:bg-zinc-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-medium text-white">{s.name}</td>
                        <td className="py-3.5 px-4 text-zinc-400">{s.email}</td>
                        <td className="py-3.5 px-4 text-zinc-400 max-w-[260px] truncate">{s.address}</td>
                        <td className="py-3.5 px-4 text-zinc-300">
                          {s.owner ? s.owner.name : <span className="text-zinc-600 font-mono text-[11px]">Unassigned</span>}
                        </td>
                        <td className="py-3.5 px-4">
                          <StarRating rating={s.overallRating} readOnly size="sm" />
                          <span className="text-[10px] text-zinc-500 block">{s.totalRatings} ratings</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-3 bg-zinc-950/80 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
              <span>
                Page {storesPagination.page} of {storesPagination.totalPages || 1} ({storesPagination.total} total stores)
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={storesPagination.page <= 1}
                  onClick={() => fetchStores(storesPagination.page - 1)}
                  className="p-1.5 rounded bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={storesPagination.page >= storesPagination.totalPages}
                  onClick={() => fetchStores(storesPagination.page + 1)}
                  className="p-1.5 rounded bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddUserModal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        onSuccess={() => {
          fetchStats();
          fetchUsers(1);
        }}
      />

      <AddStoreModal
        isOpen={isAddStoreOpen}
        onClose={() => setIsAddStoreOpen(false)}
        onSuccess={() => {
          fetchStats();
          fetchStores(1);
        }}
      />

      <UserDetailModal
        userId={selectedUserId}
        isOpen={!!selectedUserId}
        onClose={() => setSelectedUserId(null)}
      />
    </div>
  );
};
