import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/login');
  }

  return (
    <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-stone-200">
      <div className="max-w-3xl mx-auto px-6 py-3.5 flex items-center justify-between">
        <Link to="/vouchers" className="flex items-center no-underline">
          <span className="text-base font-semibold text-stone-900">Restaurant Vouchers</span>
        </Link>
        <button
          onClick={handleLogout}
          className="px-3.5 py-1.5 text-sm font-medium text-stone-500 rounded-lg hover:bg-stone-100 hover:text-stone-900 transition-colors cursor-pointer"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
