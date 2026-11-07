import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import Nav from "../Nav/Nav";
import Sidebar from "../Sidebar/Sidebar";
import { BASE_URL } from "../config";
import {
  Page,
  Container,
  BackLink,
  Header,
  EditButton,
  Summary,
  SummaryCard,
  Section,
  ParticipantList,
  ParticipantRow,
  AuditList,
  AuditItem,
  State,
} from "./ExpenseDetailsStyle";

const ExpenseDetails = () => {
  const { id: groupId, expenseId } = useParams();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchExpense = async () => {
      setLoading(true);
      setErrorMessage("");
      setData(null);
      try {
        const response = await axios.get(
          `${BASE_URL}/api/user/groups/${groupId}/expenses/${expenseId}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        setData(response.data);
      } catch (error) {
        const message = error.response?.data?.error || "Could not load this expense";
        setErrorMessage(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };
    fetchExpense();
  }, [expenseId, groupId]);

  const formatDate = (value, options = {}) => {
    const date = value ? new Date(value) : null;
    if (!date || Number.isNaN(date.getTime())) return "Date unavailable";
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", ...options }).format(date);
  };

  const group = data?.group;
  const expense = data?.expense;
  const currency = group ? new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: group.currency || "INR",
  }) : null;
  const splitNames = { equal: "Equally", percentage: "By percentage", amount: "Custom amounts" };
  const payerName = expense?.paidBy?.name;
  const creatorName = expense?.createdBy?.name || payerName || "Not recorded";
  const editorName = expense?.lastUpdatedBy?.name || expense?.createdBy?.name || payerName || "Not recorded";
  const creatorWasInferred = !expense?.createdBy?.name && Boolean(payerName);
  const editorWasInferred = !expense?.lastUpdatedBy?.name && !expense?.createdBy?.name && Boolean(payerName);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Nav toggleSidebar={() => setIsSidebarOpen((open) => !open)} />
      <div style={{ display: "flex", flex: 1, paddingTop: "60px" }}>
        <Sidebar isOpen={isSidebarOpen} />
        <Page isOpen={isSidebarOpen}>
          <Container>
            {loading ? (
              <State>Loading expense details...</State>
            ) : !expense || !group ? (
              <State>
                <div>{errorMessage || "Expense not found."}</div>
                <BackLink type="button" onClick={() => navigate(`/groups/${groupId}`)}>
                  <FaArrowLeft /> Back to group
                </BackLink>
              </State>
            ) : (
              <>
                <BackLink type="button" onClick={() => navigate(`/groups/${groupId}`)}>
                  <FaArrowLeft /> Back to {group.name}
                </BackLink>
                <Header>
                  <div>
                    <small>EXPENSE DETAILS</small>
                    <h1>{expense.description || "Expense"}</h1>
                  </div>
                  <EditButton type="button" onClick={() => navigate(`/groups/${groupId}/expenses/${expenseId}/edit`)}>
                    <FaEdit /> Edit expense
                  </EditButton>
                </Header>

                <Summary>
                  <SummaryCard><span>Total amount</span><strong>{currency.format(expense.amount)}</strong></SummaryCard>
                  <SummaryCard><span>Paid by</span><strong>{expense.paidBy?.name || "Unknown"}</strong></SummaryCard>
                  <SummaryCard><span>Expense date</span><strong>{formatDate(expense.date)}</strong></SummaryCard>
                </Summary>

                <Section>
                  <h2>Split details · {splitNames[expense.splitType] || "Custom split"}</h2>
                  <ParticipantList>
                    {(Array.isArray(expense.splitAmong) ? expense.splitAmong : []).map((split, index) => (
                      <ParticipantRow key={split._id || split.user?._id || index}>
                        <span>{split.user?.name || "Group member"}{split.percentage !== undefined ? ` · ${split.percentage}%` : ""}</span>
                        <strong>{currency.format(split.shareAmount || 0)}</strong>
                      </ParticipantRow>
                    ))}
                  </ParticipantList>
                </Section>

                <Section>
                  <h2>Activity</h2>
                  <AuditList>
                    <AuditItem>
                      Added by <strong>{creatorName}</strong>
                      {creatorWasInferred && <span> (payer; creator was not recorded)</span>}
                      {expense.createdAt && <> · {formatDate(expense.createdAt, { dateStyle: "medium", timeStyle: "short" })}</>}
                    </AuditItem>
                    <AuditItem>
                      Last updated by <strong>{editorName}</strong>
                      {editorWasInferred && <span> (editor was not recorded)</span>}
                      {expense.updatedAt && <> · {formatDate(expense.updatedAt, { dateStyle: "medium", timeStyle: "short" })}</>}
                    </AuditItem>
                  </AuditList>
                </Section>
              </>
            )}
          </Container>
        </Page>
      </div>
    </div>
  );
};

export default ExpenseDetails;
