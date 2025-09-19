import styled from "styled-components";

export const SidebarWrapper = styled.div`
  width: 18%;
  height: 100vh;
  background: linear-gradient(180deg, #1a1a1a, #0d0d0d);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  padding: 20px 0;
`;

export const Logo = styled.div`
  font-size: 1.6rem;
  font-weight: bold;
  color: #00e6e6;
  padding: 0 30px;
  margin-bottom: 20px;
`;

export const SidebarTop = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px; 
`;

export const SidebarBottom = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
`;

export const SidebarItemWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  color: #e6e6e6;
  border-radius: 6px;
  transition: background 0.2s ease, transform 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateX(4px);
  }
`;

export const IconWrapper = styled.div`
  font-size: 1.3rem;
  min-width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  color: #00e6e6;
`;

export const Label = styled.span`
  font-size: 1rem;
  font-weight: 500;
`;

export const SidebarItem = ({ icon, label, ...props }) => (
  <SidebarItemWrapper {...props}>
    <IconWrapper>{icon}</IconWrapper>
    <Label>{label}</Label>
  </SidebarItemWrapper>
);

export const Profile = ({ icon, label }) => (
  <SidebarItemWrapper>
    <IconWrapper>{icon}</IconWrapper>
    <Label>{label}</Label>
  </SidebarItemWrapper>
);

export const Logout = ({ icon, label }) => (
  <SidebarItemWrapper>
    <IconWrapper>{icon}</IconWrapper>
    <Label>{label}</Label>
  </SidebarItemWrapper>
);
