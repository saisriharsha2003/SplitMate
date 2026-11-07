import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaCalendarAlt, FaChartPie, FaReceipt, FaUsers } from "react-icons/fa";
import axios from "axios";
import Nav from "../Nav/Nav";
import Sidebar from "../Sidebar/Sidebar";
import { BASE_URL } from "../config";
import {
  LayoutWrapper,
  ContentWrapper,
  Header,
  HeaderEyebrow,
  Title,
  HeaderSubtitle,
  MonthLabel,
  OverviewGrid,
  OverviewPanel,
  PanelHeader,
  PanelTitle,
  PanelDescription,
  PanelLink,
  MetricGrid,
  MetricCard,
  MetricIcon,
  MetricLabel,
  MetricValue,
  MetricNote,
  LoadingState,
  ErrorState,
} from "./DashboardStyle";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${BASE_URL}/api/user/dashboard/metrics`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMetrics(response.data);
    } catch (requestError) {
      setError(requestError.response?.data?.error || "Could not load dashboard metrics.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMetrics(); }, [fetchMetrics]);

  const formatMoney = (amount, currency) => {
    try {
      return new Intl.NumberFormat(undefined, { style: "currency", currency: currency || "INR", maximumFractionDigits: 2 }).format(Number(amount || 0));
    } catch {
      return `${currency || "INR"} ${Number(amount || 0).toFixed(2)}`;
    }
  };
  const formatCurrencyTotals = (totals, fallbackCurrency) =>
    totals?.length ? totals.map((item) => formatMoney(item.amount, item.currency)).join(" · ") : formatMoney(0, fallbackCurrency);
  const sumCounts = (totals) => (totals || []).reduce((count, item) => count + item.count, 0);
  const monthTitle = metrics?.month
    ? new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${metrics.month}-01T00:00:00.000Z`))
    : "This month";

  return (
    <LayoutWrapper>
      <Nav toggleSidebar={() => setIsSidebarOpen((open) => !open)} />
      <Sidebar isOpen={isSidebarOpen} />
      <ContentWrapper $sidebarOpen={isSidebarOpen}>
        <Header>
          <div>
            <HeaderEyebrow>YOUR FINANCIAL OVERVIEW</HeaderEyebrow>
            <Title>Dashboard</Title>
            <HeaderSubtitle>Keep shared group spending and your personal expenses in separate views.</HeaderSubtitle>
          </div>
          <MonthLabel><FaCalendarAlt />{monthTitle}</MonthLabel>
        </Header>

        {loading ? (
          <LoadingState><span />Loading your metrics…</LoadingState>
        ) : error ? (
          <ErrorState role="alert">{error}<button type="button" onClick={fetchMetrics}>Try again</button></ErrorState>
        ) : metrics && (
          <OverviewGrid>
            <OverviewPanel $tone="group">
              <PanelHeader>
                <div>
                  <PanelTitle><FaUsers />Group expenses</PanelTitle>
                  <PanelDescription>Shared spending across groups you belong to.</PanelDescription>
                </div>
                <PanelLink to="/groups">Open groups <FaArrowRight /></PanelLink>
              </PanelHeader>
              <MetricGrid>
                <MetricCard>
                  <MetricIcon $tone="group"><FaUsers /></MetricIcon>
                  <MetricLabel>Your groups</MetricLabel>
                  <MetricValue>{metrics.groups.count}</MetricValue>
                  <MetricNote>{metrics.groups.memberCount} total memberships</MetricNote>
                </MetricCard>
                <MetricCard>
                  <MetricIcon $tone="group"><FaReceipt /></MetricIcon>
                  <MetricLabel>Shared expenses</MetricLabel>
                  <MetricValue>{metrics.groups.expenseCount}</MetricValue>
                  <MetricNote>Across all your groups</MetricNote>
                </MetricCard>
                <MetricCard>
                  <MetricIcon $tone="group"><FaChartPie /></MetricIcon>
                  <MetricLabel>Group spend · {monthTitle}</MetricLabel>
                  <MetricValue $compact>{formatCurrencyTotals(metrics.groups.thisMonthByCurrency, metrics.currency)}</MetricValue>
                  <MetricNote>{sumCounts(metrics.groups.thisMonthByCurrency)} shared expenses this month</MetricNote>
                </MetricCard>
                <MetricCard>
                  <MetricIcon $tone="group"><FaChartPie /></MetricIcon>
                  <MetricLabel>Group spend · all time</MetricLabel>
                  <MetricValue $compact>{formatCurrencyTotals(metrics.groups.allTimeByCurrency, metrics.currency)}</MetricValue>
                  <MetricNote>Totals stay separated by currency</MetricNote>
                </MetricCard>
              </MetricGrid>
            </OverviewPanel>

            <OverviewPanel $tone="personal">
              <PanelHeader>
                <div>
                  <PanelTitle><FaReceipt />Personal tracker</PanelTitle>
                  <PanelDescription>Your private monthly ledger. These expenses never affect group balances.</PanelDescription>
                </div>
                <PanelLink to="/expense-tracker">Open tracker <FaArrowRight /></PanelLink>
              </PanelHeader>
              <MetricGrid>
                <MetricCard>
                  <MetricIcon $tone="personal"><FaReceipt /></MetricIcon>
                  <MetricLabel>Personal expenses</MetricLabel>
                  <MetricValue>{metrics.personal.expenseCount}</MetricValue>
                  <MetricNote>All time</MetricNote>
                </MetricCard>
                <MetricCard>
                  <MetricIcon $tone="personal"><FaChartPie /></MetricIcon>
                  <MetricLabel>Personal spend · {monthTitle}</MetricLabel>
                  <MetricValue $compact>{formatCurrencyTotals(metrics.personal.thisMonthByCurrency, metrics.currency)}</MetricValue>
                  <MetricNote>{sumCounts(metrics.personal.thisMonthByCurrency)} personal expenses this month</MetricNote>
                </MetricCard>
                <MetricCard>
                  <MetricIcon $tone="personal"><FaChartPie /></MetricIcon>
                  <MetricLabel>Personal spend · all time</MetricLabel>
                  <MetricValue $compact>{formatCurrencyTotals(metrics.personal.allTimeByCurrency, metrics.currency)}</MetricValue>
                  <MetricNote>Totals stay separated by currency</MetricNote>
                </MetricCard>
                <MetricCard>
                  <MetricIcon $tone="personal"><FaReceipt /></MetricIcon>
                  <MetricLabel>Top category · {monthTitle}</MetricLabel>
                  <MetricValue $compact>{metrics.personal.topCategory?.name || "No data yet"}</MetricValue>
                  <MetricNote>{metrics.personal.topCategory ? `${metrics.personal.topCategory.count} entries · ${formatMoney(metrics.personal.topCategory.amount, metrics.personal.topCategory.currency)}` : "Add a personal expense to get started"}</MetricNote>
                </MetricCard>
              </MetricGrid>
            </OverviewPanel>
          </OverviewGrid>
        )}
      </ContentWrapper>
    </LayoutWrapper>
  );
};

export default Dashboard;
