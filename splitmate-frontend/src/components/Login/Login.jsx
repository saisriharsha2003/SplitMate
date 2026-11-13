import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRight, FaCheckCircle, FaEye, FaEyeSlash, FaLock, FaUserAlt } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MainNav from "../MainNav/MainNav";
import { BASE_URL } from "../config";
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
  LoginForm,
  InputGroup,
  Input,
  ForgotPasswordRow,
  ForgotPasswordLink,
  Button,
  SwitchText,
} from "./LoginStyle";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.username || !formData.password) {
      toast.error("Please fill all details", { autoClose: 1500 });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/api/user/login`, formData, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success(response.data.message, { autoClose: 1500 });
      if (response.status === 200) {
        const { name, username, token } = response.data;
        localStorage.setItem("name", name);
        localStorage.setItem("username", username);
        localStorage.setItem("token", token);
        toast.success("Redirecting to Home…", { position: "top-right", autoClose: 1500 });
        setTimeout(() => navigate("/home"), 2000);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Something went wrong.", { autoClose: 1500 });
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
              <h2>Good to see you <span>again.</span></h2>
              <p>Pick up where you left off. Your groups, balances, and personal ledger are ready when you are.</p>
            </BrandPitch>
            <BenefitList>
              <Benefit><FaCheckCircle /> Your shared expenses stay organized</Benefit>
              <Benefit><FaCheckCircle /> Personal accounts stay in sync</Benefit>
              <Benefit><FaCheckCircle /> Every balance has a clear history</Benefit>
            </BenefitList>
          </ImageSection>
          <FormSection>
            <FormEyebrow>Welcome back</FormEyebrow>
            <Title>Sign in to SplitMate</Title>
            <FormIntro>Enter your username and password to continue.</FormIntro>
            <LoginForm onSubmit={handleSubmit}>
              <InputGroup>
                <FaUserAlt className="icon" aria-hidden="true" />
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
                <FaLock className="icon" aria-hidden="true" />
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </InputGroup>
              <ForgotPasswordRow>
                <ForgotPasswordLink as={Link} to="/forgot-password">Forgot password?</ForgotPasswordLink>
              </ForgotPasswordRow>
              <Button type="submit" disabled={loading}>{loading ? "Signing in…" : "Sign in"}<FaArrowRight /></Button>
            </LoginForm>
            <SwitchText>Don’t have an account? <Link to="/register">Create one</Link></SwitchText>
          </FormSection>
        </AuthContainer>
      </AuthWrapper>
    </>
  );
};

export default Login;
