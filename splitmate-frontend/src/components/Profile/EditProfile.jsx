import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaArrowLeft, FaEnvelope, FaPhone, FaUser, FaUserEdit } from "react-icons/fa";
import { BeatLoader } from "react-spinners";
import "react-toastify/dist/ReactToastify.css";
import Nav from "../Nav/Nav";
import Sidebar from "../Sidebar/Sidebar";
import { BASE_URL } from "../config";
import {
  ProfileContainer,
  ProfileBox,
  ProfileHeader,
  ProfileAvatar,
  Title,
  Description,
  ProfileForm,
  Field,
  FieldLabel,
  InputGroup,
  Input,
  FormActions,
  CancelButton,
  SubmitButton,
  ProfileLoading,
} from "./EditProfileStyle";

const EditProfile = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    username: "",
  });

  useEffect(() => {
    let isMounted = true;
    axios
      .get(`${BASE_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(({ data }) => {
        if (isMounted) setFormData(data);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Failed to load profile details.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const { data } = await axios.put(`${BASE_URL}/api/user/profile`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setFormData(data.user);
      localStorage.setItem("username", data.user.username);
      localStorage.setItem("name", data.user.name);
      toast.success(data.message || "Profile updated successfully");
      navigate("/home");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Nav toggleSidebar={() => setIsSidebarOpen((open) => !open)} />
      <div style={{ display: "flex", flex: 1, paddingTop: "60px" }}>
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <ProfileContainer style={{ marginLeft: isSidebarOpen ? "220px" : "80px" }}>
          <ProfileBox
            as={motion.section}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <ProfileHeader>
              <ProfileAvatar><FaUserEdit /></ProfileAvatar>
              <div>
                <Title>Edit your profile</Title>
                <Description>Keep your account details up to date.</Description>
              </div>
            </ProfileHeader>
            {loading ? (
              <ProfileLoading><BeatLoader color="#fbcc13" /></ProfileLoading>
            ) : (
              <ProfileForm onSubmit={handleSubmit}>
                <Field>
                  <FieldLabel htmlFor="profile-name">Full name</FieldLabel>
                  <InputGroup>
                    <FaUser aria-hidden="true" />
                    <Input id="profile-name" name="name" autoComplete="name" value={formData.name} onChange={handleChange} placeholder="Your full name" required />
                  </InputGroup>
                </Field>
                <Field>
                  <FieldLabel htmlFor="profile-email">Email address</FieldLabel>
                  <InputGroup>
                    <FaEnvelope aria-hidden="true" />
                    <Input id="profile-email" name="email" type="email" autoComplete="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required />
                  </InputGroup>
                </Field>
                <Field>
                  <FieldLabel htmlFor="profile-mobile">Mobile number</FieldLabel>
                  <InputGroup>
                    <FaPhone aria-hidden="true" />
                    <Input id="profile-mobile" name="mobile" type="tel" autoComplete="tel" value={formData.mobile} onChange={handleChange} placeholder="10 digit mobile number" pattern="[0-9]{10}" required />
                  </InputGroup>
                </Field>
                <Field>
                  <FieldLabel htmlFor="profile-username">Username</FieldLabel>
                  <InputGroup>
                    <FaUser aria-hidden="true" />
                    <Input id="profile-username" name="username" autoComplete="username" value={formData.username} onChange={handleChange} placeholder="Choose a username" required />
                  </InputGroup>
                </Field>
                <FormActions>
                  <CancelButton type="button" onClick={() => navigate(-1)}><FaArrowLeft /> Cancel</CancelButton>
                  <SubmitButton type="submit" disabled={saving}>
                    {saving ? <BeatLoader size={8} color="#171717" /> : "Save changes"}
                  </SubmitButton>
                </FormActions>
              </ProfileForm>
            )}
          </ProfileBox>
        </ProfileContainer>
      </div>
    </>
  );
};

export default EditProfile;
