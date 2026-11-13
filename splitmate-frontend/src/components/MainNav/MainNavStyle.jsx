import styled from "styled-components";

export const NavWrapper = styled.nav`
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 clamp(18px, 5vw, 76px);
  height: 72px;
  border-bottom: 1px solid rgba(255,255,255,.075);
  background: rgba(13,14,14,.84);
  backdrop-filter: blur(18px);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: background 180ms ease, box-shadow 180ms ease;
  &.scrolled { background: rgba(13,14,14,.96); box-shadow: 0 10px 28px rgba(0,0,0,.25); }
  @media (max-width: 520px) { padding: 0 16px; height: 66px; }
`;

export const NavLogo = styled.h2`
  margin: 0;
  font-size: 1.4rem;
  font-weight: bold;
  color: #FBD12D;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

export const NavLinks = styled.div`
  display: flex;
  gap: 23px;
  align-items: center;
  @media (max-width: 520px) { gap: 13px; }
`;

export const NavItem = styled.a`
  font-size: .85rem;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
  position: relative;
  display: inline-block;
  padding: 4px 0;
  text-decoration: none;
  transition: color 0.3s ease;
  @media (max-width: 520px) { font-size: .78rem; }

  &:hover {
    color: #FBD12D;
  }

  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -2px; 
    width: 0%;
    height: 2px;
    background: #FBD12D;
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }

  &.nav-cta {
    padding: 10px 14px;
    border: 1px solid rgba(255,255,255,.14);
    border-radius: 9px;
    background: linear-gradient(110deg, #b8860b 0%, #d4b349 48%, #f0df9b 100%);
    color: #171717;
    &:hover { color: #171717; transform: translateY(-1px); }
    &::after { display: none; }
  }
`;
