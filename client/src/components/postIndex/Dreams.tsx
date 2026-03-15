import React, { useState, useEffect, useContext } from 'react';
import { Card, Button } from 'reactstrap';
import { Link, useLocation } from 'react-router-dom';
import { DreamType } from '../../types/CustomTypes';
import { authFetch } from '../../helper/APIHelper';
import DreamModal from './DreamModal';
import CreateDreamModal from './CreateDreamModal';
import './Dream.css';
import { UserContext } from '../../contexts/UserContext';
import AvatarImage from "../common/AvatarImage";
import APIURL from '../../helper/Environment';
import defaultProfilePic from '../../assets/defaultProfilePic.jpg';
import ReactGA from "react-ga4";

type Props = {
  user: any | null;
};

type LocationState = {
  openDreamId?: number;
};

export default function Dreams() {
  const { currentUser } = useContext(UserContext)!;

  const [dreams, setDreams] = useState<DreamType[]>([]);
  const [selectedDream, setSelectedDream] = useState<DreamType | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation() as {
    state?: LocationState;
  };

  const handleDreamUpdated = (updatedDream: DreamType) => {
    setDreams(prev =>
      prev.map(d =>
        d.id === updatedDream.id ? updatedDream : d
      )
    );
    setSelectedDream(updatedDream);
  };
  
  const handleDreamDeleted = (DreamId: number) => {
    setDreams(prev =>
      prev.filter(d => d.id !== DreamId)
    );
    setSelectedDream(null);
  };

  // ===============================
  // Fetch Dreams
  // ===============================
  const fetchDreams = async () => {
    try {
      const res = await authFetch('/api/dreams');
      console.log('Dreams response:', res);

      if (Array.isArray(res)) {
        setDreams(res);

        if (res.length > 0) {
          console.log('First dream user:', res[0].User);
        }
      }
    } catch (err) {
      console.error('Failed to fetch dreams:', err);
    }
  };

  useEffect(() => {
    const fetchDreams = async () => {
      try {
        const res = await authFetch('/api/dreams');
        
        console.log("Dreams response:", res);
        if (Array.isArray(res)) {
          setDreams(res);
          if (res[0]?.User) console.log("First dream user:", res[0].User);
        }
      } catch (err) {
        console.error(err);
      }
    };
  
    fetchDreams();
  }, []);
  
  // ===============================
// Open DreamModal if navigated from notification
// ===============================
useEffect(() => {

  const openDreamId = location.state?.openDreamId;
  if (!openDreamId || dreams.length === 0) return;

  const dreamToOpen = dreams.find(d => d.id === openDreamId);
  if (!dreamToOpen) return;

  setSelectedDream(dreamToOpen);

  // Clear state so it doesn't reopen
  window.history.replaceState({}, document.title);

}, [location.state, dreams]);

  // ===============================
  // Update poster avatar immediately if currentUser changed avatar
  // ===============================
  useEffect(() => {
    if (!currentUser?.profilePic) return;
    console.log("currentUser?.profilePic:", currentUser?.profilePic);
    const updatedProfilePic = `${currentUser.profilePic}?t=${new Date().getTime()}`;

    setDreams(prev =>
      prev.map(d =>
        d.User?.id === currentUser.id
          ? { ...d, User: { ...d.User, profilePic: updatedProfilePic } }
          : d
      )
    );
  }, [currentUser?.id, currentUser?.profilePic]);

  // ===============================
  // Toggle Like
  // ===============================
  const toggleLike = (id: number) => {
    setDreams(prev =>
      prev.map(d =>
        d.id === id
          ? {
              ...d,
              liked: !d.liked,
              likes: d.liked ? (d.likes || 1) - 1 : (d.likes || 0) + 1
            }
          : d
      )
    );
    authFetch(`/api/dreams/${id}/like`, { method: 'POST' }).catch(fetchDreams);
    ReactGA.event({
      category: "Dream",
      action: "Like Dream"
    });
  };

  return (
    <div className={darkMode ? 'dream-page dark' : 'dream-page'}>
      <Button
        color="secondary"
        onClick={() => setDarkMode(!darkMode)}
        className="mb-3"
      >
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </Button>

      <h1 className="mt-4">Public Dreams</h1>

      <div className="dream-grid">
        {dreams.length === 0 && <p>No dreams yet.</p>}

        {dreams.map(dream => {
          const poster = dream.User;
          const username = poster?.username || 'Anonymous';
            const profilePic = poster?.profilePic
            ? poster.profilePic.startsWith('http')
            ? poster.profilePic
            : `${APIURL}${poster.profilePic}` // ensure absolute URL
            : defaultProfilePic;
            const openDream = async (dream: DreamType) => {
              setSelectedDream(dream);
            
              try {
                await authFetch(`/api/dreams/${dream.id}/views`, {
                  method: 'PUT'
                });
                const updatedDream = { ...dream, views: (dream.views || 0) + 1 };
                  // Update modal & grid state with returned views
                setSelectedDream(updatedDream);
                setDreams(prev =>
                     prev.map(d => (d.id === updatedDream.id ? updatedDream : d))
    );
            
              } catch (err) {
                console.error("Failed to increment views:", err);
              }
            };
            
          return (
            <Card
              key={dream.id}
              onClick={() => openDream(dream)}
              className={`dream-card ${dream.category}`}
            >
              <div className="dream-card-inner">
                <div className="dream-overlay"><span>View Dream</span></div>
                <div className="dream-preview">
                  <h4>{dream.title}</h4>
                  <h6><i>{dream.category}</i></h6>
                  <p>{dream.content}</p>
                </div>

                <div className="dream-footer">
                  <Link
                    to={poster ? `/u/${username}` : '#'}
                    onClick={e => e.stopPropagation()}
                    className="dream-username"
                  >
                    <AvatarImage
                      src={profilePic}
                      alt={dream.User?.username}
                      size={24}
                      className="rounded-circle me-2"
                    />

                    @{username}
                  </Link>

                  <div className="dream-stats">
                    <span>💬 {dream.commentCount ?? dream.Comments?.length ?? 0}</span>
                    <span>👁 {dream.views ?? 0}</span>
                    <span
                      style={{ cursor: 'pointer' }}
                      onClick={e => { e.stopPropagation(); toggleLike(dream.id!); }}
                    >
                      {dream.liked ? '❤️' : '🤍'} {dream.likes || 0}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {selectedDream && (
        <DreamModal
          dream={selectedDream}
          onClose={() => setSelectedDream(null)}
          onDreamUpdated={handleDreamUpdated}
          onDreamDeleted={handleDreamDeleted}
          onCommentAdded={(dreamId: number, newComment: any) => {
            setDreams(prev =>
              prev.map(d =>
                d.id === dreamId
                  ? {
                      ...d,
                      Comments: [...(d.Comments || []), newComment],
                      commentCount: (d.commentCount || 0) + 1
                    }
                  : d
              )
            );
          }}
          onToggleLike={(id: number) => {
            // re-use the toggleLike function in Dreams.tsx
            toggleLike(id);
            
            // update the modal's own selectedDream to reflect new like state
            setSelectedDream(prev =>
              prev && prev.id === id
                ? { ...prev, liked: !prev.liked, likes: prev.liked ? (prev.likes || 1) - 1 : (prev.likes || 0) + 1 }
                : prev
            );
          }}
        />
      )}

      <button
        className="floating-create-btn"
        onClick={() => setShowCreateModal(true)}
      >
        +
      </button>

      {showCreateModal && (
        <CreateDreamModal
          onClose={() => setShowCreateModal(false)}
          onDreamCreated={newDream => {
            setDreams(prev => [newDream, ...prev]);
            setSelectedDream(newDream);
          }}
        />
      )}
    </div>
  );
}
