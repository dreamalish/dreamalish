import React from 'react';
import { Card, CardBody, CardHeader, Button } from 'reactstrap';
import { UserType, DreamType } from '../../types/CustomTypes';
import './Dream.css';

type DreamCardProps = {
  user: UserType;
  dream: DreamType;
  fetchUser: () => void;

  setDreamToComment?: (dream: DreamType | null) => void;
  setDreamToEdit?: (dream: DreamType | null) => void;
  deleteDream?: (id: number) => void;
};

const DreamCard: React.FC<DreamCardProps> = ({
  dream,
  user,
  setDreamToComment,
  setDreamToEdit,
  deleteDream
}) => {
  const isOwner = user.id === dream.userId;

  return (
    <Card className="mb-3">
      <CardHeader>
        <strong>{dream.title}</strong> — {dream.category}
      </CardHeader>

      <CardBody>
        <p>{dream.content}</p>
        <div style={{ display: 'flex', gap: '15px', marginBottom: '10px' }}>
         <span>💬 {dream.commentCount ?? dream.Comments?.length ?? 0}</span>
         <span>👁 {dream.views || 0}</span>
       </div>
        {/* Owner Controls */}
        {isOwner && (
          <div style={{ marginBottom: '10px' }}>
            {setDreamToEdit && (
              <Button
                size="sm"
                color="warning"
                className="me-2"
                onClick={() => setDreamToEdit(dream)}
              >
                Edit
              </Button>
            )}

            {deleteDream && (
              <Button
                size="sm"
                color="danger"
                onClick={() => deleteDream(dream.id!)}
              >
                Delete
              </Button>
            )}
          </div>
        )}

        {/* Comment Button (Only if function exists) */}
        {setDreamToComment && (
          <Button
            size="sm"
            color="info"
            onClick={() => setDreamToComment(dream)}
          >
            Comment
          </Button>
        )}
      </CardBody>
    </Card>
  );
};

export default DreamCard;
