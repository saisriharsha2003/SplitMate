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
  RightMenu,
  IconButton,
  MenuBar,
} from "./NavStyle";

import { FaBell, FaBars } from "react-icons/fa";
import user from "../../assets/images/user.png";
import edit from "../../assets/images/edit.png";
import change_pwd from "../../assets/images/change-pwd.png";
import logout from "../../assets/images/logout.png";

const Nav = ({ toggleSidebar }) => {
  const [userName, setUserName] = useState("");
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const wrapperRef = useRef(null);

  useEffect(() => {
    const storedUserName = localStorage.getItem("name");
    if (storedUserName) setUserName(storedUserName);
  }, []);

  useEffect(() => {
    setOpenMenu(false);
  }, [location]);

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
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <NavWrapper ref={wrapperRef}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <MenuBar onClick={toggleSidebar} aria-label="Toggle sidebar">
          <FaBars size={20} />
        </MenuBar>
        <Logo onClick={() => navigate("/dashboard")}>SplitMate</Logo>
      </div>

      <RightMenu>
        <IconButton aria-label="Notifications">
          <FaBell size={20} />
        </IconButton>

        <UserPic
          src={user}
          alt="User avatar"
          onClick={() => setOpenMenu((p) => !p)}
        />

        <SubMenuWrap open={openMenu}>
          <SubMenu>
            <UserInfo>
              <img src={user} alt="User" style={{ width: 80, height: 80 }} />
              <h2>{userName || "User"}</h2>
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
      </RightMenu>
    </NavWrapper>
  );
};

export default Nav;
