import { useState, useEffect } from "react";
import { Movie, UserReview } from "../types";
import { Search, SlidersHorizontal, Star, Play, Calendar, Film, Bookmark, BookmarkCheck, Heart, Clock, Award, ShieldAlert, RefreshCw } from "lucide-react";
import ReviewSentimentAnalyzer from "./ReviewSentimentAnalyzer";

interface MovieExplorerProps {
  onRegisterXp: (amount: number) => void;
  watchlist: string[];
  onToggleWatchlist: (movieId: string) => void;
  activeMovieId: string | null;
  setActiveMovieId: (id: string | null) => void;
}

export default function MovieExplorer({ 
  onRegisterXp, 
  watchlist, 
  onToggleWatchlist,
  activeMovieId,
  setActiveMovieId
}: MovieExplorerProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [sort, setSort] = useState("rating");
  const [loading, setLoading] = useState(true);
  const [expandedMovie, setExpandedMovie] = useState<Movie | null>(null);
  const [activeTrailerUrl, setActiveTrailerUrl] = useState<string | null>(null);

  const genresList = ["All", "Comedy", "Drama", "Family", "Action", "Biography", "Romantic", "Thriller", "Adventure", "Historical", "Musical"];

  useEffect(() => {
    fetchMovies();
  }, [search, genre, sort]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (search) query.append("search", search);
      if (genre && genre !== "All") query.append("genre", genre);
      if (sort) query.append("sort", sort);

      const response = await fetch(`/api/movies?${query.toString()}`);
      const data = await response.json();
      setMovies(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExpandMovie = async (movieId: string) => {
    try {
      const response = await fetch(`/api/movies/${movieId}`);
      const data = await response.json();
      setExpandedMovie(data);
      setActiveMovieId(movieId);
      
      // Auto scroll to detail block
      setTimeout(() => {
        document.getElementById("expanded-movie-panel")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error(err);
    }
  };

  const closeExpandedView = () => {
    setExpandedMovie(null);
    setActiveMovieId(null);
  };

  const releasedMovies = movies.filter((m) => !m.isYetToRelease);
  const upcomingMovies = movies.filter((m) => m.isYetToRelease);

  return (
    <div className="space-y-6 text-amber-50" id="movie-explorer-workspace">
      {/* Search and Filters Hub */}
      <div className="glass-panel p-5 rounded-2xl border border-gold-500/30 gold-border-glow shadow-md space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Main search text */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-pink-300 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, descriptive narrative, characters, castings, or directors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#3a061c]/50 border border-gold-500/30 outline-none rounded-xl py-3 pl-11 pr-4 text-xs font-sans text-amber-50 placeholder-pink-300/60 focus:border-gold-400 focus:ring-1 focus:ring-gold-400/40"
            />
          </div>

          {/* Quick sorting dropdown */}
          <div className="flex gap-2 shrink-0">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-[#3a061c] border border-gold-500/35 text-xs rounded-xl px-4 py-3 select-none outline-none focus:border-gold-400 font-display text-gold-300 font-bold shadow-md cursor-pointer"
            >
              <option value="rating">Sort: Highest Rated</option>
              <option value="newest">Sort: Newest Releases</option>
              <option value="oldest">Sort: Oldest Classics</option>
              <option value="boxoffice">Sort: Total Revenue</option>
            </select>
          </div>
        </div>

        {/* Genre filtering chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-gold-500/20">
          <span className="text-[10px] uppercase font-mono text-pink-200 mr-1.5 flex items-center gap-1 font-bold">
            <SlidersHorizontal className="w-3 h-3 text-gold-400" /> Filters:
          </span>
          {genresList.map((g) => (
            <button
              key={g}
              onClick={() => setGenre(g === "All" ? "" : g)}
              className={`px-3 py-1.5 border rounded-lg text-xs font-display font-semibold cursor-pointer transition ${
                (g === "All" && !genre) || (genre === g)
                  ? "bg-gradient-to-r from-gold-400 to-amber-500 text-stone-950 border-gold-400 shadow-md font-bold"
                  : "bg-[#2d0416]/40 border-gold-500/25 text-pink-200 hover:text-white hover:bg-[#3a061c]/60 hover:border-gold-500/50"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* EXPLANDED SELECTED MOVIE DETAIL WORKSPACE */}
      {expandedMovie && (
        <div className="glass-panel-heavy bg-gradient-to-tr from-[#1E010B] to-[#12003C] border-2 border-gold-500/45 rounded-2xl p-6 lg:p-8 animate-slideUp space-y-8 relative" id="expanded-movie-panel">
          <button
            onClick={closeExpandedView}
            className="absolute top-4 right-4 text-xs font-mono border border-gold-500/30 px-2.5 py-1 rounded bg-[#3a061c] hover:text-gold-400 hover:border-gold-400/50 cursor-pointer text-pink-200 font-bold transition duration-250"
          >
            ✕ Close Panel
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Poster cover / brief metrics */}
            <div className="space-y-4">
              <div className="aspect-[3/4] bg-[#2a0414] border-2 border-gold-500/40 rounded-2xl flex flex-col justify-between p-6 relative overflow-hidden light-sweep shadow-xl max-w-sm mx-auto md:mx-0 gold-leaf-border">
                <div className="text-6xl">{expandedMovie.posterUrl || "🎬"}</div>
                <div className="z-10 space-y-1 bg-[#1a010d]/80 p-3 rounded-xl border border-gold-500/20 backdrop-blur-sm">
                  <div className="bg-gradient-to-r from-pink-600 to-amber-500 text-white font-mono text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase inline-block">
                    {expandedMovie.language}
                  </div>
                  <h3 className="text-2xl font-serif italic font-bold text-gold-250 select-all gold-glow">{expandedMovie.title}</h3>
                  <p className="text-xs text-amber-200 font-mono italic font-semibold">"{expandedMovie.tagline}"</p>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rotate-45 pointer-events-none" />
              </div>

              {/* Fast metadata details */}
              <div className="bg-[#2c0316]/90 border border-gold-500/25 rounded-xl p-4 space-y-3 max-w-sm mx-auto md:mx-0 text-xs shadow-inner">
                <div className="flex justify-between border-b border-gold-500/20 pb-2">
                  <span className="text-pink-300 font-semibold">Directed By:</span>
                  <span className="font-bold text-gold-300">{expandedMovie.director}</span>
                </div>
                <div className="flex justify-between border-b border-gold-500/20 pb-2">
                  <span className="text-pink-300 font-semibold">Release Year:</span>
                  <span className="font-bold text-gold-300">{expandedMovie.year}</span>
                </div>
                <div className="flex justify-between border-b border-gold-500/20 pb-2">
                  <span className="text-pink-300 font-semibold">Duration:</span>
                  <span className="font-bold text-gold-300">{expandedMovie.runtime} minutes</span>
                </div>
                {expandedMovie.isYetToRelease ? (
                  <>
                    <div className="flex justify-between border-b border-gold-500/20 pb-2">
                      <span className="text-pink-300 font-semibold">Scheduled Date:</span>
                      <span className="font-bold text-amber-300 font-mono">{expandedMovie.releaseDate || "TBA"}</span>
                    </div>
                    <div className="flex justify-between items-center whitespace-nowrap">
                      <span className="text-pink-300 font-semibold">Status:</span>
                      <span className="bg-gradient-to-r from-pink-600 to-amber-500 text-white font-mono text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase inline-block shadow-sm">
                        Upcoming ⏰
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between border-b border-gold-500/20 pb-2">
                      <span className="text-pink-300 font-semibold">Production cost:</span>
                      <span className="font-bold text-gold-300">{expandedMovie.budget} Cr INR</span>
                    </div>
                    <div className="flex justify-between items-center whitespace-nowrap">
                      <span className="text-pink-300 font-semibold">Audience Stars:</span>
                      <span className="font-mono text-gold-300 font-bold flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
                        {expandedMovie.rating} / 10
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Substantive synopsis / cast list */}
            <div className="md:col-span-2 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs uppercase font-mono tracking-wider text-pink-300 font-extrabold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-gold-400 rounded-full inline-block"></span> Cinematic Synopsis
                  </h4>
                  <p className="text-sm text-pink-100/90 leading-relaxed font-sans mt-2">
                    {expandedMovie.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs uppercase font-mono tracking-wider text-pink-300 font-extrabold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-gold-400 rounded-full inline-block"></span> Headlining Cast Ensemble
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {expandedMovie.actors.map((star, idx) => (
                      <span key={idx} className="bg-pink-900/35 border border-gold-500/30 rounded-lg py-1 px-3 text-xs text-pink-100 font-bold">
                        {star}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <h4 className="text-xs uppercase font-mono tracking-wider text-pink-300 font-extrabold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-gold-400 rounded-full inline-block"></span> Genre Coordinates
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {expandedMovie.genre.map((g, idx) => (
                      <span key={idx} className="bg-pink-950/65 border border-gold-500/30 text-gold-300 text-[10px] px-2.5 py-0.5 rounded-full font-mono font-semibold">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action togglers watchlist */}
              <div className="flex flex-wrap gap-3 border-t border-gold-500/25 pt-6 mt-6">
                <button
                  onClick={() => onToggleWatchlist(expandedMovie.id)}
                  className={`px-5 py-2.5 rounded-lg text-xs font-display font-medium flex items-center gap-2 cursor-pointer transition ${
                    watchlist.includes(expandedMovie.id)
                      ? "bg-gold-500/20 text-gold-300 border border-gold-500/30 font-bold"
                      : "bg-gradient-to-r from-gold-400 to-amber-500 hover:from-gold-350 hover:to-amber-450 text-stone-950 font-bold shadow-md"
                  }`}
                >
                  {watchlist.includes(expandedMovie.id) ? (
                    <>
                      <BookmarkCheck className="w-4 h-4 text-pink-500 animate-bounce" />
                      Saved in Watchlist
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4 fill-stone-950 text-stone-950" />
                      Save to Watchlist (+10 XP)
                    </>
                  )}
                </button>

                {expandedMovie.trailerUrl && (
                  <button
                    onClick={() => setActiveTrailerUrl(expandedMovie.trailerUrl || null)}
                    className="px-5 py-2.5 rounded-lg text-xs font-display font-medium flex items-center gap-2 cursor-pointer bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-450 text-white font-extrabold shadow-md transition-all duration-150"
                  >
                    <Play className="w-4 h-4 fill-white text-white animate-pulse" />
                    Watch Official Trailer
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Embedded review center */}
          <div className="border-t border-white/5 pt-8">
            <ReviewSentimentAnalyzer 
              movieId={expandedMovie.id} 
              movieTitle={expandedMovie.title} 
              onRegisterXp={onRegisterXp} 
            />
          </div>
        </div>
      )}

      {/* MOVIE COLLECTION GRID & UPCOMING SPOTLIGHT COLUMN */}
      {loading ? (
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 text-gold-500 animate-spin mx-auto" />
          <p className="text-xs text-gray-400 mt-2 font-mono">Curating dynamic cinema archives...</p>
        </div>
      ) : movies.length === 0 ? (
        <div className="text-center py-12 bg-cinema-dark/20 border border-white/5 rounded-2xl">
          <ShieldAlert className="w-10 h-10 text-gray-600 mx-auto" />
          <p className="text-sm text-gray-400 mt-2">No movies match your selected criteria.</p>
          <p className="text-xs text-gray-500 mt-1">Try resetting the search query or changing active genre filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* LEFT SECTION: RELEASED MOVIES PATHWAY (3 COLS) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between border-b border-gold-500/15 pb-2.5">
              <h3 className="text-xs font-mono uppercase tracking-widest text-gold-300 flex items-center gap-2 font-bold">
                <Film className="w-4 h-4 text-pink-450" /> Released Masterpieces ({releasedMovies.length})
              </h3>
              <span className="text-[10px] text-pink-300/50 font-mono hidden sm:inline">Select cards to write review journals</span>
            </div>

            {releasedMovies.length === 0 ? (
              <div className="text-center py-12 bg-[#2d0416]/20 border border-gold-500/10 rounded-2xl p-6">
                <ShieldAlert className="w-8 h-8 text-pink-400/50 mx-auto mb-2 animate-bounce" />
                <p className="text-sm text-pink-200">No released movies match this genre filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {releasedMovies.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => handleExpandMovie(m.id)}
                    className={`glass-panel gold-hover-panel rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between ${
                      activeMovieId === m.id 
                        ? "border-gold-500 ring-4 ring-gold-500/30 shadow-lg" 
                        : "border-gold-500/25"
                    }`}
                  >
                    {/* Illustrated Header card */}
                    <div className="p-5 flex items-center justify-between border-b border-gold-500/25 bg-gradient-to-r from-pink-905/30 to-[#4a0429]/30">
                      <div className="text-4xl">{m.posterUrl || "🎬"}</div>
                      <div className="text-right">
                        <div className="bg-gold-500/20 border border-gold-400/40 px-2 py-0.5 rounded text-[9px] font-mono text-gold-300 font-bold uppercase shadow-sm">
                          {m.year}
                        </div>
                      </div>
                    </div>

                    {/* Main Info */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-1.5 flex flex-col">
                        <h3 className="text-lg font-serif italic font-bold text-gold-300 tracking-tight leading-snug line-clamp-1 gold-glow order-first mb-1">{m.title}</h3>
                        <div className="text-xs text-pink-300 font-display font-semibold truncate mb-1">Director: {m.director}</div>
                        <p className="text-xs text-pink-100/80 line-clamp-2 leading-relaxed font-sans">{m.description}</p>
                      </div>

                      {/* Genres */}
                      <div className="flex flex-wrap gap-1">
                        {m.genre.slice(0, 2).map((g, index) => (
                          <span key={index} className="bg-pink-950/60 border border-gold-500/25 text-[9px] font-mono text-pink-250 px-2 py-0.5 rounded text-center font-bold">
                            {g}
                          </span>
                        ))}
                        {m.genre.length > 2 && (
                          <span className="text-[9px] text-pink-300/80 font-mono self-center px-1 font-bold">+{m.genre.length - 2}</span>
                        )}
                      </div>
                    </div>

                    {/* Footer specs */}
                    <div className="px-5 py-3 border-t border-gold-500/25 bg-pink-950/40 flex justify-between items-center text-xs">
                      <div className="flex items-center gap-1 font-mono text-gold-300 font-extrabold pb-0.5">
                        <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
                        <span>{m.rating}</span>
                      </div>
                      
                      {/* Watchlist indicator badge */}
                      <span className="flex items-center gap-2">
                        {watchlist.includes(m.id) && (
                          <BookmarkCheck className="w-4 h-4 text-pink-500 animate-bounce" title="Saved in watchlist" />
                        )}
                        <span className="text-[10px] font-mono text-amber-200 font-extrabold">{m.boxOffice > 1000 ? `⭐ ${(m.boxOffice / 100).toFixed(1)}k Cr` : `${m.boxOffice} Cr`}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT SECTION: UPCOMING HOTSPOT PANEL (1 COL) */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center justify-between border-b border-gold-500/15 pb-2.5">
              <h3 className="text-xs font-mono uppercase tracking-widest text-amber-400 flex items-center gap-2 font-extrabold">
                <Calendar className="w-4 h-4 text-amber-400" /> Yet To Release ({upcomingMovies.length})
              </h3>
              <span className="text-[10px] text-amber-300/50 font-mono">Spotlight</span>
            </div>

            {upcomingMovies.length === 0 ? (
              <div className="text-center py-12 bg-[#2d0416]/20 border border-gold-500/10 rounded-2xl p-4">
                <ShieldAlert className="w-6 h-6 text-pink-400/50 mx-auto mb-2" />
                <p className="text-xs text-pink-300/60 font-mono">No upcoming matches found</p>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {upcomingMovies.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => handleExpandMovie(m.id)}
                    className={`glass-panel bg-[#240112]/95 hover:bg-[#34021b]/95 border-2 rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between transition-all duration-200 shadow-md ${
                      activeMovieId === m.id 
                        ? "border-amber-400 ring-4 ring-amber-400/20" 
                        : "border-amber-500/20 hover:border-amber-500/50"
                    }`}
                  >
                    {/* Header line for Upcoming card */}
                    <div className="p-4 flex items-center gap-3 bg-gradient-to-r from-amber-500/10 to-yellow-500/5 border-b border-amber-500/25">
                      <div className="text-3xl bg-black/40 p-2 rounded-xl border border-amber-500/20">{m.posterUrl || "🎬"}</div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[8px] font-mono bg-gradient-to-r from-pink-600 to-amber-500 text-white px-2 py-0.5 rounded-full uppercase font-extrabold tracking-widest shadow-sm">
                          Upcoming ⏰
                        </span>
                        <h4 className="text-sm font-serif italic font-bold text-amber-200 mt-1 truncate">{m.title}</h4>
                      </div>
                    </div>

                    <div className="p-4 space-y-4">
                      <p className="text-[11px] text-pink-100/75 line-clamp-2 leading-relaxed">{m.description}</p>
                      
                      <div className="space-y-1.5 text-[10px]">
                        <div className="flex justify-between border-b border-pink-500/10 pb-1.5">
                          <span className="text-pink-300/80">Directed By:</span>
                          <span className="font-bold text-amber-300">{m.director}</span>
                        </div>
                        <div className="flex justify-between border-b border-pink-500/10 pb-1.5">
                          <span className="text-pink-300/80">Scheduled Year:</span>
                          <span className="font-bold font-mono text-amber-300">{m.year}</span>
                        </div>
                        
                        {/* Target release info badge */}
                        <div className="flex justify-between items-center bg-black/40 p-2 rounded-lg border border-amber-500/15">
                          <span className="text-pink-300 text-[9px] font-semibold flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-400" /> Release Date:
                          </span>
                          <span className="font-mono font-bold text-amber-300 text-[10px]">{m.releaseDate || "TBA"}</span>
                        </div>
                      </div>
                    </div>

                    {m.trailerUrl && (
                      <div className="px-4 pb-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTrailerUrl(m.trailerUrl || null);
                          }}
                          className="w-full bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-mono text-[10px] font-extrabold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200 shadow-sm"
                        >
                          <Play className="w-3 h-3 fill-white text-white" /> Play Trailer Link
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* Cinematic Trailer Modal Overlay */}
      {activeTrailerUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-4xl aspect-video bg-[#12000c] border-2 border-gold-500/45 rounded-2xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setActiveTrailerUrl(null)}
              className="absolute top-3 right-3 z-10 text-xs font-mono bg-pink-900/90 border border-gold-500/40 text-amber-100 hover:text-gold-400 py-1.5 px-3 rounded-xl cursor-pointer shadow-lg transition"
            >
              ✕ Close Video Trailer
            </button>
            <iframe
              width="100%"
              height="100%"
              src={activeTrailerUrl}
              title="Official Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
