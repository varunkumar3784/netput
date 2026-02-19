import axios from 'axios';

const API_BASE_URL = 'https://www.omdbapi.com';
const API_KEY = import.meta.env.VITE_OMDB_API_KEY || 'ce875263';

export const api = axios.create({
  baseURL: API_BASE_URL,
  params: {
    apikey: API_KEY,
  },
  headers: {
    'Content-Type': 'application/json',
  },
});

export const searchMovies = async (query: string, page = 1) => {
  const { data } = await api.get('/', {
    params: {
      s: query,
      page,
    },
  });
  return data;
};

export const getMovieById = async (id: string) => {
  const { data } = await api.get('/', {
    params: {
      i: id,
      plot: 'full',
    },
  });
  return data;
};

export const searchMoviesByYear = async (year: string, page = 1) => {
  const { data } = await api.get('/', {
    params: {
      s: 'movie',
      y: year,
      page,
    },
  });
  return data;
};

export const searchByGenre = async (genre: string, page = 1) => {
  const { data } = await api.get('/', {
    params: {
      s: genre,
      type: 'movie',
      page,
    },
  });
  return data;
};
