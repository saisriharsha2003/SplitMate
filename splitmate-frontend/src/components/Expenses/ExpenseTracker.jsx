import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaEdit, FaPlus, FaReceipt, FaTrash, FaTimes } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import Nav from "../Nav/Nav";
import Sidebar from "../Sidebar/Sidebar";
import { BASE_URL } from "../config";
import {
  Wrapper, Header, Title, HeaderDescription, SheetToolbar, MonthTabs, MonthTab, MonthPicker,
  MonthSheet, SheetHeader, MonthTitle, MonthTotal, AddButton, ExpenseForm, FormTitle, FormGrid,
  Field, Label, Input, Select, FormActions, SecondaryButton, PrimaryButton, SheetTableWrap, SheetTable,
  CategoryTag, EmptyState, LoadingState, RowAction, TablePagination, PageControl, PageInfo, ActionGroup,
} from "./ExpenseTrackerStyle";

const getToday = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
const getCurrentMonth = () => getToday().slice(0, 7);
const CATEGORIES = [
  "Online Order", "Rapido", "Swiggy", "Zomato", "Groceries", "Food & Dining",
  "Transport", "Auto / Taxi", "Fuel", "Shopping", "Bills & Utilities", "Rent",
  "Health & Medical", "Entertainment", "Travel", "Education", "Personal Care",
  "Subscriptions", "Gifts", "Home", "Other",
];
const blankForm = (month, currency) => ({
  description: "", amount: "", date: `${month}-01`, category: "Other", customCategory: "", notes: "", currency,
});

const ExpenseTracker = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [currency, setCurrency] = useState("INR");
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth);
  const [expensePage, setExpensePage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [form, setForm] = useState(() => blankForm(getCurrentMonth(), "INR"));

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${BASE_URL}/api/user/personal-expenses`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setExpenses(response.data.expenses || []);
      setCurrency(response.data.currency || "INR");
    } catch (requestError) {
      setError(requestError.response?.data?.error || "Could not load your personal expenses.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchExpenses(); }, [fetchExpenses]);

  const monthKeys = useMemo(() => {
    const keys = new Set([getCurrentMonth(), selectedMonth]);
    expenses.forEach((expense) => {
      const date = new Date(expense.date);
      if (!Number.isNaN(date.getTime())) keys.add(`${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`);
    });
    return [...keys].sort((a, b) => b.localeCompare(a));
  }, [expenses, selectedMonth]);

  const monthExpenses = useMemo(() => expenses
    .filter((expense) => {
      const date = new Date(expense.date);
      return !Number.isNaN(date.getTime()) && `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}` === selectedMonth;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date)), [expenses, selectedMonth]);
  const monthTotal = monthExpenses.reduce((total, expense) => total + Number(expense.amount || 0), 0);
  const expensePageCount = Math.ceil(monthExpenses.length / 5);
  const visibleExpensePage = Math.min(expensePage, Math.max(expensePageCount, 1));
  const visibleMonthExpenses = monthExpenses.slice((visibleExpensePage - 1) * 5, visibleExpensePage * 5);
  const expensesByDate = visibleMonthExpenses.reduce((groups, expense) => {
    const dateKey = new Date(expense.date).toISOString().slice(0, 10);
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(expense);
    return groups;
  }, {});

  const formatMoney = (amount, activeCurrency = currency) => {
    try {
      return new Intl.NumberFormat(undefined, { style: "currency", currency: activeCurrency }).format(Number(amount || 0));
    } catch {
      return `${activeCurrency} ${Number(amount || 0).toFixed(2)}`;
    }
  };
  const formatMonth = (monthKey, options = { month: "long", year: "numeric" }) =>
    new Intl.DateTimeFormat(undefined, { ...options, timeZone: "UTC" }).format(new Date(`${monthKey}-01T00:00:00.000Z`));

  const openAddForm = () => {
    setEditingExpense(null);
    setForm(blankForm(selectedMonth, currency));
    setFormOpen(true);
  };

  const openEditForm = (expense) => {
    setEditingExpense(expense);
    setForm({
      description: expense.description || "",
      amount: String(expense.amount ?? ""),
      date: new Date(expense.date).toISOString().slice(0, 10),
      category: CATEGORIES.includes(expense.category) ? expense.category : "Other",
      customCategory: CATEGORIES.includes(expense.category) ? "" : expense.category || "",
      notes: expense.notes || "",
      currency: expense.currency || currency,
    });
    setFormOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const amount = Number(form.amount);
    if (!form.description.trim() || !Number.isFinite(amount) || amount <= 0 || !form.date) {
      toast.error("Enter an expense name, a valid amount, and a date");
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      description: form.description.trim(),
      amount,
      category: form.category === "Other" && form.customCategory.trim() ? form.customCategory.trim() : form.category,
    };
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
      if (editingExpense) {
        await axios.put(`${BASE_URL}/api/user/personal-expenses/${editingExpense._id}`, payload, { headers });
        toast.success("Personal expense updated");
      } else {
        await axios.post(`${BASE_URL}/api/user/personal-expenses`, payload, { headers });
        toast.success("Personal expense added");
      }
      setSelectedMonth(form.date.slice(0, 7));
      setExpensePage(1);
      setFormOpen(false);
      setEditingExpense(null);
      await fetchExpenses();
    } catch (requestError) {
      toast.error(requestError.response?.data?.error || "Could not save this expense");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (expense) => {
    if (!window.confirm(`Delete “${expense.description}” from your personal tracker?`)) return;
    try {
      await axios.delete(`${BASE_URL}/api/user/personal-expenses/${expense._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setExpenses((current) => current.filter((item) => item._id !== expense._id));
      setExpensePage(1);
      toast.success("Personal expense deleted");
    } catch (requestError) {
      toast.error(requestError.response?.data?.error || "Could not delete this expense");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Nav toggleSidebar={() => setIsSidebarOpen((open) => !open)} />
      <div style={{ display: "flex", flex: 1, paddingTop: "60px" }}>
        <Sidebar isOpen={isSidebarOpen} />
        <Wrapper style={{ marginLeft: isSidebarOpen ? "220px" : "80px" }}>
          <Header>
            <div>
              <Title>Expense Tracker</Title>
              <HeaderDescription>Your private spending ledger, organized into monthly sheets.</HeaderDescription>
            </div>
          </Header>

          <SheetToolbar>
            <MonthTabs role="tablist" aria-label="Expense months">
              {monthKeys.map((month) => (
                <MonthTab key={month} type="button" role="tab" aria-selected={selectedMonth === month} $active={selectedMonth === month} onClick={() => { setSelectedMonth(month); setExpensePage(1); setFormOpen(false); }}>
                  {formatMonth(month, { month: "short", year: "2-digit" })}
                </MonthTab>
              ))}
            </MonthTabs>
            <MonthPicker aria-label="Choose a month" type="month" value={selectedMonth} onChange={(event) => { setSelectedMonth(event.target.value); setExpensePage(1); setFormOpen(false); }} />
          </SheetToolbar>

          <MonthSheet>
            <SheetHeader>
              <div>
                <MonthTitle>{formatMonth(selectedMonth)}</MonthTitle>
                <p>{monthExpenses.length} {monthExpenses.length === 1 ? "expense" : "expenses"} in this month</p>
              </div>
              <MonthTotal>{formatMoney(monthTotal)}<span>MONTH TOTAL</span></MonthTotal>
              <AddButton type="button" onClick={formOpen ? () => setFormOpen(false) : openAddForm}>
                {formOpen ? <FaTimes /> : <FaPlus />}{formOpen ? "Close" : "Add expense"}
              </AddButton>
            </SheetHeader>

            {formOpen && (
              <ExpenseForm onSubmit={handleSubmit}>
                <FormTitle>{editingExpense ? "Edit personal expense" : `Add expense to ${formatMonth(selectedMonth)}`}</FormTitle>
                <FormGrid>
                  <Field>
                    <Label htmlFor="personal-description">Expense</Label>
                    <Input id="personal-description" maxLength={140} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="e.g. Groceries" required />
                  </Field>
                  <Field>
                    <Label htmlFor="personal-amount">Amount</Label>
                    <Input id="personal-amount" type="number" min="0.01" step="0.01" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} placeholder="0.00" required />
                  </Field>
                  <Field>
                    <Label htmlFor="personal-category">Category</Label>
                    <Select id="personal-category" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
                      {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
                    </Select>
                  </Field>
                  {form.category === "Other" && (
                    <Field>
                      <Label htmlFor="personal-custom-category">Custom category <span>Optional</span></Label>
                      <Input id="personal-custom-category" maxLength={40} value={form.customCategory || ""} onChange={(event) => setForm({ ...form, customCategory: event.target.value })} placeholder="Enter a category" />
                    </Field>
                  )}
                  <Field>
                    <Label htmlFor="personal-date">Date</Label>
                    <Input id="personal-date" type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} required />
                  </Field>
                  <Field $wide>
                    <Label htmlFor="personal-notes">Notes <span>Optional</span></Label>
                    <Input id="personal-notes" maxLength={500} value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} placeholder="Add a note for yourself" />
                  </Field>
                </FormGrid>
                <FormActions>
                  <SecondaryButton type="button" onClick={() => setFormOpen(false)}>Cancel</SecondaryButton>
                  <PrimaryButton type="submit" disabled={saving}>{saving ? "Saving…" : editingExpense ? "Save changes" : "Add to month"}</PrimaryButton>
                </FormActions>
              </ExpenseForm>
            )}

            {loading ? (
              <LoadingState>Loading your personal expenses…</LoadingState>
            ) : error ? (
              <EmptyState role="alert">{error}</EmptyState>
            ) : monthExpenses.length === 0 ? (
              <EmptyState>
                <FaReceipt />
                <strong>This month is ready for your expenses</strong>
                <span>Add personal spending here. These entries stay separate from group balances.</span>
              </EmptyState>
            ) : (
              <SheetTableWrap>
                <SheetTable>
                  <thead><tr><th>Date</th><th>Expense</th><th>Category</th><th>Notes</th><th>Amount</th><th aria-label="Actions" /></tr></thead>
                  <tbody>
                    {Object.entries(expensesByDate).map(([dateKey, dateExpenses]) => (
                      <React.Fragment key={dateKey}>
                        <tr className="date-group">
                          <td colSpan={6}>
                            <span>{new Intl.DateTimeFormat(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${dateKey}T00:00:00.000Z`))}</span>
                            <strong>Daily total · {formatMoney(dateExpenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0))}</strong>
                          </td>
                        </tr>
                        {dateExpenses.map((expense) => (
                          <tr key={expense._id}>
                            <td>{new Intl.DateTimeFormat(undefined, { day: "2-digit", month: "short", timeZone: "UTC" }).format(new Date(expense.date))}</td>
                            <td className="description">{expense.description}</td>
                            <td><CategoryTag>{expense.category || "Other"}</CategoryTag></td>
                            <td className="notes" title={expense.notes}>{expense.notes || "—"}</td>
                            <td className="amount">{formatMoney(expense.amount, expense.currency)}</td>
                            <td className="actions">
                              <ActionGroup>
                                <RowAction type="button" onClick={() => openEditForm(expense)} aria-label={`Edit ${expense.description}`} title="Edit"><FaEdit /></RowAction>
                                <RowAction $danger type="button" onClick={() => handleDelete(expense)} aria-label={`Delete ${expense.description}`} title="Delete"><FaTrash /></RowAction>
                              </ActionGroup>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </SheetTable>
              </SheetTableWrap>
            )}
            {!loading && !error && expensePageCount > 1 && (
              <TablePagination aria-label="Personal expense pages">
                <PageControl type="button" onClick={() => setExpensePage(visibleExpensePage - 1)} disabled={visibleExpensePage === 1}>Previous</PageControl>
                <PageInfo>Page {visibleExpensePage} of {expensePageCount} · {monthExpenses.length} expenses</PageInfo>
                <PageControl type="button" onClick={() => setExpensePage(visibleExpensePage + 1)} disabled={visibleExpensePage === expensePageCount}>Next</PageControl>
              </TablePagination>
            )}
          </MonthSheet>
        </Wrapper>
      </div>
    </div>
  );
};

export default ExpenseTracker;
