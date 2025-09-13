import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { NavWrapper, NavItem, NavLinks, NavLogo } from "./MainNavStyle";

const MainNav = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <NavWrapper className={scrolled ? "scrolled" : ""}>
      <NavLogo as={Link} to="/">
        SplitMate
      </NavLogo>
      <NavLinks>
        <NavItem as="a" href="/">
          Home
        </NavItem>
        <NavItem as={Link} to="/login">
          Login
        </NavItem>
        <NavItem as={Link} to="/register">
          Register
        </NavItem>
      </NavLinks>
    </NavWrapper>
  );
};

export default MainNav;
