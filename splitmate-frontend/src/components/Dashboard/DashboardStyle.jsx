import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";

const rise = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;
const spin = keyframes`to { transform: rotate(360deg); }`;

export const LayoutWrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  background:
    radial-gradient(ellipse at 88% 8%, rgba(251, 204, 19, 0.07), transparent 34%),
    #101112;
`;

export const ContentWrapper = styled.main`
  min-height: 100vh;
  margin-left: ${(props) => (props.$sidebarOpen ? "220px" : "80px")};
  padding: 98px clamp(18px, 3vw, 42px) 50px;
  transition: margin 280ms cubic-bezier(0.22, 1, 0.36, 1);
  @media (max-width: 600px) { padding: 92px 14px 36px; }
`;

export const Header = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin: 8px 0 30px;
  animation: ${rise} 420ms ease both;
  @media (max-width: 600px) { align-items: flex-start; flex-direction: column; gap: 14px; }
`;

export const HeaderEyebrow = styled.div`
  margin-bottom: 9px;
  color: #d4b33b;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.16em;
`;

export const Title = styled.h1`
  margin: 0;
  color: #fff;
  font-size: clamp(1.9rem, 3.8vw, 2.65rem);
  font-weight: 760;
  line-height: 1.1;
  letter-spacing: -0.045em;
`;

export const HeaderSubtitle = styled.p`
  margin: 9px 0 0;
  color: #989ea2;
  font-size: 0.9rem;
  line-height: 1.5;
`;

export const MonthLabel = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 9px 12px;
  border: 1px solid rgba(251, 204, 19, 0.16);
  border-radius: 9px;
  background: rgba(251, 204, 19, 0.055);
  color: #dfc74d;
  font-size: 0.79rem;
  font-weight: 650;
  white-space: nowrap;
`;

export const OverviewGrid = styled.div`
  display: grid;
  gap: 20px;
`;

export const OverviewPanel = styled.section`
  position: relative;
  overflow: hidden;
  padding: clamp(17px, 2vw, 24px);
  border: 1px solid ${(props) => (props.$tone === "personal" ? "rgba(120, 174, 255, .13)" : "rgba(251, 204, 19, .13)")};
  border-radius: 17px;
  background: linear-gradient(145deg, rgba(32, 33, 34, 0.94), rgba(20, 21, 22, 0.96));
  box-shadow: 0 15px 34px rgba(0, 0, 0, 0.18), inset 0 1px rgba(255, 255, 255, 0.03);
  animation: ${rise} 480ms ease both;
  animation-delay: ${(props) => (props.$tone === "personal" ? "100ms" : "0ms")};

  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    height: 2px;
    background: linear-gradient(90deg, ${(props) => (props.$tone === "personal" ? "#80b4ff" : "#ffe16b")}, transparent 75%);
    opacity: 0.55;
  }

  @media (prefers-reduced-motion: reduce) { animation: none; }
`;

export const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
  @media (max-width: 560px) { align-items: flex-start; flex-direction: column; }
`;

export const PanelTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  color: #f0f1f1;
  font-size: 1.08rem;
  font-weight: 720;
  letter-spacing: -0.02em;
  svg { color: #e3c443; font-size: 0.95rem; }
`;

export const PanelDescription = styled.p`
  margin: 6px 0 0;
  color: #898f93;
  font-size: 0.78rem;
  line-height: 1.45;
`;

export const PanelLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  color: #e3c443;
  font-size: 0.78rem;
  font-weight: 650;
  text-decoration: none;
  transition: gap 150ms ease, color 150ms ease;
  &:hover { gap: 11px; color: #ffe16b; }
`;

export const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 11px;
  @media (max-width: 1050px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 540px) { grid-template-columns: 1fr; }
`;

export const MetricCard = styled.article`
  min-width: 0;
  min-height: 150px;
  padding: 15px 16px;
  border: 1px solid rgba(255, 255, 255, 0.065);
  border-radius: 12px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.035), rgba(255, 255, 255, 0.012));
  transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
  &:hover { transform: translateY(-3px); border-color: rgba(255, 255, 255, 0.13); background: rgba(255, 255, 255, 0.045); }
  @media (prefers-reduced-motion: reduce) { transition: none; }
`;

export const MetricIcon = styled.div`
  display: grid;
  width: 32px;
  height: 32px;
  margin-bottom: 12px;
  place-items: center;
  border: 1px solid ${(props) => (props.$tone === "personal" ? "rgba(128,180,255,.18)" : "rgba(251,204,19,.18)")};
  border-radius: 9px;
  background: ${(props) => (props.$tone === "personal" ? "rgba(128,180,255,.08)" : "rgba(251,204,19,.07)")};
  color: ${(props) => (props.$tone === "personal" ? "#9dc5ff" : "#e8ce55")};
  font-size: 0.82rem;
`;

export const MetricLabel = styled.div`
  margin-bottom: 6px;
  color: #93999d;
  font-size: 0.72rem;
  font-weight: 600;
`;

export const MetricValue = styled.div`
  color: #f5f5f4;
  font-size: ${(props) => (props.$compact ? "clamp(1rem, 1.8vw, 1.3rem)" : "1.75rem")};
  font-weight: 740;
  line-height: 1.25;
  letter-spacing: -0.035em;
  font-variant-numeric: tabular-nums;
  overflow-wrap: anywhere;
`;

export const MetricNote = styled.div`
  margin-top: 6px;
  color: #777e82;
  font-size: 0.69rem;
  line-height: 1.4;
`;

export const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;
  min-height: 300px;
  color: #aeb3b6;
  span {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(251, 204, 19, 0.2);
    border-top-color: #fbcc13;
    border-radius: 50%;
    animation: ${spin} 700ms linear infinite;
  }
`;

export const ErrorState = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px;
  border: 1px solid rgba(233, 138, 128, 0.18);
  border-radius: 10px;
  background: rgba(233, 138, 128, 0.055);
  color: #dda19a;
  button { border: 0; background: transparent; color: #f1d36a; cursor: pointer; font: inherit; }
`;
