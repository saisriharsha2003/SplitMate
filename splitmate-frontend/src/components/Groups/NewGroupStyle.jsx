import styled, { keyframes } from "styled-components";

const rise = keyframes`
  from { opacity: 0; transform: translateY(12px) scale(.985); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 2400;
  display: flex;
  align-items: safe center;
  justify-content: center;
  overflow-y: auto;
  box-sizing: border-box;
  padding: clamp(14px, 3vh, 30px) clamp(12px, 3vw, 30px);
  overscroll-behavior: contain;
  background: rgba(5,6,7,.78);
  backdrop-filter: blur(8px);
  @media (max-width: 560px) { padding: 12px; backdrop-filter: blur(5px); }
  @media (prefers-reduced-motion: reduce) { backdrop-filter: none; }
`;

export const ModalCard = styled.div`
  position: relative;
  width: min(620px, 100%);
  margin: auto;
  padding: clamp(20px, 3vw, 30px);
  border: 1px solid rgba(251,204,19,.2);
  border-radius: 20px;
  background: radial-gradient(ellipse at 8% 0%, rgba(251,204,19,.105), transparent 36%), linear-gradient(145deg, #252627, #171819 74%);
  box-shadow: 0 28px 90px rgba(0,0,0,.58), inset 0 1px rgba(255,255,255,.035);
  animation: ${rise} 220ms ease both;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 8%;
    left: 8%;
    height: 2px;
    border-radius: 0 0 3px 3px;
    background: linear-gradient(90deg, transparent, #ffe16b 22%, #d3a900 78%, transparent);
    pointer-events: none;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 24px;
  padding-bottom: 19px;
  border-bottom: 1px solid rgba(255,255,255,.08);
  @media (max-width: 480px) { gap: 10px; margin-bottom: 20px; padding-bottom: 15px; }
`;

export const Eyebrow = styled.span`
  display: block;
  margin-bottom: 7px;
  color: #d4b33b;
  font-size: .65rem;
  font-weight: 800;
  letter-spacing: .15em;
  text-transform: uppercase;
`;

export const ModalTitle = styled.h2`
  margin: 0;
  color: #f5f5f3;
  font-size: clamp(1.25rem, 2.5vw, 1.55rem);
  font-weight: 730;
  letter-spacing: -.025em;
`;

export const ModalDescription = styled.p`
  margin: 7px 0 0;
  color: #92999d;
  font-size: .83rem;
  line-height: 1.5;
`;

export const CloseButton = styled.button`
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  width: 38px;
  height: 38px;
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 10px;
  background: rgba(255,255,255,.04);
  color: #aeb4b7;
  cursor: pointer;
  transition: border-color 140ms ease, background 140ms ease, color 140ms ease;
  &:hover { border-color: rgba(251,204,19,.28); background: rgba(251,204,19,.08); color: #f3d456; }
  &:focus-visible { outline: 2px solid rgba(251,204,19,.55); outline-offset: 2px; }
`;

export const Form = styled.form`
  display: grid;
  gap: 17px;
`;

export const Field = styled.label`
  display: grid;
  min-width: 0;
  gap: 8px;
  color: #cfc38b;
  font-size: .76rem;
  font-weight: 650;
`;

export const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
  min-width: 0;
  min-height: 45px;
  padding: 0 12px;
  border: 1px solid rgba(255,255,255,.11);
  border-radius: 9px;
  background: rgba(255,255,255,.04);
  transition: border-color 150ms ease, box-shadow 150ms ease, background 150ms ease;
  .icon { flex: 0 0 auto; color: #d8bd4e; font-size: 15px; }
  &:hover { border-color: rgba(255,255,255,.2); }
  &:focus-within { border-color: rgba(251,204,19,.55); box-shadow: 0 0 0 3px rgba(251,204,19,.07); background: rgba(255,255,255,.055); }
  > div { flex: 1; min-width: 0; }
  > div > button { min-height: 43px; padding: 0 2px; font-size: .86rem; }
`;

export const Input = styled.input`
  flex: 1;
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: #f4f4f2;
  font: inherit;
  font-size: .86rem;
  &::placeholder { color: #72797d; }
`;

export const ModalActions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  width: 100%;
  margin-top: 7px;
  padding-top: 18px;
  border-top: 1px solid rgba(255,255,255,.075);
  button { width: 100%; }
  @media (max-width: 420px) { grid-template-columns: 1fr; }
`;

export const CancelButton = styled.button`
  min-height: 43px;
  padding: 0 16px;
  border: 1px solid rgba(255,255,255,.13);
  border-radius: 9px;
  background: rgba(255,255,255,.04);
  color: #c8cdcf;
  font: inherit;
  font-size: .84rem;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 140ms ease, background 140ms ease;
  &:hover { border-color: rgba(255,255,255,.22); background: rgba(255,255,255,.075); }
  &:focus-visible { outline: 2px solid rgba(251,204,19,.5); outline-offset: 2px; }
`;

export const SubmitButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  width: 100%;
  min-height: 43px;
  padding: 0 16px;
  border: 1px solid rgba(255,255,255,.16);
  border-radius: 9px;
  background: linear-gradient(135deg, #008b8b, #ccba78);
  color: #171717;
  font: inherit;
  font-size: .84rem;
  font-weight: 750;
  cursor: pointer;
  transition: filter 140ms ease, transform 140ms ease;
  svg { display: block; flex: 0 0 auto; width: 14px; height: 14px; }
  &:hover:not(:disabled) { filter: brightness(1.06); transform: translateY(-1px); }
  &:focus-visible { outline: 2px solid rgba(251,204,19,.55); outline-offset: 3px; }
  &:disabled { opacity: .55; cursor: wait; }
`;
