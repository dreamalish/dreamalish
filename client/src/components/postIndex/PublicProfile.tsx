import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { authFetch } from '../../helper/APIHelper';

export default function PublicProfile() {
  const { username } = useParams<{ username: string }>();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await authFetch(`/profile/u/${username}`);
        setUser(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchUser();
  }, [username]);

  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>User not found.</p>;

  const avatarUrl = user.profilePic
    ? `${process.env.REACT_APP_API_URL}/uploads/${user.profilePic}`
    : '/assets/defaultProfilePic.gif';

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto' }}>
      <h2>{user.username}</h2>

      <img
        src={avatarUrl}
        alt="avatar"
        style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          objectFit: 'cover',
          marginBottom: '1rem'
        }}
      />

      {user.location && <p><strong>Location:</strong> {user.location}</p>}
      {user.bio && <p><strong>Bio:</strong> {user.bio}</p>}

      <p style={{ fontSize: '0.8rem', color: 'gray' }}>
        Joined {new Date(user.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}
