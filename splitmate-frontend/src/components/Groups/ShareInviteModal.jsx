import React from "react";
import { motion } from "framer-motion";
import {
  ModalOverlay,
  ModalBox,
  ModalTitle,
  InviteCodeDisplay,
  ModalButton,
} from "./ShareInviteModalStyle";

const ShareInviteModal = ({ isOpen, onClose, inviteCode }) => {
  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteCode);
    alert("Invite code copied to clipboard!");
  };

  return (
    <ModalOverlay>
      <ModalBox as={motion.div} initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
        <ModalTitle>Share Invite Code</ModalTitle>
        <InviteCodeDisplay>{inviteCode}</InviteCodeDisplay>
        <ModalButton onClick={handleCopy}>Copy Code</ModalButton>
        <ModalButton onClick={onClose}>Close</ModalButton>
      </ModalBox>
    </ModalOverlay>
  );
};

export default ShareInviteModal;
