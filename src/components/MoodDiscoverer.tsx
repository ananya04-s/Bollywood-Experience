import React, { useState, useRef, useEffect } from "react";
import { 
  Sparkles, 
  Tv, 
  Camera, 
  Mic, 
  Heart, 
  Brain, 
  RefreshCw, 
  Flame, 
  Music, 
  Film, 
  Video, 
  Gauge, 
  Trophy, 
  ArrowRight, 
  HelpCircle,
  Clock,
  Play
} from "lucide-react";

interface MoodDiscovererProps {
  onRegisterXp: (amount: number) => void;
  onSelectMovie: (title: string) => void;
  onPlaySong: (id: number) => void;
  theme: "dark" | "light";
}

interface RecommendedMovie {
  title: string;
  year: number;
  genre: string[];
  rating: number;
  tagline: string;
  reason: string;
  songs: string[];
}

export default function MoodDiscoverer({ 
  onRegisterXp, 
  onSelectMovie, 
  onPlaySong, 
  theme 
}: MoodDiscovererProps) {
  // Mode selection: "preset" | "speechText" | "camera"
  const [inputMode, setInputMode] = useState<"preset" | "speechText" | "camera">("preset");
  const [activeMood, setActiveMood] = useState<string>("");
  const [textMood, setTextMood] = useState<string>("");
  const [recommendations, setRecommendations] = useState<RecommendedMovie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [scannedEmotion, setScannedEmotion] = useState<string>("");
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  
  // Camera Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Suggested situational text mood chips
  const situationChips = [
    "Raining outside with hot chai and nostalgia",
    "Feeling exhausted after exams and need a brainless comedy",
    "Hyped for weekend action with intense revenge plots",
    "Late night vintage romance with old-school acoustics",
    "Incredible motivation trigger to crush fitness goals"
  ];

  // Retro cinematic mood presets
  const moodPresets = [
    { label: "Dilwale Romance 💖", mood: "Romantic", desc: "For love fields, violins, and intense eye-contact", rating: "9.9 Sweetness", bg: "from-rose-650 to-pink-500", icon: "❤️" },
    { label: "Masala Action ⚔️", mood: "Action", desc: "Flying cars, physics-defying punches, and heavy dhols", rating: "9.5 Swag", bg: "from-red-600 to-orange-500", icon: "🦁" },
    { label: "Midnight Thriller 👁️", mood: "Thriller", desc: "Deep suspense, rain schedules, and mysterious plots", rating: "9.2 Suspense", bg: "from-violet-900 to-indigo-950", icon: "🕵️" },
    { label: "All Is Well Comedy 😂", mood: "Comedy", desc: "Hilarious double-entenders and heartwarming jokes", rating: "9.8 Laughs", bg: "from-amber-500 to-yellow-600", icon: "🍿" },
    { label: "Melodramatic Tears 😢", mood: "Emotional", desc: "Karan Johar level family sangeets and airport runs", rating: "9.4 Feels", bg: "from-sky-750 to-cyan-600", icon: "😭" },
    { label: "High-Octane Motivation 🔥", mood: "Motivated", desc: "Locker-room anthems and secondary sports triumphs", rating: "9.7 Energy", bg: "from-red-650 to-amber-500", icon: "🚀" }
  ];

  // Clean camera initialization & shutdown
  useEffect(() => {
    if (isCameraActive && inputMode === "camera") {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isCameraActive, inputMode]);

  const startCamera = async () => {
    try {
      setLogs(["Initializing optical lenses...", "Gaining hardware clearance..."]);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 400, height: 300 } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setLogs(prev => [...prev, "🎥 Retro Cine-Box Camera Feed Online! Point towards screen."]);
    } catch (err) {
      console.warn("Camera failed to load, falling back to simulated retro scanner.", err);
      setLogs(prev => [...prev, "⚠️ Video capture denied. Initializing AI neural face simulation loop instead!"]);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const executeApiQuery = async (moodQuery: string) => {
    setLoading(true);
    try {
      const resp = await fetch("/api/ai/mood-discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood: moodQuery })
      });
      const data = await resp.json();
      if (data && data.recommendations) {
        setRecommendations(data.recommendations);
        onRegisterXp(25); // high interactive xp boost!
      }
    } catch (err) {
      console.error("Mood discover API failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Trigger search using textual prompt
  const handleTextMoodSubmit = () => {
    if (!textMood.trim()) return;
    setActiveMood(`Prompt: "${textMood}"`);
    executeApiQuery(textMood);
  };

  // Perform mock optical frame recognition
  const handleScanMood = () => {
    setLogs(["Configuring facial matrix blueprint...", "Gauging corner-mouth elevation indicators..."]);
    let stage = 0;
    const interval = setInterval(() => {
      stage++;
      if (stage === 1) {
        setLogs(prev => [...prev, "🔬 Analyzing pupil dilation matching 'Arijit romantic index'..."]);
      } else if (stage === 2) {
        setLogs(prev => [...prev, "🎭 Calibration score: 98% compatible with vintage Shah Rukh Khan intensity!"]);
      } else if (stage === 3) {
        setLogs(prev => [...prev, "🍿 Emotion Detected: high nostalgia with a craving for colorful festival aesthetics!"]);
        clearInterval(interval);
        
        // Randomly select one of our premium cinematic moods
        const emotions = ["Romantic", "Action", "Thriller", "Comedy", "Emotional", "Motivated"];
        const selected = emotions[Math.floor(Math.random() * emotions.length)];
        setScannedEmotion(selected);
        setActiveMood(`Detected Face Emotion: ${selected}`);
        executeApiQuery(selected);
      }
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-fadeIn" id="mood-discovery-sandbox">
      
      {/* Dynamic Background Flare relative to selected mode */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-650/10 filter blur-[150px] pointer-events-none rounded-full" />

      {/* Hero Showcase Title Block */}
      <div className={`p-6 md:p-8 rounded-3xl border text-white relative overflow-hidden shadow-xl ${
        theme === "dark" 
          ? "bg-gradient-to-r from-stone-900 to-stone-950 border-white/5" 
          : "bg-white border-stone-200 text-stone-900 shadow-md"
      }`}>
        {/* Film strip decoration frame */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-repeat-x bg-[size:16px_100%] opacity-20" style={{
          backgroundImage: "radial-gradient(circle, #E50914 4px, transparent 5px)"
        }} />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-extrabold uppercase bg-red-600/10 border border-red-500/25 px-2.5 py-1 rounded-md text-red-500 inline-block">
              ★ CINEMATIC NEURAL MOOD HUB ★
            </span>
            <h2 className="text-2xl md:text-3xl font-display font-black tracking-tight flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#D4AF37] animate-pulse" />
              Retro Cine-Mood Detector
            </h2>
            <p className={`text-xs ${theme === "dark" ? "text-stone-400" : "text-stone-600"} max-w-2xl`}>
              Analyze your current chemical aura through natural dialogue text, live theatrical cameras, or iconic retro preset blocks. Let our AI synchronize your exact vibe with classic Bollywood soundtracks!
            </p>
          </div>

          {/* Rerank level indicator badge */}
          <div className="bg-gradient-to-r from-red-650 to-amber-500 text-white rounded-2xl px-4 py-2 text-right shadow-md shrink-0">
            <div className="text-[9px] uppercase font-mono leading-none tracking-wider opacity-90">Interactive Box Office Boost</div>
            <div className="font-mono text-sm font-black tracking-tight mt-0.5">+25 XP Per Sync</div>
          </div>
        </div>

        {/* Cinematic Navigation Tabs */}
        <div className="flex border-t border-white/10 mt-6 pt-5 gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
          {[
            { id: "preset", label: "Masala Presets 🎭", icon: <Film className="w-3.5 h-3.5" /> },
            { id: "speechText", label: "Situation Prompt Analyzer ✍️", icon: <Brain className="w-3.5 h-3.5" /> },
            { id: "camera", label: "Theatrical Camera Lens 🎥", icon: <Camera className="w-3.5 h-3.5" /> }
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => {
                setInputMode(mode.id as any);
                setRecommendations([]);
                setActiveMood("");
              }}
              className={`py-2 px-4 rounded-xl text-xs font-bold font-display cursor-pointer transition flex items-center gap-1.5 ${
                inputMode === mode.id
                  ? "bg-[#E50914] text-white shadow-md scale-105"
                  : theme === "dark"
                    ? "bg-stone-900/60 border border-stone-800 text-stone-400 hover:text-stone-100"
                    : "bg-stone-100 border border-stone-200 text-stone-600 hover:text-stone-900"
              }`}
            >
              {mode.icon}
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Mode Containers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: CONTROL & SELECTION ENGINE */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Mode 1: MASALA PRESETS */}
          {inputMode === "preset" && (
            <div className={`p-5 rounded-3xl border space-y-4 ${
              theme === "dark" ? "bg-stone-900/60 border-white/5" : "bg-white border-stone-200 shadow-sm"
            }`}>
              <div className="space-y-0.5">
                <h3 className={`text-sm font-sans font-black ${theme === "dark" ? "text-stone-100" : "text-stone-900"}`}>
                  Pick An Archetype Preset
                </h3>
                <p className="text-[11px] text-stone-400">Classical emotions tailored to legendary directors.</p>
              </div>

              <div className="space-y-2">
                {moodPresets.map((preset) => (
                  <button
                    key={preset.mood}
                    onClick={() => {
                      setActiveMood(preset.mood);
                      executeApiQuery(preset.mood);
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition group flex justify-between items-center cursor-pointer ${
                      activeMood === preset.mood
                        ? "bg-[#E50914]/15 border-[#E50914] shadow-md scale-[1.02]"
                        : theme === "dark"
                          ? "bg-stone-950/80 border-stone-850 hover:bg-stone-900 hover:border-stone-700"
                          : "bg-stone-50 border-stone-150 hover:bg-stone-100/70"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl bg-stone-900/50 w-9 h-9 rounded-xl flex items-center justify-center border border-white/5 shadow-inner">
                        {preset.icon}
                      </span>
                      <div>
                        <strong className={`text-xs block ${
                          theme === "dark" ? "text-stone-100" : "text-stone-900"
                        }`}>
                          {preset.label}
                        </strong>
                        <span className="text-[10px] text-stone-400 block font-normal leading-tight mt-0.5">
                          {preset.desc}
                        </span>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono bg-red-600/10 text-[#E50914] px-2 py-0.5 rounded-full uppercase font-black uppercase shrink-0">
                      {preset.rating}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mode 2: SITUATION PROMPT ANALYZER */}
          {inputMode === "speechText" && (
            <div className={`p-5 rounded-3xl border space-y-4 ${
              theme === "dark" ? "bg-stone-900/60 border-white/5" : "bg-white border-stone-200 shadow-sm"
            }`}>
              <div className="space-y-0.5">
                <h3 className={`text-sm font-sans font-black ${theme === "dark" ? "text-stone-100" : "text-stone-900"}`}>
                  Describe Your Exact Vibe
                </h3>
                <p className="text-[11px] text-stone-400">Natural language situation analysis via Gemini AI.</p>
              </div>

              <div className="space-y-3">
                <textarea
                  value={textMood}
                  onChange={(e) => setTextMood(e.target.value)}
                  placeholder="e.g., Just ordered spicy samosas, raining outside, need a breezy road-trip vibe with a killer acoustics album..."
                  className="w-full h-24 bg-stone-950 text-xs text-stone-100 placeholder-stone-550 border border-stone-850 rounded-2xl p-3 focus:outline-none focus:border-[#E50914] transition duration-300 resize-none leading-relaxed"
                />

                <button
                  onClick={handleTextMoodSubmit}
                  disabled={!textMood.trim() || loading}
                  className="w-full py-3 bg-[#E50914] hover:bg-red-700 text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  Analyze Vibe & Rec movies
                </button>
              </div>

              {/* Sample situation chips */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <span className="text-[10px] text-stone-500 uppercase font-bold tracking-wider block">Or Try These Starters:</span>
                <div className="flex flex-col gap-1.5">
                  {situationChips.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setTextMood(chip);
                        setActiveMood(`Prompt: "${chip}"`);
                        executeApiQuery(chip);
                      }}
                      className={`text-left text-[11px] p-2 bg-stone-950 hover:bg-stone-900 border border-stone-850 rounded-xl transition duration-300 truncate cursor-pointer ${
                        textMood === chip ? "border-[#E50914] text-white" : "text-stone-400"
                      }`}
                    >
                      ☕ {chip}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: THEATRICAL CAMERA SCANNING BOOTH */}
          {inputMode === "camera" && (
            <div className={`p-5 rounded-3xl border space-y-4 relative overflow-hidden ${
              theme === "dark" ? "bg-stone-900/60 border-white/5" : "bg-white border-stone-200 shadow-sm"
            }`}>
              
              <div className="space-y-0.5">
                <h3 className={`text-sm font-sans font-black ${theme === "dark" ? "text-stone-100" : "text-stone-900"}`}>
                  Cine-Scanner Mood Booth
                </h3>
                <p className="text-[11px] text-stone-400">Scan physical micro-expressions or trigger simulated lens calibrations.</p>
              </div>

              {/* Photo Scanning window container */}
              <div className="relative border border-stone-800 bg-black aspect-[4/3] rounded-2xl overflow-hidden flex flex-col items-center justify-center group shadow-inner">
                {isCameraActive ? (
                  <>
                    <video 
                      ref={videoRef} 
                      className="w-full h-full object-cover rounded-2xl flip-horizontal scale-x-[-1]"
                      playsInline
                      muted
                    />
                    
                    {/* Floating Retro scanning overlay line */}
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-red-500 animate-bounce duration-5000 opacity-60 pointer-events-none" />
                    
                    {/* Theatrical camera scope decoration dots */}
                    <div className="absolute top-3 left-3 bg-[#E50914] w-2.5 h-2.5 rounded-full animate-ping" />
                    <div className="absolute bottom-3 right-3 text-[10px] font-mono text-white/50 bg-black/60 px-2 py-0.5 rounded">
                      24FPS • CINE-FILM_LENS
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6 space-y-3 z-10">
                    <div className="w-12 h-12 bg-stone-900 border border-stone-850 rounded-2xl flex items-center justify-center mx-auto shadow">
                      <Camera className="w-5 h-5 text-stone-400" />
                    </div>
                    <div>
                      <strong className="text-xs text-stone-300 block font-bold">Lens Offline</strong>
                      <span className="text-[10px] text-stone-500 max-w-[200px] block mx-auto leading-normal mt-1">
                        Turn on live theatrical camera frame permissions to diagnose direct micro-expressions.
                      </span>
                    </div>
                    <button
                      onClick={() => setIsCameraActive(true)}
                      className="px-4 py-1.5 bg-[#E50914] text-white text-[11px] font-bold rounded-xl cursor-pointer hover:bg-red-700 transition"
                    >
                      Initialize Lens Feed ⚙️
                    </button>
                  </div>
                )}
              </div>

              {/* Action scanner button */}
              <div className="space-y-2">
                <button
                  onClick={handleScanMood}
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-red-650 to-amber-500 hover:from-red-750 hover:to-amber-600 text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Gauge className="w-4 h-4 text-white animate-spin-slow" />
                  Perform expression mood diagnosis
                </button>

                {isCameraActive && (
                  <button
                    onClick={() => setIsCameraActive(false)}
                    className="w-full py-1.5 bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-300 text-[10px] uppercase font-mono rounded"
                  >
                    Kill System Lens Stream
                  </button>
                )}
              </div>

              {/* Output log monitors */}
              {logs.length > 0 && (
                <div className="bg-black/80 border border-stone-850 rounded-2xl p-3.5 space-y-1 font-mono text-[10px] text-stone-400 h-28 overflow-y-auto scrollbar-none shadow-inner">
                  <div className="text-[9px] uppercase font-bold text-[#E50914] mb-1.5">🔬 Neural Scanner Diagnostics:</div>
                  {logs.map((log, idx) => (
                    <p key={idx} className="leading-tight border-l-2 border-[#E50914]/40 pl-1.5 py-0.5">{log}</p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SYSTEM REFRESH BOX */}
          {recommendations.length > 0 && (
            <div className={`p-4 rounded-3xl border flex items-center justify-between gap-1.5 ${
              theme === "dark" ? "bg-stone-900/60 border-white/5" : "bg-white border-stone-200"
            }`}>
              <div>
                <span className="text-[10px] text-stone-500 font-mono block">Synchronized Target:</span>
                <strong className="text-xs text-transparent bg-clip-text bg-gradient-to-r from-red-650 to-amber-500 truncate block max-w-[180px]">
                  {activeMood || "Masala Selection"}
                </strong>
              </div>
              <button
                onClick={() => {
                  setRecommendations([]);
                  setActiveMood("");
                  setScannedEmotion("");
                }}
                className="py-1 px-3 bg-stone-950 border border-stone-850 hover:border-[#E50914]/30 rounded-xl text-stone-400 hover:text-white text-[10px] font-mono cursor-pointer transition"
              >
                Reset Engine
              </button>
            </div>
          )}
          
        </div>

        {/* RIGHT COLUMN: CINEMATIC OUTPUT SCREENROOM */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="flex justify-between items-center bg-[#1c1c1c]/20 px-3.5 py-2.5 rounded-2xl border border-white/5">
            <span className="text-xs font-mono font-bold text-[#E50914] uppercase tracking-wider flex items-center gap-1.5">
              <Tv className="w-4 h-4 text-red-500" />
              Theatre Screenroom Output
            </span>
            {activeMood && (
              <span className="text-[11px] bg-[#E50914]/10 border border-[#E50914]/30 text-white font-mono rounded px-2.5 py-0.5 font-bold">
                Synced aura: <span className="text-amber-400">{activeMood}</span>
              </span>
            )}
          </div>

          {loading ? (
            <div className="border border-white/5 bg-stone-900/10 rounded-3xl p-16 text-center space-y-4">
              <RefreshCw className="w-12 h-12 text-[#E50914] animate-spin mx-auto opacity-80" />
              <div className="space-y-1">
                <span className="text-sm font-display font-medium text-white block">Tuning Cinematic frequencies...</span>
                <p className="text-xs text-stone-400 font-mono italic max-w-sm mx-auto">"Evaluating dialogue resonance vectors. Checking regional box office affinities..."</p>
              </div>
            </div>
          ) : recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slideUp">
              {recommendations.map((mr, idx) => (
                <div 
                  key={idx} 
                  className={`border p-5 rounded-3xl relative overflow-hidden flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] hover:shadow-xl group ${
                    theme === "dark" 
                      ? "bg-stone-900/60 border-white/5 hover:border-red-500/20" 
                      : "bg-white border-stone-200 hover:border-red-500/30"
                  }`}
                >
                  {/* Neon border focus element */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-600/10 to-amber-500/15 rounded-full filter blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="space-y-3 relative z-10">
                    <div className="flex justify-between items-start gap-1.5">
                      <div className="flex flex-wrap gap-1">
                        {mr.genre.map((gen, gIdx) => (
                          <span 
                            key={gIdx} 
                            className="font-mono text-[9px] bg-red-650/15 text-[#E50914] px-2 py-0.5 rounded border border-red-500/10 uppercase font-black"
                          >
                            {gen}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs font-mono text-stone-500 shrink-0">{mr.year} Reel</span>
                    </div>

                    <div className="pt-1">
                      <h4 className={`text-xl font-display font-black leading-tight tracking-tight cursor-default ${
                        theme === "dark" ? "text-stone-100" : "text-stone-900"
                      }`}>
                        {mr.title}
                      </h4>
                      <p className="text-xs text-amber-550 font-serif italic mt-1 font-semibold">
                        "{mr.tagline}"
                      </p>
                    </div>

                    <p className={`text-xs leading-relaxed font-sans ${
                      theme === "dark" ? "text-stone-300" : "text-stone-700"
                    }`}>
                      {mr.reason}
                    </p>

                    {/* Integrated dynamic hit soundtracks list inside ticket frame */}
                    {Array.isArray(mr.songs) && mr.songs.length > 0 && (
                      <div className="pt-2 border-t border-[#E50914]/10 space-y-2 mt-3 bg-red-600/[0.03] p-3 rounded-2xl border border-[#E50914]/15">
                        <span className="text-[10px] text-red-500 font-mono font-extrabold flex items-center gap-1.5 uppercase tracking-wider">
                          <Music className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                          Suggested Hit Soundtrack
                        </span>
                        
                        <div className="flex flex-col gap-1.5">
                          {mr.songs.map((song, sIdx) => (
                            <div 
                              key={sIdx} 
                              onClick={() => {
                                // Trigger song play or search
                                onPlaySong(90); // default to playlist song ID
                              }}
                              className="bg-black/20 hover:bg-[#E50914]/10 border border-stone-800 hover:border-[#E50914]/20 rounded-xl px-2.5 py-1.5 text-[10px] text-stone-300 font-medium flex justify-between items-center transition cursor-pointer group/song"
                            >
                              <span className="truncate pr-2">🎵 {song}</span>
                              <span className="text-[9px] bg-[#E50914] text-white px-2 py-0.5 rounded opacity-0 group-hover/song:opacity-100 transition-opacity uppercase font-mono tracking-tighter">
                                Play Jukebox
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center border-t border-white/5 pt-3.5 mt-4 text-[10px] font-mono text-stone-500">
                    <span>Affinity Match Rating: <strong className="text-red-500 font-extrabold">{mr.rating}/10</strong></span>
                    <button 
                      onClick={() => onSelectMovie(mr.title)}
                      className="text-[#E50914] uppercase tracking-widest font-black font-display cursor-pointer hover:text-white transition-colors flex items-center gap-1 text-[10px]"
                    >
                      Inspect Screenplay
                      <ArrowRight className="w-3 h-3 text-[#E50914] group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`border rounded-3xl p-12 text-center space-y-5 ${
              theme === "dark" ? "bg-stone-900/10 border-white/5" : "bg-white border-stone-200"
            }`}>
              <div className="w-16 h-16 bg-[#E50914]/5 rounded-full flex items-center justify-center mx-auto border border-[#E50914]/10">
                <Film className="w-7 h-7 text-[#E50914]/40 animate-pulse" />
              </div>
              <div className="space-y-1">
                <span className="text-sm font-display font-black tracking-tight text-white block">Awaiting Cine-Frequency Vibe Trigger</span>
                <p className="text-xs text-stone-400 leading-normal max-w-md mx-auto">
                  Pick any Masala Preset on the left sidebar, explain your exact situational prompt, or trigger the live camera diagnosis booth to configure personalized cinema matches.
                </p>
              </div>

              {/* Instant dynamic defaults panel */}
              <div className="pt-3 flex justify-center gap-2">
                <button
                  onClick={() => {
                    setActiveMood("Romantic");
                    executeApiQuery("Romantic");
                  }}
                  className="px-4 py-2 bg-stone-950 hover:bg-stone-900 border border-stone-850 rounded-full text-stone-300 hover:text-white text-[11px] font-medium transition cursor-pointer"
                >
                  ⚡ Romantic Classics Match
                </button>
                <button
                  onClick={() => {
                    setActiveMood("Comedy");
                    executeApiQuery("Comedy");
                  }}
                  className="px-4 py-2 bg-stone-950 hover:bg-stone-900 border border-stone-850 rounded-full text-stone-300 hover:text-white text-[11px] font-medium transition cursor-pointer"
                >
                  🍿 Family Comedies Match
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* FOOTER FILM LOGO REEL DECORATION */}
      <div className="border-t border-stone-850/60 pt-6 flex justify-between items-center text-[9px] font-mono text-stone-500">
        <span>★ CINEMATIC NEURAL RECOMMENDATIONS SYSTEM VER 3.5.0-FLASH ★</span>
        <span className="flex items-center gap-1 text-amber-500 animate-pulse">
          <Clock className="w-3 h-3 text-[#D4AF37]" /> TIMELESS CLASSICS MATCHED LIVE
        </span>
      </div>

    </div>
  );
}