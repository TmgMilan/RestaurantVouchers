import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import Navbar from '../components/Navbar';

const STATUS_FILTERS = ['all', 'active', 'redeemed', 'expired'];

const badgeClass = {
  active:   'bg-green-100 text-green-800',
  redeemed: 'bg-blue-100 text-blue-800',
  expired:  'bg-red-100 text-red-800',
};

function VoucherList() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [ordering, setOrdering] = useState('-created_at');

  useEffect(() => {
    const timeout = setTimeout(async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (search) params.set('search', search);
      if (ordering) params.set('ordering', ordering);

      const response = await api(`/api/vouchers/?${params.toString()}`);

      if (!response.ok) {
        setError('Could not load vouchers');
        setLoading(false);
        return;
      }

      const data = await response.json();
      setVouchers(data);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [statusFilter, search, ordering]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-8">

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Vouchers</h1>
          <Link
            to="/vouchers/create"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 no-underline"
          >
            + New Voucher
          </Link>
        </div>

        <div className="flex gap-3 mb-6 flex-wrap items-center">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm flex-1 min-w-[200px] focus:outline-none focus:border-purple-500"
          />
          <select
            value={ordering}
            onChange={(e) => setOrdering(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="-created_at">Newest first</option>
            <option value="created_at">Oldest first</option>
          </select>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {STATUS_FILTERS.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-1.5 rounded-full text-sm border cursor-pointer transition-colors ${
                statusFilter === s
                  ? 'bg-purple-100 border-purple-300 text-purple-700'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {loading && <p className="text-gray-500 text-sm">Loading…</p>}
        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}
        {!loading && !error && vouchers.length === 0 && (
          <p className="text-gray-500 text-sm">No vouchers found.</p>
        )}

        <div className="flex flex-col gap-3">
          {vouchers.map(v => (
            <Link
              to={`/vouchers/${v.id}`}
              key={v.id}
              className="bg-white border border-gray-200 rounded-xl px-5 py-4 hover:shadow-md transition-shadow no-underline"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-base font-bold tracking-widest text-gray-900">
                  {v.code}
                </span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${badgeClass[v.status] || 'bg-gray-100 text-gray-700'}`}>
                  {v.status}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{v.recipient}</span>
                {v.email && <span>{v.email}</span>}
                <span className="ml-auto font-semibold text-purple-600">€{v.value}</span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}

export default VoucherList;
