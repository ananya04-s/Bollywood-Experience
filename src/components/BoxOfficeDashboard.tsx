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
        <RefreshCw className="w-8 h-8 text-[#E50914] animate-spin mx-auto" />
        <p className="text-xs text-stone-400 mt-2 font-mono">Loading film financial matrices...</p>
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

  const colors = ["#E50914", "#A5070F", "#7F050A", "#4A0306", "#2D0A0C", "#888888", "#5c5c5c"];

  return (
    <div className="space-y-6 text-white" id="boxoffice-stats-workspace">
      {/* Metrics Bar with interactive toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-850 pb-4">
        <div>
          <h2 className="text-xl font-sans font-black text-white flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-[#E50914] animate-pulse" />
            Box Office Analytics Dashboard
          </h2>
          <p className="text-xs text-stone-400 mt-1 font-sans">
            Interactive financial models auditing Bollywood's worldwide collections, growth trends, and actor rankings.
          </p>
        </div>

        {/* Currency filters toggle */}
        <div className="bg-stone-950 border border-stone-850 p-1 rounded-xl flex items-center self-start md:self-auto shadow-md">
          <button
            onClick={() => setCurrency("INR")}
            className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition cursor-pointer ${
              currency === "INR" ? "bg-[#E50914] text-white" : "text-stone-400 hover:text-white"
            }`}
          >
            INR (Crore)
          </button>
          <button
            onClick={() => setCurrency("USD")}
            className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition cursor-pointer ${
              currency === "USD" ? "bg-[#E50914] text-white" : "text-stone-400 hover:text-white"
            }`}
          >
            USD ($ Million)
          </button>
        </div>
      </div>

      {/* Quick Core Financial Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#181818] p-4.5 rounded-2xl border border-stone-800 flex items-center gap-3 shadow-md">
          <div className="w-10 h-10 bg-[#E50914]/10 rounded-lg flex items-center justify-center border border-[#E50914]/20 text-[#E50914]">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono text-stone-500 font-bold">Record Lifetime Grosser</div>
            <div className="text-xs font-bold text-white font-sans mt-0.5">Dangal (2024 Cr)</div>
          </div>
        </div>

        <div className="bg-[#181818] p-4.5 rounded-2xl border border-stone-800 flex items-center gap-3 shadow-md">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center border border-emerald-500/20 text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono text-stone-500 font-bold">Industry CAGR (Est.)</div>
            <div className="text-xs font-bold text-white font-sans mt-0.5">+11.2% Yearly Growth</div>
          </div>
        </div>

        <div className="bg-[#181818] p-4.5 rounded-2xl border border-stone-800 flex items-center gap-3 shadow-md">
          <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center border border-purple-500/20 text-purple-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono text-stone-500 font-bold">Leading Genre</div>
            <div className="text-xs font-bold text-white font-sans mt-0.5">Action & Thrillers (42%)</div>
          </div>
        </div>

        <div className="bg-[#181818] p-4.5 rounded-2xl border border-stone-800 flex items-center gap-3 shadow-md">
          <div className="w-10 h-10 bg-[#E50914]/10 rounded-lg flex items-center justify-center border border-[#E50914]/20 text-[#E50914]">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono text-stone-500 font-bold">Peak Market Revenue</div>
            <div className="text-xs font-bold text-white font-sans mt-0.5">2023 Blockbuster Year</div>
          </div>
        </div>
      </div>

      {/* Main Stats Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* BAR CHART: Global Top-grossing blockbusters */}
        <div className="bg-[#181818] border border-stone-800 p-5 rounded-3xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase font-sans font-black text-white tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#E50914] animate-pulse" />
              Top Grossing Worldwide Blockbusters
            </h3>
            <span className="text-[10px] text-stone-500 font-mono">Gross value in {unitLabel}</span>
          </div>
          <div className="h-60 text-xs font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topGrossingFormatted} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
                <XAxis dataKey="title" stroke="#444444" />
                <YAxis stroke="#444444" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#141414", border: "1px solid #262626", borderRadius: "12px" }}
                  labelStyle={{ color: "#E50914" }}
                />
                <Legend />
                <Bar name="Worldwide Gross Collection" dataKey="grossValue" fill="#E50914" radius={[4, 4, 0, 0]} />
                <Bar name="Production Budget" dataKey="budgetValue" fill="#444444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AREA CHART: Year-wise overall market returns */}
        <div className="bg-[#181818] border border-stone-800 p-5 rounded-3xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase font-sans font-black text-white tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#E50914]" />
              Year-wise Industry Net Revenue (2010 - 2026)
            </h3>
            <span className="text-[10px] text-stone-500 font-mono">Net industry collections in {unitLabel}</span>
          </div>
          <div className="h-60 text-xs font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineFormatted} margin={{ left: -15, right: 10, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="revColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E50914" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#E50914" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="year" stroke="#444444" />
                <YAxis stroke="#444444" />
                <Tooltip contentStyle={{ backgroundColor: "#141414", border: "1px solid #262626" }} />
                <Area type="monotone" name="Total Revenue Stream" dataKey="revenueValue" stroke="#E50914" fillOpacity={1} fill="url(#revColor)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PIE CHART / LIST: Genre Revenue splits */}
        <div className="bg-[#181818] border border-stone-800 p-5 rounded-3xl space-y-4 shadow-xl">
          <h3 className="text-xs uppercase font-sans font-black text-white tracking-wider flex items-center gap-1.5">
            <PieIcon className="w-4 h-4 text-[#E50914]" />
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
                  <Tooltip contentStyle={{ backgroundColor: "#141414", border: "1px solid #262626" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-2">
              {data.genreRevenueShare.map((gr, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-stone-900/50 border border-stone-850 text-xs">
                  <div className="flex items-center gap-2">
                    <span>{gr.icon}</span>
                    <span className="font-sans text-stone-300 font-bold">{gr.genre}</span>
                  </div>
                  <strong className="text-white font-mono">{gr.percentage}%</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BAR CHART: Actor Share Collections ranking */}
        <div className="bg-[#181818] border border-stone-800 p-5 rounded-3xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase font-sans font-black text-white tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#E50914]" />
              Actor Gross Collection Cumulative Share
            </h3>
            <span className="text-[10px] text-stone-500 font-mono">Aggregate in {unitLabel}</span>
          </div>
          <div className="h-48 text-xs font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={actorShareFormatted} layout="vertical" margin={{ left: -15, right: 10, top: 10, bottom: 0 }}>
                <XAxis type="number" stroke="#444444" />
                <YAxis dataKey="label" type="category" stroke="#444444" />
                <Tooltip contentStyle={{ backgroundColor: "#141414", border: "1px solid #262626", borderRadius: "12px" }} />
                <Bar name="Lifetime Collection" dataKey="shareValue" fill="#E50914" radius={[0, 4, 4, 0]}>
                  {actorShareFormatted.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? "#E50914" : index === 1 ? "#A5070F" : "#7F050A"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-stone-550 leading-relaxed italic text-center">
            *Audited from 2000-2026 worldwide major film releases, charting first-tier billing cast collections.
          </p>
        </div>

      </div>
    </div>
  );
}
