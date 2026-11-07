import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaArrowLeft, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import Nav from "../Nav/Nav";
import Sidebar from "../Sidebar/Sidebar";
import { BASE_URL } from "../config";
import {
  PasswordPage,
  PasswordCard,
  PasswordHeading,
  PasswordIcon,
  Title,
  Description,
  PasswordForm,
  Field,
  FieldLabel,
  PasswordInputWrap,
  PasswordInput,
  VisibilityButton,
  PasswordHint,
  FormActions,
  BackButton,
  SaveButton,
} from "./ChangePasswordStyle";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [visible, setVisible] = useState({ current: false, next: false, confirm: false });
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const toggleVisible = (key) => setVisible((current) => ({ ...current, [key]: !current[key] }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (form.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      toast.error("The new passwords do not match");
      return;
    }
    setSaving(true);
    try {
      const response = await axios.put(`${BASE_URL}/api/user/profile/password`, {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success(response.data.message || "Password changed successfully");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not change your password");
    } finally {
      setSaving(false);
    }
  };

  const passwordField = (key, label, placeholder, visibilityKey, autoComplete) => (
    <Field>
      <FieldLabel htmlFor={`password-${key}`}>{label}</FieldLabel>
      <PasswordInputWrap>
        <FaLock aria-hidden="true" />
        <PasswordInput
          id={`password-${key}`}
          type={visible[visibilityKey] ? "text" : "password"}
          value={form[key]}
          onChange={(event) => setField(key, event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
        />
        <VisibilityButton type="button" onClick={() => toggleVisible(visibilityKey)} aria-label={`${visible[visibilityKey] ? "Hide" : "Show"} ${label.toLowerCase()}`}>
          {visible[visibilityKey] ? <FaEyeSlash /> : <FaEye />}
        </VisibilityButton>
      </PasswordInputWrap>
    </Field>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Nav toggleSidebar={() => setIsSidebarOpen((open) => !open)} />
      <div style={{ display: "flex", flex: 1, paddingTop: "60px" }}>
        <Sidebar isOpen={isSidebarOpen} />
        <PasswordPage style={{ marginLeft: isSidebarOpen ? "220px" : "80px" }}>
          <PasswordCard>
            <PasswordHeading>
              <PasswordIcon><FaLock /></PasswordIcon>
              <div>
                <Title>Change password</Title>
                <Description>Choose a new password to keep your account secure.</Description>
              </div>
            </PasswordHeading>
            <PasswordForm onSubmit={handleSubmit}>
              {passwordField("currentPassword", "Current password", "Enter your current password", "current", "current-password")}
              {passwordField("newPassword", "New password", "At least 6 characters", "next", "new-password")}
              {passwordField("confirmPassword", "Confirm new password", "Re-enter your new password", "confirm", "new-password")}
              <PasswordHint>Your new password must contain at least 6 characters and differ from your current password.</PasswordHint>
              <FormActions>
                <BackButton type="button" onClick={() => navigate(-1)}><FaArrowLeft /> Cancel</BackButton>
                <SaveButton type="submit" disabled={saving}>{saving ? "Updating…" : "Update password"}</SaveButton>
              </FormActions>
            </PasswordForm>
          </PasswordCard>
        </PasswordPage>
      </div>
    </div>
  );
};

export default ChangePassword;
