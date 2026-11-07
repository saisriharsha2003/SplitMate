import styled, { keyframes } from "styled-components";

const riseIn = keyframes`
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const ContentWrapper = styled.main`
  flex: 1;
  min-width: 0;
  min-height: calc(100vh - 60px);
  padding: 32px clamp(24px, 7vw, 104px);
  background:
    radial-gradient(ellipse at 82% 40%, rgba(251, 204, 19, 0.11), transparent 32%),
    radial-gradient(ellipse at 10% 100%, rgba(251, 204, 19, 0.05), transparent 38%),
    #101112;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const LandingWrapper = styled.div`
  width: min(100%, 1180px);
`;

export const HeroSection = styled.section`
  position: relative;
  isolation: isolate;
  min-height: min(600px, calc(100vh - 140px));
  padding: 48px 0;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(300px, 0.95fr);
  align-items: center;
  gap: clamp(32px, 6vw, 82px);
  animation: ${riseIn} 600ms ease both;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
    gap: 36px;
    min-height: 0;
    padding: 42px 0;
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
    background: rgba(251, 204, 19, 0.14);
    filter: blur(50px);
  }
`;

export const HeroImage = styled.img`
  position: relative;
  display: block;
  width: 100%;
  max-height: 480px;
  aspect-ratio: 1 / 0.9;
  object-fit: cover;
  object-position: center;
  border-radius: 22px;
  box-shadow: 0 26px 70px rgba(0, 0, 0, 0.42);

  @media (max-width: 820px) {
    max-height: 360px;
    aspect-ratio: 1.5 / 1;
  }
`;

export const Eyebrow = styled.p`
  margin: 0 0 16px;
  color: #d8b32a;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
`;

export const Title = styled.h1`
  max-width: 650px;
  margin: 0;
  color: #fff;
  font-size: clamp(2.1rem, 4.3vw, 3.55rem);
  line-height: 1.12;
  letter-spacing: -0.04em;
  font-weight: 750;

  span {
    color: #fbcc13;
    overflow-wrap: anywhere;
  }
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
  margin: 14px 0 30px;
  color: #c3c5c7;
  font-size: clamp(0.98rem, 1.4vw, 1.08rem);
  line-height: 1.7;
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  position: relative;
  z-index: 1;
`;

export const ActionLink = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 48px;
  padding: 0 20px;
  border: 1px solid ${({ $primary }) => ($primary ? "#fbcc13" : "rgba(255,255,255,.18)")};
  border-radius: 12px;
  background: ${({ $primary }) => ($primary ? "#fbcc13" : "rgba(255,255,255,.04)")};
  color: ${({ $primary }) => ($primary ? "#171717" : "#f3f3f3")};
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  transition: transform .18s ease, background .18s ease, border-color .18s ease;

  &:hover { transform: translateY(-2px); background: ${({ $primary }) => ($primary ? "#ffda48" : "rgba(255,255,255,.09)")}; }
  &:focus-visible { outline: 3px solid rgba(251,204,19,.45); outline-offset: 3px; }
`;
