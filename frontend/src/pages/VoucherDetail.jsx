import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../api/api';
import Layout from '../components/Layout';
import StatusBadge from '../components/StatusBadge';

function VoucherDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [voucher, setVoucher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [redeeming, setRedeeming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [redeemAmount, setRedeemAmount] = useState('');
  const [redeemError, setRedeemError] = useState(null);

  useEffect(() => {
    async function fetchVoucher() {
      const response = await api(`/api/vouchers/${id}/`);
      if (!response.ok) {
        setError('Voucher not found');
        setLoading(false);
        return;
      }
      const data = await response.json();
      setVoucher(data);
      setLoading(false);
    }
    fetchVoucher();
  }, [id]);

  async function handleRedeem(e) {
    e.preventDefault();
    setRedeemError(null);
    setRedeeming(true);
    const response = await api(`/api/vouchers/${id}/redeem/`, {
      method: 'POST',
      body: JSON.stringify({ amount: redeemAmount || voucher.remaining_value }),
    });
    const data = await response.json();
    if (response.ok) {
      setVoucher(data);
      setRedeemAmount('');
    } else {
      setRedeemError(data.error || 'Could not redeem voucher');
    }
    setRedeeming(false);
  }

  async function handleDelete() {
    if (!window.confirm('Delete this voucher? This cannot be undone.')) return;
    setDeleting(true);
    const response = await api(`/api/vouchers/${id}/`, { method: 'DELETE' });
    if (response.ok || response.status === 204) {
      navigate('/vouchers');
    } else {
      setDeleting(false);
    }
  }

  const inputClass = "border border-stone-300 rounded-xl px-3 py-2 text-sm w-32 transition-colors focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10";

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-6 py-8">

        <Link to="/vouchers" className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-900 transition-colors no-underline">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 0 1-.02 1.06L8.832 10l3.938 3.71a.75.75 0 1 1-1.04 1.08l-4.5-4.25a.75.75 0 0 1 0-1.08l4.5-4.25a.75.75 0 0 1 1.06.02Z" clipRule="evenodd" />
          </svg>
          All Vouchers
        </Link>

        {loading && (
          <div className="h-64 mt-6 bg-white border border-stone-200 rounded-2xl animate-pulse" />
        )}

        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 text-sm mt-6">
            {error}
          </div>
        )}

        {voucher && (
          <div className="mt-6 bg-white border border-stone-200 rounded-2xl p-8 shadow-sm shadow-stone-200/50">

            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-amber-50 text-orange-700 flex items-center justify-center font-semibold shrink-0">
                  {voucher.recipient?.charAt(0).toUpperCase() || '?'}
                </div>
                <div>
                  <span className="block font-mono text-xl font-bold tracking-widest text-stone-900">
                    {voucher.code}
                  </span>
                  <StatusBadge status={voucher.status} />
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-right">
                  <span className="text-3xl font-bold text-orange-600">€{voucher.remaining_value}</span>
                  {voucher.remaining_value !== voucher.value && (
                    <p className="text-xs text-stone-400">of €{voucher.value}</p>
                  )}
                </div>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  title="Delete voucher"
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 transition-colors cursor-pointer shrink-0"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {voucher.value > 0 && (
              <div className="w-full bg-stone-100 rounded-full h-1.5 mt-4 mb-8 overflow-hidden">
                <div
                  className="bg-orange-600 h-full rounded-full transition-all"
                  style={{ width: `${(voucher.remaining_value / voucher.value) * 100}%` }}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-xs uppercase tracking-wider text-stone-400 mb-1">Recipient</p>
                <p className="text-stone-900">{voucher.recipient}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-stone-400 mb-1">Email</p>
                <p className="text-stone-900">{voucher.email || '—'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-stone-400 mb-1">Created</p>
                <p className="text-stone-900">{new Date(voucher.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-stone-400 mb-1">Expires</p>
                <p className="text-stone-900">
                  {voucher.expiry_date ? new Date(voucher.expiry_date).toLocaleDateString() : 'No expiry'}
                </p>
              </div>
              {voucher.redeemed_at && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-stone-400 mb-1">Last Redeemed At</p>
                  <p className="text-stone-900">{new Date(voucher.redeemed_at).toLocaleString()}</p>
                </div>
              )}
              {voucher.note && (
                <div className="col-span-2">
                  <p className="text-xs uppercase tracking-wider text-stone-400 mb-1">Note</p>
                  <p className="text-stone-900">{voucher.note}</p>
                </div>
              )}
            </div>

            {voucher.status === 'active' && (
              <form onSubmit={handleRedeem} className="flex items-end gap-3 pt-6 border-t border-stone-100">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-stone-700 mb-1">Redeem amount (€)</label>
                  <input
                    type="number"
                    min="0.01"
                    max={voucher.remaining_value}
                    step="0.01"
                    placeholder={voucher.remaining_value}
                    value={redeemAmount}
                    onChange={(e) => setRedeemAmount(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <button
                  type="submit"
                  disabled={redeeming}
                  className="bg-orange-600 text-white px-5 py-2 rounded-xl text-sm font-medium shadow-sm shadow-orange-600/30 hover:bg-orange-700 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {redeeming ? 'Redeeming…' : 'Redeem Voucher'}
                </button>
              </form>
            )}
            {redeemError && (
              <p className="text-red-600 text-sm mt-3">{redeemError}</p>
            )}

            {voucher.redemptions && voucher.redemptions.length > 0 && (
              <div className="pt-6 mt-6 border-t border-stone-100">
                <p className="text-xs uppercase tracking-wider text-stone-400 mb-4">
                  Redemption History ({voucher.redemption_count}x)
                </p>
                <div className="flex flex-col">
                  {voucher.redemptions.map((r, i) => (
                    <div key={r.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <span className="w-2.5 h-2.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                        {i < voucher.redemptions.length - 1 && (
                          <span className="w-px flex-1 bg-stone-200 my-0.5" />
                        )}
                      </div>
                      <div className="flex items-center justify-between text-sm flex-1 pb-4">
                        <span className="text-stone-500">{new Date(r.redeemed_at).toLocaleString()}</span>
                        <span className="font-semibold text-stone-900">€{r.amount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </Layout>
  );
}

export default VoucherDetail;
