import {
  SidebarWrapper,
  Logo,
  SidebarTop,
  SidebarBottom,
  SidebarItem,
  Profile,
  Logout,
} from "./SidebarStyle";
import {
  FaHome,
  FaUsers,
  FaPlus,
  FaChartPie,
  FaUserCircle,
  FaSignOutAlt,
  FaChartLine,
  FaBell,
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <SidebarWrapper>
      <SidebarTop>
        <Logo>SplitMate</Logo>
        <SidebarItem as={NavLink} to="/" icon={<FaHome />} label="Home" />
        <SidebarItem as={NavLink} to="/groups" icon={<FaUsers />} label="Groups" />
        <SidebarItem icon={<FaPlus />} label="Add Expense" />
        <SidebarItem icon={<FaChartLine />} label="Activity" />
        <SidebarItem icon={<FaBell />} label="Notifications" />
      </SidebarTop>

      <SidebarBottom>
        <Profile icon={<FaUserCircle />} label="Profile" />
        <Logout icon={<FaSignOutAlt />} label="Logout" />
      </SidebarBottom>
    </SidebarWrapper>
  );
};

export default Sidebar;
