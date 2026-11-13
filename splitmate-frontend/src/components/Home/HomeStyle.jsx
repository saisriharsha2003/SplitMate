import styled, { keyframes } from "styled-components";

const riseIn = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const HomeLayout = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #101112;

  .home-body { display: flex; flex: 1; padding-top: 60px; }
`;

export const ContentWrapper = styled.main`
  flex: 1;
  min-width: 0;
  min-height: calc(100vh - 60px);
  margin-left: ${(props) => (props.$sidebarOpen ? "220px" : "80px")};
  padding: 28px clamp(18px, 5vw, 72px) 72px;
  background:
    radial-gradient(ellipse at 82% 5%, rgba(251, 204, 19, 0.09), transparent 32%),
    radial-gradient(ellipse at 9% 72%, rgba(128, 180, 255, 0.045), transparent 32%),
    #101112;
  color: #fff;
  transition: margin 280ms cubic-bezier(0.22, 1, 0.36, 1);

  @media (max-width: 600px) { padding: 20px 14px 48px; }
`;

export const LandingWrapper = styled.div`
  width: min(100%, 1240px);
  margin: 0 auto;
`;

export const HeroSection = styled.section`
  position: relative;
  isolation: isolate;
  min-height: 480px;
  padding: clamp(30px, 5vw, 64px) 0 clamp(44px, 7vw, 82px);
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(280px, 0.95fr);
  align-items: center;
  gap: clamp(30px, 6vw, 82px);
  animation: ${riseIn} 600ms ease both;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
    gap: 28px;
    min-height: 0;
    padding: 38px 0 54px;
  }
`;

export const HeroCopy = styled.div`
  position: relative;
  z-index: 1;
  text-align: left;
`;

export const HeroVisual = styled.div`
  position: relative;
  min-width: 0;

  &::before {
    content: "";
    position: absolute;
    inset: 12% 8%;
    border-radius: 50%;
    background: rgba(251, 204, 19, 0.15);
    filter: blur(52px);
  }
`;

export const WorkspacePreview = styled.div`
  position: relative;
  padding: clamp(19px, 3vw, 28px);
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 21px;
  background: linear-gradient(145deg, rgba(34,36,37,.97), rgba(20,21,22,.98));
  box-shadow: 0 28px 70px rgba(0,0,0,.44), inset 0 1px rgba(255,255,255,.04);
  &::before { content: ""; position: absolute; top: 0; left: 9%; right: 9%; height: 2px; border-radius: 0 0 3px 3px; background: linear-gradient(90deg, transparent, #e9d16b, transparent); }
`;

export const PreviewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding-bottom: 19px;
  border-bottom: 1px solid rgba(255,255,255,.08);
  strong { color: #eff0ed; font-size: 1.03rem; letter-spacing: -.02em; }
`;

export const PreviewLabel = styled.span`
  display: block;
  margin-bottom: 6px;
  color: #d8b932;
  font-size: .62rem;
  font-weight: 800;
  letter-spacing: .14em;
`;

export const PreviewDots = styled.div`
  display: flex;
  gap: 5px;
  i { width: 6px; height: 6px; border-radius: 50%; background: #697074; }
  i:first-child { background: #e3c44c; }
`;

export const PreviewSummary = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0,1fr));
  gap: 11px;
  margin: 18px 0 15px;
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;

export const PreviewTile = styled.div`
  min-width: 0;
  padding: 14px;
  border: 1px solid ${(props) => props.$tone === "blue" ? "rgba(128,180,255,.14)" : "rgba(251,204,19,.13)"};
  border-radius: 13px;
  background: ${(props) => props.$tone === "blue" ? "linear-gradient(145deg,rgba(128,180,255,.07),rgba(255,255,255,.015))" : "linear-gradient(145deg,rgba(251,204,19,.065),rgba(255,255,255,.015))"};
  > span { display: block; margin: 11px 0 6px; color: #8a9296; font-size: .59rem; font-weight: 750; letter-spacing: .11em; }
  strong { display: block; color: #eef0ed; font-size: .9rem; }
  small { display: block; margin-top: 6px; color: #899195; font-size: .66rem; line-height: 1.45; }
`;

export const PreviewTileIcon = styled.span`
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 10px;
  background: rgba(255,255,255,.04);
  color: ${(props) => props.$tone === "blue" ? "#9dc5ff" : "#e6cf69"};
`;

export const PreviewRows = styled.div`
  display: grid;
  padding-top: 3px;
`;

export const PreviewRow = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255,255,255,.055);
  &:last-child { border-bottom: 0; }
  > div { min-width: 0; }
  strong { display: block; color: #e7e9e6; font-size: .74rem; }
  small { display: block; margin-top: 4px; color: #858d91; font-size: .66rem; }
  > span:last-child { margin-left: auto; color: #858d91; font-size: .56rem; font-weight: 750; letter-spacing: .08em; }
`;

export const PreviewCheck = styled.span`
  display: grid;
  flex: 0 0 auto;
  width: 31px;
  height: 31px;
  place-items: center;
  border-radius: 9px;
  background: rgba(255,255,255,.045);
  color: #ddc34f;
`;

export const Eyebrow = styled.p`
  margin: 0 0 15px;
  color: #d8b32a;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
`;

export const Title = styled.h1`
  max-width: 680px;
  margin: 0;
  color: #fff;
  font-size: clamp(2.1rem, 4.3vw, 3.55rem);
  line-height: 1.12;
  letter-spacing: -0.04em;
  font-weight: 750;

  span { color: #fbcc13; overflow-wrap: anywhere; }
`;

export const Homep = styled.p`
  margin: 16px 0 0;
  color: #f4d45c;
  font-size: clamp(1.05rem, 1.7vw, 1.28rem);
  line-height: 1.4;
  font-weight: 550;
`;

export const Subtitle = styled.p`
  max-width: 590px;
  margin: 14px 0 26px;
  color: #c3c5c7;
  font-size: clamp(0.96rem, 1.4vw, 1.06rem);
  line-height: 1.7;
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  position: relative;
  z-index: 1;
`;

export const ActionLink = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 47px;
  padding: 0 18px;
  border: 1px solid ${({ $primary }) => ($primary ? "rgba(255,255,255,.16)" : "rgba(255,255,255,.18)")};
  border-radius: 11px;
  background: ${({ $primary }) => ($primary ? "linear-gradient(110deg, #b8860b 0%, #d4b349 48%, #f0df9b 100%)" : "rgba(255,255,255,.04)")};
  color: ${({ $primary }) => ($primary ? "#171717" : "#f3f3f3")};
  font: inherit;
  font-size: 0.84rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform .18s ease, background .18s ease, border-color .18s ease;

  &:hover { transform: translateY(-2px); background: ${({ $primary }) => ($primary ? "linear-gradient(110deg, #c99a12 0%, #dfc45c 48%, #f8e9b0 100%)" : "rgba(255,255,255,.09)")}; }
  &:focus-visible { outline: 3px solid rgba(251,204,19,.45); outline-offset: 3px; }
`;

export const FeatureSection = styled.section`
  display: grid;
  gap: 22px;
  padding: clamp(24px, 4vw, 42px);
  border: 1px solid rgba(255, 255, 255, 0.075);
  border-radius: 20px;
  background: linear-gradient(145deg, rgba(30, 31, 32, 0.96), rgba(20, 21, 22, 0.95));
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.19);
`;

export const SectionHeading = styled.h2`
  margin: 0;
  color: #f2f2f0;
  font-size: clamp(1.25rem, 2.2vw, 1.65rem);
  letter-spacing: -0.03em;
`;

export const SectionDescription = styled.p`
  margin: 7px 0 0;
  color: #969da1;
  font-size: 0.84rem;
  line-height: 1.55;
`;

export const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  @media (max-width: 850px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 580px) { grid-template-columns: 1fr; }
`;

export const FeatureCard = styled.article`
  min-width: 0;
  min-height: 220px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 21px;
  border: 1px solid ${(props) => props.$tone === "personal" ? "rgba(128,180,255,.15)" : props.$tone === "account" ? "rgba(100,214,176,.14)" : "rgba(251,204,19,.14)"};
  border-radius: 15px;
  background: linear-gradient(145deg, rgba(255,255,255,.035), rgba(255,255,255,.012));
  transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
  &:hover { transform: translateY(-3px); background: rgba(255,255,255,.045); }
  @media (prefers-reduced-motion: reduce) { transition: none; }
`;

export const FeatureIcon = styled.div`
  display: grid;
  width: 40px;
  height: 40px;
  margin-bottom: 17px;
  place-items: center;
  border: 1px solid ${(props) => props.$tone === "personal" ? "rgba(128,180,255,.2)" : props.$tone === "account" ? "rgba(100,214,176,.2)" : "rgba(251,204,19,.2)"};
  border-radius: 11px;
  background: ${(props) => props.$tone === "personal" ? "rgba(128,180,255,.08)" : props.$tone === "account" ? "rgba(100,214,176,.08)" : "rgba(251,204,19,.08)"};
  color: ${(props) => props.$tone === "personal" ? "#9dc5ff" : props.$tone === "account" ? "#75d7b5" : "#f2d75b"};
`;

export const FeatureTitle = styled.h3`
  margin: 0;
  color: #f1f2f2;
  font-size: 1rem;
  font-weight: 700;
`;

export const FeatureDescription = styled.p`
  flex: 1;
  margin: 9px 0 18px;
  color: #969da1;
  font-size: 0.79rem;
  line-height: 1.6;
`;

export const FeatureAction = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #e5c94a;
  font: inherit;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: gap 160ms ease, color 160ms ease;
  &:hover { gap: 13px; color: #ffe16b; }
  &:focus-visible { outline: 2px solid #fbcc13; outline-offset: 4px; border-radius: 2px; }
`;

export const FlowSection = styled.section`
  display: grid;
  grid-template-columns: minmax(220px, 0.8fr) minmax(0, 1.5fr);
  gap: clamp(24px, 5vw, 64px);
  align-items: start;
  padding: clamp(40px, 7vw, 78px) 8px 12px;
  @media (max-width: 780px) { grid-template-columns: 1fr; gap: 22px; }
`;

export const FlowHeading = styled.h2`
  max-width: 340px;
  margin: 0;
  color: #f0f1f1;
  font-size: clamp(1.35rem, 2.5vw, 1.8rem);
  line-height: 1.28;
  letter-spacing: -0.035em;
`;

export const FlowGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  @media (max-width: 580px) { grid-template-columns: 1fr; }
`;

export const FlowStep = styled.article`
  padding: 0 0 2px;
`;

export const FlowNumber = styled.span`
  display: inline-block;
  margin-bottom: 12px;
  color: #d6b635;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.1em;
`;

export const FlowTitle = styled.h3`
  margin: 0 0 7px;
  color: #e7e8e7;
  font-size: 0.85rem;
`;

export const FlowText = styled.p`
  margin: 0;
  color: #858c90;
  font-size: 0.76rem;
  line-height: 1.6;
`;
