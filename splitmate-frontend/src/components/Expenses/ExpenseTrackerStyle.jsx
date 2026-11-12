import styled, { keyframes } from "styled-components";
import { Wrapper } from "../Groups/ViewGroupStyle";

export { Wrapper };

const rise = keyframes`
  from { opacity: 0; transform: translateY(10px); }
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
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 22px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.075);
  background: linear-gradient(105deg, rgba(251, 204, 19, 0.045), transparent 62%);

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
  padding: ${(props) => props.$modal ? "26px" : "22px"};
  border: 1px solid rgba(251, 204, 19, 0.14);
  border-radius: 16px;
  background: ${(props) => props.$modal ? "linear-gradient(145deg, #252627, #171819)" : "rgba(0, 0, 0, 0.16)"};
  box-shadow: ${(props) => props.$modal ? "0 28px 90px rgba(0,0,0,.58), inset 0 1px rgba(255,255,255,.035)" : "none"};
  animation: ${rise} 220ms ease both;
  @media (max-width: 560px) {
    width: ${(props) => props.$modal ? "100%" : "auto"};
    margin: ${(props) => props.$modal ? "auto" : "14px 12px 22px"};
    padding: 17px;
  }
`;

export const ExpenseModalOverlay = styled.div`
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
  background: rgba(5, 6, 7, 0.78);
  backdrop-filter: blur(8px);
  @media (max-width: 560px) { padding: 12px; backdrop-filter: blur(5px); }
  @media (prefers-reduced-motion: reduce) { backdrop-filter: none; }
`;

export const FormTitle = styled.h3`
  margin: 0 0 20px;
  color: #e8e9e9;
  font-size: 0.96rem;
  font-weight: 650;
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
  display: flex;
  justify-content: flex-end;
  gap: 9px;
  margin-top: 22px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  @media (max-width: 420px) { flex-direction: column-reverse; button { width: 100%; } }
`;

export const SecondaryButton = styled.button`
  min-height: 36px;
  padding: 0 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.035);
  color: #c6cbce;
  font: inherit;
  font-size: 0.78rem;
  cursor: pointer;
`;

export const PrimaryButton = styled(SecondaryButton)`
  border-color: #fbcc13;
  background: #fbcc13;
  color: #171717;
  font-weight: 750;
  &:hover:not(:disabled) { background: #ffda48; }
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
    padding: 14px 18px;
    border-bottom: 1px solid rgba(251, 204, 19, 0.16);
    background: #1b1c1d;
    color: #c3ac52;
    font-size: 0.66rem;
    font-weight: 750;
    letter-spacing: 0.09em;
    text-transform: uppercase;
  }

  td {
    height: 58px;
    padding: 13px 18px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    color: #9fa5a8;
    font-size: 0.79rem;
    white-space: nowrap;
  }

  tbody tr { transition: background 130ms ease; }
  tbody tr:nth-child(even) { background: rgba(255, 255, 255, 0.018); }
  tbody tr:hover { background: rgba(251, 204, 19, 0.055); }
  tbody tr:last-child td { border-bottom: 0; }
  tbody tr.date-group td {
    height: auto;
    padding: 13px 18px;
    border-bottom: 1px solid rgba(251, 204, 19, 0.1);
    background: rgba(251, 204, 19, 0.045);
    color: #e2c64c;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.025em;
  }
  tbody tr.date-group span { margin-right: 14px; }
  tbody tr.date-group strong { color: #aeb3b6; font-size: 0.68rem; font-weight: 600; }
  td.description { color: #e8e9e9; font-weight: 600; white-space: normal; }
  td.notes { max-width: 260px; overflow: hidden; text-overflow: ellipsis; }
  td .transaction-time { display: block; margin-top: 3px; color: #858d92; font-size: 0.68rem; }
  td.amount { color: #f3d456; font-weight: 750; font-variant-numeric: tabular-nums; }
  td.amount.debit { color: #ed9288; }
  td.amount.credit { color: #79d8aa; }
  td.amount.transfer { color: #aab3bd; }
  td.actions { width: 88px; text-align: center; }
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
