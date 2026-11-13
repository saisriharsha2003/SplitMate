import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { FaGlobe, FaTimes, FaUsers } from "react-icons/fa";
import { toast } from "react-toastify";
import CustomSelect from "../Helper/CustomeSelect";
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

const currencyOptions = [
  { value: "INR", label: "INR (₹)" },
  { value: "USD", label: "USD ($)" },
];

const NewGroup = ({ isOpen, onClose, refreshGroups }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", currency: "INR" });
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
    setFormData({ name: "", currency: "INR" });
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const name = formData.name.trim();
    if (!name) {
      toast.error("Group name is required");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/api/user/groups/new`, { ...formData, name }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Group created successfully");
      setFormData({ name: "", currency: "INR" });
      refreshGroups?.();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || "Could not create group");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <ModalOverlay onMouseDown={(event) => { if (event.target === event.currentTarget) handleClose(); }}>
      <ModalCard ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="create-group-title" aria-describedby="create-group-description">
        <ModalHeader>
          <div>
            <Eyebrow>Groups</Eyebrow>
            <ModalTitle id="create-group-title">Create a group</ModalTitle>
            <ModalDescription id="create-group-description">Set up a shared space for expenses with friends or family.</ModalDescription>
          </div>
          <CloseButton type="button" onClick={handleClose} disabled={loading} aria-label="Close create group dialog"><FaTimes /></CloseButton>
        </ModalHeader>
        <Form onSubmit={handleSubmit}>
          <Field>
            Group name
            <InputGroup>
              <FaUsers className="icon" aria-hidden="true" />
              <Input autoFocus name="name" type="text" maxLength={80} placeholder="e.g. Goa trip" value={formData.name} onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))} required />
            </InputGroup>
          </Field>
          <Field>
            Group currency
            <InputGroup>
              <FaGlobe className="icon" aria-hidden="true" />
              <CustomSelect ariaLabel="Group currency" options={currencyOptions} value={currencyOptions.find((option) => option.value === formData.currency)} onChange={(option) => setFormData((current) => ({ ...current, currency: option.value }))} placeholder="Select currency" />
            </InputGroup>
          </Field>
          <ModalActions>
            <CancelButton type="button" onClick={handleClose} disabled={loading}>Cancel</CancelButton>
            <SubmitButton type="submit" disabled={loading}>{loading ? "Creating group…" : "Create group"}</SubmitButton>
          </ModalActions>
        </Form>
      </ModalCard>
    </ModalOverlay>,
    document.body
  );
};

export default NewGroup;
