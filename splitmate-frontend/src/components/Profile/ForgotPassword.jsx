import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import MainNav from "../MainNav/MainNav";
import { BASE_URL } from "../config";
import { AuthWrapper, AuthContainer, FormSection, Title, Input, MotionButton, SwitchText } from "../Login/LoginStyle";

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

  return <>
    <MainNav />
    <AuthWrapper>
      <AuthContainer style={{ width: "min(520px, calc(100% - 32px))", height: "auto", minHeight: 400 }}>
        <FormSection>
          <Title>Reset password</Title>
          <p style={{ textAlign: "center", color: "#c3c5c6" }}>
            {step === "email" ? "Enter your account email to receive a verification code." : step === "code" ? "Enter the code sent to your email." : "Choose a new password with at least 6 characters."}
          </p>
          <form onSubmit={submit} style={{ display: "grid", gap: 14 }}>
            <Input type="email" autoComplete="email" placeholder="Email address" value={email} onChange={(event) => setEmail(event.target.value)} required disabled={step !== "email"} />
            {step === "code" && <Input inputMode="numeric" autoComplete="one-time-code" placeholder="6-digit verification code" value={code} onChange={(event) => setCode(event.target.value)} required />}
            {step === "password" && <Input type="password" autoComplete="new-password" minLength={6} placeholder="New password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required />}
            <MotionButton type="submit" disabled={busy}>{busy ? "Please wait…" : step === "email" ? "Send code" : step === "code" ? "Verify code" : "Update password"}</MotionButton>
          </form>
          <SwitchText><Link to="/login">Back to sign in</Link></SwitchText>
        </FormSection>
      </AuthContainer>
    </AuthWrapper>
  </>;
};

export default ForgotPassword;
