import React, { useState, useEffect, useRef } from "react";
import { Input } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../helper/APIHelper";
import AvatarImage from "./common/AvatarImage"; // adjust path if needed
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
        setShowDropdown(false);
        setSelectedIndex(-1);
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
    } catch (err) {
      console.error("Search failed", err);
      setResults([]);
      setShowDropdown(false);
    }
  };

  // ===============================
  // Close on Outside Click
  // ===============================
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ===============================
  // Navigate helper
  // ===============================
  const navigateToUser = (username: string) => {
    navigate(`/u/${username}`);
    setShowDropdown(false);
    setQuery("");
    setSelectedIndex(-1);
  };

  // ===============================
  // Keyboard Navigation
  // ===============================
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault(); // prevent cursor from moving
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    }

    if (e.key === "Enter" && selectedIndex >= 0) {
      const selectedUser = results[selectedIndex];
      navigateToUser(selectedUser.username);
    }
  };

  return (
    <div ref={wrapperRef} style={{ position: "relative", width: "250px" }}>
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
            <div className="search-item no-results">No users found</div>
          ) : (
            results.map((user, index) => (
              <div
                key={user.id}
                className={`search-item ${index === selectedIndex ? "active" : ""}`}
                onMouseDown={(e) => {
                  // Fires BEFORE blur closes dropdown
                  e.preventDefault();
                  navigateToUser(user.username);
                }}
              >
                <AvatarImage
                  src={user.profilePic}
                  size={28}
                  className="rounded-circle me-2"
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
