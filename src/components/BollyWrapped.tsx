import React, { useState } from "react";
import { 
  Trophy, Sparkles, Heart, ChevronRight, ChevronLeft, 
  RotateCcw, BarChart3, Award, Music, Film, Clock, Play, User 
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie } from "recharts";

interface BollyWrappedProps {
  userProfile: {
    xp: number;
    level: number;
    badges: string[];
    reviewCount: number;
  };
  theme: "dark" | "light";
}

export default function BollyWrapped({ userProfile, theme }: BollyWrappedProps) {
  const [slideIndex, setSlideIndex] = useState(0);

  const GENRE_DATA = [
    { name: "Romance", value: 38, color: "#E50914" },
    { name: "Comedy", value: 28, color: "#F59E0B" },
    { name: "Thriller", value: 18, color: "#8B5CF6" },
    { name: "Family Time", value: 16, color: "#10B981" }
  ];

  const totalSlides = 5;

  const handleNext = () => {
    if (slideIndex < totalSlides - 1) {
      setSlideIndex(slideIndex + 1);
    }
  };

  const handlePrev = () => {
    if (slideIndex > 0) {
      setSlideIndex(slideIndex - 1);
    }
  };

  const handleReset = () => {
    setSlideIndex(0);
  };

  return (
    <div className={`p-6 md:p-8 rounded-3xl border transition-all duration-300 ${
      theme === "dark" 
        ? "bg-slate-950 border-white/5 text-white" 
        : "bg-white border-stone-200 text-stone-900 shadow-md"
    }`} id="wrapped-voyage-sandbox">
      
      {/* Film track highlight */}
      <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500 opacity-20" style={{
        backgroundImage: "radial-gradient(circle, #fff 1.5px, transparent 2px)"
      }} />

      {/* Main Header */}
      <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
        <div>
          <span className="text-[10px] font-mono uppercase bg-red-650/15 text-red-500 px-2 py-0.5 rounded border border-red-500/20">
            ★ Annual Analytics Report ★
          </span>
          <h2 className="text-xl md:text-2xl font-display font-black tracking-tight mt-1.5 flex items-center gap-1.5">
            <BarChart3 className="w-5 h-5 text-red-500" />
            My Bollywood Wrapped 2026
          </h2>
        </div>

        {/* Slides indicators dots */}
        <div className="flex gap-1.5">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <div 
              key={idx} 
              onClick={() => setSlideIndex(idx)}
              className={`h-2.5 rounded-full cursor-pointer transition-all duration-300 ${
                slideIndex === idx ? "w-6 bg-[#E50914]" : "w-2.5 bg-stone-700 hover:bg-stone-500"
              }`} 
            />
          ))}
        </div>
      </div>

      {/* DYNAMIC METRIC SLIDES CONTAINERS */}
      <div className="min-h-[380px] bg-gradient-to-tr from-slate-950 via-slate-900 to-black rounded-3xl border border-white/5 relative overflow-hidden flex flex-col justify-between p-6 md:p-8 shadow-2xl">
        
        {/* SLIDE 0: SPLASH GREETINGS */}
        {slideIndex === 0 && (
          <div className="space-y-4 my-auto text-center max-w-xl mx-auto animate-fadeIn">
            <span className="text-[11px] font-mono text-amber-400 font-extrabold uppercase bg-amber-400/10 border border-amber-400/25 px-3 py-1 rounded inline-block animate-pulse">
              🎥 THE CURTAIN SPEAKS FOR YOU 🎥
            </span>
            <h3 className="text-3xl md:text-4xl font-display font-black tracking-tight text-white leading-tight">
              Arey Dosto! Welcome to Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-650 to-amber-500">Bollyverse Wrapped</span>
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed max-w-md mx-auto">
              Your melodies, your critical watchlist scores, your cinema aura, and earned badges compressed into a magical retro cinematic storybook!
            </p>
            <div className="pt-4">
              <button 
                onClick={handleNext}
                className="py-3 px-6 bg-[#E50914] text-white font-bold text-xs rounded-xl hover:bg-red-700 transition cursor-pointer flex items-center gap-1.5 mx-auto shadow-md shadow-red-650/20"
              >
                Let's Open The Curtains
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        )}

        {/* SLIDE 1: TOTAL MINUTES & JUKEBOX HOURS */}
        {slideIndex === 1 && (
          <div className="space-y-5 my-auto animate-slideUp grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-3">
              <span className="text-[10px] font-mono text-red-500 font-extrabold pb-0.5 border-b-2 border-red-500/30 uppercase tracking-widest block">
                Acoustic Aura & Timings
              </span>
              <h4 className="text-2xl md:text-3xl font-display font-black text-white leading-tight">
                You Spent <span className="text-amber-400">174 Jukebox Hours</span> Tuned to Pure Bollywood Beats!
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed leading-relaxed font-sans">
                That's more listening hours than 94% of standard cinema fans on our platform! You deep-dived into classic loops and traditional acoustics to nourish your daily soul.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="bg-white/10 px-3 py-1 rounded-full text-[11px] font-semibold text-white">
                  🎧 Top Genre: Romantics
                </span>
                <span className="bg-white/10 px-3 py-1 rounded-full text-[11px] font-semibold text-white">
                  🎤 Top Singer: Arijit Singh
                </span>
              </div>
            </div>

            <div className="bg-black/60 border border-stone-850 p-5 rounded-3xl text-center space-y-3 shadow-inner relative overflow-hidden flex flex-col justify-center items-center">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-650/10 rounded-full filter blur-lg pointer-events-none" />
              <div className="w-16 h-16 bg-gradient-to-tr from-[#E50914] to-pink-500 rounded-full flex items-center justify-center border-2 border-white animate-spin-slow">
                <Music className="w-7 h-7 text-white fill-current" />
              </div>
              <div>
                <span className="text-[9px] text-[#E50914] font-mono uppercase font-black tracking-wider block">Your Ultimate Hit Anthem:</span>
                <strong className="text-base text-white font-sans mt-0.5 block">"Tujhe Dekha Toh Yeh Jaana"</strong>
                <span className="text-[10px] text-stone-400 font-mono">1995 • Dilwale Dulhania Le Jayenge</span>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 2: FAV STARS & MAGNETS */}
        {slideIndex === 2 && (
          <div className="space-y-4 my-auto animate-slideUp grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-3">
              <span className="text-[10px] font-mono text-pink-500 font-extrabold pb-0.5 border-b-2 border-pink-500/30 uppercase tracking-widest block">
                Your Star Magnet Affinity
              </span>
              <h4 className="text-2xl md:text-3xl font-display font-black text-white leading-tight">
                Your Heart Belongs To the <span className="text-pink-400">King of Romance (SRK)</span>
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed leading-relaxed font-sans">
                You watched, hummed, and critiqued Shah Rukh Khan masterpieces 12 times this decade! His emotional eye-contact and signature stretch-arms poses secure your highest spiritual rating scores.
              </p>
              <div className="p-3 bg-pink-950/20 border border-pink-500/20 rounded-2xl text-[10px] text-pink-300 leading-relaxed font-serif italic">
                "Bade bade deshon mein, aisi chhoti chhoti baatein hoti rehti hain, Senorita."
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-[#121212] border border-stone-850 p-4 rounded-3xl space-y-1">
                <div className="text-2xl">👑</div>
                <strong className="text-xs text-white block">Shah Rukh Khan</strong>
                <span className="text-[9px] text-stone-400 uppercase font-mono">Fav Actor (98% match)</span>
              </div>
              <div className="bg-[#121212] border border-stone-850 p-4 rounded-3xl space-y-1">
                <div className="text-2xl">💃</div>
                <strong className="text-xs text-white block">Deepika Padukone</strong>
                <span className="text-[9px] text-stone-400 uppercase font-mono">Fav Actress (94% match)</span>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 3: VISUAL GENRES PIE-CHART */}
        {slideIndex === 3 && (
          <div className="space-y-4 my-auto animate-slideUp grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-3">
              <span className="text-[10px] font-mono text-purple-400 font-extrabold pb-0.5 border-b-2 border-purple-500/30 uppercase tracking-widest block">
                Visual Genre Preferences
              </span>
              <h4 className="text-2xl md:text-3xl font-display font-black text-white leading-tight">
                A Diverse <span className="text-purple-400">Masala Profile</span> of Joy & Drama
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed leading-relaxed font-sans">
                Your distribution matches premium Bollywood roots: heavy romance, clever wholesome comedy, high-stakes adrenaline action, and heartwarming family songs.
              </p>
            </div>

            <div className="h-44 w-full flex items-center justify-center relative">
              <ResponsiveContainer width="95%" height="100%">
                <PieChart>
                  <Pie
                    data={GENRE_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {GENRE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#1c1c1c", borderColor: "#333", borderRadius: "12px", color: "#fff", fontSize: "10px" }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Legends overlay */}
              <div className="absolute right-0 top-0 text-[9px] font-mono flex flex-col gap-1 text-stone-400 p-2.5 bg-black/60 rounded-xl border border-white/5 shadow">
                {GENRE_DATA.map((g) => (
                  <div key={g.name} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: g.color }} />
                    <span>{g.name}: {g.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 4: PASSPORT ACCOMPLISHMENTS summary */}
        {slideIndex === 4 && (
          <div className="space-y-4 my-auto text-center max-w-xl mx-auto animate-fadeIn">
            <div className="w-12 h-12 bg-amber-500/10 border border-amber-400/30 rounded-full flex items-center justify-center mx-auto mb-1 animate-pulse">
              <Trophy className="w-6 h-6 text-amber-400" />
            </div>
            
            <h4 className="text-2xl md:text-3xl font-display font-black text-white-100 uppercase tracking-tight">
              You Gained Elite <span className="text-amber-400">Level {userProfile.level} Status</span> Rank!
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed max-w-sm mx-auto p-3 bg-white/5 border border-white/5 rounded-2xl">
              Discovered <strong className="text-white">14 Masterpieces</strong> • Unlocked <strong className="text-white">{userProfile.badges?.length || 2} Badges</strong> • Logged <strong className="text-white">{userProfile.reviewCount} Reviews</strong>.
            </p>

            <span className="text-[10px] font-mono text-stone-500 block">YOUR JOURNEY CONTINUES UNTIL THE COGNITIVE REEL STOPS</span>

            <div className="pt-2 flex justify-center gap-3">
              <button 
                onClick={handleReset}
                className="py-2.5 px-4 bg-stone-900 border border-stone-850 text-stone-400 hover:text-white text-xs font-mono rounded-xl cursor-pointer transition flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4 text-stone-400" />
                Time Travel Again
              </button>
            </div>
          </div>
        )}

        {/* BOTTOM STEPS BUTTON NAV CONTROLS */}
        <div className="border-t border-white/5 pt-4 flex justify-between items-center text-xs font-mono text-stone-500">
          <button 
            onClick={handlePrev} 
            disabled={slideIndex === 0}
            className={`flex items-center gap-1 cursor-pointer hover:text-white transition ${
              slideIndex === 0 ? "opacity-30 pointer-events-none" : ""
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Prev Card
          </button>

          <span>SLIDE {slideIndex + 1} OF {totalSlides}</span>

          <button 
            onClick={handleNext} 
            disabled={slideIndex === totalSlides - 1} 
            className={`flex items-center gap-1 cursor-pointer hover:text-white transition ${
              slideIndex === totalSlides - 1 ? "opacity-30 pointer-events-none" : ""
            }`}
          >
            Next Card
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
