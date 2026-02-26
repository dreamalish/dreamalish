import React, { createContext, useState, useEffect } from 'react';
import { authFetch } from '../helper/APIHelper';

export interface User {
  id: number;
  username: string;
  profilePic: string;
  email?: string;
  bio?: string;
  location?: string;
}

export interface UserContextType {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const UserContext = createContext<UserContextType>({
  currentUser: null,
  setCurrentUser: () => {}
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
  if (!token) return;
    const loadUser = async () => {
      try {
        const user = await authFetch('/api/profile/me');
        setCurrentUser(user);
      } catch (err) {
        setCurrentUser(null);
      }
    };

    loadUser();
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};
