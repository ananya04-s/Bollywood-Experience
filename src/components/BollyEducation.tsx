import React, { useState } from "react";
import { 
  Award, ShieldCheck, Sparkles, BookOpen, Compass, 
  HelpCircle, ChevronRight, User, Music, Film, CheckCircle, XCircle 
} from "lucide-react";

interface GlossaryTerm {
  term: string;
  pronounce: string;
  definition: string;
  culturalImpact: string;
}

const DICTIONARY_DB: GlossaryTerm[] = [
  {
    term: "Masala Film",
    pronounce: "muh-saa-laa",
    definition: "A genre-blending movie that combines action, comedy, romance, and excessive family drama with 5-6 lavish song and dance sequences.",
    culturalImpact: "The absolute dominant commercial format of Indian cinema since the mid-1970s, pioneered by legendary writers Salim-Javed."
  },
  {
    term: "Playback Singing",
    pronounce: "play-back",
    definition: "A system where professional singers pre-record soundtracks in studios, and screen actors lip-sync the words on the actual filming set.",
    culturalImpact: "Gave rise to absolute legends like Lata Mangeshkar, Kishore Kumar, Sonu Nigam, and Asha Bhosle who became national musical institutions."
  },
  {
    term: "Item Number",
    pronounce: "eye-tem num-ber",
    definition: "A high-beat, catchy, standalone dance soundtrack inserted into a movie, featuring a guest star dancer who is unrelated to the core script.",
    culturalImpact: "Serve as highly critical marketing triggers to maximize tickets and build immense pre-release buzz (e.g. 'Chaiyya Chaiyya')."
  },
  {
    term: "Sangeet Sequence",
    pronounce: "sun-geeth",
    definition: "A joyous musical ceremony in family dramas featuring choreographed dance numbers performed by wedding relatives and leads.",
    culturalImpact: "Created an entire wedding industry boom in India, where real couples hire professional film choreographers to replicate signature steps."
  }
];

const DECADES_DB = [
  {
    label: "1950s",
    title: "The Golden Age of Neorealistic Art",
    desc: "Post-independence era dominated by social consciousness, exquisite black-and-white cinematography, and legendary actors like Raj Kapoor, Dilip Kumar, and Nargis.",
    milestone: "Mother India (1957) becomes India's first official nominee for the Academy Award for Best International Feature Film."
  },
  {
    label: "1970s",
    title: "Anger, Action, & Salim-Javed's Mass Hero",
    desc: "A period marked by high political distress, rising unemployment, and the birth of the 'Angry Young Man' archetype played by Amitabh Bachchan.",
    milestone: "Sholay (1975) redefines box office limits, playing continuously in Mumbai's Minhaj Theatre for over five consecutive years."
  },
  {
    label: "1990s",
    title: "The NRI Romance & Bright Color Aesthetics",
    desc: "Economic liberalization brings gorgeous foreign Swiss locales, grand wedding sequences, NRI family nostalgia, and the rise of the King of Romance (SRK).",
    milestone: "Dilwale Dulhania Le Jayenge (1995) sets the ultimate record for longest-running continuous theatrical run in Maratha Mandir theater."
  },
  {
    label: "2010s",
    title: "Content-Driven Renaissance & Global Scale",
    desc: "A transition towards content, high-utility small-town screenplays, digital sound technology, and high-budget historical biopics.",
    milestone: "Dangal (2016) becomes the highest-grossing Indian film of all time, conquering massive theatrical returns worldwide."
  }
];

interface BollyEducationProps {
  onRegisterXp: (amount: number) => void;
  theme: "dark" | "light";
}

export default function BollyEducation({ onRegisterXp, theme }: BollyEducationProps) {
  const [activeEduTab, setActiveEduTab] = useState<"history" | "glossary" | "pioneers" | "test">("history");

  // State for terminology test
  const [testAnswered, setTestAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [xpClaimed, setXpClaimed] = useState(false);

  const testQuestion = {
    q: "Why is a standalone song sequence featuring a guest performance called an 'Item Number' in Bollywood jargon?",
    options: [
      "Because the song represents a collectible trading item sold during theatrical intermission",
      "Because it contains catchphrase verses meant to serve as a fast commercial marketing hook",
      "Because the filming camera uses physical stock items to capture high dhol beats",
      "Because actors lip-sync playback songs while using kitchen utensils as props"
    ],
    correctIdx: 1,
    explanation: "Correct! 'Item numbers' are commercial master hooks designed to stimulate immediate viewer tickets, driven by standalone rhythmic choreography unrelated to the script."
  };

  const handleConfirmTest = (idx: number) => {
    if (testAnswered) return;
    setSelectedAnswer(idx);
    setTestAnswered(true);
    if (idx === testQuestion.correctIdx && !xpClaimed) {
      setXpClaimed(true);
      onRegisterXp(15); // Register XP for learning Bollywood terminology
    }
  };

  const handleResetTest = () => {
    setTestAnswered(false);
    setSelectedAnswer(null);
  };

  return (
    <div className={`p-6 md:p-8 rounded-3xl border transition-all duration-300 ${
      theme === "dark" 
        ? "bg-stone-900/40 border-white/5 text-white" 
        : "bg-white border-stone-200 text-stone-900 shadow-md"
    }`} id="bolly-education-academy">
      
      {/* Film track header border accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500 opacity-20" style={{
        backgroundImage: "radial-gradient(circle, #fff 1.5px, transparent 2px)"
      }} />

      {/* Main Header */}
      <div className="border-b border-white/10 pb-5 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase font-mono font-black text-[#E50914] bg-[#E50914]/10 border border-[#E50914]/25 px-2.5 py-1 rounded inline-block">
            🧠 School of Cinema Academy 🧠
          </span>
          <h2 className="text-2xl md:text-3xl font-display font-black tracking-tight mt-1.5 flex items-center gap-1.5">
            <BookOpen className="w-6 h-6 text-amber-500" />
            Educational Masterclass Mode
          </h2>
          <p className={`text-xs mt-1.5 ${theme === "dark" ? "text-stone-400" : "text-stone-600"}`}>
            Learn the historical evolution, master the complex vocabulary terms, and research the legacy composers & designers of Indian Cinema.
          </p>
        </div>

        {/* Navigation buttons */}
        <div className="flex bg-black/40 border border-stone-850 p-1 rounded-xl gap-1 overflow-x-auto whitespace-nowrap scrollbar-none w-full md:w-auto">
          {[
            { id: "history", label: "Film History 📜" },
            { id: "glossary", label: "Filmy Dictionary 🗣️" },
            { id: "pioneers", label: "Spotlight Pioneers 🌟" },
            { id: "test", label: "Mini Exam Test 📝" }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveEduTab(item.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-display cursor-pointer transition ${
                activeEduTab === item.id
                  ? "bg-[#E50914] text-white shadow-md scale-105"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* DYNAMIC VIEW FOR EDUCATION SUB-TAB */}
      
      {/* Tab 1: Film History */}
      {activeEduTab === "history" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DECADES_DB.map((dec, idx) => (
              <div key={idx} className="bg-stone-950/80 border border-stone-850 rounded-2xl p-5 hover:border-amber-400/20 transition-all duration-300 space-y-3 relative overflow-hidden">
                <span className="absolute top-2 right-4 text-3xl font-mono font-black text-white/5 select-none">{dec.label}</span>
                <div className="flex items-center gap-2">
                  <span className="bg-amber-500/10 text-amber-400 border border-amber-500/25 text-[11px] font-mono px-2 py-0.5 rounded uppercase font-bold">
                    {dec.label} Era
                  </span>
                  <h4 className="text-sm font-sans font-black text-white">{dec.title}</h4>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed font-sans">{dec.desc}</p>
                
                <div className="bg-black/60 p-3 rounded-xl border border-stone-850 text-[10px] text-amber-400 leading-normal flex items-start gap-1.5">
                  <Award className="w-3.5 h-3.5 shrink-0 text-amber-500 mt-0.5" />
                  <span><strong>Milestone Award:</strong> {dec.milestone}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Filmy Glossary Dictionary */}
      {activeEduTab === "glossary" && (
        <div className="space-y-6 animate-fadeIn">
          <span className="text-[10px] font-mono text-stone-500 uppercase font-black tracking-wider block">🗣️ Elite Term Definitions & Pronunciation Guides:</span>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DICTIONARY_DB.map((item, idx) => (
              <div key={idx} className="bg-[#121212] border border-white/10 rounded-2xl p-5 space-y-3">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <h3 className="text-base font-display font-black text-white uppercase tracking-tight">{item.term}</h3>
                    <code className="text-[9px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded block mt-1">pronounce: /{item.pronounce}/</code>
                  </div>
                  <span className="text-xl">🗣️</span>
                </div>

                <p className="text-xs text-stone-300 leading-relaxed font-sans">{item.definition}</p>
                
                <div className="border-t border-white/5 pt-2.5 text-[10px] text-stone-400 leading-normal font-sans italic">
                  <strong>Cultural Impact:</strong> {item.culturalImpact}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Legendary Spotlights Pioneers */}
      {activeEduTab === "pioneers" && (
        <div className="space-y-6 animate-fadeIn grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Composers & Lyricists */}
          <div className="bg-stone-950/80 border border-stone-850 p-5 rounded-3xl space-y-4">
            <h3 className="text-xs uppercase font-mono text-amber-500 tracking-wider font-black flex items-center gap-1.5">
              <Music className="w-4 h-4 text-amber-500" />
              Music Sovereigns & Composers
            </h3>

            <div className="space-y-3">
              {[
                { name: "R.D. Burman (Pancham)", role: "1970s Synth Pioneer", bio: "Introduced brass sections, progressive Latin rock beats, and whistling synthesis loops to core melody structures.", tracks: "Sholay, Yaadon Ki Baaraat" },
                { name: "A.R. Rahman", role: "1990s Digital Genius", bio: "Fused electronic synthesizers, classical Sufi structures, and raw strings to give Indian soundscapes a Grammy-award-winning aesthetic.", tracks: "Roja, Dil Se, Slumdog Millionaire" }
              ].map((p, idx) => (
                <div key={idx} className="bg-black/60 border border-stone-900 p-3.5 rounded-2xl space-y-1">
                  <strong className="text-xs text-white block">{p.name} <span className="text-[9px] font-mono text-stone-400">({p.role})</span></strong>
                  <p className="text-[11px] text-stone-300 font-sans leading-relaxed">{p.bio}</p>
                  <span className="text-[9px] font-mono text-amber-500 block">Historic Tracks: {p.tracks}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Choreographers & Designers */}
          <div className="bg-stone-950/80 border border-stone-850 p-5 rounded-3xl space-y-4">
            <h3 className="text-xs uppercase font-mono text-red-500 tracking-wider font-black flex items-center gap-1.5">
              <Film className="w-4 h-4 text-red-500" />
              Visual Sovereigns & Visuals
            </h3>

            <div className="space-y-3">
              {[
                { name: "Saroj Khan (Masterji)", role: "Elite Choreography Legend", bio: "Pioneered the complex hand gesture expressions ('Adaa') and expressive classical counts that ruled 1980/90s cinematic items.", items: "Dhak Dhak, Ek Do Teen" },
                { name: "Binod Pradhan & Santosh Sivan", role: "Cinematography Sovereigns", bio: "Brought gorgeous golden light glows, sweeping crane coordinates, and rain tracking shots that defined 'Devdas' and 'Dil Se'.", items: "Devdas, Roja, Dil Se" }
              ].map((p, idx) => (
                <div key={idx} className="bg-black/60 border border-stone-900 p-3.5 rounded-2xl space-y-1">
                  <strong className="text-xs text-white block">{p.name} <span className="text-[9px] font-mono text-stone-400">({p.role})</span></strong>
                  <p className="text-[11px] text-stone-300 font-sans leading-relaxed">{p.bio}</p>
                  <span className="text-[9px] font-mono text-red-400 block">Iconic Masterworks: {p.items}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Tab 4: Terminology Trivia Test */}
      {activeEduTab === "test" && (
        <div className="space-y-5 animate-fadeIn max-w-2xl mx-auto py-4">
          <div className="text-center space-y-1.5">
            <h3 className="text-lg font-sans font-black text-rose-500 flex items-center justify-center gap-1.5">
              <HelpCircle className="w-5 h-5 text-rose-500 animate-bounce" />
              Academy Mini Terminology Exam
            </h3>
            <p className="text-xs text-stone-300">Answer this quick vocabulary question correctly to unlock 15 XP immediately!</p>
          </div>

          <div className="bg-stone-950 p-5 rounded-3xl border border-stone-850 space-y-4">
            <p className="text-xs font-mono font-bold text-white text-center leading-relaxed">
              {testQuestion.q}
            </p>

            <div className="space-y-2">
              {testQuestion.options.map((option, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrectIdx = idx === testQuestion.correctIdx;
                
                let btnStyle = "bg-stone-900 border-stone-800 text-stone-300 hover:border-[#E50914] hover:bg-[#E50914]/10";
                if (testAnswered) {
                  if (isCorrectIdx) btnStyle = "bg-emerald-500/10 border-emerald-500 text-emerald-400";
                  else if (isSelected) btnStyle = "bg-red-500/10 border-red-500 text-red-400";
                  else btnStyle = "bg-stone-950 border-stone-900 text-stone-600 pointer-events-none";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleConfirmTest(idx)}
                    disabled={testAnswered}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs font-sans leading-normal font-medium transition duration-300 cursor-pointer flex items-start gap-2.5 ${btnStyle}`}
                  >
                    <span className="font-mono text-amber-500 shrink-0 font-bold uppercase">{String.fromCharCode(65 + idx)}.</span>
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>

            {testAnswered && (
              <div className="border-t border-white/5 pt-4 space-y-3 block animate-fadeIn">
                <div className="flex items-center gap-2 text-xs font-bold leading-none justify-center">
                  {selectedAnswer === testQuestion.correctIdx ? (
                    <span className="text-emerald-400 uppercase font-black tracking-wider flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      ★ CORRECT ANSWER (+15 XP EARNED) ★
                    </span>
                  ) : (
                    <span className="text-red-400 uppercase font-black tracking-wider flex items-center gap-1">
                      <XCircle className="w-4 h-4" />
                      Incorrect Choice
                    </span>
                  )}
                </div>

                <p className="text-xs text-stone-300 leading-normal text-center bg-[#121212] p-3 rounded-2xl italic font-sans max-w-lg mx-auto border-l-4 border-l-amber-500">
                  {testQuestion.explanation}
                </p>

                <div className="text-center">
                  <button
                    onClick={handleResetTest}
                    className="py-1 px-3 bg-stone-950 border border-stone-850 text-stone-400 hover:text-white transition rounded-xl text-[9px] font-mono cursor-pointer uppercase"
                  >
                    Solve Another Attempt
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
