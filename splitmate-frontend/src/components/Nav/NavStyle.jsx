import styled from "styled-components";

export const NavWrapper = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 24px;
  background-color: #121212;
  box-shadow: 0px 0px 15px #00e6e6;
  z-index: 2200; 
  color: white;
`;

export const Logo = styled.h2`
  font-size: 1.4rem;
  font-weight: 800;
  color: #00e6e6;
  cursor: pointer;
  user-select: none;
`;

export const UserPic = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  margin-left: 16px;
  transition: transform 0.15s ease;
  &:hover {
    transform: scale(1.05);
  }
`;

export const SubMenuWrap = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 24px;
  width: 320px;
  max-height: ${({ open }) => (open ? "420px" : "0")};
  overflow: hidden;
  transition: max-height 0.35s ease;
  z-index: 2300; 
  border-radius: 10px;
`;

export const SubMenu = styled.div`
  background: #0f0f0f;
  border-radius: 10px;
  padding: 12px 0;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(6px);
  color: #e6e6e6;

  hr {
    border: 0;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    margin: 8px 0;
  }
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 4px;

  img {
    border-radius: 50%;
    display: block;
  }

  h2 {
    margin: 0;
    font-size: 1.05rem;
    color: #00ffff;
    font-weight: 700;
  }
`;

export const SubMenuLink = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 14px 16px;
  margin: 0; /* no uneven margin now */
  cursor: pointer;
  text-decoration: none;
  border-radius: 8px;
  transition: background 0.2s ease, transform 0.15s ease;

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%; /* circular */
    object-fit: cover;
    margin-right: 10px;
  }

  p {
    margin: 0;
    flex: 1;
    color: #ccba78;
    font-weight: 600;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateX(3px);
  }
`;

export const ExtArrow = styled.span`
  color: #ccba78;
  font-weight: 700;
  font-size: 18px;
`;
