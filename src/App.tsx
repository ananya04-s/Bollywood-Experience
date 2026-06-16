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
  RefreshCw,
  Music
} from "lucide-react";

// Submodule imports
import MovieExplorer from "./components/MovieExplorer";
import ActorDirectorUniverse from "./components/ActorDirectorUniverse";
import BoxOfficeDashboard from "./components/BoxOfficeDashboard";
import SuccessPredictor from "./components/SuccessPredictor";
import BollyGPTChat from "./components/BollyGPTChat";
import QuizArena from "./components/QuizArena";
import SongsJukebox from "./components/SongsJukebox";
import BollyverseAuth from "./components/BollyverseAuth";
import BollyverseArcade from "./components/BollyverseArcade";
import BollyverseHero from "./components/BollyverseHero";
import MoodDiscoverer from "./components/MoodDiscoverer";
import BollyPassportAndAiStudio from "./components/BollyPassportAndAiStudio";
import InteractiveShootMap from "./components/InteractiveShootMap";
import BollyWrapped from "./components/BollyWrapped";
import BollyEducation from "./components/BollyEducation";
import { BollywoodSynth } from "./utils/audioSynth";


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
    favoritesLabel: "Personal Favorites Tracker",
    soundtracks: "Hit Soundtracks"
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
    favoritesLabel: "व्यक्तिगत पसंद्र ट्रैकर",
    soundtracks: "हिट साउंडट्रैक"
  }
};

export default function App() {
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [activeTab, setActiveTab] = useState<string>("home");
  const [selectedSongToPlayId, setSelectedSongToPlayId] = useState<number | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [selectedTimelineCategory, setSelectedTimelineCategory] = useState<string>("All");

  // Global floating music player states
  const [globalPlay, setGlobalPlay] = useState(false);
  const [currentGlobalTrack, setCurrentGlobalTrack] = useState("Mehndi Laga Ke Rakhna (Dhol beats)");

  // Handle global music sync
  useEffect(() => {
    if (globalPlay) {
      BollywoodSynth.playSong(currentGlobalTrack, "Romantic", () => {}, () => {
        setGlobalPlay(false);
      });
    } else {
      BollywoodSynth.stop();
    }
    return () => {
      BollywoodSynth.stop();
    };
  }, [globalPlay, currentGlobalTrack]);

  // Premium Authentication and Themeing States
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("bollyverse_loggedin") === "true";
  });
  const [userProfile, setUserProfile] = useState<any>(() => {
    try {
      const saved = localStorage.getItem("bollyverse_userprofile");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    return (localStorage.getItem("bollyverse_theme") as "dark" | "light") || "dark";
  });
  const [festival, setFestival] = useState<string>(() => {
    return localStorage.getItem("bollyverse_festival") || "cinema";
  });
  
  // Profile stats state
  const [profile, setProfile] = useState({
    watchlist: [] as { movieId: string }[],
    xp: 120,
    level: 1,
    badges: ["Movie Buff"],
    reviewCount: 0
  });

  const handleLogin = (profileData: any) => {
    setIsLoggedIn(true);
    setUserProfile(profileData);
    localStorage.setItem("bollyverse_loggedin", "true");
    localStorage.setItem("bollyverse_userprofile", JSON.stringify(profileData));
    if (profileData.preferredLanguage) {
      setLang(profileData.preferredLanguage);
    }
    // Boost XP on profile creation
    handleRegisterXp(35);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserProfile(null);
    localStorage.removeItem("bollyverse_loggedin");
    localStorage.removeItem("bollyverse_userprofile");
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("bollyverse_theme", nextTheme);
  };

  const handleSelectFestival = (val: string) => {
    setFestival(val);
    localStorage.setItem("bollyverse_festival", val);
    handleRegisterXp(5); // Reward tiny XP for exploring festival theme triggers
  };

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

  const handleSelectMovieTitle = async (movieTitle: string) => {
    try {
      const resp = await fetch("/api/movies");
      const movies = await resp.json();
      const matched = movies.find((m: any) => 
        m.title.toLowerCase().includes(movieTitle.toLowerCase()) || 
        movieTitle.toLowerCase().includes(m.title.toLowerCase())
      );
      if (matched) {
        setActiveMovieId(matched.id);
        setActiveTab("explorer");
      } else {
        setActiveTab("explorer");
      }
    } catch (e) {
      console.error("Failed to find movie ID for title", e);
      setActiveTab("explorer");
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

  if (!isLoggedIn) {
    return <BollyverseAuth onLogin={handleLogin} theme={theme} />;
  }

  // Calculate festival color classes
  let flareClass1 = "ambient-flare-red top-[-150px] right-[10%] w-[600px] h-[600px] opacity-80 animate-pulse duration-5000";
  let flareClass2 = "ambient-flare-gold bottom-[15%] left-[5%] w-[550px] h-[550px] opacity-70 animate-pulse duration-3000";
  let flareClass3 = "ambient-flare-red bottom-[-50px] right-[20%] w-[400px] h-[400px] opacity-60";

  if (festival === "diwali") {
    flareClass1 = "ambient-flare-gold top-[-150px] right-[10%] w-[600px] h-[600px] opacity-90 animate-pulse duration-5000";
    flareClass2 = "ambient-flare-red bottom-[15%] left-[5%] w-[550px] h-[550px] opacity-80";
    flareClass3 = "bg-orange-500/25 top-[40%] right-[30%] w-[500px] h-[500px] filter blur-[130px] absolute pointer-events-none rounded-full animate-bounce duration-8000";
  } else if (festival === "holi") {
    flareClass1 = "ambient-flare-pink top-[-150px] right-[10%] w-[600px] h-[600px] opacity-90 animate-pulse";
    flareClass2 = "bg-purple-600/35 bottom-[15%] left-[5%] w-[550px] h-[550px] filter blur-[90px] absolute pointer-events-none rounded-full";
    flareClass3 = "bg-cyan-500/25 bottom-[-50px] right-[20%] w-[400px] h-[400px] filter blur-[120px] absolute pointer-events-none rounded-full";
  } else if (festival === "eid") {
    flareClass1 = "bg-emerald-600/30 top-[-150px] right-[10%] w-[600px] h-[600px] filter blur-[110px] absolute pointer-events-none rounded-full animate-pulse";
    flareClass2 = "ambient-flare-gold bottom-[15%] left-[5%] w-[550px] h-[550px] opacity-85";
    flareClass3 = "bg-teal-600/20 bottom-[-50px] right-[20%] w-[400px] h-[400px] filter blur-[100px] absolute pointer-events-none rounded-full";
  } else if (festival === "valentine") {
    flareClass1 = "ambient-flare-pink top-[-150px] right-[10%] w-[600px] h-[600px] opacity-95 animate-pulse duration-7000";
    flareClass2 = "bg-rose-500/25 bottom-[15%] left-[5%] w-[550px] h-[550px] filter blur-[120px] absolute pointer-events-none rounded-full";
    flareClass3 = "ambient-flare-red bottom-[-50px] right-[20%] w-[400px] h-[400px] opacity-80";
  } else if (festival === "patriotic") {
    flareClass1 = "bg-orange-500/25 top-[-150px] right-[10%] w-[600px] h-[600px] filter blur-[120px] absolute pointer-events-none rounded-full";
    flareClass2 = "bg-blue-600/20 bottom-[15%] left-[5%] w-[550px] h-[550px] filter blur-[110px] absolute pointer-events-none rounded-full animate-spin-slow";
    flareClass3 = "bg-emerald-500/25 bottom-[-50px] right-[20%] w-[400px] h-[400px] filter blur-[120px] absolute pointer-events-none rounded-full";
  }

  return (
    <div className={`absolute inset-0 font-sans overflow-y-auto select-none relative scroll-smooth transition-all duration-300 ${
      theme === "dark" ? "bg-[#0E0C0D] text-stone-100" : "bg-[#f7f5f2] text-stone-900"
    }`} id="master-app-root">
      
      {/* Dynamic Background Festive & Cinematic Flares */}
      <div className={flareClass1} />
      <div className={flareClass2} />
      <div className={flareClass3} />
      
      {/* GLOBAL HEADER BAR */}
      <header className={`sticky top-0 z-50 border-b px-4 py-3 md:px-8 flex flex-col md:flex-row gap-3 justify-between items-center backdrop-blur-xl transition-colors duration-300 ${
        theme === "dark" 
          ? "border-red-600/20 bg-[#0E0C0D]/95 text-stone-100" 
          : "border-stone-200 bg-[#f7f5f2]/95 text-stone-900"
      }`}>
        <div className="flex items-center gap-3 relative z-10 w-full md:w-auto">
          <div className="w-10 h-10 bg-[#E50914] text-white flex items-center justify-center font-display font-black text-2xl tracking-tighter shadow-[0_0_20px_rgba(229,9,20,0.4)] rounded-lg hover:rotate-6 transition-all duration-300 shrink-0">
            BV
          </div>
          <div>
            <h1 
              onClick={() => setActiveTab("home")}
              className="text-xl md:text-2xl font-display font-black tracking-tight cursor-pointer hover:text-red-500 transition-colors flex items-center gap-1"
            >
              <>
                BollywoodVerse AI
                <span className="text-white font-sans not-italic text-[9px] font-extrabold bg-gradient-to-r from-red-650 to-amber-500 px-1.5 py-0.5 rounded ml-1 tracking-normal uppercase shadow-[0_0_12px_rgba(229,9,20,0.6)] shrink-0">PRO</span>
              </>
            </h1>
            <span className={`text-[8px] uppercase tracking-widest block -mt-0.5 font-bold font-mono ${
              theme === "dark" ? "text-stone-400" : "text-stone-600"
            }`}>
              ★ PREMIUM CINEMATIC FAN SPHERE ★
            </span>
          </div>
        </div>

        {/* Global User XP Rerank dashboard and Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 justify-end w-full md:w-auto">
          {/* User profile capsule */}
          {userProfile && (
            <div className={`flex items-center gap-2 px-3 py-1 bg-[#E50914]/10 border border-[#E50914]/30 rounded-xl text-xs font-semibold ${
              theme === "dark" ? "text-stone-300" : "text-stone-800"
            }`}>
              <span>🚀 Namaste, <strong className="text-red-500 font-bold">{userProfile.username}</strong></span>
              <span className="text-[10px] bg-[#E50914] text-white px-2 py-0.5 rounded-full uppercase font-mono tracking-tighter font-extrabold">
                {userProfile.favoriteActor.split(" ")[0]} Style
              </span>
            </div>
          )}

          <div className={`hidden lg:flex items-center gap-3 px-4 py-1.5 rounded-xl border shadow-md ${
            theme === "dark" ? "bg-stone-900/90 border-red-500/20" : "bg-white border-stone-200"
          }`}>
            <div className="text-right">
              <div className="text-[9px] text-stone-400 uppercase font-mono mt-0.5">
                {t.userLevel} <strong className="text-red-500 font-bold">{profile.level}</strong>
              </div>
              <div className="w-20 bg-stone-800 h-1.5 rounded-full mt-1 overflow-hidden" title={`${profile.xp % 100}% to next level`}>
                <div className="bg-gradient-to-r from-red-600 to-amber-500 h-full transition-all duration-300" style={{ width: `${profile.xp % 100}%` }} />
              </div>
            </div>
            <div className="h-6 w-px bg-stone-700" />
            <div className="text-center">
              <div className="text-[9px] text-stone-400 uppercase font-mono">Accumulated XP</div>
              <div className="text-xs font-mono font-extrabold text-[#D4AF37]">{profile.xp} XP</div>
            </div>
          </div>

          {/* Theme switcher */}
          <button
            onClick={toggleTheme}
            className={`p-2 border rounded-xl flex items-center justify-center transition text-xs font-bold cursor-pointer ${
              theme === "dark" ? "border-stone-800 bg-stone-900 hover:bg-stone-800 text-amber-300" : "border-stone-200 bg-white hover:bg-stone-50 text-indigo-650"
            }`}
            title="Switch Visual Theme Mode"
          >
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>

          {/* Bilingual English / Hindi Switcher */}
          <button
            onClick={() => setLang(lang === "en" ? "hi" : "en")}
            className={`p-2 border rounded-xl flex items-center gap-1.5 transition text-xs font-bold cursor-pointer ${
              theme === "dark" ? "border-stone-800 bg-stone-900 hover:bg-stone-800 text-stone-200" : "border-stone-200 bg-white hover:bg-stone-50 text-stone-800"
            }`}
            title="Switch Language"
          >
            <Languages className="w-4 h-4 text-red-500" />
            <span className="font-mono uppercase">{lang === "en" ? "HI" : "EN"}</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="p-2 bg-stone-950/40 hover:bg-red-500/20 border border-stone-800 rounded-xl text-stone-400 hover:text-red-500 text-xs font-bold font-mono uppercase transition cursor-pointer"
            title="Logout Session Preferences"
          >
            Logout
          </button>
        </div>
      </header>

      {/* LOWER NAVIGATION RAIL (RESPONSIVE CHIPS) */}
      <nav className={`border-b py-3.5 px-4 md:px-8 overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-1.5 sticky top-[62px] z-45 backdrop-blur-md transition-colors ${
        theme === "dark" ? "border-stone-850 bg-[#0E0C0D]/90" : "border-stone-200 bg-[#f7f5f2]/90"
      }`}>
        <button
          onClick={() => setActiveTab("home")}
          className={`px-3 py-1.5 rounded-md text-xs font-sans font-bold cursor-pointer transition-all duration-300 ${
            activeTab === "home" ? "bg-[#E50914] text-white shadow-[0_2px_12px_rgba(229,9,20,0.4)]" : "text-stone-400 hover:text-stone-100 hover:bg-stone-900"
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab("explorer")}
          className={`px-3 py-1.5 rounded-md text-xs font-sans font-bold cursor-pointer transition-all duration-300 ${
            activeTab === "explorer" ? "bg-[#E50914] text-white shadow-[0_2px_12px_rgba(229,9,20,0.4)]" : "text-stone-400 hover:text-stone-100 hover:bg-stone-900"
          }`}
        >
          {t.movieExplorer}
        </button>
        <button
          onClick={() => setActiveTab("recommender")}
          className={`px-3 py-1.5 rounded-md text-xs font-sans font-bold cursor-pointer transition-all duration-300 ${
            activeTab === "recommender" ? "bg-[#E50914] text-white shadow-[0_2px_12px_rgba(229,9,20,0.4)]" : "text-stone-400 hover:text-stone-100 hover:bg-stone-900"
          }`}
        >
          {t.discover}
        </button>
        <button
          onClick={() => setActiveTab("mood")}
          className={`px-3 py-1.5 rounded-md text-xs font-sans font-bold cursor-pointer transition-all duration-300 ${
            activeTab === "mood" ? "bg-[#E50914] text-white shadow-[0_2px_12px_rgba(229,9,20,0.4)]" : "text-stone-400 hover:text-stone-100 hover:bg-stone-900"
          }`}
        >
          {t.moodDiscover}
        </button>
        <button
          onClick={() => setActiveTab("actors")}
          className={`px-3 py-1.5 rounded-md text-xs font-sans font-bold cursor-pointer transition-all duration-300 ${
            activeTab === "actors" ? "bg-[#E50914] text-white shadow-[0_2px_12px_rgba(229,9,20,0.4)]" : "text-stone-400 hover:text-stone-100 hover:bg-stone-900"
          }`}
        >
          {t.starUniverse}
        </button>
        <button
          onClick={() => setActiveTab("boxoffice")}
          className={`px-3 py-1.5 rounded-md text-xs font-sans font-bold cursor-pointer transition-all duration-300 ${
            activeTab === "boxoffice" ? "bg-[#E50914] text-white shadow-[0_2px_12px_rgba(229,9,20,0.4)]" : "text-stone-400 hover:text-stone-100 hover:bg-stone-900"
          }`}
        >
          {t.boxOfficeStats}
        </button>
        <button
          onClick={() => setActiveTab("timeline")}
          className={`px-3 py-1.5 rounded-md text-xs font-sans font-bold cursor-pointer transition-all duration-300 ${
            activeTab === "timeline" ? "bg-[#E50914] text-white shadow-[0_2px_12px_rgba(229,9,20,0.4)]" : "text-stone-400 hover:text-stone-100 hover:bg-stone-900"
          }`}
        >
          {t.timeline}
        </button>
        <button
          onClick={() => setActiveTab("predictor")}
          className={`px-3 py-1.5 rounded-md text-xs font-sans font-bold cursor-pointer transition-all duration-300 ${
            activeTab === "predictor" ? "bg-[#E50914] text-white shadow-[0_2px_12px_rgba(229,9,20,0.4)]" : "text-stone-400 hover:text-stone-100 hover:bg-stone-900"
          }`}
        >
          {t.predictor}
        </button>
        <button
          onClick={() => setActiveTab("chat")}
          className={`px-3 py-1.5 rounded-md text-xs font-sans font-bold cursor-pointer transition-all duration-300 ${
            activeTab === "chat" ? "bg-[#E50914] text-white shadow-[0_2px_12px_rgba(229,9,20,0.4)]" : "text-stone-400 hover:text-stone-100 hover:bg-stone-900"
          }`}
        >
          {t.bollyGpt}
        </button>
        <button
          onClick={() => setActiveTab("quiz")}
          className={`px-3 py-1.5 rounded-md text-xs font-sans font-bold cursor-pointer transition-all duration-300 ${
            activeTab === "quiz" ? "bg-[#E50914] text-white shadow-[0_2px_12px_rgba(229,9,20,0.4)]" : "text-stone-400 hover:text-stone-100 hover:bg-stone-900"
          }`}
        >
          {t.quizArena}
        </button>
        <button
          onClick={() => setActiveTab("songs")}
          className={`px-3 py-1.5 rounded-md text-xs font-sans font-bold cursor-pointer transition-all duration-300 ${
            activeTab === "songs" ? "bg-[#E50914] text-white shadow-[0_2px_12px_rgba(229,9,20,0.4)]" : "text-stone-400 hover:text-stone-100 hover:bg-stone-900"
          }`}
        >
          {t.soundtracks}
        </button>
        <button
          onClick={() => setActiveTab("arcade")}
          className={`px-3 py-1.5 rounded-md text-xs font-sans font-bold cursor-pointer transition-all duration-300 ${
            activeTab === "arcade" ? "bg-[#E50914] text-white shadow-[0_2px_12px_rgba(229,9,20,0.4)]" : "text-stone-400 hover:text-stone-100 hover:bg-stone-900"
          }`}
        >
          Filmy Arcade 🎮
        </button>
        <button
          onClick={() => setActiveTab("passport")}
          className={`px-3 py-1.5 rounded-md text-xs font-sans font-bold cursor-pointer transition-all duration-300 ${
            activeTab === "passport" ? "bg-[#E50914] text-white shadow-[0_2px_12px_rgba(229,9,20,0.4)]" : "text-stone-400 hover:text-stone-100 hover:bg-stone-900"
          }`}
        >
          AI Passport & Studio 🏆
        </button>
        <button
          onClick={() => setActiveTab("wrapped")}
          className={`px-3 py-1.5 rounded-md text-xs font-sans font-bold cursor-pointer transition-all duration-300 ${
            activeTab === "wrapped" ? "bg-[#E50914] text-white shadow-[0_2px_12px_rgba(229,9,20,0.4)]" : "text-stone-400 hover:text-stone-100 hover:bg-stone-900"
          }`}
        >
          My Wrapped 📊
        </button>
        <button
          onClick={() => setActiveTab("map")}
          className={`px-3 py-1.5 rounded-md text-xs font-sans font-bold cursor-pointer transition-all duration-300 ${
            activeTab === "map" ? "bg-[#E50914] text-white shadow-[0_2px_12px_rgba(229,9,20,0.4)]" : "text-stone-400 hover:text-stone-100 hover:bg-stone-900"
          }`}
        >
          Famous Spots 🌍
        </button>
        <button
          onClick={() => setActiveTab("education")}
          className={`px-3 py-1.5 rounded-md text-xs font-sans font-bold cursor-pointer transition-all duration-300 ${
            activeTab === "education" ? "bg-[#E50914] text-white shadow-[0_2px_12px_rgba(229,9,20,0.4)]" : "text-stone-400 hover:text-stone-100 hover:bg-stone-900"
          }`}
        >
          School of Cinema 🧠
        </button>
        <button
          onClick={() => setActiveTab("admin")}
          className={`px-3 py-1.5 rounded-md text-xs font-sans font-bold cursor-pointer transition-all duration-300 ${
            activeTab === "admin" ? "bg-[#E50914] text-white shadow-[0_2px_12px_rgba(229,9,20,0.4)]" : "text-stone-400 hover:text-stone-100 hover:bg-stone-900"
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
            
            {/* FESTIVAL FOCUS MODE CHIPS SELECTOR BAR */}
            <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 ease-in-out hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-colors duration-500 hover:border-white/30 ${
              theme === "dark" 
                ? "bg-stone-900/60 border-white/5" 
                : "bg-white border-stone-200 shadow-sm"
            }`} id="festival-focus-panel">
              <div className="space-y-1 text-center md:text-left">
                <h4 className="text-sm font-display font-black flex items-center justify-center md:justify-start gap-1.5 uppercase text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-amber-400 to-red-500">
                  <Sparkles className="w-4 h-4 text-amber-400 fill-current animate-spin-slow" />
                  ⭐ Enter Festival Focus Mode
                </h4>
                <p className="text-[11px] text-stone-400 leading-none">
                  Switch the entire interface theme and unlock festive recommended catalogs instantly.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 justify-center">
                {[
                  { id: "cinema", label: "Default Cinema 🎬" },
                  { id: "diwali", label: "Diwali Lights 🪔" },
                  { id: "holi", label: "Holi Colors 🎨" },
                  { id: "eid", label: "Eid Mubarak 🌙" },
                  { id: "valentine", label: "Valentine Love 💖" },
                  { id: "patriotic", label: "Azadi Day 🇮🇳" }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectFestival(item.id)}
                    className={`py-1.5 px-3.5 rounded-full text-xs font-bold font-display cursor-pointer transition ${
                      festival === item.id
                        ? "bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-md scale-105"
                        : theme === "dark"
                          ? "bg-stone-950 border border-stone-800 text-stone-400 hover:text-white"
                          : "bg-stone-50 border border-stone-200 text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Cinematic Hero Marquee Banner (Netflix Billboard Mode) */}
            <BollyverseHero 
              onSelectMovie={handleSelectMovieTitle}
              watchlist={profile.watchlist.map(w => w.movieId)}
              onToggleWatchlist={handleToggleWatchlist}
              theme={theme}
            />

            {/* Personalized greeting & festival customized collections row */}
            <div className={`p-6 rounded-3xl border ${
              theme === "dark" 
                ? "bg-gradient-to-br from-stone-900/60 to-stone-950/80 border-white/5" 
                : "bg-white border-stone-200 shadow-sm"
            }`}>
              <div className="space-y-2">
                <span className="text-[9px] font-mono text-amber-550 block font-bold uppercase tracking-widest">
                  ★ BOLLYVERSE PERSONALIZED AI SUMMARY ★
                </span>
                <h3 className="text-2xl font-display font-black tracking-tight flex items-center gap-2">
                  Namaste, {userProfile?.username || "Filmy Buff"}! 🪐
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed max-w-2xl font-sans">
                  Welcome to your premium dashboard. Your style filter is locked to <strong className="text-red-500">{userProfile?.favoriteActor || "Shah Rukh Khan"} Style</strong>, and we are curating matches based on your favorite <strong className="text-amber-500">{userProfile?.favoriteGenre || "Romantic"}</strong> genre.
                </p>
              </div>

              {/* Dynamic Festival list indicators */}
              <div className="mt-6 pt-5 border-t border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] uppercase font-mono text-stone-500 font-bold block">
                    ✨ CURRENT FESTIVAL FOCUS SPECIALS:
                  </span>
                  <span className="text-[10px] text-amber-400 font-serif lowercase italic">
                    updated live to screen
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {festival === "diwali" && (
                    <>
                      <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/25 space-y-2 hover:border-amber-400 cursor-pointer transition" onClick={() => handleSelectMovieTitle("Kabhi Khushi Kabhie Gham")}>
                        <div className="text-lg">🪔</div>
                        <strong className="text-xs text-stone-100 block font-bold">Kabhi Khushi Kabhie Gham</strong>
                        <p className="text-[10px] text-stone-400">The grandest Diwali family celebration, packed with lights, classic sangeets, and stars.</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/25 space-y-2 hover:border-amber-400 cursor-pointer transition" onClick={() => handleSelectMovieTitle("Om Shanti Om")}>
                        <div className="text-lg">🕯️</div>
                        <strong className="text-xs text-stone-100 block font-bold">Om Shanti Om</strong>
                        <p className="text-[10px] text-stone-400">Retro glamour and dramatic lights. Re-live the gorgeous 'Dhoom Taana' stage sparkles.</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/25 space-y-2 hover:border-amber-400 cursor-pointer transition" onClick={() => { setSelectedSongToPlayId(90); setActiveTab("songs"); }}>
                        <div className="text-lg">🪕</div>
                        <strong className="text-xs text-stone-100 block font-bold">Sensational Festive Soundtracks</strong>
                        <p className="text-[10px] text-stone-400">High-energy rhythms to ignite your family gatherings with immediate dhol beats.</p>
                      </div>
                    </>
                  )}
                  {festival === "holi" && (
                    <>
                      <div className="p-4 rounded-2xl bg-pink-500/5 border border-pink-500/20 space-y-2 hover:border-pink-500 cursor-pointer transition" onClick={() => { setSelectedSongToPlayId(90); setActiveTab("songs"); }}>
                        <div className="text-lg">🎨</div>
                        <strong className="text-xs text-stone-100 block font-bold">Balam Pichkari</strong>
                        <p className="text-[10px] text-stone-400 font-sans">The ultimate millennial color party anthem from Yeh Jawaani Hai Deewani.</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-pink-500/5 border border-pink-500/20 space-y-2 hover:border-pink-500 cursor-pointer transition" onClick={() => handleSelectMovieTitle("Yeh Jawaani Hai Deewani")}>
                        <div className="text-lg">🕶️</div>
                        <strong className="text-xs text-stone-100 block font-bold">Yeh Jawaani Hai Deewani</strong>
                        <p className="text-[10px] text-stone-400 font-sans">Youthful, dynamic, and colorful! Perfect sangeets and spectacular Spanish holidays.</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-pink-500/5 border border-pink-500/20 space-y-2 hover:border-pink-500 cursor-pointer transition" onClick={() => handleSelectMovieTitle("Sholay")}>
                        <div className="text-lg">🔥</div>
                        <strong className="text-xs text-stone-100 block font-bold">Holi Ke Din Dil Khil Jate Hain</strong>
                        <p className="text-[10px] text-stone-400 font-sans">Retro classic song where absolute colors and dramatic romance meet rustic action.</p>
                      </div>
                    </>
                  )}
                  {festival === "eid" && (
                    <>
                      <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2 hover:border-emerald-500 cursor-pointer transition" onClick={() => handleSelectMovieTitle("Bajrangi Bhaijaan")}>
                        <div className="text-lg">🌙</div>
                        <strong className="text-xs text-stone-100 block font-bold">Bajrangi Bhaijaan</strong>
                        <p className="text-[10px] text-stone-400 font-sans">A classic masterpiece of pure love, humanity, and deep borders-crossing devotion.</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2 hover:border-emerald-500 cursor-pointer transition" onClick={() => { setSelectedSongToPlayId(90); setActiveTab("songs"); }}>
                        <div className="text-lg">🕊️</div>
                        <strong className="text-xs text-stone-100 block font-bold">Sufi Peace Collection</strong>
                        <p className="text-[10px] text-stone-400 font-sans">Beautiful ghazals and qawwalis to fill your space with calm spiritual lights.</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2 hover:border-emerald-500 cursor-pointer transition" onClick={() => handleSelectMovieTitle("Jodha Akbar")}>
                        <div className="text-lg">✨</div>
                        <strong className="text-xs text-stone-100 block font-bold">Jodha Akbar</strong>
                        <p className="text-[10px] text-stone-400 font-sans">Grand royal sangeet, qawwali highlights, and legendary imperial romances.</p>
                      </div>
                    </>
                  )}
                  {festival === "valentine" && (
                    <>
                      <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-2 hover:border-rose-450 cursor-pointer transition" onClick={() => handleSelectMovieTitle("Dilwale Dulhania Le Jayenge")}>
                        <div className="text-lg">💖</div>
                        <strong className="text-xs text-stone-100 block font-bold">Dilwale Dulhania Le Jayenge</strong>
                        <p className="text-[10px] text-stone-400 font-sans">The golden milestone signature ddlj romance. Come, fall in love all over again.</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-2 hover:border-rose-450 cursor-pointer transition" onClick={() => { setSelectedSongToPlayId(90); setActiveTab("songs"); }}>
                        <div className="text-lg">🌧️</div>
                        <strong className="text-xs text-stone-100 block font-bold">Chaleya (Jawan)</strong>
                        <p className="text-[10px] text-stone-400 font-sans">Modern romantic melody with spectacular acoustic overlays sung by Arijit Singh.</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-2 hover:border-rose-450 cursor-pointer transition" onClick={() => handleSelectMovieTitle("Dil To Pagal Hai")}>
                        <div className="text-lg">💃</div>
                        <strong className="text-xs text-stone-100 block font-bold">Dil To Pagal Hai</strong>
                        <p className="text-[10px] text-stone-400 font-sans">Classic dance drama and beautifully syncopated musical heartbeats.</p>
                      </div>
                    </>
                  )}
                  {festival === "patriotic" && (
                    <>
                      <div className="p-4 rounded-2xl bg-orange-500/5 border border-[#e2c66d]/20 space-y-2 hover:border-orange-500 cursor-pointer transition" onClick={() => handleSelectMovieTitle("Lagaan")}>
                        <div className="text-lg">🏏</div>
                        <strong className="text-xs text-stone-100 block font-bold">Lagaan</strong>
                        <p className="text-[10px] text-stone-400 font-sans">An Oscar-nominated action cricket breakthrough for dignity, pride, and rural hope.</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-orange-500/5 border border-[#e2c66d]/20 space-y-2 hover:border-orange-500 cursor-pointer transition" onClick={() => handleSelectMovieTitle("Swades")}>
                        <div className="text-lg">🇮🇳</div>
                        <strong className="text-xs text-stone-100 block font-bold">Swades (We, the People)</strong>
                        <p className="text-[10px] text-stone-400 font-sans">A classic NASA scientist returns to empower his native home with sustainable electricity.</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-orange-500/5 border border-[#e2c66d]/20 space-y-2 hover:border-orange-500 cursor-pointer transition" onClick={() => { setSelectedSongToPlayId(90); setActiveTab("songs"); }}>
                        <div className="text-lg">🥁</div>
                        <strong className="text-xs text-stone-100 block font-bold">Patriotic Anthems</strong>
                        <p className="text-[10px] text-stone-400 font-sans">Stirring orchestral, flute, and dhol arrangements honoring bravehearts.</p>
                      </div>
                    </>
                  )}
                  {festival === "cinema" && (
                    <>
                      <div className="p-4 rounded-2xl bg-stone-900/40 border border-stone-800 space-y-2 hover:border-[#E50914] cursor-pointer transition" onClick={() => handleSelectMovieTitle("3 Idiots")}>
                        <div className="text-lg">🎓</div>
                        <strong className="text-xs text-stone-200 block font-bold">3 Idiots</strong>
                        <p className="text-[10px] text-stone-400 font-sans">Hilarious and inspiring! Challenging conventional academic stress with friendship.</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-stone-900/40 border border-stone-800 space-y-2 hover:border-[#E50914] cursor-pointer transition" onClick={() => handleSelectMovieTitle("Zindagi Na Milegi Dobara")}>
                        <div className="text-lg">✈️</div>
                        <strong className="text-xs text-stone-200 block font-bold">Zindagi Na Milegi Dobara</strong>
                        <p className="text-[10px] text-stone-400 font-sans">Live life with open sails on a luxurious road-trip itinerary through Spain.</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-stone-900/40 border border-stone-800 space-y-2 hover:border-[#E50914] cursor-pointer transition" onClick={() => { setSelectedSongToPlayId(90); setActiveTab("songs"); }}>
                        <div className="text-lg">🎵</div>
                        <strong className="text-xs text-stone-200 block font-bold">Trending Hot Soundtracks</strong>
                        <p className="text-[10px] text-stone-100 font-sans italic">"Sajni Re" streaming on loops globally now.</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Profile stats showcase */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* XP & level progress */}
              <div className={`p-5 rounded-2xl border space-y-3 ${
                theme === "dark" ? "bg-stone-900/60 border-white/5" : "bg-white border-stone-200 shadow-sm"
              }`}>
                <div className="text-[11px] uppercase font-mono text-stone-500 font-bold block">Level & Raging Status</div>
                <div className="flex justify-between items-end">
                  <span className={`text-3xl font-display font-bold ${theme === "dark" ? "text-stone-100" : "text-stone-900"}`}>Level {profile.level}</span>
                  <span className="text-xs font-mono text-[#D4AF37]">{profile.xp % 100} / 100 XP to next level</span>
                </div>
                <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#D4AF37] h-full transition-all duration-300" style={{ width: `${profile.xp % 100}%` }} />
                </div>
                <div className="text-[10px] text-stone-500 leading-relaxed font-sans">
                  Write critiques, request AI forecast reports or clear quizzes to load level progressions.
                </div>
              </div>

              {/* Earned badges array */}
              <div className={`p-5 rounded-2xl border space-y-3 ${
                theme === "dark" ? "bg-stone-900/60 border-white/5" : "bg-white border-stone-200 shadow-sm"
              }`}>
                <div className="text-[11px] uppercase font-mono text-stone-500 font-bold block">Accumulated Badges</div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {profile.badges.map((bdg, idx) => (
                    <span 
                      key={idx} 
                      className="bg-[#D4AF37]/10 border border-[#D4AF37]/25 text-[#D4AF37] text-[10px] font-mono px-3 py-1 rounded-full flex items-center gap-1"
                    >
                      <Trophy className="w-3.5 h-3.5 text-[#D4AF37]" />
                      {bdg}
                    </span>
                  ))}
                </div>
                <div className="text-[10px] text-stone-500 leading-relaxed font-sans">
                  Current Badges count: <strong>{profile.badges.length} Unlocked</strong>
                </div>
              </div>

              {/* Watchlist Quick Summary */}
              <div className={`p-5 rounded-2xl border space-y-3 ${
                theme === "dark" ? "bg-stone-900/60 border-white/5" : "bg-white border-stone-200 shadow-sm"
              }`}>
                <div className="text-[11px] uppercase font-mono text-stone-500 font-bold block">{t.watchlist} Stats</div>
                <div className="flex justify-between items-center pt-1">
                  <div>
                    <span className={`text-2xl font-mono font-bold ${theme === "dark" ? "text-stone-100" : "text-stone-900"}`}>{profile.watchlist.length}</span>
                    <span className="text-xs text-stone-400 font-sans block">Saved Releases</span>
                  </div>
                  <div>
                    <span className="text-2xl font-mono font-bold text-emerald-500">{profile.reviewCount}</span>
                    <span className="text-xs text-stone-400 font-sans block">Reviews Submitted</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab("explorer")}
                  className="w-full py-2 bg-red-600 hover:bg-red-700 hover:border-red-500 border border-transparent text-xs text-center font-display font-medium text-white rounded-xl cursor-pointer transition text-center"
                >
                  Sync Saved & Review items inside explorer ➔
                </button>
              </div>
            </div>

            {/* Quick Spotify Soundtrack & Continued Listening media player card */}
            <div className={`p-5 rounded-3xl border ${
              theme === "dark" ? "bg-[#141414]/90 border-white/5" : "bg-white border-stone-200 shadow-sm"
            }`}>
              <div className="flex flex-col md:flex-row justify-between items-center gap-5">
                <div className="flex items-center gap-3.5 w-full md:w-auto">
                  {/* Decorative rotating vinyl record */}
                  <div className="w-14 h-14 bg-stone-900 rounded-full border border-stone-800 flex items-center justify-center relative animate-spin-slow animate-duration-10000 shadow-lg shrink-0">
                    <div className="w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-stone-900 rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] uppercase font-mono text-[#E50914] font-black tracking-widest block">Continuous Listening</span>
                      {/* Animated playing indicator bars */}
                      <div className="flex gap-0.5 items-end h-3">
                        <div className="w-0.5 bg-[#E50914] h-2.5 animate-pulse" />
                        <div className="w-0.5 bg-[#E50914] h-1.5 animate-pulse duration-700" />
                        <div className="w-0.5 bg-[#E50914] h-3 animate-pulse duration-1000" />
                        <div className="w-0.5 bg-[#E50914] h-2 animate-pulse duration-500" />
                      </div>
                    </div>
                    <strong className={`text-base block ${theme === "dark" ? "text-stone-100" : "text-stone-900"}`}>
                      Sajni re — <span className="font-sans font-medium text-stone-400 text-sm">Arijit Singh</span>
                    </strong>
                    <span className="text-[10px] text-stone-500 block">Album: Laapataa Ladies (2024) | Lead: Sparsh Srivastav</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5 w-full md:w-auto justify-end">
                  <a
                    href="https://www.youtube.com/results?search_query=Sajni+Laapataa+Ladies+Arijit+Singh+Song+Official"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-red-650 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition duration-300 flex items-center gap-1.5 shadow-md"
                  >
                    Play on YouTube 🎬
                  </a>
                  <button
                    onClick={() => {
                      setSelectedSongToPlayId(90);
                      setActiveTab("songs");
                    }}
                    className={`px-4 py-2.5 text-xs font-bold rounded-xl border transition ${
                      theme === "dark" 
                        ? "bg-transparent border-stone-800 hover:bg-stone-800 text-stone-300"
                        : "bg-stone-50 border-stone-250 hover:bg-stone-100 text-stone-850"
                    }`}
                  >
                    Open Jukebox Menu
                  </button>
                </div>
              </div>
            </div>

            {/* Home Subgrid: Trending block and Instant Mini Arcade Trigger Option */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Trending movies & songs carousel shortcut */}
              <div className="space-y-4">
                <h3 className="text-xl font-display font-semibold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#D4AF37]" />
                  {t.trending}
                </h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-stone-900/40 border border-stone-850 p-4 rounded-xl space-y-2 hover:border-[#D4AF37]/30 cursor-pointer transition group" onClick={() => setActiveTab("explorer")}>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🎓</span>
                        <div>
                          <span className="text-[8px] font-mono text-stone-500 uppercase block tracking-wider font-bold">MOVIE TRENDING</span>
                          <h4 className="text-sm font-semibold text-white group-hover:text-[#D4AF37] transition">3 Idiots</h4>
                        </div>
                      </div>
                      <p className="text-[11px] text-stone-400 leading-relaxed font-sans line-clamp-2">Two friends search for their lost companion, challenging traditional college stress.</p>
                    </div>
                    <div className="bg-stone-900/40 border border-stone-850 p-4 rounded-xl space-y-2 hover:border-[#D4AF37]/30 cursor-pointer transition group" onClick={() => setActiveTab("explorer")}>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🤼</span>
                        <div>
                          <span className="text-[8px] font-mono text-stone-500 uppercase block tracking-wider font-bold">MOVIE TRENDING</span>
                          <h4 className="text-sm font-semibold text-white group-hover:text-[#D4AF37] transition">Dangal</h4>
                        </div>
                      </div>
                      <p className="text-[11px] text-stone-400 leading-relaxed font-sans line-clamp-2">A wrestling biopic that reached global Indian cinema box office milestones.</p>
                    </div>
                  </div>

                  {/* Real Trending song container */}
                  <div 
                    className="bg-stone-900/40 border border-[#E50914]/25 hover:border-[#E50914]/50 p-4 rounded-xl space-y-3 cursor-pointer transition-all duration-350 group" 
                    onClick={() => {
                      setSelectedSongToPlayId(90);
                      setActiveTab("songs");
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl animate-spin-slow">🎵</span>
                        <div>
                          <span className="text-[9px] font-mono text-[#E50914] uppercase font-black flex items-center gap-1 tracking-wider">
                            <Sparkles className="w-3 h-3 text-red-500 inline" /> SENSATIONAL HIT • TRENDING SONG
                          </span>
                          <h4 className="text-sm font-bold text-white group-hover:text-[#E50914] transition flex items-center gap-1">
                            Sajni <span className="font-sans font-medium text-xs text-stone-400">— from Laapataa Ladies (2024)</span>
                          </h4>
                        </div>
                      </div>
                      <span className="text-[9px] bg-[#E50914]/20 text-[#E50914] px-2 py-0.5 rounded-full border border-[#E50914]/30 font-sans font-extrabold uppercase tracking-wider animate-pulse">#1 Hit</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-stone-300 bg-stone-950 border border-stone-850 p-2 rounded-lg font-sans">
                      <p className="truncate mr-2">"O sajni re... kaise katey din rati..." — Sung by <strong className="text-white">Arijit Singh</strong></p>
                      <span 
                        className="shrink-0 px-2.5 py-1 bg-red-650 hover:bg-red-700 text-white text-[9px] font-extrabold rounded uppercase tracking-wider transition flex items-center gap-1 shadow-md hover:scale-[1.03]"
                      >
                        Play Jukebox 🎬
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Arcade Parlor Widget Card */}
              <div className={`p-6 rounded-2xl border flex flex-col justify-between ${
                theme === "dark" ? "bg-stone-900/40 border-[#D4AF37]/15" : "bg-white border-stone-200"
              }`}>
                <div className="space-y-2">
                  <h4 className="text-sm uppercase font-mono text-amber-500 tracking-wider flex items-center gap-1.5 font-bold">
                    <Trophy className="w-4 h-4 text-[#D4AF37]" />
                    Filmy Interactive Arcade Hub
                  </h4>
                  <p className="text-xs text-stone-400 leading-relaxed font-sans">
                    Spin the recommendation wheel, answer personality matches, generate custom playlist covers, and secure heavy XP boosts instantly!
                  </p>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setActiveTab("arcade");
                    }}
                    className="py-2.5 bg-gradient-to-r from-red-650 to-[#E50914] text-white rounded-xl hover:from-amber-600 hover:to-red-650 text-xs font-display font-medium cursor-pointer text-center"
                  >
                    Enter Arcade Parlor 🎮
                  </button>
                  <button
                    onClick={() => setActiveTab("quiz")}
                    className="py-2.5 bg-stone-950 hover:bg-stone-900 border border-stone-850 text-stone-300 rounded-xl text-xs font-display cursor-pointer"
                  >
                    Play Trivia Quizzes
                  </button>
                </div>
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
                      <div key={idx} className="bg-cinema-dark/50 border border-white/5 rounded-2xl p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <h5 className="font-display font-bold text-white text-sm">{sm.title}</h5>
                          <span className="text-[10px] font-mono text-gray-500">{sm.year}</span>
                        </div>
                        <p className="text-xs text-gray-300 leading-relaxed font-sans">{sm.reason}</p>
                        
                        {Array.isArray(sm.songs) && sm.songs.length > 0 && (
                          <div className="pt-2 border-t border-white/5 space-y-1">
                            <span className="text-[10px] text-pink-300 font-mono font-extrabold flex items-center gap-1 uppercase tracking-wider">
                              <Music className="w-3 h-3 text-gold-400" /> Suggested hit tracks
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {sm.songs.map((song: string, sIdx: number) => (
                                <span key={sIdx} className="bg-pink-950/40 border border-gold-500/20 rounded-lg px-2 py-0.5 text-[10px] text-amber-100 font-medium">
                                  🎵 {song}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
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
          <MoodDiscoverer 
            onRegisterXp={handleRegisterXp}
            onSelectMovie={(movieName) => {
              setActiveTab("explorer");
              setActiveMovieId(movieName);
            }}
            onPlaySong={(songId) => {
              setActiveTab("songs");
              setSelectedSongToPlayId(songId);
            }}
            theme={theme}
          />
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

        {/* TAB 10.5: SONGS PLAYLIST & SOUNDTRACKS */}
        {activeTab === "songs" && (
          <SongsJukebox 
            onRegisterXp={handleRegisterXp} 
            onSelectMovie={handleSelectMovieTitle} 
            autoPlaySongId={selectedSongToPlayId}
            onClearAutoPlay={() => setSelectedSongToPlayId(null)}
          />
        )}

        {/* TAB 10.6: FILMY ARCADE */}
        {activeTab === "arcade" && (
          <BollyverseArcade 
            onRegisterXp={handleRegisterXp} 
            onSelectMovie={handleSelectMovieTitle}
            onPlaySong={(songId) => {
              setSelectedSongToPlayId(songId);
              setActiveTab("songs");
            }}
            theme={theme}
          />
        )}

        {/* TAB 10.7: BOLLYWOOD WRAPPED */}
        {activeTab === "wrapped" && (
          <BollyWrapped 
            userProfile={profile}
            theme={theme}
          />
        )}

        {/* TAB 10.8: INTERACTIVE MAP */}
        {activeTab === "map" && (
          <InteractiveShootMap 
            theme={theme}
          />
        )}

        {/* TAB 10.9: AI STUDIO & PASSPORT */}
        {activeTab === "passport" && (
          <BollyPassportAndAiStudio 
            onRegisterXp={handleRegisterXp}
            userProfile={profile}
            theme={theme}
          />
        )}

        {/* TAB 10.10: SCHOOL OF CINEMA EDUCATION */}
        {activeTab === "education" && (
          <BollyEducation 
            onRegisterXp={handleRegisterXp}
            theme={theme}
          />
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

      {/* GLOBAL FLOATING VINYL PLAYER */}
      <div className="fixed bottom-6 right-6 z-50 bg-[#121212]/95 backdrop-blur-md border border-amber-500/30 p-3.5 rounded-3xl shadow-2xl flex items-center gap-3 animate-slideUp border-l-4 border-l-red-500 max-w-sm">
        <div className={`w-12 h-12 bg-black rounded-full flex items-center justify-center border-2 border-amber-400 relative overflow-hidden shrink-0 shadow-lg ${
          globalPlay ? "animate-spin-slow" : ""
        }`}>
          {/* Label indicating Vinyl groove lines */}
          <div className="absolute inset-1 border border-white/5 rounded-full" />
          <div className="absolute inset-3 border border-white/10 rounded-full" />
          <div className="w-3.5 h-3.5 bg-red-650 rounded-full border border-black flex items-center justify-center">
            <div className="w-1 h-1 bg-white rounded-full" />
          </div>
        </div>

        <div className="pr-4">
          <span className="text-[8px] font-mono text-amber-500 font-extrabold tracking-widest block uppercase">★ Global Vinyl Playing ★</span>
          <strong className="text-[11px] text-white block select-text truncate max-w-[150px]">{currentGlobalTrack}</strong>
          <span className="text-[9px] text-stone-400 block font-mono">Status: {globalPlay ? "spinning" : "paused"}</span>
        </div>

        <button
          onClick={() => setGlobalPlay(!globalPlay)}
          className={`w-9 h-9 rounded-full flex items-center justify-center border transition duration-300 cursor-pointer ${
            globalPlay 
              ? "bg-[#E50914]/20 border-[#E50914] text-[#E50914]" 
              : "bg-amber-400 text-black border-amber-400 hover:scale-105"
          }`}
          title="Toggle Global Masterbeats Playback"
        >
          {globalPlay ? (
            <span className="text-[10px] font-sans font-black">Pause</span>
          ) : (
            <Play className="w-4.5 h-4.5 fill-current text-black ml-0.5" />
          )}
        </button>
      </div>

    </div>
  );
}
