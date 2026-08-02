import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../api/api';
import Navbar from '../components/Navbar';

const badgeClass = {
  active:   'bg-green-100 text-green-800',
  redeemed: 'bg-blue-100 text-blue-800',
  expired:  'bg-red-100 text-red-800',
};

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-8">

        <Link to="/vouchers" className="text-sm text-gray-500 hover:text-gray-700 no-underline">
          ← All Vouchers
        </Link>

        {loading && <p className="text-gray-500 text-sm mt-6">Loading…</p>}

        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 text-sm mt-6">
            {error}
          </div>
        )}

        {voucher && (
          <div className="mt-6 bg-white border border-gray-200 rounded-2xl p-8">

            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <span className="font-mono text-2xl font-bold tracking-widest text-gray-900">
                  {voucher.code}
                </span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${badgeClass[voucher.status] || 'bg-gray-100 text-gray-700'}`}>
                  {voucher.status}
                </span>
              </div>
              <div className="text-right">
                <span className="text-3xl font-bold text-purple-600">€{voucher.remaining_value}</span>
                {voucher.remaining_value !== voucher.value && (
                  <p className="text-xs text-gray-400">of €{voucher.value}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Recipient</p>
                <p className="text-gray-900">{voucher.recipient}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Email</p>
                <p className="text-gray-900">{voucher.email || '—'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Created</p>
                <p className="text-gray-900">{new Date(voucher.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Expires</p>
                <p className="text-gray-900">
                  {voucher.expiry_date ? new Date(voucher.expiry_date).toLocaleDateString() : 'No expiry'}
                </p>
              </div>
              {voucher.redeemed_at && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Last Redeemed At</p>
                  <p className="text-gray-900">{new Date(voucher.redeemed_at).toLocaleString()}</p>
                </div>
              )}
              {voucher.note && (
                <div className="col-span-2">
                  <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Note</p>
                  <p className="text-gray-900">{voucher.note}</p>
                </div>
              )}
            </div>

            {voucher.status === 'active' && (
              <form onSubmit={handleRedeem} className="flex items-end gap-3 pt-6 border-t border-gray-100">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">Redeem amount (€)</label>
                  <input
                    type="number"
                    min="0.01"
                    max={voucher.remaining_value}
                    step="0.01"
                    placeholder={voucher.remaining_value}
                    value={redeemAmount}
                    onChange={(e) => setRedeemAmount(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-32 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={redeeming}
                  className="bg-purple-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 cursor-pointer"
                >
                  {redeeming ? 'Redeeming…' : 'Redeem Voucher'}
                </button>
              </form>
            )}
            {redeemError && (
              <p className="text-red-600 text-sm mt-3">{redeemError}</p>
            )}

            <div className="flex gap-3 pt-6 mt-6 border-t border-gray-100">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-50 text-red-600 border border-red-200 px-5 py-2 rounded-lg text-sm font-medium hover:bg-red-100 disabled:opacity-50 cursor-pointer"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>

            {voucher.redemptions && voucher.redemptions.length > 0 && (
              <div className="pt-6 mt-6 border-t border-gray-100">
                <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">
                  Redemption History ({voucher.redemption_count}x)
                </p>
                <div className="flex flex-col gap-2">
                  {voucher.redemptions.map(r => (
                    <div key={r.id} className="flex items-center justify-between text-sm bg-gray-50 rounded-lg px-4 py-2">
                      <span className="text-gray-500">{new Date(r.redeemed_at).toLocaleString()}</span>
                      <span className="font-semibold text-gray-900">€{r.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}

export default VoucherDetail;
