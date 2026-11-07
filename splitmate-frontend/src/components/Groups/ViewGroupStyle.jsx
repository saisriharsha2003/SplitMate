import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";

const enter = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Wrapper = styled.main`
  flex: 1;
  min-width: 0;
  padding: 28px clamp(18px, 3vw, 42px) 96px;
  background:
    radial-gradient(ellipse at 88% 3%, rgba(251, 204, 19, 0.08), transparent 32%),
    #101112;
  min-height: calc(100vh - 60px);
  transition: margin 280ms cubic-bezier(0.22, 1, 0.36, 1);
`;

export const Header = styled.header`
  position: relative;
  margin: 16px 0 28px;
  padding: 8px 0 24px 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  animation: ${enter} 420ms ease both;

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

  &::before {
    content: "GROUP OVERVIEW";
    display: block;
    margin-bottom: 12px;
    color: #d4b33b;
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 0.17em;
  }
`;

export const Title = styled.h1`
  margin: 0;
  color: #fff;
  font-size: clamp(1.8rem, 3.5vw, 2.5rem);
  font-weight: 760;
  line-height: 1.15;
  letter-spacing: -0.04em;
  overflow-wrap: anywhere;
  text-shadow: 0 8px 30px rgba(0, 0, 0, 0.32);
`;

export const SubTitle = styled.span`
  display: inline-block;
  margin-top: 10px;
  color: #8f9499;
  font-size: 0.92rem;

  span { color: #fbcc13; font-weight: 600; }
`;

export const BalancesWrapper = styled.section`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 34px;

  @media (max-width: 540px) { grid-template-columns: 1fr; }
`;

export const BalanceCard = styled.article`
  position: relative;
  overflow: hidden;
  min-height: 132px;
  padding: 22px 24px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 16px;
  background: linear-gradient(140deg, rgba(35, 36, 37, 0.98), rgba(23, 24, 25, 0.98));
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  animation: ${enter} 480ms ease both;
  animation-delay: ${(props) => (props.$tone === "owed" ? "80ms" : "0ms")};
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18), inset 0 1px rgba(255, 255, 255, 0.025);
  transition: transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease;

  &:hover {
    transform: translateY(-3px);
    border-color: ${(props) => (props.$tone === "owed" ? "rgba(98, 201, 138, .32)" : "rgba(233, 138, 128, .32)")};
    box-shadow: 0 18px 36px rgba(0, 0, 0, 0.25), inset 0 1px rgba(255, 255, 255, 0.04);
  }

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 18px;
    bottom: 18px;
    width: 3px;
    border-radius: 0 4px 4px 0;
    background: ${(props) => (props.$tone === "owed" ? "#62c98a" : "#e98a80")};
  }

  &::after {
    content: "";
    position: absolute;
    width: 140px;
    height: 140px;
    right: -72px;
    bottom: -90px;
    border-radius: 50%;
    background: ${(props) => (props.$tone === "owed" ? "rgba(98, 201, 138, .08)" : "rgba(233, 138, 128, .08)")};
  }
`;

export const BalanceTitle = styled.span`
  color: #b8bdc1;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

export const BalanceAmount = styled.span`
  color: #fff;
  font-size: clamp(1.4rem, 2.5vw, 1.8rem);
  font-weight: 700;
  letter-spacing: -0.035em;
  font-variant-numeric: tabular-nums;
`;

export const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 18px;
  color: #fff;
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;

  &::before {
    content: "";
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #fbcc13;
    box-shadow: 0 0 12px rgba(251, 204, 19, 0.55);
  }

  &::after {
    content: "";
    width: 48px;
    height: 1px;
    background: linear-gradient(90deg, rgba(251, 204, 19, 0.55), transparent);
  }
`;

export const ExpenseDate = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 22px 0 10px;
  color: #e2c64c;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;

  &::after { content: ""; height: 1px; flex: 1; background: rgba(255, 255, 255, 0.08); }
`;

export const ExpenseCard = styled.article`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  min-height: 76px;
  padding: 15px 18px;
  border: 1px solid rgba(255, 255, 255, 0.065);
  border-radius: 12px;
  margin-bottom: 8px;
  background: rgba(29, 30, 31, 0.82);
  animation: ${enter} 360ms ease both;
  transition: border-color 180ms ease, background 180ms ease, transform 180ms ease;

  &:hover {
    transform: translateX(3px);
    border-color: rgba(251, 204, 19, 0.2);
    background: rgba(35, 36, 37, 0.95);
  }

  @media (max-width: 620px) {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
  }

  @media (prefers-reduced-motion: reduce) { animation: none; transition: none; }
`;

export const ExpenseLeft = styled.div`
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const ExpenseTitle = styled.span`
  overflow: hidden;
  color: #f4f4f4;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ExpenseMeta = styled.span`
  color: #8f9499;
  font-size: 0.82rem;
`;

export const ExpenseTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 2px;
`;

export const ExpenseTag = styled.span`
  padding: 4px 8px;
  border: 1px solid rgba(251, 204, 19, 0.14);
  border-radius: 999px;
  background: rgba(251, 204, 19, 0.055);
  color: #b9aa70;
  font-size: 0.68rem;
  font-weight: 650;
  letter-spacing: 0.02em;
`;

export const SplitBreakdown = styled.section`
  width: 100%;
  margin-top: 7px;
  padding: 11px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 10px;
  background: rgba(12, 13, 14, 0.36);
`;

export const SplitBreakdownHeading = styled.h3`
  margin: 0 0 9px;
  color: #aeb3b6;
  font-size: 0.69rem;
  font-weight: 700;
  letter-spacing: 0.075em;
  text-transform: uppercase;
`;

export const SplitPeople = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 175px), 1fr));
  gap: 6px;

  ${(props) => props.$many && `
    max-height: 280px;
    overflow-y: auto;
    align-content: start;
    padding-right: 5px;
    scrollbar-color: rgba(251, 204, 19, 0.3) rgba(255, 255, 255, 0.035);
    scrollbar-width: thin;

    &::-webkit-scrollbar { width: 7px; }
    &::-webkit-scrollbar-thumb { border-radius: 8px; background: rgba(251, 204, 19, 0.28); }
  `}
`;

export const SplitPerson = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-width: 0;
  padding: 7px 9px;
  border: 1px solid rgba(255, 255, 255, 0.055);
  border-radius: 7px;
  background: rgba(255, 255, 255, 0.025);
`;

export const SplitPersonName = styled.span`
  overflow: hidden;
  color: #c7cbcd;
  font-size: 0.76rem;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const SplitPersonShare = styled.span`
  flex-shrink: 0;
  color: #f2d65c;
  font-size: 0.76rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;

  span {
    margin-left: 4px;
    color: #81888c;
    font-size: 0.68rem;
    font-weight: 550;
  }
`;

export const MembersSection = styled.section`
  margin: 0 0 32px;
`;

export const MemberRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 68px;
  padding: 10px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  background: rgba(29, 30, 31, 0.56);
  transition: background 160ms ease;

  &:first-child { border-radius: 12px 12px 0 0; }
  &:last-child { border-bottom: 0; border-radius: 0 0 12px 12px; }
  &:only-child { border-radius: 12px; }
  &:hover { background: rgba(37, 38, 39, 0.9); }
`;

export const MemberInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`;

export const MemberAvatar = styled.span`
  display: grid;
  flex: 0 0 38px;
  width: 38px;
  height: 38px;
  place-items: center;
  border: 1px solid rgba(251, 204, 19, 0.2);
  border-radius: 50%;
  background: linear-gradient(145deg, rgba(251, 204, 19, 0.18), rgba(251, 204, 19, 0.06));
  color: #f5d85b;
  font-weight: 750;
`;

export const MemberName = styled.div`
  color: #f1f2f2;
  font-size: 0.92rem;
  font-weight: 650;
`;

export const MemberRole = styled.div`
  margin-top: 3px;
  color: #858b90;
  font-size: 0.74rem;
`;

export const RemoveMemberButton = styled.button`
  display: inline-grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border: 1px solid rgba(233, 138, 128, 0.18);
  border-radius: 9px;
  background: rgba(233, 138, 128, 0.06);
  color: #d88c84;
  cursor: pointer;
  &:hover { background: rgba(233, 138, 128, 0.16); border-color: rgba(233, 138, 128, 0.4); }
`;

export const ActivityList = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 12px;
  overflow: hidden;
  background: rgba(29, 30, 31, 0.48);
`;

export const ActivityItem = styled.article`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  &:last-child { border-bottom: 0; }
  @media (max-width: 620px) { flex-direction: column; gap: 6px; }
`;

export const ActivityCopy = styled.div`
  flex: 1 1 auto;
  min-width: 0;
`;

export const ActivityMessage = styled.div`
  color: #b9bec1;
  font-size: 0.87rem;
  line-height: 1.5;
  strong { color: #f2d65c; font-weight: 650; }
`;

export const ActivityTime = styled.time`
  flex-shrink: 0;
  color: #777e83;
  font-size: 0.74rem;
`;

export const Pagination = styled.nav`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 12px 2px 0;
`;

export const PageButton = styled.button`
  min-height: 32px;
  padding: 0 11px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.035);
  color: #d2d5d7;
  font-size: 0.76rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 150ms ease, border-color 150ms ease, color 150ms ease;

  &:hover:not(:disabled) { border-color: rgba(251, 204, 19, 0.35); background: rgba(251, 204, 19, 0.08); color: #f5d85b; }
  &:disabled { cursor: not-allowed; opacity: 0.4; }
  &:focus-visible { outline: 2px solid rgba(251, 204, 19, 0.5); outline-offset: 2px; }
`;

export const PageStatus = styled.span`
  color: #969ca0;
  font-size: 0.76rem;
  font-variant-numeric: tabular-nums;
`;

export const ExpenseAmount = styled.span`
  flex-shrink: 0;
  color: #fbcc13;
  font-size: 1rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
`;

export const ExpenseActions = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 9px;

  @media (max-width: 520px) { width: 100%; flex-wrap: wrap; }
`;

export const ExpenseAction = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  padding: 0 11px;
  border: 1px solid ${(props) => (props.$primary ? "rgba(251,204,19,.35)" : "rgba(255,255,255,.12)")};
  border-radius: 8px;
  background: ${(props) => (props.$primary ? "rgba(251,204,19,.1)" : "rgba(255,255,255,.035)")};
  color: ${(props) => (props.$primary ? "#f5d85b" : "#c4c8cb")};
  font-size: .8rem;
  font-weight: 650;
  text-decoration: none;
  transition: transform 150ms ease, background 150ms ease, border-color 150ms ease;

  &:hover { transform: translateY(-1px); background: rgba(251,204,19,.14); border-color: rgba(251,204,19,.4); }
`;

export const ExpenseDeleteButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 34px;
  border: 1px solid rgba(233, 138, 128, 0.2);
  border-radius: 8px;
  background: rgba(233, 138, 128, 0.07);
  color: #df8f86;
  cursor: pointer;
  transition: background 150ms ease, border-color 150ms ease, transform 150ms ease;

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(233, 138, 128, 0.5);
    background: rgba(233, 138, 128, 0.15);
  }

  &:focus-visible { outline: 2px solid rgba(233, 138, 128, 0.6); outline-offset: 2px; }
`;

export const EmptyExpenses = styled.div`
  padding: 28px 20px;
  border: 1px dashed rgba(255, 255, 255, 0.14);
  border-radius: 12px;
  color: #989da2;
  text-align: center;
`;

export const PageMessage = styled.div`
  min-height: 55vh;
  display: grid;
  place-items: center;
  color: #c5c8cb;
  font-size: 1rem;
`;

export const FloatingButton = styled.button`
  position: fixed;
  z-index: 1200;
  right: 32px;
  bottom: 30px;
  width: 58px;
  height: 58px;
  background: #fbcc13;
  color: #181818;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 19px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.38), 0 0 24px rgba(251, 204, 19, 0.15);
  transition: transform 180ms ease, background 180ms ease, box-shadow 180ms ease;

  &:hover {
    transform: translateY(-3px);
    background: #ffda48;
    box-shadow: 0 14px 32px rgba(0, 0, 0, 0.42), 0 0 28px rgba(251, 204, 19, 0.22);
  }

  &:focus-visible { outline: 3px solid rgba(251, 204, 19, 0.5); outline-offset: 3px; }
  @media (max-width: 560px) { right: 20px; bottom: 20px; }
  @media (prefers-reduced-motion: reduce) { transition: none; }
`;
