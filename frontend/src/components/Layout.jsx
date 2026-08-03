import Navbar from './Navbar';

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-orange-50">
      <Navbar />
      {children}
    </div>
  );
}

export default Layout;
