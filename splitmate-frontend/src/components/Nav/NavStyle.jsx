import styled, { css, keyframes } from "styled-components";

const dropdownEnter = keyframes`
  from { opacity: 0; transform: translateY(-8px) scale(.985); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

export const NavWrapper = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 75px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 24px;
  background: rgba(18, 18, 18, 0.98);
  box-shadow: 0 1px 0 rgba(251, 204, 19, 0.35), 0 8px 24px rgba(0, 0, 0, 0.24);
  z-index: 2200;
  color: white;
`;

export const Logo = styled.h2`
  font-size: 1.4rem;
  font-weight: 800;
  color: #fbcc13;
  cursor: pointer;
  user-select: none;
`;

export const UserPic = styled.img`
  width: 40px;
  height: 40px;
  display: block;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.12);
  border-radius: 50%;
  cursor: pointer;
  margin-left: 16px;
  transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
  &:hover, &[aria-expanded="true"] {
    transform: scale(1.06);
    border-color: rgba(251, 204, 19, 0.62);
    box-shadow: 0 0 0 4px rgba(251, 204, 19, 0.08);
  }
  &:focus-visible { outline: 2px solid #fbcc13; outline-offset: 3px; }
`;

export const SubMenuWrap = styled.div`
  position: absolute;
  top: calc(100% + 12px);
  right: 18px;
  width: 344px;
  max-width: calc(100vw - 24px);
  max-height: ${(props) => (props.$open ? "440px" : "0")};
  overflow: hidden;
  visibility: ${(props) => (props.$open ? "visible" : "hidden")};
  opacity: ${(props) => (props.$open ? 1 : 0)};
  transform: ${(props) => (props.$open ? "translateY(0) scale(1)" : "translateY(-7px) scale(.985)")};
  transform-origin: top right;
  transition: max-height 260ms ease, opacity 180ms ease, transform 180ms ease, visibility 180ms ease;
  z-index: 2300;
  border-radius: 15px;
  box-shadow: 0 22px 55px rgba(0, 0, 0, 0.62), 0 0 28px rgba(251, 204, 19, 0.08);
  animation: ${(props) => (props.$open ? css`${dropdownEnter} 190ms ease both` : "none")};

  @media (max-width: 420px) { right: 8px; }
  @media (prefers-reduced-motion: reduce) { transition: none; animation: none; }
`;

export const SubMenu = styled.div`
  position: relative;
  overflow: hidden;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  background: linear-gradient(145deg, rgba(37, 38, 39, 0.99), rgba(20, 21, 22, 0.99));
  color: #e6e6e6;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 10%;
    left: 10%;
    height: 2px;
    border-radius: 0 0 3px 3px;
    background: linear-gradient(90deg, transparent, #fbcc13, transparent);
  }

  > a { display: block; color: inherit; text-decoration: none; }
  > button { display: block; font: inherit; }

  hr {
    height: 1px;
    margin: 12px 3px 8px;
    border: 0;
    background: linear-gradient(90deg, rgba(251, 204, 19, 0.2), rgba(255, 255, 255, 0.07), transparent);
  }
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 9px 8px 14px;

  img {
    width: 52px;
    height: 52px;
    flex: 0 0 52px;
    border: 1px solid rgba(251, 204, 19, 0.24);
    border-radius: 50%;
    display: block;
    object-fit: cover;
    background: rgba(251, 204, 19, 0.07);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.25);
  }

  h2 {
    overflow: hidden;
    margin: 0;
    color: #f5f5f3;
    font-size: 0.98rem;
    font-weight: 700;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const AccountLabel = styled.span`
  display: block;
  margin-top: 4px;
  color: #91979b;
  font-size: 0.72rem;
`;

export const SubMenuLink = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 11px;
  margin: 2px 0;
  cursor: pointer;
  text-decoration: none;
  border: 1px solid transparent;
  border-radius: 10px;
  transition: background 180ms ease, transform 150ms ease, border-color 180ms ease;

  img {
    width: 34px;
    height: 34px;
    padding: 7px;
    border: 1px solid rgba(255, 255, 255, 0.075);
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.055);
    object-fit: contain;
    margin-right: 1px;
  }

  p {
    overflow: hidden;
    margin: 0;
    flex: 1;
    color: #d8dcde;
    font-size: 0.86rem;
    font-weight: 600;
    text-overflow: ellipsis;
  }

  &:hover {
    border-color: rgba(251, 204, 19, 0.14);
    background: linear-gradient(90deg, rgba(251, 204, 19, 0.095), rgba(251, 204, 19, 0.025));
    transform: translateX(2px);
  }

  &:hover img { border-color: rgba(251, 204, 19, 0.18); background: rgba(251, 204, 19, 0.08); }
  @media (prefers-reduced-motion: reduce) { transition: none; }
`;

export const ExtArrow = styled.span`
  color: #70777b;
  font-weight: 650;
  font-size: 1.05rem;
  transition: color 150ms ease, transform 150ms ease;
  ${SubMenuLink}:hover & { color: #f3d456; transform: translateX(2px); }
`;

export const RightMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const MenuBar = styled.button`
  border: none;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #fff;
  font-size: 1.25rem;
  transition: all 0.3s ease;
  &:hover { transform: scale(1.1); }
  &:active { transform: scale(0.95); }
`;

export const IconButton = styled.button`
  background: rgba(255, 255, 255, 0.05);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #e49b0f;
  font-size: 1.25rem;
  transition: all 0.3s ease;
  &:hover { transform: scale(1.1); }
  &:active { transform: scale(0.95); }
`;
