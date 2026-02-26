import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import Comment from "./Comment";
import { DreamType } from "../../types/CustomTypes";
import "./Dream.css";

type Props = {
  dream: DreamType | null;
  onClose: () => void;
  onCommentAdded?: (dreamId: number, newComment: any) => void;
  onToggleLike?: (dreamId: number) => void;
};

const DreamModal: React.FC<Props> = ({
  dream,
  onClose,
  onCommentAdded,
  onToggleLike,
}) => {

  if (!dream) return null;

  return (
    <Modal
      isOpen={true}
      toggle={onClose}
      size="lg"
      centered
      className="dream-modal"
      backdropClassName="dream-modal-backdrop"
    >
      <ModalHeader toggle={onClose}>
        <h1>{dream.title}</h1>
        <h3>{dream.category}</h3>
      </ModalHeader>

      <ModalBody>
        <div className="modal-dream-content">
          <p>{dream.content}</p>
          
          {/* Views + Likes */}
  <div className="modal-dream-stats">
    <span>👁 {dream.views || 0}</span>
    <span
      style={{ cursor: 'pointer', marginLeft: '10px' }}
      onClick={() => {
        if (!dream.liked && onToggleLike) {
          onToggleLike(dream.id!);
        }
      }}
    >
      {dream.liked ? '❤️' : '🤍'} {dream.likes || 0}
    </span>
  </div>
        </div>

        <hr />

        <Comment
          DreamId={dream.id!}
          onCommentAdded={(newComment: any) => {
            if (onCommentAdded) {
              onCommentAdded(dream.id!, newComment);
            }
          }}
        />
      </ModalBody>
    </Modal>
  );
};

export default DreamModal;
