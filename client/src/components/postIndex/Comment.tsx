import React, { useEffect, useState } from "react";
import { Form, FormGroup, Input, Button } from "reactstrap";
import { authFetch } from "../../helper/APIHelper";
import './Comment.css';

type CommentType = {
  id: number;
  content: string;
  createdAt: string;
  User?: {
    username: string;
    profilePic?: string;
  };
};

type Props = {
  DreamId: number;
};

export default function Comment({ DreamId }: Props) {
  const [Comments, setComments] = useState<CommentType[]>([]);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // ===============================
  // Fetch Comments
  // ===============================
  const fetchComments = async () => {
    try {
      const res = await authFetch(`/api/comments/dream/${DreamId}`);

      if (Array.isArray(res)) {
        setComments(res);
      } else {
        setError("Failed to load comments");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [DreamId]);

  // ===============================
  // Submit Comment
  // ===============================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      return;
    }

    try {
      const res = await authFetch("/api/comments/create", {
        method: "POST",
        body: JSON.stringify({
          DreamId,
          content,
        }),
      });

      if (res?.id) {
        setComments([res, ...Comments]);
        setContent("");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to submit comment");
    }
  };

  return (
    <div className="comment-section">
      <h5>Comments</h5>

      {loading ? (
        <p>Loading comments...</p>
      ) : (
        <>
          {Comments.length === 0 && <p>No comments yet.</p>}

          {Comments.map((comment) => (
            <div key={comment.id} className="comment-card">
            <div className="card-body">
              <img
                src={
                  comment.User?.profilePic
                    ? `${process.env.REACT_APP_API_URL}/uploads/${comment.User.profilePic}`
                    : "/assets/defaultProfilePic.gif"
                }
                alt="avatar"
                className="comment-avatar"
              />
          
              <div>
                <strong>@{comment.User?.username || "Unknown"}</strong>
                <p>{comment.content}</p>
              </div>
            </div>
          </div>
          ))}
        </>
      )}

      <Form onSubmit={handleSubmit} className="mt-3">
        <FormGroup>
          <Input
            type="textarea"
            placeholder="Write a comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </FormGroup>

        {error && <p className="error-text">{error}</p>}

        <Button color="primary" type="submit">
          Post Comment
        </Button>
      </Form>
    </div>
  );
}
