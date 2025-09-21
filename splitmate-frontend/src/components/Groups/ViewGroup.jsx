import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Nav from "../Nav/Nav";
import Sidebar from "../Sidebar/Sidebar";
import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";
import axios from "axios";
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
  FloatingButton,
} from "./ViewGroupStyle";

const ViewGroup = () => {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const username = localStorage.getItem("username");
        if (!username) return;

        const res = await axios.get(`${BASE_URL}/api/user/groups/${id}`, {
          params: { username },
        });
        setGroup(res.data);
      } catch (err) {
        console.error("❌ Error fetching group:", err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchGroup();
  }, [id]);

  if (loading) return <p style={{ color: "#fff", padding: "20px" }}>Loading...</p>;
  if (!group) return <p style={{ color: "#fff", padding: "20px" }}>Group not found.</p>;

  const groupedExpenses = group.expenses?.reduce((acc, expense) => {
    const date = new Date(expense.createdAt).toLocaleDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(expense);
    return acc;
  }, {}) || {};

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Nav toggleSidebar={() => setIsSidebarOpen((p) => !p)} />
      <div style={{ display: "flex", flex: 1, paddingTop: "60px" }}>
        <Sidebar isOpen={isSidebarOpen} />
        <Wrapper style={{ marginLeft: isSidebarOpen ? "220px" : "80px", transition: "margin 0.3s ease", flex: 1 }}>
          <Header>
            <Title>{group.name}</Title>
            <SubTitle>Created by: {group.createdBy?.name || "Unknown"}</SubTitle>
          </Header>

          <BalancesWrapper>
            <BalanceCard color="red">
              <BalanceTitle>You Owe</BalanceTitle>
              <BalanceAmount>₹{group.summary?.youOwe?.toFixed(2) || 0}</BalanceAmount>
            </BalanceCard>
            <BalanceCard color="green">
              <BalanceTitle>Owed To You</BalanceTitle>
              <BalanceAmount>₹{group.summary?.owedToYou?.toFixed(2) || 0}</BalanceAmount>
            </BalanceCard>
          </BalancesWrapper>

          <SectionTitle>Expense History</SectionTitle>
          {Object.entries(groupedExpenses).map(([date, expenses]) => (
            <div key={date}>
              <ExpenseDate>{date}</ExpenseDate>
              {expenses.map((exp) => (
                <ExpenseCard key={exp._id}>
                  <ExpenseLeft>
                    <ExpenseTitle>{exp.description}</ExpenseTitle>
                    <ExpenseMeta>Paid by {exp.paidBy?.name || "Unknown"}</ExpenseMeta>
                  </ExpenseLeft>
                  <ExpenseAmount>₹{exp.amount}</ExpenseAmount>
                </ExpenseCard>
              ))}
            </div>
          ))}

          <FloatingButton
            as={motion.button}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
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
