export function RadarAnimation() {
  return (
    <div className="relative w-full max-w-[280px] sm:max-w-sm md:max-w-md mx-auto">
      <div className="relative aspect-square">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Concentric circles */}
          <div
            className="absolute w-full h-full rounded-full border-2 border-white/20 animate-ping"
            style={{ animationDuration: "3s" }}
          />
          <div className="absolute w-4/5 h-4/5 rounded-full border-2 border-white/30" />
          <div className="absolute w-3/5 h-3/5 rounded-full border-2 border-white/40" />
          <div className="absolute w-2/5 h-2/5 rounded-full border-2 border-white/50" />

          {/* Center dot */}
          <div className="absolute w-3 h-3 sm:w-4 sm:h-4 bg-[#FF6F61] rounded-full animate-pulse" />

          {/* User avatars */}
          <div
            className="absolute top-1/4 right-1/4 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full border-4 border-[#3EC8A7] flex items-center justify-center text-xs sm:text-sm font-semibold text-[#1E3A5F] animate-bounce"
            style={{ animationDuration: "2s" }}
          >
            A
          </div>
          <div
            className="absolute bottom-1/3 left-1/4 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full border-4 border-[#3EC8A7] flex items-center justify-center text-xs sm:text-sm font-semibold text-[#1E3A5F] animate-bounce"
            style={{ animationDuration: "2.5s", animationDelay: "0.5s" }}
          >
            B
          </div>
          <div
            className="absolute top-1/2 right-1/3 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full border-4 border-[#3EC8A7] flex items-center justify-center text-xs sm:text-sm font-semibold text-[#1E3A5F] animate-bounce"
            style={{ animationDuration: "3s", animationDelay: "1s" }}
          >
            C
          </div>
        </div>
      </div>
    </div>
  )
}
