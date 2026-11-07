import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../config";
import {
  ModalOverlay,
  ModalBox,
  ModalTitle,
  ModalForm,
  ModalInputGroup,
  ModalInput,
  ModalActions,
  ModalButton,
  ModalCancelButton,
} from "./JoinGroupModalStyle";
import { toast } from "react-toastify";

const JoinGroupModal = ({ isOpen, onClose, refreshGroups }) => {
  const navigate = useNavigate();
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!inviteCode.trim()) return toast.error("Enter an invite code");

    setLoading(true);
    try {
      await axios.post(
        `${BASE_URL}/api/user/groups/join`,
        { joinCode: inviteCode },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      toast.success("Joined group successfully!", { autoClose: 1500 });
      setInviteCode("");
      refreshGroups?.();
      onClose();
      navigate("/groups");
    } catch (err) {
      toast.error(err.response?.data?.error || "Invalid invite code");
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
          <ModalActions>
            <ModalButton type="submit" disabled={loading} as={motion.button}>
              {loading ? "Joining..." : "Join Group"}
            </ModalButton>
            <ModalCancelButton type="button" onClick={onClose}>
              Cancel
            </ModalCancelButton>
          </ModalActions>
        </ModalForm>
      </ModalBox>
    </ModalOverlay>
  );
};

export default JoinGroupModal;
