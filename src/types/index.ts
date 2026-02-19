export interface User {
  email: string;
  token: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
  Plot?: string;
  Runtime?: string;
  Genre?: string;
  Director?: string;
  Actors?: string;
  imdbRating?: string;
}

export interface MovieSearchResponse {
  Search?: Movie[];
  totalResults?: string;
  Response: string;
  Error?: string;
}

export interface MovieDetailResponse extends Movie {
  Response: string;
  Error?: string;
}
