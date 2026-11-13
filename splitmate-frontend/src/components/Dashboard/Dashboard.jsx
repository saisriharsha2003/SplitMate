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
  ChartsGrid,
  ChartPanel,
  ChartHeading,
  ChartSubtitle,
  DonutChart,
  ChartLegend,
  LegendRow,
  ColorDot,
  ChartValue,
  TrendChart,
  TrendColumn,
  TrendBar,
  TrendMonth,
  ChartEmpty,
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
  const chartColors = ["#80b4ff", "#fbcc13", "#64d6b0", "#ff987e", "#b99aff", "#f27fc4", "#8bd3e6", "#c4d174"];
  const groupChartColors = ["#fbcc13", "#ff987e", "#80b4ff", "#64d6b0", "#b99aff", "#8bd3e6", "#f27fc4", "#c4d174"];
  const makeDonutGradient = (items, colors) => {
    const total = items.reduce((sum, item) => sum + item.count, 0);
    if (!total) return "conic-gradient(#34383a 0% 100%)";
    let offset = 0;
    return `conic-gradient(${items.map((item, index) => {
      const start = offset;
      offset += (item.count / total) * 100;
      return `${colors[index % colors.length]} ${start}% ${offset}%`;
    }).join(", ")})`;
  };
  const groupBreakdown = metrics?.groups?.groupBreakdown || [];
  const groupExpenseTotal = groupBreakdown.reduce((sum, item) => sum + item.count, 0);
  const groupGradient = makeDonutGradient(groupBreakdown, groupChartColors);
  const groupMonthlyActivity = metrics?.groups?.monthlyActivity || [];
  const maxGroupMonthlyCount = Math.max(1, ...groupMonthlyActivity.map((item) => item.count));
  const categoryBreakdown = metrics?.personal?.categoryBreakdown || [];
  const categoryTotal = categoryBreakdown.reduce((sum, item) => sum + item.count, 0);
  const categoryGradient = makeDonutGradient(categoryBreakdown, chartColors);
  const monthlyActivity = metrics?.personal?.monthlyActivity || [];
  const maxMonthlyCount = Math.max(1, ...monthlyActivity.map((item) => item.count));

  return (
    <LayoutWrapper>
      <Nav toggleSidebar={() => setIsSidebarOpen((open) => !open)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <ContentWrapper $sidebarOpen={isSidebarOpen}>
        <Header>
          <div>
            <HeaderEyebrow>YOUR FINANCIAL OVERVIEW</HeaderEyebrow>
            <Title>Dashboard</Title>
            <HeaderSubtitle>Keep shared group spending and your personal transactions in separate views.</HeaderSubtitle>
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
                  <PanelTitle><FaUsers />Group splits</PanelTitle>
                  <PanelDescription>Shared expenses and activity across the groups you belong to.</PanelDescription>
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
              <ChartsGrid>
                <ChartPanel>
                  <ChartHeading>Shared expenses by group</ChartHeading>
                  <ChartSubtitle>Share of recorded group expenses · all time</ChartSubtitle>
                  {groupExpenseTotal ? (
                    <div className="category-chart-layout">
                      <DonutChart role="img" aria-label={`Shared expenses by group: ${groupBreakdown.map((item) => `${item.name}, ${item.count}`).join("; ")}`} style={{ background: groupGradient }}>
                        <span><strong>{groupExpenseTotal}</strong><small>expenses</small></span>
                      </DonutChart>
                      <ChartLegend>
                        {groupBreakdown.map((item, index) => (
                          <LegendRow key={item.id}>
                            <ColorDot $color={groupChartColors[index % groupChartColors.length]} />
                            <span>{item.name}</span>
                            <ChartValue>{item.count} · {Math.round((item.count / groupExpenseTotal) * 100)}%</ChartValue>
                          </LegendRow>
                        ))}
                      </ChartLegend>
                    </div>
                  ) : <ChartEmpty>No shared expenses recorded in your groups yet.</ChartEmpty>}
                </ChartPanel>
                <ChartPanel>
                  <ChartHeading>Group activity</ChartHeading>
                  <ChartSubtitle>Shared expenses added over the last six months</ChartSubtitle>
                  <TrendChart aria-label="Monthly shared group expense counts">
                    {groupMonthlyActivity.map((item) => (
                      <TrendColumn key={item.month} title={`${item.count} ${item.count === 1 ? "shared expense" : "shared expenses"}`}>
                        <TrendBar $tone="group" $height={item.count ? Math.max(8, (item.count / maxGroupMonthlyCount) * 100) : 3} $active={item.month === metrics.month} />
                        <strong>{item.count}</strong>
                        <TrendMonth>{new Intl.DateTimeFormat(undefined, { month: "short", timeZone: "UTC" }).format(new Date(`${item.month}-01T00:00:00.000Z`))}</TrendMonth>
                      </TrendColumn>
                    ))}
                  </TrendChart>
                </ChartPanel>
              </ChartsGrid>
            </OverviewPanel>

            <OverviewPanel $tone="personal">
              <PanelHeader>
                <div>
                  <PanelTitle><FaReceipt />Personal tracker</PanelTitle>
                  <PanelDescription>Your private monthly ledger. These transactions never affect group balances.</PanelDescription>
                </div>
                <PanelLink to="/expense-tracker">Open tracker <FaArrowRight /></PanelLink>
              </PanelHeader>
              <MetricGrid>
                <MetricCard>
                  <MetricIcon $tone="personal"><FaReceipt /></MetricIcon>
                  <MetricLabel>Personal transactions</MetricLabel>
                  <MetricValue>{metrics.personal.expenseCount}</MetricValue>
                  <MetricNote>All time</MetricNote>
                </MetricCard>
                <MetricCard>
                  <MetricIcon $tone="personal"><FaChartPie /></MetricIcon>
                  <MetricLabel>Personal spend · {monthTitle}</MetricLabel>
                  <MetricValue $compact>{formatCurrencyTotals(metrics.personal.thisMonthByCurrency, metrics.currency)}</MetricValue>
                  <MetricNote>{sumCounts(metrics.personal.thisMonthByCurrency)} personal transactions this month · credits offset · salary excluded from spend</MetricNote>
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
                  <MetricValue $compact>{categoryBreakdown[0]?.name || "No data yet"}</MetricValue>
                  <MetricNote>{categoryBreakdown[0] ? `${categoryBreakdown[0].count} transactions this month` : "Add a personal transaction to get started"}</MetricNote>
                </MetricCard>
              </MetricGrid>
              <ChartsGrid>
                <ChartPanel>
                  <ChartHeading>Monthly transaction categories</ChartHeading>
                  <ChartSubtitle>Share of your {monthTitle.toLowerCase()} transactions</ChartSubtitle>
                  {categoryTotal ? (
                    <div className="category-chart-layout">
                      <DonutChart role="img" aria-label={`Transaction categories by count: ${categoryBreakdown.map((item) => `${item.name}, ${item.count}`).join("; ")}`} style={{ background: categoryGradient }}>
                        <span><strong>{categoryTotal}</strong><small>transactions</small></span>
                      </DonutChart>
                      <ChartLegend>
                        {categoryBreakdown.map((item, index) => (
                          <LegendRow key={item.name}>
                            <ColorDot $color={chartColors[index % chartColors.length]} />
                            <span>{item.name}</span>
                            <ChartValue>{item.count} · {Math.round((item.count / categoryTotal) * 100)}%</ChartValue>
                          </LegendRow>
                        ))}
                      </ChartLegend>
                    </div>
                  ) : <ChartEmpty>No personal transactions recorded this month.</ChartEmpty>}
                </ChartPanel>
                <ChartPanel>
                  <ChartHeading>Transaction activity</ChartHeading>
                  <ChartSubtitle>Number of personal transactions over the last six months</ChartSubtitle>
                  <TrendChart aria-label="Monthly personal transaction counts">
                    {monthlyActivity.map((item) => (
                      <TrendColumn key={item.month} title={`${item.count} ${item.count === 1 ? "transaction" : "transactions"}`}>
                        <TrendBar $tone="personal" $height={item.count ? Math.max(8, (item.count / maxMonthlyCount) * 100) : 3} $active={item.month === metrics.month} />
                        <strong>{item.count}</strong>
                        <TrendMonth>{new Intl.DateTimeFormat(undefined, { month: "short", timeZone: "UTC" }).format(new Date(`${item.month}-01T00:00:00.000Z`))}</TrendMonth>
                      </TrendColumn>
                    ))}
                  </TrendChart>
                </ChartPanel>
              </ChartsGrid>
            </OverviewPanel>
          </OverviewGrid>
        )}
      </ContentWrapper>
    </LayoutWrapper>
  );
};

export default Dashboard;
