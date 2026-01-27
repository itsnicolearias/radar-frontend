export function RadarAnimation() {
  return (
    <div className="relative w-full max-w-[320px] sm:max-w-sm md:max-w-md mx-auto">
      <div className="relative aspect-square">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Concentric circles */}
          <div
            className="absolute w-full h-full rounded-full border border-[#00FFB3]/20 animate-ping"
            style={{ animationDuration: "4s" }}
          />
          <div className="absolute w-full h-full rounded-full border border-[#00FFB3]/10" />
          <div className="absolute w-3/4 h-3/4 rounded-full border border-[#00FFB3]/15" />
          <div className="absolute w-1/2 h-1/2 rounded-full border border-[#00FFB3]/20" />
          <div className="absolute w-1/4 h-1/4 rounded-full border border-[#00FFB3]/30" />

          {/* Scanning line */}
          <div
            className="absolute w-1/2 h-1/2 origin-bottom-right top-0 left-0 border-r-2 border-t-2 border-[#00FFB3]/40 rounded-tr-full animate-[spin_4s_linear_infinite]"
            style={{ background: 'conic-gradient(from 0deg, transparent, rgba(0, 255, 179, 0.1))' }}
          />

          {/* Center dot */}
          <div className="absolute w-4 h-4 bg-[#00FFB3] rounded-full shadow-[0_0_15px_#00FFB3] z-10" />

          {/* User avatars (floating) */}
          <div
            className="absolute top-[20%] right-[25%] w-12 h-12 bg-[#1A1A1A] rounded-full border-2 border-[#00FFB3] flex items-center justify-center text-sm font-bold text-white shadow-[0_0_10px_rgba(0,255,179,0.3)] animate-bounce"
            style={{ animationDuration: "3s" }}
          >
            A
          </div>
          <div
            className="absolute bottom-[30%] left-[20%] w-12 h-12 bg-[#1A1A1A] rounded-full border-2 border-[#1DE3F2] flex items-center justify-center text-sm font-bold text-white shadow-[0_0_10px_rgba(29,227,242,0.3)] animate-bounce"
            style={{ animationDuration: "3.5s", animationDelay: "0.5s" }}
          >
            B
          </div>
          <div
            className="absolute top-[55%] right-[15%] w-10 h-10 bg-[#1A1A1A] rounded-full border-2 border-[#FF005C] flex items-center justify-center text-xs font-bold text-white shadow-[0_0_10px_rgba(255,0,92,0.3)] animate-bounce"
            style={{ animationDuration: "4s", animationDelay: "1s" }}
          >
            C
          </div>
        </div>
      </div>
    </div>
  )
}
