import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import {
  NavWrapper,
  Logo,
  UserPic,
  SubMenuWrap,
  SubMenu,
  UserInfo,
  SubMenuLink,
  ExtArrow,
} from "./NavStyle";

import user from "../../assets/images/user.png";
import edit from "../../assets/images/edit.png";
import change_pwd from "../../assets/images/change-pwd.png";
import logout from "../../assets/images/logout.png";

const Nav = () => {
  const [userName, setUserName] = useState("");
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const wrapperRef = useRef(null);

  useEffect(() => {
    const storedUserName = localStorage.getItem("name");
    if (storedUserName) setUserName(storedUserName);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setOpenMenu(false);
  }, [location]);

  // Click outside to close submenu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    toast.success("Logging off...", { position: "top-right", autoClose: 1500 });
    localStorage.removeItem("name");
    // remove token if you store one:
    localStorage.removeItem("token");
    navigate("/");
  };

  const toggleMenu = () => setOpenMenu((p) => !p);

  return (
    <NavWrapper ref={wrapperRef}>
      <Logo role="button" onClick={() => navigate("/dashboard")}>
        SplitMate
      </Logo>

      <UserPic
        src={user}
        alt="User avatar"
        onClick={toggleMenu}
        aria-haspopup="true"
        aria-expanded={openMenu}
      />

      <SubMenuWrap open={openMenu} role="menu" aria-hidden={!openMenu}>
        <SubMenu>
          <UserInfo>
            <img src={user} alt="User" style={{ width: 80, height: 80 }} />
            <h2 id="cu_name">{userName || "User"}</h2>
          </UserInfo>

          <hr />

          <Link to="/edit-profile" onClick={() => setOpenMenu(false)}>
            <SubMenuLink>
              <img src={edit} alt="Edit Profile" />
              <p>Edit Profile</p>
              <ExtArrow>&gt;</ExtArrow>
            </SubMenuLink>
          </Link>

          <Link to="/change-password" onClick={() => setOpenMenu(false)}>
            <SubMenuLink>
              <img src={change_pwd} alt="Change Password" />
              <p>Change Password</p>
              <ExtArrow>&gt;</ExtArrow>
            </SubMenuLink>
          </Link>

          <button
            onClick={handleLogout}
            style={{
              background: "transparent",
              border: "none",
              padding: 0,
              width: "100%",
              textAlign: "left",
              cursor: "pointer",
            }}
          >
            <SubMenuLink>
              <img src={logout} alt="Logout" />
              <p>Logout</p>
              <ExtArrow>&gt;</ExtArrow>
            </SubMenuLink>
          </button>
        </SubMenu>
      </SubMenuWrap>
    </NavWrapper>
  );
};

export default Nav;
