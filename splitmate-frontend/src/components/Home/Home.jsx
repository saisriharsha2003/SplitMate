import { useState } from "react";
import Nav from "../Nav/Nav";
import Sidebar from "../Sidebar/Sidebar";
import {
  ContentWrapper,
  Title,
  LandingWrapper,
  HeroSection,
  Subtitle,
  Homep,
} from "./HomeStyle";

const Home = ({ user }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Nav toggleSidebar={() => setIsSidebarOpen((p) => !p)} />

      <div style={{ display: "flex", flex: 1, paddingTop: "60px"  }}>
        <Sidebar isOpen={isSidebarOpen} />

        <ContentWrapper
          style={{
            marginLeft: isSidebarOpen ? "220px" : "80px", 
            transition: "margin 0.3s ease",
            flex: 1,
          }}
        >
          <LandingWrapper>
            <HeroSection id="hero">
              <Title>
                Welcome to <Homep>SplitMate</Homep>
              </Title>
              <Subtitle>
                The easiest way to split bills, track expenses, and settle
                balances with your groups.
              </Subtitle>
            </HeroSection>
          </LandingWrapper>
        </ContentWrapper>
      </div>
    </div>
  );
};

export default Home;
