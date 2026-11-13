import styled, { keyframes } from "styled-components";

const riseIn = keyframes`
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-7px); }
`;

export const LandingWrapper = styled.main`
  min-height: 100vh;
  padding: 72px clamp(18px, 5vw, 76px) 36px;
  overflow: hidden;
  color: #f4f4f2;
  background:
    radial-gradient(ellipse at 82% 11%, rgba(251,204,19,.1), transparent 30%),
    radial-gradient(ellipse at 8% 58%, rgba(0,139,139,.08), transparent 28%),
    #101112;
  @media (max-width: 600px) { padding: 68px 16px 24px; }
`;

export const HeroSection = styled.section`
  position: relative;
  isolation: isolate;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(340px, .92fr);
  align-items: center;
  gap: clamp(32px, 6vw, 82px);
  width: min(100%, 1200px);
  min-height: min(680px, calc(100svh - 86px));
  margin: 0 auto;
  padding: 44px 0 68px;
  animation: ${riseIn} 600ms ease both;
  @media (max-width: 850px) { grid-template-columns: 1fr; min-height: 0; gap: 38px; padding: 64px 0 56px; }
`;

export const HeroCopy = styled.div`
  position: relative;
  z-index: 1;
  max-width: 650px;
`;

export const Eyebrow = styled.p`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 19px;
  color: #ddc04d;
  font-size: .69rem;
  font-weight: 800;
  letter-spacing: .16em;
  text-transform: uppercase;
  &::before { content: ""; width: 22px; height: 1px; background: linear-gradient(90deg, #008b8b, #d1b864); }
`;

export const Title = styled.h1`
  max-width: 700px;
  margin: 0;
  color: #f7f7f4;
  font-size: clamp(2.7rem, 6.1vw, 5.2rem);
  line-height: .99;
  letter-spacing: -.065em;
  font-weight: 780;
  span { display: block; color: #e9d16b; }
  @media (max-width: 600px) { font-size: clamp(2.45rem, 12vw, 4rem); }
`;

export const Subtitle = styled.p`
  max-width: 560px;
  margin: 22px 0 28px;
  color: #aeb4b7;
  font-size: clamp(1rem, 1.6vw, 1.13rem);
  line-height: 1.75;
`;

export const HeroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

export const CTAButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 48px;
  padding: 0 19px;
  border: 1px solid rgba(255,255,255,.16);
  border-radius: 11px;
  background: linear-gradient(110deg, #b8860b 0%, #d4b349 48%, #f0df9b 100%);
  color: #171717;
  font-size: .88rem;
  font-weight: 750;
  text-decoration: none;
  transition: transform 160ms ease, filter 160ms ease, box-shadow 160ms ease;
  &:hover { transform: translateY(-2px); filter: brightness(1.04); box-shadow: 0 10px 26px rgba(184,134,11,.18); }
  &:focus-visible { outline: 3px solid rgba(251,204,19,.45); outline-offset: 3px; }
  @media (max-width: 460px) { width: 100%; }
`;

export const SecondaryCTA = styled(CTAButton)`
  border-color: rgba(255,255,255,.13);
  background: rgba(255,255,255,.045);
  color: #e5e7e7;
  &:hover { border-color: rgba(255,255,255,.24); background: rgba(255,255,255,.08); box-shadow: none; }
`;

export const HeroNote = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  margin-top: 25px;
  color: #858d91;
  font-size: .77rem;
  svg { color: #77d2aa; }
`;

export const PreviewStage = styled.div`
  position: relative;
  min-width: 0;
  padding: clamp(14px, 3vw, 28px);
  &::before {
    content: "";
    position: absolute;
    inset: 8% 5%;
    z-index: -1;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,139,139,.24), rgba(204,186,120,.12) 45%, transparent 72%);
    filter: blur(25px);
  }
  @media (max-width: 850px) { max-width: 600px; width: 100%; justify-self: center; padding: 0; }
`;

export const PreviewCard = styled.div`
  position: relative;
  padding: clamp(20px, 3vw, 30px);
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 21px;
  background: linear-gradient(145deg, rgba(34,36,37,.97), rgba(20,21,22,.98));
  box-shadow: 0 28px 70px rgba(0,0,0,.48), inset 0 1px rgba(255,255,255,.04);
  animation: ${float} 6s ease-in-out infinite;
  @media (prefers-reduced-motion: reduce) { animation: none; }
`;

export const PreviewTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255,255,255,.08);
`;

export const PreviewBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
  color: #f1f2ef;
  font-weight: 700;
  svg { display: grid; width: 38px; height: 38px; padding: 10px; border-radius: 11px; background: rgba(251,204,19,.1); color: #ebd15a; }
  small { display: block; margin-top: 3px; color: #838b8f; font-size: .68rem; font-weight: 500; }
`;

export const PreviewPill = styled.span`
  padding: 6px 9px;
  border: 1px solid rgba(119,210,170,.2);
  border-radius: 999px;
  background: rgba(119,210,170,.07);
  color: #8bd8b5;
  font-size: .65rem;
  font-weight: 700;
`;

export const PreviewSummary = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin: 19px 0;
`;

export const SummaryTile = styled.div`
  min-width: 0;
  padding: 15px;
  border: 1px solid rgba(255,255,255,.075);
  border-radius: 13px;
  background: rgba(255,255,255,.025);
  span { display: block; color: #858d91; font-size: .69rem; }
  strong { display: block; margin-top: 8px; color: ${(props) => props.$tone === "green" ? "#84d7b2" : "#f0d96b"}; font-size: clamp(1.1rem, 2vw, 1.4rem); font-variant-numeric: tabular-nums; }
`;

export const PreviewList = styled.div`
  display: grid;
  gap: 2px;
  margin-top: 17px;
`;

export const PreviewRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255,255,255,.055);
  &:last-child { border-bottom: 0; }
  > span:first-child { display: grid; flex: 0 0 auto; width: 34px; height: 34px; place-items: center; border-radius: 10px; background: rgba(255,255,255,.055); color: #d8bd4e; }
  strong { display: block; color: #e8e9e8; font-size: .78rem; }
  small { display: block; margin-top: 3px; color: #82898d; font-size: .68rem; }
  b { margin-left: auto; color: #dedfdd; font-size: .78rem; font-variant-numeric: tabular-nums; }
`;

export const PreviewFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  color: #939a9e;
  font-size: .7rem;
  svg { color: #80d6ad; }
`;

export const FeaturesSection = styled.section`
  width: min(100%, 1200px);
  margin: 0 auto;
  padding: clamp(48px, 7vw, 82px) 0;
  border-top: 1px solid rgba(255,255,255,.075);
`;

export const SectionHeading = styled.h2`
  max-width: 600px;
  margin: 0;
  color: #f1f2ef;
  font-size: clamp(1.8rem, 4vw, 2.65rem);
  line-height: 1.1;
  letter-spacing: -.045em;
`;

export const SectionDescription = styled.p`
  max-width: 600px;
  margin: 12px 0 0;
  color: #969da1;
  font-size: .94rem;
  line-height: 1.7;
`;

export const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 30px;
  @media (max-width: 860px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 560px) { grid-template-columns: 1fr; }
`;

export const FeatureCard = styled.article`
  min-width: 0;
  min-height: 218px;
  padding: 21px;
  border: 1px solid rgba(255,255,255,.075);
  border-radius: 15px;
  background: linear-gradient(145deg, rgba(34,36,37,.82), rgba(20,21,22,.84));
  transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
  &:hover { transform: translateY(-3px); border-color: rgba(204,186,120,.25); background: linear-gradient(145deg, rgba(39,40,39,.95), rgba(22,23,23,.95)); }
  @media (prefers-reduced-motion: reduce) { transition: none; }
`;

export const FeatureIcon = styled.div`
  display: grid;
  width: 40px;
  height: 40px;
  margin-bottom: 18px;
  place-items: center;
  border: 1px solid rgba(204,186,120,.2);
  border-radius: 11px;
  background: rgba(204,186,120,.07);
  color: #e6cd69;
`;

export const FeatureTitle = styled.h3`
  margin: 0;
  color: #eceeeb;
  font-size: .98rem;
`;

export const FeatureText = styled.p`
  margin: 9px 0 0;
  color: #959da0;
  font-size: .8rem;
  line-height: 1.65;
`;

export const StepsSection = styled.section`
  display: grid;
  grid-template-columns: minmax(230px, .72fr) minmax(0, 1.5fr);
  gap: clamp(28px, 6vw, 76px);
  align-items: start;
  width: min(100%, 1200px);
  margin: 0 auto;
  padding: clamp(36px, 5vw, 58px) clamp(20px, 4vw, 40px);
  border: 1px solid rgba(255,255,255,.07);
  border-radius: 20px;
  background: linear-gradient(145deg, rgba(31,33,34,.88), rgba(18,19,20,.9));
  @media (max-width: 780px) { grid-template-columns: 1fr; gap: 24px; }
`;

export const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  @media (max-width: 620px) { grid-template-columns: 1fr; }
`;

export const Step = styled.article`
  padding: 4px 0;
  span { display: block; margin-bottom: 12px; color: #dec54e; font-size: .68rem; font-weight: 800; letter-spacing: .12em; }
  h3 { margin: 0 0 8px; color: #e9eae8; font-size: .88rem; }
  p { margin: 0; color: #8e969a; font-size: .76rem; line-height: 1.65; }
`;

export const BottomCTA = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 22px;
  width: min(100%, 1200px);
  margin: clamp(42px, 7vw, 76px) auto 0;
  padding: clamp(24px, 4vw, 40px);
  border: 1px solid rgba(204,186,120,.2);
  border-radius: 18px;
  background: radial-gradient(ellipse at 100% 0%, rgba(204,186,120,.11), transparent 46%), linear-gradient(110deg, rgba(0,139,139,.09), rgba(34,36,37,.92) 50%);
  h2 { margin: 0; color: #f2f2ef; font-size: clamp(1.25rem, 2.6vw, 1.8rem); letter-spacing: -.035em; }
  p { margin: 8px 0 0; color: #959da0; font-size: .84rem; }
  @media (max-width: 650px) { align-items: stretch; flex-direction: column; }
`;

export const ContactSection = styled.section`
  display: grid;
  grid-template-columns: minmax(0,.8fr) minmax(0,1.2fr);
  gap: clamp(24px,5vw,58px);
  align-items: start;
  width: min(100%,1200px);
  margin: 26px auto 0;
  padding: clamp(24px,4vw,40px);
  border: 1px solid rgba(255,255,255,.075);
  border-radius: 18px;
  background: linear-gradient(145deg,rgba(30,32,33,.92),rgba(18,19,20,.94));
  h2 { margin: 0; color: #f1f2ef; font-size: clamp(1.4rem,3vw,2rem); letter-spacing: -.04em; }
  p { margin: 10px 0 0; color: #929a9e; font-size: .84rem; line-height: 1.6; }
  @media (max-width: 760px) { grid-template-columns: 1fr; gap: 20px; }
`;

export const ContactForm = styled.form`
  display: grid;
  grid-template-columns: repeat(2,minmax(0,1fr));
  gap: 11px;
  input, textarea {
    width: 100%;
    min-width: 0;
    padding: 12px 13px;
    border: 1px solid rgba(255,255,255,.1);
    border-radius: 9px;
    outline: 0;
    background: rgba(255,255,255,.035);
    color: #eef0ed;
    font: inherit;
    font-size: .82rem;
    resize: vertical;
    transition: border-color 140ms ease, box-shadow 140ms ease;
    &::placeholder { color: #788084; }
    &:focus { border-color: rgba(204,186,120,.58); box-shadow: 0 0 0 3px rgba(204,186,120,.08); }
  }
  textarea { grid-column: 1 / -1; min-height: 110px; }
  button {
    justify-self: start;
    min-height: 42px;
    padding: 0 16px;
    border: 1px solid rgba(255,255,255,.15);
    border-radius: 9px;
    background: linear-gradient(110deg,#b8860b 0%,#d4b349 48%,#f0df9b 100%);
    color: #171717;
    font: inherit;
    font-size: .82rem;
    font-weight: 750;
    cursor: pointer;
    transition: transform 150ms ease, filter 150ms ease;
    &:hover { transform: translateY(-1px); filter: brightness(1.04); }
  }
  @media (max-width: 520px) { grid-template-columns: 1fr; textarea { grid-column: 1; } button { width: 100%; } }
`;

export const Footer = styled.footer`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  width: min(100%, 1200px);
  margin: 34px auto 0;
  padding: 20px 0 4px;
  border-top: 1px solid rgba(255,255,255,.07);
  color: #767e82;
  font-size: .75rem;
  p { margin: 0; }
  div { display: flex; gap: 18px; }
  a { color: #b9bdbe; text-decoration: none; &:hover { color: #e6cd69; } }
  @media (max-width: 520px) { align-items: flex-start; flex-direction: column; }
`;
