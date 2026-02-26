import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { authFetch } from '../../helper/APIHelper';
import AvatarImage from "../common/AvatarImage";


export default function PublicProfile() {
  const { username } = useParams<{ username: string }>();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await authFetch(`/api/profile/u/${username}`);
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
    ? `${process.env.REACT_APP_API_URL}${user.profilePic}`
    : '/assets/defaultProfilePic.jpg';

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto' }}>

<AvatarImage
  src={user?.profilePic}
  alt={user?.username}
  size={100}
  className="profile-avatar"
/>


      <h2>{user.username}</h2>
      {user.location && <p><strong>Location:</strong> {user.location}</p>}
      {user.bio && <p><strong>Bio:</strong> {user.bio}</p>}

      <p style={{ fontSize: '1.1rem', color: 'gray' }}>
        Joined {new Date(user.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}
