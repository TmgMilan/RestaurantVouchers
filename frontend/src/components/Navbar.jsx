import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/login');
  }

  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-200">
      <Link to="/vouchers" className="text-lg font-semibold text-gray-900 no-underline">
        Restaurant Vouchers
      </Link>
      <button
        onClick={handleLogout}
        className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 cursor-pointer"
      >
        Logout
      </button>
    </nav>
  );
}

export default Navbar;
