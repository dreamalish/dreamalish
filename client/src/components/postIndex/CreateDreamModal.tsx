// src/components/dreams/CreateDreamModal.tsx
import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Input, Label } from 'reactstrap';
import { authFetch } from '../../helper/APIHelper';
import { DreamType } from '../../types/CustomTypes';
import ReactGA from "react-ga4";

type Props = {
  onClose: () => void;
  onDreamCreated: (dream: DreamType) => void;
};

export default function CreateDreamModal({ onClose, onDreamCreated }: Props) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('joy');
  const [isPrivate, setIsPrivate] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      setError('Title and content required.');
      return;
    }
    const payload = { title, content, category };
    console.log("CreateDream POST payload:", payload);
    try {
      const res = await authFetch('/api/dreams/create', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      ReactGA.event({
        category: "Dream",
        action: "Create Dream"
      });
      console.log("CreateDream POST response:", res);
      // Add new dream only if backend responds successfully
    // if (res) onDreamCreated(res);

      if (res?.id) {
        onDreamCreated(res); // <-- instantly updates Dreams
        setTitle('');
        setContent('');
        setCategory('joy');
        setIsPrivate(false);
        setError('');
        onClose();
      }
    } catch (err) {
      setError('Failed to create dream.');
    }
  };

  return (
    <Modal isOpen toggle={onClose}>
      <ModalHeader toggle={onClose}>Create Dream</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </FormGroup>

          <FormGroup>
            <Label>Content</Label>
            <Input type="textarea" value={content} onChange={(e) => setContent(e.target.value)} />
          </FormGroup>

          <FormGroup>
            <Label>Category</Label>
            <Input type="select" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value={"joy"}>Joy</option>
                            <option value={"despair"}>Despair</option>
                            <option value={"fear"}>Fear</option>
                            <option value={"desire"}>Desire</option>
                            <option value={"love"}>Love</option>
                            <option value={"confusion"}>Confusion</option>
                            <option value={"humiliation"}>Humiliation</option>
                            <option value={"envy"}>Envy</option>
                            <option value={"mundanity"}>Mundanity</option>
                            <option value={"fortune"}>Fortune</option>
                            <option value={"rage"}>Rage</option>
                            <option value={"memory"}>Memory</option>
            </Input>
          </FormGroup>

          <FormGroup check>
            <Label check>
              <Input type="checkbox" checked={isPrivate} onChange={() => setIsPrivate(!isPrivate)} /> Private
            </Label>
          </FormGroup>

          {error && <p className="text-danger">{error}</p>}

          <Button color="primary" type="submit" className="mt-2">Create</Button>
        </Form>
      </ModalBody>
    </Modal>
  );
}
