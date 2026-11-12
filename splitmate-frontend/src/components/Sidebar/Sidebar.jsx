import {
  SidebarWrapper,
  SidebarBackdrop,
  SidebarTop,
  SidebarBottom,
  SidebarItem,
  SectionTitle,
  Logout,
} from "./SidebarStyle";
import {
  FaHome,
  FaUsers,
  FaReceipt,
  FaSignOutAlt,
  FaTachometerAlt,
  FaWallet,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && <SidebarBackdrop type="button" aria-label="Close navigation" onClick={onClose} />}
      <SidebarWrapper isOpen={isOpen}>
        <SidebarTop>
          <SidebarItem as={NavLink} to="/home" icon={<FaHome />} label="Home" isOpen={isOpen} onClick={onClose} />
          <SidebarItem as={NavLink} to="/dashboard" icon={<FaTachometerAlt />} label="Dashboard" isOpen={isOpen} onClick={onClose} />
          <SidebarItem as={NavLink} to="/groups" icon={<FaUsers />} label="Groups" isOpen={isOpen} onClick={onClose} />
          <SectionTitle isOpen={isOpen}>Expense tracker</SectionTitle>
          <SidebarItem as={NavLink} to="/expense-tracker" end icon={<FaReceipt />} label="Expenses" isOpen={isOpen} onClick={onClose} />
          <SidebarItem as={NavLink} to="/expense-tracker/accounts" icon={<FaWallet />} label="Accounts" isOpen={isOpen} onClick={onClose} />
        </SidebarTop>

        <SidebarBottom>
          <Logout icon={<FaSignOutAlt />} label="Logout" isOpen={isOpen} />
        </SidebarBottom>
      </SidebarWrapper>
    </>
  );
};

export default Sidebar;
