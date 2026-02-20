import React, { useState, useEffect, useRef } from "react";
import { Input } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../helper/APIHelper";
import '../App.css';

interface User {
  id: number;
  username: string;
  profilePic?: string;
}

const SearchUsers: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // ===============================
  // Debounced Search
  // ===============================
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim()) {
        searchUsers(query);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const searchUsers = async (value: string) => {
    try {
      const res = await authFetch(`/api/profile/search/${value}`);
      setResults(Array.isArray(res) ? res : []);
      setShowDropdown(true);
      setSelectedIndex(-1);
      console.log("Search response:", res);
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  // ===============================
  // Close on Outside Click
  // ===============================
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ===============================
  // Keyboard Navigation
  // ===============================
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || results.length === 0) return;

    if (e.key === "ArrowDown") {
      setSelectedIndex((prev) =>
        prev < results.length - 1 ? prev + 1 : prev
      );
    }

    if (e.key === "ArrowUp") {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    }

    if (e.key === "Enter" && selectedIndex >= 0) {
      navigate(`/profile/${results[selectedIndex].username}`);
      setShowDropdown(false);
      setQuery("");
    }
  };

  return (
    <div
      ref={wrapperRef}
      style={{ position: "relative", width: "250px" }}
    >
      <Input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query && setShowDropdown(true)}
        onKeyDown={handleKeyDown}
      />

      {showDropdown && (
        <div className="search-dropdown">
          {results.length === 0 ? (
            <div className="search-item no-results">
              No users found
            </div>
          ) : (
            results.map((user, index) => (
              <div
                key={user.id}
                className={`search-item ${
                  index === selectedIndex ? "active" : ""
                }`}
                onClick={() => {
                  navigate(`/profile/${user.username}`);
                  setShowDropdown(false);
                  setQuery("");
                }}
              >
                <img
                  src={
                    user.profilePic
                      ? `${process.env.REACT_APP_API_URL}${user.profilePic}`
                      : "/assets/defaultProfilePic.gif"
                  }
                  alt="avatar"
                  className="search-avatar"
                />
                @{user.username}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchUsers;