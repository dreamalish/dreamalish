import React, { useState, useEffect } from 'react';
import {
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Card
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { DreamType } from '../../types/CustomTypes';
import { authFetch } from '../../helper/APIHelper';
import DreamModal from './DreamModal';
import CreateDreamModal from "./CreateDreamModal";
import './Dream.css';

type User = {
  username: string;
  profilePic?: string;
};

//type DreamType = {
//  id: number;
//  title: string;
//  content: string;
//  category: string;
//  isPrivate: boolean;
//  createdAt: string;
//  User?: User;
//  Comments?: any[];
//  commentCount?: number;
//  views?: number;
//  likes?: number;
//  liked?: boolean;
//};

export default function Dreams() {
  const [dreams, setDreams] = useState<DreamType[]>([]);
  const [selectedDream, setSelectedDream] = useState<DreamType | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('joy');
  const [isPrivate, setIsPrivate] = useState(false);
  const [error, setError] = useState('');

  // ===============================
  // Fetch Dreams
  // ===============================
  const fetchDreams = async () => {
    try {
      const res = await authFetch('/api/dreams');

      if (Array.isArray(res)) {
        setDreams(res);
      } else {
        setError('Failed to load dreams');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load dreams');
    }
  };

  useEffect(() => {
    fetchDreams();
  }, []);

  // ===============================
  // Create Dream
  // ===============================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      setError('Title and Dream Content are required.');
      return;
    }

    try {
      const res = await authFetch('/api/dreams/create', {
        method: 'POST',
        body: JSON.stringify({ title, content, category, isPrivate }),
      });

      if (res?.id) {
        setDreams([res, ...dreams]);
        setTitle('');
        setContent('');
        setCategory('joy');
        setIsPrivate(false);
        setError('');
      }
    } catch {
      setError('Dream creation failed.');
    }
  };

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
              likes: d.liked
                ? (d.likes || 1) - 1
                : (d.likes || 0) + 1
            }
          : d
      )
    );

    authFetch(`/api/dreams/${id}/like`, {
      method: 'POST',
    }).catch(() => {
      fetchDreams(); // rollback if error
    });
  };

  return (
    <div className={darkMode ? "dream-page dark" : "dream-page"}>

      <Button
        color="secondary"
        onClick={() => setDarkMode(!darkMode)}
        className="mb-3"
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </Button>

      <h3 className="mt-4">Public Dreams</h3>

      <div className="dream-grid">
        {dreams.map((dream) => (
          <Card
            key={dream.id}
            onClick={() => {
              setSelectedDream(dream);

              setDreams(prev =>
                prev.map(d =>
                  d.id === dream.id
                    ? { ...d, views: (d.views || 0) + 1 }
                    : d
                )
              );

              authFetch(`/api/dreams/${dream.id}/view`, {
                method: 'PUT',
              });
            }}
            className={`dream-card ${dream.category}`}
          >
            <div className="dream-card-inner">
              <div className="dream-overlay">
                <span>View Dream</span>
              </div>

              <div className="dream-preview">
                <h5>{dream.title}</h5>
                <p>{dream.content}</p>
              </div>

              <div className="dream-footer">
                {dream.User && (
                  <Link
                    to={`/u/${dream.User.username}`}
                    onClick={(e) => e.stopPropagation()}
                    className="dream-username"
                  >
                    <img
                      src={
                        dream.User.profilePic
                          ? `${process.env.REACT_APP_API_URL}/uploads/${dream.User.profilePic}`
                          : "/assets/defaultProfilePic.gif"
                      }
                      alt="avatar"
                      className="avatar-tiny"
                    />
                    @{dream.User.username}
                  </Link>
                )}

                <div className="dream-stats">
                <span>💬{dream.commentCount ?? dream.Comments?.length ?? 0}</span>
                  <span>👁 {dream.views || 0}</span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(dream.id!);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {dream.liked ? '❤️' : '🤍'} {dream.likes || 0}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selectedDream && (
  <DreamModal
    dream={selectedDream}
    onClose={() => setSelectedDream(null)}
    onCommentAdded={(dreamId: number) => {
      setDreams(prev =>
        prev.map(d =>
          d.id === dreamId
            ? { ...d, commentCount: (d.commentCount || 0) + 1 }
            : d
        )
      );
    }}
  />
)} <button
    className="floating-create-btn"
    onClick={() => setShowCreateModal(true)
    }>
+
</button>

{showCreateModal && (
  <CreateDreamModal
    onClose={() => setShowCreateModal(false)}
    onDreamCreated={(newDream) => {
      setDreams((prev) => [newDream, ...prev]);
    }}
  />
)}
    </div>
  );
}