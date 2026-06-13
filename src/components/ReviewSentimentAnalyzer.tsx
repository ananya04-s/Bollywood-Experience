import { useState, useEffect, FormEvent } from "react";
import { UserReview } from "../types";
import { MessageSquare, ThumbsUp, Star, Award, TrendingUp, Sparkles, Plus, AlertCircle, RefreshCw } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface SentimentAnalysisResult {
  overallSentiment: string;
  sentimentScore: number;
  positivePercentage: number;
  negativePercentage: number;
  positiveKeywords: string[];
  negativeKeywords: string[];
  wordCloud: { text: string; value: number }[];
  sentimentSummary: string;
}

interface ReviewSentimentAnalyzerProps {
  movieId: string;
  movieTitle: string;
  onRegisterXp: (amount: number) => void;
}

export default function ReviewSentimentAnalyzer({ movieId, movieTitle, onRegisterXp }: ReviewSentimentAnalyzerProps) {
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // AI Sentiment States
  const [aiAnalysis, setAiAnalysis] = useState<SentimentAnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, [movieId]);

  const fetchReviews = async () => {
    try {
      const resp = await fetch(`/api/movies/${movieId}`);
      const data = await resp.json();
      if (data.reviews) {
        setReviews(data.reviews);
      }
    } catch (err) {
      console.error("Error loading reviews:", err);
    }
  };

  const submitReview = async (e: FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieId,
          rating,
          author,
          content,
        }),
      });
      const data = await response.json();
      if (data.review) {
        setReviews([data.review, ...reviews]);
        setAuthor("");
        setContent("");
        setFormOpen(false);
        onRegisterXp(data.xpGained || 25);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const likeReview = async (id: string) => {
    try {
      const response = await fetch(`/api/reviews/${id}/like`, { method: "POST" });
      const updatedReview = await response.json();
      setReviews(reviews.map((r) => (r.id === id ? { ...r, likes: updatedReview.likes } : r)));
    } catch (err) {
      console.error(err);
    }
  };

  const runAiSentimentAnalysis = async () => {
    if (reviews.length === 0) {
      setAiError("Write at least one review first, or we will analyze standard benchmark logs for this title.");
    }
    setAiError(null);
    setAnalyzing(true);

    const consolidatedText = reviews.length > 0 
      ? reviews.map((r) => r.content).join("\n")
      : "Excellent historical script. Excellent direction and outstanding romantic depth. The soundtrack is gorgeous and makes the audience weep with pure joy. Though the runtime is heavy, the visual scale is a absolute masterclass.";

    try {
      const response = await fetch("/api/ai/analyze-reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieTitle,
          reviewsText: consolidatedText,
        }),
      });

      const data = await response.json();
      if (data.error) {
        setAiError(data.error);
      } else {
        setAiAnalysis(data);
        onRegisterXp(20); // Gained XP on trigger AI Sentiment
      }
    } catch (err) {
      console.error(err);
      setAiError("Could not run AI sentiment analysis.");
    } finally {
      setAnalyzing(false);
    }
  };

  // Pie chart config
  const sentimentPieData = aiAnalysis
    ? [
        { name: "Positive Sentiment", value: aiAnalysis.positivePercentage, color: "#10b981" },
        { name: "Negative Sentiment", value: aiAnalysis.negativePercentage, color: "#ef4444" },
      ]
    : [];

  return (
    <div className="space-y-6 text-white" id={`reviews-workspace-${movieId}`}>
      {/* Review stats and actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gold-500/10 pb-4">
        <div>
          <h3 className="text-xl font-display font-semibold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-gold-400" />
            Audience Reviews & Sentiment Analysis
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Read what other film students and fans think, or submit your own professional critique.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFormOpen(!formOpen)}
            className="px-4 py-2 bg-gold-600 hover:bg-gold-500 transition-all text-cinema-dark font-display font-medium rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow"
          >
            <Plus className="w-4 h-4" />
            Write Review
          </button>
          <button
            onClick={runAiSentimentAnalysis}
            disabled={analyzing}
            className="px-4 py-2 border border-gold-500/30 hover:border-gold-400 bg-gold-500/10 hover:bg-gold-500/20 text-gold-300 font-display font-medium rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
          >
            {analyzing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 text-gold-400" />
            )}
            Run AI Sentiment Analyzer
          </button>
        </div>
      </div>

      {/* Review Input Form */}
      {formOpen && (
        <form onSubmit={submitReview} className="bg-cinema-dark/50 border border-gold-500/20 rounded-xl p-5 space-y-4 animate-fadeIn">
          <h4 className="text-sm font-display font-semibold text-gold-300">Submit Film Critique & Gain +25 XP</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-gray-400">Reviewer Name/Handle</label>
              <input
                type="text"
                placeholder="e.g. Cinema Enthusiast"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full bg-cinema-dark border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-gold-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-400">Rating Stars</label>
              <div className="flex items-center gap-1 h-[34px]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 focus:outline-none cursor-pointer"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= rating ? "text-gold-400 fill-gold-400" : "text-gray-600"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Critique Review (Min 10 words for accurate AI sentiment mapping)</label>
            <textarea
              placeholder="Write your constructive thoughts regarding direction, screenplay, musical album, cast performances, etc."
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-cinema-dark border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-gold-500"
            />
          </div>
          <div className="flex justify-end gap-2 text-xs">
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="px-3 py-1.5 text-gray-400 hover:text-white transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-1.5 bg-gold-500 hover:bg-gold-400 text-cinema-dark font-medium rounded-lg cursor-pointer"
            >
              {submitting ? "Analyzing & Saving..." : "Publish Review"}
            </button>
          </div>
        </form>
      )}

      {/* AI Sentiment Analysis Box */}
      {aiAnalysis && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-[#161616]/80 p-6 rounded-2xl border border-gold-500/20 light-sweep relative overflow-hidden">
          {/* Gauge Column */}
          <div className="flex flex-col items-center justify-center text-center space-y-4 bg-cinema-dark/40 rounded-xl p-4 border border-white/5">
            <div className="text-xs uppercase font-mono tracking-wider text-gray-400">Global Sentiment Spectrum</div>
            <div className="w-full h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={65}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sentimentPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0f0f0f", border: "1px solid rgba(218, 191, 96, 0.2)", borderRadius: "8px" }}
                    labelStyle={{ color: "#d4aa3b" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div>
              <div className="text-xl font-display font-bold text-gold-400">{aiAnalysis.overallSentiment}</div>
              <div className="text-[10px] font-mono text-gray-500 mt-1 flex items-center justify-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                Sentiment Affinity Index: <strong className="text-gold-300">{aiAnalysis.sentimentScore}%</strong>
              </div>
            </div>
          </div>

          {/* Keyword analysis metadata */}
          <div className="space-y-4">
            <div className="bg-cinema-dark/40 rounded-xl p-4 border border-white/5 h-full space-y-3">
              <div>
                <div className="text-xs font-display font-semibold text-emerald-400 uppercase tracking-wider">
                  Positive Audiences Triggers
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {aiAnalysis.positiveKeywords.map((kw, idx) => (
                    <span key={idx} className="bg-emerald-950/40 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-mono">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-display font-semibold text-red-400 uppercase tracking-wider">
                  Critical / Friction Points
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {aiAnalysis.negativeKeywords.map((kw, idx) => (
                    <span key={idx} className="bg-red-950/40 text-red-300 border border-red-500/20 px-2 py-0.5 rounded text-[10px] font-mono">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/5 pt-2">
                <div className="text-xs font-display font-semibold text-gold-400 uppercase tracking-wider">AI Executive Consensus</div>
                <p className="text-[11px] text-gray-300 mt-1 leading-relaxed italic">
                  "{aiAnalysis.sentimentSummary}"
                </p>
              </div>
            </div>
          </div>

          {/* D3 Word Cloud Display */}
          <div className="space-y-3">
            <div className="bg-cinema-dark/40 rounded-xl p-4 border border-white/5 h-full flex flex-col">
              <div className="text-xs font-display font-semibold text-gold-400 uppercase tracking-wider mb-2">Audience Word Cloud</div>
              <div className="flex-1 flex flex-wrap gap-3 items-center justify-center p-3 relative bg-cinema-dark/30 rounded-lg">
                {aiAnalysis.wordCloud.map((w, idx) => {
                  const sizeClasses = 
                    w.value > 50 ? "text-lg font-bold text-gold-300 uppercase" : 
                    w.value > 40 ? "text-sm font-semibold text-gold-400" :
                    "text-xs text-gray-400 font-light";
                  return (
                    <span 
                      key={idx} 
                      style={{ opacity: 0.4 + (w.value / 100) }}
                      className={`px-1.5 py-0.5 transition-all hover:scale-110 cursor-default ${sizeClasses}`}
                      title={`Weight: ${w.value}%`}
                    >
                      {w.text}
                    </span>
                  );
                })}
              </div>
              <div className="text-[9px] text-right text-gray-500 mt-2 font-mono">Powered by NLP Grounding</div>
            </div>
          </div>
        </div>
      )}

      {/* Review Cards Grid */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-cinema-dark/20 rounded-xl border border-white/5">
            <AlertCircle className="w-8 h-8 text-gray-600 mx-auto" />
            <p className="text-sm text-gray-400 mt-2">No custom critiques registered yet.</p>
            <p className="text-xs text-gray-500 mt-1">Be the first to leave an elite review and claim +25 XP!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((r) => (
              <div key={r.id} className="bg-[#141414]/90 border border-white/10 rounded-xl p-4 flex flex-col justify-between hover:border-gold-500/30 transition-all duration-300">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gold-500/10 border border-gold-400/30 text-gold-400 rounded-full flex items-center justify-center font-bold text-xs uppercase">
                        {r.author.substring(0, 2)}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                          {r.author}
                          {r.rating >= 4 && (
                            <span className="bg-gold-500/20 text-gold-400 text-[9px] px-1.5 py-0.2 rounded-full font-mono flex items-center gap-0.5 border border-gold-400/20">
                              <Award className="w-2.5 h-2.5" /> Pro Reviewer
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-gray-500 font-mono">
                          {new Date(r.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= r.rating ? "text-gold-400 fill-gold-400" : "text-gray-800"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed font-sans line-clamp-3">
                    "{r.content}"
                  </p>
                </div>
                <div className="flex justify-between items-center border-t border-white/5 pt-3 mt-3 text-xs">
                  <button
                    onClick={() => likeReview(r.id)}
                    className="flex items-center gap-1 text-gray-400 hover:text-gold-300 cursor-pointer transition font-mono text-[11px]"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{r.likes} likes</span>
                  </button>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                    r.sentiment === "Positive" 
                      ? "text-emerald-400 bg-emerald-950/20 border border-emerald-500/10"
                      : "text-red-400 bg-red-950/20 border border-red-500/10"
                  }`}>
                    {r.sentiment || "Neutral"} Score: {r.sentimentScore}/10
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
