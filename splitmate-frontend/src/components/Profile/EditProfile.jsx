import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaPhone } from "react-icons/fa";
import { BeatLoader } from "react-spinners";
import "react-toastify/dist/ReactToastify.css";
import Nav from "../Nav/Nav";
import Sidebar from "../Sidebar/Sidebar";
import { BASE_URL } from "../config";
import {
  ProfileContainer,
  ProfileBox,
  Title,
  ProfileForm,
  InputGroup,
  Input,
  SubmitButton,
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
        <Sidebar isOpen={isSidebarOpen} />
        <ProfileContainer
          style={{
            marginLeft: isSidebarOpen ? "220px" : "80px",
            transition: "margin 0.3s ease",
            flex: 1,
            width: "auto",
            minHeight: "calc(100vh - 60px)",
            paddingTop: "36px",
          }}
        >
          <ProfileBox
            as={motion.section}
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Title>Edit Profile</Title>
            {loading ? (
              <BeatLoader color="#00e6e6" />
            ) : (
              <ProfileForm onSubmit={handleSubmit}>
                <InputGroup>
                  <FaUser aria-hidden="true" />
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full name"
                    required
                  />
                </InputGroup>
                <InputGroup>
                  <FaEnvelope aria-hidden="true" />
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                  />
                </InputGroup>
                <InputGroup>
                  <FaPhone aria-hidden="true" />
                  <Input
                    name="mobile"
                    type="tel"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="10 digit mobile number"
                    pattern="[0-9]{10}"
                    required
                  />
                </InputGroup>
                <InputGroup>
                  <FaUser aria-hidden="true" />
                  <Input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Username"
                    required
                  />
                </InputGroup>
                <SubmitButton type="submit" disabled={saving}>
                  {saving ? <BeatLoader size={8} color="#fff" /> : "Update Profile"}
                </SubmitButton>
              </ProfileForm>
            )}
          </ProfileBox>
        </ProfileContainer>
      </div>
    </>
  );
};

export default EditProfile;
