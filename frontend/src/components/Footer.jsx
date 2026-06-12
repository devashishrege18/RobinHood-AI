/**
 * Footer — Minimal. Full-width like the header.
 */

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-slate-50/50">
      <div className="header-container py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="Robin-Hood AI" className="w-5 h-5 object-contain" />
            <span className="text-slate-500 text-sm font-medium">Robin-Hood AI</span>
          </div>
          <p className="text-slate-400 text-xs tracking-wide">
            Voice-first &middot; Local Language &middot; Built for Bharat
          </p>
        </div>
      </div>
    </footer>
  );
}
