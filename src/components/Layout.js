export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-xl font-semibold">GPS LIVE</h1>
      </header>
      <main className="flex-grow">{children}</main>
      <footer className="bg-gray-800 text-white text-center p-2">
        &copy; {new Date().getFullYear()} GPS LIVE
      </footer>
    </div>
  );
}
