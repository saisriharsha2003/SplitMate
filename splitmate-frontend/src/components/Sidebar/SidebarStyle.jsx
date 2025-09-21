import styled from "styled-components";

export const SidebarWrapper = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isOpen",
})`
  height: 100vh;
  background: linear-gradient(180deg, #1a1a1a, #0d0d0d);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-top: 100px;
  position: fixed;
  top: 0;
  left: 0;
  transition: width 0.3s ease;
  overflow: hidden;

  width: ${(props) => (props.isOpen ? "220px" : "80px")};
`;

export const Logo = styled.div`
  font-size: 1.6rem;
  font-weight: bold;
  color: #00e6e6;
  padding: 0 20px;
  margin-bottom: 20px;
  white-space: nowrap;
  overflow: hidden;
`;

export const SidebarTop = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const SidebarBottom = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
`;

export const SidebarItemWrapper = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  gap: 12px; 
  padding: 12px 25px;
  cursor: pointer;
  color: #e6e6e6;
  border-radius: 6px;
  transition: background 0.2s ease, transform 0.2s ease;

  &:hover {
    transform: scale(1.2);
  }
`;

export const IconWrapper = styled.div`
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00e6e6;
`;

export const Label = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== "isOpen",
})`
  font-size: 1rem;
  font-weight: 500;
  white-space: nowrap;
  transition: opacity 0.2s ease;
  opacity: ${(props) => (props.isOpen ? "1" : "0")};
  pointer-events: ${(props) => (props.isOpen ? "auto" : "none")};
`;

export const SidebarItem = ({ icon, label, isOpen, ...props }) => (
  <SidebarItemWrapper {...props}>
    <IconWrapper>{icon}</IconWrapper>
    <Label isOpen={isOpen}>{label}</Label>
  </SidebarItemWrapper>
);

export const Logout = ({ icon, label, isOpen }) => (
  <SidebarItemWrapper>
    <IconWrapper>{icon}</IconWrapper>
    <Label isOpen={isOpen}>{label}</Label>
  </SidebarItemWrapper>
);
