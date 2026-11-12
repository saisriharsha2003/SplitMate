import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaEdit, FaPlus, FaReceipt, FaTrash, FaTimes } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import Nav from "../Nav/Nav";
import Sidebar from "../Sidebar/Sidebar";
import CustomSelect from "../Helper/CustomeSelect";
import { BASE_URL } from "../config";
import {
  Wrapper, Header, Title, HeaderDescription, SheetToolbar, MonthTabs, MonthTab, MonthPicker,
  MonthSheet, SheetHeader, MonthTitle, MonthTotal, AddButton, ExpenseForm, ExpenseModalOverlay, FormTitle, FormGrid,
  Field, Label, Input, DropdownFrame, FormActions, SecondaryButton, PrimaryButton, SheetTableWrap, SheetTable,
  CategoryTag, EmptyState, LoadingState, RowAction, TablePagination, PageControl, PageInfo, ActionGroup,
} from "./ExpenseTrackerStyle";

const getToday = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
const getCurrentMonth = () => getToday().slice(0, 7);
const CATEGORIES = [
  "Online Order", "Rapido", "Swiggy", "Zomato", "Groceries", "Food & Dining",
  "Transport", "Auto / Taxi", "Fuel", "Shopping", "Cashback", "Bills & Utilities", "Rent",
  "Health & Medical", "EMI", "Entertainment", "Travel", "Education", "Personal Care",
  "Subscriptions", "Gifts", "Home", "Other",
];
const blankForm = (currency) => ({
  description: "", amount: "", date: getToday(), category: "Other", customCategory: "", notes: "", currency, accountId: "",
});

const ExpenseTracker = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [accountsError, setAccountsError] = useState("");
  const [availableMonths, setAvailableMonths] = useState([]);
  const [monthTotals, setMonthTotals] = useState([]);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [expensePageCount, setExpensePageCount] = useState(0);
  const [currency, setCurrency] = useState("INR");
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth);
  const [expensePage, setExpensePage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [form, setForm] = useState(() => blankForm("INR"));
  const editDialogRef = useRef(null);
  const expenseModalTriggerRef = useRef(null);

  const fetchExpenses = useCallback(async (month = selectedMonth, page = expensePage) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${BASE_URL}/api/user/personal-expenses`, {
        params: { month, page, limit: 10 },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setExpenses(response.data.expenses || []);
      setCurrency(response.data.currency || "INR");
      setAvailableMonths(response.data.months || []);
      setMonthTotals(response.data.monthTotals || []);
      setExpenseTotal(response.data.total || 0);
      setExpensePageCount(response.data.pages || 0);
    } catch (requestError) {
      setError(requestError.response?.data?.error || "Could not load your personal expenses.");
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, expensePage]);

  const fetchAccounts = useCallback(async () => {
    setAccountsLoading(true);
    setAccountsError("");
    try {
      const response = await axios.get(`${BASE_URL}/api/user/accounts`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAccounts(response.data.accounts || []);
    } catch (requestError) {
      const message = requestError.response?.data?.error || "Could not load your accounts";
      setAccountsError(message);
      toast.error(message);
    } finally {
      setAccountsLoading(false);
    }
  }, []);

  useEffect(() => { fetchExpenses(); }, [fetchExpenses]);
  useEffect(() => { fetchAccounts(); }, [fetchAccounts]);
  useEffect(() => {
    if (!formOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = expenseModalTriggerRef.current || document.activeElement;
    document.body.style.overflow = "hidden";
    const handleDialogKeys = (event) => {
      if (event.key === "Escape") {
        setFormOpen(false);
        setEditingExpense(null);
        return;
      }
      if (event.key === "Tab") {
        const focusable = [...(editDialogRef.current?.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ) || [])].filter((element) => element.offsetParent !== null);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleDialogKeys);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleDialogKeys);
      if (previouslyFocused?.isConnected) previouslyFocused.focus({ preventScroll: true });
      expenseModalTriggerRef.current = null;
    };
  }, [formOpen, editingExpense]);

  const monthKeys = useMemo(() => {
    return [...new Set([getCurrentMonth(), selectedMonth, ...availableMonths])].sort((a, b) => b.localeCompare(a));
  }, [availableMonths, selectedMonth]);

  const monthExpenses = expenses;
  const getNetAmount = (expense) =>
    expense.category?.trim().toLowerCase() === "cashback"
      ? -Number(expense.amount || 0)
      : Number(expense.amount || 0);
  const monthTotal = monthTotals.length === 1
    ? formatMoney(monthTotals[0].amount, monthTotals[0].currency)
    : monthTotals.map((item) => formatMoney(item.amount, item.currency)).join(" · ") || formatMoney(0);
  const visibleExpensePage = Math.min(expensePage, Math.max(expensePageCount, 1));
  const expensesByDate = monthExpenses.reduce((groups, expense) => {
    const dateKey = new Date(expense.date).toISOString().slice(0, 10);
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(expense);
    return groups;
  }, {});
  const accountOptions = accounts.map((account) => ({
    value: account._id,
    label: `${account.name} · ${account.type === "credit_card" ? "Credit card" : account.type === "upi_lite" ? "UPI Lite" : account.type === "other" ? account.customTypeName || "Other" : "Bank account"} · ${account.currency}`,
  }));

  function formatMoney(amount, activeCurrency = currency) {
    try {
      return new Intl.NumberFormat(undefined, { style: "currency", currency: activeCurrency }).format(Number(amount || 0));
    } catch {
      return `${activeCurrency} ${Number(amount || 0).toFixed(2)}`;
    }
  }
  const formatMonth = (monthKey, options = { month: "long", year: "numeric" }) =>
    new Intl.DateTimeFormat(undefined, { ...options, timeZone: "UTC" }).format(new Date(`${monthKey}-01T00:00:00.000Z`));

  const openAddForm = (event) => {
    if (accountsLoading) return;
    if (accountsError) {
      toast.error("Your accounts could not be loaded. Please try again before adding an expense.");
      return;
    }
    if (!accounts.length) {
      toast.info("Add an account before recording an expense. You can open Accounts from the sidebar.");
      return;
    }
    expenseModalTriggerRef.current = event.currentTarget;
    setEditingExpense(null);
    setForm(blankForm(accounts[0].currency));
    setFormOpen(true);
  };

  const openEditForm = (expense, event) => {
    expenseModalTriggerRef.current = event.currentTarget;
    setEditingExpense(expense);
    setForm({
      description: expense.description || "",
      amount: String(expense.amount ?? ""),
      date: new Date(expense.date).toISOString().slice(0, 10),
      category: CATEGORIES.includes(expense.category) ? expense.category : "Other",
      customCategory: CATEGORIES.includes(expense.category) ? "" : expense.category || "",
      notes: expense.notes || "",
      currency: expense.account?.currency || expense.currency || currency,
      accountId: expense.account?._id || expense.account || "",
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
    if (!form.accountId) {
      toast.error("Choose an account for this expense");
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
      await fetchExpenses(form.date.slice(0, 7), 1);
      await fetchAccounts();
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
      await fetchAccounts();
      const nextPage = expenses.length === 1 && expensePage > 1 ? expensePage - 1 : expensePage;
      if (nextPage !== expensePage) setExpensePage(nextPage);
      await fetchExpenses(selectedMonth, nextPage);
      toast.success("Personal expense deleted");
    } catch (requestError) {
      toast.error(requestError.response?.data?.error || "Could not delete this expense");
    }
  };

  const closeExpenseForm = () => {
    setFormOpen(false);
    setEditingExpense(null);
  };

  const expenseFormContent = (
    <>
      <FormTitle id="expense-form-title">{editingExpense ? "Edit personal expense" : `Add expense to ${formatMonth(selectedMonth)}`}</FormTitle>
      <FormGrid>
        <Field $spanTwo>
          <Label htmlFor="personal-description">Expense</Label>
          <Input id="personal-description" autoFocus maxLength={140} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="e.g. Groceries" required />
        </Field>
        <Field>
          <Label htmlFor="personal-amount">Amount</Label>
          <Input id="personal-amount" type="number" min="0.01" step="0.01" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} placeholder="0.00" required />
        </Field>
        <Field>
          <Label htmlFor="personal-date">Date</Label>
          <Input id="personal-date" type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} required />
        </Field>
        <Field $spanTwo>
          <Label>Paid from account</Label>
          <DropdownFrame>
            <CustomSelect id="personal-account" ariaLabel="Paid from account" placeholder="Select an account" options={accountOptions} value={accountOptions.find((option) => option.value === form.accountId)} onChange={(option) => {
              const account = accounts.find((item) => item._id === option.value);
              setForm({ ...form, accountId: option.value, currency: account?.currency || form.currency });
            }} />
          </DropdownFrame>
        </Field>
        <Field $spanTwo={form.category !== "Other"}>
          <Label>Category</Label>
          <DropdownFrame>
            <CustomSelect id="personal-category" ariaLabel="Category" options={CATEGORIES.map((category) => ({ value: category, label: category }))} value={{ value: form.category, label: form.category }} onChange={(option) => setForm({ ...form, category: option.value })} />
          </DropdownFrame>
        </Field>
        {form.category === "Other" && (
          <Field>
            <Label htmlFor="personal-custom-category">Custom category <span>Optional</span></Label>
            <Input id="personal-custom-category" maxLength={40} value={form.customCategory || ""} onChange={(event) => setForm({ ...form, customCategory: event.target.value })} placeholder="Enter a category" />
          </Field>
        )}
        <Field $wide>
          <Label htmlFor="personal-notes">Notes <span>Optional</span></Label>
          <Input id="personal-notes" maxLength={500} value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} placeholder="Add a note for yourself" />
        </Field>
      </FormGrid>
      <FormActions>
        <SecondaryButton type="button" onClick={closeExpenseForm}>Cancel</SecondaryButton>
        <PrimaryButton type="submit" disabled={saving}>{saving ? "Saving…" : editingExpense ? "Save changes" : "Add to month"}</PrimaryButton>
      </FormActions>
    </>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Nav toggleSidebar={() => setIsSidebarOpen((open) => !open)} />
      <div style={{ display: "flex", flex: 1, paddingTop: "60px" }}>
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
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
                <p>{monthExpenses.length} {monthExpenses.length === 1 ? "entry" : "entries"} on this page</p>
              </div>
              <MonthTotal>{monthTotal}<span>NET MONTHLY SPEND · CASHBACK DEDUCTED · {expenseTotal} ENTRIES</span></MonthTotal>
              <AddButton type="button" disabled={!formOpen && accountsLoading} onClick={formOpen ? closeExpenseForm : openAddForm}>
                {formOpen ? <FaTimes /> : <FaPlus />}{formOpen ? "Close" : accountsLoading ? "Loading accounts…" : "Add expense"}
              </AddButton>
            </SheetHeader>

            {formOpen && createPortal(
              <ExpenseModalOverlay onMouseDown={(event) => { if (event.target === event.currentTarget) closeExpenseForm(); }}>
                <ExpenseForm ref={editDialogRef} id="expense-edit-dialog" $modal $wideModal={!editingExpense} role="dialog" aria-modal="true" aria-labelledby="expense-form-title" onSubmit={handleSubmit}>
                  {expenseFormContent}
                </ExpenseForm>
              </ExpenseModalOverlay>,
              document.body
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
                  <thead><tr><th>Date</th><th>Expense</th><th>Category</th><th>Notes</th><th>Amount</th><th>Paid from</th><th>Balance after</th><th aria-label="Actions" /></tr></thead>
                  <tbody>
                    {Object.entries(expensesByDate).map(([dateKey, dateExpenses]) => (
                      <React.Fragment key={dateKey}>
                        <tr className="date-group">
                          <td colSpan={8}>
                            <span>{new Intl.DateTimeFormat(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${dateKey}T00:00:00.000Z`))}</span>
                            <strong>Daily net · {formatMoney(dateExpenses.reduce((sum, expense) => sum + getNetAmount(expense), 0))}</strong>
                          </td>
                        </tr>
                        {dateExpenses.map((expense) => (
                          <tr key={expense._id}>
                            <td>{new Intl.DateTimeFormat(undefined, { day: "2-digit", month: "short", timeZone: "UTC" }).format(new Date(expense.date))}</td>
                            <td className="description">{expense.description}</td>
                            <td><CategoryTag>{expense.category || "Other"}</CategoryTag></td>
                            <td className="notes" title={expense.notes}>{expense.notes || "—"}</td>
                            <td className="amount">{formatMoney(expense.amount, expense.currency)}</td>
                            <td>{expense.account?.name || "—"}</td>
                            <td className="amount">{expense.balanceAfter == null ? "—" : formatMoney(expense.balanceAfter, expense.account?.currency || expense.currency)}</td>
                            <td className="actions">
                              <ActionGroup>
                                <RowAction type="button" onClick={(event) => openEditForm(expense, event)} aria-label={`Edit ${expense.description}`} title="Edit"><FaEdit /></RowAction>
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
                <PageInfo>Page {visibleExpensePage} of {expensePageCount} · {expenseTotal} expenses</PageInfo>
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
