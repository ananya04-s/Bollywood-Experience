export interface Movie {
  id: string;
  title: string;
  year: number;
  genre: string[];
  rating: number;
  director: string;
  actors: string[];
  runtime: number;
  description: string;
  boxOffice: number; // Crores
  budget: number; // Crores
  language: string;
  posterUrl: string;
  tagline: string;
  keyCast: string[];
  reviews?: UserReview[];
  isYetToRelease?: boolean;
  trailerUrl?: string;
  releaseDate?: string;
  songs?: string[];
}

export interface UserReview {
  id: string;
  movieId: string;
  movieTitle: string;
  rating: number;
  author: string;
  content: string;
  likes: number;
  sentiment: "Positive" | "Negative" | "Custom";
  sentimentScore: number;
  timestamp: string;
  dialogue?: string;
  mood?: string;
  watchedMedium?: string;
  watchedDate?: string;
}

export interface ActorProfile {
  id: string;
  name: string;
  birthYear: number;
  bio: string;
  awards: string[];
  careerJourney: string;
  genrePreference: string[];
  hitRatio: number;
  lifetimeCollection: number;
  filmsCount: number;
  topMovies: string[];
  growthTrends: { year: number; score: number }[];
  heatmapData: { month: string; activity: number }[];
}

export interface DirectorProfile {
  id: string;
  name: string;
  famousMovies: string[];
  successRate: number;
  genrePreference: string[];
  bio: string;
  journey: string;
}

export interface TimelineEvent {
  year: number;
  title: string;
  category: "Classic" | "Golden" | "Masala" | "Modern" | "Global";
  movie: string;
  actor: string;
  description: string;
  achievement: string;
}

export interface QuizQuestion {
  id: string;
  category: "Actors" | "Movies" | "Songs" | "Awards" | "Dialogues";
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  xpPoints: number;
}

export interface Song {
  song_id: number;
  song_title: string;
  movie: string;
  year: number;
  singer: string;
  genre: string;
  mood: string;
  lead_actor: string;
  lead_actress: string;
}

