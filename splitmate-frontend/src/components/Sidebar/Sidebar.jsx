import {
  SidebarWrapper,
  Logo,
  SidebarTop,
  SidebarBottom,
  SidebarItem,
  Logout,
} from "./SidebarStyle";
import {
  FaHome,
  FaUsers,
  FaPlus,
  FaChartLine,
  FaSignOutAlt,
  FaTachometerAlt
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Sidebar = ({ isOpen }) => {
  return (
    <SidebarWrapper isOpen={isOpen}>
      <SidebarTop>
        <SidebarItem as={NavLink} to="/home" icon={<FaHome />} label="Home" isOpen={isOpen} />
        <SidebarItem as={NavLink} to="/dashboard" icon={<FaTachometerAlt />} label="Dashboard" isOpen={isOpen} />
        <SidebarItem as={NavLink} to="/groups" icon={<FaUsers />} label="Groups" isOpen={isOpen} />
        <SidebarItem icon={<FaPlus />} label="Add Expense" isOpen={isOpen} />
        <SidebarItem icon={<FaChartLine />} label="Activity" isOpen={isOpen} />
      </SidebarTop>

      <SidebarBottom>
        <Logout icon={<FaSignOutAlt />} label="Logout" isOpen={isOpen} />
      </SidebarBottom>
    </SidebarWrapper>
  );
};

export default Sidebar;
