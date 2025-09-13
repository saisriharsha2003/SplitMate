import styled, { keyframes } from "styled-components";
import background from "../../assets/images/background.jpg";

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
`;

export const LandingWrapper = styled.div`
  margin: 0;
  padding: 0;
  width: 100%;
  color: #000000;
  overflow-x: hidden;
  padding-top: 60px;
`;

const typing = keyframes`
  from { width: 0 }
  to { width: 9ch }
`;

const blinkCaret = keyframes`
  from, to { border-color: transparent }
  50% { border-color: #00e6e6  }
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


export const BackgroundCircle = styled.div`
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  filter: blur(80px);
  animation: ${float} 6s ease-in-out infinite;
  
  ${({ size, top, left }) => `
    width: ${size}px;
    height: ${size}px;
    top: ${top};
    left: ${left};
  `}
`;

export const HeroSection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100vh;
  background: url(${background}) no-repeat center center/cover;
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

export const CTAButton = styled.a`
  background-color: #00e6e6;
  color: #000;
  font-weight: bold;
  padding: 14px 36px;
  border-radius: 30px;
  text-decoration: none;
  transition: 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

export const FeaturesSection = styled.section`
  padding: 100px 10%;
  background-color: #000000;
`;

export const FeatureRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 80px;
  gap: 40px;
  flex-direction: ${({ $reverse }) => ($reverse ? "row-reverse" : "row")};

  @media (max-width: 900px) {
    flex-direction: column;
    text-align: center;
  }
`;

export const FeatureText = styled.div`
  flex: 1;
  padding: 20px;

  h2 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 15px;
    color: #00e6e6;
  }

  p {
    font-size: 1.1rem;
    line-height: 1.6;
    color: #ffffff;
    max-width: 500px;
  }
`;

export const FeatureImage = styled.img`
  flex: 1;
  max-width: 450px;
  margin: 20px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  transition: transform 0.4s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

export const ContactSection = styled.section`
  padding: 80px 10%;
  background: linear-gradient(135deg, #3182ce, #63b3ed);
  text-align: center;
  color: #ffffff;

  h2 {
    margin-bottom: 20px;
    font-size: 2rem;
    font-weight: 900;
  }
`;

export const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 500px;
  margin: auto;

  input,
  textarea {
    margin: 10px 0;
    padding: 12px;
    border-radius: 8px;
    border: none;
  }

  button {
    margin-top: 15px;
    padding: 12px;
    background-color: #2d3748;
    color: #fff;
    font-weight: bold;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    transition: 0.3s;
  }

  button:hover {
    background-color: #1a202c;
  }
`;

/* FOOTER */
export const Footer = styled.footer`
  background-color: #2d3748;
  color: #e2e8f0;
  text-align: center;
  padding: 20px;
  font-size: 0.9rem;
`;
