import { useState, useEffect } from "react";
import { TrendingUp, Award, DollarSign, PieChart as PieIcon, BarChart2, Calendar, ZoomIn, RefreshCw, Layers } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Cell, AreaChart, Area, PieChart, Pie } from "recharts";

interface BoxOfficeData {
  topGrossing: { title: string; collection: number; year: number; budget: number }[];
  yearWiseRevenue: { year: number; revenue: number }[];
  genreRevenueShare: { genre: string; percentage: number; icon: string }[];
  actorShareRanking: { actor: string; share: number; movies: number; label: string }[];
}

export default function BoxOfficeDashboard() {
  const [data, setData] = useState<BoxOfficeData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Interactive filters
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [genreFilter, setGenreFilter] = useState("All");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/boxoffice");
      const d = await response.json();
      setData(d);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="text-center py-12 text-white">
        <RefreshCw className="w-8 h-8 text-gold-500 animate-spin mx-auto" />
        <p className="text-xs text-gray-400 mt-2 font-mono">Loading film financial matrices...</p>
      </div>
    );
  }

  // Conversion value Cr INR to USD Million (approx 1 Crores = 0.12 Million USD)
  const rate = currency === "USD" ? 0.12 : 1;
  const unitLabel = currency === "USD" ? "M USD" : "Cr INR";

  const topGrossingFormatted = data.topGrossing.map(tg => ({
    ...tg,
    grossValue: Math.round(tg.collection * rate),
    budgetValue: Math.round(tg.budget * rate)
  }));

  const timelineFormatted = data.yearWiseRevenue.map(yr => ({
    ...yr,
    revenueValue: Math.round(yr.revenue * rate)
  }));

  const actorShareFormatted = data.actorShareRanking.map(act => ({
    ...act,
    shareValue: Math.round(act.share * rate)
  }));

  const colors = ["#ca982e", "#debf60", "#ea983d", "#10b981", "#8b5cf6", "#ec4899", "#3b82f6"];

  return (
    <div className="space-y-6 text-white" id="boxoffice-stats-workspace">
      {/* Metrics Bar with interactive toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gold-500/20 pb-4">
        <div>
          <h2 className="text-xl font-display font-semibold text-white flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-gold-400" />
            Box Office Analytics Dashboard
          </h2>
          <p className="text-xs text-gray-400 mt-1 font-sans">
            Interactive financial models auditing Bollywood's worldwide collections, growth trends, and actor rankings.
          </p>
        </div>

        {/* Currency filters toggle */}
        <div className="bg-cinema-dark border border-gold-500/25 p-1 rounded-xl flex items-center self-start md:self-auto shadow-md">
          <button
            onClick={() => setCurrency("INR")}
            className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition ${
              currency === "INR" ? "bg-gold-500 text-cinema-dark" : "text-gray-400 hover:text-white"
            }`}
          >
            INR (Crore)
          </button>
          <button
            onClick={() => setCurrency("USD")}
            className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition ${
              currency === "USD" ? "bg-gold-500 text-cinema-dark" : "text-gray-400 hover:text-white"
            }`}
          >
            USD ($ Million)
          </button>
        </div>
      </div>

      {/* Quick Core Financial Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-gold-500/10 flex items-center gap-3">
          <div className="w-10 h-10 bg-gold-400/10 rounded-lg flex items-center justify-center border border-gold-500/20">
            <DollarSign className="w-5 h-5 text-gold-400" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono text-gray-500">Record Lifetime Grosser</div>
            <div className="text-sm font-semibold text-white">Dangal (2024 Cr)</div>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-gold-500/10 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-400/10 rounded-lg flex items-center justify-center border border-emerald-500/20">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono text-gray-500">Industry CAGR (Est.)</div>
            <div className="text-sm font-semibold text-white">+11.2% Yearly Growth</div>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-gold-500/10 flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-400/10 rounded-lg flex items-center justify-center border border-purple-500/20">
            <Layers className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono text-gray-500">Leading Genre</div>
            <div className="text-sm font-semibold text-white">Action & Thrillers (42%)</div>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-gold-500/10 flex items-center gap-3">
          <div className="w-10 h-10 bg-gold-400/10 rounded-lg flex items-center justify-center border border-gold-500/20">
            <Calendar className="w-5 h-5 text-gold-400" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono text-gray-500">Peak Market Revenue</div>
            <div className="text-sm font-semibold text-white">2023 Blockbuster Year</div>
          </div>
        </div>
      </div>

      {/* Main Stats Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* BAR CHART: Global Top-grossing blockbusters */}
        <div className="bg-cinema-dark/40 border border-white/5 p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase font-mono text-gold-400 tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-gold-400" />
              Top Grossing Worldwide Blockbusters
            </h3>
            <span className="text-[10px] text-gray-500 font-mono">Gross value in {unitLabel}</span>
          </div>
          <div className="h-60 text-xs font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topGrossingFormatted} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
                <XAxis dataKey="title" stroke="#4b5563" />
                <YAxis stroke="#4b5563" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f0f0f", border: "1px solid rgba(218, 191, 96, 0.2)", borderRadius: "8px" }}
                  labelStyle={{ color: "#d4aa3b" }}
                />
                <Legend />
                <Bar name="Worldwide Gross Collection" dataKey="grossValue" fill="#ca982e" radius={[4, 4, 0, 0]} />
                <Bar name="Production Budget" dataKey="budgetValue" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AREA CHART: Year-wise overall market returns */}
        <div className="bg-cinema-dark/40 border border-white/5 p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase font-mono text-gold-400 tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gold-400" />
              Year-wise Industry Net Revenue (2010 - 2026)
            </h3>
            <span className="text-[10px] text-gray-500 font-mono">Net industry collections in {unitLabel}</span>
          </div>
          <div className="h-60 text-xs font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineFormatted} margin={{ left: -15, right: 10, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="revColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ca982e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ca982e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="year" stroke="#4b5563" />
                <YAxis stroke="#4b5563" />
                <Tooltip contentStyle={{ backgroundColor: "#0f0f0f", border: "1px solid rgba(218, 191, 96, 0.2)" }} />
                <Area type="monotone" name="Total Revenue Stream" dataKey="revenueValue" stroke="#ca982e" fillOpacity={1} fill="url(#revColor)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PIE CHART / LIST: Genre Revenue splits */}
        <div className="bg-cinema-dark/40 border border-white/5 p-5 rounded-2xl space-y-4">
          <h3 className="text-xs uppercase font-mono text-gold-400 tracking-wider flex items-center gap-1.5">
            <PieIcon className="w-4 h-4 text-gold-400" />
            Genre Market Revenue Shares Split
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6">
            <div className="h-44 text-xs font-mono">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.genreRevenueShare}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="percentage"
                    nameKey="genre"
                  >
                    {data.genreRevenueShare.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#0f0f0f", border: "1px solid rgba(218, 191, 96, 0.2)" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-2">
              {data.genreRevenueShare.map((gr, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-cinema-dark/50 border border-white/5 text-xs">
                  <div className="flex items-center gap-2">
                    <span>{gr.icon}</span>
                    <span className="font-display text-gray-300 font-medium">{gr.genre}</span>
                  </div>
                  <strong className="text-gold-300 font-mono">{gr.percentage}%</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BAR CHART: Actor Share Collections ranking */}
        <div className="bg-cinema-dark/40 border border-white/5 p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase font-mono text-gold-400 tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-gold-400" />
              Actor Gross Collection Cumulative Share
            </h3>
            <span className="text-[10px] text-gray-500 font-mono">Aggregate in {unitLabel}</span>
          </div>
          <div className="h-48 text-xs font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={actorShareFormatted} layout="vertical" margin={{ left: -15, right: 10, top: 10, bottom: 0 }}>
                <XAxis type="number" stroke="#4b5563" />
                <YAxis dataKey="label" type="category" stroke="#4b5563" />
                <Tooltip contentStyle={{ backgroundColor: "#0f0f0f", border: "1px solid rgba(218, 191, 96, 0.2)", borderRadius: "8px" }} />
                <Bar name="Lifetime Collection" dataKey="shareValue" fill="#ca982e" radius={[0, 4, 4, 0]}>
                  {actorShareFormatted.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? "#ca982e" : index === 1 ? "#debf60" : "#aa7422"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-gray-550 leading-relaxed italic text-center">
            *Audited from 2000-2026 worldwide major film releases, charting first-tier billing cast collections.
          </p>
        </div>

      </div>
    </div>
  );
}
