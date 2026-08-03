import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import Layout from '../components/Layout';

function VoucherCreate() {
  const [formData, setFormData] = useState({
    recipient: '',
    email: '',
    value: '',
    note: '',
    expiry_date: '',
  });
  const [errors, setErrors] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors(null);
    setSubmitting(true);

    const payload = {
      ...formData,
      expiry_date: formData.expiry_date || null,
    };

    const response = await api('/api/vouchers/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json();
      setErrors(data);
      setSubmitting(false);
      return;
    }

    const newVoucher = await response.json();
    navigate(`/vouchers/${newVoucher.id}`);
  }

  const inputClass = "border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm w-full transition-colors focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10";
  const labelClass = "text-sm font-medium text-stone-700 mb-1.5";

  return (
    <Layout>
      <div className="max-w-lg mx-auto px-6 py-8">

        <Link to="/vouchers" className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-900 transition-colors no-underline">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 0 1-.02 1.06L8.832 10l3.938 3.71a.75.75 0 1 1-1.04 1.08l-4.5-4.25a.75.75 0 0 1 0-1.08l4.5-4.25a.75.75 0 0 1 1.06.02Z" clipRule="evenodd" />
          </svg>
          All Vouchers
        </Link>

        <h1 className="text-2xl font-semibold text-stone-900 mt-4 mb-6">New Voucher</h1>

        <form onSubmit={handleSubmit} className="bg-white border border-stone-200 rounded-2xl p-8 flex flex-col gap-4 shadow-sm shadow-stone-200/50">

          {errors && (
            <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 text-sm">
              {Object.entries(errors).map(([field, messages]) => (
                <div key={field}>
                  <strong>{field}:</strong> {Array.isArray(messages) ? messages.join(', ') : messages}
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className={labelClass}>Recipient *</label>
              <input className={inputClass} name="recipient" value={formData.recipient} onChange={handleChange} required />
            </div>
            <div className="flex flex-col">
              <label className={labelClass}>Value (€) *</label>
              <input
                className={inputClass}
                type="number"
                min="0.01"
                step="0.01"
                name="value"
                value={formData.value}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className={labelClass}>Email</label>
            <input className={inputClass} type="email" name="email" value={formData.email} onChange={handleChange} />
          </div>

          <div className="flex flex-col">
            <label className={labelClass}>Note</label>
            <textarea className={inputClass} name="note" value={formData.note} onChange={handleChange} rows={3} />
          </div>

          <div className="flex flex-col">
            <label className={labelClass}>Expiry Date</label>
            <input className={inputClass} type="date" name="expiry_date" value={formData.expiry_date} onChange={handleChange} />
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-sm shadow-orange-600/30 hover:bg-orange-700 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {submitting ? 'Creating…' : 'Create Voucher'}
            </button>
            <Link
              to="/vouchers"
              className="border border-stone-300 text-stone-600 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-stone-50 transition-colors no-underline"
            >
              Cancel
            </Link>
          </div>

        </form>
      </div>
    </Layout>
  );
}

export default VoucherCreate;
