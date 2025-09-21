import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { BASE_URL } from "../config";
import {
  ModalOverlay,
  ModalBox,
  ModalTitle,
  ModalForm,
  ModalInputGroup,
  ModalInput,
  ModalButton,
  ModalCancelButton,
} from "./JoinGroupModalStyle";
import { toast } from "react-toastify";

const JoinGroupModal = ({ isOpen, onClose, refreshGroups }) => {
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async (e) => {
    e.preventDefault();
    const username = localStorage.getItem("username");
    if (!inviteCode.trim()) return alert("Enter invite code");

    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/api/user/groups/join`, { username, joinCode: inviteCode });
      toast.success("Joined group successfully!", { autoClose: 1500 });
      setTimeout(() => {
          navigate("/groups");
        }, 2000);
    } catch (err) {
      alert(err.response?.data?.error || "Invalid invite code");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalBox as={motion.div} initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
        <ModalTitle>Join Group</ModalTitle>
        <ModalForm onSubmit={handleJoin}>
          <ModalInputGroup>
            <ModalInput
              type="text"
              placeholder="Enter Invite Code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              required
            />
          </ModalInputGroup>
          <ModalButton type="submit" disabled={loading} as={motion.button}>
            {loading ? "Joining..." : "Join Group"}
          </ModalButton>
          <ModalCancelButton type="button" onClick={onClose}>
            Cancel
          </ModalCancelButton>
        </ModalForm>
      </ModalBox>
    </ModalOverlay>
  );
};

export default JoinGroupModal;
