import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "../utils/axios";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [query, setQuery] = useState("");
  const [filteredGames, setFilteredGames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (!query.trim()) {
        setFilteredGames([]);
        setIsLoading(false);
        return;
      }

      const fetchSearch = async () => {
        setIsLoading(true);
        try {
          const res = await axios.get(`/games/search?q=${encodeURIComponent(query)}`);
          setFilteredGames(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
          console.error("Search error:", err);
          setFilteredGames([]);
        } finally {
          setIsLoading(false);
        }
      };

      fetchSearch();
    }, 300);

    return () => clearTimeout(handler);
  }, [query]);

  return (
    <SearchContext.Provider value={{ query, setQuery, filteredGames, isLoading }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);