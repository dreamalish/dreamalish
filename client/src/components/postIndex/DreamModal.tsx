import React, { useEffect } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import Comment from "./Comment";
import { DreamType } from "../../types/CustomTypes";
import { authFetch } from '../../helper/APIHelper';
import "./Dream.css";

type Props = {
  dream: DreamType | null;
  onClose: () => void;
  onCommentAdded: (dreamId: number)=>void;
};

const DreamModal: React.FC<Props> = ({ dream, onClose, onCommentAdded }) => {

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
          <div>👁 {dream.views || 0 }</div>
        </div>

        <hr />

        <Comment
          DreamId={dream.id!}
          onCommentAdded={() => onCommentAdded(dream.id!)}
/>
      </ModalBody>
    </Modal>
  );
};

export default DreamModal;