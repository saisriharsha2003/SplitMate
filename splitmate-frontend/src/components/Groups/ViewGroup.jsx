import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Nav from "../Nav/Nav";
import Sidebar from "../Sidebar/Sidebar";
import { motion } from "framer-motion";
import { FaPlus, FaTrash, FaUserMinus } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "../config";
import {
  Wrapper,
  Header,
  Title,
  SubTitle,
  BalancesWrapper,
  BalanceCard,
  BalanceTitle,
  BalanceAmount,
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
  MembersSection,
  MemberRow,
  MemberInfo,
  MemberAvatar,
  MemberName,
  MemberRole,
  ActivityList,
  ActivityItem,
  ActivityMessage,
  ActivityTime,
  Pagination,
  PageButton,
  PageStatus,
  RemoveMemberButton,
  FloatingButton,
  EmptyExpenses,
  PageMessage,
} from "./ViewGroupStyle";

const ViewGroup = () => {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [membersPage, setMembersPage] = useState(1);
  const [activityPage, setActivityPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/api/user/groups/${id}`, {
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
  }, [id, refreshKey]);

  const handleDeleteExpense = async (expense) => {
    const confirmed = window.confirm(`Delete "${expense.description}"? This cannot be undone.`);
    if (!confirmed) return;

    try {
      await axios.delete(`${BASE_URL}/api/user/groups/${id}/expenses/${expense._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
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

  if (loading) return <PageMessage>Loading group details...</PageMessage>;
  if (!group) return <PageMessage>Group not found.</PageMessage>;

  const sortedExpenses = [...(group.expenses || [])].sort(
    (a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)
  );
  const groupedExpenses = sortedExpenses.reduce((acc, expense) => {
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
  const members = group.members || [];
  const activity = group.activity || [];
  const membersPageCount = Math.ceil(members.length / 2);
  const activityPageCount = Math.ceil(activity.length / 5);
  const visibleMembersPage = Math.min(membersPage, Math.max(membersPageCount, 1));
  const visibleActivityPage = Math.min(activityPage, Math.max(activityPageCount, 1));
  const visibleMembers = members.slice((visibleMembersPage - 1) * 2, visibleMembersPage * 2);
  const visibleActivity = activity.slice((visibleActivityPage - 1) * 5, visibleActivityPage * 5);

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

          <BalancesWrapper>
            <BalanceCard $tone="owe">
              <BalanceTitle>You Owe</BalanceTitle>
              <BalanceAmount>₹{(group.summary?.youOwe || 0).toFixed(2)}</BalanceAmount>
            </BalanceCard>
            <BalanceCard $tone="owed">
              <BalanceTitle>Owed To You</BalanceTitle>
              <BalanceAmount>₹{(group.summary?.owedToYou || 0).toFixed(2)}</BalanceAmount>
            </BalanceCard>
          </BalancesWrapper>

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

          <MembersSection>
            <SectionTitle>Group activity</SectionTitle>
            {!activity.length ? (
              <EmptyExpenses>Group activity will appear here as people join and expenses change.</EmptyExpenses>
            ) : (
              <>
                <ActivityList>
                  {visibleActivity.map((item) => (
                    <ActivityItem key={item._id}>
                      <ActivityMessage><strong>{item.actor?.name || "A former member"}</strong> {item.message}</ActivityMessage>
                      <ActivityTime>{new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(item.createdAt))}</ActivityTime>
                    </ActivityItem>
                  ))}
                </ActivityList>
                {activityPageCount > 1 && (
                  <Pagination aria-label="Group activity pages">
                    <PageButton type="button" onClick={() => setActivityPage(visibleActivityPage - 1)} disabled={visibleActivityPage === 1}>Previous</PageButton>
                    <PageStatus>Page {visibleActivityPage} of {activityPageCount}</PageStatus>
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
