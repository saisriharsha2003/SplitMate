import styled from "styled-components";

export {
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
  InputGroup,
  Input,
  Button,
  SwitchText,
} from "../Register/RegisterStyle";

export { Button as MotionButton } from "../Register/RegisterStyle";

export const LoginForm = styled.form`
  display: grid;
  gap: 12px;
  margin-top: 23px;
`;

export const ForgotPasswordRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: -1px 0 2px;
`;

export const ForgotPasswordLink = styled.a`
  color: #ddc65e;
  font-size: .78rem;
  font-weight: 650;
  text-decoration: none;
  transition: color 140ms ease;
  &:hover { color: #f2df8c; text-decoration: underline; }
  &:focus-visible { outline: 2px solid rgba(204,186,120,.55); outline-offset: 3px; border-radius: 2px; }
`;
