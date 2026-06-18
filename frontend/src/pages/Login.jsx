import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const response = await fetch('http://localhost:8000/api/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      setError('Invalid username or password.');
      return;
    }

    const tokens = await response.json();
    localStorage.setItem('access', tokens.access);
    localStorage.setItem('refresh', tokens.refresh);

    navigate('/vouchers');
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
      </div>

      <div>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>

      <button type="submit">Log in</button>
    </form>
  );
}

export default Login;
