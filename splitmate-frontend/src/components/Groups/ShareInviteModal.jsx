import React from "react";
import { createPortal } from "react-dom";
import { FaCopy, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  ModalOverlay,
  ModalCard,
  ModalHeader,
  Eyebrow,
  ModalTitle,
  ModalDescription,
  CloseButton,
  ModalActions,
  CancelButton,
  SubmitButton,
} from "./NewGroupStyle";
import { InviteCodeDisplay } from "./ShareInviteModalStyle";

const ShareInviteModal = ({ isOpen, onClose, inviteCode }) => {
  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      toast.success("Invite code copied");
    } catch {
      toast.error("Could not copy the invite code");
    }
  };

  return createPortal(
    <ModalOverlay onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <ModalCard role="dialog" aria-modal="true" aria-labelledby="share-invite-title" aria-describedby="share-invite-description">
        <ModalHeader>
          <div>
            <Eyebrow>Groups</Eyebrow>
            <ModalTitle id="share-invite-title">Share invite code</ModalTitle>
            <ModalDescription id="share-invite-description">Send this code to the people you want to invite.</ModalDescription>
          </div>
          <CloseButton type="button" onClick={onClose} aria-label="Close invite dialog"><FaTimes /></CloseButton>
        </ModalHeader>
        <InviteCodeDisplay>{inviteCode}</InviteCodeDisplay>
        <ModalActions>
          <CancelButton type="button" onClick={onClose}>Close</CancelButton>
          <SubmitButton type="button" onClick={handleCopy}><FaCopy /> Copy code</SubmitButton>
        </ModalActions>
      </ModalCard>
    </ModalOverlay>,
    document.body
  );
};

export default ShareInviteModal;
