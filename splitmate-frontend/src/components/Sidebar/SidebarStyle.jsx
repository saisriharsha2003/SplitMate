import styled from "styled-components";

export const SidebarWrapper = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isOpen",
})`
  height: 100dvh;
  background: linear-gradient(180deg, #171819 0%, #101112 55%, #0b0c0d 100%);
  border-right: 1px solid rgba(255, 255, 255, 0.07);
  box-shadow: 12px 0 32px rgba(0, 0, 0, 0.16);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 88px 10px 18px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1100;
  transition: width 280ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 220ms ease;
  overflow: hidden;
  will-change: width;

  width: ${(props) => (props.isOpen ? "220px" : "80px")};

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    will-change: auto;
  }

  @media (max-width: 760px) {
    top: 75px;
    width: 240px;
    height: calc(100dvh - 75px);
    padding: 18px 10px;
    z-index: 2101;
    transform: translateX(${(props) => (props.isOpen ? "0" : "-105%")});
    box-shadow: ${(props) => (props.isOpen ? "18px 0 40px rgba(0,0,0,.4)" : "none")};
    transition: transform 240ms cubic-bezier(0.22, 1, 0.36, 1);
  }
`;

export const SidebarBackdrop = styled.button`
  display: none;
  @media (max-width: 760px) {
    display: block;
    position: fixed;
    inset: 75px 0 0;
    z-index: 2100;
    width: 100%;
    border: 0;
    background: rgba(0, 0, 0, 0.55);
  }
`;

export const Logo = styled.div`
  font-size: 1.6rem;
  font-weight: bold;
  color: #FBCC13;
  padding: 0 20px;
  margin-bottom: 20px;
  white-space: nowrap;
  overflow: hidden;
`;

export const SidebarTop = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

export const SidebarBottom = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding-top: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
`;

export const SidebarItemWrapper = styled.div`
  position: relative;
  min-height: 48px;
  display: flex;
  align-items: center;
  text-align: left;
  gap: 16px;
  padding: 0 15px;
  cursor: pointer;
  color: #bfc3c7;
  text-decoration: none;
  border-radius: 12px;
  transition: color 180ms ease, background 180ms ease, transform 180ms ease;

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.065);
    transform: translateX(2px);
  }

  &[aria-current="page"] {
    color: #fff;
    background: linear-gradient(90deg, rgba(251, 204, 19, 0.17), rgba(251, 204, 19, 0.055));
  }

  &[aria-current="page"]::before {
    content: "";
    position: absolute;
    left: -10px;
    top: 9px;
    bottom: 9px;
    width: 3px;
    border-radius: 0 4px 4px 0;
    background: #fbcc13;
    box-shadow: 0 0 12px rgba(251, 204, 19, 0.45);
  }

  &:focus-visible {
    outline: 2px solid rgba(251, 204, 19, 0.8);
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const IconWrapper = styled.div`
  flex: 0 0 22px;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fbcc13;
  transition: transform 180ms ease, color 180ms ease;

  ${SidebarItemWrapper}:hover & {
    transform: translateX(1px) scale(1.06);
  }
`;

export const Label = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== "isOpen",
})`
  font-size: 0.94rem;
  font-weight: 550;
  white-space: nowrap;
  transition: opacity 180ms ease, transform 240ms cubic-bezier(0.22, 1, 0.36, 1);
  opacity: ${(props) => (props.isOpen ? "1" : "0")};
  pointer-events: ${(props) => (props.isOpen ? "auto" : "none")};
  transform: translateX(${(props) => (props.isOpen ? "0" : "-6px")});
`;

export const SidebarItem = ({ icon, label, isOpen, ...props }) => (
  <SidebarItemWrapper title={!isOpen ? label : undefined} {...props}>
    <IconWrapper>{icon}</IconWrapper>
    <Label isOpen={isOpen}>{label}</Label>
  </SidebarItemWrapper>
);

export const Logout = ({ icon, label, isOpen }) => (
  <SidebarItemWrapper title={!isOpen ? label : undefined}>
    <IconWrapper>{icon}</IconWrapper>
    <Label isOpen={isOpen}>{label}</Label>
  </SidebarItemWrapper>
);
