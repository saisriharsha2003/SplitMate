import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalBox = styled.div`
  background: #111;
  padding: 30px;
  border-radius: 12px;
  color: #fff;
  text-align: center;
  width: min(400px, calc(100vw - 32px));
  max-height: calc(100dvh - 32px);
  overflow-y: auto;
  padding: clamp(20px, 5vw, 30px);
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ModalTitle = styled.h2`
  font-size: 22px;
  color: #FBCC13;
  margin-bottom: 12px;
`;

export const InviteCodeDisplay = styled.p`
  background: rgba(255,255,255,0.1);
  padding: 12px;
  border-radius: 6px;
  font-weight: bold;
  letter-spacing: 1px;
  color: #fff;
`;

export const ModalButton = styled.button`
  background: #FBCC13;
  border: none;
  padding: 10px;
  border-radius: 6px;
  color: #111;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #FBD12D;
  }
`;
