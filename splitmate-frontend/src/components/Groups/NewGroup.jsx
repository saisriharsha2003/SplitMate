import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import axios from "axios";
import { FaUsers, FaGlobe } from "react-icons/fa";
import Nav from "../Nav/Nav";
import Sidebar from "../Sidebar/Sidebar";
import { BASE_URL } from "../config";
import "react-toastify/dist/ReactToastify.css";

import {
  Wrapper,
  Content,
  FormBox,
  Title,
  Form,
  Label,
  InputGroup,
  Input,
  SubmitButton,
} from "./NewGroupStyle";
import CustomSelect from "../Helper/CustomeSelect";

const NewGroup = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    currency: "INR",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (option) => {
    setFormData((prev) => ({ ...prev, currency: option.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Group name is required!", { autoClose: 1500 });
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/api/user/groups/new`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Group created successfully!", { autoClose: 1500 });
      setTimeout(() => navigate("/groups"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.error || "Error creating group", {
        autoClose: 1500,
      });
    } finally {
      setLoading(false);
    }
  };

  const currencyOptions = [
    { value: "INR", label: "INR (₹)" },
    { value: "USD", label: "USD ($)" },
  ];

  const selectedCurrencyOption = currencyOptions.find(
    (opt) => opt.value === formData.currency
  );

  return (
    <div>
      <Nav toggleSidebar={() => setIsSidebarOpen((p) => !p)} />
      <Wrapper>
        <Sidebar isOpen={isSidebarOpen} />
        <Content>
          <FormBox
            as={motion.div}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            <Title>Create a New Group</Title>
            <Form onSubmit={handleSubmit}>
              <Label>Group Name</Label>
              <InputGroup>
                <FaUsers className="icon" />
                <Input
                  type="text"
                  name="name"
                  placeholder="Enter group name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </InputGroup>

              <Label>Currency</Label>
              <InputGroup>
                <FaGlobe className="icon" />
                <CustomSelect
                  options={currencyOptions}
                  value={selectedCurrencyOption}
                  onChange={handleSelectChange}
                  placeholder="Select currency"
                />
              </InputGroup>

              <SubmitButton
                type="submit"
                disabled={loading}
                as={motion.button}
                whileHover={{ scale: 1.05 }}
              >
                {loading ? "Creating Group..." : "Create Group"}
              </SubmitButton>
            </Form>
          </FormBox>
        </Content>
      </Wrapper>
    </div>
  );
};

export default NewGroup;
