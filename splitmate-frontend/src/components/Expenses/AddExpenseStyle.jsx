import styled, { keyframes } from "styled-components";

const riseIn = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Wrapper = styled.div`
  display: flex;
  flex: 1;
  min-height: calc(100vh - 60px);
  width: 100%;
  padding-top: 60px;
  background: radial-gradient(ellipse at 50% 0%, #191a1b 0%, #101112 58%);
`;

export const Content = styled.main.withConfig({
  shouldForwardProp: (prop) => prop !== "isOpen",
})`
  flex: 1;
  min-width: 0;
  margin-left: ${(props) => (props.isOpen ? "220px" : "80px")};
  padding: clamp(28px, 5vh, 56px) clamp(24px, 6vw, 96px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  transition: margin 280ms cubic-bezier(0.22, 1, 0.36, 1);
`;

export const FormBox = styled.section`
  width: min(100%, 1240px);
  padding: 8px 0 36px;
  animation: ${riseIn} 450ms ease both;
  @media (prefers-reduced-motion: reduce) { animation: none; }
`;

export const FormHeader = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 34px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.09);

  @media (max-width: 560px) { flex-direction: column; }
`;

export const HeaderCopy = styled.div`
  min-width: 0;

  small {
    display: block;
    margin-bottom: 10px;
    color: #d7b733;
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  p { margin: 9px 0 0; color: #a4a9ad; line-height: 1.55; }
`;

export const Title = styled.h1`
  margin: 0;
  color: #fff;
  font-size: clamp(1.7rem, 3.5vw, 2.35rem);
  font-weight: 720;
  line-height: 1.15;
  letter-spacing: -0.04em;

  span { color: #fbcc13; }
`;

export const BackButton = styled.button`
  flex-shrink: 0;
  min-height: 40px;
  padding: 0 13px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.035);
  color: #d4d6d8;
  font: inherit;
  font-size: 0.88rem;
  cursor: pointer;
  transition: background 160ms ease, border-color 160ms ease;

  &:hover { border-color: rgba(251, 204, 19, 0.35); background: rgba(251, 204, 19, 0.08); }
`;

export const Form = styled.form`
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 18px 20px;

  @media (max-width: 900px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

export const Field = styled.div`
  position: relative;
  z-index: 0;
  grid-column: span 2;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 9px;
  padding: 4px 0 0;
  transition: transform 180ms ease;

  @media (max-width: 900px) { grid-column: span 1; }
  @media (max-width: 600px) { grid-column: 1 / -1; }

  &:focus-within {
    z-index: 20;
    transform: translateY(-1px);
  }
`;

export const Label = styled.label`
  color: #e4d38d;
  font-size: 0.88rem;
  font-weight: 650;
`;

export const InputGroup = styled.div`
  min-height: 50px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 14px;
  border: 1px solid rgba(255, 255, 255, 0.13);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.045);
  box-shadow: inset 0 1px rgba(255, 255, 255, 0.025);
  transition: border-color 160ms ease, background 160ms ease, box-shadow 160ms ease;

  &:focus-within {
    border-color: rgba(251, 204, 19, 0.65);
    background: rgba(255, 255, 255, 0.055);
    box-shadow: 0 0 0 3px rgba(251, 204, 19, 0.08);
  }

  .icon { flex: 0 0 auto; color: #d9b62f; font-size: 1rem; }
`;

export const Input = styled.input`
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: #f7f7f7;
  font: inherit;
  font-size: 0.96rem;

  &[type="date"] { color-scheme: dark; }

  &::placeholder { color: #777d82; }
  &[type="number"]::-webkit-inner-spin-button,
  &[type="number"]::-webkit-outer-spin-button { appearance: none; margin: 0; }
`;

export const Select = styled.select`
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: #f7f7f7;
  font: inherit;
  font-size: 0.96rem;
  cursor: pointer;
  appearance: none;
  padding-right: 25px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23fbcc13' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right center;

  option { background: #202122; color: #fff; }
`;

export const ParticipantsPanel = styled.section`
  position: relative;
  overflow: hidden;
  grid-column: 1 / -1;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.11);
  border-radius: 16px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.035), rgba(255, 255, 255, 0.012));
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.16), inset 0 1px rgba(255, 255, 255, 0.035);
`;

export const ParticipantsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 14px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.075);

  p { margin: 4px 0 0; color: #858b90; font-size: 0.82rem; }
`;

export const ParticipantActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const SelectionButton = styled.button`
  padding: 7px 10px;
  border: 1px solid rgba(251, 204, 19, 0.24);
  border-radius: 8px;
  background: rgba(251, 204, 19, 0.06);
  color: #e5c849;
  font: inherit;
  font-size: 0.78rem;
  font-weight: 650;
  cursor: pointer;
  &:hover { background: rgba(251, 204, 19, 0.13); }
`;

export const MemberGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 270px), 1fr));
  gap: 11px;
  max-height: 420px;
  overflow-y: auto;
  padding: 2px 8px 4px 2px;
  scrollbar-color: rgba(251, 204, 19, 0.4) rgba(255, 255, 255, 0.04);
  scrollbar-width: thin;

  &::-webkit-scrollbar { width: 8px; }
  &::-webkit-scrollbar-track { border-radius: 8px; background: rgba(255, 255, 255, 0.035); }
  &::-webkit-scrollbar-thumb { border-radius: 8px; background: rgba(251, 204, 19, 0.3); }
`;

export const MemberOption = styled.label`
  min-width: 0;
  min-height: 64px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 13px;
  border: 1px solid ${(props) => (props.$selected ? "rgba(251, 204, 19, 0.42)" : "rgba(255,255,255,.09)")};
  border-radius: 10px;
  background: ${(props) => (props.$selected ? "linear-gradient(120deg, rgba(251,204,19,.1), rgba(251,204,19,.035))" : "rgba(255,255,255,.025)")};
  color: #e4e6e8;
  cursor: pointer;
  transition: border-color 150ms ease, background 150ms ease, transform 150ms ease;

  box-shadow: ${(props) => (props.$selected ? "inset 0 1px rgba(255,255,255,.035), 0 5px 14px rgba(0,0,0,.14)" : "none")};
  &:hover { transform: translateY(-2px); border-color: rgba(251, 204, 19, 0.5); }

  input { accent-color: #fbcc13; width: 16px; height: 16px; margin: 0; }

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.88rem;
    font-weight: 550;
  }
`;

export const MemberAvatar = styled.div`
  flex: 0 0 30px;
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(251, 204, 19, 0.28);
  border-radius: 10px;
  background: linear-gradient(145deg, rgba(251, 204, 19, 0.22), rgba(251, 204, 19, 0.08));
  color: #f5d85b;
  font-size: 0.8rem;
  font-weight: 750;
  text-transform: uppercase;
`;

export const MemberShareInput = styled.input`
  width: 104px;
  min-width: 90px;
  min-height: 38px;
  margin-left: auto;
  padding: 8px 10px;
  appearance: textfield;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 9px;
  outline: none;
  background: rgba(0, 0, 0, 0.42);
  color: #fff;
  font: inherit;
  font-size: 0.84rem;
  text-align: right;
  font-variant-numeric: tabular-nums;

  &::placeholder { color: #72787d; }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button { appearance: none; margin: 0; }

  &:focus { border-color: rgba(251, 204, 19, 0.65); box-shadow: 0 0 0 2px rgba(251, 204, 19, 0.1); }
`;

export const MemberShareUnit = styled.span`
  flex-shrink: 0;
  color: #92989d;
  font-size: 0.75rem;
  font-weight: 650;
`;

export const SplitModes = styled.div`
  display: flex;
  gap: 7px;
  padding: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.2);
`;

export const SplitModeButton = styled.button`
  padding: 8px 13px;
  border: 0;
  border-radius: 7px;
  background: ${(props) => (props.$active ? "rgba(251, 204, 19, .16)" : "transparent")};
  color: ${(props) => (props.$active ? "#f5d958" : "#9da2a6")};
  font: inherit;
  font-size: 0.82rem;
  font-weight: 650;
  cursor: pointer;
  transition: color 150ms ease, background 150ms ease;
`;

export const SplitPreview = styled.div`
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: -4px;
  padding: 16px 18px;
  border: 1px solid rgba(255, 255, 255, 0.11);
  border-left: 4px solid #fbcc13;
  border-radius: 12px;
  background: linear-gradient(100deg, rgba(255, 255, 255, 0.055), rgba(255, 255, 255, 0.018));
  box-shadow: inset 0 1px rgba(255, 255, 255, 0.04), 0 8px 20px rgba(0, 0, 0, 0.13);

  span { color: #aeb2b6; font-size: 0.85rem; }
  strong { color: #ffe16b; font-size: 1rem; font-variant-numeric: tabular-nums; text-shadow: 0 0 18px rgba(251, 204, 19, 0.16); }
`;

export const SubmitButton = styled.button`
  grid-column: 1 / -1;
  min-height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  border: 0;
  border-radius: 11px;
  background: linear-gradient(135deg, #008b8b, #ccba78);
  color: #181818;
  font: inherit;
  font-size: 0.98rem;
  font-weight: 750;
  cursor: pointer;
  box-shadow: 0 8px 22px rgba(251, 204, 19, 0.14);
  transition: transform 160ms ease, box-shadow 160ms ease, filter 160ms ease;

  &:hover:not(:disabled) { transform: translateY(-2px); filter: brightness(1.06); box-shadow: 0 12px 26px rgba(0, 139, 139, 0.22); }
  &:focus-visible { outline: 3px solid rgba(251, 204, 19, 0.4); outline-offset: 3px; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

export const PageState = styled.div`
  min-height: 60vh;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 14px;
  padding: 24px;
  color: #d3d6d8;
  text-align: center;

  button { padding: 10px 14px; border: 1px solid rgba(251,204,19,.4); border-radius: 9px; background: rgba(251,204,19,.08); color: #fbcc13; cursor: pointer; }
`;
