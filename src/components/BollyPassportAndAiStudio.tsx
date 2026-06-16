import React, { useState } from "react";
import { 
  Award, Sparkles, Heart, Users, MapPin, 
  RefreshCw, MessageSquare, Compass, Send, CheckCircle, 
  Tv, Film, Music, Shield, Play, HelpCircle, ArrowRight, Gauge, Save, Share2, Palette, Smile
} from "lucide-react";
import { MOVIES_DATABASE } from "../data/bollyData";
import { SONGS_DATABASE } from "../data/songsData";

interface BollyPassportAndAiProps {
  onRegisterXp: (amount: number) => void;
  userProfile: {
    xp: number;
    level: number;
    badges: string[];
    reviewCount: number;
    watchlist: { movieId: string }[];
  };
  theme: "dark" | "light";
}

export default function BollyPassportAndAiStudio({ 
  onRegisterXp, 
  userProfile,
  theme 
}: BollyPassportAndAiProps) {
  const [activeSubTab, setActiveSubTab] = useState<"passport" | "ending" | "couple" | "cast" | "dialogue" | "hum" | "wallpaper">("passport");

  // State for alternate ending
  const [selectedMovieEnding, setSelectedMovieEnding] = useState(MOVIES_DATABASE[0].title);
  const [alternateEndingResult, setAlternateEndingResult] = useState<string>("");
  const [endingLoading, setEndingLoading] = useState(false);

  // State for compatibility
  const [partner1, setPartner1] = useState("");
  const [partner2, setPartner2] = useState("");
  const [compatibilityResult, setCompatibilityResult] = useState<any | null>(null);
  const [compatibilityLoading, setCompatibilityLoading] = useState(false);

  // State for dream cast
  const [movieToRemake, setMovieToRemake] = useState("Dilwale Dulhania Le Jayenge");
  const [dreamCastResult, setDreamCastResult] = useState<any | null>(null);
  const [castLoading, setCastLoading] = useState(false);

  // State for dialogue finder
  const [dialogueQuery, setDialogueQuery] = useState("");
  const [foundDialogues, setFoundDialogues] = useState<any[]>([]);
  const [dialogueLoading, setDialogueLoading] = useState(false);

  // State for Hum the Tune
  const [humSequence, setHumSequence] = useState<string[]>([]);
  const [identifiedSong, setIdentifiedSong] = useState<any | null>(null);
  const [humLoading, setHumLoading] = useState(false);

  // State for Quote Wallpaper
  const [selectedQuote, setSelectedQuote] = useState("Bade bade deshon mein, aisi chhoti chhoti baatein hoti rehti hain, Senorita.");
  const [cardBg, setCardBg] = useState("from-[#E50914] to-amber-600");
  const [textAlignment, setTextAlignment] = useState<"text-center" | "text-left" | "text-right">("text-center");
  const [fontSize, setFontSize] = useState("text-lg");
  const [savedWallpapers, setSavedWallpapers] = useState<string[]>([]);

  // Sample legendary dialogues for finder
  const FAMOUS_DIALOGUES_DB = [
    { text: "Rahul, naam toh suna hi hoga!", movie: "Dil To Pagal Hai", context: "SRK introducing himself", actor: "Shah Rukh Khan" },
    { text: "Bade bade deshon mein aisi chhoti chhoti baatein hoti rehti hain, Senorita.", movie: "Dilwale Dulhania Le Jayenge", context: "Raj reassuring Simran in Europe", actor: "Shah Rukh Khan" },
    { text: "Mere Karan Arjun aayenge!", movie: "Karan Arjun", context: "Rakhee screaming with ultimate belief", actor: "Rakhee Gulzar" },
    { text: "All is well!", movie: "3 Idiots", context: "Rancho explaining how to trick the heart", actor: "Aamir Khan" },
    { text: "Sattar minute, sirf sattar minute hai tumhare paas.", movie: "Chak De! India", context: "Coach Kabir's iconic locker room speech", actor: "Shah Rukh Khan" },
    { text: "Zindagi badi honi chahiye, lambi nahi.", movie: "Anand / Kal Ho Naa Ho", context: "Philosophical take on living life fully", actor: "Rajesh Khanna / SRK" },
    { text: "Mogambo khush hua!", movie: "Mr. India", context: "Iconic villain expression", actor: "Amrish Puri" },
    { text: "Don ko pakadna mushkil hi nahi, namumkin hai.", movie: "Don", context: "Action assertion text", actor: "Shah Rukh Khan" },
    { text: "Thappad se darr nahi lagta sahab, pyaar se lagta hai.", movie: "Dabangg", context: "Sonakshi's epic confrontation", actor: "Sonakshi Sinha" }
  ];

  // AI Alternate Ending generator
  const handleGenerateEnding = async () => {
    setEndingLoading(true);
    setAlternateEndingResult("");

    try {
      const resp = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { 
              role: "user", 
              content: `Write an incredibly funny, creative, dramatic Alternate Ending (approx 150 words) for the classic Bollywood movie "${selectedMovieEnding}". Include an epic climax, a twist sequence, a signature dialogue, and a description of a grand celebration or dance song at the end. Use a few Hinglish words for extra flavor.` 
            }
          ]
        })
      });
      const data = await resp.json();
      setAlternateEndingResult(data.response);
      onRegisterXp(30);
    } catch (err) {
      // Fallback local description
      const fallbacks: Record<string, string> = {
        "Dilwale Dulhania Le Jayenge": "Arey Senorita! Twist climax: In this alternate timeline, Bauji denies Raj at the railway platform, so Simran runs back but Raj is actually the secret CEO of London Central Railway! He buys the entire train on the spot, halts it, and Bauji says, 'Jaa Simran, jaa, ye poora station hi tere sasur ka hai!' Raj and Simran start dancing to 'Mehndi Laga Ke Rakhna' in high-tech disco lights!",
        "3 Idiots": "What if Virus accepted Chatur's speech as a comedy masterpiece? Chatur gets crowned the student prime minister, while Rancho reveals he patented a flying samosa-maker. Raju gets a high-paying job as an international safety inspector for religious prayers, and they all dance right on top of the Ladakh lake to 'All Is Well' with bagpipes!",
        "Zindagi Na Milegi Dobara": "During the Pamplona bull-running, instead of fleeing, Kabir, Imran, and Arjun form an elite human pyramid to perform a Bollywood bhangra. The bulls stop, completely mesmerized, and start tapping their hoofs to 'Senorita'. Laila joins them with guitars as they decide to buy a Spanish vineyard and name it 'Moska-Chai'.",
        "Kuch Kuch Hota Hai": "Instead of Aman letting Anjali go at the wedding, Rahul suddenly reveals a hidden twins profile! Both Anjali and Rahul's twin (Prithvi) fall in love, meaning a double wedding! Aman laughs, buys the summer camp, and runs it as a Bollywood dance tutorial school. Everyone dances to 'Koi Mil Gaya' in color-blocked jackets!"
      };
      setAlternateEndingResult(fallbacks[selectedMovieEnding] || `Awesome local twist ending: After a spectacular action block, the heroes reconcile on a massive concert stage in Mumbai! They deliver a witty dialogue, resolve all old family rivalries, and have a beautiful, star-studded final sangeet number!`);
    } finally {
      setEndingLoading(false);
    }
  };

  // AI Couple Compatibility Generator
  const handleCheckCompatibility = async () => {
    if (!partner1.trim() || !partner2.trim()) return;
    setCompatibilityLoading(true);

    try {
      const resp = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { 
              role: "user", 
              content: `Calculate Bollywood compatibility between "${partner1}" and "${partner2}". Return a random score (e.g. 95%), an archetype couple name (like Raj & Simran, Ranbir & Deepika, Kabir & Preeti), a hilarious description of how their movie tastes collide, and a suggested date night movie with snack pairing. Formulate under 100 words.` 
            }
          ]
        })
      });
      const data = await resp.json();
      
      const lines = data.response.split("\n").filter(Boolean);
      setCompatibilityResult({
        score: Math.floor(Math.random() * 25) + 75 + "%",
        pairType: partner1.length % 2 === 0 ? "Raj & Simran (Timeless Classic Love)" : "Kabir & Naina (Modern Wanderer Chemistry)",
        description: data.response,
        snack: partner2.length % 2 === 0 ? "Spicy Samosas with Thums Up" : "Hot Caramel Popcorn with Masala Chai"
      });
      onRegisterXp(25);
    } catch {
      setCompatibilityResult({
        score: "89%",
        pairType: "Bunny & Naina (The Wanderer Meets the Scholar)",
        description: `Total filmy explosion! ${partner1} loves action-heavy flying cars while ${partner2} craves 90s violins. But your charts align perfectly under the Yash Raj star. You are destined to make epic road trips with grand background songs trailing your steps!`,
        snack: "Cheesy Samosas and Sweet Mango Lassi"
      });
    } finally {
      setCompatibilityLoading(false);
    }
  };

  // AI Dream Cast Generator
  const handleGenerateDreamCast = async () => {
    setCastLoading(true);
    try {
      const resp = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { 
              role: "user", 
              content: `Create a dream cast remake configuration for: "${movieToRemake}". Provide actor names and specific reasons for roles: Director, Male Lead, Female Lead, Iconic Sidekick, Legendary Villain. Return as clean listed points.` 
            }
          ]
        })
      });
      const data = await resp.json();
      setDreamCastResult(data.response);
      onRegisterXp(25);
    } catch {
      setDreamCastResult(`★ Fantasy Remake Cast for ${movieToRemake}:\n\n- **Director**: Sanjay Leela Bhansali (To inject 400% more neon colors and massive chandeliers)\n- **Male Lead**: Vicky Kaushal (For top-tier emotional depth and high sangeet energy)\n- **Female Lead**: Alia Bhatt (The perfect combination of modern poise and dramatic screen presence)\n- **Iconic Sidekick**: Johnny Lever Jr. (For that retro laugh track trigger)\n- **Villain**: Bobby Deol (With a killer entrance walk on high-beat acoustic background scores!)`);
    } finally {
      setCastLoading(false);
    }
  };

  // Dialogue Finder search
  const handleSearchDialogue = (q: string) => {
    setDialogueLoading(true);
    setDialogueQuery(q);
    
    setTimeout(() => {
      const match = FAMOUS_DIALOGUES_DB.filter(d => 
        d.text.toLowerCase().includes(q.toLowerCase()) || 
        d.movie.toLowerCase().includes(q.toLowerCase()) ||
        d.actor.toLowerCase().includes(q.toLowerCase())
      );
      setFoundDialogues(match);
      setDialogueLoading(false);
      if (match.length > 0) onRegisterXp(15);
    }, 600);
  };

  // Hum the Tune analyzer
  const handleAddHumNote = (note: string) => {
    const next = [...humSequence, note];
    setHumSequence(next);

    if (next.length === 4) {
      setHumLoading(true);
      setTimeout(() => {
        // Find a random song
        const songObj = SONGS_DATABASE[Math.floor(Math.random() * SONGS_DATABASE.length)];
        setIdentifiedSong(songObj);
        setHumLoading(false);
        onRegisterXp(20);
      }, 1200);
    }
  };

  const handleResetHum = () => {
    setHumSequence([]);
    setIdentifiedSong(null);
  };

  // Save Quotes Wallpaper
  const handleSaveWallpaper = () => {
    if (!savedWallpapers.includes(selectedQuote)) {
      setSavedWallpapers([...savedWallpapers, selectedQuote]);
      onRegisterXp(15);
    }
  };

  return (
    <div className={`p-6 md:p-8 rounded-3xl border text-white relative overflow-hidden transition-all duration-300 ${
      theme === "dark" 
        ? "bg-stone-900/40 border-white/5" 
        : "bg-white border-stone-200 text-stone-900 shadow-md"
    }`} id="passport-ai-studio-root">
      
      {/* Background radial flare */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-650/10 rounded-full filter blur-[100px] pointer-events-none" />

      {/* Main Header */}
      <div className="border-b border-white/10 pb-5 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase font-mono font-extrabold bg-[#E50914]/15 text-[#E50914] px-2.5 py-1 rounded border border-[#E50914]/30">
            ★ Special VIP Studio Panel ★
          </span>
          <h2 className="text-2xl md:text-3xl font-display font-black tracking-tight mt-2 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500 animate-pulse" />
            AI Filmy Studio & Passport
          </h2>
          <p className={`text-xs mt-1 ${theme === "dark" ? "text-stone-400" : "text-stone-600"}`}>
            Configure neural film casting, settle alternate endings, match romantic compatibility scores, or generate gorgeous digital quote cards!
          </p>
        </div>

        {/* Sub Navigation Menus */}
        <div className="flex gap-1 overflow-x-auto whitespace-nowrap p-1 bg-black/40 border border-stone-850 rounded-2xl w-full md:w-auto scrollbar-none">
          {[
            { id: "passport", label: "My Passport 🎫" },
            { id: "ending", label: "AI Alternate Ending 🎬" },
            { id: "couple", label: "AI Couple Match 💖" },
            { id: "cast", label: "AI Dream Remake 🧬" },
            { id: "dialogue", label: "Filmy Dialects 🗣️" },
            { id: "hum", label: "Hum-The-Tune 🎵" },
            { id: "wallpaper", label: "Quote Poster 🎨" }
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setActiveSubTab(mode.id as any)}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold font-display cursor-pointer transition-all duration-300 ${
                activeSubTab === mode.id
                  ? "bg-[#E50914] text-white shadow-md scale-105"
                  : theme === "dark" 
                    ? "text-stone-400 hover:text-white"
                    : "text-stone-700 hover:text-stone-950"
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* RENDER ACTIVE SUBTAB ACTIONS */}
      
      {/* 1. PERSONAL MOVIE PASSPORT */}
      {activeSubTab === "passport" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
          
          {/* Left profile info */}
          <div className="md:col-span-1 bg-stone-950/80 border border-stone-850 p-6 rounded-3xl space-y-5 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-650/20 to-amber-500/10 rounded-full filter blur-lg pointer-events-none" />
            
            <div className="w-20 h-20 bg-gradient-to-tr from-red-650 to-amber-500 rounded-full flex items-center justify-center mx-auto border-2 border-amber-400 p-0.5 shadow-xl">
              <span className="font-display font-black text-2xl text-white">
                {userProfile.reviewCount ? "🎙️" : "👑"}
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-sans font-black text-amber-400">Personal Filmy Passport</h3>
              <span className="text-[10px] font-mono bg-red-600/10 text-[#E50914] px-3 py-1 rounded-full uppercase font-black uppercase inline-block">
                GOLD AUDIENCE STATUS
              </span>
            </div>

            {/* Passport XP level bar */}
            <div className="space-y-1 text-left bg-black/60 p-3.5 rounded-2xl border border-stone-850">
              <div className="flex justify-between items-center text-[10px] font-mono text-stone-400">
                <span>Passport Progress:</span>
                <strong className="text-white">Lvl {userProfile.level} • {userProfile.xp} XP</strong>
              </div>
              <div className="w-full bg-stone-900 h-2 rounded-full overflow-hidden border border-stone-850">
                <div 
                  className="bg-gradient-to-r from-red-650 to-amber-500 h-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (userProfile.xp % 100))}%` }}
                />
              </div>
              <p className="text-[9px] text-stone-500 text-center leading-none mt-1">
                Reach next level to expand your VIP Cinema credentials!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-stone-900 border border-stone-850 p-3 rounded-2xl">
                <div className="text-xl font-mono font-black text-white">{userProfile.reviewCount}</div>
                <div className="text-[9px] text-stone-400 uppercase font-mono">Critiques Logged</div>
              </div>
              <div className="bg-stone-900 border border-stone-850 p-3 rounded-2xl">
                <div className="text-xl font-mono font-black text-white">{userProfile.watchlist?.length || 0}</div>
                <div className="text-[9px] text-stone-400 uppercase font-mono">Watchlist Goals</div>
              </div>
            </div>
          </div>

          {/* Right accomplishments / badges */}
          <div className="md:col-span-2 space-y-6">
            <h3 className="text-lg font-sans font-black flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Unlocked Badges & Decade Exploration
            </h3>

            {/* Badges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { id: "srk", title: "SRK Devotee 🎭", desc: "Viewed 3+ King Khan romance films" },
                { id: "nostalgia", title: "90s Nostalgia King 🎙️", desc: "Dived deeply into retro musical era" },
                { id: "critic", title: "Romance Expert 💖", desc: "Written an active film review" },
                { id: "dance", title: "Dance Floor Hero 💃", desc: "Played multiple high dhol tracks" },
                { id: "arijit", title: "Arijit Addict 🎵", desc: "Discovered modern emotional audio" },
                { id: "guru", title: "Bollywood Guru 👑", desc: "Obtained 100+ total XP score" }
              ].map((badge) => {
                const isMyBadge = userProfile.xp > 50 || userProfile.badges?.some(b => b.toLowerCase().includes(badge.id));
                return (
                  <div key={badge.id} className={`p-4 rounded-2xl border transition duration-300 flex flex-col justify-between ${
                    isMyBadge 
                      ? "bg-gradient-to-br from-amber-500/10 to-red-650/10 border-amber-400/40 shadow-md text-white"
                      : "bg-stone-950/20 border-stone-850/60 opacity-40 text-stone-500"
                  }`}>
                    <div>
                      <strong className="text-xs font-sans font-bold block">{badge.title}</strong>
                      <span className="text-[10px] text-stone-400 mt-1 block leading-tight">{badge.desc}</span>
                    </div>
                    <div className="mt-4 text-[9px] font-mono text-amber-500 uppercase font-black">
                      {isMyBadge ? "★ UNLOCKED" : "🔐 Locked"}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Decade explore indicator */}
            <div className="bg-[#121212]/80 border border-white/5 rounded-2xl p-5 space-y-3">
              <span className="text-[10px] font-mono text-stone-400 uppercase font-bold tracking-wider block">Decade Affinity Heatmap</span>
              <div className="flex gap-1 items-center justify-between">
                {[
                  { dec: "1950s", wt: "65%", bg: "bg-amber-600" },
                  { dec: "1970s", wt: "80%", bg: "bg-red-600" },
                  { dec: "1990s", wt: "95%", bg: "bg-rose-500" },
                  { dec: "2015s", wt: "90%", bg: "bg-pink-600" },
                  { dec: "2026s", wt: "85%", bg: "bg-purple-600" }
                ].map((item) => (
                  <div key={item.dec} className="text-center flex-1 space-y-1">
                    <div className="bg-stone-900 border border-stone-850 h-16 rounded-xl flex items-end overflow-hidden p-0.5">
                      <div className={`${item.bg} w-full rounded-lg`} style={{ height: item.wt }} />
                    </div>
                    <span className="text-[9px] font-mono text-stone-400 block">{item.dec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 2. ALTERNATE ENDING GENERATOR */}
      {activeSubTab === "ending" && (
        <div className="space-y-5 animate-fadeIn max-w-3xl mx-auto text-center py-4">
          <div className="space-y-1.5">
            <h3 className="text-lg font-sans font-black text-[#E50914] flex items-center justify-center gap-1.5">
              <Film className="w-5 h-5 text-red-500" />
              AI Alternate Climax Twist Creator
            </h3>
            <p className="text-xs text-stone-400">Select any legendary classic and let AI re-write a hilarious, unpredictable alternate ending!</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-lg mx-auto">
            <select
              value={selectedMovieEnding}
              onChange={(e) => setSelectedMovieEnding(e.target.value)}
              className="bg-stone-950 text-xs border border-stone-850 p-2.5 rounded-xl w-full text-stone-200 outline-none"
            >
              <option value="Dilwale Dulhania Le Jayenge">Dilwale Dulhania Le Jayenge (1995)</option>
              <option value="3 Idiots">3 Idiots (2009)</option>
              <option value="Zindagi Na Milegi Dobara">Zindagi Na Milegi Dobara (2011)</option>
              <option value="Kuch Kuch Hota Hai">Kuch Kuch Hota Hai (1998)</option>
            </select>

            <button
              onClick={handleGenerateEnding}
              disabled={endingLoading}
              className="py-2.5 px-5 bg-[#E50914] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shrink-0 hover:bg-red-700 cursor-pointer transition-all duration-300"
            >
              {endingLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Sparkles className="w-4 h-4 text-amber-400" />
              )}
              Re- Write Script Climax
            </button>
          </div>

          {alternateEndingResult && (
            <div className="bg-black/60 border border-[#E50914]/20 p-6 rounded-3xl space-y-3 shadow-inner text-left max-w-2xl mx-auto border-l-4 border-l-[#E50914]">
              <span className="text-[10px] font-mono text-[#E50914] font-extrabold uppercase block">🎞️ Twist ending script matching:</span>
              <p className="text-xs leading-relaxed text-stone-200 font-sans italic">
                {alternateEndingResult}
              </p>
              <div className="text-[9px] font-mono text-stone-500 pt-2 border-t border-white/5 flex justify-between items-center">
                <span>Director: AI Assistant / Yash Raj Mockup</span>
                <span className="text-amber-500 font-bold uppercase tracking-widest">+30 XP Transcribed</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. COUPLE COMPATIBILITY METER */}
      {activeSubTab === "couple" && (
        <div className="space-y-6 animate-fadeIn max-w-2xl mx-auto py-4">
          <div className="text-center space-y-1">
            <h3 className="text-lg font-sans font-black text-pink-500 flex items-center justify-center gap-1.5">
              <Heart className="w-5 h-5 text-pink-500 animate-pulse fill-current" />
              AI Bollywood Couple Compatibility Taste Meter
            </h3>
            <p className="text-xs text-stone-400">Match names and check romantic compatibility based on movie/songs aura levels.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-stone-400 uppercase font-bold">Your Filmy Name:</label>
              <input
                type="text"
                placeholder="e.g. Rahul"
                value={partner1}
                onChange={(e) => setPartner1(e.target.value)}
                className="w-full bg-stone-950 border border-stone-850 rounded-xl p-3 text-xs placeholder-stone-600 text-stone-100 outline-none focus:border-[#E50914] transition"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-stone-400 uppercase font-bold">Partner's Filmy Name:</label>
              <input
                type="text"
                placeholder="e.g. Anjali"
                value={partner2}
                onChange={(e) => setPartner2(e.target.value)}
                className="w-full bg-stone-950 border border-stone-850 rounded-xl p-3 text-xs placeholder-stone-600 text-stone-100 outline-none focus:border-[#E50914] transition"
              />
            </div>
          </div>

          <button
            onClick={handleCheckCompatibility}
            disabled={!partner1.trim() || !partner2.trim() || compatibilityLoading}
            className="w-full py-3 bg-gradient-to-r from-pink-600 to-rose-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 hover:opacity-90 cursor-pointer transition-all duration-300"
          >
            {compatibilityLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Sparkles className="w-4 h-4 text-white" />
            )}
            Synchronize Couple Affinity Rates
          </button>

          {compatibilityResult && (
            <div className="bg-rose-950/20 border border-rose-500/30 p-5 rounded-3xl space-y-3 shadow-md border-t-4 border-t-pink-500 animate-slideUp">
              <div className="flex justify-between items-center">
                <span className="text-xl font-mono font-black text-pink-400">{compatibilityResult.score} MATCHED</span>
                <span className="text-[10px] font-mono bg-pink-500/20 text-pink-300 px-2.5 py-0.5 rounded border border-pink-400/30 uppercase font-bold">
                  {compatibilityResult.pairType}
                </span>
              </div>
              
              <p className="text-xs text-stone-200 leading-relaxed font-sans mt-2">
                {compatibilityResult.description}
              </p>

              <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[10px] text-stone-400 font-mono">
                <span>Perfect snack combo: <strong className="text-amber-400">{compatibilityResult.snack}</strong></span>
                <span className="text-pink-400 uppercase font-black">+25 XP Earnable</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. AI DREAM REMAKE CAST GENERATOR */}
      {activeSubTab === "cast" && (
        <div className="space-y-5 animate-fadeIn max-w-2xl mx-auto py-4">
          <div className="text-center space-y-1">
            <h3 className="text-lg font-sans font-black text-amber-400 flex items-center justify-center gap-1.5">
              <Users className="w-5 h-5 text-amber-500 fill-current" />
              AI Dream Remake Cast Generator
            </h3>
            <p className="text-xs text-stone-400">Design a dream cast configuration with modern superstars for any legendary film.</p>
          </div>

          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="text"
              placeholder="e.g. Dilwale Dulhania Le Jayenge"
              value={movieToRemake}
              onChange={(e) => setMovieToRemake(e.target.value)}
              className="flex-1 bg-stone-950 border border-stone-850 rounded-xl p-2.5 text-xs placeholder-stone-600 outline-none focus:border-[#E50914] text-stone-200"
            />
            <button
              onClick={handleGenerateDreamCast}
              disabled={castLoading || !movieToRemake.trim()}
              className="py-2.5 px-5 bg-[#E50914] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shrink-0 hover:bg-red-700 cursor-pointer transition duration-300"
            >
              {castLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
              )}
              Remake Cast
            </button>
          </div>

          {dreamCastResult && (
            <div className="bg-stone-950/80 border border-stone-850 p-6 rounded-3xl space-y-3 shadow-inner">
              <span className="text-[10px] font-mono text-amber-500 font-extrabold uppercase block">🎬 Remake Cast Blueprint:</span>
              <pre className="text-xs leading-relaxed text-stone-200 font-sans whitespace-pre-wrap leading-normal font-medium max-h-72 overflow-y-auto">
                {dreamCastResult}
              </pre>
              <div className="text-[9px] font-mono text-stone-500 pt-2 border-t border-white/5 text-right font-bold uppercase tracking-wider">
                🍿 Configuration complete (+25 XP)
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. COGNITIVE DIALOGUE SEARCH FINDER */}
      {activeSubTab === "dialogue" && (
        <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto py-4">
          <div className="text-center space-y-1">
            <h3 className="text-lg font-sans font-black text-rose-500 flex items-center justify-center gap-1.5">
              <MessageSquare className="w-5 h-5 text-rose-500" />
              AI Filmy Dialogue Search Finder
            </h3>
            <p className="text-xs text-stone-400">Search legendary dialogues using quick keywords, actors or context.</p>
          </div>

          <div className="max-w-md mx-auto relative">
            <input
              type="text"
              placeholder="e.g. Rahul, Senorita, All Is Well, Sattar minute..."
              value={dialogueQuery}
              onChange={(e) => handleSearchDialogue(e.target.value)}
              className="w-full bg-stone-950 border border-stone-850 rounded-2xl p-3 text-xs placeholder-stone-600 text-stone-150 outline-none focus:border-[#E50914] transition pl-4"
            />
          </div>

          {dialogueLoading ? (
            <div className="text-center py-6">
              <RefreshCw className="w-6 h-6 animate-spin text-[#E50914] mx-auto" />
            </div>
          ) : foundDialogues.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-slideUp">
              {foundDialogues.map((d, index) => (
                <div key={index} className="bg-stone-950/90 border border-stone-850 p-4 rounded-2xl space-y-2 hover:border-[#E50914]/20 transition shadow-inner">
                  <span className="text-[10px] font-mono text-amber-500 bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 rounded uppercase font-bold">
                    {d.actor}
                  </span>
                  <p className="text-[13px] text-white font-serif leading-relaxed italic font-semibold">
                    "{d.text}"
                  </p>
                  <div className="text-[10px] font-mono text-stone-500 flex justify-between items-center border-t border-white/5 pt-2">
                    <span>Movie: <strong>{d.movie}</strong></span>
                    <span>Context: <em>{d.context}</em></span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            dialogueQuery && (
              <div className="text-center text-xs text-stone-500 py-6">No matching dialogues found in standard system. Try searching "Senorita"!</div>
            )
          )}
        </div>
      )}

      {/* 6. HUM THE TUNE MINI GAME */}
      {activeSubTab === "hum" && (
        <div className="space-y-6 animate-fadeIn max-w-2xl mx-auto text-center py-4">
          <div className="space-y-1">
            <h3 className="text-lg font-sans font-black text-[#E50914] flex items-center justify-center gap-1.5">
              <Music className="w-5 h-5 text-red-500 animate-bounce" />
              AI "Hum the Tune" Melody Matcher
            </h3>
            <p className="text-xs text-stone-400">Click 4 sequential acoustic synth notes below to simulate humming a classic ringtone soundtrack, and AI will identify the track!</p>
          </div>

          {/* Hum notes panel */}
          <div className="flex justify-center gap-2 max-w-md mx-auto bg-black p-4 rounded-3xl border border-stone-850 shadow-inner">
            {["Dhon 🎵", "Tan 🎶", "Pip 🎸", "Bup 🎷", "Dhol 🥁", "Flute 🌾"].map((note) => (
              <button
                key={note}
                onClick={() => handleAddHumNote(note)}
                disabled={humSequence.length >= 4 || humLoading}
                className="py-3 px-1 flex-1 bg-stone-900 border border-stone-800 hover:border-amber-400 hover:bg-[#E50914]/15 rounded-xl font-bold font-mono text-[11px] text-stone-300 transition duration-300 cursor-pointer text-center"
              >
                {note}
              </button>
            ))}
          </div>

          {humSequence.length > 0 && (
            <div className="space-y-3">
              <div className="flex justify-center items-center gap-1">
                <span className="text-[10px] font-mono text-stone-500 uppercase font-bold mr-1">Your Hum Pattern:</span>
                {humSequence.map((n, idx) => (
                  <span key={idx} className="bg-[#E50914]/15 border border-[#E50914]/30 px-3 py-1 rounded-full text-[10px] font-mono text-white animate-pulse">
                    {n}
                  </span>
                ))}
              </div>

              <button
                onClick={handleResetHum}
                className="py-1 px-3 bg-stone-950 border border-stone-850 hover:border-red-500 text-stone-400 hover:text-white transition text-[9px] font-mono rounded-lg cursor-pointer"
              >
                Clear Rhythm Notes
              </button>
            </div>
          )}

          {humLoading && (
            <div className="space-y-2 py-4">
              <RefreshCw className="w-8 h-8 text-[#E50914] animate-spin mx-auto" />
              <p className="text-[10px] text-stone-400 font-mono">Comparing soundwaves against 400 soundtrack catalog logs...</p>
            </div>
          )}

          {identifiedSong && (
            <div className="max-w-md mx-auto bg-gradient-to-r from-red-650/10 to-amber-500/10 border border-amber-400/30 p-5 rounded-3xl text-left shadow-lg scale-105 transition-all duration-300 pointer-events-auto">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-stone-900 border border-stone-800 rounded-full flex items-center justify-center animate-spin-slow">
                  <Play className="w-5 h-5 text-amber-400 shrink-0 select-none pointer-events-none fill-current" />
                </div>
                <div>
                  <span className="text-[9px] text-amber-500 font-mono font-bold uppercase tracking-widest block">★ TUNE IDENTIFIED 100% MATCH ★</span>
                  <strong className="text-base text-white font-sans block">{identifiedSong.song_title}</strong>
                  <span className="text-[11px] text-stone-400 block mt-0.5">Film: {identifiedSong.movie} • Singer: {identifiedSong.singer}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 7. QUOTE WALLPAPER GENERATOR */}
      {activeSubTab === "wallpaper" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn py-4">
          
          {/* Controls left */}
          <div className="md:col-span-1 bg-stone-950/80 border border-stone-850 p-5 rounded-3xl space-y-4">
            <h4 className="text-xs uppercase font-mono text-stone-400 font-bold">Custom Quote parameters:</h4>
            
            <div className="space-y-1">
              <label className="text-[10px] text-stone-400 font-mono uppercase font-bold block">Quote text:</label>
              <textarea
                value={selectedQuote}
                onChange={(e) => setSelectedQuote(e.target.value)}
                className="w-full h-20 bg-stone-900 text-stone-200 placeholder-stone-600 border border-stone-800 rounded-xl p-3 text-xs leading-relaxed focus:border-[#E50914] focus:outline-none resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-stone-400 font-mono uppercase font-bold block">Background Color Flare:</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: "from-[#E50914] to-amber-600", label: "Masala" },
                  { id: "from-purple-900 to-indigo-950", label: "Midnight" },
                  { id: "from-rose-650 to-pink-500", label: "Romance" },
                  { id: "from-cyan-900 to-emerald-950", label: "Calm" },
                  { id: "from-stone-900 to-stone-950", label: "Slate" },
                  { id: "from-amber-600 to-yellow-500", label: "Vintage" }
                ].map((bgc) => (
                  <button
                    key={bgc.id}
                    onClick={() => setCardBg(bgc.id)}
                    className={`py-1 rounded text-[10px] font-mono border uppercase font-bold text-center cursor-pointer ${
                      cardBg === bgc.id ? "bg-white text-black border-white" : "bg-stone-900 text-stone-400 border-stone-800"
                    }`}
                  >
                    {bgc.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-stone-400 font-mono uppercase font-bold block">Alignment & Size:</label>
              <div className="flex gap-2">
                <button 
                  onClick={() => setTextAlignment("text-left")} 
                  className={`py-1 px-3 text-[10px] rounded border font-mono ${
                    textAlignment === "text-left" ? "bg-[#E50914] text-white border-[#E50914]" : "bg-stone-900 text-stone-400 border-stone-800"
                  }`}
                >
                  Left
                </button>
                <button 
                  onClick={() => setTextAlignment("text-center")} 
                  className={`py-1 px-3 text-[10px] rounded border font-mono ${
                    textAlignment === "text-center" ? "bg-[#E50914] text-white border-[#E50914]" : "bg-stone-900 text-stone-400 border-stone-800"
                  }`}
                >
                  Center
                </button>
                <button 
                  onClick={() => setTextAlignment("text-right")} 
                  className={`py-1 px-3 text-[10px] rounded border font-mono ${
                    textAlignment === "text-right" ? "bg-[#E50914] text-white border-[#E50914]" : "bg-stone-900 text-stone-400 border-stone-800"
                  }`}
                >
                  Right
                </button>
              </div>
            </div>
            
            <button
              onClick={handleSaveWallpaper}
              className="w-full py-2.5 bg-[#E50914] hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer duration-300"
            >
              <Save className="w-4 h-4 text-white" />
              Save digital card (+15 XP)
            </button>
          </div>

          {/* Card preview right */}
          <div className="md:col-span-2 space-y-4 flex flex-col justify-center">
            <span className="text-[10px] uppercase font-mono text-stone-400 font-black block">Live HD digital Wallpaper:</span>
            
            {/* The actual poster */}
            <div className={`p-8 md:p-12 rounded-3xl bg-gradient-to-br ${cardBg} aspect-[1.8/1] flex flex-col justify-between relative overflow-hidden shadow-2xl transition-all duration-500`}>
              {/* Retro decorative film rolls */}
              <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400 opacity-20 bg-[size:10px_100%] bg-repeat-x" style={{
                backgroundImage: "radial-gradient(circle, #fff 1.5px, transparent 2px)"
              }} />
              
              <div className="text-[9px] font-mono text-white/50 tracking-widest uppercase flex justify-between items-center">
                <span>★ CINEMATIC MASTERQUOTE HD DIGITAL CARD ★</span>
                <span>YASH CHOPRA SCHOOL</span>
              </div>

              <div className="py-4">
                <p className={`${fontSize} ${textAlignment} text-white font-serif tracking-tight leading-relaxed font-bold select-all`}>
                  "{selectedQuote}"
                </p>
              </div>

              <div className="text-[8px] font-mono text-white/40 flex justify-between items-center border-t border-white/10 pt-3">
                <span>BOLLYVERSE AI LABS 2026</span>
                <span>AUTHENTIC FILMY AURA PROFILE</span>
              </div>
            </div>

            {/* Saved quote cards */}
            {savedWallpapers.length > 0 && (
              <div className="bg-stone-950 p-4 border border-stone-850 rounded-2xl space-y-1">
                <span className="text-[9px] uppercase font-bold text-[#E50914] tracking-wider block">💾 Saved Cards List:</span>
                <div className="flex flex-wrap gap-1">
                  {savedWallpapers.map((w, idx) => (
                    <span key={idx} className="bg-white/10 border border-white/5 rounded px-2 py-0.5 text-[10px] text-stone-300 truncate max-w-[200px]">
                      📜 {w}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
