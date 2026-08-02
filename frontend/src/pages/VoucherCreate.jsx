import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import Navbar from '../components/Navbar';

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

  const inputClass = "border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-purple-500";
  const labelClass = "text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-lg mx-auto px-6 py-8">

        <Link to="/vouchers" className="text-sm text-gray-500 hover:text-gray-700 no-underline">
          ← All Vouchers
        </Link>

        <h1 className="text-2xl font-semibold text-gray-900 mt-4 mb-6">New Voucher</h1>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-8 flex flex-col gap-4">

          {errors && (
            <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 text-sm">
              {Object.entries(errors).map(([field, messages]) => (
                <div key={field}>
                  <strong>{field}:</strong> {Array.isArray(messages) ? messages.join(', ') : messages}
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col">
            <label className={labelClass}>Recipient *</label>
            <input className={inputClass} name="recipient" value={formData.recipient} onChange={handleChange} required />
          </div>

          <div className="flex flex-col">
            <label className={labelClass}>Email</label>
            <input className={inputClass} type="email" name="email" value={formData.email} onChange={handleChange} />
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
              className="bg-purple-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Creating…' : 'Create Voucher'}
            </button>
            <Link
              to="/vouchers"
              className="border border-gray-300 text-gray-600 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 no-underline"
            >
              Cancel
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}

export default VoucherCreate;
