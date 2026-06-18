import { useState } from 'react';
import { navigate } from 'react-router-dom';
import api from '../api/api';

function VoucherCreate() {
  const [formComps, setFormComps] = useState({
    email: '',
    recipient: '',
    value: '',
    note: '',
    status: 'active',
    redeemed_at: '',
    expiry_date: '' 
  })

  const [error, setError] = useState(null);
  const navigate = navigate();
  
  function handleChange(e){
    setFormComps({...formComps, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e){
    e.preventDefault();
    setError(null);

    const response = await api('/api/vouchers/', {
      method: 'POST',
      body: JSON.stringify(formComps),
    });

    if (!response.ok){
      const data = await response.json();
      setError(data);
      return;
    }

    const newVoucher = await response.json();
    navigate(`/vouchers/${newVoucher.id}`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1> ADD Voucher</h1>
      {error &&  (
        <ul>
          {Object.entries(error).map(([field, messages]) => (
          <li key={field}><strong>{field}:</strong> {messages.join(', ')}</li>
          ))
          }
        </ul>)}

      <div>
        <label>Email</label>
        <input name='email' value={formComps.email} onChange={handleChange} />
      </div>

      <div>
        <label>Recepient</label>
        <input name='recipient' value={formComps.recipient} onChange={handleChange}/>
      </div>

      <div>
        <label>
          Value
        </label>
        <input name='value' value={formComps.value} onChange={handleChange}/>
      </div>

      <div>
        <label>Recepient</label>
        <input name='recipient' value={formComps.recipient} onChange={handleChange}/>
      </div>
    </form> 
  )
}

export default VoucherCreate;
