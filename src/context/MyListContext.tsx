import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import type { ReactNode } from 'react';
import type { Movie } from '../types';

const MY_LIST_KEY = 'netput_my_list';

interface MyListContextType {
  myList: Movie[];
  addToMyList: (movie: Movie) => void;
  removeFromMyList: (imdbID: string) => void;
  isInMyList: (imdbID: string) => boolean;
}

const MyListContext = createContext<MyListContextType | undefined>(undefined);

export function MyListProvider({ children }: { children: ReactNode }) {
  const [myList, setMyList] = useState<Movie[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(MY_LIST_KEY);
      if (stored) {
        setMyList(JSON.parse(stored));
      }
    } catch {
      setMyList([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(MY_LIST_KEY, JSON.stringify(myList));
  }, [myList]);

  const addToMyList = useCallback((movie: Movie) => {
    setMyList((prev) => {
      if (prev.some((m) => m.imdbID === movie.imdbID)) return prev;
      return [...prev, movie];
    });
  }, []);

  const removeFromMyList = useCallback((imdbID: string) => {
    setMyList((prev) => prev.filter((m) => m.imdbID !== imdbID));
  }, []);

  const isInMyList = useCallback(
    (imdbID: string) => myList.some((m) => m.imdbID === imdbID),
    [myList]
  );

  const value: MyListContextType = {
    myList,
    addToMyList,
    removeFromMyList,
    isInMyList,
  };

  return (
    <MyListContext.Provider value={value}>{children}</MyListContext.Provider>
  );
}

export function useMyList() {
  const context = useContext(MyListContext);
  if (context === undefined) {
    throw new Error('useMyList must be used within a MyListProvider');
  }
  return context;
}
