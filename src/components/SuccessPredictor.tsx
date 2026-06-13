import { useState, useEffect, FormEvent } from "react";
import { 
  Ticket, 
  Sparkles, 
  Plus, 
  Award, 
  History, 
  Star, 
  Share2, 
  Calendar, 
  Tv, 
  Heart, 
  Smile, 
  Film, 
  Check, 
  Info
} from "lucide-react";
import { MOVIES_DATABASE, Movie } from "../data/bollyData";
import { UserReview } from "../types";

export default function SuccessPredictor({ onRegisterXp }: { onRegisterXp: (amount: number) => void }) {
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<"log" | "keepsake" | "diary">("log");
  const [movies, setMovies] = useState<Movie[]>([]);

  // Form states
  const [selectedMovieId, setSelectedMovieId] = useState<string>("");
  const [authorName, setAuthorName] = useState<string>("Ananya");
  const [rating, setRating] = useState<number>(5);
  const [watchedMedium, setWatchedMedium] = useState<string>("Cinema Screen 🏛️");
  const [mood, setMood] = useState<string>("Emotional 😭");
  const [favoriteDialogue, setFavoriteDialogue] = useState<string>("");
  const [reviewText, setReviewText] = useState<string>("");
  
  // App UI states
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedKeepsakeReview, setSelectedKeepsakeReview] = useState<UserReview | null>(null);
  const [ticketColor, setTicketColor] = useState<"gold" | "velvet" | "obsidian">("gold");
  const [notification, setNotification] = useState<string | null>(null);
  const [stampedMessage, setStampedMessage] = useState<boolean>(false);

  // Load reviews and movies
  useEffect(() => {
    fetchReviews();
    setMovies(MOVIES_DATABASE);
  }, []);

  const fetchReviews = async () => {
    try {
      const resp = await fetch("/api/reviews");
      const data = await resp.json();
      setReviews(data);
      if (data.length > 0 && !selectedKeepsakeReview) {
        setSelectedKeepsakeReview(data[0]);
      }
    } catch (err) {
      console.error("Error loading reviews:", err);
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleLogMovie = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedMovieId) {
      showNotification("❌ Please select a Bollywood film to review!");
      return;
    }
    if (!reviewText.trim()) {
      showNotification("❌ Please type a short review of what you felt!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieId: selectedMovieId,
          rating: rating,
          author: authorName,
          content: reviewText,
          dialogue: favoriteDialogue,
          mood: mood,
          watchedMedium: watchedMedium,
          watchedDate: new Date().toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })
        })
      });

      const data = await response.json();
      if (data.error) {
        showNotification("❌ Error: " + data.error);
      } else {
        showNotification("🎉 Review logged to your Movie Diary! Gained +25 XP!");
        onRegisterXp(25);
        
        // Reset fields
        setReviewText("");
        setFavoriteDialogue("");
        
        // Reload list and set keepsake to this new entry!
        await fetchReviews();
        
        const newlyCreated: UserReview = data.review;
        setSelectedKeepsakeReview(newlyCreated);
        
        // Switch view to ticket keepsake!
        setActiveSubTab("keepsake");
      }
    } catch (err) {
      console.error(err);
      showNotification("❌ Connection issue. Saved locally instead.");
    } finally {
      setLoading(false);
    }
  };

  const handleStampTicket = () => {
    setStampedMessage(true);
    setTimeout(() => {
      setStampedMessage(false);
    }, 2500);
  };

  // Compute fan stats
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + Number(r.rating || 5), 0) / reviews.length).toFixed(1)
    : "5.0";

  const totalMinutes = reviews.length * 150;
  const hoursWatched = (totalMinutes / 60).toFixed(1);

  // Favorite snacks list
  const snacks = ["Extra Butter Popcorn 🍿", "Samosa with Chutney 🥟", "Cold Masala Soda 🍹", "Nachos with Extra Cheese 🧀", "Chai and Bun Maskas ☕"];
  const snackSelection = snacks[reviews.length % snacks.length];

  // Fan title selection
  const getFanTitle = (count: number) => {
    if (count === 0) return "Front-Row Ticket Dreamer 🎥";
    if (count <= 2) return "First-Day-First-Show Novice 🎟️";
    if (count <= 4) return "Silver Jubilee SuperFan 🌟";
    if (count <= 7) return "Golden Jubilee Cinema Expert 🏆";
    return "Housefull Box Office Legend 👑";
  };

  const filteredMovies = movies.filter(m => 
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.genre.some(g => g.toLowerCase().includes(searchQuery.toLowerCase())) ||
    m.director.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto my-2 text-pink-100" id="post-watch-diary-panel">
      
      {/* HEADER HERO */}
      <div className="glass-panel rounded-2xl p-6 border border-gold-500/25 relative overflow-hidden bg-gradient-to-r from-rose-600 via-amber-600 to-gold-500 shadow-md">
        {/* Cinematic background accent */}
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-12 -translate-y-12">
          <Film className="w-96 h-96 text-white rotate-12" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-amber-100 font-mono font-bold text-xs uppercase tracking-widest">
              <Ticket className="w-4 h-4 text-amber-200 animate-pulse" />
              Ananya's Cinema Station
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight mt-1">
              POST-WATCH CINEMA DIARY & KEEPSAKES
            </h1>
            <p className="text-xs text-amber-50 mt-2 max-w-2xl leading-relaxed">
              Whistle, rate, review, and immortalize your theatrical adrenaline! Save your thoughts on films you recently watched, write your favorite dialogue, and instantly stamp your own collectible retro <strong className="text-gold-300 font-bold">Golden Pass Cinema Ticket</strong> to share!
            </p>
          </div>
          <div className="bg-gradient-to-br from-[#4d0724]/60 to-[#230210]/60 backdrop-blur-md border border-gold-500/30 p-4 rounded-xl text-center self-start md:self-auto min-w-[170px] shadow-lg">
            <span className="text-[10px] text-pink-200 block uppercase font-bold tracking-wider mb-1">YOUR EXCELLENT RATING</span>
            <div className="text-xl font-display font-extrabold text-white font-mono">
              ★ {averageRating} <span className="text-xs text-gold-300">Avg</span>
            </div>
            <span className="text-[10px] text-stone-950 font-bold bg-gradient-to-r from-gold-400 to-amber-400 border border-gold-300 rounded-full px-2.5 py-0.5 mt-2 inline-block shadow-sm">
              {getFanTitle(reviews.length)}
            </span>
          </div>
        </div>

        {/* Dynamic Alert Banner */}
        {notification && (
          <div className="absolute bottom-3 left-6 right-6 bg-gradient-to-r from-gold-500 to-amber-400 text-stone-950 font-bold text-xs py-2 px-4 rounded-xl shadow-lg border border-gold-300 animate-slideUp flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0 text-stone-950" />
            <span>{notification}</span>
          </div>
        )}
      </div>

      {/* THREE INTERACTIVE SUB-TABS */}
      <div className="flex bg-[#320317]/85 border border-gold-500/35 p-1.5 rounded-2xl gap-2 shadow-md">
        <button
          onClick={() => setActiveSubTab("log")}
          className={`flex-1 py-3 px-4 rounded-xl text-xs md:text-sm font-display font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === "log"
              ? "bg-gradient-to-r from-gold-400 via-amber-500 to-gold-500 text-stone-950 shadow-md shadow-gold-500/10"
              : "text-pink-200/80 hover:text-white hover:bg-pink-500/15"
          }`}
        >
          <Plus className="w-4 h-4 text-gold-400" />
          Write a Filmy Critique
        </button>
        <button
          onClick={() => setActiveSubTab("keepsake")}
          className={`flex-1 py-3 px-4 rounded-xl text-xs md:text-sm font-display font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === "keepsake"
              ? "bg-gradient-to-r from-gold-400 via-amber-500 to-gold-500 text-stone-950 shadow-md shadow-gold-500/10"
              : "text-pink-200/80 hover:text-white hover:bg-pink-500/15"
          }`}
        >
          <Ticket className="w-4 h-4 text-gold-400" />
          Golden Keepsake Ticket
        </button>
        <button
          onClick={() => setActiveSubTab("diary")}
          className={`flex-1 py-3 px-4 rounded-xl text-xs md:text-sm font-display font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === "diary"
              ? "bg-gradient-to-r from-gold-400 via-amber-500 to-gold-500 text-stone-950 shadow-md shadow-gold-500/10"
              : "text-pink-200/80 hover:text-white hover:bg-pink-500/15"
          }`}
        >
          <History className="w-4 h-4 text-gold-400" />
          My Cinema Diary ({reviews.length})
        </button>
      </div>


      {/* SUB-TAB PANELS */}
      <div className="grid grid-cols-1 gap-6">
        
        {/* PANEL 1: WRITING LOG FOR FAN */}
        {activeSubTab === "log" && (
          <div className="glass-panel rounded-2xl p-6 lg:p-8 border border-white/10 space-y-6">
            <h2 className="text-xl font-display font-bold text-gold-300 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold-400 animate-pulse" />
              Filmy Review & Fan Insights
            </h2>
            <p className="text-xs text-gray-400">
              Select any of the 100 Bollywood films from the dataset to capture your post-movie thoughts.
            </p>

            <form onSubmit={handleLogMovie} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Movie dropdown selector */}
                <div className="space-y-2">
                  <label className="text-xs text-gray-300 font-bold block">1. CHOOSE FILM YOU WATCHED *</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Search films by name/director..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-cinema-dark/80 border border-white/10 rounded-xl p-3 text-xs focus:border-gold-500 focus:outline-none"
                    />
                    <div className="max-h-48 overflow-y-auto mt-2 bg-[#0c0103] border border-white/5 rounded-xl divide-y divide-white/5 text-xs">
                      {filteredMovies.slice(0, 5).map(m => (
                        <div 
                          key={m.id}
                          onClick={() => {
                            setSelectedMovieId(m.id);
                            setSearchQuery(m.title);
                          }}
                          className={`p-3 cursor-pointer hover:bg-gold-500/20 text-left transition-colors flex justify-between items-center ${
                            selectedMovieId === m.id ? "bg-gold-500/10 text-gold-300" : "text-gray-300"
                          }`}
                        >
                          <div>
                            <span className="font-bold">{m.title}</span> ({m.year})
                            <span className="text-[10px] text-gray-500 block">Dir: {m.director}</span>
                          </div>
                          <span className="font-mono text-gold-400 bg-gold-400/5 border border-gold-400/20 px-1 py-0.5 rounded text-[10px]">
                            ★ {m.rating}
                          </span>
                        </div>
                      ))}
                      {filteredMovies.length === 0 && (
                        <div className="p-3 text-gray-500 text-center">No movies match "{searchQuery}"</div>
                      )}
                    </div>
                  </div>
                  {selectedMovieId && (
                    <div className="bg-gold-500/5 border border-gold-400/20 rounded-xl p-3 flex justify-between items-center text-xs">
                      <span className="text-[10px] text-gray-400">Selected Film:</span>
                      <span className="text-gold-300 font-bold">
                        {movies.find(m => m.id === selectedMovieId)?.title} ({movies.find(m => m.id === selectedMovieId)?.year})
                      </span>
                    </div>
                  )}
                </div>

                {/* Reviewer Details */}
                <div className="space-y-2">
                  <label className="text-xs text-gray-300 font-bold block">2. FAN PEN-NAME *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter author name..."
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full bg-cinema-dark/80 border border-white/10 rounded-xl p-3 text-xs focus:border-gold-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-gray-500 block">Your critic name printed on your dynamic ticket.</span>
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Rating selection */}
                <div className="space-y-2">
                  <label className="text-xs text-gray-300 font-bold block">3. WHISTLE FACTOR (RATING)</label>
                  <div className="flex items-center gap-2 bg-cinema-dark/80 border border-white/10 rounded-xl p-3 justify-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="focus:outline-none transition-transform hover:scale-125"
                      >
                        <Star 
                          className={`w-6 h-6 ${
                            star <= rating ? "text-gold-400 fill-gold-400" : "text-gray-600"
                          }`} 
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-gold-400 block text-center uppercase tracking-wider font-semibold">
                    {rating === 5 ? "Mind-blowing Blockbuster! 🤯" :
                     rating === 4 ? "Full Paisa Vasool! Dynamic 🌟" :
                     rating === 3 ? "Decent Masala Entertainer 👍" :
                     rating === 2 ? "Below Average Screenplay 😐" : "Complete Disaster Flop 🤦"}
                  </span>
                </div>

                {/* Watch Medium */}
                <div className="space-y-2">
                  <label className="text-xs text-gray-300 font-bold block">4. WHERE DID YOU WATCH IT?</label>
                  <select
                    value={watchedMedium}
                    onChange={(e) => setWatchedMedium(e.target.value)}
                    className="w-full bg-cinema-dark/80 border border-white/10 rounded-xl p-3 text-xs focus:border-gold-500 focus:outline-none"
                  >
                    <option>Cinema Screen 🏛️</option>
                    <option>IMAX Theatre 🔊</option>
                    <option>First Day First Show 🎟️</option>
                    <option>Premium OTT Plateform 🍿</option>
                    <option>Late Night Bedtime Screen 🌙</option>
                    <option>Midnight Show with Friends 👥</option>
                  </select>
                </div>

                {/* Mood while watching */}
                <div className="space-y-2">
                  <label className="text-xs text-gray-300 font-bold block">5. MOOD DURING SCREEN EXPERIENCE</label>
                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    className="w-full bg-cinema-dark/80 border border-white/10 rounded-xl p-3 text-xs focus:border-gold-500 focus:outline-none"
                  >
                    <option>Emotional & Tearful 😭</option>
                    <option>Hysterical Laughter 😂</option>
                    <option>High-voltage Masala Action ⚡</option>
                    <option>Edge of Seat Thrill 🦈</option>
                    <option>Patriotic Goosebumps 🎖️</option>
                    <option>Musical Melody Trance 🎸</option>
                    <option>Feel-Good Warmth 🥰</option>
                  </select>
                </div>

              </div>

              {/* Dialogue Quote input */}
              <div className="space-y-2">
                <label className="text-xs text-gray-300 font-bold block">6. INSPIRATIONAL/FAVORITE DIALOGUE STAMP *</label>
                <input
                  type="text"
                  placeholder="e.g. 'All is well!', 'Baburao ka style hai!', 'Zindagi badi honi chahiye lambi nahi...'"
                  value={favoriteDialogue}
                  onChange={(e) => setFavoriteDialogue(e.target.value)}
                  className="w-full bg-cinema-dark/80 border border-white/10 rounded-xl p-3 text-xs focus:border-gold-500 focus:outline-none italic text-gold-200"
                />
                <span className="text-[10px] text-gray-500 block">This dialogue will be printed with high-contrast serif font decoration on your keepsake ticket stub!</span>
              </div>

              {/* Review Text Area */}
              <div className="space-y-2">
                <label className="text-xs text-gray-300 font-bold block">7. YOUR GENUINE CRITIQUE thoughts *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share what worked, what flopped, performance review, or music scores..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full bg-cinema-dark/80 border border-white/10 rounded-xl p-3 text-xs focus:border-gold-500 focus:outline-none leading-relaxed"
                />
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl text-xs md:text-sm font-display font-extrabold uppercase tracking-wider transition duration-300 bg-gradient-to-r from-gold-500 via-amber-500 to-yellow-500 text-cinema-dark hover:scale-[1.01] hover:shadow-lg hover:shadow-gold-500/20 disabled:opacity-50"
              >
                {loading ? "Stamping and saving review..." : "Submit Review & Generate Keepsake GOLD Ticket (+25 XP)"}
              </button>

            </form>
          </div>
        )}

        {/* PANEL 2: GOLD CINEMA TICKET STUB KEEPSAKE GENERATOR */}
        {activeSubTab === "keepsake" && (
          <div className="space-y-6">
            
            {/* Ticket shade controller */}
            <div className="glass-panel p-4 border border-white/5 rounded-2xl flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs">
                <Smile className="w-4 h-4 text-gold-400" />
                <span>Selected Movie: <strong>{selectedKeepsakeReview ? selectedKeepsakeReview.movieTitle : "No logs recorded"}</strong></span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 block font-mono">TICKET STUB VIBE:</span>
                <div className="flex rounded-lg overflow-hidden border border-white/10 p-0.5">
                  <button
                    onClick={() => setTicketColor("gold")}
                    className={`px-3 py-1 text-[10px] font-mono rounded-md ${
                      ticketColor === "gold" ? "bg-gold-500 text-cinema-dark" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Retro Gold
                  </button>
                  <button
                    onClick={() => setTicketColor("velvet")}
                    className={`px-3 py-1 text-[10px] font-mono rounded-md ${
                      ticketColor === "velvet" ? "bg-red-800 text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Velvet Rose
                  </button>
                  <button
                    onClick={() => setTicketColor("obsidian")}
                    className={`px-3 py-1 text-[10px] font-mono rounded-md ${
                      ticketColor === "obsidian" ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Midnight Obsidian
                  </button>
                </div>
              </div>
            </div>

            {/* If no review is logged */}
            {!selectedKeepsakeReview ? (
              <div className="text-center py-20 border border-dashed border-white/10 bg-cinema-dark/20 rounded-2xl">
                <Ticket className="w-16 h-16 text-gray-600 mx-auto mb-4 stroke-1" />
                <h3 className="text-lg font-display font-medium text-gray-300">No ticket stubs loaded!</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto leading-relaxed">
                  Go to the "Write a Filmy Critique" tab to log a movie you watched, or view previous reviews in the "Diary" tab.
                </p>
                <button
                  onClick={() => setActiveSubTab("log")}
                  className="mt-6 inline-flex items-center gap-2 bg-gold-500 text-cinema-dark font-semibold text-xs py-2 px-4 rounded-xl"
                >
                  <Plus className="w-4 h-4" /> Log a Movie Now
                </button>
              </div>
            ) : (
              
              <div className="space-y-6">
                
                {/* TICKET STUB VIEWPORT */}
                <div className="max-w-3xl mx-auto transform transition duration-300 hover:scale-[1.01] overflow-hidden">
                  
                  {/* Real visual Golden Ticket container */}
                  <div 
                    className={`relative rounded-3xl border-2 shadow-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between ${
                      ticketColor === "gold" 
                        ? "bg-gradient-to-r from-[#ffe59e]/15 via-[#d4aa3b]/25 to-[#9c721c]/15 border-gold-400/40 text-white"
                        : ticketColor === "velvet"
                        ? "bg-gradient-to-r from-[#3f0712] via-[#7f1d1d]/40 to-[#4c0519] border-red-500/40 text-white"
                        : "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-950 border-gray-600/40 text-white"
                    }`}
                  >
                    {/* Stamp Indicator Overlay */}
                    {stampedMessage && (
                      <div className="absolute inset-0 bg-cinema-dark/80 backdrop-blur-sm z-30 flex items-center justify-center animate-fadeIn">
                        <div className="border-4 border-dashed border-gold-400 text-gold-400 bg-black/60 rounded-xl p-6 text-center transform rotate-[-6deg] max-w-xs animate-scaleIn">
                          <span className="font-mono font-extrabold text-3xl block tracking-widest uppercase">STAMPED!</span>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mt-2">Sovereign Fan Pass Verified</span>
                          <span className="text-[11px] text-white block mt-2">Recorded internally at serial {selectedKeepsakeReview.id} (+25 XP Badge Saved)</span>
                        </div>
                      </div>
                    )}

                    {/* Tear Circles Left & Right margins */}
                    <div className="absolute left-[-11px] top-1/2 -translate-y-1/2 w-5 h-10 rounded-r-full bg-[#0d0d0d] border-r border-gold-500/30 z-10 hidden md:block" />
                    <div className="absolute right-[-11px] top-1/2 -translate-y-1/2 w-5 h-10 rounded-l-full bg-[#0d0d0d] border-l border-gold-500/30 z-10 hidden md:block" />

                    {/* LEFT MAIN SECTOR */}
                    <div className="flex-1 md:pr-8 md:border-r md:border-dashed md:border-gold-500/25 space-y-6">
                      
                      {/* Cinema Pass Label Header */}
                      <div className="flex justify-between items-center pb-4 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <Film className="w-5 h-5 text-gold-400" />
                          <span className="font-mono font-extrabold text-[10px] tracking-wider text-gold-300">BOLLYWOOD CRITICS PASS</span>
                        </div>
                        <span className="font-mono text-[9px] uppercase bg-gold-400/10 border border-gold-400/25 px-2 py-0.5 rounded-full text-gold-300">
                          {selectedKeepsakeReview.mood || "Superfan Vibe ⚡"}
                        </span>
                      </div>

                      {/* Movie title Display */}
                      <div className="space-y-2 text-left">
                        <span className="text-[10px] text-gray-400 block font-mono tracking-widest uppercase">SHOWTICKET TITLE</span>
                        <h2 className="text-3xl font-display font-black tracking-tight leading-tight uppercase text-glow">
                          {selectedKeepsakeReview.movieTitle}
                        </h2>
                        
                        {/* Film specifications */}
                        <div className="flex flex-wrap gap-4 text-[10px] font-mono text-gray-300 pt-1">
                          <span>GENRE CODE: <strong className="text-white">BOLLY_DATA</strong></span>
                          <span>DIR: <strong className="text-white">{MOVIES_DATABASE.find(m => m.id === selectedKeepsakeReview.movieId)?.director || "Bollywood Masterclass"}</strong></span>
                          <span>RATING: <strong className="text-gold-400 font-mono">★ {selectedKeepsakeReview.rating}/5</strong></span>
                        </div>
                      </div>

                      {/* Dialogue Stamp quotation block */}
                      {selectedKeepsakeReview.dialogue && (
                        <div className="bg-black/40 border border-gold-400/20 p-4 rounded-xl text-left border-l-4 border-l-gold-400 relative">
                          <span className="font-display text-xs italic text-gold-200 block">
                            "{selectedKeepsakeReview.dialogue}"
                          </span>
                          <span className="absolute right-3 bottom-0.5 text-[8px] font-mono text-gray-600 tracking-widest">ICONIC MEMORY</span>
                        </div>
                      )}

                      {/* Critiques excerpt */}
                      <div className="space-y-1 text-left">
                        <span className="text-[9px] text-gray-500 block font-mono tracking-widest">FAN CRITIQUE & RATING OBSERVATION</span>
                        <p className="text-xs text-gray-200 leading-relaxed font-sans line-clamp-3">
                          {selectedKeepsakeReview.content}
                        </p>
                      </div>

                      {/* Watch Specs bar */}
                      <div className="grid grid-cols-3 gap-2 bg-[#120509]/30 border border-white/5 p-3 rounded-xl text-[10px] font-mono text-center">
                        <div>
                          <span className="text-gray-500 block text-[8px]">WATCHED AT:</span>
                          <span className="text-white font-semibold truncate block">{selectedKeepsakeReview.watchedMedium || "Cinema Screen 🏛️"}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block text-[8px]">WATCH TIME:</span>
                          <span className="text-white font-semibold truncate block">
                            {selectedKeepsakeReview.watchedDate || new Date(selectedKeepsakeReview.timestamp).toLocaleDateString("en-IN")}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 block text-[8px]">LOGGED BY:</span>
                          <span className="text-gold-300 font-bold truncate block">{selectedKeepsakeReview.author}</span>
                        </div>
                      </div>

                    </div>

                    {/* RIGHT TENDER PASS STUB SECTOR */}
                    <div className="mt-6 md:mt-0 md:w-56 md:pl-8 flex flex-col justify-between text-left space-y-4">
                      
                      <div className="space-y-3 pb-3 border-b border-white/10">
                        <span className="text-[8px] text-gray-500 block font-mono tracking-widest text-center">STUB PASSENGER PORT</span>
                        
                        {/* Circle stars stamped format */}
                        <div className="flex flex-col items-center justify-center p-3 bg-black/30 border border-white/5 rounded-xl">
                          <span className="text-[9px] text-gold-300 font-mono mb-1">STAMP rating</span>
                          <div className="flex gap-0.5 text-gold-400">
                            {Array.from({ length: selectedKeepsakeReview.rating }).map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-gold-400" />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Stub ticket properties */}
                      <div className="space-y-2 text-[10px] font-mono">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">DIFFICULTY ID:</span>
                          <span className="text-white">BOLLY_FAN_STUB</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">SERIAL NO:</span>
                          <span className="text-gold-300 font-bold">{selectedKeepsakeReview.id.substring(4, 13) || "STB-02839"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">SEAT RESERVATION:</span>
                          <span className="text-white">ROW H / SEAT {reviews.findIndex(r => r.id === selectedKeepsakeReview.id) + 12 || "15"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">ADMIT REWARD:</span>
                          <span className="text-gold-400 font-bold">+25 XP POINTS</span>
                        </div>
                      </div>

                      {/* Barcode representation */}
                      <div className="bg-white/95 p-3 rounded-lg text-center flex flex-col items-center">
                        <div className="h-10 w-full flex items-center justify-center gap-[1.5px] scale-x-110 overflow-hidden">
                          {Array.from({ length: 44 }).map((_, i) => {
                            const heights = [24, 38, 40, 16, 32, 28];
                            const widthClass = i % 4 === 0 ? "w-[3px]" : i % 5 === 0 ? "w-[1px]" : "w-[2px]";
                            const opacityClass = i % 7 === 0 ? "bg-transparent" : "bg-black";
                            return (
                              <div 
                                key={i} 
                                className={`${widthClass} ${opacityClass}`}
                                style={{ height: `${heights[i % heights.length]}px` }}
                              />
                            );
                          })}
                        </div>
                        <span className="text-[7px] text-gray-500 block font-mono tracking-widest mt-1">★ REVIEWSYNC-{selectedKeepsakeReview.id.substring(4, 11).toUpperCase()} ★</span>
                      </div>

                    </div>

                  </div>
                </div>

                {/* TICKET CONTROL BUTTONS */}
                <div className="flex justify-center gap-4 flex-wrap">
                  <button
                    onClick={handleStampTicket}
                    className="flex items-center gap-2 bg-gradient-to-r from-gold-500 to-amber-500 text-cinema-dark py-3 px-6 rounded-xl font-display font-extrabold text-xs uppercase"
                  >
                    <Sparkles className="w-4 h-4" />
                    Stamp Verified Ticket Stub (+25 XP)
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `🎟️ My Bollywood Keepsake Ticket for ${selectedKeepsakeReview.movieTitle}! Dialogue: "${selectedKeepsakeReview.dialogue || "All Is Well"}". Rating: ${selectedKeepsakeReview.rating}/5 stars. Written with Ananya's Fan Engine!`
                      );
                      showNotification("📋 Copied shareable review details to clipboard! Share the love!");
                    }}
                    className="flex items-center gap-2 bg-pink-900/40 border border-gold-500/35 hover:bg-pink-850/50 py-3 px-6 rounded-xl font-display font-bold text-xs text-gold-300 transition-all duration-200"
                  >
                    <Share2 className="w-4 h-4" />
                    Share Keepsake Stub Description
                  </button>
                </div>

                {/* Other watches dropdown ticker */}
                {reviews.length > 1 && (
                  <div className="glass-panel text-left p-4 max-w-sm mx-auto rounded-xl">
                    <label className="text-[10px] text-gray-400 font-mono uppercase block mb-1">VIEW TICKETS OF OTHER FILM LOGS:</label>
                    <select
                      value={selectedKeepsakeReview.id}
                      onChange={(e) => {
                        const target = reviews.find(r => r.id === e.target.value);
                        if (target) setSelectedKeepsakeReview(target);
                      }}
                      className="bg-[#120509]/80 text-white w-full border border-white/10 rounded-lg p-2 text-xs focus:border-gold-500 focus:outline-none"
                    >
                      {reviews.map(r => (
                        <option key={r.id} value={r.id}>{r.movieTitle} (★ {r.rating})</option>
                      ))}
                    </select>
                  </div>
                )}

              </div>
            )}

          </div>
        )}

        {/* PANEL 3: PERSONAL FAN WATCH DIARY WITH HISTORIC LIST */}
        {activeSubTab === "diary" && (
          <div className="space-y-6">
            
            {/* STATS ROW */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              
              <div className="glass-panel p-5 border border-white/5 rounded-2xl">
                <span className="text-[10px] text-gray-500 block font-mono uppercase">TOTAL FILMS LOGGED</span>
                <span className="text-3xl font-display font-extrabold text-gold-400 block mt-1 font-mono">{reviews.length}</span>
                <span className="text-[9px] text-gray-400 block mt-1">Recorded in your local profile</span>
              </div>
              
              <div className="glass-panel p-5 border border-white/5 rounded-2xl">
                <span className="text-[10px] text-gray-500 block font-mono uppercase">THEATRIC MINUTES</span>
                <span className="text-3xl font-display font-extrabold text-amber-500 block mt-1 font-mono">{totalMinutes}</span>
                <span className="text-[9px] text-gray-400 block mt-1">Approx ({hoursWatched} Hours)</span>
              </div>

              <div className="glass-panel p-5 border border-white/5 rounded-2xl">
                <span className="text-[10px] text-gray-500 block font-mono uppercase">FAVORITE RECIPE SNACK</span>
                <span className="text-xs font-display font-extrabold text-gold-300 block mt-3 truncate">{snackSelection || "Classic Samosa"}</span>
                <span className="text-[9px] text-gray-400 block mt-1">Recommended for Next Movie</span>
              </div>

              <div className="glass-panel p-5 border border-white/5 rounded-2xl">
                <span className="text-[10px] text-gray-400 block font-mono uppercase">NEXT TICKET UNLOCK</span>
                <span className="text-xs font-display font-extrabold text-yellow-500 block mt-3 uppercase">SUPERSTAR PREMIERE</span>
                <span className="text-[9px] text-gray-500 block mt-1">Keep logging films</span>
              </div>

            </div>

            {/* CHRONOLOGICAL HISTORICAL LOG */}
            <div className="glass-panel p-6 border border-white/10 rounded-2xl space-y-6">
              
              <div className="border-b border-white/5 pb-3 text-left">
                <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-gold-400" />
                  Your Temporal Cinema Logs
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Chronological history of your cinematic watch reviews. Click on any log to generate its retro golden boarding pass ticket keepsake.
                </p>
              </div>

              {reviews.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <History className="w-12 h-12 stroke-1 text-gray-600 mx-auto mb-2" />
                  No films watched yet. Log your first movie to start your personal fan chronicle!
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((rev, index) => (
                    <div 
                      key={rev.id}
                      onClick={() => {
                        setSelectedKeepsakeReview(rev);
                        setActiveSubTab("keepsake");
                      }}
                      className="glass-panel rounded-2xl p-4 border border-white/5 hover:border-gold-500/30 transition-all duration-300 cursor-pointer flex flex-col md:flex-row justify-between gap-4 text-left group"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs text-gold-400">#{reviews.length - index} LOG</span>
                          <h4 className="text-base font-display font-bold text-white group-hover:text-gold-300 transition-colors uppercase">
                            {rev.movieTitle}
                          </h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-300 font-mono">
                            {rev.mood || "Entertained"}
                          </span>
                        </div>

                        {rev.dialogue && (
                          <p className="text-[11px] text-gold-200/80 italic font-medium">
                            Favorite Dialogue: "{rev.dialogue}"
                          </p>
                        )}

                        <p className="text-xs text-gray-300 line-clamp-2">
                          {rev.content}
                        </p>

                        <div className="flex gap-4 text-[10px] text-gray-500 font-mono">
                          <span>Date Logged: {new Date(rev.timestamp).toLocaleDateString("en-IN")}</span>
                          <span>Medium: {rev.watchedMedium || "Theatre"}</span>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between items-end md:w-32 shrink-0">
                        <div className="flex gap-0.5">
                          {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
                          ))}
                        </div>
                        <span className="text-[10px] text-gold-300 group-hover:underline mt-2">
                          🎟️ Check Ticket stub →
                        </span>
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>

          </div>
        )}

      </div>

      {/* FOOTER CINEMATIC LEGAL ACCENT */}
      <div className="bg-[#120509]/5 border border-gold-500/10 p-4 rounded-xl text-center text-[10px] text-stone-500 space-y-1">
        <div className="flex justify-center items-center gap-2">
          <Award className="w-4 h-4 text-gold-500/50" />
          <span>Ananya's Bollywood Fan Engine • Configured with {MOVIES_DATABASE.length} central database film blocks</span>
        </div>
        <div>All assets compiled on deep server-side logic matching modern React standards.</div>
      </div>

    </div>
  );
}
