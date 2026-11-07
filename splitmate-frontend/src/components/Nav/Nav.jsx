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
  AccountLabel,
  SubMenuLink,
  ExtArrow,
  RightMenu,
  IconButton,
  MenuBar,
  NotificationPanel,
  NotificationItem,
} from "./NavStyle";

import { FaBell, FaBars } from "react-icons/fa";
import axios from "axios";
import { BASE_URL } from "../config";
import user from "../../assets/images/user.png";
import edit from "../../assets/images/edit.png";
import change_pwd from "../../assets/images/change-pwd.png";
import logout from "../../assets/images/logout.png";

const Nav = ({ toggleSidebar }) => {
  const [userName, setUserName] = useState("");
  const [openMenu, setOpenMenu] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unseenCount, setUnseenCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const wrapperRef = useRef(null);

  useEffect(() => {
    const storedUserName = localStorage.getItem("name");
    if (storedUserName) setUserName(storedUserName);
    const token = localStorage.getItem("token");
    if (token) {
      axios.get(`${BASE_URL}/api/user/notifications`, { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => setUnseenCount(response.data.unseenCount || 0))
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    setOpenMenu(false);
    setNotificationsOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpenMenu(false);
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    toast.success("Logging off...", { position: "top-right", autoClose: 1500 });
    localStorage.removeItem("name");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  const toggleNotifications = async () => {
    const nextOpen = !notificationsOpen;
    setNotificationsOpen(nextOpen);
    setOpenMenu(false);
    if (!nextOpen) return;
    setNotificationsLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/user/notifications`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setNotifications(response.data.notifications || []);
      setUnseenCount(response.data.unseenCount || 0);
    } catch {
      toast.error("Could not load notifications");
    } finally {
      setNotificationsLoading(false);
    }
  };

  const openNotification = async (notification) => {
    if (!notification.readAt) {
      try {
        await axios.patch(`${BASE_URL}/api/user/notifications/${notification._id}/read`, {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUnseenCount((count) => Math.max(0, count - 1));
        setNotifications((items) => items.map((item) => item._id === notification._id ? { ...item, readAt: new Date().toISOString() } : item));
      } catch {
        toast.error("Could not update notification");
      }
    }
    setNotificationsOpen(false);
    if (notification.groupId?._id) navigate(`/groups/${notification.groupId._id}`);
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
        <IconButton aria-label="Notifications" aria-expanded={notificationsOpen} onClick={toggleNotifications}>
          <FaBell size={20} />
          {unseenCount > 0 && <span style={{ position: "absolute", transform: "translate(14px,-13px)", background: "#d9534f", color: "white", borderRadius: 20, padding: "1px 5px", fontSize: 10 }}>{unseenCount > 9 ? "9+" : unseenCount}</span>}
        </IconButton>

        {notificationsOpen && <NotificationPanel role="region" aria-label="Notifications">
          <h3>Notifications</h3>
          {notificationsLoading ? <p>Loading notifications…</p> : notifications.length ? notifications.map((item) => (
            <NotificationItem key={item._id} type="button" $unread={!item.readAt} onClick={() => openNotification(item)}>
              <span>{item.message}</span>
              <small>{item.groupId?.name || "Group"} · {new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(item.createdAt))}</small>
            </NotificationItem>
          )) : <p>You’re all caught up.</p>}
        </NotificationPanel>}

        <UserPic
          src={user}
          alt="User avatar"
          role="button"
          tabIndex={0}
          aria-haspopup="menu"
          aria-expanded={openMenu}
          onClick={() => setOpenMenu((p) => !p)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setOpenMenu((open) => !open);
            }
            if (event.key === "Escape") setOpenMenu(false);
          }}
        />

          <SubMenuWrap $open={openMenu} aria-hidden={!openMenu}>
          <SubMenu>
            <UserInfo>
              <img src={user} alt="" />
              <div>
                <h2>{userName || "User"}</h2>
                <AccountLabel>Account settings</AccountLabel>
              </div>
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
