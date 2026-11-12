import styled, { keyframes } from "styled-components";

const rise = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Page = styled.main.withConfig({
  shouldForwardProp: (prop) => prop !== "$sidebarOpen",
})`
  min-height: 100vh;
  margin-left: ${(props) => (props.$sidebarOpen ? "220px" : "80px")};
  padding: 100px clamp(16px, 3vw, 40px) 48px;
  color: #f4f4f2;
  background: radial-gradient(ellipse at 86% 5%, rgba(251, 204, 19, .07), transparent 34%), #101112;
  transition: margin 260ms ease;
  color-scheme: dark;
  @media (max-width: 760px) { margin-left: 0; padding: 92px 14px 32px; }
`;

export const PageInner = styled.div`
  width: min(100%, 1250px);
  margin: 0 auto;
`;

export const Header = styled.header`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin: 16px 0 26px;
  padding: 8px 0 24px 18px;
  border-bottom: 1px solid rgba(255,255,255,.08);
  animation: ${rise} 380ms ease both;
  &::after {
    content: "";
    position: absolute;
    left: 0;
    top: 6px;
    bottom: 28px;
    width: 3px;
    border-radius: 4px;
    background: linear-gradient(180deg, #ffe16b, #d3a900);
    box-shadow: 0 0 18px rgba(251,204,19,.3);
  }
  @media (max-width: 560px) { align-items: stretch; flex-direction: column; gap: 14px; margin-bottom: 20px; }
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 10px;
  @media (max-width: 560px) { align-items: stretch; flex-direction: column; }
`;

export const Eyebrow = styled.div`
  margin-bottom: 8px;
  color: #d4b33b;
  font-size: .68rem;
  font-weight: 800;
  letter-spacing: .16em;
  text-transform: uppercase;
`;

export const Title = styled.h1`
  margin: 0;
  color: #fff;
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  letter-spacing: -.04em;
`;

export const Description = styled.p`
  margin: 8px 0 0;
  color: #9da1a5;
  font-size: .9rem;
  line-height: 1.5;
`;

export const LinkButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 0 14px;
  border: 1px solid rgba(255,255,255,.13);
  border-radius: 10px;
  background: rgba(255,255,255,.045);
  color: #e9d36b;
  font: inherit;
  font-size: .83rem;
  font-weight: 650;
  cursor: pointer;
  transition: border-color 150ms ease, background 150ms ease, transform 150ms ease;
  &:hover { transform: translateY(-1px); border-color: rgba(251,204,19,.3); background: rgba(251,204,19,.08); }
  &:focus-visible { outline: 2px solid rgba(251,204,19,.55); outline-offset: 2px; }
  @media (max-width: 560px) { width: 100%; }
`;

export const Panel = styled.section`
  min-width: 0;
  margin-bottom: 18px;
  padding: clamp(17px, 2.5vw, 25px);
  border: 1px solid rgba(255,255,255,.085);
  border-radius: 16px;
  background: linear-gradient(145deg, rgba(32,33,34,.92), rgba(21,22,23,.96));
  box-shadow: 0 14px 32px rgba(0,0,0,.14), inset 0 1px rgba(255,255,255,.025);
  animation: ${rise} 420ms ease both;
`;

export const PanelTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 18px;
  color: #f0f1f1;
  font-size: 1.02rem;
  font-weight: 700;
  letter-spacing: -.015em;
  &::before { content: ""; width: 7px; height: 7px; border-radius: 50%; background: #fbcc13; box-shadow: 0 0 12px rgba(251,204,19,.45); }
`;

export const AccountModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1200;
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

export const AccountModal = styled(Panel)`
  width: min(820px, 100%);
  margin: auto;
  padding: clamp(18px, 3vw, 28px);
  border-color: rgba(251,204,19,.2);
  background: linear-gradient(145deg, #252627, #171819);
  box-shadow: 0 28px 90px rgba(0,0,0,.58), inset 0 1px rgba(255,255,255,.035);
`;

export const ModalHeading = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 24px;
  ${Eyebrow} { margin-bottom: 7px; }
  @media (max-width: 480px) { gap: 10px; margin-bottom: 20px; }
`;

export const ModalTitle = styled.h2`
  margin: 0;
  color: #f5f5f3;
  font-size: clamp(1.2rem, 3vw, 1.55rem);
  font-weight: 730;
  letter-spacing: -.025em;
`;

export const ModalClose = styled.button`
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  width: 38px;
  height: 38px;
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 10px;
  background: rgba(255,255,255,.04);
  color: #aeb4b7;
  font-size: .9rem;
  cursor: pointer;
  transition: border-color 140ms ease, background 140ms ease, color 140ms ease;
  &:hover { border-color: rgba(251,204,19,.28); background: rgba(251,204,19,.08); color: #f3d456; }
  &:focus-visible { outline: 2px solid rgba(251,204,19,.55); outline-offset: 2px; }
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
  padding-top: 18px;
  border-top: 1px solid rgba(255,255,255,.075);
  @media (max-width: 420px) { flex-direction: column-reverse; button { width: 100%; } }
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

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  align-items: end;
  gap: 15px 13px;
  @media (max-width: 800px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;

export const Field = styled.label`
  display: grid;
  min-width: 0;
  grid-column: ${(props) => props.$wide ? "span 2" : "auto"};
  gap: 8px;
  color: #c2c6c8;
  font-size: .76rem;
  font-weight: 650;
  @media (max-width: 800px) { grid-column: auto; }
`;

export const Control = styled.input`
  width: 100%;
  min-width: 0;
  min-height: 43px;
  padding: 10px 12px;
  border: 1px solid rgba(255,255,255,.11);
  border-radius: 9px;
  outline: none;
  background: rgba(255,255,255,.04);
  color: #f4f4f2;
  font: inherit;
  font-size: .86rem;
  color-scheme: dark;
  transition: border-color 150ms ease, box-shadow 150ms ease, background 150ms ease;
  &::placeholder { color: #72797d; }
  &:hover { border-color: rgba(255,255,255,.2); }
  &:focus { border-color: rgba(251,204,19,.62); box-shadow: 0 0 0 3px rgba(251,204,19,.08); background: rgba(255,255,255,.055); }
`;

export const Select = styled.select`
  appearance: none;
  width: 100%;
  min-width: 0;
  min-height: 43px;
  padding: 9px 40px 9px 11px;
  border: 1px solid rgba(255,255,255,.1);
  border-radius: 9px;
  outline: none;
  background-color: #242526;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23e2c84d' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 13px center;
  color: #f4f4f2;
  color-scheme: dark;
  cursor: pointer;
  transition: border-color 150ms ease, box-shadow 150ms ease, background-color 150ms ease;
  option { background: #242526; color: #f4f4f2; }
  &:hover { border-color: rgba(255,255,255,.2); background-color: #2b2c2d; }
  &:focus-visible { border-color: rgba(251,204,19,.65); box-shadow: 0 0 0 3px rgba(251,204,19,.1); }
`;

export const SelectFrame = styled.div`
  position: relative;
  z-index: 30;
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  min-height: 45px;
  padding: 0 9px;
  border: 1px solid rgba(255,255,255,.1);
  border-radius: 9px;
  background: #242526;
  transition: border-color 150ms ease, box-shadow 150ms ease, background-color 150ms ease;
  &:hover { border-color: rgba(255,255,255,.2); background-color: #2b2c2d; }
  &:focus-within { border-color: rgba(251,204,19,.65); box-shadow: 0 0 0 3px rgba(251,204,19,.1); }
  > div > button { min-height: 43px; padding: 0 3px; font-size: .86rem; }
`;

export const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 43px;
  padding: 0 16px;
  border: 1px solid #e6c11c;
  border-radius: 9px;
  background: #fbcc13;
  color: #171717;
  font: inherit;
  font-size: .84rem;
  font-weight: 750;
  cursor: pointer;
  &:disabled { opacity: .55; cursor: wait; }
`;

export const AddAccountButton = styled(PrimaryButton)`
  min-width: 145px;
  gap: 8px;
  box-shadow: 0 8px 22px rgba(251,204,19,.1);
  transition: transform 150ms ease, box-shadow 150ms ease, background 150ms ease;
  &:hover:not(:disabled) { transform: translateY(-1px); background: #ffda48; box-shadow: 0 10px 25px rgba(251,204,19,.17); }
  &:focus-visible { outline: 2px solid rgba(251,204,19,.6); outline-offset: 3px; }
  @media (max-width: 560px) { width: 100%; }
`;

export const AccountGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 420px), 1fr));
  align-items: stretch;
  justify-content: start;
  gap: 18px;
`;

export const AccountCard = styled.article`
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  max-width: 680px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,.085);
  border-radius: 16px;
  background: linear-gradient(145deg, rgba(35,36,37,.96), rgba(21,22,23,.98));
  box-shadow: 0 12px 30px rgba(0,0,0,.16), inset 0 1px rgba(255,255,255,.025);
  animation: ${rise} 380ms ease both;
  transition: border-color 180ms ease, box-shadow 180ms ease;
  &:hover { border-color: rgba(251,204,19,.18); box-shadow: 0 18px 38px rgba(0,0,0,.24), inset 0 1px rgba(255,255,255,.035); }
`;

export const AccountTop = styled.div`
  position: relative;
  padding: 20px 22px 18px;
  border-bottom: 1px solid rgba(255,255,255,.07);
  background: linear-gradient(110deg, rgba(251,204,19,.035), transparent 70%);
`;

export const AccountNameRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

export const AccountName = styled.h3`
  display: flex;
  align-items: center;
  gap: 9px;
  min-width: 0;
  overflow-wrap: anywhere;
  margin: 0;
  color: #f6f6f3;
  font-size: 1.08rem;
  font-weight: 720;
  line-height: 1.25;
  svg { display: block; flex: 0 0 auto; color: #d9b62f; font-size: .92rem; }
`;

export const AccountType = styled.span`
  display: inline-flex;
  margin-top: 6px;
  color: #8f979b;
  font-size: .72rem;
`;

export const BalanceLabel = styled.div`
  margin-top: 20px;
  color: #90979b;
  font-size: .7rem;
  font-weight: 650;
  letter-spacing: .07em;
  text-transform: uppercase;
`;

export const Balance = styled.div`
  margin-top: 4px;
  color: ${(props) => props.$negative ? "#f09c92" : "#f4d75d"};
  font-size: clamp(1.5rem, 4vw, 1.95rem);
  font-weight: 760;
  letter-spacing: -.035em;
  overflow-wrap: anywhere;
  font-variant-numeric: tabular-nums;
`;

export const AccountForm = styled.form`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  padding: 17px 20px 18px;
  border-bottom: 1px solid rgba(255,255,255,.07);
  ${PrimaryButton} { grid-column: 1 / -1; }
  small { display: flex; align-items: center; grid-column: 1 / -1; min-height: 2.4em; margin-top: -3px; color: #858d91; font-size: .7rem; line-height: 1.45; }
  @media (max-width: 520px) { grid-template-columns: 1fr; }
`;

export const EntryField = styled.div`
  display: grid;
  min-width: 0;
  gap: 6px;
`;

export const FormLabel = styled.span`
  color: #989fa3;
  font-size: .68rem;
  font-weight: 650;
  letter-spacing: .035em;
`;

export const EntrySelectFrame = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
  min-height: 43px;
  padding: 0 9px;
  border: 1px solid rgba(255,255,255,.11);
  border-radius: 9px;
  background: rgba(255,255,255,.04);
  transition: border-color 150ms ease, box-shadow 150ms ease, background 150ms ease;
  &:hover { border-color: rgba(255,255,255,.2); background: rgba(255,255,255,.055); }
  &:focus-within { border-color: rgba(251,204,19,.62); box-shadow: 0 0 0 3px rgba(251,204,19,.08); }
  > div > button { min-height: 41px; padding: 0 3px; font-size: .82rem; }
`;

export const History = styled.div`
  flex: 1 0 auto;
  padding: 15px 20px 10px;
`;

export const HistoryTitle = styled.h4`
  margin: 0 0 5px;
  color: #c4c8ca;
  font-size: .74rem;
  font-weight: 700;
`;

export const HistoryRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 6px 12px;
  padding: 11px 0;
  border-bottom: 1px solid rgba(255,255,255,.055);
  &:last-child { border-bottom: 0; }
  strong { overflow: hidden; color: #e3e5e5; font-size: .77rem; text-overflow: ellipsis; white-space: nowrap; }
  span { color: ${(props) => props.$credit ? "#91d5b5" : "#e29b92"}; font-size: .76rem; font-weight: 700; font-variant-numeric: tabular-nums; }
  small { color: #858d90; font-size: .68rem; }
  small:last-child { text-align: right; }
  @media (max-width: 360px) { grid-template-columns: minmax(0, 1fr); span, small:last-child { text-align: left; } }
`;

export const HistoryPagination = styled.nav`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 9px;
  margin-top: 8px;
  padding-top: 10px;
  border-top: 1px solid rgba(255,255,255,.06);
`;

export const HistoryPageInfo = styled.span`
  min-width: 42px;
  color: #92999d;
  font-size: .68rem;
  font-variant-numeric: tabular-nums;
  text-align: center;
`;

export const HistoryPageButton = styled.button`
  min-height: 29px;
  padding: 0 9px;
  border: 1px solid rgba(255,255,255,.11);
  border-radius: 7px;
  background: rgba(255,255,255,.035);
  color: #c6cbce;
  font: inherit;
  font-size: .68rem;
  cursor: pointer;
  transition: border-color 140ms ease, background 140ms ease, color 140ms ease;
  &:hover:not(:disabled) { border-color: rgba(251,204,19,.32); background: rgba(251,204,19,.08); color: #f3d456; }
  &:focus-visible { outline: 2px solid rgba(251,204,19,.5); outline-offset: 2px; }
  &:disabled { cursor: not-allowed; opacity: .42; }
`;

export const EmptyState = styled.div`
  display: grid;
  place-items: center;
  min-height: 150px;
  padding: 27px 18px;
  border: 1px dashed rgba(255,255,255,.14);
  border-radius: 12px;
  background: rgba(0,0,0,.1);
  color: #a7adaf;
  font-size: .84rem;
  line-height: 1.6;
  text-align: center;
  button { margin-left: 8px; border: 0; background: transparent; color: #f3d456; font: inherit; cursor: pointer; text-decoration: underline; }
`;
