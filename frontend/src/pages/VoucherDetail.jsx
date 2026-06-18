import { useParams, Link } from 'react-router-dom';
import api from '../api/api';
import { useState, useEffect } from 'react';

function VoucherDetail() {
  const { id } = useParams();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voucher, setVoucher] = useState(null);


  useEffect(()=> {
    async function fetchVoucher(){
      const response = await api(`/api/vouchers/${id}/`);

      if (!response.ok){
        setError('Voucher doesnt exist with this id');
        setLoading(false);
        return;
      }

      const data = await response.json();
      setVoucher(data);
      setLoading(false);
    }

    fetchVoucher();
  }, [id]);

  if (loading) return <p> loading ... </p>;
  if (error) return <p>{error}</p>;


  return (
    <div>
      <Link to='/vouchers'>Go back to All Vouchers</Link>
      <p><strong>Code:</strong> {voucher.code}</p>
      <p><strong>Recipient:</strong> {voucher.recipient}</p>
      <p><strong>Email:</strong> {voucher.email}</p>
      <p><strong>Value:</strong> €{voucher.value}</p>
      <p><strong>Note:</strong> {voucher.note}</p>
      <p><strong>Status:</strong> {voucher.status}</p>
      <p><strong>Created:</strong> {new Date(voucher.created_at).toLocaleString()}</p>
      <p><strong>Redeemed:</strong> {voucher.redeemed_at ? new Date(voucher.redeemed_at).toLocaleString() : 'Not redeemed'}</p>
      <p><strong>Expires:</strong> {voucher.expiry_date ? new Date(voucher.expiry_date).toLocaleDateString() : 'No expiry'}</p>
    </div>
  )
}

export default VoucherDetail;
