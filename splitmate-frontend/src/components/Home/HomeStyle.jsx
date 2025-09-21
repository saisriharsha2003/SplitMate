import styled, { keyframes } from "styled-components";
import background from "../../assets/images/background.jpg";

/* Animations */
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
`;

const typing = keyframes`
  from { width: 0 }
  to { width: 9ch }
`;

const blinkCaret = keyframes`
  from, to { border-color: transparent }
  50% { border-color: #00e6e6 }
`;

/* Layout */
export const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

export const LandingWrapper = styled.div`
  margin: 0;
  padding: 0;
  width: 100%;
  color: #000000;
  overflow-x: hidden;
`;

export const HeroSection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100vh;
  position: relative;
  overflow: hidden;
`;

export const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  animation: ${fadeInUp} 1s ease forwards;
  opacity: 0;
  z-index: 2;
  color: #ffffff;
  text-shadow: 0px 4px 12px rgba(0, 0, 0, 0.6);

  span {
    color: #00e6e6;
    text-shadow: 0px 4px 12px rgba(0, 0, 0, 0.6);
  }
`;

export const Homep = styled.p`
  color: #00e6e6;
  overflow: hidden;
  border-right: 2px solid white;
  white-space: nowrap;
  display: inline-block;
  margin-left: 10px;
  letter-spacing: 2px;
  vertical-align: top;
  animation: ${typing} 3.5s steps(20, end) infinite,
             ${blinkCaret} 0.5s step-end infinite;
`;

export const Subtitle = styled.p`
  font-size: 1.3rem;
  margin-bottom: 30px;
  max-width: 700px;
  animation: ${fadeInUp} 1.2s ease forwards;
  opacity: 0;
  z-index: 2;
  color: #f9fafb; 
  text-shadow: 0px 2px 10px rgba(0, 0, 0, 0.5);
`;
