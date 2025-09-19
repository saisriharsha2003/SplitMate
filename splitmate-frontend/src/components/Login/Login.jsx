import React from "react";
import {
  AuthWrapper,
  AuthContainer,
  ImageSection,
  FormSection,
  Title,
  InputGroup,
  Input,
  MotionButton,
  SwitchText,
} from "../Login/LoginStyle";
import { Link } from "react-router-dom";
import loginImage from "../../assets/images/auth_image.jpg";
import MainNav from "../MainNav/MainNav";
import { useNavigate } from "react-router-dom";
import { FaUserAlt, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../config";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.username || !formData.password) {
      toast.error("Please fill all details", { autoClose: 1500 });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/user/login`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(response.data.message, { autoClose: 1500 });
      if (response.status === 200) {
        const { name, username } = response.data;

        localStorage.setItem("name", name);
        localStorage.setItem("username", username);

        toast.success("Redirecting to Home...", {
          position: "top-right",
          autoClose: 1500,
        });

        setTimeout(() => {
          navigate("/home");
        }, 2000);
      }
    } catch (err) {
      toast.error(err.response.data.error || "Something went wrong.", {
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
          <FormSection onSubmit={handleSubmit}>
            <Title>
              <span style={{ color: "white", paddingRight: "8px" }}>
                Welcome to
              </span>{" "}
              SplitMate
            </Title>
            <form>
              <InputGroup>
                <FaUserAlt className="icon" />
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

              <MotionButton whileHover={{ scale: 1.1 }} type="submit">
                {loading ? "Logging in..." : "Login"}
              </MotionButton>
            </form>
            <SwitchText>
              Don’t have an account? <Link to="/register">Register</Link>
            </SwitchText>
          </FormSection>

          <ImageSection>
            <img src={loginImage} alt="Login Illustration" />
          </ImageSection>
        </AuthContainer>
      </AuthWrapper>
    </>
  );
};

export default Login;
