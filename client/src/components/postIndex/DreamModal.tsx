import React, { useEffect } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import Comment from "./Comment";
import { DreamType } from "../../types/CustomTypes";
import "./Dream.css";

type Props = {
  dream: DreamType | null;
  onClose: () => void;
};

const DreamModal: React.FC<Props> = ({ dream, onClose }) => {

  useEffect(() => {
    if (!dream?.id) return;

    fetch(`${process.env.REACT_APP_API_URL}/api/dreams/${dream.id}/view`, {
      method: "PUT"
    }).catch(err => console.error("View update failed:", err));

  }, [dream?.id]);

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
        {dream.title}
      </ModalHeader>

      <ModalBody>
        <div className="modal-dream-content">
          <p>{dream.content}</p>
          <div>👁 {dream.views || 0}</div>
        </div>

        <hr />

        <Comment DreamId={dream.id!} />
      </ModalBody>
    </Modal>
  );
};

export default DreamModal;