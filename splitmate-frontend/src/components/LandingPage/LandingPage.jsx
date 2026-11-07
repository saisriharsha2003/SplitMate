import React from "react";
import MainNav from "../MainNav/MainNav";
import {
  LandingWrapper,
  HeroSection,
  Title,
  Subtitle,
  CTAButton,
  FeaturesSection,
  FeatureRow,
  FeatureText,
  FeatureImage,
  ContactSection,
  ContactForm,
  Footer,
  BackgroundCircle,
  Homep
} from "./LandingPageStyle";
import group_expenses from "../../assets/images/group_expense.jpg";
import multi_currency from "../../assets/images/multi_currency.webp";
import analytics from "../../assets/images/analytics.jpg";
import payment_tracking from "../../assets/images/payment_tracking.png";
import split_expense from "../../assets/images/split_expense.webp";
import notifications from "../../assets/images/notifications.webp";

const LandingPage = () => {
  return (
    <>
      <MainNav />
      <LandingWrapper>
        <HeroSection id="hero">
          <BackgroundCircle size={250} top="10%" left="20%" />
          <BackgroundCircle size={150} top="70%" left="65%" />
          <BackgroundCircle size={200} top="40%" left="80%" />
          <Title>
            Welcome to <Homep>SplitMate</Homep>
          </Title>
          <Subtitle>
            Split bills, track shared expenses, and review group balances in one place.
          </Subtitle>
          <CTAButton href="/register">Get Started</CTAButton>
        </HeroSection>

        <FeaturesSection>
          <FeatureRow>
            <FeatureText>
              <h2>Track Group Expenses</h2>
              <p>
                Easily split bills with your friends or roommates. Keep
                everything transparent and fair, with a clear breakdown of who
                paid what and who owes whom. No more awkward money conversations
                just simple, automatic tracking that everyone can trust.
              </p>
            </FeatureText>
            <FeatureImage src={group_expenses} alt="Group expenses" />
          </FeatureRow>

          <FeatureRow $reverse>
            <FeatureText>
              <h2>Flexible Expense Splitting</h2>
              <p>
                Split expenses your way—equally, by percentage, or by specific
                amounts. SplitMate makes it easy to handle shared costs for
                roommates, trips, or group events, giving everyone a clear view
                of their share. No matter how complex the bills, settling up is
                always fair and transparent.
              </p>
            </FeatureText>
            <FeatureImage
              src={split_expense}
              alt="Flexible Expense Splitting"
            />
          </FeatureRow>

          <FeatureRow>
            <FeatureText>
              <h2>Clear Group Balances</h2>
              <p>
                Review each person’s share and see how group expenses affect
                balances. SplitMate keeps expense history visible to everyone
                in the group so shared costs stay clear.
              </p>
            </FeatureText>
            <FeatureImage
              src={payment_tracking}
              alt="Group expense balances"
            />
          </FeatureRow>

          <FeatureRow $reverse>
            <FeatureText>
              <h2>Multi-Currency Support</h2>
              <p>
                Record expenses in INR, USD, EUR, or GBP. Each group keeps its
                expenses in its selected currency, so amounts remain clear
                without unexpected conversions.
              </p>
            </FeatureText>
            <FeatureImage src={multi_currency} alt="Currency support" />
          </FeatureRow>

          <FeatureRow>
            <FeatureText>
              <h2>Spending Overview</h2>
              <p>
                Review monthly and all-time spending for your groups and personal
                tracker in one dashboard. Totals stay separated by currency so
                you can compare activity without mixing amounts.
              </p>
            </FeatureText>
            <FeatureImage src={analytics} alt="Analytics" />
          </FeatureRow>

          <FeatureRow $reverse>
            <FeatureText>
              <h2>Group Activity Notifications</h2>
              <p>
                Get an in-app notification when a group member adds an expense,
                changes a split, or joins the group. Open it to return to that
                group’s activity and expense history.
              </p>
            </FeatureText>
            <FeatureImage src={notifications} alt="Smart Notifications" />
          </FeatureRow>
        </FeaturesSection>

        <ContactSection id="contact">
          <h2>Contact Us</h2>
          <p>We’d love to hear from you. Fill out the form below.</p>
          <ContactForm>
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Your Message" rows="5" required />
            <button type="submit">Send Message</button>
          </ContactForm>
        </ContactSection>

        <Footer>
          <p>© {new Date().getFullYear()} SplitMate. All rights reserved.</p>
        </Footer>
      </LandingWrapper>
    </>
  );
};

export default LandingPage;
