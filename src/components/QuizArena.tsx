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
    <div className="bg-[#141414] rounded-3xl p-6 lg:p-8 border border-stone-850 max-w-4xl mx-auto my-4 text-white shadow-2xl relative overflow-hidden" id="quiz-arena-pane">
      {/* Header metrics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-850 pb-6 mb-6">
        <div>
          <div className="flex items-center gap-2 text-[#E50914] font-sans font-extrabold tracking-wider text-xs uppercase">
            <Award className="w-4 h-4 text-[#E50914]" />
            Interactive Gamification Hub
          </div>
          <h2 className="text-2xl md:text-3xl font-sans font-black text-white tracking-tight mt-1">
            Bollywood Quiz Arena
          </h2>
          <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">
            Test your cinematic intelligence, trigger daily dialogue puzzles, and earn badges on the master leaderboard.
          </p>
        </div>

        {/* User rank credentials */}
        <div className="bg-stone-900 p-3.5 rounded-xl border border-stone-800 flex items-center gap-3 shadow-md">
          <div className="w-10 h-10 bg-stone-950 border border-stone-850 rounded-full flex items-center justify-center">
            <Zap className="w-5 h-5 text-[#E50914] animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono text-stone-500 flex items-center gap-1 font-bold">
              <span>Current Status Rank:</span>
              <span className="text-[#E50914] font-bold">Lvl {userProfile.level}</span>
            </div>
            <div className="text-xs font-sans font-bold text-white mt-0.5">
              {getFilmyTitle(userProfile.level)}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 text-[#E50914] animate-spin mx-auto" />
          <p className="text-xs text-stone-500 mt-2 font-mono">Loading cinematic bank...</p>
        </div>
      ) : !quizStarted ? (
        /* Category selection and intro */
        <div className="space-y-6 text-center py-6">
          <div className="max-w-md mx-auto space-y-3">
            <Star className="w-12 h-12 text-[#E50914] mx-auto animate-pulse" />
            <h3 className="text-xl font-sans font-black text-white">Select Quiz Category</h3>
            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              Answer legendary Bollywood trivia regarding composers, actors, box office statistics, and hit soundtracks to accumulate direct XP credentials.
            </p>
          </div>

          {/* Category Filter chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 px-4 max-w-2xl mx-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 border rounded-xl text-xs font-sans font-bold cursor-pointer transition duration-300 ${
                  category === cat
                    ? "bg-[#E50914]/15 text-[#E50914] border-[#E50914]/40"
                    : "bg-stone-900/60 border-stone-850 text-stone-400 hover:text-white hover:bg-stone-800"
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
              className="px-8 py-3.5 bg-[#E50914] hover:bg-[#b00710] text-white font-sans font-black text-sm rounded-xl cursor-pointer shadow-lg inline-flex items-center gap-2 transition duration-300"
            >
              <Play className="w-4 h-4 fill-white" />
              Begin Filmy Challenge ({filteredQuestions.length} Items)
            </button>
            {filteredQuestions.length === 0 && (
              <p className="text-[#E50914] text-xs mt-2 font-bold font-sans">No trivia elements registered under this genre criteria.</p>
            )}
          </div>
        </div>
      ) : (
        /* Active gameplay block */
        <div className="max-w-xl mx-auto space-y-6 animate-fadeIn">
          {currentIndex < filteredQuestions.length && !(answered && currentIndex + 1 === filteredQuestions.length && selectedOption !== null) ? (
            /* Running Question */
            <div className="space-y-6">
              <div className="flex justify-between items-center text-xs font-mono text-stone-400">
                <span>Category: <strong className="text-[#E50914]">{filteredQuestions[currentIndex].category}</strong></span>
                <span>Question <strong className="text-white">{currentIndex + 1}</strong> of <strong className="text-white">{filteredQuestions.length}</strong></span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-stone-900 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-[#E50914] h-full transition-all duration-300"
                  style={{ width: `${((currentIndex) / filteredQuestions.length) * 100}%` }}
                />
              </div>

              <div className="bg-stone-900 border border-stone-850 rounded-2xl p-6">
                <p className="text-base font-sans font-bold text-white leading-relaxed">
                  "{filteredQuestions[currentIndex].question}"
                </p>
              </div>

              {/* Multiple choices */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredQuestions[currentIndex].options.map((opt, oIdx) => {
                  const correctIdx = filteredQuestions[currentIndex].answerIndex;
                  let btnStyle = "bg-stone-900/40 border-stone-850 text-stone-300 hover:bg-stone-900 hover:border-stone-700";
                  
                  if (answered) {
                    if (oIdx === correctIdx) {
                      btnStyle = "bg-emerald-950/35 border-emerald-500/80 text-emerald-300 font-bold";
                    } else if (selectedOption === oIdx && selectedOption !== correctIdx) {
                      btnStyle = "bg-red-950/35 border-red-500/80 text-red-300 font-bold";
                    } else {
                      btnStyle = "bg-stone-950 border-stone-900 text-stone-600 opacity-50";
                    }
                  } else if (selectedOption === oIdx) {
                    btnStyle = "bg-[#E50914]/10 border-[#E50914]/60 text-white font-bold";
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleOptionClick(oIdx)}
                      disabled={answered}
                      className={`p-4 border rounded-xl text-xs text-left cursor-pointer transition flex items-start gap-3 ${btnStyle}`}
                    >
                      <span className="w-5 h-5 font-mono text-[10px] leading-5 bg-stone-950 text-stone-400 rounded-full text-center shrink-0">
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation trigger and confirmation controls */}
              <div className="flex justify-end gap-3 pt-4 border-t border-stone-850">
                {!answered ? (
                  <button
                    onClick={handleConfirmAnswer}
                    disabled={selectedOption === null}
                    className="px-5 py-2.5 bg-[#E50914] hover:bg-[#b00710] text-[#FFFFFF] font-sans font-bold text-xs rounded-lg cursor-pointer transition duration-300 disabled:opacity-50"
                  >
                    Lock Answer & Submit
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-850 font-sans font-bold text-xs rounded-lg cursor-pointer inline-flex items-center gap-1.5 transition duration-300"
                  >
                    <span>{currentIndex + 1 === filteredQuestions.length ? "Finish Quiz" : "Next Question"}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#E50914]" />
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
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  <div className="space-y-1 block">
                    <div className="font-bold font-sans">
                      {selectedOption === filteredQuestions[currentIndex].answerIndex
                        ? `Arre Wah! Correct! Earned +${filteredQuestions[currentIndex].xpPoints} XP`
                        : `Afsos! Incorrect. The correct answer was: "${filteredQuestions[currentIndex].options[filteredQuestions[currentIndex].answerIndex]}"`}
                    </div>
                    <p className="text-stone-400 leading-relaxed font-sans mt-1">
                      {filteredQuestions[currentIndex].explanation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Finished Block */
            <div className="text-center py-8 space-y-6 animate-fadeIn">
              <Award className="w-16 h-16 text-[#E50914] mx-auto animate-bounce shadow-2xl" />
              <div className="space-y-2">
                <h3 className="text-2xl font-sans font-black">Quiz Challenge Cleared!</h3>
                <p className="text-sm text-stone-400 max-w-md mx-auto leading-relaxed">
                  You successfully resolved our Bollywood challenge bank, demonstrating exceptional theatrical intelligence credentials.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                <div className="bg-stone-900 border border-stone-850 rounded-xl p-4">
                  <div className="text-[10px] uppercase font-mono text-stone-500 font-bold">Total Score Ratio</div>
                  <div className="text-2xl font-mono font-bold text-[#E50914] mt-1">
                    {score} / {filteredQuestions.length}
                  </div>
                </div>
                <div className="bg-stone-900 border border-stone-850 rounded-xl p-4">
                  <div className="text-[10px] uppercase font-mono text-stone-500 font-bold">Secured XP Points</div>
                  <div className="text-2xl font-mono font-bold text-emerald-400 mt-1">
                    +{xpEarnedTotal} XP
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={handleRestart}
                  className="px-5 py-2.5 bg-[#E50914] text-white hover:bg-[#b00710] text-xs font-sans font-bold rounded-lg cursor-pointer transition flex items-center gap-1.5 duration-300"
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
