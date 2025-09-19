import React, { useState } from "react";
import {
  AuthWrapper,
  AuthContainer,
  ImageSection,
  FormSection,
  Title,
  InputGroup,
  Input,
  Button,
  SwitchText,
  CurrencySelect,
} from "./RegisterStyle";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../config";
import registerImage from "../../assets/images/auth_image.jpg";
import MainNav from "../MainNav/MainNav";
import CurrencyDropdown from "../Helper/CurrencyDropdown";
import {
  FaEnvelope,
  FaLock,
  FaPhone,
  FaUser,
  FaUserCircle,
  FaEye, 
  FaEyeSlash
} from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    username: "",
    password: "",
    default_currency: "INR",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const currencyOptions = [
    { label: "INR", value: "INR" },
    { label: "USD", value: "USD" },
  ];

  const handleCurrencyChange = (selected) => {
    setFormData((prevData) => ({
      ...prevData,
      default_currency: selected[0]?.value || "INR",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(formData).some((field) => field === "")) {
      toast.error("Please fill in all fields", { autoClose: 1500 });
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/user/register`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(response.data.message, { autoClose: 1500 });
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred.", {
        autoClose: 1500,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MainNav />
      <AuthWrapper>
        <AuthContainer>
          <ImageSection>
            <img src={registerImage} alt="Register Illustration" />
          </ImageSection>
          <FormSection>
            <Title>Create Account</Title>
            <form onSubmit={handleSubmit}>
              <InputGroup>
                <FaUser className="icon" />
                <Input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </InputGroup>

              <InputGroup>
                <FaEnvelope className="icon" />
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </InputGroup>

              <InputGroup>
                <FaPhone className="icon" />
                <Input
                  type="tel"
                  name="mobile"
                  placeholder="Mobile Number"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                />
              </InputGroup>
              <InputGroup>
                <FaUserCircle className="icon" />
                <Input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </InputGroup>
              <InputGroup>
                <FaLock className="icon" />
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </InputGroup>
              <InputGroup>
                <FaLock className="icon" />
                <CurrencySelect
                  options={currencyOptions}
                  onChange={(selected) =>
                    setFormData({
                      ...formData,
                      default_currency: selected.value,
                    })
                  }
                  placeholder="Select Currency"
                  isClearable={false}
                  isSearchable={false}
                  defaultValue={currencyOptions[0]}
                />
              </InputGroup>

              <Button type="submit">Register</Button>
            </form>
            <SwitchText>
              Already have an account? <Link to="/login">Login</Link>
            </SwitchText>
          </FormSection>
        </AuthContainer>
      </AuthWrapper>
    </>
  );
};

export default Register;
