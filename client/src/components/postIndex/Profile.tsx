import React, { useState, useEffect, useContext } from 'react';
import {
  Form,
  FormGroup,
  Input,
  Label,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';
import { authFetch } from '../../helper/APIHelper';
import APIURL from '../../helper/Environment';
import { User, UserContext } from '../../contexts/UserContext';
import LevelProgress from "../profile/LevelProgress";
import AvatarImage from "../common/AvatarImage";
import './Profile.css';



export default function Profile() {
  const { currentUser, setCurrentUser } = useContext(UserContext);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [currentAvatar, setCurrentAvatar] = useState('/assets/defaultProfilePic.jpg');

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState<any>(null);

  // ===============================
  // Fetch Profile
  // ===============================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authFetch('/api/profile/me');
    
        setUsername(data.username || '');
        setEmail(data.email || '');
        setBio(data.bio || '');
        setLocation(data.location || '');
    
        if (data.profilePic) {
          const avatarURL = data.profilePic;
          setCurrentAvatar(avatarURL);
          
          setCurrentUser((prev: import('../../contexts/UserContext').User | null) =>
            prev ? { ...prev, profilePic: avatarURL } : prev
          );
    
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            const parsed = JSON.parse(storedUser);
            parsed.profilePic = avatarURL;
            localStorage.setItem("user", JSON.stringify(parsed));
          }
        }
    
        // ⭐ Fetch gamification stats
        try {
          const statsData = await authFetch("/api/profile/stats");
          setStats(statsData);
        } catch (err) {
          console.error("Failed to load stats:", err);
        }
    
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    

    fetchProfile();
  }, [setCurrentUser]);

  // ===============================
  // Avatar Preview
  // ===============================
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePic(file);

      const previewURL = URL.createObjectURL(file);
      setCurrentAvatar(previewURL);
    }
  };

  // ===============================
  // Save Profile
  // ===============================
  const handleSave = async () => {
    setSaving(true);
    setMessage("");
  
    try {
      // Upload avatar if exists
      if (profilePic) {
        const formData = new FormData();
        formData.append("avatar", profilePic);
  
        const avatarRes = await authFetch("/api/profile/avatar", {
          method: "POST",
          body: formData,
        });
  
        if (avatarRes?.profilePic) {
          setCurrentUser(avatarRes);
        }
  
        setProfilePic(null);
      }
  
      // Update other profile fields
      await authFetch("/api/profile/update", {
        method: "PUT",
        body: JSON.stringify({ email, bio, location }),
      });
  
      setCurrentUser(prev =>
        prev ? { ...prev, email, bio, location } : prev
      );
      
      setMessage("Profile updated successfully!");
      setIsEditing(false);
  
      setTimeout(() => setMessage(""), 3000);
  
    } catch (err) {
      console.error(err);
      setMessage("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };
  

  if (loading) return <p>Loading profile...</p>;

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto', textAlign: 'center' }}>
      <h2>My Profile</h2>

      <AvatarImage
        src={currentUser?.profilePic}
        alt="avatar"
        size={120}
        className="profile-avatar"
      />

      {stats && (
        <div style={{ marginTop: "10px",marginBottom: "20px" }}>
        <LevelProgress
          points={stats.points}
          nextLevel={stats.nextLevel}
          level={stats.level}
          title={stats.title}
        />
        </div>
      )}

      <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
        <p><strong>Username:</strong> {username}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Location:</strong> {location}</p>
        <p><strong>Bio:</strong> {bio}</p>
      </div>

      <Button color="primary" onClick={() => setIsEditing(true)}>
        Edit Profile
      </Button>

      {message && <p>{message}</p>}

      <Modal isOpen={isEditing} toggle={() => setIsEditing(false)}>
        <ModalHeader toggle={() => setIsEditing(false)}>
          Edit Profile
        </ModalHeader>

        <ModalBody>
          <Form>
            <FormGroup>
              <Label>Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormGroup>

            <FormGroup>
              <Label>Location</Label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} />
            </FormGroup>

            <FormGroup>
              <Label>Bio</Label>
              <Input type="textarea" value={bio} onChange={(e) => setBio(e.target.value)} />
            </FormGroup>

            <FormGroup>
              <Label>Change Avatar</Label>
              <Input type="file" onChange={handleAvatarChange} />
            </FormGroup>
          </Form>
        </ModalBody>

        <ModalFooter>
          <Button color="primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>

          <Button color="secondary" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
