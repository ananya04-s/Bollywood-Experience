import { useState, useEffect } from "react";
import { Movie, UserReview } from "../types";
import { Search, SlidersHorizontal, Star, Play, Calendar, Film, Bookmark, BookmarkCheck, Heart, Clock, Award, ShieldAlert, RefreshCw, Music } from "lucide-react";
import ReviewSentimentAnalyzer from "./ReviewSentimentAnalyzer";
import { getMovieSongs } from "../data/songMap";

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

  useEffect(() => {
    if (activeMovieId && (!expandedMovie || expandedMovie.id !== activeMovieId)) {
      handleExpandMovie(activeMovieId);
    }
  }, [activeMovieId]);


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
    <div className="space-y-6 text-stone-100" id="movie-explorer-workspace">
      {/* Search and Filters Hub */}
      <div className="bg-[#141414] p-5 rounded-2xl border border-stone-800 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Main search text */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, descriptive narrative, characters, castings, or directors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-stone-900 border border-stone-800 outline-none rounded-xl py-3 pl-11 pr-4 text-xs font-sans text-stone-100 placeholder-stone-500 focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914]/40 transition duration-300"
            />
          </div>

          {/* Quick sorting dropdown */}
          <div className="flex gap-2 shrink-0">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-stone-900 border border-stone-800 text-xs rounded-xl px-4 py-3 select-none outline-none focus:border-[#E50914] font-sans text-stone-300 font-bold shadow-md cursor-pointer transition duration-300"
            >
              <option value="rating">Sort: Highest Rated</option>
              <option value="newest">Sort: Newest Releases</option>
              <option value="oldest">Sort: Oldest Classics</option>
              <option value="boxoffice">Sort: Total Revenue</option>
            </select>
          </div>
        </div>

        {/* Genre filtering chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-stone-850">
          <span className="text-[10px] uppercase font-mono text-stone-400 mr-1.5 flex items-center gap-1.5 font-bold">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#E50914]" /> Filters:
          </span>
          {genresList.map((g) => (
            <button
              key={g}
              onClick={() => setGenre(g === "All" ? "" : g)}
              className={`px-3 py-1.5 border rounded-lg text-xs font-sans font-bold cursor-pointer transition duration-300 ${
                (g === "All" && !genre) || (genre === g)
                  ? "bg-[#E50914] text-white border-transparent shadow-[0_2px_10px_rgba(229,9,20,0.3)]"
                  : "bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-100 hover:bg-stone-800"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* EXPLANDED SELECTED MOVIE DETAIL WORKSPACE (Netflix Theater Overlay Mode) */}
      {expandedMovie && (
        <div className="bg-[#181818] border border-stone-800 rounded-3xl p-6 lg:p-10 animate-slideUp space-y-8 relative shadow-[0_30px_60px_rgba(0,0,0,0.8)]" id="expanded-movie-panel">
          <button
            onClick={closeExpandedView}
            className="absolute top-4 right-4 text-xs font-mono border border-stone-800 px-3.5 py-1.5 rounded-lg bg-stone-900 hover:text-white hover:bg-stone-800 cursor-pointer text-stone-400 font-bold transition duration-250"
          >
            ✕ Close Details
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Poster cover / brief metrics */}
            <div className="space-y-4">
              <div className="aspect-[3/4] bg-stone-950 border border-stone-800 rounded-2xl flex flex-col justify-between p-6 relative overflow-hidden shadow-2xl max-w-sm mx-auto md:mx-0">
                <div className="text-6xl">{expandedMovie.posterUrl || "🎬"}</div>
                <div className="z-10 space-y-1.5 bg-black/90 p-3.5 rounded-xl border border-stone-850 backdrop-blur-sm">
                  <div className="bg-[#E50914] text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded uppercase inline-block">
                    {expandedMovie.language}
                  </div>
                  <h3 className="text-2xl font-sans font-black text-white leading-tight tracking-tight">{expandedMovie.title}</h3>
                  <p className="text-xs text-stone-400 font-sans italic font-semibold">"{expandedMovie.tagline}"</p>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#E50914]/5 rotate-45 pointer-events-none" />
              </div>

              {/* Fast metadata details */}
              <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 space-y-3 max-w-sm mx-auto md:mx-0 text-xs shadow-inner">
                <div className="flex justify-between border-b border-stone-850 pb-2">
                  <span className="text-stone-400">Directed By:</span>
                  <span className="font-bold text-stone-100">{expandedMovie.director}</span>
                </div>
                <div className="flex justify-between border-b border-stone-850 pb-2">
                  <span className="text-stone-400">Release Year:</span>
                  <span className="font-bold text-stone-100">{expandedMovie.year}</span>
                </div>
                <div className="flex justify-between border-b border-stone-850 pb-2">
                  <span className="text-stone-400">Duration:</span>
                  <span className="font-bold text-stone-100">{expandedMovie.runtime} mins</span>
                </div>
                {expandedMovie.isYetToRelease ? (
                  <>
                    <div className="flex justify-between border-b border-stone-850 pb-2">
                      <span className="text-stone-400">Scheduled Date:</span>
                      <span className="font-bold text-red-500 font-mono">{expandedMovie.releaseDate || "TBA"}</span>
                    </div>
                    <div className="flex justify-between items-center whitespace-nowrap">
                      <span className="text-stone-400">Status:</span>
                      <span className="bg-[#E50914]/15 border border-[#E50914]/30 text-[#E50914] font-mono text-[9px] font-bold px-2 py-0.5 rounded uppercase inline-block">
                        Upcoming ⏰
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between border-b border-stone-850 pb-2">
                      <span className="text-stone-400">Production cost:</span>
                      <span className="font-bold text-stone-100">{expandedMovie.budget} Cr INR</span>
                    </div>
                    <div className="flex justify-between items-center whitespace-nowrap">
                      <span className="text-stone-400">Audience Stars:</span>
                      <span className="font-mono text-amber-500 font-bold flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        {expandedMovie.rating} / 10
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Substantive synopsis / cast list */}
            <div className="md:col-span-2 space-y-6 flex flex-col justify-between">
              <div className="space-y-5">
                <div>
                  <h4 className="text-xs uppercase font-mono tracking-wider text-stone-400 font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#E50914] rounded-full inline-block"></span> Cinematic Synopsis
                  </h4>
                  <p className="text-sm text-stone-300 leading-relaxed font-sans mt-2.5">
                    {expandedMovie.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs uppercase font-mono tracking-wider text-stone-400 font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#E50914] rounded-full inline-block"></span> Headlining Cast Ensemble
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {expandedMovie.actors.map((star, idx) => (
                      <span key={idx} className="bg-stone-900 border border-stone-800 rounded-lg py-1 px-3 text-xs text-stone-200 font-semibold hover:border-red-650 transition">
                        {star}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  <h4 className="text-xs uppercase font-mono tracking-wider text-stone-400 font-bold flex items-center gap-1.5">
                    <Music className="w-3.5 h-3.5 text-[#E50914] animate-pulse" /> Signature Soundtracks & Hit Songs
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {getMovieSongs(expandedMovie.id, expandedMovie.title).map((song, idx) => (
                      <span key={idx} className="bg-stone-900 border border-stone-800 rounded-xl py-1.5 px-3 text-xs text-stone-300 flex items-center gap-1.5 font-sans hover:border-[#E50914]/40 transition duration-300">
                        <span className="text-[#E50914] font-mono text-[9px] font-bold">#{idx + 1}</span>
                        <span className="font-semibold">{song}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  <h4 className="text-xs uppercase font-mono tracking-wider text-stone-400 font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#E50914] rounded-full inline-block"></span> Genre Coordinates
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {expandedMovie.genre.map((g, idx) => (
                      <span key={idx} className="bg-stone-900 border border-stone-800 text-stone-300 text-[10px] px-2.5 py-0.5 rounded-full font-mono font-medium">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action togglers watchlist */}
              <div className="flex flex-wrap gap-3 border-t border-stone-850 pt-5 mt-5">
                <button
                  onClick={() => onToggleWatchlist(expandedMovie.id)}
                  className={`px-5 py-2.5 rounded-lg text-xs font-sans font-bold flex items-center gap-2 cursor-pointer transition duration-300 ${
                    watchlist.includes(expandedMovie.id)
                      ? "bg-[#E50914]/15 text-[#E50914] border border-[#E50914]/30"
                      : "bg-[#E50914] hover:bg-[#b00710] text-white shadow-lg"
                  }`}
                >
                  {watchlist.includes(expandedMovie.id) ? (
                    <>
                      <BookmarkCheck className="w-4 h-4 text-red-500" />
                      In Watchlist
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4 text-white" />
                      Save to My Watchlist (+10 XP)
                    </>
                  )}
                </button>

                {expandedMovie.trailerUrl && (
                  <button
                    onClick={() => setActiveTrailerUrl(expandedMovie.trailerUrl || null)}
                    className="px-5 py-2.5 rounded-lg text-xs font-sans font-bold flex items-center gap-2 cursor-pointer bg-stone-900 border border-stone-800 text-stone-100 hover:bg-stone-800 hover:border-stone-700 transition duration-300 shadow-md"
                  >
                    <Play className="w-4 h-4 fill-white text-white" />
                    Watch Official Trailer Link
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Embedded review center */}
          <div className="border-t border-stone-850 pt-6">
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
        <div className="text-center py-20 bg-[#141414] rounded-2xl border border-stone-800/65">
          <RefreshCw className="w-8 h-8 text-[#E50914] animate-spin mx-auto" />
          <p className="text-xs text-stone-400 mt-3 font-mono">Curating dynamic cinema archives...</p>
        </div>
      ) : movies.length === 0 ? (
        <div className="text-center py-16 bg-[#141414]/40 border border-stone-800 rounded-2xl">
          <ShieldAlert className="w-10 h-10 text-stone-500 mx-auto" />
          <p className="text-sm text-stone-300 mt-2 font-medium">No movies match your selected criteria.</p>
          <p className="text-xs text-stone-500 mt-1">Try resetting the search query or changing active genre filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* LEFT SECTION: RELEASED MOVIES PATHWAY (3 COLS) */}
          <div className="lg:col-span-3 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="text-xs font-sans uppercase tracking-wider text-stone-300 flex items-center gap-2 font-bold">
                <Film className="w-4 h-4 text-[#E50914]" /> Released Masterpieces ({releasedMovies.length})
              </h3>
              <span className="text-[10px] text-stone-500 font-mono hidden sm:inline">Select cards to write review journals</span>
            </div>

            {releasedMovies.length === 0 ? (
              <div className="text-center py-12 bg-[#141414] border border-stone-800 rounded-2xl p-6">
                <ShieldAlert className="w-8 h-8 text-stone-500 mx-auto mb-2" />
                <p className="text-sm text-stone-400 font-medium whitespace-nowrap">No released movies match this genre filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {releasedMovies.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => handleExpandMovie(m.id)}
                    className={`group bg-[#181818] border rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between transition-all duration-300 hover:border-stone-600 hover:-translate-y-1 ${
                      activeMovieId === m.id 
                        ? "border-[#E50914] ring-2 ring-[#E50914]/30 shadow-2xl shadow-red-950/20" 
                        : "border-stone-800"
                    }`}
                  >
                    {/* Illustrated Header card */}
                    <div className="p-5 h-28 flex items-center justify-between border-b border-stone-850 bg-[#101010]/80 group-hover:bg-[#151515] transition duration-300 relative overflow-hidden">
                      <div className="text-4xl filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">{m.posterUrl || "🎬"}</div>
                      <div className="text-right z-10">
                        <div className="bg-stone-900/90 border border-stone-800 px-2 py-0.5 rounded text-[10px] font-mono text-stone-300 font-bold uppercase shadow-sm">
                          {m.year}
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E50914] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    </div>

                    {/* Main Info */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-1.5 flex flex-col">
                        <h3 className="text-base font-sans font-bold text-stone-100 tracking-tight leading-snug line-clamp-1 group-hover:text-white transition duration-200 order-first mb-0.5">{m.title}</h3>
                        <div className="text-xs text-[#E50914] font-sans font-semibold truncate mb-1">Director: {m.director}</div>
                        <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed font-sans">{m.description}</p>
                      </div>

                      {/* Genres */}
                      <div className="flex flex-wrap gap-1.5">
                        {m.genre.slice(0, 2).map((g, index) => (
                          <span key={index} className="bg-stone-900 border border-stone-800 text-[9px] font-mono text-stone-400 px-2 py-0.5 rounded text-center font-bold">
                            {g}
                          </span>
                        ))}
                        {m.genre.length > 2 && (
                          <span className="text-[9px] text-stone-500 font-mono self-center px-1 font-bold">+{m.genre.length - 2}</span>
                        )}
                      </div>
                    </div>

                    {/* Footer specs */}
                    <div className="px-5 py-3 border-t border-stone-850 bg-stone-900/40 flex justify-between items-center text-xs">
                      <div className="flex items-center gap-1 font-mono text-amber-500 font-bold pb-0.5">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>{m.rating}</span>
                      </div>
                      
                      {/* Watchlist indicator badge */}
                      <span className="flex items-center gap-2">
                        {watchlist.includes(m.id) && (
                          <BookmarkCheck className="w-4 h-4 text-red-500" title="Saved in watchlist" />
                        )}
                        <span className="text-[10px] font-sans text-stone-400 font-bold">{m.boxOffice > 1000 ? `⭐ ${(m.boxOffice / 100).toFixed(1)}k Cr` : `${m.boxOffice} Cr`}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT SECTION: UPCOMING HOTSPOT PANEL (1 COL) */}
          <div className="lg:col-span-1 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="text-xs font-sans uppercase tracking-wider text-stone-300 flex items-center gap-2 font-bold">
                <Calendar className="w-4 h-4 text-[#E50914]" /> Upcoming ({upcomingMovies.length})
              </h3>
              <span className="text-[10px] text-stone-500 font-mono">Spotlight</span>
            </div>

            {upcomingMovies.length === 0 ? (
              <div className="text-center py-12 bg-[#141414] border border-stone-800 rounded-2xl p-4">
                <ShieldAlert className="w-6 h-6 text-stone-500 mx-auto mb-2" />
                <p className="text-xs text-stone-400 font-mono">No upcoming matches</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {upcomingMovies.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => handleExpandMovie(m.id)}
                    className={`group bg-[#181818] border rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between transition-all duration-300 hover:border-stone-700 ${
                      activeMovieId === m.id 
                        ? "border-[#E50914] ring-2 ring-[#E50914]/20" 
                        : "border-stone-800"
                    }`}
                  >
                    {/* Header line for Upcoming card */}
                    <div className="p-4 flex items-center gap-3 bg-[#101010] border-b border-stone-850">
                      <div className="text-3xl bg-stone-900 p-2 rounded-xl border border-stone-800">{m.posterUrl || "🎬"}</div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[8px] font-mono bg-[#E50914]/10 border border-[#E50914]/30 text-[#E50914] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider shadow-sm inline-block">
                          Upcoming ⏰
                        </span>
                        <h4 className="text-sm font-sans font-bold text-stone-200 mt-1 truncate group-hover:text-white transition duration-200">{m.title}</h4>
                      </div>
                    </div>

                    <div className="p-4 space-y-4">
                      <p className="text-[11px] text-stone-400 line-clamp-2 leading-relaxed">{m.description}</p>
                      
                      <div className="space-y-1.5 text-[10px]">
                        <div className="flex justify-between border-b border-stone-850 pb-1.5">
                          <span className="text-stone-400">Directed By:</span>
                          <span className="font-bold text-stone-200">{m.director}</span>
                        </div>
                        <div className="flex justify-between border-b border-stone-850 pb-1.5">
                          <span className="text-stone-400">Scheduled Year:</span>
                          <span className="font-bold font-mono text-stone-200">{m.year}</span>
                        </div>
                        
                        {/* Target release info badge */}
                        <div className="flex justify-between items-center bg-stone-900 p-2 rounded-lg border border-stone-800">
                          <span className="text-stone-400 text-[10px] font-semibold flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#E50914]" /> Release Date:
                          </span>
                          <span className="font-mono font-bold text-stone-300 text-[10px]">{m.releaseDate || "TBA"}</span>
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
                          className="w-full bg-[#E50914] hover:bg-[#b00710] text-white font-sans text-xs font-bold py-2 px-3 flex items-center justify-center gap-1.5 transition-all duration-200 shadow-sm cursor-pointer"
                        >
                          <Play className="w-3 h-3 fill-white text-white" /> Play Trailer
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
          <div className="relative w-full max-w-4xl aspect-video bg-[#141414] border border-stone-850 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
            <button
              onClick={() => setActiveTrailerUrl(null)}
              className="absolute top-3 right-3 z-10 text-xs font-sans bg-stone-900 border border-stone-800 text-stone-400 hover:text-white py-1.5 px-3.5 rounded-lg cursor-pointer shadow-lg transition"
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
