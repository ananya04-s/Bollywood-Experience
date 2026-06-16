import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Sparkles, Volume2, VolumeX, Mic, MicOff, RefreshCw } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function BollyGPTChat({ onRegisterXp }: { onRegisterXp: (amount: number) => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Namaste filmy dosto! 🎬 I am BollyGPT, your personal AI Bollywood companion! Ask me for gold-standard recommendations, box office secrets, script trivia, or legendary memories. Picture abhi baaki hai mere dost! Ask me any filmy puzzle!",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [listening, setListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "Recommend emotional songs from the 2000s.",
    "Suggest family-friendly comedy movies.",
    "Find dance numbers for a wedding.",
    "Recommended retro disco soundtracks.",
    "Settles debate: 3 Idiots vs Dangal?",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const speakText = (text: string) => {
    if (!speechEnabled) return;
    try {
      window.speechSynthesis.cancel();
      // clean emoticons for cleaner reading
      const cleanText = text.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "");
      const utterance = new SpeechSynthesisUtterance(cleanText);
      
      // Look for Hindi or British English voice for that authentic filmy accent!
      const voices = window.speechSynthesis.getVoices();
      const hindiVoice = voices.find(v => v.lang.includes("hi-IN") || v.lang.includes("en-IN"));
      if (hindiVoice) {
        utterance.voice = hindiVoice;
      }
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error("Speech Synthesis failed", e);
    }
  };

  const handleSend = async (messageText: string) => {
    if (!messageText.trim() || loading) return;

    const userMsg: ChatMessage = { role: "user", content: messageText };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await response.json();
      if (data.response) {
        const botMsg: ChatMessage = { role: "assistant", content: data.response };
        setMessages([...updatedMessages, botMsg]);
        speakText(data.response);
        onRegisterXp(15); // Earn 15 XP for AI discussion
      }
    } catch (err) {
      console.error(err);
      const errMsg: ChatMessage = { 
        role: "assistant", 
        content: "Arey yaar! It seems like the internet reel is jammed. Let's try reloading or search again! Meanwhile: 'All Iz Well!'" 
      };
      setMessages([...updatedMessages, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Web Speech API Voice Dictation Support
  const handleVoiceSearch = () => {
    const SpeechRecognition = 
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice recognition is not supported on your current browser. Try Chrome/Safari!");
      return;
    }

    if (listening) {
      setListening(false);
      return;
    }

    const rec = new SpeechRecognition();
    rec.lang = "en-IN"; // Set to Indo-English / Hindi-English support
    rec.continuous = false;
    rec.interimResults = false;

    rec.onstart = () => {
      setListening(true);
    };

    rec.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInputMessage(transcript);
    };

    rec.onerror = (e: any) => {
      console.error(e);
      setListening(false);
    };

    rec.onend = () => {
      setListening(false);
    };

    rec.start();
  };

  return (
    <div className="bg-[#141414] rounded-2xl border border-stone-850 max-w-4xl mx-auto flex flex-col h-[520px] text-white shadow-2xl overflow-hidden" id="bollygpt-chat-workspace">
      {/* Header */}
      <div className="bg-[#1c1c1c] px-6 py-4 border-b border-stone-850 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#E50914] rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-sans font-black text-white tracking-tight">BollyGPT AI Companion</h2>
              <span className="bg-emerald-500/15 text-emerald-400 text-[9px] px-2.5 py-0.5 rounded-full font-sans font-extrabold uppercase tracking-wide">
                Live
              </span>
            </div>
            <p className="text-[11px] text-stone-400 italic">"Rishte mein toh hum tumhare recommendation engine lagte hain!"</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio Output Selector */}
          <button
            onClick={() => {
              const nextState = !speechEnabled;
              setSpeechEnabled(nextState);
              if (!nextState) window.speechSynthesis.cancel();
            }}
            title={speechEnabled ? "Disable Text-to-Speech" : "Enable Text-to-Speech"}
            className={`p-2 rounded-lg border transition duration-300 ${
              speechEnabled
                ? "bg-[#E50914]/20 text-[#E50914] border-[#E50914]/30"
                : "bg-stone-900 text-stone-400 border-stone-800 hover:border-[#E50914]/20 hover:text-white"
            }`}
          >
            {speechEnabled ? <Volume2 className="w-4 h-4 animate-bounce" /> : <VolumeX className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => setMessages([messages[0]])}
            className="p-2 bg-stone-900 text-stone-400 border border-stone-800 rounded-lg hover:text-white hover:border-[#E50914]/30 font-sans text-xs flex items-center gap-1 cursor-pointer transition duration-300"
            title="Reset Conversation"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      </div>

      {/* Messages Sandbox */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-stone-950/40">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-lg ${
                m.role === "user"
                  ? "bg-[#E50914] text-white font-sans font-bold rounded-tr-none"
                  : "bg-stone-900 text-stone-200 border border-stone-800/80 rounded-tl-none"
              }`}
            >
              {m.role === "assistant" && (
                <div className="text-[10px] uppercase font-sans text-[#E50914] font-black mb-1 tracking-wider">
                  BollyGPT AI
                </div>
              )}
              <p className="whitespace-pre-wrap">{m.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-stone-900 text-stone-400 border border-stone-850 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2 shadow-sm">
              <span className="flex gap-1">
                <span className="w-2 h-2 bg-[#E50914] rounded-full animate-bounce delay-100"></span>
                <span className="w-2 h-2 bg-[#E50914] rounded-full animate-bounce delay-200"></span>
                <span className="w-2 h-2 bg-[#E50914] rounded-full animate-bounce delay-300"></span>
              </span>
              <span className="text-[11px] font-sans font-medium">BollyGPT is scripting a reply...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions Tray */}
      <div className="bg-stone-900 px-6 py-2 border-t border-stone-850 flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none scroll-smooth">
        <span className="text-[10px] uppercase font-sans font-bold text-stone-500">Filmy Prompts:</span>
        {suggestions.map((s, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(s)}
            className="text-[11px] bg-stone-950 hover:bg-[#E50914]/15 text-stone-300 border border-stone-850 py-1 px-3 rounded-full cursor-pointer transition duration-300 hover:text-white"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="bg-stone-900 px-6 py-4 border-t border-stone-850 flex items-center gap-3">
        {/* Voice dictation toggle */}
        <button
          onClick={handleVoiceSearch}
          className={`p-2.5 rounded-xl border transition duration-300 ${
            listening
              ? "bg-[#E50914]/20 text-white border-[#E50914]/40 animate-pulse"
              : "bg-stone-950 border-stone-850 text-stone-400 hover:text-white hover:border-[#E50914]/20"
          }`}
          title="Dictate message (Bilingual)"
        >
          {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          type="text"
          placeholder={listening ? "Listening closely... speak now!" : "Ask BollyGPT about characters, reviews, histories..."}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend(inputMessage)}
          className="flex-1 bg-stone-950 text-xs text-stone-100 placeholder-stone-500 border border-stone-850 rounded-xl px-4 py-3 focus:outline-none focus:border-[#E50914] transition duration-300"
        />

        <button
          onClick={() => handleSend(inputMessage)}
          disabled={!inputMessage.trim() || loading}
          className="p-3 bg-[#E50914] hover:bg-[#b00710] text-white rounded-xl cursor-pointer transition duration-300 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
