import styled, { keyframes } from "styled-components";
import { Wrapper } from "../Groups/ViewGroupStyle";

export { Wrapper };

const rise = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;
const rowEnter = keyframes`
  from { opacity: 0; transform: translateY(7px); }
  to { opacity: 1; transform: translateY(0); }
`;
const headingEnter = keyframes`
  from { opacity: 0; transform: translateY(-7px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Header = styled.header`
  position: relative;
  margin: 16px 0 26px;
  padding: 8px 0 24px 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  animation: ${rise} 400ms ease both;

  &::before {
    content: "PERSONAL FINANCES";
    display: block;
    margin-bottom: 10px;
    color: #d4b33b;
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 0.16em;
  }

  &::after {
    content: "";
    position: absolute;
    left: 0;
    top: 6px;
    bottom: 28px;
    width: 3px;
    border-radius: 4px;
    background: linear-gradient(180deg, #ffe16b, #d3a900);
    box-shadow: 0 0 18px rgba(251, 204, 19, 0.35);
  }
`;

export const Title = styled.h1`
  margin: 0;
  color: #fff;
  font-size: clamp(1.8rem, 3.5vw, 2.5rem);
  font-weight: 760;
  line-height: 1.15;
  letter-spacing: -0.04em;
`;

export const HeaderDescription = styled.p`
  margin: 8px 0 0;
  color: #9da1a5;
  font-size: 0.92rem;
`;

export const SheetToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin: 0 0 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 560px) { align-items: flex-start; flex-direction: column-reverse; border-bottom: 0; }
`;

export const MonthTabs = styled.div`
  display: flex;
  align-items: stretch;
  gap: 4px;
  max-width: 100%;
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(251, 204, 19, 0.28) transparent;
`;

export const MonthTab = styled.button`
  position: relative;
  flex: 0 0 auto;
  min-height: 43px;
  padding: 0 15px;
  border: 0;
  background: transparent;
  color: ${(props) => (props.$active ? "#f3d656" : "#989da1")};
  font: inherit;
  font-size: 0.84rem;
  font-weight: ${(props) => (props.$active ? "700" : "550")};
  cursor: pointer;
  transition: color 150ms ease, background 150ms ease;

  &::after {
    content: "";
    position: absolute;
    right: 10px;
    bottom: -1px;
    left: 10px;
    height: 2px;
    border-radius: 3px 3px 0 0;
    background: #fbcc13;
    transform: scaleX(${(props) => (props.$active ? 1 : 0)});
    transition: transform 180ms ease;
  }

  &:hover { color: #f3d656; background: rgba(251, 204, 19, 0.035); }
  &:focus-visible { outline: 2px solid rgba(251, 204, 19, 0.45); outline-offset: -3px; border-radius: 7px; }
`;

export const MonthPicker = styled.input`
  min-height: 36px;
  margin-bottom: 5px;
  padding: 0 9px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  outline: 0;
  background: rgba(255, 255, 255, 0.04);
  color: #d8dbdd;
  font: inherit;
  font-size: 0.78rem;
  color-scheme: dark;
  &:focus { border-color: rgba(251, 204, 19, 0.45); }
`;

export const MonthSheet = styled.section`
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 17px;
  background: linear-gradient(145deg, rgba(32, 33, 34, 0.92), rgba(21, 22, 23, 0.96));
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.2), inset 0 1px rgba(255, 255, 255, 0.035);
  animation: ${rise} 420ms ease both;
`;

export const SheetHeader = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 22px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.075);
  background: linear-gradient(108deg, rgba(251, 204, 19, 0.085), rgba(251, 204, 19, 0.025) 42%, transparent 78%);
  animation: ${rise} 460ms cubic-bezier(.2,.75,.25,1) both;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 3px;
    background: linear-gradient(180deg, #ffe77c, #d1a900);
    box-shadow: 0 0 16px rgba(251,204,19,.2);
  }

  > div:first-child { min-width: 0; flex: 1 1 auto; }
  p { margin: 5px 0 0; color: #858b90; font-size: 0.78rem; }
  @media (max-width: 700px) { flex-wrap: wrap; padding: 18px; }
  @media (max-width: 520px) { align-items: stretch; flex-direction: column; gap: 12px; padding: 16px; }
`;

export const MonthTitle = styled.h2`
  margin: 0;
  color: #f5f5f4;
  font-size: 1.22rem;
  font-weight: 700;
  letter-spacing: -0.025em;
`;

export const MonthTotal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  color: #f3d456;
  font-size: 1.08rem;
  font-weight: 750;
  font-variant-numeric: tabular-nums;

  span { color: #858b90; font-size: 0.62rem; font-weight: 700; letter-spacing: 0.12em; }
  @media (max-width: 700px) { align-items: flex-start; }
`;

export const AddButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 39px;
  padding: 0 13px;
  border: 1px solid rgba(251, 204, 19, 0.3);
  border-radius: 9px;
  background: rgba(251, 204, 19, 0.1);
  color: #f3d456;
  font: inherit;
  font-size: 0.8rem;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
  transition: transform 150ms ease, background 150ms ease, border-color 150ms ease;
  &:hover { transform: translateY(-1px); border-color: rgba(251, 204, 19, 0.55); background: rgba(251, 204, 19, 0.16); }
  &:disabled { cursor: not-allowed; opacity: .55; }
  @media (max-width: 520px) { width: 100%; }
`;

export const ExpenseForm = styled.form`
  position: relative;
  z-index: 3;
  width: ${(props) => props.$modal ? (props.$wideModal ? "min(980px, 100%)" : "min(760px, 100%)") : "auto"};
  margin: ${(props) => props.$modal ? "auto" : "20px 20px 28px"};
  padding: ${(props) => props.$modal ? "clamp(20px, 3vw, 32px)" : "22px"};
  border: 1px solid ${(props) => props.$modal ? "rgba(251,204,19,.2)" : "rgba(251, 204, 19, 0.14)"};
  border-radius: ${(props) => props.$modal ? "20px" : "16px"};
  background: ${(props) => props.$modal ? "radial-gradient(ellipse at 8% 0%, rgba(251,204,19,.105), transparent 36%), linear-gradient(145deg, #252627, #171819 74%)" : "rgba(0, 0, 0, 0.16)"};
  box-shadow: ${(props) => props.$modal ? "0 28px 90px rgba(0,0,0,.58), inset 0 1px rgba(255,255,255,.035)" : "none"};
  animation: ${rise} 220ms ease both;
  ${(props) => props.$modal && `
    &::before {
      content: "";
      position: absolute;
      top: 0;
      right: 8%;
      left: 8%;
      height: 2px;
      border-radius: 0 0 3px 3px;
      background: linear-gradient(90deg, transparent, #ffe16b 22%, #d3a900 78%, transparent);
      opacity: .9;
      pointer-events: none;
    }
  `}
  @media (max-width: 560px) {
    width: ${(props) => props.$modal ? "100%" : "auto"};
    margin: ${(props) => props.$modal ? "auto" : "14px 12px 22px"};
    padding: 17px;
  }
`;

export const ExpenseModalOverlay = styled.div`
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
  background: rgba(5, 6, 7, 0.78);
  backdrop-filter: blur(8px);
  @media (max-width: 560px) { padding: 12px; backdrop-filter: blur(5px); }
  @media (prefers-reduced-motion: reduce) { backdrop-filter: none; }
`;

export const FormTitle = styled.h3`
  margin: 0;
  color: #f5f5f3;
  font-size: clamp(1.25rem, 2.5vw, 1.55rem);
  font-weight: 730;
  letter-spacing: -.025em;
`;

export const FormEyebrow = styled.span`
  display: block;
  margin-bottom: 7px;
  color: #d4b33b;
  font-size: .65rem;
  font-weight: 800;
  letter-spacing: .15em;
  text-transform: uppercase;
`;

export const FormDescription = styled.p`
  margin: 7px 0 0;
  color: #92999d;
  font-size: .83rem;
  line-height: 1.5;
`;

export const FormHeading = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 25px;
  padding-bottom: 19px;
  border-bottom: 1px solid rgba(255,255,255,.08);
  @media (max-width: 480px) { gap: 12px; margin-bottom: 20px; padding-bottom: 15px; }
`;

export const FormCloseButton = styled.button`
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
  transition: border-color 140ms ease, background 140ms ease, color 140ms ease, transform 140ms ease;
  &:hover { transform: rotate(4deg); border-color: rgba(251,204,19,.3); background: rgba(251,204,19,.08); color: #f3d456; }
  &:focus-visible { outline: 2px solid rgba(251,204,19,.55); outline-offset: 2px; }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  column-gap: 16px;
  row-gap: 20px;
  @media (max-width: 850px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 540px) { grid-template-columns: 1fr; }
`;

export const Field = styled.div`
  min-width: 0;
  grid-column: ${(props) => (props.$wide ? "1 / -1" : props.$spanTwo ? "span 2" : "auto")};
  display: flex;
  flex-direction: column;
  gap: 7px;
  @media (max-width: 850px) { grid-column: ${(props) => (props.$wide ? "1 / -1" : props.$spanTwo ? "span 2" : "auto")}; }
  @media (max-width: 540px) { grid-column: 1; }
`;

export const Label = styled.label`
  color: #cfc38b;
  font-size: 0.76rem;
  font-weight: 650;
  span { margin-left: 4px; color: #777e82; font-weight: 450; }
`;

export const Input = styled.input`
  width: 100%;
  min-width: 0;
  min-height: 40px;
  padding: 0 11px;
  border: 1px solid rgba(255, 255, 255, 0.11);
  border-radius: 8px;
  outline: none;
  background: rgba(255, 255, 255, 0.04);
  color: #eff0f0;
  font: inherit;
  font-size: 0.84rem;
  color-scheme: dark;
  &::placeholder { color: #70777b; }
  &:focus { border-color: rgba(251, 204, 19, 0.5); box-shadow: 0 0 0 3px rgba(251, 204, 19, 0.06); }
`;

export const DropdownFrame = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  min-height: 40px;
  padding: 0 10px;
  border: 1px solid rgba(255, 255, 255, 0.11);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  transition: border-color 150ms ease, box-shadow 150ms ease, background 150ms ease;
  &:hover { border-color: rgba(255, 255, 255, 0.2); background: rgba(255, 255, 255, 0.055); }
  &:focus-within { border-color: rgba(251, 204, 19, 0.5); box-shadow: 0 0 0 3px rgba(251, 204, 19, 0.06); }
  > div > button { min-height: 38px; padding: 0 2px; font-size: 0.84rem; }
`;

export const Select = styled.select`
  width: 100%;
  min-width: 0;
  min-height: 40px;
  padding: 0 34px 0 11px;
  border: 1px solid rgba(255, 255, 255, 0.11);
  border-radius: 8px;
  outline: none;
  appearance: none;
  background-color: #1d1e1f;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23d9b62f' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 11px center;
  color: #eff0f0;
  font: inherit;
  font-size: 0.84rem;
  cursor: pointer;
  color-scheme: dark;

  option { background: #202122; color: #f1f2f2; }
  &:focus { border-color: rgba(251, 204, 19, 0.5); box-shadow: 0 0 0 3px rgba(251, 204, 19, 0.06); }
`;

export const FormActions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 9px;
  width: 100%;
  margin-top: 22px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  button { width: 100%; }
  @media (max-width: 420px) { grid-template-columns: 1fr; }
`;

export const SecondaryButton = styled.button`
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
  &:hover:not(:disabled) { border-color: rgba(255,255,255,.22); background: rgba(255,255,255,.075); }
  &:focus-visible { outline: 2px solid rgba(251,204,19,.5); outline-offset: 2px; }
`;

export const PrimaryButton = styled(SecondaryButton)`
  border-color: rgba(255,255,255,.16);
  background: linear-gradient(135deg, #008b8b, #ccba78);
  color: #171717;
  font-weight: 750;
  &:hover:not(:disabled) { filter: brightness(1.06); }
  &:disabled { cursor: wait; opacity: 0.65; }
`;

export const SheetTableWrap = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  margin-top: 4px;
  overflow-x: auto;
  border-top: 1px solid rgba(251, 204, 19, 0.09);
  scrollbar-width: thin;
  scrollbar-color: rgba(251, 204, 19, 0.3) transparent;
  &::-webkit-scrollbar { height: 8px; }
  &::-webkit-scrollbar-thumb { border-radius: 8px; background: rgba(251, 204, 19, 0.25); }
`;

export const SheetTable = styled.table`
  width: 100%;
  min-width: 1040px;
  border-collapse: collapse;
  text-align: left;

  th {
    position: sticky;
    top: 0;
    z-index: 1;
    padding: 15px 18px 14px;
    border-top: 1px solid rgba(255,255,255,.035);
    border-bottom: 1px solid rgba(251, 204, 19, 0.28);
    background: linear-gradient(180deg, #292a2b 0%, #202122 72%, #1b1c1d 100%);
    box-shadow: inset 0 1px rgba(255,255,255,.035), 0 5px 14px rgba(0,0,0,.16);
    color: #eed76a;
    font-size: 0.67rem;
    font-weight: 800;
    letter-spacing: 0.105em;
    text-transform: uppercase;
    animation: ${headingEnter} 420ms cubic-bezier(.2,.75,.25,1) both;
  }

  th::after {
    content: "";
    position: absolute;
    right: 18px;
    bottom: -1px;
    left: 18px;
    height: 2px;
    border-radius: 2px;
    background: linear-gradient(90deg, rgba(251,204,19,.42), rgba(251,204,19,.04));
    transform: scaleX(.35);
    transform-origin: left;
    transition: transform 180ms ease, opacity 180ms ease;
    opacity: .6;
  }

  th:hover::after { transform: scaleX(1); opacity: 1; }
  th:nth-child(2) { animation-delay: 35ms; }
  th:nth-child(3) { animation-delay: 55ms; }
  th:nth-child(4) { animation-delay: 75ms; }
  th:nth-child(5) { animation-delay: 95ms; }
  th:nth-child(6) { animation-delay: 115ms; }
  th:nth-child(7) { animation-delay: 135ms; }
  th:nth-child(8) { animation-delay: 155ms; }

  th:nth-child(5), td:nth-child(5) { text-align: right; }
  th:first-child { padding-left: 22px; }
  th:last-child::after { display: none; }

  td {
    height: 58px;
    padding: 13px 18px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    color: #9fa5a8;
    font-size: 0.79rem;
    white-space: nowrap;
  }

  tbody tr:not(.date-group) { animation: ${rowEnter} 340ms cubic-bezier(.2,.75,.25,1) both; }
  tbody tr:not(.date-group) td { transition: background-color 150ms ease, color 150ms ease; }
  tbody tr:nth-child(even):not(.date-group) { background: rgba(255, 255, 255, 0.018); }
  tbody tr:not(.date-group):hover td { background: rgba(251, 204, 19, 0.055); }
  tbody tr:not(.date-group):hover td:first-child { box-shadow: inset 3px 0 rgba(251,204,19,.75); }
  tbody tr:last-child td { border-bottom: 0; }
  tbody tr.date-group td {
    height: auto;
    padding: 12px 18px;
    border-top: 1px solid rgba(255,255,255,.035);
    border-bottom: 1px solid rgba(251,204,19,.14);
    border-left: 0;
    background: linear-gradient(90deg, rgba(251,204,19,.035), rgba(0,0,0,.14) 48%, rgba(0,0,0,.08));
    color: #c3c8cc;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.025em;
  }
  tbody tr.date-group span { display: inline-block; margin-right: 12px; color: #e7ca51; }
  tbody tr.date-group strong { display: inline-block; padding: 4px 9px; border: 1px solid rgba(251,204,19,.16); border-radius: 999px; background: rgba(0,0,0,.18); color: #c8ccce; font-size: 0.67rem; font-weight: 600; }
  td.description { color: #f0f1ef; font-weight: 650; white-space: normal; }
  td.notes { max-width: 260px; overflow: hidden; text-overflow: ellipsis; }
  td .transaction-time { display: block; margin-top: 3px; color: #858d92; font-size: 0.68rem; }
  td.amount { color: #f3d456; font-weight: 750; font-variant-numeric: tabular-nums; }
  td.amount.debit { color: #ed9288; }
  td.amount.credit { color: #79d8aa; }
  td.amount.transfer { color: #aab3bd; }
  td.actions { width: 88px; text-align: center; }

  @media (prefers-reduced-motion: reduce) {
    th, ${SheetHeader} { animation: none; }
    th::after { transition: none; }
    tbody tr:not(.date-group) { animation: none; }
    tbody tr:not(.date-group) td { transition: none; }
  }
`;

export const CategoryTag = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.035);
  color: #c2c5c6;
  font-size: 0.7rem;
`;

export const RowAction = styled.button`
  display: grid;
  place-items: center;
  padding: 0;
  width: 30px;
  height: 30px;
  border: 1px solid ${(props) => (props.$danger ? "rgba(233,138,128,.17)" : "rgba(255,255,255,.09)")};
  border-radius: 7px;
  background: ${(props) => (props.$danger ? "rgba(233,138,128,.055)" : "rgba(255,255,255,.035)")};
  color: ${(props) => (props.$danger ? "#d88c84" : "#bfc4c6")};
  line-height: 1;
  cursor: pointer;
  transition: transform 140ms ease, background 140ms ease;
  svg { display: block; width: 13px; height: 13px; }
  &:hover { transform: translateY(-1px); background: ${(props) => (props.$danger ? "rgba(233,138,128,.14)" : "rgba(251,204,19,.09)")}; }
`;

export const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
`;

export const TablePagination = styled.nav`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  min-height: 56px;
  padding: 9px 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.065);
  background: rgba(0, 0, 0, 0.12);
  @media (max-width: 460px) { gap: 8px; padding-inline: 10px; }
`;

export const PageControl = styled.button`
  min-height: 32px;
  padding: 0 11px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.035);
  color: #d2d5d7;
  font: inherit;
  font-size: 0.76rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 150ms ease, border-color 150ms ease, color 150ms ease;
  &:hover:not(:disabled) { border-color: rgba(251, 204, 19, 0.35); background: rgba(251, 204, 19, 0.08); color: #f5d85b; }
  &:disabled { cursor: not-allowed; opacity: 0.4; }
  &:focus-visible { outline: 2px solid rgba(251, 204, 19, 0.5); outline-offset: 2px; }
`;

export const PageInfo = styled.span`
  color: #969ca0;
  font-size: 0.76rem;
  font-variant-numeric: tabular-nums;
  text-align: center;
  @media (max-width: 460px) { font-size: 0.68rem; }
`;

export const EmptyState = styled.div`
  min-height: 230px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 28px;
  color: #92989c;
  text-align: center;
  svg { color: #d8b72f; font-size: 1.5rem; }
  strong { color: #e7e9e9; font-size: 1rem; }
  span { max-width: 420px; font-size: 0.85rem; line-height: 1.55; }
`;

export const LoadingState = styled.div`
  min-height: 210px;
  display: grid;
  place-items: center;
  color: #aeb3b6;
`;
