import React from "react";
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
} from "../Register/RegisterStyle";
import { Link } from "react-router-dom";
import loginImage from "../../assets/images/auth_image.jpg";
import { FaEnvelope, FaLock } from "react-icons/fa";

const Login = () => {
  return (
    <AuthWrapper>
      <AuthContainer>
        <FormSection>
          <Title><span style={{color: "white", paddingRight: "8px"}}>Welcome to</span> SplitMate</Title>
          <form>
            <InputGroup>
              <FaEnvelope className="icon" />
              <Input type="email" placeholder="Email Address" required />
            </InputGroup>

            <InputGroup>
              <FaLock className="icon" />
              <Input type="password" placeholder="Password" required />
            </InputGroup>

            <Button type="submit">Login</Button>
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
  );
};

export default Login;
