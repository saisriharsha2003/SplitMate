import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { FaKey, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { BASE_URL } from "../config";
import {
  ModalOverlay,
  ModalCard,
  ModalHeader,
  Eyebrow,
  ModalTitle,
  ModalDescription,
  CloseButton,
  Form,
  Field,
  InputGroup,
  Input,
  ModalActions,
  CancelButton,
  SubmitButton,
} from "./NewGroupStyle";

const JoinGroupModal = ({ isOpen, onClose, refreshGroups }) => {
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const dialogRef = useRef(null);
  const loadingRef = useRef(loading);
  const onCloseRef = useRef(onClose);
  loadingRef.current = loading;
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement;
    document.body.style.overflow = "hidden";
    const handleKeys = (event) => {
      if (event.key === "Escape" && !loadingRef.current) onCloseRef.current();
      if (event.key !== "Tab") return;
      const focusable = [...(dialogRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ) || [])].filter((element) => element.offsetParent !== null);
      if (!focusable.length) return;
      if (event.shiftKey && document.activeElement === focusable[0]) {
        event.preventDefault();
        focusable.at(-1).focus();
      } else if (!event.shiftKey && document.activeElement === focusable.at(-1)) {
        event.preventDefault();
        focusable[0].focus();
      }
    };
    document.addEventListener("keydown", handleKeys);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeys);
      if (previouslyFocused?.isConnected) previouslyFocused.focus({ preventScroll: true });
    };
  }, [isOpen]);

  const handleClose = () => {
    if (loading) return;
    setInviteCode("");
    onClose();
  };

  const handleJoin = async (event) => {
    event.preventDefault();
    const joinCode = inviteCode.trim();
    if (!joinCode) {
      toast.error("Enter an invite code");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/api/user/groups/join`, { joinCode }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Joined group successfully");
      setInviteCode("");
      refreshGroups?.();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || "Invalid invite code");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <ModalOverlay onMouseDown={(event) => { if (event.target === event.currentTarget) handleClose(); }}>
      <ModalCard ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="join-group-title" aria-describedby="join-group-description">
        <ModalHeader>
          <div>
            <Eyebrow>Groups</Eyebrow>
            <ModalTitle id="join-group-title">Join a group</ModalTitle>
            <ModalDescription id="join-group-description">Enter an invite code shared by a group member.</ModalDescription>
          </div>
          <CloseButton type="button" onClick={handleClose} disabled={loading} aria-label="Close join group dialog"><FaTimes /></CloseButton>
        </ModalHeader>
        <Form onSubmit={handleJoin}>
          <Field>
            Invite code
            <InputGroup>
              <FaKey className="icon" aria-hidden="true" />
              <Input autoFocus type="text" placeholder="Enter invite code" value={inviteCode} onChange={(event) => setInviteCode(event.target.value)} required />
            </InputGroup>
          </Field>
          <ModalActions>
            <CancelButton type="button" onClick={handleClose} disabled={loading}>Cancel</CancelButton>
            <SubmitButton type="submit" disabled={loading}>{loading ? "Joining group…" : "Join group"}</SubmitButton>
          </ModalActions>
        </Form>
      </ModalCard>
    </ModalOverlay>,
    document.body
  );
};

export default JoinGroupModal;
