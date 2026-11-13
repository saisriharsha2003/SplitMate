import React, { useState } from "react";
import {
  AuthWrapper,
  AuthContainer,
  ImageSection,
  BrandMark,
  BrandPitch,
  BenefitList,
  Benefit,
  FormSection,
  FormEyebrow,
  Title,
  FormIntro,
  RegisterForm,
  InputGroup,
  Input,
  Button,
  SwitchText,
} from "./RegisterStyle";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../config";
import MainNav from "../MainNav/MainNav";
import CustomSelect from "../Helper/CustomeSelect";
import {
  FaArrowRight,
  FaCheckCircle,
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
            <BrandMark><span>SM</span> SplitMate</BrandMark>
            <BrandPitch>
              <h2>Money talk, <span>made easier.</span></h2>
              <p>Keep shared group costs clear and your personal finances organized in one place.</p>
            </BrandPitch>
            <BenefitList>
              <Benefit><FaCheckCircle /> Fair group splits and clear balances</Benefit>
              <Benefit><FaCheckCircle /> Personal accounts and transaction history</Benefit>
              <Benefit><FaCheckCircle /> Monthly views that make sense</Benefit>
            </BenefitList>
          </ImageSection>
          <FormSection>
            <FormEyebrow>Start with SplitMate</FormEyebrow>
            <Title>Create your account</Title>
            <FormIntro>Set up your profile and bring your groups and everyday spending together.</FormIntro>
            <RegisterForm onSubmit={handleSubmit}>
              <InputGroup>
                <FaUser className="icon" />
                <Input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  autoComplete="name"
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
                  autoComplete="email"
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
                  autoComplete="tel"
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
                  autoComplete="username"
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
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </InputGroup>
              <InputGroup>
                <FaLock className="icon" />
                <CustomSelect
                  ariaLabel="Default currency"
                  options={currencyOptions}
                  value={currencyOptions.find((option) => option.value === formData.default_currency)}
                  onChange={(selected) => setFormData((current) => ({ ...current, default_currency: selected.value }))}
                  placeholder="Select Currency"
                />
              </InputGroup>

              <Button type="submit" disabled={loading}>{loading ? "Creating account…" : "Create account"}<FaArrowRight /></Button>
            </RegisterForm>
            <SwitchText>
              Already have an account? <Link to="/login">Sign in</Link>
            </SwitchText>
          </FormSection>
        </AuthContainer>
      </AuthWrapper>
    </>
  );
};

export default Register;
