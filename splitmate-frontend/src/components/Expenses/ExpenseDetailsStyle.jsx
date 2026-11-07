import styled, { keyframes } from "styled-components";

const appear = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Page = styled.main.withConfig({
  shouldForwardProp: (prop) => prop !== "isOpen",
})`
  flex: 1;
  min-width: 0;
  min-height: calc(100vh - 60px);
  margin-left: ${(props) => (props.isOpen ? "220px" : "80px")};
  padding: 34px clamp(18px, 5vw, 72px) 60px;
  background: radial-gradient(ellipse at 85% 0%, rgba(251, 204, 19, 0.07), transparent 34%), #101112;
  color: #fff;
  transition: margin 280ms cubic-bezier(0.22, 1, 0.36, 1);
`;

export const Container = styled.div`
  width: min(100%, 1040px);
  margin: 0 auto;
  animation: ${appear} 420ms ease both;
`;

export const BackLink = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 8px 0;
  border: 0;
  background: transparent;
  color: #b0b4b8;
  font: inherit;
  cursor: pointer;
  &:hover { color: #fbcc13; }
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin: 20px 0 28px;

  small { color: #d7b733; font-size: 0.72rem; font-weight: 800; letter-spacing: .16em; }
  h1 { margin: 9px 0 0; font-size: clamp(1.8rem, 4vw, 2.6rem); line-height: 1.15; letter-spacing: -.035em; overflow-wrap: anywhere; }

  @media (max-width: 560px) { flex-direction: column; }
`;

export const EditButton = styled.button`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 11px 15px;
  border: 1px solid rgba(251, 204, 19, 0.32);
  border-radius: 10px;
  background: rgba(251, 204, 19, 0.1);
  color: #f5d85b;
  font: inherit;
  font-weight: 650;
  cursor: pointer;
  &:hover { background: rgba(251, 204, 19, 0.17); }
`;

export const Summary = styled.section`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 22px;
  @media (max-width: 680px) { grid-template-columns: 1fr; }
`;

export const SummaryCard = styled.div`
  min-width: 0;
  padding: 18px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 13px;
  background: linear-gradient(145deg, rgba(35, 36, 37, .92), rgba(22, 23, 24, .92));

  span { display: block; margin-bottom: 9px; color: #93999e; font-size: .78rem; font-weight: 650; text-transform: uppercase; letter-spacing: .08em; }
  strong { color: #f5f5f5; font-size: 1.08rem; font-weight: 650; overflow-wrap: anywhere; }
`;

export const Section = styled.section`
  margin-top: 18px;
  padding: clamp(18px, 3vw, 26px);
  border: 1px solid rgba(255, 255, 255, 0.085);
  border-radius: 15px;
  background: rgba(27, 28, 29, 0.84);

  h2 { margin: 0 0 18px; color: #fff; font-size: 1.12rem; }
`;

export const ParticipantList = styled.div`
  display: grid;
  gap: 9px;
`;

export const ParticipantRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 13px 14px;
  border: 1px solid rgba(255, 255, 255, .065);
  border-radius: 10px;
  background: rgba(255, 255, 255, .025);

  span { color: #c5c9cc; }
  strong { color: #fbcc13; font-variant-numeric: tabular-nums; }
`;

export const AuditList = styled.div`
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  @media (max-width: 620px) { grid-template-columns: 1fr; }
`;

export const AuditItem = styled.div`
  color: #a6abb0;
  font-size: .9rem;
  line-height: 1.55;
  strong { color: #e4c954; font-weight: 650; }
`;

export const State = styled.div`
  min-height: 60vh;
  display: grid;
  place-items: center;
  color: #c5c8cb;
`;
