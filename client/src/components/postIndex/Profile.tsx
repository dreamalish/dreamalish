import React, { useState, useEffect } from 'react';
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

export default function Profile() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [currentAvatar, setCurrentAvatar] = useState('/assets/defaultProfilePic.gif');

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // ===============================
  // Fetch Logged-in User Profile
  // ===============================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await authFetch('/profile/me');

        if (res) {
          setUsername(res.username);
          setEmail(res.email || '');
          setBio(res.bio || '');
          setLocation(res.location || '');

          if (res.profilePic) {
            setCurrentAvatar(
              `${process.env.REACT_APP_API_URL}/uploads/${res.profilePic}`
            );
          }
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ===============================
  // Handle Avatar Selection
  // ===============================
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePic(e.target.files[0]);

      // Preview immediately
      const previewURL = URL.createObjectURL(e.target.files[0]);
      setCurrentAvatar(previewURL);
    }
  };

  // ===============================
  // Save Profile
  // ===============================
  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      // Upload avatar if changed
      if (profilePic) {
        const formData = new FormData();
        formData.append('avatar', profilePic);

        const avatarRes = await authFetch('/profile/avatar', {
          method: 'POST',
          body: formData,
        });

        if (avatarRes?.file) {
          setCurrentAvatar(
            `${process.env.REACT_APP_API_URL}/uploads/${avatarRes.file}`
          );
        }

        setProfilePic(null);
      }

      // Update profile fields
      await authFetch('/profile/update', {
        method: 'PUT',
        body: JSON.stringify({
          email,
          bio,
          location,
        }),
      });

      setMessage('Profile updated successfully!');
      setIsEditing(false);

      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Profile update failed:', err);
      setMessage('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p style={{ textAlign: 'center' }}>Loading profile...</p>;

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto', textAlign: 'center' }}>
      <h2>My Profile</h2>

      <img
        src={currentAvatar}
        alt="avatar"
        style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          objectFit: 'cover',
          marginBottom: '1rem',
        }}
      />

      {/* VIEW MODE */}
      <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
        <p><strong>Username:</strong> {username}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Location:</strong> {location}</p>
        <p><strong>Bio:</strong> {bio}</p>
      </div>

      <Button color="primary" onClick={() => setIsEditing(true)}>
        Edit Profile
      </Button>

      {message && (
        <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>{message}</p>
      )}

      {/* EDIT MODAL */}
      <Modal isOpen={isEditing} toggle={() => setIsEditing(false)}>
        <ModalHeader toggle={() => setIsEditing(false)}>
          Edit Profile
        </ModalHeader>

        <ModalBody>
          <Form>
            <FormGroup>
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label>Location</Label>
              <Input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label>Bio</Label>
              <Input
                type="textarea"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label>Change Avatar</Label>
              <Input type="file" onChange={handleAvatarChange} />
            </FormGroup>
          </Form>
        </ModalBody>

        <ModalFooter>
          <Button
            color="primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>

          <Button
            color="secondary"
            onClick={() => setIsEditing(false)}
            disabled={saving}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
