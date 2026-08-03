import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const response = await fetch('http://127.0.0.1:8000/api/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.detail || 'Invalid username or password');
      setLoading(false);
      return;
    }

    localStorage.setItem('access', data.access);
    localStorage.setItem('refresh', data.refresh);
    navigate('/vouchers');
  }

  const inputClass = "border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm transition-colors focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 via-white to-orange-50 px-4">
      <div className="w-full max-w-sm">

        <div className="flex flex-col items-center mb-6">
          <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-700 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-orange-600/20 mb-3">
            RV
          </span>
          <h2 className="text-xl font-semibold text-stone-900">Welcome back</h2>
          <p className="text-sm text-stone-500 mt-1">Sign in to manage your vouchers</p>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-xl shadow-stone-200/50">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-stone-700">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
                required
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-stone-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-orange-600 text-white rounded-xl py-2.5 text-sm font-medium shadow-sm shadow-orange-600/30 hover:bg-orange-700 active:bg-orange-800 disabled:opacity-50 transition-colors cursor-pointer mt-1"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Login;
