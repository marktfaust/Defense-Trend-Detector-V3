const Header = () => {
  return (
    <header className="text-center">
      <h1 className="text-6xl font-bold mb-8 text-slate-800">
        Defense Trend Detector
      </h1>
      <div className="flex justify-center gap-4">
        <a href="https://" target="_blank" rel="noopener noreferrer">
          <img src="/trend-svgrepo-com.svg" alt="Trend" className="w-20 h-20" />
        </a>
        <a href="https://" target="_blank" rel="noopener noreferrer">
          <img
            src="/fighter-jet-svgrepo-com.svg"
            alt="Jet"
            className="w-20 h-20"
          />
        </a>
      </div>
    </header>
  );
};

export default Header;
