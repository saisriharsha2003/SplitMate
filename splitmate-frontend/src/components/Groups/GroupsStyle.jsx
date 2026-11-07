import styled, { keyframes } from "styled-components";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const Wrapper = styled.div`
  display: flex;
`;

export const Content = styled.main`
  flex: 1;
  min-width: 0;
  padding: 28px clamp(18px, 3vw, 42px);
  background:
    radial-gradient(ellipse at 88% 6%, rgba(251, 204, 19, 0.08), transparent 34%),
    #101112;
  min-height: calc(100vh - 60px);
  transition: margin 280ms cubic-bezier(0.22, 1, 0.36, 1);
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  margin: 18px 0 30px;
  animation: ${fadeUp} 420ms ease both;

  h1 {
    margin: 0;
    color: #fff;
    font-size: clamp(1.7rem, 3vw, 2.15rem);
    font-weight: 720;
    letter-spacing: -0.035em;
  }

  p {
    margin: 7px 0 0;
    color: #9da1a5;
    font-size: 0.96rem;
  }

  @media (max-width: 560px) {
    align-items: stretch;
    flex-direction: column;
    gap: 16px;
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  @media (max-width: 560px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
`;

export const AddButton = styled.button`
  min-height: 42px;
  padding: 0 15px;
  border: 1px solid ${({ $primary }) => ($primary ? "#fbcc13" : "rgba(255,255,255,.15)")};
  border-radius: 10px;
  background: ${({ $primary }) => ($primary ? "#fbcc13" : "rgba(255,255,255,.045)")};
  color: ${({ $primary }) => ($primary ? "#171717" : "#f2f2f2")};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  font: inherit;
  font-size: 0.9rem;
  font-weight: 700;
  transition: transform 180ms ease, background 180ms ease, border-color 180ms ease;

  &:hover {
    transform: translateY(-2px);
    background: ${({ $primary }) => ($primary ? "#ffda48" : "rgba(255,255,255,.09)")};
  }

  &:focus-visible { outline: 2px solid #fbcc13; outline-offset: 3px; }

  @media (prefers-reduced-motion: reduce) { transition: none; }
`;

export const GroupsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 440px), 1fr));
  gap: 18px;
  padding-bottom: 24px;
`;

export const EmptyState = styled.section`
  min-height: min(570px, calc(100vh - 190px));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 32px 20px;
  color: #fff;
  animation: ${fadeUp} 500ms ease both;

  h2 {
    margin: 22px 0 8px;
    color: #fff;
    font-size: 1.55rem;
    letter-spacing: -0.025em;
  }

  p {
    max-width: 420px;
    margin: 0;
    color: #aeb2b6;
    line-height: 1.7;
  }
`;

export const EmptyStateIcon = styled.div`
  display: grid;
  place-items: center;
  width: 74px;
  height: 74px;
  border: 1px solid rgba(251, 204, 19, 0.25);
  border-radius: 24px;
  background: linear-gradient(145deg, rgba(251, 204, 19, 0.17), rgba(251, 204, 19, 0.05));
  color: #fbcc13;
  font-size: 1.8rem;
  box-shadow: 0 14px 38px rgba(0, 0, 0, 0.25);
`;

export const LoadingState = styled.div`
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #bfc3c7;

  &::before {
    content: "";
    width: 18px;
    height: 18px;
    border: 2px solid rgba(251, 204, 19, 0.25);
    border-top-color: #fbcc13;
    border-radius: 50%;
    animation: ${spin} 700ms linear infinite;
  }

  @media (prefers-reduced-motion: reduce) { &::before { animation: none; } }
`;

export const GroupCard = styled.article`
  position: relative;
  isolation: isolate;
  overflow: hidden;
  min-width: 0;
  min-height: 142px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 22px 22px 22px 25px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(37, 38, 39, 0.98), rgba(24, 25, 26, 0.98) 72%);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2), inset 0 1px rgba(255, 255, 255, 0.035);
  animation: ${fadeUp} 420ms ease both;
  animation-delay: ${(props) => `${Math.min(props.$index || 0, 8) * 55}ms`};
  transition: transform 240ms cubic-bezier(0.2, 0.8, 0.2, 1), border-color 220ms ease, box-shadow 220ms ease, background 220ms ease;

  &::before {
    content: "";
    position: absolute;
    z-index: -1;
    left: 0;
    top: 18px;
    bottom: 18px;
    width: 3px;
    border-radius: 0 4px 4px 0;
    background: linear-gradient(180deg, #ffe77c, #d6ae08);
    box-shadow: 0 0 16px rgba(251, 204, 19, 0.45);
    transition: top 220ms ease, bottom 220ms ease, width 220ms ease;
  }

  &::after {
    content: "";
    position: absolute;
    z-index: -1;
    right: -70px;
    bottom: -110px;
    width: 230px;
    height: 230px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(251, 204, 19, 0.105), transparent 68%);
    opacity: 0.55;
    transition: transform 260ms ease, opacity 220ms ease;
  }

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(251, 204, 19, 0.32);
    background: linear-gradient(135deg, rgba(42, 42, 40, 0.99), rgba(25, 26, 27, 0.99) 72%);
    box-shadow: 0 20px 42px rgba(0, 0, 0, 0.34), 0 0 26px rgba(251, 204, 19, 0.055), inset 0 1px rgba(255, 255, 255, 0.05);
    &::before { top: 12px; bottom: 12px; width: 4px; }
    &::after { transform: scale(1.18); opacity: 0.9; }
    .group-icon { transform: rotate(-5deg) scale(1.06); box-shadow: 0 8px 20px rgba(0, 0, 0, 0.22); }
  }

  @media (max-width: 460px) {
    align-items: flex-start;
    flex-direction: column;
  }

  @media (prefers-reduced-motion: reduce) { animation: none; transition: none; }
`;

export const GroupInfo = styled.div`
  position: relative;
  z-index: 1;
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const GroupIdentity = styled.div`
  width: 100%;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 13px;
`;

export const GroupIcon = styled.span`
  flex: 0 0 46px;
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  border: 1px solid ${(props) => ["rgba(251, 204, 19, 0.22)", "rgba(115, 177, 255, 0.2)", "rgba(148, 211, 167, 0.18)"][props.$variant || 0]};
  border-radius: 14px;
  background: linear-gradient(145deg, ${(props) => ["rgba(251, 204, 19, 0.16)", "rgba(115, 177, 255, 0.12)", "rgba(148, 211, 167, 0.1)"][props.$variant || 0]}, rgba(255, 255, 255, 0.025));
  color: ${(props) => ["#f4d453", "#9ac8ff", "#9bd4a8"][props.$variant || 0]};
  font-size: 1.1rem;
  box-shadow: inset 0 1px rgba(255, 255, 255, 0.045), 0 6px 15px rgba(0, 0, 0, 0.15);
  transition: transform 220ms ease, box-shadow 220ms ease;

`;

export const GroupName = styled.span`
  display: block;
  flex: 1 1 auto;
  min-width: 0;
  color: #fff;
  overflow-wrap: anywhere;
  font-weight: 680;
  font-size: 1.08rem;
  line-height: 1.35;
`;

export const GroupMembers = styled.span`
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 5px 9px;
  border: 1px solid rgba(255, 255, 255, 0.075);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.035);
  color: #aeb3b6;
  font-size: 0.76rem;
  font-weight: 600;

  &::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #a6c69a;
    box-shadow: 0 0 8px rgba(166, 198, 154, 0.45);
  }
`;

export const GroupBalance = styled.span`
  font-weight: 600;
  color: #fbcc13;
`;

export const Actions = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-shrink: 0;
  gap: 7px;
`;

export const ActionButton = styled.button`
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.045);
  color: #c8cbd0;
  font-size: 0.95rem;
  cursor: pointer;
  transition: transform 160ms ease, background 160ms ease, color 160ms ease, border-color 160ms ease;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(251, 204, 19, 0.35);
    background: rgba(251, 204, 19, 0.12);
    color: #fbcc13;
  }

  &:focus-visible { outline: 2px solid #fbcc13; outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) { transition: none; }
`;
