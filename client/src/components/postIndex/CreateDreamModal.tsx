import React, { useState } from "react";
import {
  Button,
  Form,
  FormGroup,
  Input,
  Label
} from "reactstrap";
import "./CreateDreamModal.css";

interface Props {
  onClose: () => void;
  onDreamCreated: (newDream: any) => void;
}

const CreateDreamModal: React.FC<Props> = ({ onClose, onDreamCreated }) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("joy");
  const [content, setContent] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isNSFW, setIsNSFW] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3002/api/dreams/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token") || ""
        },
        body: JSON.stringify({
          title,
          category,
          content,
          isPrivate,
          isNSFW
        })
      });

      if (!response.ok) {
        throw new Error("Failed to create dream");
      }

      const createdDream = await response.json();

      onDreamCreated(createdDream);
      onClose();

    } catch (err) {
      console.error("CREATE DREAM ERROR:", err);
    }
  };

  return (
    <div className="create-modal-overlay">
      <div className="create-modal">
        <button className="close-btn" onClick={onClose}>×</button>

        <h4>Share Your Dream</h4>

        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Dream title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <FormGroup>
            <Input
              type="select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="joy">Joy</option>
              <option value="despair">Despair</option>
              <option value="fear">Fear</option>
              <option value="desire">Desire</option>
              <option value="love">Love</option>
              <option value="confusion">Confusion</option>
              <option value="humiliation">Humiliation</option>
              <option value="envy">Envy</option>
              <option value="mundanity">Mundanity</option>
              <option value="fortune">Fortune</option>
              <option value="rage">Rage</option>
              <option value="memory">Memory</option>
            </Input>
          </FormGroup>

          <FormGroup>
            <textarea
              placeholder="Describe your dream..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>
              <Input
                type="checkbox"
                checked={isPrivate}
                onChange={() => setIsPrivate(!isPrivate)}
              />
              Private
            </Label>
          </FormGroup>

          <FormGroup>
            <Label>
              <Input
                type="checkbox"
                checked={isNSFW}
                onChange={() => setIsNSFW(!isNSFW)}
              />
              NSFW
            </Label>
          </FormGroup>

          <FormGroup>
            <Button type="submit" className="submit-btn">
              Post Dream
            </Button>
          </FormGroup>
        </Form>
      </div>
    </div>
  );
};

export default CreateDreamModal;