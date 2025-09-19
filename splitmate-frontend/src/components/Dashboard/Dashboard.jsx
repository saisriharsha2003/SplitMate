import Nav from "../Nav/Nav";
import Sidebar from "../Sidebar/Sidebar";
import { useState } from "react";
import { LayoutWrapper, ContentWrapper } from "./DashboardStyle";

const Dashboard = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <LayoutWrapper>
      <Nav />
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <ContentWrapper collapsed={collapsed}>
        {children}
      </ContentWrapper>
    </LayoutWrapper>
  );
};

export default Dashboard;
