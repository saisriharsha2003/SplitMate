import { useState } from "react";
import Nav from "../Nav/Nav";
import Sidebar from "../Sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaPlus, FaUsers } from "react-icons/fa";
import splitExpenseImage from "../../assets/images/split_expense.webp";
import {
  ContentWrapper,
  Title,
  LandingWrapper,
  HeroSection,
  Subtitle,
  Homep,
  Eyebrow,
  Actions,
  ActionLink,
  HeroCopy,
  HeroVisual,
  HeroImage,
} from "./HomeStyle";

const Home = ({ user }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const displayName = localStorage.getItem("name");

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
              <HeroCopy>
                <Eyebrow>YOUR EXPENSES, TOGETHER</Eyebrow>
                <Title>
                  Welcome back{displayName ? "," : ""}
                  {displayName && <span> {displayName}</span>}
                </Title>
                <Homep>Good times are better when the math is easy.</Homep>
                <Subtitle>
                  Organize shared expenses, see who owes what, and settle up
                  with your group in just a few taps.
                </Subtitle>
                <Actions>
                  <ActionLink $primary onClick={() => navigate("/groups")}>
                    <FaUsers /> View your groups <FaArrowRight />
                  </ActionLink>
                  <ActionLink onClick={() => navigate("/groups/new")}>
                    <FaPlus /> Create a group
                  </ActionLink>
                </Actions>
              </HeroCopy>
              <HeroVisual>
                <HeroImage src={splitExpenseImage} alt="Friends sharing an expense together" />
              </HeroVisual>
            </HeroSection>
          </LandingWrapper>
        </ContentWrapper>
      </div>
    </div>
  );
};

export default Home;
