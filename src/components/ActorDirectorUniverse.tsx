import { useState, useEffect } from "react";
import { ActorProfile, DirectorProfile } from "../types";
import { Sparkles, Calendar, TrendingUp, Award, Film, Play, UserCheck, Search, Target, ChevronRight, Activity, RefreshCw } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, BarChart, Bar, Cell, AreaChart, Area } from "recharts";

interface AiCareerAnalytics {
  actorName: string;
  hitRatio: number;
  flopRatio: number;
  verdict: string;
  criticScore: number;
  popularQuote: string;
  popularityYears: { year: number; score: number }[];
  genrePreference: { genre: string; affinity: number }[];
  successBreakdown: {
    blockbusters: number;
    hits: number;
    averages: number;
    flops: number;
  };
  narrativeAnalysis: string;
}

export default function ActorDirectorUniverse({ onRegisterXp }: { onRegisterXp: (amount: number) => void }) {
  const [actors, setActors] = useState<ActorProfile[]>([]);
  const [directors, setDirectors] = useState<DirectorProfile[]>([]);
  const [selectedActor, setSelectedActor] = useState<ActorProfile | null>(null);
  const [selectedDirector, setSelectedDirector] = useState<DirectorProfile | null>(null);
  const [currentMode, setCurrentMode] = useState<"actors" | "directors" | "ai-analytics">("actors");

  // AI Career Analytics states
  const [searchActorName, setSearchActorName] = useState("");
  const [aiAnalysis, setAiAnalysis] = useState<AiCareerAnalytics | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    fetchCoreData();
  }, []);

  const fetchCoreData = async () => {
    try {
      const aResp = await fetch("/api/actors");
      const aData = await aResp.json();
      setActors(aData);
      if (aData.length > 0) setSelectedActor(aData[0]);

      const dResp = await fetch("/api/directors");
      const dData = await dResp.json();
      setDirectors(dData);
      if (dData.length > 0) setSelectedDirector(dData[0]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRunAiAnalysis = async (customName?: string) => {
    const targetName = customName || searchActorName;
    if (!targetName.trim()) {
      setAiError("Please type an actor's name first!");
      return;
    }
    setAiError(null);
    setAnalyzing(true);
    setAiAnalysis(null);

    try {
      const response = await fetch("/api/ai/actor-analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actorName: targetName }),
      });
      const data = await response.json();
      if (data.error) {
        setAiError(data.error);
      } else {
        setAiAnalysis(data);
        onRegisterXp(30); // 30 XP earned!
      }
    } catch (err) {
      console.error(err);
      setAiError("Could not retrieve AI career analysis logs. Check key values.");
    } finally {
      setAnalyzing(false);
    }
  };

  // Build local stats for selected actor's success graph
  const successBreakdownLocal = selectedActor
    ? [
        { name: "Hits & Blockbusters", value: Math.round(selectedActor.hitRatio * 100), color: "#10b981" },
        { name: "Flops & Averages", value: Math.round((1 - selectedActor.hitRatio) * 100), color: "#f59e0b" },
      ]
    : [];

  return (
    <div className="space-y-6 text-stone-100" id="actor-director-workspace">
      {/* Tab Switcher */}
      <div className="flex border-b border-stone-850 max-w-4xl mx-auto">
        <button
          onClick={() => setCurrentMode("actors")}
          className={`flex-1 py-4 text-center font-sans font-bold text-xs md:text-sm transition uppercase tracking-wider cursor-pointer ${
            currentMode === "actors" ? "border-b-2 border-[#E50914] text-white" : "text-stone-400 hover:text-stone-100"
          }`}
        >
          Actor Universe
        </button>
        <button
          onClick={() => setCurrentMode("directors")}
          className={`flex-1 py-4 text-center font-sans font-bold text-xs md:text-sm transition uppercase tracking-wider cursor-pointer ${
            currentMode === "directors" ? "border-b-2 border-[#E50914] text-white" : "text-stone-400 hover:text-stone-100"
          }`}
        >
          Director Insights
        </button>
        <button
          onClick={() => setCurrentMode("ai-analytics")}
          className={`flex-1 py-4 text-center font-sans font-bold text-xs md:text-sm transition uppercase tracking-wider cursor-pointer ${
            currentMode === "ai-analytics" ? "border-b-2 border-[#E50914] text-white" : "text-stone-400 hover:text-stone-100"
          }`}
        >
          AI Career Analytics Hub
        </button>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* ACTORS MODE */}
        {currentMode === "actors" && selectedActor && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
            {/* Left sidebar selector and brief */}
            <div className="space-y-6">
              <div className="bg-[#181818] rounded-2xl p-5 border border-stone-800">
                <h3 className="text-xs uppercase font-sans tracking-wider text-stone-300 font-bold mb-3.5">Celebrity Registry</h3>
                <div className="space-y-2">
                  {actors.map((act) => (
                    <button
                      key={act.id}
                      onClick={() => setSelectedActor(act)}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between cursor-pointer transition duration-300 ${
                        selectedActor.id === act.id
                          ? "bg-[#E50914]/15 border-[#E50914]/40 text-white"
                          : "bg-stone-900/60 border-stone-850/80 text-stone-400 hover:text-white hover:bg-stone-800"
                      }`}
                    >
                      <span className="text-xs font-sans font-bold">{act.name}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Award Showcase Card */}
              <div className="bg-[#181818] rounded-2xl p-5 border border-stone-850">
                <div className="flex items-center gap-2 text-stone-300 uppercase font-sans font-bold text-[10px] mb-3">
                  <Award className="w-4 h-4 text-[#E50914]" />
                  Key Achievements & Honors
                </div>
                <ul className="space-y-2 text-xs">
                  {selectedActor.awards.map((awr, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-[#E50914] font-mono">•</span>
                      <span className="text-stone-300">{awr}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Center bio & trajectory details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Visual Header card */}
                <div className="md:col-span-3 bg-[#181818] rounded-3xl p-6 border border-stone-800 relative overflow-hidden shadow-xl">
                  <div className="text-xs uppercase font-mono text-stone-500 mb-1 font-bold">Actor Spotlight Profile</div>
                  <h2 className="text-3xl md:text-4xl font-sans font-black text-white select-all leading-tight tracking-tight">{selectedActor.name}</h2>
                  <div className="text-xs text-[#E50914] mt-1.5 font-mono font-bold">Born: {selectedActor.birthYear} | Active Career Spectrum</div>
                  <p className="text-xs text-stone-300 mt-3 leading-relaxed font-sans">{selectedActor.bio}</p>
                </div>

                {/* Growth Trend chart */}
                <div className="md:col-span-3 bg-cinema-dark/40 border border-white/5 rounded-2xl p-5">
                  <div className="text-xs uppercase font-mono text-gray-400 mb-4 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-gold-400" />
                    Historical Popularity Growth (1975 - 2026)
                  </div>
                  <div className="h-48 text-xs font-mono">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={selectedActor.growthTrends} margin={{ left: -25, right: 10, top: 10, bottom: 0 }}>
                        <defs>
                          <linearGradient id="popColor" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#d4aa3b" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#d4aa3b" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="year" stroke="#4b5563" />
                        <YAxis stroke="#4b5563" />
                        <Tooltip contentStyle={{ backgroundColor: "#0f0f0f", border: "1px solid rgba(218, 191, 96, 0.2)" }} />
                        <Area type="monotone" dataKey="score" stroke="#d4aa3b" fillOpacity={1} fill="url(#popColor)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Numeric quick stats */}
                <div className="glass-panel bg-[#141414] rounded-xl p-4 border border-white/5 text-center">
                  <div className="text-[10px] uppercase font-mono text-gray-500">Hit Rate Ratio</div>
                  <div className="text-xl font-mono font-bold text-emerald-400 mt-1">
                    {Math.round(selectedActor.hitRatio * 100)}%
                  </div>
                  <div className="text-[9px] text-gray-500 mt-1 font-mono">Commercial viability coefficient</div>
                </div>

                <div className="glass-panel bg-[#141414] rounded-xl p-4 border border-white/5 text-center">
                  <div className="text-[10px] uppercase font-mono text-gray-500">Global Box Office Share</div>
                  <div className="text-xl font-mono font-bold text-gold-300 mt-1">
                    ~{selectedActor.lifetimeCollection} Cr
                  </div>
                  <div className="text-[9px] text-gray-500 mt-1 font-mono">Lifetime Gross aggregate</div>
                </div>

                <div className="glass-panel bg-[#141414] rounded-xl p-4 border border-white/5 text-center">
                  <div className="text-[10px] uppercase font-mono text-gray-500">Preferred Genre Axis</div>
                  <div className="text-xs font-display font-medium text-white mt-2 truncate max-w-full">
                    {selectedActor.genrePreference.slice(0, 2).join(" & ")}
                  </div>
                  <div className="text-[9px] text-gray-500 mt-1.5 font-mono">Career Affinity Match</div>
                </div>

                {/* Substantive Biography Journeys */}
                <div className="md:col-span-3 bg-cinema-dark/30 border border-white/5 rounded-2xl p-5 space-y-2">
                  <h4 className="text-xs text-gold-400 font-display font-semibold uppercase tracking-wider">Historical Career Journey</h4>
                  <p className="text-xs text-gray-300 leading-relaxed font-sans">{selectedActor.careerJourney}</p>
                </div>

                {/* Filmography registry map */}
                <div className="md:col-span-3 bg-cinema-dark/30 border border-white/5 rounded-2xl p-5">
                  <h4 className="text-xs text-gold-400 font-display font-bold uppercase tracking-wider mb-3">Top Movie Milestones</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedActor.topMovies.map((mv, index) => (
                      <span key={index} className="bg-cinema-dark border border-gold-500/10 text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 font-mono text-gray-300">
                        <Film className="w-3.5 h-3.5 text-gold-400" />
                        {mv}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Heatmap Activity Calendar */}
                <div className="md:col-span-3 bg-cinema-dark/40 border border-white/5 rounded-2xl p-5">
                  <div className="text-xs uppercase font-mono text-gray-400 mb-3 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-gold-400" />
                    Cinematic Activity & Media Noise Heatmap (Recent Months)
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto p-1 text-xs">
                    {selectedActor.heatmapData.map((h, i) => {
                      let color = "bg-gray-900";
                      if (h.activity > 80) color = "bg-gold-500 text-cinema-dark";
                      else if (h.activity > 60) color = "bg-gold-600/80 text-white";
                      else if (h.activity > 40) color = "bg-gold-800/60 text-gray-300";
                      else if (h.activity > 20) color = "bg-gold-900/40 text-gray-400";
                      
                      return (
                        <div key={i} className={`flex-1 min-w-[70px] aspect-square rounded-xl flex flex-col justify-between p-2 uppercase font-mono text-[10px] border border-white/5 ${color}`}>
                          <span>{h.month}</span>
                          <span className="text-right font-bold">{h.activity}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* DIRECTORS MODE */}
        {currentMode === "directors" && selectedDirector && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
            {/* Left sidebar selector */}
            <div className="space-y-6">
              <div className="glass-panel rounded-2xl p-5 border border-gold-500/10 animate-slideUp">
                <h3 className="text-sm uppercase font-mono tracking-wider text-gold-400 mb-3">Director Registry</h3>
                <div className="space-y-2">
                  {directors.map((dir) => (
                    <button
                      key={dir.id}
                      onClick={() => setSelectedDirector(dir)}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between cursor-pointer transition ${
                        selectedDirector.id === dir.id
                          ? "bg-gold-500/15 border-gold-500/40 text-gold-300 shadow-md"
                          : "bg-cinema-dark/40 border-white/5 text-gray-400 hover:text-white"
                      }`}
                    >
                      <span className="text-xs font-display font-medium">{dir.name}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Center director cards details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-panel rounded-2xl p-6 border border-gold-500/15 light-sweep">
                <div className="text-xs uppercase font-mono text-gray-500 mb-1">Director Insight Spotlight</div>
                <h2 className="text-3xl font-display font-semibold text-white">{selectedDirector.name}</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedDirector.genrePreference.map((g, idx) => (
                    <span key={idx} className="bg-gold-500/10 border border-gold-400/20 text-gold-300 text-[10px] px-2.5 py-0.5 rounded-full font-mono">
                      {g}
                    </span>
                  ))}
                  <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] px-2.5 py-0.5 rounded-full font-mono">
                    Success Rate: {selectedDirector.successRate}%
                  </span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed font-sans mt-4">{selectedDirector.bio}</p>
              </div>

              {/* Biography journey detail */}
              <div className="bg-cinema-dark/40 border border-white/5 rounded-2xl p-6 space-y-2">
                <h4 className="text-xs text-gold-400 font-display font-bold uppercase tracking-wider">Cinematic Journey & Stylings</h4>
                <p className="text-xs text-gray-300 leading-relaxed font-sans">{selectedDirector.journey}</p>
              </div>

              {/* Milestones film logs list */}
              <div className="bg-cinema-dark/40 border border-white/5 rounded-2xl p-6">
                <h4 className="text-xs text-gold-400 font-display font-bold uppercase tracking-wider mb-3">Distinguished Catalog Hits</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedDirector.famousMovies.map((mv, idx) => (
                    <div key={idx} className="bg-cinema-dark/60 border border-white/10 p-3.5 rounded-xl flex items-center gap-3 text-xs text-gray-300">
                      <div className="w-7 h-7 bg-gold-500/10 border border-gold-400/30 text-gold-400 rounded-full flex items-center justify-center font-mono font-bold text-[10px]">
                        {idx + 1}
                      </div>
                      <span className="font-medium text-white">{mv}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI CAREER ANALYTICS MODE */}
        {currentMode === "ai-analytics" && (
          <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
            {/* Search query box */}
            <div className="glass-panel rounded-2xl p-6 border border-gold-500/20 shadow-lg text-center space-y-4">
              <div className="max-w-md mx-auto space-y-1.5">
                <h3 className="text-xl font-display font-semibold text-white">AI Comprehensive Career Analyst</h3>
                <p className="text-xs text-gray-400">
                  Generate instant structured charts, success splits, verdict evaluations, and popularity trends on any Bollywood celebrity.
                </p>
              </div>

              <div className="flex gap-2 max-w-lg mx-auto">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Enter actor name (e.g. Hrithik Roshan, Alia Bhatt, Ranbir Kapoor...)"
                    value={searchActorName}
                    onChange={(e) => setSearchActorName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleRunAiAnalysis()}
                    className="w-full bg-[#121212] border border-white/15 outline-none rounded-xl py-3 pl-10 pr-4 text-xs font-sans text-white focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30"
                  />
                </div>
                <button
                  onClick={() => handleRunAiAnalysis()}
                  disabled={analyzing}
                  className="px-5 py-3.5 bg-gold-600 hover:bg-gold-500 text-cinema-dark font-display font-semibold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  {analyzing ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-cinema-dark" />
                  )}
                  Run AI Audit
                </button>
              </div>

              {/* Suggested shortcuts */}
              <div className="flex flex-wrap justify-center items-center gap-2 text-xs text-gray-500 pt-1">
                <span>Try benchmarks:</span>
                {["Alia Bhatt", "Hrithik Roshan", "Priyanka Chopra"].map((cName) => (
                  <button
                    key={cName}
                    onClick={() => {
                      setSearchActorName(cName);
                      handleRunAiAnalysis(cName);
                    }}
                    className="bg-[#151515] hover:bg-gold-500/10 text-gold-400 text-[10px] font-mono border border-gold-500/10 px-2 py-0.5 rounded cursor-pointer transition"
                  >
                    {cName}
                  </button>
                ))}
              </div>
            </div>

            {aiError && <div className="text-red-400 text-xs bg-red-950/40 p-4 border border-red-500/30 rounded-xl max-w-lg mx-auto">{aiError}</div>}

            {/* Generated Reports */}
            {aiAnalysis ? (
              <div className="glass-panel p-6 lg:p-8 rounded-2xl border border-gold-500/25 space-y-8 animate-slideUp">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
                  <div>
                    <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                      <Target className="w-3.5 h-3.5 text-emerald-400" />
                      Analytic Dossier Generated
                    </div>
                    <h2 className="text-3xl font-display font-bold text-white mt-1">{aiAnalysis.actorName}</h2>
                    <div className="text-xs text-gray-500 font-mono mt-1 italic">"{aiAnalysis.popularQuote}"</div>
                  </div>
                  <div className="bg-gold-500/10 border border-gold-400/30 text-gold-400 font-display font-semibold px-4 py-2 rounded-xl text-xs uppercase tracking-wide">
                    Verdict: <strong className="text-white font-mono">{aiAnalysis.verdict}</strong>
                  </div>
                </div>

                {/* Substantive analytical graphs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Popularity timeline line chart */}
                  <div className="bg-cinema-dark/50 border border-white/5 rounded-2xl p-5">
                    <h4 className="text-xs uppercase font-display font-semibold text-gold-400 mb-4">Historical Popularity Coefficient</h4>
                    <div className="h-44 text-xs font-mono">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={aiAnalysis.popularityYears} margin={{ left: -25, right: 10, top: 10, bottom: 0 }}>
                          <XAxis dataKey="year" stroke="#4b5563" />
                          <YAxis stroke="#4b5563" />
                          <Tooltip contentStyle={{ backgroundColor: "#0f0f0f", border: "1px solid rgba(218, 191, 96, 0.2)" }} />
                          <Line type="monotone" dataKey="score" stroke="#d4aa3b" strokeWidth={3} dot={{ fill: "#ca982e", r: 4 }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Genre preference bar charts */}
                  <div className="bg-cinema-dark/50 border border-white/5 rounded-2xl p-5">
                    <h4 className="text-xs uppercase font-display font-semibold text-gold-400 mb-4">Genre Affinity Mapping</h4>
                    <div className="h-44 text-xs font-mono">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={aiAnalysis.genrePreference} layout="vertical" margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
                          <XAxis type="number" stroke="#4b5563" />
                          <YAxis dataKey="genre" type="category" stroke="#4b5563" />
                          <Tooltip contentStyle={{ backgroundColor: "#0f0f0f", border: "1px solid rgba(218, 191, 96, 0.2)" }} />
                          <Bar dataKey="affinity" fill="#aa7422" radius={[0, 4, 4, 0]}>
                            {aiAnalysis.genrePreference.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={index === 1 ? "#d4aa3b" : "#aa7422"} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Score breakdown metrics cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-cinema-dark/60 border border-white/5 rounded-xl p-4">
                    <div className="text-[10px] uppercase font-mono text-gray-500">Hit Quotient Ratio</div>
                    <div className="text-xl font-mono font-bold text-emerald-400 mt-1">{aiAnalysis.hitRatio}%</div>
                  </div>
                  <div className="bg-cinema-dark/60 border border-white/5 rounded-xl p-4">
                    <div className="text-[10px] uppercase font-mono text-gray-500">Flop Probability Margin</div>
                    <div className="text-xl font-mono font-bold text-red-400 mt-1">{aiAnalysis.flopRatio}%</div>
                  </div>
                  <div className="bg-cinema-dark/60 border border-white/5 rounded-xl p-4">
                    <div className="text-[10px] uppercase font-mono text-gray-500">Critics Audit Score</div>
                    <div className="text-xl font-mono font-bold text-gold-400 mt-1">{aiAnalysis.criticScore} / 100</div>
                  </div>
                  <div className="bg-cinema-dark/60 border border-white/5 rounded-xl p-4">
                    <div className="text-[10px] uppercase font-mono text-gray-500">Lifetime Hits Catalog</div>
                    <div className="text-xl font-mono font-bold text-white mt-1">
                      {aiAnalysis.successBreakdown.blockbusters + aiAnalysis.successBreakdown.hits} Films
                    </div>
                  </div>
                </div>

                {/* Narrative text audit */}
                <div className="bg-cinema-dark/40 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                  <h4 className="text-xs uppercase font-mono text-gold-400 font-semibold mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-gold-400" />
                    AI Core Career Assessment
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed font-sans first-letter:text-3xl first-letter:font-bold first-letter:text-gold-400 first-letter:mr-1">
                    {aiAnalysis.narrativeAnalysis}
                  </p>
                </div>
              </div>
            ) : (
              !analyzing && (
                <div className="text-center py-12 border border-white/5 rounded-2xl bg-cinema-dark/30">
                  <Target className="w-12 h-12 text-gold-500/20 mx-auto animate-pulse" />
                  <p className="text-xs text-gray-500 max-w-sm mx-auto mt-2 leading-relaxed">
                    Select any search query or click suggested celebrity names above to load real-time AI career evaluations.
                  </p>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
