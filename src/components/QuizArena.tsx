import { useState, useEffect } from "react";
import { QuizQuestion } from "../types";
import { Award, Zap, RefreshCw, CheckCircle, XCircle, ArrowRight, Play, Star } from "lucide-react";

interface ProfileState {
  xp: number;
  level: number;
  badges: string[];
}

export default function QuizArena({ 
  onRegisterXp, 
  userProfile 
}: { 
  onRegisterXp: (amount: number) => void; 
  userProfile: ProfileState; 
}) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>("All");
  
  // Game state
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [xpEarnedTotal, setXpEarnedTotal] = useState(0);

  const categories = ["All", "Actors", "Movies", "Songs", "Awards", "Dialogues"];

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await fetch("/api/quizzes");
      const data = await response.json();
      setQuestions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions = category === "All"
    ? questions
    : questions.filter(q => q.category === category);

  const startQuiz = () => {
    if (filteredQuestions.length === 0) return;
    setQuizStarted(true);
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswered(false);
    setScore(0);
    setXpEarnedTotal(0);
  };

  const handleOptionClick = (optionIdx: number) => {
    if (answered) return;
    setSelectedOption(optionIdx);
  };

  const handleConfirmAnswer = () => {
    if (selectedOption === null || answered) return;
    
    setAnswered(true);
    const correctIdx = filteredQuestions[currentIndex].answerIndex;
    if (selectedOption === correctIdx) {
      setScore(score + 1);
      const earnedXp = filteredQuestions[currentIndex].xpPoints;
      setXpEarnedTotal(xpEarnedTotal + earnedXp);
      onRegisterXp(earnedXp); // Send back to parent profile persistence
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < filteredQuestions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setAnswered(false);
    } else {
      // Completed!
      setAnswered(true);
    }
  };

  const handleRestart = () => {
    setQuizStarted(false);
    setSelectedOption(null);
    setAnswered(false);
  };

  // Get user titles based on achievements
  const getFilmyTitle = (lvl: number) => {
    if (lvl >= 10) return "Bollywood Dictator / Shahenshah";
    if (lvl >= 6) return "Cinema Guru / Critic Master";
    if (lvl >= 3) return "Elite Movie Buff";
    return "Diligent Audience";
  };

  return (
    <div className="glass-panel rounded-2xl p-6 lg:p-8 gold-border-glow max-w-4xl mx-auto my-4 text-white" id="quiz-arena-pane">
      {/* Header metrics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gold-500/20 pb-6 mb-6">
        <div>
          <div className="flex items-center gap-2 text-gold-400 font-display font-semibold tracking-wide text-sm uppercase">
            <Award className="w-4 h-4 text-gold-400" />
            Interactive Gamification Hub
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-medium text-white tracking-tight mt-1">
            Bollywood Quiz Arena
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Test your cinematic intelligence, trigger daily dialogue puzzles, and earn badges on the master leaderboard.
          </p>
        </div>

        {/* User rank credentials */}
        <div className="bg-cinema-dark p-3 rounded-xl border border-gold-500/25 flex items-center gap-3">
          <div className="w-10 h-10 bg-gold-500/10 border border-gold-400/30 rounded-full flex items-center justify-center">
            <Zap className="w-5 h-5 text-gold-400 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono text-gray-400 flex items-center gap-1">
              <span>Current Status Rank:</span>
              <span className="text-gold-300 font-bold">Lvl {userProfile.level}</span>
            </div>
            <div className="text-xs font-display font-semibold text-white">
              {getFilmyTitle(userProfile.level)}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 text-gold-500 animate-spin mx-auto" />
          <p className="text-xs text-gray-400 mt-2 font-mono">Loading cinematic bank...</p>
        </div>
      ) : !quizStarted ? (
        /* Category selection and intro */
        <div className="space-y-6 text-center py-6">
          <div className="max-w-md mx-auto space-y-3">
            <Star className="w-12 h-12 text-gold-500 mx-auto glow" />
            <h3 className="text-xl font-display font-semibold">Select Quiz Category</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Answer legendary Bollywood trivia regarding composers, actors, box office statistics, and hit soundtracks to accumulate direct XP credentials.
            </p>
          </div>

          {/* Category Filter chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 px-4 max-w-2xl mx-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 border rounded-xl text-xs font-display font-medium cursor-pointer transition ${
                  category === cat
                    ? "bg-gold-500/20 text-gold-300 border-gold-400"
                    : "bg-cinema-dark/40 border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="pt-4">
            <button
              onClick={startQuiz}
              disabled={filteredQuestions.length === 0}
              className="px-8 py-3.5 bg-gradient-to-r from-gold-600 to-gold-400 hover:from-gold-500 hover:to-gold-300 transition-colors text-cinema-dark font-display font-semibold text-sm rounded-xl cursor-pointer shadow-lg inline-flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-cinema-dark" />
              Begin Filmy Challenge ({filteredQuestions.length} Items)
            </button>
            {filteredQuestions.length === 0 && (
              <p className="text-red-400 text-xs mt-2">No trivia elements registered under this genre criteria.</p>
            )}
          </div>
        </div>
      ) : (
        /* Active gameplay block */
        <div className="max-w-xl mx-auto space-y-6 animate-fadeIn">
          {currentIndex < filteredQuestions.length && !(answered && currentIndex + 1 === filteredQuestions.length && selectedOption !== null) ? (
            /* Running Question */
            <div className="space-y-6">
              <div className="flex justify-between items-center text-xs font-mono text-gray-400">
                <span>Category: <strong className="text-gold-400">{filteredQuestions[currentIndex].category}</strong></span>
                <span>Question <strong className="text-white">{currentIndex + 1}</strong> of <strong className="text-white">{filteredQuestions.length}</strong></span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gold-500 h-full transition-all duration-300"
                  style={{ width: `${((currentIndex) / filteredQuestions.length) * 100}%` }}
                />
              </div>

              <div className="bg-cinema-dark/40 border border-white/5 rounded-2xl p-6">
                <p className="text-base font-display font-medium text-white leading-relaxed">
                  "{filteredQuestions[currentIndex].question}"
                </p>
              </div>

              {/* Multiple choices */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredQuestions[currentIndex].options.map((opt, oIdx) => {
                  const correctIdx = filteredQuestions[currentIndex].answerIndex;
                  let btnStyle = "bg-cinema-dark/60 border-white/10 text-gray-300";
                  
                  if (answered) {
                    if (oIdx === correctIdx) {
                      btnStyle = "bg-emerald-950/40 border-emerald-500 text-emerald-300";
                    } else if (selectedOption === oIdx && selectedOption !== correctIdx) {
                      btnStyle = "bg-red-950/40 border-red-500 text-red-300";
                    } else {
                      btnStyle = "bg-cinema-dark/30 border-white/5 text-gray-500 opacity-60";
                    }
                  } else if (selectedOption === oIdx) {
                    btnStyle = "bg-gold-500/10 border-gold-400 text-gold-300";
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleOptionClick(oIdx)}
                      disabled={answered}
                      className={`p-4 border rounded-xl text-xs text-left cursor-pointer transition flex items-start gap-3 ${btnStyle}`}
                    >
                      <span className="w-5 h-5 font-mono text-[10px] leading-5 bg-white/5 text-gray-400 rounded-full text-center shrink-0">
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation trigger and confirmation controls */}
              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                {!answered ? (
                  <button
                    onClick={handleConfirmAnswer}
                    disabled={selectedOption === null}
                    className="px-5 py-2.5 bg-gold-500 text-cinema-dark font-display font-medium text-xs rounded-lg cursor-pointer transition disabled:opacity-50"
                  >
                    Lock Answer & Submit
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="px-5 py-2.5 bg-gradient-to-r from-gold-600 to-gold-400 text-cinema-dark font-display font-semibold text-xs rounded-lg cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span>{currentIndex + 1 === filteredQuestions.length ? "Finish Quiz" : "Next Question"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Correctness explanation block */}
              {answered && (
                <div className={`p-4 rounded-xl border animate-fadeIn text-xs flex gap-3 ${
                  selectedOption === filteredQuestions[currentIndex].answerIndex
                    ? "bg-emerald-950/20 border-emerald-500/20 text-emerald-300"
                    : "bg-red-950/20 border-red-500/20 text-red-300"
                }`}>
                  <div className="shrink-0">
                    {selectedOption === filteredQuestions[currentIndex].answerIndex ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="font-semibold">
                      {selectedOption === filteredQuestions[currentIndex].answerIndex
                        ? `Arre Wah! Correct! Earned +${filteredQuestions[currentIndex].xpPoints} XP`
                        : `Afsos! Incorrect. The correct answer was: "${filteredQuestions[currentIndex].options[filteredQuestions[currentIndex].answerIndex]}"`}
                    </div>
                    <p className="text-gray-400 leading-relaxed font-sans mt-1">
                      {filteredQuestions[currentIndex].explanation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Finished Block */
            <div className="text-center py-8 space-y-6 animate-fadeIn">
              <Award className="w-16 h-16 text-gold-400 mx-auto animate-bounce gold-glow" />
              <div className="space-y-2">
                <h3 className="text-2xl font-display font-semibold">Quiz Challenge Cleared!</h3>
                <p className="text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
                  You successfully resolved our Bollywood challenge bank, demonstrating exceptional theatrical intelligence credentials.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                <div className="bg-cinema-dark/60 border border-white/5 rounded-xl p-4">
                  <div className="text-[10px] uppercase font-mono text-gray-500">Total Score Ratio</div>
                  <div className="text-2xl font-mono font-bold text-gold-300 mt-1">
                    {score} / {filteredQuestions.length}
                  </div>
                </div>
                <div className="bg-cinema-dark/60 border border-white/5 rounded-xl p-4">
                  <div className="text-[10px] uppercase font-mono text-gray-500">Secured XP Points</div>
                  <div className="text-2xl font-mono font-bold text-emerald-400 mt-1">
                    +{xpEarnedTotal} XP
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={handleRestart}
                  className="px-5 py-2.5 bg-cinema-dark/80 text-gray-200 border border-white/10 hover:border-gold-500/20 text-xs font-display font-semibold rounded-lg cursor-pointer transition flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Return to Arena
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
