import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRight, FaEnvelope, FaKey, FaLock } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import MainNav from "../MainNav/MainNav";
import { BASE_URL } from "../config";
import {
  AuthWrapper,
  AuthContainer,
  FormSection,
  FormEyebrow,
  Title,
  FormIntro,
  LoginForm,
  InputGroup,
  Input,
  Button,
  SwitchText,
} from "../Login/LoginStyle";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [step, setStep] = useState("email");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      if (step === "email") {
        await axios.post(`${BASE_URL}/api/user/reset-password`, { email });
        toast.success("If the account exists, a verification code has been sent.");
        setStep("code");
      } else if (step === "code") {
        const response = await axios.post(`${BASE_URL}/api/user/verify-code`, { reset_email: email, code });
        setResetToken(response.data.resetToken);
        setStep("password");
      } else {
        await axios.put(`${BASE_URL}/api/user/new-password`, { reset_email: email, resetToken, newPassword });
        toast.success("Password reset. You can sign in now.");
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Could not complete password reset");
    } finally {
      setBusy(false);
    }
  };

  const stepContent = {
    email: {
      title: "Reset your password",
      description: "Enter your account email and we’ll send a verification code if it matches an account.",
      action: "Send code",
    },
    code: {
      title: "Check your email",
      description: "Enter the verification code we sent to confirm it’s you.",
      action: "Verify code",
    },
    password: {
      title: "Choose a new password",
      description: "Create a password with at least 6 characters.",
      action: "Update password",
    },
  }[step];

  return (
    <>
      <MainNav />
      <AuthWrapper>
        <AuthContainer $single>
          <FormSection>
            <FormEyebrow>Account recovery</FormEyebrow>
            <Title>{stepContent.title}</Title>
            <FormIntro>{stepContent.description}</FormIntro>
            <LoginForm onSubmit={submit}>
              <InputGroup>
                <FaEnvelope className="icon" aria-hidden="true" />
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  disabled={step !== "email"}
                />
              </InputGroup>
              {step === "code" && (
                <InputGroup>
                  <FaKey className="icon" aria-hidden="true" />
                  <Input
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="6-digit verification code"
                    value={code}
                    onChange={(event) => setCode(event.target.value)}
                    required
                  />
                </InputGroup>
              )}
              {step === "password" && (
                <InputGroup>
                  <FaLock className="icon" aria-hidden="true" />
                  <Input
                    type="password"
                    autoComplete="new-password"
                    minLength={6}
                    placeholder="New password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    required
                  />
                </InputGroup>
              )}
              <Button type="submit" disabled={busy}>{busy ? "Please wait…" : stepContent.action}<FaArrowRight /></Button>
            </LoginForm>
            <SwitchText><Link to="/login">Back to sign in</Link></SwitchText>
          </FormSection>
        </AuthContainer>
      </AuthWrapper>
    </>
  );
};

export default ForgotPassword;
