import styled, { keyframes } from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex: 1;
  padding-top: 60px;
  height: 100vh;
  width: 100%;
`;

export const Content = styled.div`
  flex: 1;
  margin-left: ${(props) => (props.isOpen ? "220px" : "80px")};
  transition: margin 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const FormBox = styled.div`
  background: rgba(0, 0, 0, 0.85);
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 0 20px #00e6e6;
  max-width: 500px;
  width: 100%;
  text-align: center;
  animation: ${fadeIn} 0.5s ease-in-out;
`;

export const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #00e6e6;
  margin-bottom: 20px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const Label = styled.label`
  font-weight: 500;
  color: #fff;
  text-align: left;
`;

export const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.1);
  padding: 12px;
  border-radius: 8px;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.03);
  }

  .icon {
    color: #00e6e6;
    font-size: 18px;
  }
`;

export const Input = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: white;
  font-size: 16px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
    font-style: italic;
  }
`;

export const SubmitButton = styled.button`
  background: linear-gradient(135deg, #008b8b, #ccba78);
  border: none;
  padding: 12px;
  font-size: 18px;
  font-weight: bold;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }

  &:disabled {
    background: #94a3b8;
    cursor: not-allowed;
  }
`;
