export default function StatusBar() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');

  return (
    <div className="absolute top-0 left-0 right-0 h-11 px-6 flex items-center justify-between z-40 text-white text-sm">
      {/* Left: Time */}
      <div className="flex-1">
        <span className="drop-shadow-sm">{hours}:{minutes}</span>
      </div>

      {/* Center: Dynamic Island space */}
      <div className="w-[126px]" />

      {/* Right: Status icons */}
      <div className="flex-1 flex items-center justify-end gap-1.5">
        {/* Signal */}
        <svg className="w-4 h-3.5 drop-shadow-sm" viewBox="0 0 16 14" fill="currentColor">
          <circle cx="2" cy="12" r="1.5" />
          <circle cx="6" cy="10" r="1.5" />
          <circle cx="10" cy="7" r="1.5" />
          <circle cx="14" cy="3.5" r="1.5" />
        </svg>

        {/* WiFi */}
        <svg className="w-4 h-3.5 drop-shadow-sm" viewBox="0 0 16 14" fill="currentColor">
          <path d="M8 12c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1zm-3.5-3.5c0-.28.22-.5.5-.5 1.1 0 2 .9 2 2 0 .28-.22.5-.5.5s-.5-.22-.5-.5c0-.55-.45-1-1-1-.28 0-.5-.22-.5-.5zm3-3c0-.28.22-.5.5-.5 2.21 0 4 1.79 4 4 0 .28-.22.5-.5.5s-.5-.22-.5-.5c0-1.66-1.34-3-3-3-.28 0-.5-.22-.5-.5zm3-3c0-.28.22-.5.5-.5 3.31 0 6 2.69 6 6 0 .28-.22.5-.5.5s-.5-.22-.5-.5c0-2.76-2.24-5-5-5-.28 0-.5-.22-.5-.5z"/>
        </svg>

        {/* Battery */}
        <div className="flex items-center gap-0.5">
          <svg className="w-6 h-3 drop-shadow-sm" viewBox="0 0 24 12" fill="none">
            <rect x="0.5" y="1.5" width="18" height="9" rx="2" stroke="currentColor" strokeWidth="1" />
            <rect x="2" y="3" width="15" height="6" rx="1" fill="currentColor" />
            <path d="M19 4.5V7.5C19.8 7.5 20.5 6.8 20.5 6V6C20.5 5.2 19.8 4.5 19 4.5Z" fill="currentColor" />
          </svg>
          <span className="text-xs drop-shadow-sm">87%</span>
        </div>
      </div>
    </div>
  );
}
