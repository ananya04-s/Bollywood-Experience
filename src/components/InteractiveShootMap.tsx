import React, { useState } from "react";
import { MapPin, Compass, Tv, Info, Music, Navigation, RotateCcw, AlertCircle, ArrowRight } from "lucide-react";

interface ShootingLocation {
  id: string;
  movie: string;
  name: string;
  country: string;
  coords: { x: number; y: number }; // Percentage for custom Map container
  scene: string;
  trivia: string;
  route: string;
  soundtrack: string;
}

const LOCATIONS_DB: ShootingLocation[] = [
  // DDLJ
  {
    id: "ddlj-switz",
    movie: "Dilwale Dulhania Le Jayenge",
    name: "Zweisimmen & Gstaad (Alps)",
    country: "Switzerland 🇨🇭",
    coords: { x: 42, y: 35 },
    scene: "Simran misses her train and Raj offers her a ride on a motorcycle. Saanen church where they pray.",
    trivia: "The Saanen church scene holds regular tourists seeking to re-enact SRK's kneel-prayer posture. The local government put up a decorative board acknowledging Yash Chopra's contributions.",
    route: "Fly to Zurich, boards Bernese Oberland railway lines directly to Zweisimmen station.",
    soundtrack: "Tujhe Dekha Toh Yeh Jaana"
  },
  {
    id: "ddlj-london",
    movie: "Dilwale Dulhania Le Jayenge",
    name: "Trafalgar Square & King's Cross",
    country: "United Kingdom 🇬🇧",
    coords: { x: 38, y: 31 },
    scene: "Bauji feeds pigeons in Trafalgar Square while missing his homeland. London King's Cross is where the train trip starts.",
    trivia: "Trafalgar Square feeding is now strictly regulated, but tourists continue purchasing grain secretly to mirror Amrish Puri's stance.",
    route: "Direct metro lines to London St. Pancras / King's Cross station.",
    soundtrack: "Ghar Aaja Pardesi"
  },
  {
    id: "ddlj-punjab",
    movie: "Dilwale Dulhania Le Jayenge",
    name: "Mustard Fields of Jalandhar",
    country: "India (Punjab) 🇮🇳",
    coords: { x: 55, y: 48 },
    scene: "Simran and Raj reunite dynamically in endless yellow mustard fields with SRK's open-arms gesture.",
    trivia: "Yash Chopra spent days searching for the perfect dense yellow fields, cementing the 'Sarson ke Khet' aesthetic forever into romance history.",
    route: "Fly to Amritsar, take local taxis past Phillaur / Jalandhar bypass roads.",
    soundtrack: "Tujhe Dekha Toh Yeh Jaana"
  },
  // ZNMD
  {
    id: "znmd-barcelona",
    movie: "Zindagi Na Milegi Dobara",
    name: "Barcelona Gothic Quarter",
    country: "Spain 🇪🇸",
    coords: { x: 40, y: 42 },
    scene: "Three friends meet and drive past legendary catalonian monuments inside a sky-blue vintage 1969 Buick convertible.",
    trivia: "The vintage car utilized in the movie belonged to a local Spanish collector who was extremely hesitant to let them drive it around sharp corners.",
    route: "Direct international flights to Barcelona-El Prat. Road trips past Monserrat.",
    soundtrack: "Ik Junoon (Paint It Red)"
  },
  {
    id: "znmd-bunol",
    movie: "Zindagi Na Milegi Dobara",
    name: "Buñol Tomato Festival",
    country: "Spain 🇪🇸",
    coords: { x: 39, y: 45 },
    scene: "The boys participate in a high-octane Tomatina festival in colorful street sequences.",
    trivia: "To shoot the scene genuinely, the crew imported 16 tons of real tomatoes all the way from Portugal specifically since local Spanish harvest seasons were slightly off-schedule.",
    route: "Take a regional train from Valencia directly to Bunol city center (approx 45 mins).",
    soundtrack: "Ik Junoon"
  },
  {
    id: "znmd-seville",
    movie: "Zindagi Na Milegi Dobara",
    name: "Skydive Center Seville",
    country: "Spain 🇪🇸",
    coords: { x: 35, y: 48 },
    scene: "Arjun (Hrithik) conquers his deep fear of heights by participating in a tandem skydive jump over Spain plain lands.",
    trivia: "Hrithik Roshan didn't use a double for most skydive angles, as he is an experienced certified leisure diver and high adventure sports fan.",
    route: "Drive past Autovia A-49 from Seville towards Portugal border points.",
    soundtrack: "Khaabon Ke Parindey"
  },
  // YJHD
  {
    id: "yjhd-manali",
    movie: "Yeh Jawaani Hai Deewani",
    name: "Gulaba & Hadimba (Manali)",
    country: "India (Himachal) 🇮🇳",
    coords: { x: 56, y: 44 },
    scene: "Bunny, Naina, Kabir, and Aditi participate in snowman trekking battles past steep high-mountain terrains.",
    trivia: "The camp scenes represented as high peak Jammu landscapes were actually shot on freezing slopes in Gulaba, past Manali.",
    route: "Take overnight sleepers from New Delhi to Manali, then hire local SUVs to Rohtang Pass paths.",
    soundtrack: "Subhanallah"
  },
  {
    id: "yjhd-udaipur",
    movie: "Yeh Jawaani Hai Deewani",
    name: "The Oberoi Udaivilas Palace",
    country: "India (Rajasthan) 🇮🇳",
    coords: { x: 54, y: 52 },
    scene: "Aditi's majestic family destination wedding. Bunny and Naina reconcile past starry poolside benches.",
    trivia: "Booking rooms in Oberoi Udaivilas shot up by 150% in the years following the film release, as fans sought to replicate Bunny and Naina's romantic night walks.",
    route: "Fly directly to Maharana Pratap Airport in Udaipur, then take local lake boat shuttles.",
    soundtrack: "Kabira"
  },
  // Chennai Express
  {
    id: "ce-waterfall",
    movie: "Chennai Express",
    name: "Dudh Sagar Waterfalls",
    country: "India (Goa border) 🇮🇳",
    coords: { x: 55, y: 56 },
    scene: "The magnificent, high-speed train stops unexpectedly amidst gigantic cascading white waterfalls as Rahul (SRK) steps down.",
    trivia: "Dudh Sagar translates to 'Sea of Milk'. The railway track passes directly over the middle cascade of the waterfall, creating a sight that looks fictional.",
    route: "Take South Western Railway lines from Madgaon, getting down past Castle Rock junctions.",
    soundtrack: "Chennai Express Title Track"
  },
  {
    id: "ce-munnar",
    movie: "Chennai Express",
    name: "Munnar Tea Estates",
    country: "India (Kerala) 🇮🇳",
    coords: { x: 56, y: 60 },
    scene: "Rahul and Meenamma escape towards local tribal villages past endless rolling bright green tea plantation coordinates.",
    trivia: "Shoot coordinates include Devikulam tea valleys. The song 'Kashmir Main Tu Kanyakumari' was extensively shot in Munnar forests masquerading as Tamil/Kashmir coordinates.",
    route: "Fly to Kochi airport, boards local state transport buses up past Munnar hill routes.",
    soundtrack: "Kashmir Main Tu Kanyakumari"
  }
];

interface InteractiveShootMapProps {
  theme: "dark" | "light";
}

export default function InteractiveShootMap({ theme }: InteractiveShootMapProps) {
  const [selectedLoc, setSelectedLoc] = useState<ShootingLocation | null>(LOCATIONS_DB[0]);
  const [activeFilmFilter, setActiveFilmFilter] = useState<string>("All");

  const filteredLocations = activeFilmFilter === "All"
    ? LOCATIONS_DB
    : LOCATIONS_DB.filter(loc => loc.movie.includes(activeFilmFilter) || (activeFilmFilter === "DDLJ" && loc.id.startsWith("ddlj")) || (activeFilmFilter === "ZNMD" && loc.id.startsWith("znmd")) || (activeFilmFilter === "YJHD" && loc.id.startsWith("yjhd")) || (activeFilmFilter === "Chennai" && loc.id.startsWith("ce")));

  return (
    <div className={`p-6 md:p-8 rounded-3xl border transition-all duration-300 ${
      theme === "dark" 
        ? "bg-stone-900/45 border-white/5 text-white" 
        : "bg-white border-stone-200 text-stone-900 shadow-md"
    }`} id="shoot-map-sandbox">
      
      {/* Film Strip Header border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500 opacity-20" style={{
        backgroundImage: "radial-gradient(circle, #fff 1.5px, transparent 2px)"
      }} />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-5 mb-6">
        <div>
          <span className="text-[10px] uppercase font-mono font-black text-amber-500 bg-amber-500/10 border border-amber-500/25 px-2.5 py-1 rounded inline-block">
            ★ Cinematic Location Odyssey ★
          </span>
          <h2 className="text-2xl md:text-3xl font-display font-black tracking-tight mt-2 flex items-center gap-1.5">
            <Compass className="w-6 h-6 text-[#E50914] animate-spin-slow" />
            Interactive Shoot Locations Map
          </h2>
          <p className={`text-xs mt-1.5 ${theme === "dark" ? "text-stone-400" : "text-stone-600"}`}>
            Track famous shooting spots and vacation routes globally. Trace the Switzerland mountains, Spain Tomatina streets, and Indian green tea valleys!
          </p>
        </div>

        {/* Film select controls */}
        <div className="flex bg-black/40 border border-stone-850 p-1 rounded-xl gap-1 overflow-x-auto whitespace-nowrap scrollbar-none w-full md:w-auto">
          {["All", "DDLJ", "ZNMD", "YJHD", "Chennai"].map((film) => (
            <button
              key={film}
              onClick={() => {
                setActiveFilmFilter(film);
                // default selection to first matching
                const matched = LOCATIONS_DB.find(l => film === "All" ? true : l.id.startsWith(film === "Chennai" ? "ce" : film.toLowerCase()));
                if (matched) setSelectedLoc(matched);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-display cursor-pointer transition ${
                activeFilmFilter === film
                  ? "bg-[#E50914] text-white shadow"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              {film === "All" ? "All Odysseys" : `${film} spots`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* INTERACTIVE COORDINATES PLOT CANVAS (SPANNING 2 COLS) */}
        <div className="lg:col-span-2 space-y-4">
          <span className="text-[10px] font-mono text-stone-500 uppercase font-black tracking-wider block">🗺️ Live Interactive Shooting Radar:</span>
          
          <div className="relative border border-stone-850 bg-[#0c0c0c] rounded-3xl aspect-[1.78/1] overflow-hidden shadow-inner group">
            
            {/* World Grid simulation background */}
            <div className="absolute inset-0 bg-radial-grid opacity-30 select-none pointer-events-none" style={{
              backgroundImage: "radial-gradient(circle, #222 1px, transparent 1.5px)",
              backgroundSize: "20px 20px"
            }} />

            {/* Stylized vector continents simulation */}
            <div className="absolute inset-0 select-none opacity-10 pointer-events-none flex items-center justify-center font-display font-black text-[120px] text-white tracking-widest leading-none text-center">
              EUROPE & INDIA
            </div>

            {/* Decorative Map Scope */}
            <div className="absolute left-6 top-6 text-[10px] font-mono text-white/40 bg-black/80 p-2.5 rounded-xl border border-white/5 space-y-0.5">
              <p>RADAR FEED • VER 4.2</p>
              <p>COORDINATE SYNC: SECURE</p>
            </div>

            {/* Plot coordinates points matching LOCATIONS_DB */}
            {filteredLocations.map((loc) => {
              const isSelected = selectedLoc?.id === loc.id;
              return (
                <button
                  key={loc.id}
                  onClick={() => setSelectedLoc(loc)}
                  style={{ left: `${loc.coords.x}%`, top: `${loc.coords.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20"
                >
                  {/* Outer breathing ring */}
                  <span className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-all duration-1000 ${
                    isSelected 
                      ? "w-10 h-10 bg-yellow-500/30 animate-ping" 
                      : "w-6 h-6 bg-red-600/20 group-hover:bg-[#E50914]/40 scale-125"
                  }`} />

                  {/* Pin node */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border ${
                    isSelected
                      ? "bg-yellow-500 border-white text-black scale-125 shadow-lg shadow-yellow-500/40"
                      : "bg-[#E50914] border-stone-900 text-white group-hover:scale-110"
                  }`}>
                    <MapPin className="w-4 h-4" />
                  </div>

                  {/* Hover tooltip label */}
                  <span className="absolute left-1/2 -top-8 -translate-x-1/2 bg-black/90 border border-stone-800 text-[10px] font-bold py-1 px-2.5 rounded-lg text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow">
                    {loc.name}
                  </span>
                </button>
              );
            })}

            {/* Map compass logo bottom right */}
            <div className="absolute bottom-4 right-4 bg-black/60 p-3 rounded-full border border-stone-850">
              <Compass className="w-8 h-8 text-amber-500 animate-spin-slow" />
            </div>

          </div>
          
          <div className="bg-stone-950/40 border border-stone-850 p-3.5 rounded-2xl text-[10px] font-mono text-stone-500 flex justify-between items-center">
            <span>● SECURE COORD SCANNING ACCEPTS SATELLITE LINKS</span>
            <span>CLIMATIC TOURISM ENGINE VERSION 3.2</span>
          </div>
        </div>

        {/* DETAILED DESTINATION CARD DETAILS (COLUMN 3) */}
        <div className="lg:col-span-1 space-y-4">
          <span className="text-[10px] font-mono text-stone-500 uppercase font-black tracking-wider block">📍 Shoot Details & Trivia:</span>
          
          {selectedLoc ? (
            <div className="bg-[#121212] border border-white/10 rounded-3xl p-5 space-y-4 shadow-xl relative overflow-hidden h-full flex flex-col justify-between">
              {/* Highlight flare corner */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#E50914]/10 to-transparent rounded-full filter blur-xl pointer-events-none" />

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-mono text-[#E50914] font-extrabold uppercase bg-[#E50914]/10 px-2 py-0.5 rounded border border-[#E50914]/25">
                    {selectedLoc.movie}
                  </span>
                  <h3 className="text-xl font-display font-black text-white mt-2 tracking-tight">
                    {selectedLoc.name}
                  </h3>
                  <p className="text-xs text-amber-500 font-mono mt-0.5">{selectedLoc.country}</p>
                </div>

                {/* Specific scene snippet */}
                <div className="bg-black p-3.5 rounded-2xl border border-stone-850 space-y-1">
                  <span className="text-[10px] text-stone-500 font-mono uppercase font-bold flex items-center gap-1">
                    <Tv className="w-3.5 h-3.5 text-stone-400" />
                    Filmed Scene Outline:
                  </span>
                  <p className="text-xs text-stone-300 leading-relaxed font-sans font-medium">
                    "{selectedLoc.scene}"
                  </p>
                </div>

                {/* Specific local trivia */}
                <div className="space-y-1">
                  <span className="text-[10px] text-stone-500 font-mono uppercase font-bold flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-stone-400" />
                    Filming secrets & Gossip:
                  </span>
                  <p className="text-xs text-stone-300 leading-relaxed font-sans">
                    {selectedLoc.trivia}
                  </p>
                </div>

                {/* Soundtrack correlation */}
                <div className="bg-[#E50914]/5 border border-[#E50914]/15 p-3 rounded-2xl space-y-1">
                  <span className="text-[10px] text-[#E50914] font-mono font-extrabold uppercase flex items-center gap-1.5">
                    <Music className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                    Legendary Theme Sound:
                  </span>
                  <span className="text-[13px] font-sans font-black text-white block">
                    🎵 {selectedLoc.soundtrack}
                  </span>
                </div>
              </div>

              {/* Travel route guides */}
              <div className="border-t border-white/5 pt-4 space-y-3 mt-4">
                <div className="space-y-1">
                  <span className="text-[9px] text-stone-500 font-mono uppercase font-bold flex items-center gap-1">
                    <Navigation className="w-3 h-3 text-emerald-500" />
                    Real-world pilgrim route:
                  </span>
                  <p className="text-[11px] text-stone-400 leading-normal font-mono">
                    {selectedLoc.route}
                  </p>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-stone-900/40 border border-white/5 rounded-3xl p-8 text-center text-stone-500 text-xs">
              Click any pin on the radar view to inspect production diaries.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
