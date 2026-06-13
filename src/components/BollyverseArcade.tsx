import { useState, useEffect } from "react";
import { 
  Trophy, Sparkles, RefreshCw, Dices, Music, Film, HelpCircle, 
  Smile, Flame, Heart, Compass, CheckSquare, Award, Clock, ThumbsUp, Shuffle
} from "lucide-react";
import { SONGS_DATABASE } from "../data/songsData";
import { MOVIES_DATABASE } from "../data/bollyData";

interface BollyverseArcadeProps {
  onRegisterXp: (amount: number) => void;
  onSelectMovie: (title: string) => void;
  onPlaySong: (songId: number) => void;
  theme: "dark" | "light";
}

export default function BollyverseArcade({ onRegisterXp, onSelectMovie, onPlaySong, theme }: BollyverseArcadeProps) {
  const [activeSubTab, setActiveSubTab] = useState<"wheel" | "bingo" | "persona" | "playlist" | "planner">("wheel");

  // ==========================================
  // 1. SPIN THE RECOMMENDATION WHEEL STATES
  // ==========================================
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelResult, setWheelResult] = useState<string | null>(null);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [recommendedHits, setRecommendedHits] = useState<any[]>([]);

  const WHEEL_SECTIONS = [
    { label: "SRK Classics", color: "bg-red-650 text-white" },
    { label: "90s Romance", color: "bg-amber-500 text-stone-950" },
    { label: "High Energy Party", color: "bg-pink-600 text-white" },
    { label: "Deep Hidden Gems", color: "bg-purple-600 text-white" },
    { label: "Family Comedies", color: "bg-emerald-600 text-white" },
    { label: "Action Blockbusters", color: "bg-blue-600 text-white" },
    { label: "National Pride", color: "bg-orange-500 text-white" },
    { label: "Musical Masterpieces", color: "bg-teal-600 text-white" }
  ];

  const handleSpinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWheelResult(null);
    setRecommendedHits([]);

    // Generate random rotations
    const spinsCount = 5 + Math.floor(Math.random() * 5);
    const degree = spinsCount * 360 + Math.floor(Math.random() * 360);
    setWheelRotation(degree);

    setTimeout(() => {
      setIsSpinning(false);
      // Calculate selected section
      const remainderDeg = degree % 360;
      const sectionWidth = 360 / WHEEL_SECTIONS.length;
      // Index is calculated opposing the indicator position at 0 deg (top-center)
      const opposingDeg = (360 - remainderDeg + sectionWidth / 2) % 360;
      const index = Math.floor(opposingDeg / sectionWidth) % WHEEL_SECTIONS.length;
      const result = WHEEL_SECTIONS[index].label;

      setWheelResult(result);
      onRegisterXp(15);

      // Extract matching suggestions from databases
      let suggestedSongs: any[] = [];
      let suggestedMovies: any[] = [];

      if (result === "SRK Classics") {
        suggestedMovies = MOVIES_DATABASE.filter(m => m.actors.includes("Shah Rukh Khan")).slice(0, 2);
        suggestedSongs = SONGS_DATABASE.filter(s => s.lead_actor === "Shah Rukh Khan").slice(0, 3);
      } else if (result === "90s Romance") {
        suggestedMovies = MOVIES_DATABASE.filter(m => m.year < 2000 && m.genre.includes("Romantic")).slice(0, 2);
        suggestedSongs = SONGS_DATABASE.filter(s => s.year < 2000 && s.genre === "Romantic").slice(0, 3);
      } else if (result === "High Energy Party") {
        suggestedSongs = SONGS_DATABASE.filter(s => s.genre === "Dance" || s.mood === "Party").slice(0, 4);
      } else if (result === "Deep Hidden Gems") {
        suggestedMovies = MOVIES_DATABASE.filter(m => m.rating >= 8.0 && m.boxOffice < 150).slice(0, 2);
        suggestedSongs = SONGS_DATABASE.filter(s => s.mood === "Calm" || s.genre === "Indie").slice(0, 3);
      } else if (result === "Family Comedies") {
        suggestedMovies = MOVIES_DATABASE.filter(m => m.genre.includes("Comedy") || m.genre.includes("Family")).slice(0, 2);
        suggestedSongs = SONGS_DATABASE.filter(s => s.genre === "Fun" || s.mood === "Happy").slice(0, 3);
      } else {
        // Fallbacks
        suggestedMovies = MOVIES_DATABASE.slice(0, 2);
        suggestedSongs = SONGS_DATABASE.slice(10, 13);
      }

      setRecommendedHits([
        ...suggestedMovies.map(m => ({ id: `m-${m.id}`, title: m.title, category: "Movie 🎬", meta: m.tagline, action: () => onSelectMovie(m.title) })),
        ...suggestedSongs.map(s => ({ id: `s-${s.song_id}`, title: s.song_title, category: "Song 🎵", meta: `${s.singer} | ${s.movie}`, action: () => onPlaySong(s.song_id) }))
      ]);
    }, 3500);
  };

  // ==========================================
  // 2. BOLLYWOOD BINGO COMPONENT STATES
  // ==========================================
  const INITIAL_BINGO = [
    { id: 1, text: "Knows SRK's signature open-arms pose", ticked: false },
    { id: 2, text: "Cried during 'Kal Ho Naa Ho' death scene", ticked: false },
    { id: 3, text: "Watched '3 Idiots' with family", ticked: false },
    { id: 4, text: "Can recite the legendary Sholay dialogue", ticked: false },
    { id: 5, text: "Can whistle the 'Dhoom' loop signature", ticked: false },
    { id: 6, text: "Knows Deepika's 'Om Shanti Om' welcome wave", ticked: false },
    { id: 7, text: "Replaces real conversation in life with filmy jokes", ticked: false },
    { id: 8, text: "Watched any post-COVID classic first-day first-show", ticked: false },
    { id: 9, text: "Successfully completed any Quiz Arena level", ticked: false }
  ];

  const [bingoGrid, setBingoGrid] = useState(INITIAL_BINGO);
  const [unlockedBingoBadge, setUnlockedBingoBadge] = useState<string | null>(null);

  const toggleBingoGrid = (id: number) => {
    const updated = bingoGrid.map(item => item.id === id ? { ...item, ticked: !item.ticked } : item);
    setBingoGrid(updated);

    // Compute lines to check if bingo completes
    const rows = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    const hasBingo = rows.some(line => line.every(idx => updated[idx].ticked));
    
    if (hasBingo && !unlockedBingoBadge) {
      setUnlockedBingoBadge("Legendary Bollywood Guru 👑");
      onRegisterXp(45);
    }
  };

  const resetBingoBoard = () => {
    setBingoGrid(INITIAL_BINGO);
    setUnlockedBingoBadge(null);
  };

  // ==========================================
  // 3. PERSONALITY MATCH STATES
  // ==========================================
  const PERSONA_QUESTIONS = [
    {
      q: "Your perfect weekend gateway involves...",
      options: [
        { text: "Going on a crazy spontaneous road trip with best friends", points: "ranbir" },
        { text: "Dressing up in designer wear and hosting a grand gala dinner", points: "srk" },
        { text: "Spending quiet hours reading, researching, and mapping perfect routines", points: "aamir" },
        { text: "Heading straight to the dance floor or hit a high-energy sport", points: "deepika" }
      ]
    },
    {
      q: "When face-to-face with high-stress drama, you generally...",
      options: [
        { text: "Spread your open arms and speak a passionate poetic resolution", points: "srk" },
        { text: "Pack up backpacks and disappear momentarily to reconnect with your soul", points: "ranbir" },
        { text: "Formulate a systematic structural analysis to fix details perfectly", points: "aamir" },
        { text: "Stand tall, stay graceful, and deal with classic strength and compassion", points: "deepika" }
      ]
    },
    {
      q: "Your primary fashion/clothing philosophy is...",
      options: [
        { text: "Elegant, stylish, high-fashion, setting massive trends with ease", points: "deepika" },
        { text: "Comfortable flannel shirts, rustic travel coats, and raw natural accessories", points: "ranbir" },
        { text: "An elegant tuxedo or premium classy black suits looking like royalty", points: "srk" },
        { text: "Simple, highly utilitarian, precise, with focus strictly on tasks", points: "aamir" }
      ]
    }
  ];

  const [personaStep, setPersonaStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [personaResult, setPersonaResult] = useState<any | null>(null);

  const handleSelectAnswer = (points: string) => {
    const updatedAnswers = [...selectedAnswers, points];
    setSelectedAnswers(updatedAnswers);

    if (personaStep < PERSONA_QUESTIONS.length - 1) {
      setPersonaStep(personaStep + 1);
    } else {
      // Compute score counts
      const counts: Record<string, number> = {};
      updatedAnswers.forEach(ans => {
        counts[ans] = (counts[ans] || 0) + 1;
      });

      let winner = "srk";
      let highestVal = 0;
      Object.entries(counts).forEach(([k, v]) => {
        if (v > highestVal) {
          highestVal = v;
          winner = k;
        }
      });

      onRegisterXp(30);

      if (winner === "srk") {
        setPersonaResult({
          star: "Shah Rukh Khan (The King of Hearts) ♥",
          emoji: "👑",
          bio: "You are energetic, endlessly charming, and carry an open-arms charisma! You resolve challenges through pure emotion, poetic wit, and deep bonds.",
          color: "bg-amber-500/10 border-amber-400 text-amber-300"
        });
      } else if (winner === "ranbir") {
        setPersonaResult({
          star: "Ranbir Kapoor (The Soulful Wanderer) 🍂",
          emoji: "🎸",
          bio: "You are independent, deeply intuitive, spontaneous, and find peace on the open road. Your artistic sensitivity makes you stand out casually.",
          color: "bg-purple-500/10 border-purple-400 text-purple-300"
        });
      } else if (winner === "aamir") {
        setPersonaResult({
          star: "Aamir Khan (The Perfectionist Genius) 🎓",
          emoji: "📚",
          bio: "Precise, dedicated, highly reflective, and socially minded! You believe in high execution, deep research, and changing old systems cleanly.",
          color: "bg-emerald-500/10 border-emerald-400 text-emerald-300"
        });
      } else {
        setPersonaResult({
          star: "Deepika Padukone (The Sovereign Queen of Elegance) 👑",
          emoji: "💃",
          bio: "You carry absolute grace, resilience, and quiet strength. Your work ethic is exceptional and your trends define classic Indian luxury.",
          color: "bg-pink-500/10 border-pink-400 text-pink-300"
        });
      }
    }
  };

  const resetPersonaQuiz = () => {
    setPersonaStep(0);
    setSelectedAnswers([]);
    setPersonaResult(null);
  };

  // ==========================================
  // 4. AI PLAYLIST GENERATOR STATES
  // ==========================================
  const [selectedVibe, setSelectedVibe] = useState("Long Drive");
  const [generatedTracks, setGeneratedTracks] = useState<any[]>([]);
  const [playlistLoading, setPlaylistLoading] = useState(false);

  const playlistPresets = [
    { id: "Long Drive", label: "Late Night Long Drive 🌃", icon: "🚗" },
    { id: "Workout", label: "High-Energy Workout Gym 🏋️", icon: "⚡" },
    { id: "Romance", label: "Rainy Day Romantics 🌧️", icon: "💖" },
    { id: "Wedding", label: "Sangeet Da Blockbuster 💃", icon: "🎺" },
    { id: "Sufi", label: "Calm Sufi Reflection 🌙", icon: "🕊️" }
  ];

  const handleGeneratePlaylist = () => {
    setPlaylistLoading(true);
    setGeneratedTracks([]);

    setTimeout(() => {
      let songsSelection = [];
      let descriptive = "";

      if (selectedVibe === "Long Drive") {
        songsSelection = SONGS_DATABASE.filter(s => s.genre === "Romantic" || s.mood === "Soft" || s.mood === "Chill").slice(0, 5);
        descriptive = "Sleek low-tempo acoustic melodies made to watch passing highways under neon yellow roadlights.";
      } else if (selectedVibe === "Workout") {
        songsSelection = SONGS_DATABASE.filter(s => s.mood === "Motivational" || s.genre === "Rock" || s.genre === "Rap").slice(0, 5);
        descriptive = "Elevated beats, crushing electric guitar synth lines, and powerful tempos to shatter personal lifting milestones!";
      } else if (selectedVibe === "Romance") {
        songsSelection = SONGS_DATABASE.filter(s => s.genre === "Romantic" && s.mood === "Love").slice(0, 5);
        descriptive = "Classic rain dance loops, heartsick symphonies, and beautiful duets celebrating absolute devotion.";
      } else if (selectedVibe === "Wedding") {
        songsSelection = SONGS_DATABASE.filter(s => s.genre === "Wedding" || s.genre === "Dance" || s.mood === "Celebration").slice(0, 5);
        descriptive = "Sensational dhol-heavy festive highlights guaranteed to pull aunts and uncles onto dancefloors instantly!";
      } else {
        songsSelection = SONGS_DATABASE.filter(s => s.genre === "Devotional" || s.genre === "Sufi" || s.mood === "Peace").slice(0, 5);
        descriptive = "Spiritual flute accents, traditional tablas, and deep introspective ghazals echoing peace and tranquility.";
      }

      onRegisterXp(20);
      setGeneratedTracks(songsSelection);
      setPlaylistLoading(false);
    }, 1500);
  };

  // ==========================================
  // 5. MOVIE NIGHT PLANNER STATES
  // ==========================================
  const [plannerGroup, setPlannerGroup] = useState("Solo Screen");
  const [plannerLength, setPlannerLength] = useState("120"); // mins
  const [plannerVibe, setPlannerVibe] = useState("Comedy");
  const [planResult, setPlanResult] = useState<any | null>(null);
  const [plannerLoading, setPlannerLoading] = useState(false);

  const handleGeneratePlan = () => {
    setPlannerLoading(true);
    setPlanResult(null);

    setTimeout(() => {
      // Find matching movies based on genre preference and runtime constraints
      let matchingMovies = MOVIES_DATABASE.filter(m => 
        m.genre.some(g => g.toLowerCase() === plannerVibe.toLowerCase()) && 
        m.runtime <= parseInt(plannerLength)
      );

      if (matchingMovies.length === 0) {
        matchingMovies = MOVIES_DATABASE.filter(m => m.runtime <= parseInt(plannerLength));
      }

      const moviesToSuggest = matchingMovies.slice(0, 2);
      const suggestedTracks = SONGS_DATABASE.filter(s => s.genre === plannerVibe || s.mood === "Happy").slice(0, 3);

      onRegisterXp(25);
      setPlanResult({
        movies: moviesToSuggest,
        songs: suggestedTracks,
        schedule: [
          { time: "08:15 PM", activity: `Settle in with initial tunes: "${suggestedTracks[0]?.song_title || "Sajni"}" to set the vibe.` },
          { time: "08:30 PM", activity: `Screening Main Feature: "${moviesToSuggest[0]?.title || "3 Idiots"}" (Covers: ${moviesToSuggest[0]?.runtime || 170} Mins)` },
          { time: "10:45 PM", activity: "Quick interval chat: Break out popcorn and hot chai." },
          { time: "11:00 PM", activity: `Warp up with the high energy dance: "${suggestedTracks[1]?.song_title || "Mehndi Laga Ke"}"` }
        ]
      });
      setPlannerLoading(false);
    }, 1500);
  };


  return (
    <div className={`glass-panel rounded-3xl p-6 md:p-8 border shadow-xl ${
      theme === "dark" ? "border-white/5 text-stone-100" : "border-[#E50914]/15 text-stone-900"
    }`} id="arcade-arcade-panels">
      
      {/* Title section */}
      <div className="border-b border-red-500/10 pb-4 mb-6">
        <h2 className="text-2xl font-display font-bold flex items-center gap-2">
          <Dices className="text-amber-500 w-6 h-6 animate-pulse" />
          Filmy Fun Arcade & AI Lab
        </h2>
        <p className="text-xs text-stone-400 mt-1 font-sans">
          Dive into live interactive Bollywood mini-games, dynamic custom selectors, and instant AI generator panels to claim heavy XP boosters.
        </p>
      </div>

      {/* Sub menu controls */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-stone-900/50 rounded-2xl border border-white/5 mb-6">
        <button
          onClick={() => setActiveSubTab("wheel")}
          className={`flex-1 min-w-[120px] py-2.5 rounded-xl text-xs font-semibold select-none flex items-center justify-center gap-2 transition cursor-pointer ${
            activeSubTab === "wheel"
              ? "bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-lg"
              : "text-stone-400 hover:text-white"
          }`}
        >
          <Shuffle className="w-4 h-4" /> Spin Wheel
        </button>
        <button
          onClick={() => setActiveSubTab("bingo")}
          className={`flex-1 min-w-[120px] py-2.5 rounded-xl text-xs font-semibold select-none flex items-center justify-center gap-2 transition cursor-pointer ${
            activeSubTab === "bingo"
              ? "bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-lg"
              : "text-stone-400 hover:text-white"
          }`}
        >
          <CheckSquare className="w-4 h-4" /> Fan Bingo
        </button>
        <button
          onClick={() => setActiveSubTab("persona")}
          className={`flex-1 min-w-[120px] py-2.5 rounded-xl text-xs font-semibold select-none flex items-center justify-center gap-2 transition cursor-pointer ${
            activeSubTab === "persona"
              ? "bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-lg"
              : "text-stone-400 hover:text-white"
          }`}
        >
          <HelpCircle className="w-4 h-4" /> Personality Match
        </button>
        <button
          onClick={() => setActiveSubTab("playlist")}
          className={`flex-1 min-w-[120px] py-2.5 rounded-xl text-xs font-semibold select-none flex items-center justify-center gap-2 transition cursor-pointer ${
            activeSubTab === "playlist"
              ? "bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-lg"
              : "text-stone-400 hover:text-white"
          }`}
        >
          <Music className="w-4 h-4" /> Vibe Playlist
        </button>
        <button
          onClick={() => setActiveSubTab("planner")}
          className={`flex-1 min-w-[120px] py-2.5 rounded-xl text-xs font-semibold select-none flex items-center justify-center gap-2 transition cursor-pointer ${
            activeSubTab === "planner"
              ? "bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-lg"
              : "text-stone-400 hover:text-white"
          }`}
        >
          <Clock className="w-4 h-4" /> Movie Planner
        </button>
      </div>

      {/* ========================================================== */}
      {/* 1. VIEW: WHEEL */}
      {/* ========================================================== */}
      {activeSubTab === "wheel" && (
        <div className="space-y-6 text-center max-w-xl mx-auto animate-fadeIn" id="subtab-wheel">
          <div className="space-y-2">
            <h3 className="text-lg font-display font-medium text-white flex items-center justify-center gap-1.5">
              🎟️ The Bollywood Fortune Wheel
            </h3>
            <p className="text-xs text-stone-400">
              Spin to select a dynamic custom cinema category. Claim direct references with +15 XP rewarded!
            </p>
          </div>

          {/* Graphical Rotary Wheel */}
          <div className="relative w-64 h-64 mx-auto my-8">
            {/* Red top indicator needle */}
            <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-red-600 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
            
            {/* Spinning body */}
            <div 
              style={{ 
                transform: `rotate(${wheelRotation}deg)`,
                transition: isSpinning ? "transform 3.5s cubic-bezier(0.1, 0.8, 0.1, 1)" : "none"
              }}
              className="w-full h-full rounded-full border-4 border-stone-800 shadow-2xl relative overflow-hidden bg-stone-900"
            >
              {WHEEL_SECTIONS.map((sec, idx) => {
                const angle = 360 / WHEEL_SECTIONS.length;
                const rotation = idx * angle;
                return (
                  <div 
                    key={idx}
                    style={{ 
                      transform: `rotate(${rotation}deg)`,
                      clipPath: "polygon(50% 50%, 0 0, 42% 0)" 
                    }}
                    className={`absolute inset-0 origin-center flex justify-center pt-8 font-bold ${sec.color}`}
                  >
                    {/* Segment label */}
                    <span 
                      style={{ transform: `rotate(${angle / 2}deg)` }}
                      className="text-[8px] tracking-tight uppercase absolute origin-center block mt-3"
                    >
                      {sec.label.split(" ")[0]}
                    </span>
                  </div>
                );
              })}
              
              {/* Central hub pivot */}
              <div className="absolute inset-[38%] bg-stone-950 border-4 border-stone-800 rounded-full flex items-center justify-center z-10 shadow-lg text-white font-black text-xs font-mono">
                SPIN
              </div>
            </div>
          </div>

          <button
            onClick={handleSpinWheel}
            disabled={isSpinning}
            className="px-8 py-3.5 bg-[#E50914] text-white font-semibold font-display text-xs rounded-xl hover:bg-[#b80610] hover:scale-[1.02] shadow-[0_5px_15px_rgba(229,9,20,0.4)] transition duration-300 cursor-pointer disabled:opacity-50"
          >
            {isSpinning ? "Spinning Live..." : "Spin Cinematic Wheel! (+15 XP)"}
          </button>

          {/* Output match indicators */}
          {wheelResult && (
            <div className="p-4 bg-stone-900/60 border border-white/5 rounded-2xl animate-scaleUp text-left space-y-3">
              <div className="text-center">
                <span className="text-[10px] text-amber-400 font-mono font-bold uppercase tracking-widest block">Fortune Wheel Selection Completed</span>
                <span className="text-lg font-bold text-white font-display block mt-1">🎉 {wheelResult}!</span>
              </div>
              
              {recommendedHits.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <span className="text-[10px] uppercase font-mono text-stone-500 font-bold block">Exclusive Curated Matches:</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {recommendedHits.map((h, i) => (
                      <div 
                        key={i} 
                        onClick={h.action}
                        className="bg-stone-950/80 border border-stone-800/80 p-2.5 rounded-xl hover:border-[#E50914]/40 cursor-pointer transition flex items-center justify-between text-xs group"
                      >
                        <div>
                          <span className="text-[9px] font-mono font-bold text-amber-500 block">{h.category}</span>
                          <strong className="text-white group-hover:text-red-500 transition">{h.title}</strong>
                          <span className="text-[10px] text-stone-400 block truncate max-w-[180px]">{h.meta}</span>
                        </div>
                        <span className="text-stone-500 group-hover:text-amber-400">➔</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================== */}
      {/* 2. VIEW: BINGO */}
      {/* ========================================================== */}
      {activeSubTab === "bingo" && (
        <div className="space-y-6 max-w-xl mx-auto text-center animate-fadeIn" id="subtab-bingo">
          <div className="space-y-1">
            <h3 className="text-lg font-display font-medium text-white flex items-center justify-center gap-1.5">
              🎬 Bollywood Fan Bingo Grid
            </h3>
            <p className="text-xs text-stone-400">
              Tick off typical cinema achievements you have lived in real life. Complete any single line to unlock titles with +45 XP!
            </p>
          </div>

          {unlockedBingoBadge && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-mono animate-bounce flex items-center justify-center gap-2">
              <Award className="w-5 h-5 text-emerald-400 animate-spin-slow" />
              <span><strong>Bingo Masterpiece Unlocked!</strong> Badge Added: {unlockedBingoBadge} (+45 XP Gained!)</span>
            </div>
          )}

          {/* Bingo Grid */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-stone-900/60 rounded-3xl border border-white/5 mx-auto">
            {bingoGrid.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleBingoGrid(item.id)}
                className={`aspect-square p-2 border rounded-2xl flex flex-col items-center justify-center text-[10px] font-medium leading-tight tracking-tight transition duration-300 hover:scale-[1.03] select-none text-center ${
                  item.ticked
                    ? "bg-gradient-to-br from-red-600/30 to-amber-500/30 border-red-500 text-white font-bold"
                    : "bg-stone-950/80 border-stone-850 hover:border-stone-700 text-stone-400"
                }`}
              >
                {item.ticked ? (
                  <CheckSquare className="w-6 h-6 text-amber-400 mb-1.5 stroke-[2.5]" />
                ) : (
                  <span className="text-stone-700 font-mono text-xs block mb-1.5">#0{item.id}</span>
                )}
                <span>{item.text}</span>
              </button>
            ))}
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={resetBingoBoard}
              className="px-5 py-2 hover:bg-stone-800 text-stone-400 border border-stone-800 hover:text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              Reset bingo board
            </button>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* 3. VIEW: PERSONA */}
      {/* ========================================================== */}
      {activeSubTab === "persona" && (
        <div className="space-y-6 max-w-xl mx-auto animate-fadeIn" id="subtab-persona">
          <div className="text-center space-y-1">
            <h3 className="text-lg font-display font-medium text-white flex items-center justify-center gap-1.5">
              🎭 Bollywood Superstar Personality Match
            </h3>
            <p className="text-xs text-stone-400">
              Answer 3 whimsical mood questions to find which legendary superstar aligns with your emotional wavelength.
            </p>
          </div>

          {!personaResult ? (
            <div className="bg-stone-900/60 border border-white/5 rounded-3xl p-6 space-y-4 shadow-inner">
              <div className="flex justify-between items-center text-xs font-mono text-stone-500 border-b border-white/5 pb-2">
                <span>Progress Checklist</span>
                <span>Question {personaStep + 1} of {PERSONA_QUESTIONS.length}</span>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-white leading-snug">{PERSONA_QUESTIONS[personaStep].q}</h4>
                <div className="space-y-2 pt-2">
                  {PERSONA_QUESTIONS[personaStep].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectAnswer(opt.points)}
                      className="w-full text-left p-3 rounded-xl border border-stone-850 bg-stone-950/60 hover:bg-stone-900 hover:border-amber-400/30 text-xs text-stone-300 hover:text-white transition cursor-pointer flex items-center justify-between"
                    >
                      <span>{opt.text}</span>
                      <span className="text-stone-700">➔</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className={`p-6 border rounded-3xl space-y-4 animate-scaleUp text-center ${personaResult.color}`}>
              <div className="text-5xl animate-bounce">{personaResult.emoji}</div>
              <div className="space-y-1">
                <span className="text-[10px] text-stone-400 font-mono font-bold uppercase tracking-widest block">Personality Profile Compiled</span>
                <h4 className="text-xl font-display font-black text-white">{personaResult.star}</h4>
              </div>
              <p className="text-xs leading-relaxed max-w-md mx-auto">{personaResult.bio}</p>
              
              <button
                onClick={resetPersonaQuiz}
                className="px-6 py-2.5 mt-2 bg-stone-950 hover:bg-stone-900 border border-current text-white font-semibold rounded-xl text-xs cursor-pointer block mx-auto transition"
              >
                Determine Another Match
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================== */}
      {/* 4. VIEW: PLAYLIST */}
      {/* ========================================================== */}
      {activeSubTab === "playlist" && (
        <div className="space-y-6 animate-fadeIn" id="subtab-playlist">
          <div className="text-center space-y-1">
            <h3 className="text-md font-display font-bold text-white flex items-center justify-center gap-1.5">
              🎼 Spotify-Inspired Vibe Playlist Generator
            </h3>
            <p className="text-xs text-stone-400">
              Pick a dynamic emotional playlist preset. Our AI catalog will crawl matching titles from database files.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {playlistPresets.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedVibe(p.id)}
                className={`py-3.5 px-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition text-xs font-bold leading-tight cursor-pointer ${
                  selectedVibe === p.id
                    ? "bg-gradient-to-br from-red-600/20 to-[#E50914]/20 border-[#E50914] text-white"
                    : "bg-stone-900/40 border-stone-850 hover:border-stone-700 text-stone-400"
                }`}
              >
                <span className="text-xl">{p.icon}</span>
                <span className="text-[10px] block font-medium truncate w-full text-center">{p.label.split(" ")[0]}</span>
              </button>
            ))}
          </div>

          <button
            onClick={handleGeneratePlaylist}
            disabled={playlistLoading}
            className="w-full py-3 bg-[#E50914] text-white rounded-xl text-xs font-bold font-display cursor-pointer hover:bg-red-700 shadow-md transition"
          >
            {playlistLoading ? "Generating Curated Soundtrack Mix..." : "Generate Customized Mix (+20 XP)"}
          </button>

          {generatedTracks.length > 0 && (
            <div className="space-y-3 p-4 bg-stone-950/80 border border-white/5 rounded-2xl animate-slideUp">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[10px] text-amber-400 font-mono font-bold uppercase tracking-widest block">AI PLAYLIST COMPLETED • 5 TRACKS</span>
                <span className="text-stone-500 text-[10px]">Click any item to play instantly</span>
              </div>

              <div className="divide-y divide-stone-800">
                {generatedTracks.map((song, i) => (
                  <div 
                    key={song.song_id} 
                    className="flex justify-between items-center py-3 select-none text-xs group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-stone-500 font-mono text-xs block w-4">#{i+1}</span>
                      <div>
                        <strong className="text-white block hover:text-red-500 cursor-pointer text-xs" onClick={() => onPlaySong(song.song_id)}>
                          {song.song_title}
                        </strong>
                        <span className="text-[10px] text-stone-400 font-sans block">{song.singer} • {song.movie}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-400/20 text-stone-300">
                        {song.genre}
                      </span>
                      <button 
                        onClick={() => onPlaySong(song.song_id)}
                        className="p-1 px-2.5 bg-stone-900 border border-stone-800 group-hover:bg-[#E50914] group-hover:text-white rounded-lg text-[9px] font-mono tracking-widest cursor-pointer transition uppercase"
                      >
                        Play
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================== */}
      {/* 5. VIEW: PLANNER */}
      {/* ========================================================== */}
      {activeSubTab === "planner" && (
        <div className="space-y-6 animate-fadeIn" id="subtab-planner">
          <div className="text-center space-y-1">
            <h3 className="text-md font-display font-medium text-white flex items-center justify-center gap-1.5">
              🍿 AI Bollywood Movie Night Planner
            </h3>
            <p className="text-xs text-stone-400">
              Set group dynamics and available screenplay length to get perfect matches with schedules.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-stone-900/50 border border-white/5 rounded-2xl">
            {/* Group Size */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono text-stone-400 font-bold block">Party Setup</label>
              <select
                value={plannerGroup}
                onChange={(e) => setPlannerGroup(e.target.value)}
                className="w-full p-2.5 bg-stone-950 border border-stone-850 rounded-xl text-xs text-white"
              >
                <option value="Solo Screen">Solo Screen 🛋️</option>
                <option value="Date Night">Filmy Date Night 💖</option>
                <option value="Family Gathering">Family Gathering 👨‍👩‍👧</option>
                <option value="Hostel Party">Hostel Friends Group 🍕</option>
              </select>
            </div>

            {/* Time budget */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono text-stone-400 font-bold block">Length Budget</label>
              <select
                value={plannerLength}
                onChange={(e) => setPlannerLength(e.target.value)}
                className="w-full p-2.5 bg-stone-950 border border-stone-850 rounded-xl text-xs text-white"
              >
                <option value="120">Under 2 hours ⏳</option>
                <option value="150">Balanced (2-2.5 hrs) ☕</option>
                <option value="180">Full blockbusters (2.5-3 hrs) 🍿</option>
                <option value="240">Unlimited Blockbusters ♾️</option>
              </select>
            </div>

            {/* Genre Vibe */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono text-stone-400 font-bold block">Vibe Filter</label>
              <select
                value={plannerVibe}
                onChange={(e) => setPlannerVibe(e.target.value)}
                className="w-full p-2.5 bg-stone-950 border border-stone-850 rounded-xl text-xs text-white"
              >
                <option value="Comedy">Pure Laughs Comedy 😂</option>
                <option value="Romantic">Romantic Bliss ✨</option>
                <option value="Action">Edge-of-Seat Action ⚔️</option>
                <option value="Drama">Deep Family Drama 😢</option>
                <option value="Musical">Hit Soundtracks 🎵</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGeneratePlan}
            disabled={plannerLoading}
            className="w-full py-3 bg-[#E50914] hover:bg-red-700 transition text-white font-bold rounded-xl text-xs uppercase cursor-pointer block shadow-lg"
          >
            {plannerLoading ? "Compiling Screenplay Schedules..." : "Generate Cinematic Plan (+25 XP)"}
          </button>

          {planResult && (
            <div className="space-y-4 p-4 bg-stone-950/80 border border-white/5 rounded-2xl animate-scaleUp">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-[10px] text-amber-400 font-mono font-bold uppercase tracking-widest block">AI-MATCHED EVENING PLAN • COMPLETED</span>
                <span className="text-xs text-stone-500 font-mono font-bold uppercase">Ready Checklist</span>
              </div>

              {/* Matched Movie */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-mono text-stone-500 font-bold block">Suggestions for screen:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {planResult.movies.map((m: any) => (
                    <div 
                      key={m.id} 
                      onClick={() => onSelectMovie(m.title)}
                      className="bg-[#121212] border border-stone-850 p-3 rounded-xl hover:border-red-500/40 cursor-pointer transition text-xs"
                    >
                      <strong className="text-white block hover:text-red-500 transition">{m.title}</strong>
                      <span className="text-[10px] text-stone-400 font-sans block truncate">{m.tagline}</span>
                      <span className="text-[9px] text-[#E50914] font-mono mt-1 block">★ {m.rating} Rating • {m.runtime} Mins</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Schedules list */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <span className="text-[10px] uppercase font-mono text-stone-500 font-bold block">Popcorn & SCREENPLAY SCHEDULE:</span>
                <div className="space-y-2">
                  {planResult.schedule.map((sch: any, idx: number) => (
                    <div key={idx} className="flex gap-3 text-xs bg-stone-900/40 p-2 border border-stone-850 rounded-xl">
                      <span className="font-mono text-amber-400 font-bold shrink-0">{sch.time}</span>
                      <p className="text-stone-300 font-sans">{sch.activity}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
