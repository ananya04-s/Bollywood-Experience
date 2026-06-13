import { useState, useEffect } from "react";
import { Play, Bookmark, BookmarkCheck, Star, ChevronLeft, ChevronRight, Award, Flame, Youtube } from "lucide-react";
import { Movie } from "../types";

interface BollyverseHeroProps {
  onSelectMovie: (id: string) => void;
  watchlist: string[];
  onToggleWatchlist: (id: string) => void;
  theme: "dark" | "light";
}

const CAROUSEL_MOVIES = [
  {
    id: "3-idiots-2009",
    title: "3 Idiots",
    year: 2009,
    rating: 8.4,
    director: "Rajkumar Hirani",
    tagline: "Don't chase success. Chase excellence, and success will follow.",
    description: "Farhan and Raju embark on a nostalgic search for their lost companion, Rancho, who challenged standard academic systems and inspired them to live on their own terms.",
    bgUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1280&auto=format&fit=crop",
    trendingTag: "🔥 #1 RANKED COMEDY OF ALL TIME",
    actors: ["Aamir Khan", "R. Madhavan", "Sharman Joshi", "Kareena Kapoor"],
    youtubeTrailer: "https://www.youtube.com/results?search_query=3+Idiots+Official+Trailer"
  },
  {
    id: "znmd-2011",
    title: "Zindagi Na Milegi Dobara",
    year: 2011,
    rating: 8.2,
    director: "Zoya Akhtar",
    tagline: "Live life with open sails, for you only live once.",
    description: "Three childhood friends set off on a luxurious, transformative bachelor trip across Spain, exploring deep fears, romantic desires, and repairing broken bonds.",
    bgUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1280&auto=format&fit=crop",
    trendingTag: "✈️ TOP ADVENTURE DRAMA",
    actors: ["Hrithik Roshan", "Ranbir Kapoor", "Farhan Akhtar", "Katrina Kaif"],
    youtubeTrailer: "https://www.youtube.com/results?search_query=Zindagi+Na+Milegi+Dobara+Official+Trailer"
  },
  {
    id: "ddlj-1995",
    title: "Dilwale Dulhania Le Jayenge",
    year: 1995,
    rating: 8.0,
    director: "Aditya Chopra",
    tagline: "Come, fall in love... All over again.",
    description: "Raj and Simran fall in love on an epic rail journey through Europe, but Raj must travel to India to win her ultra-conservative traditional father's approval to marry her.",
    bgUrl: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=1280&auto=format&fit=crop",
    trendingTag: "🌾 THE GOLD STANDARD OF ROMANCE",
    actors: ["Shah Rukh Khan", "Kajol", "Amrish Puri"],
    youtubeTrailer: "https://www.youtube.com/results?search_query=Dilwale+Dulhania+Le+Jayenge+Trailer"
  }
];

export default function BollyverseHero({ onSelectMovie, watchlist, onToggleWatchlist, theme }: BollyverseHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CAROUSEL_MOVIES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    setCurrentIndex((currentIndex + 1) % CAROUSEL_MOVIES.length);
  };

  const handlePrev = () => {
    setCurrentIndex((currentIndex - 1 + CAROUSEL_MOVIES.length) % CAROUSEL_MOVIES.length);
  };

  const currentMovie = CAROUSEL_MOVIES[currentIndex];
  const isSaved = watchlist.includes(currentMovie.id);

  return (
    <div className="relative rounded-3xl overflow-hidden min-h-[440px] flex flex-col justify-end p-6 md:p-14 border border-stone-800 shadow-2xl transition-all duration-500 bg-[#0C0A0B] group" id="hero-cinematic-banner">
      {/* Background Graphic Layer of Current Slide */}
      <div 
        style={{ backgroundImage: `url(${currentMovie.bgUrl})` }}
        className="absolute inset-0 bg-cover bg-center opacity-35 scale-100 group-hover:scale-[1.03] transition-all duration-1000 z-0"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0C0A0B] via-[#0C0A0B]/85 to-transparent z-5" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0E0C0D] via-transparent to-transparent z-5" />

      {/* Slide Navigation Manual Arrows */}
      <button 
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-15 p-2 rounded-full bg-stone-900/60 hover:bg-[#E50914] text-white opacity-0 group-hover:opacity-100 transition duration-300 shadow-lg cursor-pointer"
        title="Previous blockbuster"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button 
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-15 p-2 rounded-full bg-stone-900/60 hover:bg-[#E50914] text-white opacity-0 group-hover:opacity-100 transition duration-300 shadow-lg cursor-pointer"
        title="Next blockbuster"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Slider content */}
      <div className="max-w-2xl space-y-4 relative z-10 animate-fadeIn">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[#E50914] text-[10px] font-black uppercase tracking-widest bg-[#E50914]/15 border border-[#E50914]/30 px-3 py-1 rounded-full flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-red-500 fill-current" />
            {currentMovie.trendingTag}
          </span>
          <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono px-3 py-1 rounded-full font-bold flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
            {currentMovie.rating}/10 Rating
          </span>
        </div>

        <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-white tracking-tight leading-none uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
          {currentMovie.title}
        </h2>
        
        <p className="text-yellow-400 text-xs md:text-sm font-semibold italic">
          "{currentMovie.tagline}"
        </p>

        <p className="text-xs md:text-sm text-stone-300 leading-relaxed font-sans max-w-xl line-clamp-3">
          {currentMovie.description}
        </p>

        {currentMovie.actors && (
          <div className="text-[10px] text-stone-400 font-mono">
            Starring: <strong className="text-white">{currentMovie.actors.join(" • ")}</strong> | Directed By: <strong className="text-amber-400">{currentMovie.director}</strong>
          </div>
        )}

        {/* Action controls */}
        <div className="flex flex-wrap gap-3.5 pt-3">
          <a
            href={currentMovie.youtubeTrailer}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#E50914] hover:bg-[#c90712] text-white font-bold px-7 py-3 rounded-md text-xs active:scale-95 transition-all shadow-[0_4px_15px_rgba(229,9,20,0.4)] cursor-pointer flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" /> Play Trailer on YouTube
          </a>
          
          <button
            onClick={() => onToggleWatchlist(currentMovie.id)}
            className={`px-5 py-3 rounded-md text-xs font-bold active:scale-95 transition-all flex items-center gap-2 border cursor-pointer ${
              isSaved
                ? "bg-transparent border-[#E50914] text-[#E50914]"
                : "bg-[#141414]/90 hover:bg-[#1f1e1f] border-stone-700/60 text-white"
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-4 h-4" /> Watchlist Saved
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4" /> Add to Watchlist
              </>
            )}
          </button>
        </div>
      </div>

      {/* Slide indicator dots */}
      <div className="absolute bottom-4 right-14 z-10 flex gap-1.5">
        {CAROUSEL_MOVIES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
              currentIndex === idx ? "bg-[#E50914] w-6" : "bg-stone-600 hover:bg-stone-400"
            }`}
            title={`Slide #${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
