/**
 * Header — Full-width navigation. Logo far left, nav far right.
 */

import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/negotiate', label: 'Analyze' },
    { to: '/about', label: 'About' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-slate-100">
      <div className="header-container">
        <div className="flex items-center justify-between h-14">

          {/* Logo — far left */}
          <Link to="/" className="flex items-center space-x-2.5">
            <img src="/logo.png" alt="Robin-Hood AI" className="w-8 h-8 object-contain" />
            <span className="font-display font-bold text-[15px] text-slate-800 tracking-tight">
              Robin-Hood <span className="text-robin-600">AI</span>
            </span>
          </Link>

          {/* Nav — far right */}
          <nav className="flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition-colors duration-150
                    ${isActive
                      ? 'bg-robin-50 text-robin-700'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

        </div>
      </div>
    </header>
  );
}
