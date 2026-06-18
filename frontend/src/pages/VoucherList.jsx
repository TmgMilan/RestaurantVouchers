import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';

function VoucherList(){
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchVouchers() {
      const response = await api('/api/vouchers');

      if(!response.ok){
        setError('Could not load vouchers');
        setLoading(false);
        return;
      }

      const data = await response.json();
      setVouchers(data);
      setLoading(false);
    }

    fetchVouchers();
  }, []);

  if(loading){
    return <p> currently loading... </p>;
  }
  if (error) return <p>{error}</p>;

  return (
  <div>
      <h1>Current Vouchers</h1>
      <Link to="/vouchers/create"> ADD vouchers</Link>
      <ul>
        {vouchers.map(voucher => (
          <li key={voucher.id}>
            <Link to={`/vouchers/${voucher.id}`}>{voucher.id}</Link>
            <p><strong>Code:</strong> {voucher.code}</p>
            <p><strong>Email:</strong> {voucher.email}</p>
            <p><strong>Value:</strong> €{voucher.value}</p>
            <p><strong>Status:</strong> {voucher.status}</p>
          </li>
        ))}
      </ul>
  </div>
  )
}


export default VoucherList;
