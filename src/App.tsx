import { useState, useEffect } from "react";
import { Movie, UserReview, TimelineEvent } from "./types";
import { 
  Sparkles, 
  Film, 
  Tv, 
  MessageSquare, 
  Trophy, 
  Users, 
  BarChart3, 
  Layers, 
  Sparkle, 
  Clock, 
  Bookmark, 
  Eye, 
  ShieldCheck, 
  Languages, 
  Volume2, 
  Play, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Award,
  RefreshCw
} from "lucide-react";

// Submodule imports
import MovieExplorer from "./components/MovieExplorer";
import ActorDirectorUniverse from "./components/ActorDirectorUniverse";
import BoxOfficeDashboard from "./components/BoxOfficeDashboard";
import SuccessPredictor from "./components/SuccessPredictor";
import BollyGPTChat from "./components/BollyGPTChat";
import QuizArena from "./components/QuizArena";

const TRANSLATIONS = {
  en: {
    title: "Ananya's Fan Engine",
    headline: "Ananya's Mod Bollywood Experience",
    subheadline: "AI-Powered Recommendations, Sentiment Reviews, Star Insights & Box Office Analytics",
    exploreMovies: "Explore Movies",
    askAiAssistant: "Ask AI Assistant",
    userLevel: "Level",
    xpPoints: "XP Points",
    badges: "Badges",
    movieExplorer: "Movie Explorer",
    starUniverse: "Actor Universe",
    boxOfficeStats: "Box Office Dashboard",
    timeline: "Bollywood Timeline",
    bollyGpt: "BollyGPT Companion",
    quizArena: "Quiz Arena",
    predictor: "Movie Diary & Tickets",
    discover: "AI Recommendations",
    moodDiscover: "Mood Discovery",
    adminDashboard: "Admin Control",
    watchlist: "My Watchlist",
    recentActivity: "Recent Reviews",
    trending: "Trending Now",
    favoritesLabel: "Personal Favorites Tracker"
  },
  hi: {
    title: "अनन्या का फैन इंजन",
    headline: "अनन्या का नया बॉलीवुड अनुभव",
    subheadline: "AI-चालित सिफारिशें, रेटिंग, और बेहतरीन फ़िल्मी अंतर्दृष्टि",
    exploreMovies: "फिल्में देखें",
    askAiAssistant: "AI सहायक से पूछें",
    userLevel: "स्तर",
    xpPoints: "XP अंक",
    badges: "अर्जित बैज",
    movieExplorer: "मूवी एक्सप्लोरर",
    starUniverse: "कलाकार यूनिवर्स",
    boxOfficeStats: "बॉक्स ऑफिस कमाई",
    timeline: "बॉलीवुड इतिहास",
    bollyGpt: "चैट साथी BollyGPT",
    quizArena: "क्विज़ अखाड़ा",
    predictor: "फ़िल्मी डायरी और टिकट",
    discover: "AI सिफारिशें",
    moodDiscover: "मूड डिस्कवरी",
    adminDashboard: "एडमिन डैशबोर्ड",
    watchlist: "देखने की सूची",
    recentActivity: "हाल की समीक्षाएं",
    trending: "अभी ट्रेंडिंग में है",
    favoritesLabel: "व्यक्तिगत पसंद्र ट्रैकर"
  }
};

export default function App() {
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [activeTab, setActiveTab] = useState<string>("home");
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [selectedTimelineCategory, setSelectedTimelineCategory] = useState<string>("All");
  
  // Profile stats state
  const [profile, setProfile] = useState({
    watchlist: [] as { movieId: string }[],
    xp: 120,
    level: 1,
    badges: ["Movie Buff"],
    reviewCount: 0
  });

  // Mood discovery state
  const [activeMood, setActiveMood] = useState<string>("");
  const [moodRecommendations, setMoodRecommendations] = useState<any[]>([]);
  const [moodLoading, setMoodLoading] = useState(false);

  // Recommendation engine state
  const [selectedLikedMovies, setSelectedLikedMovies] = useState<string[]>(["3 Idiots"]);
  const [aiRecommendations, setAiRecommendations] = useState<any>(null);
  const [recommendLoading, setRecommendLoading] = useState(false);

  // Sync expanded movie focus ID
  const [activeMovieId, setActiveMovieId] = useState<string | null>(null);

  // Admin state
  const [adminReviews, setAdminReviews] = useState<UserReview[]>([]);
  const [adminBlockedReviews, setAdminBlockedReviews] = useState<string[]>([]);
  const [adminUsersCount, setAdminUsersCount] = useState(142);

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    fetchProfile();
    fetchTimeline();
    fetchAdminReviews();
  }, []);

  const fetchProfile = async () => {
    try {
      const resp = await fetch("/api/user/profile");
      const data = await resp.json();
      setProfile(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTimeline = async () => {
    try {
      const resp = await fetch("/api/timeline");
      const data = await resp.json();
      setTimeline(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAdminReviews = async () => {
    try {
      const resp = await fetch("/api/reviews");
      const data = await resp.json();
      setAdminReviews(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Shared function to add XP on activities
  const handleRegisterXp = async (amount: number) => {
    try {
      const resp = await fetch("/api/user/add-xp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount })
      });
      const data = await resp.json();
      setProfile(prev => ({
        ...prev,
        xp: data.xp,
        level: data.level,
        badges: data.badges
      }));
    } catch (err) {
      console.error(err);
      // fallback local update
      setProfile(prev => {
        const nextXp = prev.xp + amount;
        const nextLvl = nextXp >= prev.level * 100 ? prev.level + 1 : prev.level;
        return {
          ...prev,
          xp: nextXp,
          level: nextLvl
        };
      });
    }
  };

  // Watchlist Actions
  const handleToggleWatchlist = async (movieId: string) => {
    try {
      const resp = await fetch("/api/user/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId })
      });
      const data = await resp.json();
      setProfile(prev => ({
        ...prev,
        watchlist: data.watchlist,
        xp: data.xp,
        level: data.level,
        badges: data.badges
      }));
    } catch (err) {
      console.error(err);
    }
  };

  // trigger mood-based recommendations
  const triggerMoodDiscovery = async (mood: string) => {
    setActiveMood(mood);
    setMoodLoading(true);
    setMoodRecommendations([]);
    try {
      const resp = await fetch("/api/ai/mood-discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood })
      });
      const data = await resp.json();
      setMoodRecommendations(data.recommendations);
      handleRegisterXp(15);
    } catch (err) {
      console.error(err);
    } finally {
      setMoodLoading(false);
    }
  };

  // trigger personalized AI Recommendations
  const triggerRecommendation = async () => {
    if (selectedLikedMovies.length === 0) return;
    setRecommendLoading(true);
    setAiRecommendations(null);
    try {
      const resp = await fetch("/api/ai/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likedMovies: selectedLikedMovies })
      });
      const data = await resp.json();
      setAiRecommendations(data);
      handleRegisterXp(20);
    } catch (err) {
      console.error(err);
    } finally {
      setRecommendLoading(false);
    }
  };

  const toggleLikedMovieSelection = (title: string) => {
    if (selectedLikedMovies.includes(title)) {
      setSelectedLikedMovies(selectedLikedMovies.filter(m => m !== title));
    } else {
      setSelectedLikedMovies([...selectedLikedMovies, title]);
    }
  };

  // Timeline category filtering
  const filteredTimeline = selectedTimelineCategory === "All"
    ? timeline
    : timeline.filter(evt => evt.category === selectedTimelineCategory);

  return (
    <div className="absolute inset-0 bg-gradient-to-tr from-[#1E010B] via-[#450123] to-[#0A001F] font-sans text-amber-50 overflow-y-auto select-none relative" id="master-app-root">
      {/* Sophisticated Golden, Fuchsia & Ruby Decorative Background Flares */}
      <div className="ambient-flare-red top-[-150px] right-[10%] w-[500px] h-[500px] opacity-90" />
      <div className="ambient-flare-gold bottom-[15%] left-[5%] w-[450px] h-[450px] opacity-85" />
      <div className="ambient-flare-pink top-[35%] right-[-100px] w-[400px] h-[400px] opacity-80" />
      <div className="ambient-flare-red bottom-[-50px] right-[20%] w-[350px] h-[350px] opacity-75" />
      
      {/* GLOBAL HEADER BAR */}
      <header className="sticky top-0 z-50 glass-panel-heavy bg-gradient-to-r from-[#1E010B]/90 to-[#0A001F]/90 border-b-2 border-gold-500/40 px-4 py-3 md:px-8 flex justify-between items-center backdrop-blur-xl">
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-gradient-to-tr from-gold-400 via-pink-600 to-cinema-red rounded-xl flex items-center justify-center font-serif font-bold text-white text-xl shadow-lg shadow-pink-500/30 border border-gold-400/30">
            A
          </div>
          <div>
            <h1 
              onClick={() => setActiveTab("home")}
              className="text-xl md:text-2xl font-serif italic font-bold tracking-tight text-gold-400 cursor-pointer hover:text-gold-300 transition-colors flex items-center gap-1 gold-glow"
            >
              {lang === "en" ? (
                <>
                  Ananya's Fan Engine
                  <span className="text-white font-sans not-italic text-[10px] font-extrabold bg-gradient-to-r from-pink-600 to-amber-500 border border-gold-400/40 px-2 py-0.5 rounded ml-1 tracking-normal uppercase shadow-[0_0_10px_rgba(219,39,119,0.5)]">MOD</span>
                </>
              ) : (
                t.title
              )}
            </h1>
            <span className="text-[10px] text-pink-300 uppercase tracking-widest block -mt-0.5 font-bold font-mono">
              ★ Premium Colorful Bollywood Universe ★
            </span>
          </div>
        </div>

        {/* Global User XP Rerank dashboard */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-3 bg-[#33041C]/80 px-4 py-2 rounded-xl border border-gold-500/30 shadow-md">
            <div className="text-right">
              <div className="text-[10px] text-pink-200 uppercase font-mono mt-0.5">
                {t.userLevel} <strong className="text-gold-300 font-bold">{profile.level}</strong>
              </div>
              <div className="w-24 bg-pink-950/80 h-1.5 rounded-full mt-1 overflow-hidden" title={`${profile.xp % 100}% to next level`}>
                <div className="bg-gradient-to-r from-gold-400 to-pink-500 h-full transition-all duration-300" style={{ width: `${profile.xp % 100}%` }} />
              </div>
            </div>
            <div className="h-6 w-px bg-gold-500/25" />
            <div className="text-center">
              <div className="text-[10px] text-pink-200 uppercase font-mono">Accumulated XP</div>
              <div className="text-xs font-mono font-extrabold text-gold-300">{profile.xp} XP</div>
            </div>
          </div>

          {/* Bilingual English / Hindi Switcher */}
          <button
            onClick={() => setLang(lang === "en" ? "hi" : "en")}
            className="p-2 border border-gold-500/35 bg-gold-500/15 hover:bg-gold-500/25 text-gold-300 rounded-xl flex items-center gap-1.5 transition text-xs font-bold cursor-pointer"
            title="Switch Language"
          >
            <Languages className="w-4 h-4 text-pink-400" />
            <span className="font-mono uppercase">{lang === "en" ? "HI" : "EN"}</span>
          </button>
        </div>
      </header>

      {/* LOWER NAVIGATION RAIL (RESPONSIVE CHIPS) */}
      <nav className="cinematic-blur-nav py-3 px-4 md:px-8 overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-2 sticky top-[65px] z-45 shadow-[0_4px_20px_rgba(215,28,68,0.15)] border-b border-gold-500/30">
        <button
          onClick={() => setActiveTab("home")}
          className={`px-4 py-2 rounded-xl text-xs font-display font-bold cursor-pointer transition-all duration-200 ${
            activeTab === "home" ? "bg-gradient-to-r from-gold-400 to-amber-500 text-stone-950 shadow-md shadow-gold-500/20" : "text-pink-100/80 hover:text-white hover:bg-pink-500/15"
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab("explorer")}
          className={`px-4 py-2 rounded-xl text-xs font-display font-bold cursor-pointer transition-all duration-200 ${
            activeTab === "explorer" ? "bg-gradient-to-r from-gold-400 to-amber-500 text-stone-950 shadow-md shadow-gold-500/20" : "text-pink-100/80 hover:text-white hover:bg-pink-500/15"
          }`}
        >
          {t.movieExplorer}
        </button>
        <button
          onClick={() => setActiveTab("recommender")}
          className={`px-4 py-2 rounded-xl text-xs font-display font-bold cursor-pointer transition-all duration-200 ${
            activeTab === "recommender" ? "bg-gradient-to-r from-gold-400 to-amber-500 text-stone-950 shadow-md shadow-gold-500/20" : "text-pink-100/80 hover:text-white hover:bg-pink-500/15"
          }`}
        >
          {t.discover}
        </button>
        <button
          onClick={() => setActiveTab("mood")}
          className={`px-4 py-2 rounded-xl text-xs font-display font-bold cursor-pointer transition-all duration-200 ${
            activeTab === "mood" ? "bg-gradient-to-r from-gold-400 to-amber-500 text-stone-950 shadow-md shadow-gold-500/20" : "text-pink-100/80 hover:text-white hover:bg-pink-500/15"
          }`}
        >
          {t.moodDiscover}
        </button>
        <button
          onClick={() => setActiveTab("actors")}
          className={`px-4 py-2 rounded-xl text-xs font-display font-bold cursor-pointer transition-all duration-200 ${
            activeTab === "actors" ? "bg-gradient-to-r from-gold-400 to-amber-500 text-stone-950 shadow-md shadow-gold-500/20" : "text-pink-100/80 hover:text-white hover:bg-pink-500/15"
          }`}
        >
          {t.starUniverse}
        </button>
        <button
          onClick={() => setActiveTab("boxoffice")}
          className={`px-4 py-2 rounded-xl text-xs font-display font-bold cursor-pointer transition-all duration-200 ${
            activeTab === "boxoffice" ? "bg-gradient-to-r from-gold-400 to-amber-500 text-stone-950 shadow-md shadow-gold-500/20" : "text-pink-100/80 hover:text-white hover:bg-pink-500/15"
          }`}
        >
          {t.boxOfficeStats}
        </button>
        <button
          onClick={() => setActiveTab("timeline")}
          className={`px-4 py-2 rounded-xl text-xs font-display font-bold cursor-pointer transition-all duration-200 ${
            activeTab === "timeline" ? "bg-gradient-to-r from-gold-400 to-amber-500 text-stone-950 shadow-md shadow-gold-500/20" : "text-pink-100/80 hover:text-white hover:bg-pink-500/15"
          }`}
        >
          {t.timeline}
        </button>
        <button
          onClick={() => setActiveTab("predictor")}
          className={`px-4 py-2 rounded-xl text-xs font-display font-bold cursor-pointer transition-all duration-200 ${
            activeTab === "predictor" ? "bg-gradient-to-r from-gold-400 to-amber-500 text-stone-950 shadow-md shadow-gold-500/20" : "text-pink-100/80 hover:text-white hover:bg-pink-500/15"
          }`}
        >
          {t.predictor}
        </button>
        <button
          onClick={() => setActiveTab("chat")}
          className={`px-4 py-2 rounded-xl text-xs font-display font-bold cursor-pointer transition-all duration-200 ${
            activeTab === "chat" ? "bg-gradient-to-r from-gold-400 to-amber-500 text-stone-950 shadow-md shadow-gold-500/20" : "text-pink-100/80 hover:text-white hover:bg-pink-500/15"
          }`}
        >
          {t.bollyGpt}
        </button>
        <button
          onClick={() => setActiveTab("quiz")}
          className={`px-4 py-2 rounded-xl text-xs font-display font-bold cursor-pointer transition-all duration-200 ${
            activeTab === "quiz" ? "bg-gradient-to-r from-gold-400 to-amber-500 text-stone-950 shadow-md shadow-gold-500/20" : "text-pink-100/80 hover:text-white hover:bg-pink-500/15"
          }`}
        >
          {t.quizArena}
        </button>
        <button
          onClick={() => setActiveTab("admin")}
          className={`px-4 py-2 rounded-xl text-xs font-display font-bold cursor-pointer transition-all duration-200 ${
            activeTab === "admin" ? "bg-gradient-to-r from-gold-400 to-amber-500 text-stone-950 shadow-md shadow-gold-500/20" : "text-pink-100/80 hover:text-white hover:bg-pink-500/15"
          }`}
        >
          {t.adminDashboard}
        </button>
      </nav>

      {/* MAIN LAYOUT CANVAS */}
      <main className="px-4 py-8 md:px-8 space-y-8 max-w-7xl mx-auto">
        
        {/* TAB 1: HOMEPAGE / DASHBOARD VIEW */}
        {activeTab === "home" && (
          <div className="space-y-8 animate-fadeIn" id="home-dashboard-panel">
            {/* Cinematic Hero Marquee Banner */}
            <div className="glass-panel rounded-3xl p-8 md:p-12 border border-white/10 relative overflow-hidden light-sweep gold-border-glow select-all min-h-[320px] flex flex-col justify-center">
              {/* Cinematic Background Image Layer */}
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1024&auto=format&fit=crop')] bg-cover bg-center opacity-25 z-0" />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent z-5" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent z-5" />
              
              <div className="max-w-2xl space-y-4 relative z-10">
                <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest block mb-1">
                  ★ LUXURY ENTERTAINMENT ECOSYSTEM ★
                </span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white tracking-tight leading-none">
                  {t.headline}
                </h2>
                <p className="text-xs md:text-sm text-white/70 leading-relaxed max-w-xl font-light">
                  {t.subheadline}
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={() => setActiveTab("explorer")}
                    className="bg-[#D4AF37] text-black font-semibold px-6 py-2.5 rounded-full text-xs hover:scale-105 active:scale-95 transition cursor-pointer"
                  >
                    {t.exploreMovies}
                  </button>
                  <button
                    onClick={() => setActiveTab("chat")}
                    className="bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 px-6 py-2.5 rounded-full text-xs font-semibold text-white transition cursor-pointer"
                  >
                    {t.askAiAssistant}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Profile stats showcase */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* XP & level progress */}
              <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-3">
                <div className="text-xs uppercase font-mono text-gray-500">Level & Raging Status</div>
                <div className="flex justify-between items-end">
                  <span className="text-3xl font-display font-bold text-white">Level {profile.level}</span>
                  <span className="text-xs font-mono text-gold-400">{profile.xp % 100} / 100 XP to next level</span>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gold-500 h-full transition-all duration-300" style={{ width: `${profile.xp % 100}%` }} />
                </div>
                <div className="text-[10px] text-gray-500 leading-relaxed font-sans">
                  Write critiques, request AI forecast reports or clear quizzes to load level progressions.
                </div>
              </div>

              {/* Earned badges array */}
              <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-3">
                <div className="text-xs uppercase font-mono text-gray-500">Accumulated Badges</div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {profile.badges.map((bdg, idx) => (
                    <span 
                      key={idx} 
                      className="bg-gold-500/10 border border-gold-400/25 text-gold-300 text-[10px] font-mono px-3 py-1 rounded-full flex items-center gap-1"
                    >
                      <Trophy className="w-3.5 h-3.5 text-gold-400" />
                      {bdg}
                    </span>
                  ))}
                </div>
                <div className="text-[10px] text-gray-500 leading-relaxed font-sans">
                  Current Badges count: <strong>{profile.badges.length} Unlocked</strong>
                </div>
              </div>

              {/* Watchlist Quick Summary */}
              <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-3">
                <div className="text-xs uppercase font-mono text-gray-500">{t.watchlist} Stats</div>
                <div className="flex justify-between items-center pt-1">
                  <div>
                    <span className="text-2xl font-mono font-bold text-white">{profile.watchlist.length}</span>
                    <span className="text-xs text-gray-400 font-sans block">Saved Releases</span>
                  </div>
                  <div>
                    <span className="text-2xl font-mono font-bold text-emerald-400">{profile.reviewCount}</span>
                    <span className="text-xs text-gray-400 font-sans block">Reviews Submitted</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab("explorer")}
                  className="w-full py-2 bg-cinema-dark/80 hover:bg-cinema-dark border border-white/10 text-xs text-center font-display font-medium rounded-xl cursor-default transition hover:border-gold-500/20"
                >
                  Review or Saved item details in explorer tab.
                </button>
              </div>
            </div>

            {/* Home Subgrid: Trending block and Instant Mini Quiz */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Trending movies carousel shortcut */}
              <div className="space-y-4">
                <h3 className="text-xl font-display font-semibold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-gold-400" />
                  {t.trending}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#141414] border border-white/5 p-4 rounded-xl space-y-2 hover:border-gold-500/20 cursor-pointer transition" onClick={() => setActiveTab("explorer")}>
                    <div className="text-3xl">🎓</div>
                    <h4 className="text-sm font-semibold text-white">3 Idiots</h4>
                    <p className="text-[11px] text-gray-400 leading-relaxed font-sans line-clamp-2">Two friends search for their long-lost companion, challenging dogmas on education.</p>
                  </div>
                  <div className="bg-[#141414] border border-white/5 p-4 rounded-xl space-y-2 hover:border-gold-500/20 cursor-pointer transition" onClick={() => setActiveTab("explorer")}>
                    <div className="text-3xl">🤼</div>
                    <h4 className="text-sm font-semibold text-white">Dangal</h4>
                    <p className="text-[11px] text-gray-400 leading-relaxed font-sans line-clamp-2">A wrestling biopic that broke worldwide collections milestones up to 2024 Crores.</p>
                  </div>
                </div>
              </div>

              {/* Instant Daily Quiz Widget */}
              <div className="glass-panel p-6 rounded-2xl border border-gold-500/15 flex flex-col justify-between">
                <div className="space-y-2">
                  <h4 className="text-sm uppercase font-mono text-gold-400 tracking-wider flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-gold-400" />
                    Daily Trivia Match Box
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed font-sans">
                    Answer questions regarding dialogs, directors, actors, or classic movies instantly to earn secure high XP scores!
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("quiz")}
                  className="w-full mt-4 py-2.5 bg-gold-500/10 text-gold-300 border border-gold-400/30 rounded-xl hover:bg-gold-500/20 text-xs font-display font-medium cursor-pointer"
                >
                  Enter Quiz Arena Now
                </button>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: PERSONALIZED AI DISCOVER / RECOMMENDATIONS ENGINE */}
        {activeTab === "recommender" && (
          <div className="glass-panel rounded-2xl p-6 lg:p-8 border border-gold-500/20 shadow-lg text-white space-y-8 animate-fadeIn" id="ai-recommender-panel">
            <div className="border-b border-white/5 pb-4">
              <h2 className="text-2xl font-display font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold-400" />
                AI Content Recommendation Engine
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Select Indian movies you enjoyed. Our server-side neural agent will curate similar films, actors, and directors with detailed explanations.
              </p>
            </div>

            {/* Film checkboxes selection */}
            <div className="space-y-3">
              <h3 className="text-xs font-display font-semibold text-gold-300 uppercase tracking-wider">Movies I Loved:</h3>
              <div className="flex flex-wrap gap-2">
                {["3 Idiots", "Dangal", "Zindagi Na Milegi Dobara", "Sholay", "Dilwale Dulhania Le Jayenge", "Lagaan", "Swades", "Jawan", "Queen", "pk", "Gully Boy"].map((mTitle) => {
                  const selected = selectedLikedMovies.includes(mTitle);
                  return (
                    <button
                      key={mTitle}
                      onClick={() => toggleLikedMovieSelection(mTitle)}
                      className={`px-4 py-2 rounded-xl border text-xs font-medium cursor-pointer transition ${
                        selected
                          ? "bg-gold-500/20 text-gold-300 border-gold-400"
                          : "bg-cinema-dark/40 border-white/5 text-gray-400 hover:text-white"
                      }`}
                    >
                      {selected && "✓ "}
                      {mTitle}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={triggerRecommendation}
              disabled={selectedLikedMovies.length === 0 || recommendLoading}
              className="px-6 py-3.5 bg-gradient-to-r from-gold-600 to-gold-400 hover:from-gold-500 hover:to-gold-300 transition text-semibold text-cinema-dark font-display font-medium text-xs rounded-xl cursor-pointer"
            >
              {recommendLoading ? "Generating AI Recommendations..." : "Generate AI Recommendations (+20 XP)"}
            </button>

            {/* Recommendations Output Block */}
            {aiRecommendations ? (
              <div className="space-y-8 border-t border-white/5 pt-6 animate-slideUp">
                {/* Similar Movies */}
                <div className="space-y-4">
                  <h4 className="text-sm uppercase font-mono text-gold-400 tracking-wider">Similar Suggested Movies</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {aiRecommendations.similarMovies.map((sm: any, idx: number) => (
                      <div key={idx} className="bg-cinema-dark/50 border border-white/5 rounded-2xl p-4 space-y-2">
                        <div className="flex justify-between items-start">
                          <h5 className="font-display font-bold text-white text-sm">{sm.title}</h5>
                          <span className="text-[10px] font-mono text-gray-500">{sm.year}</span>
                        </div>
                        <p className="text-xs text-gray-300 leading-relaxed font-sans">{sm.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Similar Actors / Directors in dual grids */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <h4 className="text-sm uppercase font-mono text-gold-400 tracking-wider">Suggested Celebrities to Explore</h4>
                    <div className="space-y-3">
                      {aiRecommendations.similarActors.map((sa: any, idx: number) => (
                        <div key={idx} className="bg-[#141414] p-3 rounded-xl border border-white/5 text-xs">
                          <strong className="text-white block font-display font-medium">{sa.name}</strong>
                          <span className="text-gray-400 leading-relaxed block mt-1 font-sans">{sa.reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm uppercase font-mono text-gold-400 tracking-wider">Similar Directed Catalogs</h4>
                    <div className="space-y-3">
                      {aiRecommendations.similarDirectors.map((sd: any, idx: number) => (
                        <div key={idx} className="bg-[#141414] p-3 rounded-xl border border-white/5 text-xs">
                          <strong className="text-white block font-display font-medium">{sd.name}</strong>
                          <span className="text-gray-400 leading-relaxed block mt-1 font-sans">{sd.reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              !recommendLoading && (
                <div className="text-center py-12 border border-white/5 bg-cinema-dark/20 rounded-xl">
                  <p className="text-xs text-gray-500">Pick any films you liked above and click generate to load personalized recommendations.</p>
                </div>
              )
            )}
          </div>
        )}

        {/* TAB 3: MOOD-BASED MOVIE DISCOVERY */}
        {activeTab === "mood" && (
          <div className="glass-panel rounded-2xl p-6 lg:p-8 border border-gold-500/20 text-white space-y-8 animate-fadeIn" id="mood-discovery-panel">
            <div className="border-b border-white/5 pb-4">
              <h2 className="text-2xl font-display font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold-400" />
                Mood-Based Discovery Engine
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Select your current emotional frequency. BollyGP AI will instantly match your vibration with 4 absolute Bollywood masterpieces.
              </p>
            </div>

            {/* Mood selector list */}
            <div className="flex flex-wrap gap-2.5 items-center justify-center p-3 bg-cinema-dark/30 rounded-2xl border border-white/5">
              {[
                { mood: "Happy", icon: "😇" },
                { mood: "Motivated", icon: "🔥" },
                { mood: "Romantic", icon: "💖" },
                { mood: "Family", icon: "👨‍👩‍👧" },
                { mood: "Thriller", icon: "👁️" },
                { mood: "Comedy", icon: "😂" },
                { mood: "Action", icon: "⚔️" },
                { mood: "Emotional", icon: "😢" }
              ].map((mObj) => (
                <button
                  key={mObj.mood}
                  onClick={() => triggerMoodDiscovery(mObj.mood)}
                  className={`px-4 py-2.5 border rounded-xl text-xs font-display font-medium cursor-pointer transition flex items-center gap-2 ${
                    activeMood === mObj.mood
                      ? "bg-gold-500/20 text-gold-300 border-gold-400 shadow-md"
                      : "bg-[#141414]/90 border-white/10 text-gray-400 hover:text-white"
                  }`}
                >
                  <span>{mObj.icon}</span>
                  <span>{mObj.mood}</span>
                </button>
              ))}
            </div>

            {moodLoading ? (
              <div className="text-center py-12">
                <RefreshCw className="w-8 h-8 text-gold-500 animate-spin mx-auto" />
                <p className="text-xs text-gray-400 mt-2 font-mono">Selecting matching screenplay tags...</p>
              </div>
            ) : moodRecommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slideUp">
                {moodRecommendations.map((mr: any, idx: number) => (
                  <div key={idx} className="bg-cinema-dark border border-white/10 p-5 rounded-2xl space-y-3 relative overflow-hidden flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="font-mono text-[9px] bg-gold-400/20 text-gold-300 px-2 py-0.5 rounded border border-gold-500/20 uppercase font-bold">
                          {mr.genre[0]}
                        </span>
                        <span className="text-xs font-mono text-gray-500">{mr.year}</span>
                      </div>
                      <h4 className="text-lg font-display font-bold text-white mt-2 select-all">{mr.title}</h4>
                      <p className="text-[11px] text-gold-400 font-mono italic">"{mr.tagline}"</p>
                      <p className="text-xs text-gray-300 font-sans mt-2.5 leading-relaxed">
                        {mr.reason}
                      </p>
                    </div>

                    <div className="flex justify-between items-center border-t border-white/5 pt-3 mt-4 text-[10px] font-mono text-gray-500">
                      <span>Affinity Rating: <strong>{mr.rating}/10</strong></span>
                      <span className="text-gold-300 uppercase tracking-widest font-bold font-display cursor-pointer hover:text-white" onClick={() => { setActiveTab("explorer"); setActiveMovieId(mr.title); }}>View in Explorer</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-white/5 bg-cinema-dark/20 rounded-xl">
                <p className="text-xs text-gray-500">Click any mood button above to load dynamic matches.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: UNIFIED MOVIE EXPLORER */}
        {activeTab === "explorer" && (
          <MovieExplorer 
            onRegisterXp={handleRegisterXp} 
            watchlist={profile.watchlist.map(w => w.movieId)} 
            onToggleWatchlist={handleToggleWatchlist}
            activeMovieId={activeMovieId}
            setActiveMovieId={setActiveMovieId}
          />
        )}

        {/* TAB 5: ACTOR UNIVERSE & AI CLINICAL ANALYTICS */}
        {activeTab === "actors" && (
          <ActorDirectorUniverse onRegisterXp={handleRegisterXp} />
        )}

        {/* TAB 6: DYNAMIC RECHARTS BOX OFFICE DASHBOARD */}
        {activeTab === "boxoffice" && (
          <BoxOfficeDashboard />
        )}

        {/* TAB 7: HISTORICAL INTERACTIVE SCROLL TIMELINE */}
        {activeTab === "timeline" && (
          <div className="space-y-8 animate-fadeIn" id="historical-timeline-panel">
            <div className="border-b border-gold-500/20 pb-4 flex justify-between items-center flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-display font-semibold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gold-400" />
                  Historical Bollywood Journey Timeline
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Decade-by-decade interactive scrolling map detailing historical milestones, historic nominations, and breakthrough blocks.
                </p>
              </div>
              
              {/* Category selector */}
              <div className="flex bg-[#121212] border border-white/10 p-1 rounded-xl">
                {["All", "Classic", "Golden", "Masala", "Modern", "Global"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedTimelineCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-semibold transition ${
                      selectedTimelineCategory === cat
                        ? "bg-gold-500 text-cinema-dark"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive chronological line */}
            <div className="relative border-l border-gold-500/30 ml-4 md:ml-8 pl-6 md:pl-10 space-y-8 py-4">
              {filteredTimeline.map((evt, idx) => (
                <div key={idx} className="relative group select-text">
                  {/* Glowing timeline node */}
                  <div className="absolute -left-[31px] md:-left-[47px] top-1.5 w-4 h-4 bg-[#0d0d0d] border-2 border-gold-400 rounded-full group-hover:scale-125 transition duration-300 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-gold-400 rounded-full" />
                  </div>

                  <div className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-gold-500/25 transition-all duration-300 max-w-4xl space-y-3">
                    <div className="flex justify-between items-center flex-wrap gap-2 text-xs">
                      <span className="font-mono text-xl font-bold text-gold-400">{evt.year}</span>
                      <span className="bg-gold-500/10 border border-gold-400/25 text-gold-300 text-[10px] px-2 py-0.5 rounded-full font-mono uppercase font-bold">
                        {evt.category}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-base font-display font-bold text-white group-hover:text-gold-300 transition-colors uppercase leading-snug">
                        {evt.title}
                      </h4>
                      <p className="text-[11px] text-gray-400 font-display">Key Artifact: <strong className="text-white font-mono">{evt.movie}</strong> | Casting: <strong className="text-white">{evt.actor}</strong></p>
                    </div>

                    <p className="text-xs text-gray-300 leading-relaxed font-sans">{evt.description}</p>
                    
                    <div className="bg-cinema-dark/40 border border-white/5 p-3 rounded-xl text-[10px] text-gold-300 leading-relaxed flex items-center gap-2">
                      <Award className="w-4 h-4 shrink-0 text-gold-400" />
                      <span>Historic Milestone: <strong className="text-white font-sans">{evt.achievement}</strong></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: SUCCESS PREDICTOR */}
        {activeTab === "predictor" && (
          <SuccessPredictor onRegisterXp={handleRegisterXp} />
        )}

        {/* TAB 9: BOLLYGPT CHAT PANEL */}
        {activeTab === "chat" && (
          <BollyGPTChat onRegisterXp={handleRegisterXp} />
        )}

        {/* TAB 10: QUIZ ARENA */}
        {activeTab === "quiz" && (
          <QuizArena onRegisterXp={handleRegisterXp} userProfile={profile} />
        )}

        {/* TAB 11: ADMIN STRUTURAL CONTROL PANEL */}
        {activeTab === "admin" && (
          <div className="glass-panel rounded-2xl p-6 lg:p-8 border border-gold-500/20 text-white space-y-8 animate-fadeIn" id="admin-workspace">
            <div className="border-b border-white/5 pb-4">
              <h2 className="text-2xl font-display font-semibold flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-gold-400" />
                Administrative System Portal
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Moderates public critiques database listings, inspect trends activity metrics, or simulate new user allocations.
              </p>
            </div>

            {/* Numeric system metrics cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-cinema-dark/80 border border-white/5 rounded-xl p-4">
                <div className="text-[10px] uppercase font-mono text-gray-500">Live Active Registries</div>
                <div className="text-xl font-mono font-bold text-gold-300 mt-1">{adminUsersCount} Accounts</div>
              </div>
              <div className="bg-cinema-dark/80 border border-white/5 rounded-xl p-4">
                <div className="text-[10px] uppercase font-mono text-gray-500">Server Status API</div>
                <div className="text-xl font-mono font-bold text-emerald-400 mt-1">Active Status</div>
              </div>
              <div className="bg-cinema-dark/80 border border-white/5 rounded-xl p-4">
                <div className="text-[10px] uppercase font-mono text-gray-500">Total Reviews Blocked</div>
                <div className="text-xl font-mono font-bold text-red-400 mt-1">{adminBlockedReviews.length} Logs</div>
              </div>
              <div className="bg-cinema-dark/80 border border-white/5 rounded-xl p-4">
                <div className="text-[10px] uppercase font-mono text-gray-500">Audience Database Matches</div>
                <div className="text-xl font-mono font-bold text-white mt-1">115 Movies</div>
              </div>
            </div>

            {/* Admin reviews logs block */}
            <div className="space-y-4">
              <h3 className="text-xs uppercase font-mono text-gold-400 tracking-wider">Critiques Moderation Table</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2 border border-white/5 rounded-xl p-4 bg-cinema-dark/20">
                {adminReviews.map((ar) => {
                  const isBlocked = adminBlockedReviews.includes(ar.id);
                  return (
                    <div key={ar.id} className="flex justify-between items-center bg-[#121212] border border-white/10 p-4 rounded-xl gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <strong className="text-xs text-white block">{ar.author} on <span className="text-gold-400">"{ar.movieTitle}"</span></strong>
                          <span className="text-[9px] font-mono hover:scale-105 transition">{ar.rating}/5 Stars</span>
                        </div>
                        <p className={`text-xs ${isBlocked ? "line-through text-gray-600 italic" : "text-gray-300 font-sans"}`}>
                          {isBlocked ? "[ Critique block/censored by administration moderation actions ]" : `"${ar.content}"`}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          if (isBlocked) {
                            setAdminBlockedReviews(adminBlockedReviews.filter(id => id !== ar.id));
                          } else {
                            setAdminBlockedReviews([...adminBlockedReviews, ar.id]);
                          }
                        }}
                        className={`px-3 py-1.5 rounded text-[10px] font-mono uppercase font-bold cursor-pointer border ${
                          isBlocked 
                            ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 hover:bg-emerald-500/20"
                            : "bg-red-500/10 border-red-500 text-red-400 hover:bg-red-500/20"
                        }`}
                      >
                        {isBlocked ? "Approve" : "Censor"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* FOOTER METADATA BAR */}
      <footer className="bg-white/55 border-t border-gold-500/15 py-8 px-4 text-center space-y-2 mt-12 text-xs">
        <p className="text-stone-600 font-display font-semibold">
          Ananya's Bollywood Fan Engine — "Your Premium Curated Hub for All Things Cinema."
        </p>
        <p className="text-stone-400 font-mono text-[9px] uppercase tracking-wider">
          Curated index for Bollywood Superfans. Built with React, Vite & Gemini Intelligence.
        </p>
      </footer>

    </div>
  );
}
