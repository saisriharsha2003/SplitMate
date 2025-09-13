import styled, { keyframes } from "styled-components";

const fadeInDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const NavWrapper = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 32px;
  height: 80px;
  background: #000000;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
`;

export const NavLogo = styled.h2`
  font-size: 1.6rem;
  font-weight: bold;
  color: #00f2fe;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

export const NavLinks = styled.div`
  display: flex;
  gap: 28px;
  align-items: center;
`;

export const NavItem = styled.a`
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
  position: relative;
  display: inline-block;
  padding: 4px 0;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #00f2fe;
  }

  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -2px; 
    width: 0%;
    height: 2px;
    background: #00f2fe;
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }
`;
