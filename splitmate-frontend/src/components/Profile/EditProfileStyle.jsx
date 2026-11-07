import styled, { keyframes } from "styled-components";
import backgroundImage from "../../assets/images/background.jpg";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const bounceIn = keyframes`
  0% { transform: scale(0.9); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

export const ProfileContainer = styled.main`
  min-height: 100vh;
  width: 100%;
  padding: 96px 20px 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url(${backgroundImage});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-attachment: scroll;
`;

export const ProfileBox = styled.section`
  width: 100%;
  max-width: 600px;
  padding: 30px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.9);
  box-shadow: 0 0 15px #ccba78;
  text-align: center;
  animation: ${fadeIn} 0.8s ease-in-out;
`;

export const Title = styled.h1`
  margin: 0 0 20px;
  color: #ccba78;
  font-size: 24px;
  font-weight: bold;
  animation: ${slideIn} 0.5s ease-in-out;
`;

export const ProfileForm = styled.form`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 15px;
`;

export const InputGroup = styled.label`
  position: relative;
  display: flex;
  align-items: center;
  width: calc(50% - 8px);
  padding: 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease-in-out;
  animation: ${fadeIn} 0.8s ease-in-out;

  &:hover {
    transform: scale(1.03);
  }

  svg {
    flex: 0 0 auto;
    margin-right: 10px;
    color: #ccba78;
    font-size: 18px;
    transition: transform 0.3s;
  }

  &:hover svg {
    transform: rotate(10deg);
  }

  @media (max-width: 560px) {
    width: 100%;
  }
`;

export const Input = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  color: white;
  font-size: 16px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
    transition: color 0.3s ease-in-out;
  }

  &:focus::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  min-height: 48px;
  margin-top: 15px;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #008b8b, #ccba78);
  color: white;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.3s ease-in-out;
  animation: ${bounceIn} 0.6s ease-in-out;

  &:hover:not(:disabled) {
    transform: scale(1.04);
    background: linear-gradient(-135deg, #008b8b, #ccba78);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }
`;
