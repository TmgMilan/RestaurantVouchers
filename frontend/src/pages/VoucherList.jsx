import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import Layout from '../components/Layout';
import StatusBadge from '../components/StatusBadge';

const STATUS_FILTERS = ['all', 'active', 'redeemed', 'expired'];

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
    <Layout>
      <div className="max-w-3xl mx-auto px-6 py-8">

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-stone-900">Vouchers</h1>
          <Link
            to="/vouchers/create"
            className="flex items-center gap-1.5 bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-sm shadow-orange-600/30 hover:bg-orange-700 transition-colors no-underline"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M10 4a1 1 0 0 1 1 1v4h4a1 1 0 1 1 0 2h-4v4a1 1 0 1 1-2 0v-4H5a1 1 0 1 1 0-2h4V5a1 1 0 0 1 1-1Z" />
            </svg>
            New Voucher
          </Link>
        </div>

        <div className="flex gap-3 mb-4 flex-wrap items-center">
          <div className="relative flex-1 min-w-[220px]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2">
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.55 4.3l3.58 3.57a.75.75 0 1 1-1.06 1.06l-3.57-3.58A7 7 0 0 1 2 9Z" clipRule="evenodd" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email…"
              className="border border-stone-300 rounded-xl pl-9 pr-3 py-2 text-sm w-full bg-white transition-colors focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
            />
          </div>
          <select
            value={ordering}
            onChange={(e) => setOrdering(e.target.value)}
            className="border border-stone-300 rounded-xl px-3 py-2 text-sm text-stone-600 bg-white transition-colors focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 cursor-pointer"
          >
            <option value="-created_at">Newest first</option>
            <option value="created_at">Oldest first</option>
          </select>
        </div>

        <div className="inline-flex p-1 mb-6 bg-stone-100 rounded-xl gap-1">
          {STATUS_FILTERS.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium capitalize transition-all cursor-pointer ${
                statusFilter === s
                  ? 'bg-white text-orange-700 shadow-sm'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 text-sm mb-4">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex flex-col gap-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-[72px] bg-white border border-stone-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        )}

        {!loading && !error && vouchers.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-16">
            <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-stone-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-19.5 0v6a2.25 2.25 0 0 0 2.25 2.25h15a2.25 2.25 0 0 0 2.25-2.25v-6m-19.5 0a2.25 2.25 0 0 0 2.25 2.25h15a2.25 2.25 0 0 0 2.25-2.25m-19.5 0V9a2.25 2.25 0 0 1 2.25-2.25h15A2.25 2.25 0 0 1 21.75 9v3.75" />
              </svg>
            </div>
            <p className="text-stone-900 font-medium mb-1">No vouchers found</p>
            <p className="text-stone-500 text-sm">Try adjusting your search or filters.</p>
          </div>
        )}

        {!loading && !error && vouchers.length > 0 && (
          <div className="flex flex-col gap-3">
            {vouchers.map(v => (
              <Link
                to={`/vouchers/${v.id}`}
                key={v.id}
                className="group flex items-center gap-4 bg-white border border-stone-200 rounded-2xl px-5 py-4 hover:border-orange-200 hover:shadow-md hover:shadow-orange-100/60 transition-all no-underline"
              >
                <div className="w-10 h-10 rounded-full bg-amber-50 text-orange-700 flex items-center justify-center font-semibold text-sm shrink-0">
                  {v.recipient?.charAt(0).toUpperCase() || '?'}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-mono text-sm font-bold tracking-widest text-stone-900">
                      {v.code}
                    </span>
                    <StatusBadge status={v.status} />
                  </div>
                  <div className="flex items-center gap-3 text-sm text-stone-500">
                    <span className="truncate">{v.recipient}</span>
                    {v.email && <span className="truncate hidden sm:inline">{v.email}</span>}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-semibold text-orange-600">€{v.remaining_value}</p>
                  {v.remaining_value !== v.value && (
                    <p className="text-xs text-stone-400">of €{v.value}</p>
                  )}
                </div>

                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-stone-300 group-hover:text-orange-400 transition-colors shrink-0">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z" clipRule="evenodd" />
                </svg>
              </Link>
            ))}
          </div>
        )}

      </div>
    </Layout>
  );
}

export default VoucherList;
