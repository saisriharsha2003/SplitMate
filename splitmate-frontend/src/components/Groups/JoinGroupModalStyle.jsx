import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalBox = styled.div`
  background: #1a1a1a;
  padding: 30px;
  border-radius: 12px;
  width: min(400px, calc(100vw - 32px));
  max-height: calc(100dvh - 32px);
  overflow-y: auto;
  padding: clamp(20px, 5vw, 30px);
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const ModalTitle = styled.h2`
  color: #FBCC13;
  font-size: 22px;
  text-align: center;
  margin-bottom: 10px;
`;

export const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ModalActions = styled.div`
  display: flex;
  gap: 16px;

  & > button {
    flex: 1;
    min-width: 0;
  }
`;

export const ModalInputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ModalInput = styled.input`
  padding: 12px;
  border-radius: 8px;
  border: none;
  outline: none;
  font-size: 16px;
  background: #333;
  color: #fff;

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

export const ModalButton = styled.button`
  box-sizing: border-box;
  min-height: 46px;
  padding: 12px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #008b8b, #FBCC13);
  color: #fff;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }

  &:disabled {
    background: #555;
    cursor: not-allowed;
  }
`;

export const ModalCancelButton = styled(ModalButton)`
  background: #555;
  &:hover {
    transform: scale(1.05);
  }
`;
