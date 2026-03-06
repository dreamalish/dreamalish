import React, { useEffect, useState, useRef } from "react";
import { authFetch } from '../../helper/APIHelper'; 
import { useNavigate } from "react-router-dom";
import AvatarImage from "../common/AvatarImage";

interface Notification {
  id: number;
  type: string;
  message: string;
  read: boolean;
  dreamId: number;
  createdAt: string;
  actor: {
    id: number;
    username: string;
    profilePic: string;
  };
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationsDropdown({ isOpen, onClose }: Props) {

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
      markAllAsRead();
    }
  }, [isOpen]);
  
  useEffect(() => {

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
  
          if (entry.isIntersecting) {
  
            const id = Number(
              entry.target.getAttribute("data-id")
            );
  
            // Mark as read
            authFetch(`/api/notifications/${id}/read`, {
              method: "PUT"
            }).then(() => {
              // Update local state
              setNotifications(prev =>
                prev.map(n =>
                  n.id === id ? { ...n, read: true } : n
                )
              );
            });
  
          }
  
        });
      },
      { threshold: 1.0 }
    );
  
    itemRefs.current.forEach((el, id) => {
      el.setAttribute("data-id", id.toString());
      observer.observe(el);
    });
  
    return () => observer.disconnect();
  
  }, [notifications]);

  const loadNotifications = async () => {
    setLoading(true);
    const data = await authFetch('/api/notifications');
    setNotifications(data);
    setLoading(false);
  };

  const markAllAsRead = async () => {
    await authFetch('/api/notifications/read-all', {
      method: 'PUT'
    });
  };

  const handleClick = (dreamId: number) => {
    navigate('/', {
      state: {
        openDreamId: dreamId
      }
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="notifications-dropdown">

      <div className="notifications-header">
        <h4>Notifications</h4>
      </div>
      
      {loading && <div className="notifications-loading">Loading...</div>}

      {!loading && notifications.length === 0 && (
        <div className="notifications-empty">
          No notifications yet
        </div>
      )}

      <div className="notifications-list">
        {notifications.map(n => (
          <div
            key={n.id}
            ref={(el) => {
              if (el) itemRefs.current.set(n.id, el);
            }}
            className={`notification-item ${n.read ? 'read' : 'unread'}`}
            onClick={() => handleClick(n.dreamId)}
          >
          
            <AvatarImage
              src={n.actor.profilePic}
              size={36}
            />

            <div className="notification-text">
              <strong>{n.actor.username}</strong>
              <span> {n.message}</span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}