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
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 330px), 1fr));
  gap: 14px;
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
  min-width: 0;
  min-height: 120px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.075);
  border-radius: 15px;
  background: linear-gradient(145deg, rgba(33, 34, 35, 0.94), rgba(23, 24, 25, 0.94));
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16);
  animation: ${fadeUp} 420ms ease both;
  transition: transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease;

  &:nth-child(2) { animation-delay: 45ms; }
  &:nth-child(3) { animation-delay: 90ms; }
  &:nth-child(4) { animation-delay: 135ms; }
  &:hover {
    transform: translateY(-3px);
    border-color: rgba(251, 204, 19, 0.25);
    box-shadow: 0 14px 32px rgba(0, 0, 0, 0.28);
  }

  @media (max-width: 460px) {
    align-items: flex-start;
    flex-direction: column;
  }

  @media (prefers-reduced-motion: reduce) { animation: none; transition: none; }
`;

export const GroupInfo = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const GroupName = styled.span`
  overflow: hidden;
  color: #fff;
  font-weight: 680;
  font-size: 1.08rem;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const GroupMembers = styled.span`
  color: #9da1a5;
  font-size: 0.86rem;
`;

export const GroupBalance = styled.span`
  font-weight: 600;
  color: #fbcc13;
`;

export const Actions = styled.div`
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
