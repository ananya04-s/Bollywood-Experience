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
    "Recommend comedy movies for family.",
    "Which Shah Rukh Khan movie should I watch first?",
    "Best movies of 2010.",
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
    <div className="glass-panel rounded-2xl border border-gold-500/20 max-w-4xl mx-auto flex flex-col h-[520px] text-white shadow-xl overflow-hidden" id="bollygpt-chat-workspace">
      {/* Header */}
      <div className="bg-cinema-dark/80 px-6 py-4 border-b border-gold-500/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-gold-600 to-gold-400 rounded-xl flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 text-cinema-dark" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-display font-semibold text-white">BollyGPT Companion</h2>
              <span className="bg-emerald-500/20 text-emerald-400 text-[9px] px-2 py-0.5 rounded-full font-mono uppercase tracking-wide">
                Active Live
              </span>
            </div>
            <p className="text-xs text-gold-300/80 italic font-medium">"Rishte mein toh hum tumhare recommendation engine lagte hain!"</p>
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
            className={`p-2 rounded-lg border transition ${
              speechEnabled
                ? "bg-gold-500/20 text-gold-400 border-gold-500/30"
                : "bg-cinema-dark/60 text-gray-400 border-white/10 hover:border-gold-500/20"
            }`}
          >
            {speechEnabled ? <Volume2 className="w-4 h-4 animate-bounce" /> : <VolumeX className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => setMessages([messages[0]])}
            className="p-2 bg-cinema-dark/60 text-gray-400 border border-white/10 rounded-lg hover:text-white hover:border-gold-500/20 font-mono text-xs flex items-center gap-1 cursor-pointer"
            title="Reset Conversation"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      </div>

      {/* Messages Sandbox */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-cinema-dark/20">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                m.role === "user"
                  ? "bg-gradient-to-r from-gold-600/80 to-gold-500/70 text-cinema-dark font-medium shadow-md rounded-tr-none"
                  : "bg-[#161616] text-gray-200 border border-gold-500/10 rounded-tl-none"
              }`}
            >
              {m.role === "assistant" && (
                <div className="text-[10px] uppercase font-mono text-gold-400 font-bold mb-1 tracking-wider">
                  BollyGPT AI
                </div>
              )}
              <p className="whitespace-pre-wrap">{m.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#161616] text-gray-400 border border-gold-500/5 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2">
              <span className="flex gap-1">
                <span className="w-2 h-2 bg-gold-400 rounded-full animate-bounce delay-100"></span>
                <span className="w-2 h-2 bg-gold-400 rounded-full animate-bounce delay-200"></span>
                <span className="w-2 h-2 bg-gold-400 rounded-full animate-bounce delay-300"></span>
              </span>
              <span className="text-[11px] font-mono">BollyGPT is scripting a reply...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions Tray */}
      <div className="bg-cinema-dark/40 px-6 py-2 border-t border-gold-500/5 flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none scroll-smooth">
        <span className="text-[10px] uppercase font-mono text-gray-500">Filmy Prompts:</span>
        {suggestions.map((s, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(s)}
            className="text-[11px] bg-[#141414] hover:bg-gold-500/10 text-gold-300 border border-gold-500/15 py-1 px-3 rounded-full cursor-pointer transition-colors"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="bg-cinema-dark px-6 py-4 border-t border-gold-500/10 flex items-center gap-3">
        {/* Voice dictation toggle */}
        <button
          onClick={handleVoiceSearch}
          className={`p-2.5 rounded-xl border transition ${
            listening
              ? "bg-red-500/20 text-red-400 border-red-500/30 animate-pulse"
              : "bg-cinema-dark border-white/10 text-gray-400 hover:text-white hover:border-gold-500/20"
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
          className="flex-1 bg-[#141414] text-xs text-white placeholder-gray-500 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-gold-500"
        />

        <button
          onClick={() => handleSend(inputMessage)}
          disabled={!inputMessage.trim() || loading}
          className="p-3 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-cinema-dark rounded-xl cursor-pointer transition disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
