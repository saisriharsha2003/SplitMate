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
  MonthSheet, SheetHeader, MonthTitle, MonthTotal, AddButton, ExpenseForm, ExpenseModalOverlay, FormTitle, FormEyebrow, FormDescription, FormHeading, FormCloseButton, FormGrid,
  Field, Label, Input, DropdownFrame, FormActions, SecondaryButton, PrimaryButton, SheetTableWrap, SheetTable,
  CategoryTag, EmptyState, LoadingState, RowAction, TablePagination, PageControl, PageInfo, ActionGroup,
} from "./ExpenseTrackerStyle";

const getToday = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
const getCurrentTime = () => {
  const date = new Date();
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
};
const getCurrentMonth = () => getToday().slice(0, 7);
const CATEGORIES = [
  "Online Order", "Rapido", "Swiggy", "Zomato", "Groceries", "Food & Dining",
  "Transport", "Auto / Taxi", "Fuel", "Shopping", "Cashback", "Salary", "Bills & Utilities", "Rent",
  "Health & Medical", "EMI", "Entertainment", "Travel", "Education", "Personal Care",
  "Subscriptions", "Gifts", "Home", "Other",
];
const blankForm = (currency) => ({
  description: "", direction: "debit", amount: "", date: getToday(), time: getCurrentTime(), category: "Other", customCategory: "", notes: "", currency, accountId: "", transferAccountId: "",
});
const TRANSACTION_DIRECTIONS = [
  { value: "debit", label: "Debit · expense" },
  { value: "credit", label: "Credit · income or refund" },
  { value: "transfer", label: "Transfer · between accounts" },
];
const getDirection = (transaction) => transaction.direction
  || (["cashback", "salary"].includes(transaction.category?.trim().toLowerCase()) ? "credit" : "debit");

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
      setError(requestError.response?.data?.error || "Could not load your personal transactions.");
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
  const getNetAmount = (transaction) => {
    const direction = getDirection(transaction);
    if (direction === "transfer") return 0;
    if (direction === "debit") return Number(transaction.amount || 0);
    return transaction.category?.trim().toLowerCase() === "salary" ? 0 : -Number(transaction.amount || 0);
  };
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
      toast.error("Your accounts could not be loaded. Please try again before adding a transaction.");
      return;
    }
    if (!accounts.length) {
      toast.info("Add an account before recording a transaction. You can open Accounts from the sidebar.");
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
      direction: getDirection(expense),
      amount: String(expense.amount ?? ""),
      date: new Date(expense.date).toISOString().slice(0, 10),
      time: expense.time || "00:00",
      category: expense.direction === "transfer" ? "Transfer" : CATEGORIES.includes(expense.category) ? expense.category : "Other",
      customCategory: expense.direction === "transfer" || CATEGORIES.includes(expense.category) ? "" : expense.category || "",
      notes: expense.notes || "",
      currency: expense.account?.currency || expense.currency || currency,
      accountId: expense.account?._id || expense.account || "",
      transferAccountId: expense.transferAccount?._id || expense.transferAccount || "",
    });
    setFormOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const amount = Number(form.amount);
    if (!form.description.trim() || !Number.isFinite(amount) || amount <= 0 || !form.date) {
      toast.error("Enter a transaction description, a valid amount, and a date");
      return;
    }
    if (!form.accountId) {
      toast.error("Choose an account for this transaction");
      return;
    }
    if (form.direction === "transfer" && (!form.transferAccountId || form.transferAccountId === form.accountId)) {
      toast.error("Choose a different destination account for this transfer");
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      description: form.description.trim(),
      amount,
      category: form.direction === "transfer" ? "Transfer" : form.category === "Other" && form.customCategory.trim() ? form.customCategory.trim() : form.category,
    };
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
      if (editingExpense) {
        await axios.put(`${BASE_URL}/api/user/personal-expenses/${editingExpense._id}`, payload, { headers });
        toast.success("Transaction updated");
      } else {
        await axios.post(`${BASE_URL}/api/user/personal-expenses`, payload, { headers });
        toast.success("Transaction added");
      }
      setSelectedMonth(form.date.slice(0, 7));
      setExpensePage(1);
      setFormOpen(false);
      setEditingExpense(null);
      await fetchExpenses(form.date.slice(0, 7), 1);
      await fetchAccounts();
    } catch (requestError) {
      toast.error(requestError.response?.data?.error || "Could not save this transaction");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (expense) => {
    if (!window.confirm(`Delete “${expense.description}” from your personal transaction history?`)) return;
    try {
      await axios.delete(`${BASE_URL}/api/user/personal-expenses/${expense._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      await fetchAccounts();
      const nextPage = expenses.length === 1 && expensePage > 1 ? expensePage - 1 : expensePage;
      if (nextPage !== expensePage) setExpensePage(nextPage);
      await fetchExpenses(selectedMonth, nextPage);
      toast.success("Transaction deleted");
    } catch (requestError) {
      toast.error(requestError.response?.data?.error || "Could not delete this transaction");
    }
  };

  const closeExpenseForm = () => {
    setFormOpen(false);
    setEditingExpense(null);
  };

  const expenseFormContent = (
    <>
      <FormHeading>
        <div>
          <FormEyebrow>Expense tracker</FormEyebrow>
          <FormTitle id="expense-form-title">{editingExpense ? "Edit transaction" : `Add transaction to ${formatMonth(selectedMonth)}`}</FormTitle>
          <FormDescription>{editingExpense ? "Update the transaction details and account activity." : "Record an expense, income, or transfer in your personal ledger."}</FormDescription>
        </div>
        <FormCloseButton type="button" onClick={closeExpenseForm} aria-label="Close transaction dialog"><FaTimes /></FormCloseButton>
      </FormHeading>
      <FormGrid>
        <Field $spanTwo>
          <Label htmlFor="personal-description">Description</Label>
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
        <Field>
          <Label htmlFor="personal-time">Time</Label>
          <Input id="personal-time" type="time" value={form.time} onChange={(event) => setForm({ ...form, time: event.target.value })} required />
        </Field>
        <Field $spanTwo>
          <Label>{form.direction === "transfer" ? "From account" : "Paid from account"}</Label>
          <DropdownFrame>
            <CustomSelect id="personal-account" ariaLabel="Paid from account" placeholder="Select an account" options={accountOptions} value={accountOptions.find((option) => option.value === form.accountId)} onChange={(option) => {
              const account = accounts.find((item) => item._id === option.value);
              const nextCurrency = account?.currency || form.currency;
              const selectedDestination = accounts.find((item) => item._id === form.transferAccountId);
              setForm({ ...form, accountId: option.value, currency: nextCurrency,
                transferAccountId: option.value === form.transferAccountId || selectedDestination?.currency !== nextCurrency ? "" : form.transferAccountId });
            }} />
          </DropdownFrame>
        </Field>
        {form.direction === "transfer" && <Field $spanTwo>
          <Label>To account</Label>
          <DropdownFrame>
            <CustomSelect id="personal-transfer-account" ariaLabel="Destination account" placeholder="Select destination account"
              options={accountOptions.filter((option) => {
                const destination = accounts.find((account) => account._id === option.value);
                return option.value !== form.accountId && destination?.currency === form.currency;
              })}
              value={accountOptions.find((option) => option.value === form.transferAccountId)}
              onChange={(option) => setForm({ ...form, transferAccountId: option.value })} />
          </DropdownFrame>
        </Field>}
        {form.direction !== "transfer" && <Field>
          <Label>Category</Label>
          <DropdownFrame>
            <CustomSelect id="personal-category" ariaLabel="Category" options={CATEGORIES.map((category) => ({ value: category, label: category }))} value={{ value: form.category, label: form.category }} onChange={(option) => setForm({ ...form, category: option.value, direction: ["Cashback", "Salary"].includes(option.value) ? "credit" : form.direction })} />
          </DropdownFrame>
        </Field>}
        <Field>
          <Label>Type</Label>
          <DropdownFrame>
            <CustomSelect id="personal-direction" ariaLabel="Transaction type" options={TRANSACTION_DIRECTIONS} value={TRANSACTION_DIRECTIONS.find((direction) => direction.value === form.direction) || TRANSACTION_DIRECTIONS[0]} onChange={(option) => setForm({ ...form, direction: option.value, category: option.value === "transfer" ? "Transfer" : form.category === "Transfer" ? "Other" : form.category, transferAccountId: option.value === "transfer" ? "" : form.transferAccountId })} />
          </DropdownFrame>
        </Field>
        {form.direction !== "transfer" && form.category === "Other" && (
          <Field $spanTwo>
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
              <HeaderDescription>Your private transaction ledger, organized into monthly sheets.</HeaderDescription>
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
                <p>{monthExpenses.length} {monthExpenses.length === 1 ? "transaction" : "transactions"} on this page</p>
              </div>
              <MonthTotal>{monthTotal}<span>NET MONTHLY SPEND · CREDITS OFFSET · SALARY & TRANSFERS EXCLUDED · {expenseTotal} TRANSACTIONS</span></MonthTotal>
              <AddButton type="button" disabled={!formOpen && accountsLoading} onClick={formOpen ? closeExpenseForm : openAddForm}>
                {formOpen ? <FaTimes /> : <FaPlus />}{formOpen ? "Close" : accountsLoading ? "Loading accounts…" : "Add transaction"}
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
              <LoadingState>Loading your personal transactions…</LoadingState>
            ) : error ? (
              <EmptyState role="alert">{error}</EmptyState>
            ) : monthExpenses.length === 0 ? (
              <EmptyState>
                <FaReceipt />
                <strong>This month is ready for your transactions</strong>
                <span>Add your personal debits and credits here. These transactions stay separate from group balances.</span>
              </EmptyState>
            ) : (
              <SheetTableWrap>
                <SheetTable>
                  <thead><tr><th>Date</th><th>Transaction</th><th>Category</th><th>Notes</th><th>Amount</th><th>Paid from</th><th>Balance after</th><th aria-label="Actions" /></tr></thead>
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
                            <td>{new Intl.DateTimeFormat(undefined, { day: "2-digit", month: "short", timeZone: "UTC" }).format(new Date(expense.date))}<small className="transaction-time">{expense.time || "00:00"}</small></td>
                            <td className="description">{expense.description}</td>
                            <td><CategoryTag>{getDirection(expense) === "transfer" ? "Transfer" : expense.category || "Other"}</CategoryTag></td>
                            <td className="notes" title={expense.notes}>{expense.notes || "—"}</td>
                            <td className={`amount ${getDirection(expense)}`}>{getDirection(expense) === "transfer" ? "↔ " : getDirection(expense) === "credit" ? "+" : "−"}{formatMoney(expense.amount, expense.currency)}</td>
                            <td>{getDirection(expense) === "transfer" ? `${expense.account?.name || "Account"} → ${expense.transferAccount?.name || "Account"}` : expense.account?.name || "—"}</td>
                            <td className="amount">{getDirection(expense) === "transfer"
                              ? `From ${expense.balanceAfter == null ? "—" : formatMoney(expense.balanceAfter, expense.account?.currency || expense.currency)} · To ${expense.transferBalanceAfter == null ? "—" : formatMoney(expense.transferBalanceAfter, expense.transferAccount?.currency || expense.currency)}`
                              : expense.balanceAfter == null ? "—" : formatMoney(expense.balanceAfter, expense.account?.currency || expense.currency)}</td>
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
              <TablePagination aria-label="Personal transaction pages">
                <PageControl type="button" onClick={() => setExpensePage(visibleExpensePage - 1)} disabled={visibleExpensePage === 1}>Previous</PageControl>
                <PageInfo>Page {visibleExpensePage} of {expensePageCount} · {expenseTotal} transactions</PageInfo>
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
