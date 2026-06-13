import { useState, useEffect } from "react";
import { 
  Search, Play, Pause, Heart, Music, ListMusic, Sparkles, 
  RefreshCw, Film, Disc, ChevronRight, Volume2, Mic, Calendar, User, CheckCircle
} from "lucide-react";
import { SONGS_DATABASE } from "../data/songsData";
import { Song } from "../types";
import { BollywoodSynth } from "../utils/audioSynth";

interface SongsJukeboxProps {
  onRegisterXp: (amount: number) => void;
  onSelectMovie: (movieTitle: string) => void;
  autoPlaySongId?: number | null;
  onClearAutoPlay?: () => void;
}

export default function SongsJukebox({ onRegisterXp, onSelectMovie, autoPlaySongId, onClearAutoPlay }: SongsJukeboxProps) {
  const [songs, setSongs] = useState<Song[]>(SONGS_DATABASE);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [selectedMood, setSelectedMood] = useState<string>("All");
  const [selectedSinger, setSelectedSinger] = useState<string>("All");
  const [selectedActor, setSelectedActor] = useState<string>("All");
  const [selectedActress, setSelectedActress] = useState<string>("All");
  const [viewPlaylistOnly, setViewPlaylistOnly] = useState(false);

  // User Playlist state stored in localStorage
  const [playlist, setPlaylist] = useState<number[]>([]);

  // Simulation of audio state
  const [activeSong, setActiveSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);

  // AI assistant trivia & lyrics
  const [triviaLoading, setTriviaLoading] = useState<number | null>(null);
  const [songTrivia, setSongTrivia] = useState<Record<number, { lyrics: string; fact: string }>>({});

  // Pagination for large list of 400 songs to keep performance exceptionally smooth
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Load Playlist from localstorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("bolly_songs_playlist");
      if (saved) {
        setPlaylist(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Localstorage failed to load songs playlist", e);
    }
  }, []);

  // Save Playlist
  const togglePlaylist = (id: number) => {
    let updated;
    if (playlist.includes(id)) {
      updated = playlist.filter(pId => pId !== id);
    } else {
      updated = [...playlist, id];
      onRegisterXp(5); // Register XP for building personal playlist
    }
    setPlaylist(updated);
    localStorage.setItem("bolly_songs_playlist", JSON.stringify(updated));
  };

  // Handle Auto-Play from external component actions
  useEffect(() => {
    if (autoPlaySongId) {
      const song = SONGS_DATABASE.find(s => s.song_id === autoPlaySongId);
      if (song) {
        setActiveSong(song);
        setIsPlaying(true);
        setPlaybackProgress(0);
        
        // Wipe filters to make sure it's showing
        setSearchQuery("");
        setSelectedSinger("All");
        setSelectedGenre("All");
        setSelectedMood("All");
        setSelectedActor("All");
        setSelectedActress("All");
        setViewPlaylistOnly(false);
      }
      if (onClearAutoPlay) {
        onClearAutoPlay();
      }
    }
  }, [autoPlaySongId, onClearAutoPlay]);

  // Synchronize actual Audio playback with BollywoodSynth
  useEffect(() => {
    if (activeSong && isPlaying) {
      BollywoodSynth.playSong(
        activeSong.song_title,
        activeSong.genre,
        () => {},
        () => {
          // Song finished playing
          setPlaybackProgress(100);
          setIsPlaying(false);
        }
      );
    } else {
      BollywoodSynth.stop();
    }

    return () => {
      BollywoodSynth.stop();
    };
  }, [activeSong, isPlaying]);

  // Sound Visualizer / Progress simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && activeSong) {
      interval = setInterval(() => {
        setPlaybackProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            BollywoodSynth.stop();
            return 0;
          }
          return prev + 5;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isPlaying, activeSong]);

  const handlePlaySong = (song: Song) => {
    if (activeSong?.song_id === song.song_id) {
      setIsPlaying(!isPlaying);
    } else {
      setActiveSong(song);
      setIsPlaying(true);
      setPlaybackProgress(0);
      onRegisterXp(10); // Register XP for listening/discovering a new Bollywood masterpiece!
    }
  };

  // Get unique filters
  const allGenres = ["All", ...Array.from(new Set(SONGS_DATABASE.map(s => s.genre).filter(Boolean)))];
  const allMoods = ["All", ...Array.from(new Set(SONGS_DATABASE.map(s => s.mood).filter(Boolean)))];
  
  // Singers list - extract common primary ones to keep menu neat
  const allSingers = [
    "All",
    "Arijit Singh",
    "Shreya Ghoshal",
    "Sonu Nigam",
    "Lata Mangeshkar",
    "Udit Narayan",
    "Alka Yagnik",
    "Mohit Chauhan",
    "Yo Yo Honey Singh",
    "Atif Aslam",
    "Sunidhi Chauhan",
    "Mika Singh",
    "B Praak",
    "Amit Trivedi"
  ];

  // Actors list
  const allActors = [
    "All",
    "Shah Rukh Khan",
    "Ranbir Kapoor",
    "Ranveer Singh",
    "Hrithik Roshan",
    "Aamir Khan",
    "Salman Khan",
    "Shahid Kapoor",
    "Akshay Kumar",
    "Vicky Kaushal",
    "Varun Dhawan",
    "Sidharth Malhotra",
    "Farhan Akhtar"
  ];

  const allActresses = [
    "All",
    "Deepika Padukone",
    "Alia Bhatt",
    "Kajol",
    "Katrina Kaif",
    "Kriti Sanon",
    "Kareena Kapoor",
    "Shraddha Kapoor",
    "Priyanka Chopra",
    "Kiara Advani",
    "Nora Fatehi",
    "Anushka Sharma",
    "Preity Zinta"
  ];

  // AI-Powered hook lyrics and trivia generator
  const handleGenerateTrivia = async (song: Song) => {
    if (songTrivia[song.song_id]) return; // already loaded
    setTriviaLoading(song.song_id);

    try {
      // Fetch dynamic lyrics + fact using our AI Chat proxy on the backend server
      const prompt = `Provide the famous 2-line hook lyrics and one fun/romantic/cinematic background research fact about the legendary Bollywood song:
Title: "${song.song_title}"
Movie: "${song.movie}" (${song.year})
Singer: "${song.singer}"
Genre/Mood: "${song.genre} / ${song.mood}".

Return a valid raw JSON object matching this schema EXACTLY:
{
  "lyrics": "Hindi text or English transliterated lyrics here",
  "fact": "Fascinating production choice, recording story, or actor trivia in 1-2 engaging sentences."
}

Do not include any markdown backticks, code blocks, or explanations outside the JSON object. Just raw JSON.`;

      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "user", content: prompt }
          ]
        }),
      });

      const data = await response.json();
      if (data.response) {
        // Try parsing the JSON
        try {
          const parsed = JSON.parse(data.response.trim().replace(/^```json\s*/i, "").replace(/```$/, ""));
          setSongTrivia(prev => ({
            ...prev,
            [song.song_id]: {
              lyrics: parsed.lyrics || "Singing beats in style! Dum Tara Tara...",
              fact: parsed.fact || "A spectacular chart-topper loved by Bollywood fans globally."
            }
          }));
        } catch (jsonErr) {
          // Fallback if parsing failed
          setSongTrivia(prev => ({
            ...prev,
            [song.song_id]: {
              lyrics: `🎵 Oh hamsafar hamsafar... ${song.song_title} suron mein beh raha hai!`,
              fact: `The song was recorded by ${song.singer} and became a blockbuster sensation for "${song.movie}" during the ${song.year} releases.`
            }
          }));
        }
      }
      onRegisterXp(12); // XP earned for doing advanced movie research
    } catch (e) {
      console.error(e);
      setSongTrivia(prev => ({
        ...prev,
        [song.song_id]: {
          lyrics: "🎵 Yeh moh moh ke dhaage... (Lyrics temporarily offline)",
          fact: "Did you know? This beautiful track went viral instantly upon launch and has over 500M+ views on streaming networks."
        }
      }));
    } finally {
      setTriviaLoading(null);
    }
  };

  // Filter application
  const filteredSongs = SONGS_DATABASE.filter(song => {
    // Search query matches title, movie, singer, actor, actress
    const matchesSearch = 
      song.song_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.movie.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.singer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.lead_actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.lead_actress.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGenre = selectedGenre === "All" || song.genre === selectedGenre;
    const matchesMood = selectedMood === "All" || song.mood === selectedMood;
    
    // Singer matcher - search inside singer string
    const matchesSinger = selectedSinger === "All" || song.singer.toLowerCase().includes(selectedSinger.toLowerCase());
    
    // Actors
    const matchesActor = selectedActor === "All" || song.lead_actor === selectedActor;
    const matchesActress = selectedActress === "All" || song.lead_actress === selectedActress;

    // View personal playlist only
    const matchesPlaylist = !viewPlaylistOnly || playlist.includes(song.song_id);

    return matchesSearch && matchesGenre && matchesMood && matchesSinger && matchesActor && matchesActress && matchesPlaylist;
  });

  // Pagination bounds
  const totalItems = filteredSongs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedSongs = filteredSongs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedGenre("All");
    setSelectedMood("All");
    setSelectedSinger("All");
    setSelectedActor("All");
    setSelectedActress("All");
    setViewPlaylistOnly(false);
    setCurrentPage(1);
  };

  // Synchronise page with filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedGenre, selectedMood, selectedSinger, selectedActor, selectedActress, viewPlaylistOnly]);

  return (
    <div className="space-y-6 container mx-auto text-stone-100" id="songs-hub-section">
      {/* Header marquee info */}
      <div className="relative bg-[#181818] rounded-3xl p-6 border border-stone-800 overflow-hidden flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl">
        <div className="space-y-1 text-center md:text-left z-10">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Music className="w-5 h-5 text-[#E50914]" />
            <span className="text-[10px] uppercase font-sans text-[#E50914] tracking-wider font-extrabold px-3 py-0.5 bg-[#E50914]/10 rounded-full border border-[#E50914]/20 shadow-sm animate-pulse">400+ Hit Tracks</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-sans font-black text-white leading-tight tracking-tight mt-1">Bollywood Soundtracks Jukebox</h2>
          <p className="text-xs text-stone-400 max-w-xl font-sans leading-relaxed">
            Explore 400 ultimate Bollywood hit songs! Filters based on moods, premium singers, or key actors. Unlock AI-curated lyric booklets and verified production trivia.
          </p>
        </div>
        
        {/* Playlists Quick Stats */}
        <div className="flex gap-3 text-center z-10">
          <div 
            onClick={() => { setViewPlaylistOnly(!viewPlaylistOnly); }}
            className={`cursor-pointer bg-[#181818] border p-3.5 rounded-2xl flex flex-col items-center justify-center min-w-[100px] transition duration-300 hover:-translate-y-0.5 ${
              viewPlaylistOnly ? "border-[#E50914]/50 bg-[#E50914]/10" : "border-stone-800 hover:border-[#E50914]/20"
            }`}
          >
            <Heart className={`w-5 h-5 mb-1.5 ${playlist.length > 0 ? "text-[#E50914] fill-[#E50914] animate-pulse" : "text-stone-450"}`} />
            <span className="text-[10px] font-sans uppercase text-stone-400 font-bold">My Playlist</span>
            <span className="text-lg font-mono font-bold text-[#E50914]">{playlist.length}</span>
          </div>
          <div className="bg-[#181818] border border-stone-800 p-3.5 rounded-2xl flex flex-col items-center justify-center min-w-[100px]">
            <Disc className="w-5 h-5 text-stone-400 mb-1.5 animate-spin-slow" />
            <span className="text-[10px] font-sans uppercase text-stone-400 font-bold">Total Tracks</span>
            <span className="text-lg font-mono font-bold text-stone-200">{SONGS_DATABASE.length}</span>
          </div>
        </div>
      </div>

      {/* FILTER & CONTROL CENTER */}
      <div className="bg-[#181818] border border-stone-800 p-5 md:p-6 rounded-2xl space-y-4 shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {/* Main search bar */}
          <div className="relative lg:col-span-5">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
            <input
              type="text"
              placeholder="Search by song name, movie, singer, cast..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-900 border border-stone-800 focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914]/20 py-2.5 pl-10 pr-4 rounded-xl text-xs text-stone-200 outline-none transition font-sans"
            />
          </div>
          
          {/* Select singer */}
          <div className="lg:col-span-3">
            <select
              value={selectedSinger}
              onChange={(e) => setSelectedSinger(e.target.value)}
              className="w-full bg-stone-900 border border-stone-800 hover:border-stone-700 py-2.5 px-3 rounded-xl text-xs text-stone-300 outline-none cursor-pointer transition font-sans focus:border-[#E50914]"
            >
              <option value="All">All Singers</option>
              {allSingers.filter(s => s !== "All").map((singer, idx) => (
                <option key={idx} value={singer}>{singer}</option>
              ))}
            </select>
          </div>

          {/* Select Actor */}
          <div className="lg:col-span-2">
            <select
              value={selectedActor}
              onChange={(e) => setSelectedActor(e.target.value)}
              className="w-full bg-cinema-dark border border-white/10 hover:border-white/20 py-2.5 px-3 rounded-xl text-xs text-stone-300 outline-none cursor-pointer transition font-sans"
            >
              <option value="All">All Actors</option>
              {allActors.filter(a => a !== "All").map((actor, idx) => (
                <option key={idx} value={actor}>{actor}</option>
              ))}
            </select>
          </div>

          {/* Select Actress */}
          <div className="lg:col-span-2">
            <select
              value={selectedActress}
              onChange={(e) => setSelectedActress(e.target.value)}
              className="w-full bg-cinema-dark border border-white/10 hover:border-white/20 py-2.5 px-3 rounded-xl text-xs text-stone-300 outline-none cursor-pointer transition font-sans"
            >
              <option value="All">All Actresses</option>
              {allActresses.filter(a => a !== "All").map((actress, idx) => (
                <option key={idx} value={actress}>{actress}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Categories / Genre & Mood Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[10px] font-mono text-stone-400 font-extrabold uppercase mr-1">Mood filter:</span>
            {allMoods.slice(0, 8).map((mood, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedMood(mood)}
                className={`py-1 px-3 rounded-full text-[11px] font-sans transition-all font-medium ${
                  selectedMood === mood 
                    ? "bg-gold-400/20 text-gold-300 border border-gold-400/30" 
                    : "bg-cinema-dark hover:bg-stone-800 text-stone-400 hover:text-stone-200 border border-white/5"
                }`}
              >
                {mood}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[10px] font-mono text-stone-400 font-extrabold uppercase mr-1">Genre filter:</span>
            {allGenres.slice(0, 8).map((genre, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedGenre(genre)}
                className={`py-1 px-3 rounded-full text-[11px] font-sans transition-all font-medium ${
                  selectedGenre === genre 
                    ? "bg-pink-500/25 text-pink-300 border border-pink-500/30" 
                    : "bg-cinema-dark hover:bg-stone-800 text-stone-400 hover:text-stone-200 border border-white/5"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Reset Indicator */}
        {(searchQuery || selectedGenre !== "All" || selectedMood !== "All" || selectedSinger !== "All" || selectedActor !== "All" || selectedActress !== "All" || viewPlaylistOnly) && (
          <div className="flex items-center justify-between bg-gold-400/5 border border-gold-400/10 px-4 py-2.5 rounded-xl">
            <p className="text-[11px] text-gold-300 font-mono">
              Filtered down to <span className="font-extrabold text-gold-200">{filteredSongs.length}</span> out of {SONGS_DATABASE.length} tracks.
            </p>
            <button
              onClick={resetFilters}
              className="text-[10px] font-mono uppercase bg-gold-400/10 text-gold-300 px-2.5 py-1 rounded-lg hover:bg-gold-400/20 active:scale-95 transition flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> Clear filters
            </button>
          </div>
        )}
      </div>

      {/* RESULTS GRID */}
      <div>
        {paginatedSongs.length === 0 ? (
          <div className="text-center py-16 bg-[#1a0e14]/20 border border-white/5 rounded-2xl space-y-3">
            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto text-pink-400 text-xl animate-pulse">🎬</div>
            <h3 className="font-serif font-bold text-gold-300 text-lg">No Soundtracks Match Your Filters</h3>
            <p className="text-xs text-stone-400 max-w-md mx-auto leading-relaxed">
              We couldn't spot any tracks matching your search. Try broadening your selectors or start clean by wiping your active filters.
            </p>
            <button
              onClick={resetFilters}
              className="mt-2 text-xs bg-gold-400/15 border border-gold-400/30 text-gold-300 px-4 py-2 rounded-xl hover:bg-gold-400/25 transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paginatedSongs.map((song) => {
                const isCurrentActive = activeSong?.song_id === song.song_id;
                const isPlayingActive = isCurrentActive && isPlaying;
                const hasTrivia = songTrivia[song.song_id] !== undefined;

                return (
                  <div 
                    key={song.song_id} 
                    className={`bg-[#181818] border p-4 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] hover:border-stone-700 overflow-hidden relative ${
                      isCurrentActive ? "border-[#E50914]/40 bg-stone-900" : "border-stone-850"
                    }`}
                  >
                    {/* Visual pulse layer if active */}
                    {isPlayingActive && (
                      <div className="absolute right-0 top-0 w-32 h-32 bg-[#E50914]/5 rounded-full blur-[40px] pointer-events-none" />
                    )}

                    <div className="flex items-start gap-3.5 relative z-10">
                      {/* Play Action Circle */}
                      <button
                        onClick={() => handlePlaySong(song)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border transition-all duration-200 active:scale-95 shadow-lg ${
                          isCurrentActive 
                            ? "bg-[#E50914] border-[#E50914]/30 text-white hover:bg-[#b00710]"
                            : "bg-stone-950 border border-stone-800 hover:border-[#E50914]/40 text-stone-300 hover:bg-stone-900"
                        }`}
                        title="Simulate Soundtrack Playback"
                      >
                        {isPlayingActive ? (
                          <Pause className="w-4 h-4 fill-current text-white" />
                        ) : (
                          <Play className={`w-4 h-4 pl-0.5 ${isCurrentActive ? "fill-white" : "fill-current"}`} />
                        )}
                      </button>

                      {/* Song Information */}
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-sans font-bold text-sm text-stone-100 hover:text-[#E50914] transition truncate pr-1">
                            {song.song_title}
                          </h4>
                          <span className="bg-[#E50914]/10 border border-[#E50914]/15 rounded-full px-2 py-0.5 text-[9px] text-[#E50914] font-sans font-bold">
                            {song.genre}
                          </span>
                          <span className="bg-stone-900 border border-stone-850 rounded-full px-2 py-0.5 text-[9px] text-stone-400 font-mono">
                            {song.mood}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-stone-300 flex-wrap">
                          <span className="font-sans font-medium text-stone-300">{song.singer}</span>
                        </div>

                        {/* Associated Movie Section */}
                        <div className="flex items-center gap-1 pt-1 text-[11px] font-sans text-stone-400">
                          <Film className="w-3 h-3 text-[#E50914]" />
                          <span>Movie: </span>
                          <button
                            onClick={() => onSelectMovie(song.movie)}
                            className="text-stone-300 hover:text-white hover:underline inline-flex items-center font-bold"
                          >
                            {song.movie} ({song.year})
                          </button>
                        </div>

                        {/* Cast metadata */}
                        <div className="flex items-center gap-2 pt-0.5 text-[10px] text-stone-500 font-sans flex-wrap">
                          {song.lead_actor && song.lead_actor !== "None" && (
                            <span className="flex items-center gap-0.5">
                              <User className="w-2.5 h-2.5 text-stone-600" /> Actor: {song.lead_actor}
                            </span>
                          )}
                          {song.lead_actress && song.lead_actress !== "None" && (
                            <span className="flex items-center gap-0.5">
                              <User className="w-2.5 h-2.5 text-stone-600" /> Actress: {song.lead_actress}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* ACTIONS BAR (BOTTOM) */}
                    <div className="mt-4 pt-3 border-t border-stone-850 flex items-center justify-between gap-2 relative z-10">
                      {/* AI trivia lookup trigger */}
                      <button
                        onClick={() => handleGenerateTrivia(song)}
                        className={`text-[10px] font-mono px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition ${
                          hasTrivia
                            ? "bg-[#E50914]/15 text-white border border-[#E50914]/20 hover:bg-[#E50914]/20"
                            : "bg-stone-900 hover:bg-stone-850 text-stone-300 border border-stone-800"
                        }`}
                      >
                        <Sparkles className={`w-3 h-3 text-[#E50914] ${triviaLoading === song.song_id ? "animate-spin" : ""}`} />
                        <span>{triviaLoading === song.song_id ? "AI Querying..." : hasTrivia ? "Review AI Booklet" : "Get AI Trivia & Hook"}</span>
                      </button>

                      <div className="flex items-center gap-1">
                        {/* Play On YouTube */}
                        <a
                          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(song.song_title + " " + song.movie + " " + song.singer + " song")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 px-2.5 bg-red-600/10 hover:bg-[#E50914] text-red-400 hover:text-white border border-red-500/20 rounded-lg text-[10px] font-sans font-bold flex items-center gap-1 transition-all"
                          title="Open YouTube to play this exact song"
                        >
                          <Play className="w-2.5 h-2.5 fill-current" /> YouTube 🎬
                        </a>

                        {/* Go to Movie Explorer */}
                        <button
                          onClick={() => onSelectMovie(song.movie)}
                          className="p-1 px-2 border border-stone-850 bg-stone-900 rounded-lg text-stone-400 hover:text-white text-[10px] font-sans flex items-center gap-1 transition cursor-pointer"
                          title="View film in search explorer"
                        >
                          Find Movie <ChevronRight className="w-3 h-3" />
                        </button>

                        {/* Playlist Hearth */}
                        <button
                          onClick={() => togglePlaylist(song.song_id)}
                          className={`p-1.5 rounded-lg border transition ${
                            playlist.includes(song.song_id)
                              ? "bg-[#E50914]/20 border-[#E50914]/30 text-[#E50914] hover:bg-[#E50914]/30"
                              : "bg-stone-950 border-stone-850 text-stone-400 hover:text-[#E50914] hover:bg-stone-900"
                          }`}
                          title={playlist.includes(song.song_id) ? "Remove from my playlist" : "Add to my playlist"}
                        >
                          <Heart className={`w-3.5 h-3.5 ${playlist.includes(song.song_id) ? "fill-[#E50914]" : ""}`} />
                        </button>
                      </div>
                    </div>

                    {/* EXPANDED AI TRIVIA PANEL */}
                    {hasTrivia && (
                      <div className="mt-3 bg-pink-950/15 border border-pink-500/10 p-3 rounded-xl space-y-2 relative animate-slideUp">
                        <div className="absolute top-2 right-2 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-gold-400" />
                          <span className="text-[8px] font-mono text-gold-400 font-extrabold uppercase tracking-wide">AI Booklet</span>
                        </div>
                        
                        <div className="space-y-1">
                          <span className="text-[9px] text-pink-300 font-mono font-extrabold uppercase block tracking-wider">Hook Lyrics Transliterated</span>
                          <p className="text-xs text-amber-100 italic leading-relaxed font-sans select-all selection:bg-pink-500/30">
                            "{songTrivia[song.song_id].lyrics}"
                          </p>
                        </div>
                        
                        <div className="space-y-1 pt-1 border-t border-white/5">
                          <span className="text-[9px] text-pink-300 font-mono font-extrabold uppercase block tracking-wider">Filmy Fact File</span>
                          <p className="text-[11px] text-stone-300 leading-normal font-sans">
                            {songTrivia[song.song_id].fact}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* PAGINATION CONTROL ROW */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <span className="text-[11px] text-stone-400 font-mono">
                  Showing <span className="font-semibold text-stone-200">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="font-semibold text-stone-200">{Math.min(currentPage * itemsPerPage, filteredSongs.length)}</span> of <span className="font-bold text-gold-300">{filteredSongs.length}</span> soundtracks
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-1 px-3 bg-cinema-dark border border-white/10 rounded-xl text-stone-300 text-xs hover:bg-stone-850 disabled:opacity-40 disabled:cursor-not-allowed transition font-sans"
                  >
                    Prev
                  </button>
                  <span className="text-xs font-mono px-3 text-stone-300 font-bold">
                    Page {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-1 px-3 bg-cinema-dark border border-white/10 rounded-xl text-stone-300 text-xs hover:bg-stone-850 disabled:opacity-40 disabled:cursor-not-allowed transition font-sans"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* AUDIO PLAYBACK SIMULATION BAR */}
      {activeSong && (
        <div className="fixed bottom-0 left-0 right-0 cinematic-blur-nav border-t border-gold-500/30 p-4 z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.8)] animate-slideUp">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Left side: record spinning + title */}
            <div className="flex items-center gap-3.5 min-w-0 w-full md:w-auto">
              {/* Record vinyl */}
              <div className="relative shrink-0 w-11 h-11 bg-stone-900 border border-stone-800 rounded-full flex items-center justify-center shadow-md shadow-pink-500/15">
                <Disc className={`w-10 h-10 text-stone-600 ${isPlaying ? "animate-spin-slow" : ""}`} />
                <div className="absolute w-2 h-2 bg-pink-500 rounded-full border border-stone-900 shadow-inner" />
              </div>
              
              <div className="min-w-0">
                <div className="text-[10px] text-pink-400 font-mono font-extrabold uppercase animate-pulse">Now Sounding</div>
                <h5 className="font-serif italic font-bold text-gold-250 truncate text-[13px]">{activeSong.song_title}</h5>
                <p className="text-[11px] text-stone-400 truncate font-sans">
                  {activeSong.singer} — <span className="font-mono text-stone-500">{activeSong.movie}</span>
                </p>
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(activeSong.song_title + " " + activeSong.movie + " " + activeSong.singer + " song")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] font-sans font-black text-red-500 hover:text-red-400 hover:underline mt-1"
                >
                  <Play className="w-2.5 h-2.5 fill-current text-red-500" /> Play Original on YouTube 🎬 &rarr;
                </a>
              </div>
            </div>

            {/* Center: Controls + Progress Bar */}
            <div className="flex items-center gap-3 w-full md:max-w-md flex-1">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-9 h-9 rounded-full bg-gold-400 flex items-center justify-center shrink-0 shadow-md text-stone-950 active:scale-95 hover:bg-gold-300 transition"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 fill-stone-950" /> : <Play className="w-3.5 h-3.5 fill-stone-950 pl-0.5" />}
              </button>

              <div className="flex-1 space-y-1">
                <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-gradient-to-r from-pink-500 to-gold-400 rounded-full transition-all duration-350"
                    style={{ width: `${playbackProgress}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[9px] font-mono text-stone-500">
                  <span>0:{playbackProgress < 10 ? `0${Math.floor(playbackProgress / 2)}` : Math.floor(playbackProgress / 2)}</span>
                  <span>Audio Preview Simulation</span>
                  <span>3:10</span>
                </div>
              </div>
            </div>

            {/* Right: Visual EQizer Bars + Sound Trigger */}
            <div className="flex items-center gap-4 shrink-0 justify-end w-full md:w-auto">
              {/* Dance visualizer bars */}
              <div className="flex items-end gap-0.5 h-6 shrink-0">
                {[...Array(6)].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-1 bg-pink-500 rounded-t transitioning-all duration-300"
                    style={{ 
                      height: isPlaying ? `${Math.floor(Math.random() * 20) + 4}px` : "3px",
                      opacity: isPlaying ? 1 : 0.4
                    }}
                  />
                ))}
              </div>

              {/* Volume representation */}
              <div className="flex items-center gap-2 text-stone-400 text-xs">
                <Volume2 className="w-4 h-4 text-gold-400" />
                <span className="font-mono text-[10px]">Loop: ON</span>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
