import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage/LandingPage";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import Dashboard from "./components/Dashboard/Dashboard";
import Groups from "./components/Groups/Groups";
import NewGroup from "./components/Groups/NewGroup";
import ViewGroup from "./components/Groups/ViewGroup";
import AddExpense from "./components/Expenses/AddExpense";
import ExpenseDetails from "./components/Expenses/ExpenseDetails";
import ExpenseTracker from "./components/Expenses/ExpenseTracker";
import Accounts from "./components/Expenses/Accounts";
import EditProfile from "./components/Profile/EditProfile";
import ChangePassword from "./components/Profile/ChangePassword";
import ProtectedRoute from "./components/Helper/ProtectedRoute";
import NotFound from "./components/Helper/NotFound";
import ForgotPassword from "./components/Profile/ForgotPassword";
import { ToastContainer } from "react-toastify";

import "./index.css";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/expense-tracker" element={<ExpenseTracker />} />
          <Route path="/expense-tracker/accounts" element={<Accounts />} />
          <Route path="/groups/new" element={<NewGroup />} />
          <Route path="/groups/:id" element={<ViewGroup />} />
          <Route path="/groups/:id/expense/new" element={<AddExpense />} />
          <Route path="/groups/:id/expenses/:expenseId" element={<ExpenseDetails />} />
          <Route path="/groups/:id/expenses/:expenseId/edit" element={<AddExpense isEdit />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer />
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
