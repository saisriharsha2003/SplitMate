import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaChartPie, FaPlus, FaReceipt, FaUsers, FaWallet } from "react-icons/fa";
import Nav from "../Nav/Nav";
import Sidebar from "../Sidebar/Sidebar";
import {
  HomeLayout,
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
  WorkspacePreview,
  PreviewHeader,
  PreviewLabel,
  PreviewDots,
  PreviewSummary,
  PreviewTile,
  PreviewTileIcon,
  PreviewRows,
  PreviewRow,
  PreviewCheck,
  FeatureSection,
  SectionHeading,
  SectionDescription,
  FeatureGrid,
  FeatureCard,
  FeatureIcon,
  FeatureTitle,
  FeatureDescription,
  FeatureAction,
  FlowSection,
  FlowHeading,
  FlowGrid,
  FlowStep,
  FlowNumber,
  FlowTitle,
  FlowText,
} from "./HomeStyle";

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const displayName = localStorage.getItem("name");

  return (
    <HomeLayout>
      <Nav toggleSidebar={() => setIsSidebarOpen((open) => !open)} />
      <div className="home-body">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <ContentWrapper $sidebarOpen={isSidebarOpen}>
          <LandingWrapper>
            <HeroSection id="hero">
              <HeroCopy>
                <Eyebrow>SHARED SPENDING · PERSONAL FINANCES</Eyebrow>
                <Title>
                  Welcome back{displayName ? "," : ""}
                  {displayName && <span> {displayName}</span>}
                </Title>
                <Homep>Shared plans and personal finances, in one calm place.</Homep>
                <Subtitle>
                  Split group costs fairly, keep your own expenses organized, and see where your money goes—all in one place.
                </Subtitle>
                <Actions>
                  <ActionLink $primary onClick={() => navigate("/dashboard")}>
                    <FaChartPie /> View dashboard <FaArrowRight />
                  </ActionLink>
                  <ActionLink onClick={() => navigate("/groups/new")}>
                    <FaPlus /> Create a group
                  </ActionLink>
                </Actions>
              </HeroCopy>
              <HeroVisual aria-label="SplitMate workspace preview">
                <WorkspacePreview>
                  <PreviewHeader><div><PreviewLabel>YOUR WORKSPACE</PreviewLabel><strong>Everything in its place</strong></div><PreviewDots aria-hidden="true"><i /><i /><i /></PreviewDots></PreviewHeader>
                  <PreviewSummary>
                    <PreviewTile $tone="gold"><PreviewTileIcon $tone="gold"><FaUsers /></PreviewTileIcon><span>GROUP SPLITS</span><strong>Shared fairly</strong><small>Expenses · shares · settlements</small></PreviewTile>
                    <PreviewTile $tone="blue"><PreviewTileIcon $tone="blue"><FaReceipt /></PreviewTileIcon><span>PERSONAL TRACKER</span><strong>Your own ledger</strong><small>Debits · credits · transfers</small></PreviewTile>
                  </PreviewSummary>
                  <PreviewRows>
                    <PreviewRow><PreviewCheck><FaWallet /></PreviewCheck><div><strong>Accounts stay in sync</strong><small>See each balance after a transaction</small></div><span>ACCOUNTS</span></PreviewRow>
                    <PreviewRow><PreviewCheck><FaChartPie /></PreviewCheck><div><strong>Patterns are easier to spot</strong><small>Review summaries and category charts</small></div><span>INSIGHTS</span></PreviewRow>
                  </PreviewRows>
                </WorkspacePreview>
              </HeroVisual>
            </HeroSection>

            <FeatureSection aria-labelledby="money-tools-title">
              <div>
                <SectionHeading id="money-tools-title">Your money, organized your way</SectionHeading>
                <SectionDescription>Choose a space to get started. Group balances and your personal accounts stay separate.</SectionDescription>
              </div>
              <FeatureGrid>
                <FeatureCard $tone="group">
                  <FeatureIcon $tone="group"><FaUsers /></FeatureIcon>
                  <FeatureTitle>Group splits</FeatureTitle>
                  <FeatureDescription>Create a group, add shared expenses, see who owes whom, and record settlements.</FeatureDescription>
                  <FeatureAction type="button" onClick={() => navigate("/groups")}>Explore groups <FaArrowRight /></FeatureAction>
                </FeatureCard>
                <FeatureCard $tone="personal">
                  <FeatureIcon $tone="personal"><FaReceipt /></FeatureIcon>
                  <FeatureTitle>Personal expense tracker</FeatureTitle>
                  <FeatureDescription>Record debits, credits, cashback, salary, and transfers in your private monthly ledger.</FeatureDescription>
                  <FeatureAction type="button" onClick={() => navigate("/expense-tracker")}>Open tracker <FaArrowRight /></FeatureAction>
                </FeatureCard>
                <FeatureCard $tone="account">
                  <FeatureIcon $tone="account"><FaWallet /></FeatureIcon>
                  <FeatureTitle>Accounts & balances</FeatureTitle>
                  <FeatureDescription>Track bank accounts, cards, and UPI Lite balances as your transactions are recorded.</FeatureDescription>
                  <FeatureAction type="button" onClick={() => navigate("/expense-tracker/accounts")}>Manage accounts <FaArrowRight /></FeatureAction>
                </FeatureCard>
              </FeatureGrid>
            </FeatureSection>

            <FlowSection>
              <div>
                <Eyebrow>ONE APP, TWO FINANCIAL SPACES</Eyebrow>
                <FlowHeading>Keep shared costs and personal spending clear.</FlowHeading>
              </div>
              <FlowGrid>
                <FlowStep><FlowNumber>01</FlowNumber><FlowTitle>Share with your group</FlowTitle><FlowText>Add a shared expense once and let SplitMate calculate each person’s share.</FlowText></FlowStep>
                <FlowStep><FlowNumber>02</FlowNumber><FlowTitle>Track your own activity</FlowTitle><FlowText>Log personal spending, income, refunds, and transfers from the right account.</FlowText></FlowStep>
                <FlowStep><FlowNumber>03</FlowNumber><FlowTitle>Review the overview</FlowTitle><FlowText>Use the dashboard charts to review group activity and personal transaction patterns.</FlowText></FlowStep>
              </FlowGrid>
            </FlowSection>
          </LandingWrapper>
        </ContentWrapper>
      </div>
    </HomeLayout>
  );
};

export default Home;
