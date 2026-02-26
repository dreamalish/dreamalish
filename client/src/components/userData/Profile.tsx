import React, { useEffect, useState } from 'react';
import { authFetch } from "../../helper/APIHelper";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await authFetch("/profile");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    fetchProfile();
  }, []);

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="container mt-4">
      <h2>My Profile</h2>
      <img
        src={
          user.profilePic
            ? `${process.env.REACT_APP_API_URL}/uploads/${user.profilePic}`
            : "/defaultProfilePic.jpg"
        }
        alt="avatar"
        width="80"
      />
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Bio:</strong> {user.bio}</p>
    </div>
  );
}
