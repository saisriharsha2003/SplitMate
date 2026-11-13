import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaBalanceScale, FaCheckCircle, FaChartPie, FaExchangeAlt, FaReceipt, FaUsers, FaWallet } from "react-icons/fa";
import MainNav from "../MainNav/MainNav";
import {
  LandingWrapper,
  HeroSection,
  HeroCopy,
  Eyebrow,
  Title,
  Subtitle,
  HeroActions,
  CTAButton,
  SecondaryCTA,
  HeroNote,
  PreviewStage,
  PreviewCard,
  PreviewTop,
  PreviewBrand,
  PreviewPill,
  PreviewSummary,
  SummaryTile,
  PreviewList,
  PreviewRow,
  PreviewFooter,
  FeaturesSection,
  SectionHeading,
  SectionDescription,
  FeatureGrid,
  FeatureCard,
  FeatureIcon,
  FeatureTitle,
  FeatureText,
  StepsSection,
  StepsGrid,
  Step,
  BottomCTA,
  ContactSection,
  ContactForm,
  Footer,
} from "./LandingPageStyle";

const LandingPage = () => (
  <>
    <MainNav />
    <LandingWrapper>
      <HeroSection id="hero">
        <HeroCopy>
          <Eyebrow>Shared expenses, made clear</Eyebrow>
          <Title>Money with friends.<span>Much simpler.</span></Title>
          <Subtitle>Split group costs fairly, keep your own accounts in sync, and understand every balance without the awkward back and forth.</Subtitle>
          <HeroActions>
            <CTAButton as={Link} to="/register">Get started <FaArrowRight /></CTAButton>
            <SecondaryCTA as={Link} to="/login">I already have an account</SecondaryCTA>
          </HeroActions>
          <HeroNote><FaCheckCircle /> Group spending and personal finances stay separate.</HeroNote>
        </HeroCopy>

        <PreviewStage aria-label="SplitMate expense preview">
          <PreviewCard>
            <PreviewTop>
              <PreviewBrand><FaUsers /><span>Weekend in Goa<small>4 members · shared group</small></span></PreviewBrand>
              <PreviewPill>Sample</PreviewPill>
            </PreviewTop>
            <PreviewSummary>
              <SummaryTile><span>Group spending</span><strong>₹8,460</strong></SummaryTile>
              <SummaryTile $tone="green"><span>Your balance</span><strong>+₹1,240</strong></SummaryTile>
            </PreviewSummary>
            <div style={{ color: "#92999d", fontSize: ".72rem", fontWeight: 700 }}>RECENT ACTIVITY</div>
            <PreviewList>
              <PreviewRow><span><FaReceipt /></span><div><strong>Villa groceries</strong><small>Paid by you · split four ways</small></div><b>₹2,180</b></PreviewRow>
              <PreviewRow><span><FaWallet /></span><div><strong>Airport ride</strong><small>Paid by Maya · split equally</small></div><b>₹960</b></PreviewRow>
              <PreviewRow><span><FaExchangeAlt /></span><div><strong>Settlement</strong><small>Ravi paid you</small></div><b>₹500</b></PreviewRow>
            </PreviewList>
            <PreviewFooter><FaCheckCircle /> Everyone can see how the balance adds up.</PreviewFooter>
          </PreviewCard>
        </PreviewStage>
      </HeroSection>

      <FeaturesSection aria-labelledby="features-title">
        <Eyebrow>One place for every kind of spending</Eyebrow>
        <SectionHeading id="features-title">Shared plans and personal money, organized.</SectionHeading>
        <SectionDescription>Use the right tools for group expenses and your own day-to-day transactions, with balances that stay easy to follow.</SectionDescription>
        <FeatureGrid>
          <FeatureCard><FeatureIcon><FaUsers /></FeatureIcon><FeatureTitle>Fair group splits</FeatureTitle><FeatureText>Split bills equally, by percentage, or with custom shares. Everyone can review the expense and their portion.</FeatureText></FeatureCard>
          <FeatureCard><FeatureIcon><FaWallet /></FeatureIcon><FeatureTitle>Personal accounts</FeatureTitle><FeatureText>Track bank accounts, cards, and UPI Lite with transaction history and balances after each entry.</FeatureText></FeatureCard>
          <FeatureCard><FeatureIcon><FaExchangeAlt /></FeatureIcon><FeatureTitle>Clear transfers</FeatureTitle><FeatureText>Record income, cashback, and transfers between your accounts to keep your ledger in sync.</FeatureText></FeatureCard>
          <FeatureCard><FeatureIcon><FaChartPie /></FeatureIcon><FeatureTitle>Useful overviews</FeatureTitle><FeatureText>Review group activity and personal spending with monthly summaries and visual breakdowns.</FeatureText></FeatureCard>
          <FeatureCard><FeatureIcon><FaBalanceScale /></FeatureIcon><FeatureTitle>Balances you can explain</FeatureTitle><FeatureText>See who owes whom and follow the expenses and settlements behind each group balance.</FeatureText></FeatureCard>
          <FeatureCard><FeatureIcon><FaReceipt /></FeatureIcon><FeatureTitle>One searchable history</FeatureTitle><FeatureText>Find past transactions by date, category, account, and group without losing the details.</FeatureText></FeatureCard>
        </FeatureGrid>
      </FeaturesSection>

      <StepsSection aria-labelledby="steps-title">
        <div>
          <Eyebrow>Easy to keep up</Eyebrow>
          <SectionHeading id="steps-title">Start with one expense.</SectionHeading>
          <SectionDescription>SplitMate keeps the math visible as your plans and transactions grow.</SectionDescription>
        </div>
        <StepsGrid>
          <Step><span>01</span><h3>Create a shared space</h3><p>Bring your trip, household, or event group together.</p></Step>
          <Step><span>02</span><h3>Add expenses as they happen</h3><p>Choose who paid and how each cost should be split.</p></Step>
          <Step><span>03</span><h3>Review and settle</h3><p>Follow balances and record payments when you settle up.</p></Step>
        </StepsGrid>
      </StepsSection>

      <BottomCTA>
        <div><h2>Make the next shared expense easier.</h2><p>Create your SplitMate account and start with your first group.</p></div>
        <CTAButton as={Link} to="/register">Create your account <FaArrowRight /></CTAButton>
      </BottomCTA>

      <ContactSection id="contact">
        <div><Eyebrow>Contact</Eyebrow><h2>We’d love to hear from you.</h2><p>Send a note to the SplitMate team.</p></div>
        <ContactForm>
          <input type="text" placeholder="Your name" aria-label="Your name" required />
          <input type="email" placeholder="Your email" aria-label="Your email" required />
          <textarea placeholder="How can we help?" aria-label="Your message" rows="4" required />
          <button type="submit">Send message</button>
        </ContactForm>
      </ContactSection>

      <Footer>
        <p>© {new Date().getFullYear()} SplitMate</p>
        <div><Link to="/login">Sign in</Link><Link to="/register">Create account</Link></div>
      </Footer>
    </LandingWrapper>
  </>
);

export default LandingPage;
