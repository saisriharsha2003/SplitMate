import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Nav from "../Nav/Nav";
import Sidebar from "../Sidebar/Sidebar";
import { motion } from "framer-motion";
import { FaArrowRight, FaHandHoldingUsd, FaPlus, FaTrash, FaUserMinus } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "../config";
import {
  Wrapper,
  Header,
  Title,
  SubTitle,
  SectionTitle,
  ExpenseDate,
  ExpenseCard,
  ExpenseLeft,
  ExpenseTitle,
  ExpenseMeta,
  ExpenseAmount,
  ExpenseActions,
  ExpenseAction,
  ExpenseDeleteButton,
  ExpenseTags,
  ExpenseTag,
  SplitBreakdown,
  SplitBreakdownHeading,
  SplitPeople,
  SplitPerson,
  SplitPersonName,
  SplitPersonShare,
  MembersSection,
  MemberRow,
  MemberInfo,
  MemberAvatar,
  MemberName,
  MemberRole,
  ActivityList,
  ActivityItem,
  ActivityCopy,
  ActivityMessage,
  ActivityTime,
  Pagination,
  PageButton,
  PageStatus,
  RemoveMemberButton,
  FloatingButton,
  EmptyExpenses,
  PageMessage,
  SettlementPanel,
  SettlementForm,
  SettlementField,
  SettlementControl,
  SettlementSelect,
  SettlementButton,
  SettlementModes,
  SettlementModeButton,
  DebtList,
  DebtRow,
  DebtPerson,
  DebtConnector,
  DebtAmount,
  DebtPanel,
  DebtHeader,
  DebtDescription,
  DebtCount,
} from "./ViewGroupStyle";

const distributeSettlement = (debts) => debts.map((debt) => ({
  userId: debt.creditorId,
  name: debt.creditorName,
  amount: debt.amount,
}));

const ViewGroup = () => {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [membersPage, setMembersPage] = useState(1);
  const [activityPage, setActivityPage] = useState(1);
  const [expensePage, setExpensePage] = useState(1);
  const [debtsPage, setDebtsPage] = useState(1);
  const [settlementPayee, setSettlementPayee] = useState("");
  const [settlementMode, setSettlementMode] = useState("individual");
  const [settlementAmount, setSettlementAmount] = useState("");
  const [settlementNote, setSettlementNote] = useState("");
  const [settlementSaving, setSettlementSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/api/user/groups/${id}`, {
          params: { page: expensePage, limit: 5, activityPage, activityLimit: 5, debtPage: debtsPage, debtLimit: 5 },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setGroup(res.data);
      } catch (err) {
        console.error("Error fetching group:", err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchGroup();
  }, [id, refreshKey, expensePage, activityPage, debtsPage]);

  useEffect(() => {
    if (group && window.location.hash === "#settle-up") {
      window.requestAnimationFrame(() => document.getElementById("settle-up")?.scrollIntoView({ behavior: "smooth", block: "center" }));
    }
  }, [group]);

  useEffect(() => {
    setSettlementPayee("");
    setSettlementMode("individual");
    setSettlementAmount("");
    setSettlementNote("");
    setActivityPage(1);
    setExpensePage(1);
    setDebtsPage(1);
  }, [id]);

  useEffect(() => {
    const lastDebtPage = group?.debtPagination?.pages || 1;
    if (debtsPage > lastDebtPage) setDebtsPage(lastDebtPage);
  }, [group, debtsPage]);

  const handleDeleteExpense = async (expense) => {
    const confirmed = window.confirm(`Delete "${expense.description}"? This cannot be undone.`);
    if (!confirmed) return;

    try {
      await axios.delete(`${BASE_URL}/api/user/groups/${id}/expenses/${expense._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (group.expenses?.length === 1 && expensePage > 1) setExpensePage(expensePage - 1);
      toast.success("Expense deleted");
      setRefreshKey((value) => value + 1);
    } catch (error) {
      toast.error(error.response?.data?.error || "Could not delete expense");
    }
  };

  const handleRemoveMember = async (member) => {
    if (!window.confirm(`Remove ${member.user?.name || "this member"} from the group?`)) return;
    try {
      await axios.delete(`${BASE_URL}/api/user/groups/${id}/members/${member.user?._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Member removed");
      setRefreshKey((value) => value + 1);
    } catch (error) {
      toast.error(error.response?.data?.error || "Could not remove member");
    }
  };

  const handleSettlement = async (event) => {
    event.preventDefault();
    let payments;
    if (settlementMode === "all") {
      payments = settlementAllocations.map(({ userId, amount }) => ({ payeeId: userId, amount }));
      if (!payments.length) return toast.error("There are no group balances to settle");
    } else {
      const payeeId = selectedPayee?.userId;
      if (!payeeId || !Number.isFinite(Number(settlementAmount)) || Number(settlementAmount) <= 0) {
        toast.error("Choose who you paid and enter a valid amount");
        return;
      }
      if (Number(settlementAmount) > selectedPayeeMax + 0.001) {
        toast.error(`The remaining amount to this member is ${formatMoney(selectedPayeeMax)}`);
        return;
      }
      payments = [{ payeeId, amount: Number(settlementAmount) }];
    }
    setSettlementSaving(true);
    try {
      await axios.post(`${BASE_URL}/api/user/groups/${id}/settlements`, {
        payments,
        note: settlementNote,
      }, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      toast.success("Payment recorded and group balances updated");
      setSettlementAmount("");
      setSettlementNote("");
      setActivityPage(1);
      setDebtsPage(1);
      setRefreshKey((value) => value + 1);
    } catch (error) {
      toast.error(error.response?.data?.error || "Could not record this payment");
    } finally {
      setSettlementSaving(false);
    }
  };

  if (loading) return <PageMessage>Loading group details...</PageMessage>;
  if (!group) return <PageMessage>Group not found.</PageMessage>;

  const sortedExpenses = group.expenses || [];
  const expensePageCount = group.expensePagination?.pages || 0;
  const visibleExpensePage = Math.min(expensePage, Math.max(expensePageCount, 1));
  const visibleExpenses = sortedExpenses;
  const groupedExpenses = visibleExpenses.reduce((acc, expense) => {
    const expenseDate = new Date(expense.date || expense.createdAt);
    const monthKey = `${expenseDate.getUTCFullYear()}-${String(expenseDate.getUTCMonth() + 1).padStart(2, "0")}`;
    if (!acc[monthKey]) acc[monthKey] = [];
    acc[monthKey].push(expense);
    return acc;
  }, {});
  const formatExpenseDate = (value) => new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
  const username = localStorage.getItem("username");
  const currentMember = group.members?.find((member) => member.user?.username === username);
  const canManageGroup = currentMember?.role === "admin" || group.createdBy?.username === username;
  const splitLabels = { equal: "Equal split", percentage: "Percentage split", amount: "Custom split" };
  const formatMoney = (value) => new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: group.currency || "INR",
  }).format(Number(value || 0));
  const members = group.members || [];
  const activity = group.activity || [];
  const membersPageCount = Math.ceil(members.length / 2);
  const activityPageCount = group.activityPagination?.pages || 0;
  const visibleMembersPage = Math.min(membersPage, Math.max(membersPageCount, 1));
  const visibleActivityPage = Math.min(activityPage, Math.max(activityPageCount, 1));
  const visibleMembers = members.slice((visibleMembersPage - 1) * 2, visibleMembersPage * 2);
  const visibleActivity = activity;
  const currentUserId = group.currentUserId || currentMember?.user?._id;
  const visibleDebts = group.debts || [];
  const totalDebts = group.debtPagination?.total || 0;
  const debtsPageCount = group.debtPagination?.pages || 0;
  const visibleDebtsPage = Math.min(debtsPage, Math.max(debtsPageCount, 1));
  const myDebts = group.myDebts || [];
  const myOutstanding = myDebts.reduce((sum, debt) => sum + debt.amount, 0);
  const paymentOptions = myDebts.map((debt) => ({ userId: debt.creditorId, name: debt.creditorName, amount: debt.amount }));
  const selectedPayee = paymentOptions.find((balance) => balance.userId === settlementPayee) || paymentOptions[0];
  const selectedPayeeMax = selectedPayee?.amount || 0;
  const settlementAllocations = distributeSettlement(myDebts);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Nav toggleSidebar={() => setIsSidebarOpen((p) => !p)} />
      <div style={{ display: "flex", flex: 1, paddingTop: "60px" }}>
        <Sidebar isOpen={isSidebarOpen} />
        <Wrapper style={{ marginLeft: isSidebarOpen ? "220px" : "80px" }}>
          <Header>
            <Title>{group.name}</Title>
            <SubTitle>
              Created by <span>{group.createdBy?.name || "Unknown"}</span>
            </SubTitle>
          </Header>

          <DebtPanel>
            <DebtHeader>
              <div>
                <SectionTitle>Who owes whom</SectionTitle>
                <DebtDescription>Your net balance with each group member, based on shared splits and recorded payments.</DebtDescription>
              </div>
              <DebtCount>{totalDebts} {totalDebts === 1 ? "balance" : "balances"}</DebtCount>
            </DebtHeader>
            {!totalDebts ? <EmptyExpenses>You have no outstanding balance with other group members.</EmptyExpenses> : <>
              <DebtList>
                {visibleDebts.map((debt) => (
                  <DebtRow key={`${debt.debtorId}-${debt.creditorId}`} $direction={debt.debtorId === currentUserId ? "outgoing" : "incoming"}>
                    <DebtPerson $current={debt.debtorId === currentUserId}>{debt.debtorId === currentUserId ? "You" : debt.debtorName}</DebtPerson>
                    <DebtConnector><FaArrowRight aria-hidden="true" /> owes</DebtConnector>
                    <DebtPerson $current={debt.creditorId === currentUserId}>{debt.creditorId === currentUserId ? "You" : debt.creditorName}</DebtPerson>
                    <DebtAmount $direction={debt.debtorId === currentUserId ? "outgoing" : "incoming"}>{formatMoney(debt.amount)}</DebtAmount>
                  </DebtRow>
                ))}
              </DebtList>
              {debtsPageCount > 1 && <Pagination aria-label="Outstanding balances pages">
                <PageButton type="button" onClick={() => setDebtsPage(visibleDebtsPage - 1)} disabled={visibleDebtsPage === 1}>Previous</PageButton>
                <PageStatus>Page {visibleDebtsPage} of {debtsPageCount} · {totalDebts} balances</PageStatus>
                <PageButton type="button" onClick={() => setDebtsPage(visibleDebtsPage + 1)} disabled={visibleDebtsPage === debtsPageCount}>Next</PageButton>
              </Pagination>}
            </>}
          </DebtPanel>

          <SettlementPanel id="settle-up">
            <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 7 }}>
              <FaHandHoldingUsd style={{ color: "#fbcc13", fontSize: 20 }} />
              <h3>Settle up</h3>
            </div>
            {paymentOptions.length ? <>
              <p>You owe {formatMoney(myOutstanding)} in total. Record a payment to one person or settle each outstanding amount at once.</p>
              <SettlementModes aria-label="Settlement type">
                <SettlementModeButton type="button" $active={settlementMode === "individual"} onClick={() => setSettlementMode("individual")}>Individual payment</SettlementModeButton>
                <SettlementModeButton type="button" $active={settlementMode === "all"} onClick={() => setSettlementMode("all")}>Settle with everyone</SettlementModeButton>
              </SettlementModes>
              <SettlementForm onSubmit={handleSettlement}>
                {settlementMode === "individual" ? <>
                  <SettlementField>Paid to
                    <SettlementSelect value={selectedPayee?.userId || ""} onChange={(event) => { setSettlementPayee(event.target.value); setSettlementAmount(""); }} required>
                      {paymentOptions.map((balance) => <option key={balance.userId} value={balance.userId}>{balance.name} · up to {formatMoney(balance.amount)}</option>)}
                    </SettlementSelect>
                  </SettlementField>
                  <SettlementField>Amount ({group.currency || "INR"})
                    <SettlementControl type="number" min="0.01" max={selectedPayeeMax} step="0.01" value={settlementAmount} onChange={(event) => setSettlementAmount(event.target.value)} placeholder="0.00" required />
                  </SettlementField>
                </> : <div style={{ gridColumn: "1 / -1", padding: "10px 0 2px" }}>
                  <p>Suggested payments to clear your balance across everyone owed:</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 9, marginTop: 10 }}>
                    {settlementAllocations.map((allocation) => <span key={allocation.userId} style={{ border: "1px solid rgba(251,204,19,.2)", borderRadius: 9, padding: "8px 11px", color: "#e8e8e4", background: "rgba(0,0,0,.2)", fontSize: ".82rem" }}>{allocation.name}: <strong style={{ color: "#f4d75e" }}>{formatMoney(allocation.amount)}</strong></span>)}
                  </div>
                  <p style={{ marginTop: 9 }}>Total payment: <strong style={{ color: "#f4d75e" }}>{formatMoney(settlementAllocations.reduce((sum, payment) => sum + payment.amount, 0))}</strong></p>
                </div>}
                <SettlementField>Note · optional
                  <SettlementControl type="text" maxLength={240} value={settlementNote} onChange={(event) => setSettlementNote(event.target.value)} placeholder="e.g. Dinner payment" />
                </SettlementField>
                <SettlementButton type="submit" disabled={settlementSaving || (settlementMode === "individual" ? !selectedPayee : !settlementAllocations.length)}>{settlementSaving ? "Saving…" : settlementMode === "all" ? "Record all payments" : "Record payment"}</SettlementButton>
              </SettlementForm>
            </> : <p>{group.myDebtsToMe?.length ? "You are owed money. The people listed above can record their payments to you here." : "Your group balance is settled. New payments can be recorded here when there is an outstanding amount."}</p>}
          </SettlementPanel>

          <MembersSection>
            <SectionTitle>People in this group</SectionTitle>
            <div>
              {visibleMembers.map((member) => (
                <MemberRow key={member.user?._id}>
                  <MemberInfo>
                    <MemberAvatar>{(member.user?.name || "?").charAt(0).toUpperCase()}</MemberAvatar>
                    <div>
                      <MemberName>{member.user?.name || "Unknown member"}</MemberName>
                      <MemberRole>{member.role === "admin" ? "Group admin" : "Member"}</MemberRole>
                    </div>
                  </MemberInfo>
                  {canManageGroup && member.role !== "admin" && (
                    <RemoveMemberButton type="button" onClick={() => handleRemoveMember(member)} title={`Remove ${member.user?.name || "member"}`} aria-label={`Remove ${member.user?.name || "member"}`}>
                      <FaUserMinus size={14} />
                    </RemoveMemberButton>
                  )}
                </MemberRow>
              ))}
            </div>
            {membersPageCount > 1 && (
              <Pagination aria-label="Group people pages">
                <PageButton type="button" onClick={() => setMembersPage(visibleMembersPage - 1)} disabled={visibleMembersPage === 1}>Previous</PageButton>
                <PageStatus>Page {visibleMembersPage} of {membersPageCount}</PageStatus>
                <PageButton type="button" onClick={() => setMembersPage(visibleMembersPage + 1)} disabled={visibleMembersPage === membersPageCount}>Next</PageButton>
              </Pagination>
            )}
          </MembersSection>

          <SectionTitle>Expense History</SectionTitle>
          {Object.entries(groupedExpenses).length === 0 ? (
            <EmptyExpenses>No expenses yet. Add the first one for this group.</EmptyExpenses>
          ) : Object.entries(groupedExpenses).map(([monthKey, expenses]) => (
            <div key={monthKey}>
              <ExpenseDate>
                {new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric", timeZone: "UTC" })
                  .format(new Date(`${monthKey}-01T00:00:00.000Z`))}
              </ExpenseDate>
              {expenses.map((exp) => (
                <ExpenseCard key={exp._id}>
                  <ExpenseLeft>
                    <ExpenseTitle>{exp.description}</ExpenseTitle>
                    <ExpenseMeta>
                      Paid by {exp.paidBy?.name || "Unknown"} · {formatExpenseDate(exp.date || exp.createdAt)}
                    </ExpenseMeta>
                    <ExpenseTags>
                      <ExpenseTag>{splitLabels[exp.splitType] || "Equal split"}</ExpenseTag>
                      <ExpenseTag>{exp.splitAmong?.length || 0} {(exp.splitAmong?.length || 0) === 1 ? "person" : "people"}</ExpenseTag>
                    </ExpenseTags>
                    {!!exp.splitAmong?.length && (
                      <SplitBreakdown>
                        <SplitBreakdownHeading>Each person’s share</SplitBreakdownHeading>
                        <SplitPeople $many={exp.splitAmong.length > 10}>
                          {exp.splitAmong.map((split) => {
                            const shareAmount = Number(split.shareAmount ?? (Number(exp.amount || 0) / exp.splitAmong.length));
                            const percentage = Number.isFinite(Number(split.percentage))
                              ? Number(split.percentage)
                              : (Number(exp.amount) > 0 ? (shareAmount / Number(exp.amount)) * 100 : 0);
                            return (
                              <SplitPerson key={split.user?._id || split.user}>
                                <SplitPersonName>{split.user?.name || "Unknown member"}</SplitPersonName>
                                <SplitPersonShare>{formatMoney(shareAmount)} <span>{percentage.toFixed(1)}%</span></SplitPersonShare>
                              </SplitPerson>
                            );
                          })}
                        </SplitPeople>
                      </SplitBreakdown>
                    )}
                  </ExpenseLeft>
                  <ExpenseAmount>₹{Number(exp.amount || 0).toFixed(2)}</ExpenseAmount>
                  <ExpenseActions>
                    <ExpenseAction to={`/groups/${id}/expenses/${exp._id}`}>View</ExpenseAction>
                    <ExpenseAction $primary to={`/groups/${id}/expenses/${exp._id}/edit`}>Edit</ExpenseAction>
                    {(canManageGroup || exp.createdBy?.username === username || exp.paidBy?.username === username) && (
                      <ExpenseDeleteButton type="button" onClick={() => handleDeleteExpense(exp)} aria-label={`Delete ${exp.description}`} title="Delete expense">
                        <FaTrash size={13} />
                      </ExpenseDeleteButton>
                    )}
                  </ExpenseActions>
                </ExpenseCard>
              ))}
            </div>
          ))}
          {expensePageCount > 1 && (
            <Pagination aria-label="Expense history pages">
              <PageButton type="button" onClick={() => setExpensePage(visibleExpensePage - 1)} disabled={visibleExpensePage === 1}>Previous</PageButton>
              <PageStatus>Page {visibleExpensePage} of {expensePageCount} · {group.expensePagination?.total || 0} expenses</PageStatus>
              <PageButton type="button" onClick={() => setExpensePage(visibleExpensePage + 1)} disabled={visibleExpensePage === expensePageCount}>Next</PageButton>
            </Pagination>
          )}

          <MembersSection>
            <SectionTitle>Group activity</SectionTitle>
            {!activity.length ? (
              <EmptyExpenses>Group activity will appear here as people join and expenses change.</EmptyExpenses>
            ) : (
              <>
                <ActivityList>
                  {visibleActivity.map((item) => (
                    <ActivityItem key={item._id}>
                      <ActivityCopy>
                        <ActivityMessage><strong>{item.actor?.name || "A former member"}</strong> {item.message}</ActivityMessage>
                        {!!item.details?.splitBreakdown?.length && (
                          <SplitBreakdown>
                            <SplitBreakdownHeading>Split at this update</SplitBreakdownHeading>
                            <SplitPeople $many={item.details.splitBreakdown.length > 10}>
                              {item.details.splitBreakdown.map((split, index) => {
                                const percentage = Number.isFinite(Number(split.percentage))
                                  ? Number(split.percentage)
                                  : (Number(item.details.amount) > 0 ? (Number(split.shareAmount) / Number(item.details.amount)) * 100 : 0);
                                return (
                                  <SplitPerson key={`${split.name}-${index}`}>
                                    <SplitPersonName>{split.name || "Unknown member"}</SplitPersonName>
                                    <SplitPersonShare>{formatMoney(split.shareAmount)} <span>{percentage.toFixed(1)}%</span></SplitPersonShare>
                                  </SplitPerson>
                                );
                              })}
                            </SplitPeople>
                          </SplitBreakdown>
                        )}
                      </ActivityCopy>
                      <ActivityTime>{new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(item.createdAt))}</ActivityTime>
                    </ActivityItem>
                  ))}
                </ActivityList>
                {activityPageCount > 1 && (
                  <Pagination aria-label="Group activity pages">
                    <PageButton type="button" onClick={() => setActivityPage(visibleActivityPage - 1)} disabled={visibleActivityPage === 1}>Previous</PageButton>
                    <PageStatus>Page {visibleActivityPage} of {activityPageCount} · {group.activityPagination?.total || 0} updates</PageStatus>
                    <PageButton type="button" onClick={() => setActivityPage(visibleActivityPage + 1)} disabled={visibleActivityPage === activityPageCount}>Next</PageButton>
                  </Pagination>
                )}
              </>
            )}
          </MembersSection>

          <FloatingButton
            as={motion.button}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            aria-label="Add expense"
            title="Add expense"
            onClick={() => navigate(`/groups/${id}/expense/new`)}
          >
            <FaPlus size={20} />
          </FloatingButton>
        </Wrapper>
      </div>
    </div>
  );
};

export default ViewGroup;
