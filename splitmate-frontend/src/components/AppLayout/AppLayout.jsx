import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import { ContentWrapper } from '../Dashboard/DashboardStyle';

const AppLayout = ({ children }) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <ContentWrapper>{children}</ContentWrapper>
    </div>
  );
};

export default AppLayout;
