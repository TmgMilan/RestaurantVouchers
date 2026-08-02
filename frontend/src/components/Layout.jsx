import Navbar from './Navbar';

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className="page">{children}</main>
    </>
  );
}

export default Layout;
