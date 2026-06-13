import React, { useState } from "react";
import { Sparkles, Film, Heart, Languages, Lock, Mail, User, Bookmark } from "lucide-react";

interface BollyverseAuthProps {
  onLogin: (profileData: {
    username: string;
    avatar: string;
    favoriteActor: string;
    favoriteGenre: string;
    preferredLanguage: "en" | "hi";
    email: string;
  }) => void;
  theme: "dark" | "light";
}

export default function BollyverseAuth({ onLogin, theme }: BollyverseAuthProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [favoriteActor, setFavoriteActor] = useState("Shah Rukh Khan");
  const [favoriteGenre, setFavoriteGenre] = useState("Romantic");
  const [preferredLanguage, setPreferredLanguage] = useState<"en" | "hi">("en");
  const [selectedAvatar, setSelectedAvatar] = useState("srk_fan");
  const [errorStatus, setErrorStatus] = useState("");

  const AVATARS = [
    { id: "srk_fan", name: "Rahul (SRK Fan)", emoji: "🪐", color: "from-amber-500 to-red-650" },
    { id: "deepika_fan", name: "Shanti (Deepika Wave)", emoji: "💃", color: "from-purple-500 to-pink-500" },
    { id: "genz_rocky", name: "Rocky (Gen-Z Masala)", emoji: "🕶️", color: "from-blue-500 to-indigo-650" },
    { id: "classic_madhuri", name: "Madhuri (Choreography Legend)", emoji: "🪕", color: "from-red-500 to-amber-600" },
    { id: "aamir_genius", name: "Kabir (The Perfectionist)", emoji: "🎓", color: "from-emerald-500 to-teal-650" }
  ];

  const ACTORS_LIST = [
    "Shah Rukh Khan",
    "Deepika Padukone",
    "Ranbir Kapoor",
    "Alia Bhatt",
    "Aamir Khan",
    "Salman Khan",
    "Hrithik Roshan",
    "Katrina Kaif",
    "Kajol",
    "Madhuri Dixit"
  ];

  const GENRES_LIST = [
    "Romantic",
    "Action",
    "Comedy",
    "Thriller",
    "Drama",
    "Musical",
    "Inspirational",
    "Folk"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorStatus("");

    if (!email.trim() || !password.trim()) {
      setErrorStatus("Arey yaar! Please fill in all credentials.");
      return;
    }

    if (isSignUp && !username.trim()) {
      setErrorStatus("Please enter an iconic username to greet you!");
      return;
    }

    // Default username if logging in
    const finalUsername = username.trim() || email.split("@")[0] || "Filmy Buff";
    
    const userProfile = {
      username: finalUsername,
      avatar: selectedAvatar,
      favoriteActor,
      favoriteGenre,
      preferredLanguage,
      email: email.trim()
    };

    onLogin(userProfile);
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500 ${
      theme === "dark" ? "bg-[#0b080a] text-stone-100" : "bg-[#f4f2f0] text-stone-900"
    }`} id="auth-screen">
      {/* Dynamic Background Flares */}
      <div className="absolute top-[-10%] right-[-10%] w-[450px] h-[450px] rounded-full filter blur-[120px] opacity-30 bg-red-650 animate-pulse duration-5000" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[450px] h-[450px] rounded-full filter blur-[120px] opacity-25 bg-amber-500 animate-pulse duration-7000" />

      {/* Decorative Film Reel elements */}
      <div className="absolute -left-12 -top-12 opacity-5 select-none pointer-events-none transform -rotate-12">
        <div className="w-64 h-64 border-[16px] border-dashed border-current rounded-full" />
      </div>
      <div className="absolute -right-20 -bottom-20 opacity-5 select-none pointer-events-none transform rotate-45 animate-spin-slow">
        <div className="w-80 h-80 border-[20px] border-dashed border-current rounded-full" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        <div className={`rounded-3xl p-8 backdrop-blur-xl border transition-all duration-300 ${
          theme === "dark" 
            ? "bg-[#120F11]/85 border-white/5 shadow-[0_20px_50px_rgba(229,9,20,0.15)]" 
            : "bg-white/90 border-[#E50914]/15 shadow-[0_20px_50px_rgba(115,10,12,0.1)]"
        }`}>
          {/* Logo Heading */}
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-[#E50914] text-white font-display font-black text-3xl tracking-tighter shadow-[0_0_25px_rgba(229,9,20,0.5)] rounded-2xl animate-bounce duration-3000">
              BV
            </div>
            <h1 className="text-3xl font-display font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#E50914] via-amber-400 to-[#E50914]">
              BollywoodVerse AI
            </h1>
            <p className={`text-xs font-medium tracking-wide uppercase font-mono ${
              theme === "dark" ? "text-stone-400" : "text-stone-600"
            }`}>
              ★ THE PREMIUM CINEMATIC FAN SPHERE ★
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {errorStatus && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl text-xs font-mono text-center">
                ⚠ {errorStatus}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider font-mono text-stone-400 font-bold block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@bollywoodfan.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full py-3 pl-11 pr-4 text-xs font-sans rounded-xl outline-none border transition-all ${
                    theme === "dark"
                      ? "bg-stone-900/60 border-white/5 text-stone-100 placeholder-stone-600 focus:border-red-500"
                      : "bg-stone-50 border-stone-200 text-stone-900 placeholder-stone-400 focus:border-red-500"
                  }`}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider font-mono text-stone-400 font-bold block">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full py-3 pl-11 pr-4 text-xs font-sans rounded-xl outline-none border transition-all ${
                    theme === "dark"
                      ? "bg-stone-900/60 border-white/5 text-stone-100 placeholder-stone-700 focus:border-red-500"
                      : "bg-stone-50 border-stone-200 text-stone-900 placeholder-stone-400 focus:border-red-500"
                  }`}
                />
              </div>
            </div>

            {isSignUp && (
              <div className="space-y-5 animate-fadeIn">
                {/* Username */}
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider font-mono text-stone-400 font-bold block">
                    Your Filmy Name / Nickname
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. Raj Malhotra"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className={`w-full py-3 pl-11 pr-4 text-xs font-sans rounded-xl outline-none border transition-all ${
                        theme === "dark"
                          ? "bg-stone-900/60 border-white/5 text-stone-100 focus:border-red-500"
                          : "bg-stone-50 border-stone-200 text-stone-900 focus:border-red-500"
                      }`}
                    />
                  </div>
                </div>

                {/* Favorite Actor */}
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider font-mono text-stone-400 font-bold block">
                    Favorite Superstar Anchor
                  </label>
                  <select
                    value={favoriteActor}
                    onChange={(e) => setFavoriteActor(e.target.value)}
                    className={`w-full p-3 text-xs rounded-xl outline-none border appearance-none ${
                      theme === "dark"
                        ? "bg-stone-900 text-stone-100 border-white/5 focus:border-amber-400"
                        : "bg-stone-50 text-stone-900 border-stone-200 focus:border-amber-400"
                    }`}
                  >
                    {ACTORS_LIST.map(act => (
                      <option key={act} value={act}>{act}</option>
                    ))}
                  </select>
                </div>

                {/* Favorite Genre */}
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider font-mono text-stone-400 font-bold block">
                    Core Bollywood Genre Preference
                  </label>
                  <select
                    value={favoriteGenre}
                    onChange={(e) => setFavoriteGenre(e.target.value)}
                    className={`w-full p-3 text-xs rounded-xl outline-none border appearance-none ${
                      theme === "dark"
                        ? "bg-stone-900 text-stone-100 border-white/5 focus:border-pink-500"
                        : "bg-stone-50 text-stone-900 border-stone-200 focus:border-pink-500"
                    }`}
                  >
                    {GENRES_LIST.map(gen => (
                      <option key={gen} value={gen}>{gen}</option>
                    ))}
                  </select>
                </div>

                {/* Language preference */}
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider font-mono text-stone-400 font-bold block">
                    Preferred Interaction Language
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setPreferredLanguage("en")}
                      className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        preferredLanguage === "en"
                          ? "bg-red-500/10 border-red-500 text-red-500"
                          : theme === "dark" 
                            ? "border-white/5 bg-stone-900 text-stone-400 hover:text-white" 
                            : "border-stone-200 bg-stone-50 text-stone-500 hover:text-stone-800"
                      }`}
                    >
                      <Languages className="w-4 h-4" /> English
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreferredLanguage("hi")}
                      className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        preferredLanguage === "hi"
                          ? "bg-red-500/10 border-red-500 text-red-500"
                          : theme === "dark" 
                            ? "border-white/5 bg-stone-900 text-stone-400 hover:text-white" 
                            : "border-stone-200 bg-stone-50 text-stone-500 hover:text-stone-800"
                      }`}
                    >
                      <Languages className="w-4 h-4" /> हिंदी
                    </button>
                  </div>
                </div>

                {/* Avatar avatar selection */}
                <div className="space-y-2">
                  <label className="text-[11px] uppercase tracking-wider font-mono text-stone-400 font-bold block">
                    Choose Your Cinematic Persona Avatar
                  </label>
                  <div className="grid grid-cols-1 gap-2.5 max-h-48 overflow-y-auto p-1.5 border border-white/5 rounded-xl bg-stone-900/40">
                    {AVATARS.map((av) => (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => setSelectedAvatar(av.id)}
                        className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition duration-300 ${
                          selectedAvatar === av.id
                            ? "border-amber-400 bg-amber-400/5 shadow-md"
                            : "border-transparent hover:bg-stone-800/40"
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${av.color} flex items-center justify-center text-xl shadow-inner`}>
                          {av.emoji}
                        </div>
                        <div>
                          <strong className={`text-xs block ${
                            selectedAvatar === av.id ? "text-amber-300" : theme === "dark" ? "text-stone-200" : "text-stone-800"
                          }`}>{av.name}</strong>
                          <span className="text-[10px] text-stone-400 block font-sans">Custom interface badge unlocked</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 mt-2 bg-gradient-to-r from-[#E50914] to-amber-500 hover:from-amber-600 hover:to-[#E50914] transition-all duration-300 text-white font-bold text-xs rounded-xl shadow-[0_5px_20px_rgba(229,9,20,0.3)] hover:scale-[1.01] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider"
            >
              <Sparkles className="w-4 h-4" />
              {isSignUp ? "Create Custom Profile" : "Instant Secure Access"}
            </button>
          </form>

          {/* Social login option mocks */}
          <div className="mt-6 pt-5 border-t border-white/5 text-center space-y-4">
            <div className="text-[10px] uppercase font-mono text-stone-500 tracking-wider font-bold">Or authenticate with secure social accounts</div>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => {
                  const demoSocial = {
                    username: "Sahil (Google G-Star)",
                    avatar: "srk_fan",
                    favoriteActor: "Shah Rukh Khan",
                    favoriteGenre: "Romantic",
                    preferredLanguage: "en" as const,
                    email: "sahil@gmail.com"
                  };
                  onLogin(demoSocial);
                }}
                className={`py-2 px-6 rounded-xl text-xs font-bold font-sans flex items-center gap-2 border transition cursor-pointer hover:bg-stone-500/10 ${
                  theme === "dark" ? "bg-stone-900 border-white/5 text-stone-300" : "bg-white border-stone-200 text-stone-700 shadow-sm"
                }`}
              >
                <span className="text-red-500 font-extrabold font-mono">G</span> Enter as Guest
              </button>
            </div>

            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs text-[#E50914] hover:underline font-bold transition focus:outline-none cursor-pointer inline-block"
            >
              {isSignUp ? "Already have a custom profile? Login Now" : "Don't have a curated profile yet? Register Profile & Preferences"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
