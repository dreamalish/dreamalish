import React, { useEffect } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import Comment from "./Comment";
import { DreamType } from "../../types/CustomTypes";
import { authFetch } from '../../helper/APIHelper';
import "./Dream.css";

type Props = {
  dream: DreamType | null;
  onClose: () => void;
};

const DreamModal: React.FC<Props> = ({ dream, onClose }) => {

  useEffect(() => {
    if (!dream?.id) return;

    authFetch(`/api/dreams/${dream.id}/view`, {
      method: 'PUT'
    });

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
        {dream.title} <p></p>
        {dream.category}
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