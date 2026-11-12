import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCreditCard, FaPlus, FaTimes, FaTrash, FaUniversity, FaWallet } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import Nav from "../Nav/Nav";
import Sidebar from "../Sidebar/Sidebar";
import CustomSelect from "../Helper/CustomeSelect";
import { BASE_URL } from "../config";
import {
  AccountCard, AccountGrid, AccountName, AccountNameRow, AccountTop, AccountType, AddAccountButton, AccountModalOverlay, AccountModal, ModalHeading, ModalTitle, ModalClose, ModalActions, CancelButton, HeaderActions,
  Balance, BalanceLabel, Control, Description, EmptyState, Eyebrow, Field, FormGrid, Header,
  History, HistoryPagination, HistoryPageButton, HistoryPageInfo, HistoryRow, HistoryTitle, LinkButton, Page, PageInner, Panel, PanelTitle, SelectFrame, Title,
} from "./AccountsStyle";

const ACCOUNT_TYPES = [
  { value: "bank", label: "Bank account" },
  { value: "credit_card", label: "Credit card" },
  { value: "upi_lite", label: "UPI Lite" },
  { value: "custom", label: "Custom type" },
];
const CURRENCIES = ["INR", "USD", "EUR", "GBP"].map((currency) => ({ value: currency, label: currency }));
const HISTORY_PAGE_SIZE = 4;
const initialAccountForm = () => ({ name: "", type: "bank", customTypeName: "", currency: "INR", openingBalance: "" });
const Accounts = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [accountForm, setAccountForm] = useState(initialAccountForm);
  const [historyPages, setHistoryPages] = useState({});
  const accountDialogRef = useRef(null);
  const accountModalTriggerRef = useRef(null);
  const navigate = useNavigate();

  const closeAccountModal = useCallback(() => {
    setAccountModalOpen(false);
    setAccountForm(initialAccountForm());
  }, []);

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${BASE_URL}/api/user/accounts`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAccounts(response.data.accounts || []);
    } catch (requestError) {
      setError(requestError.response?.data?.error || "Could not load your accounts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAccounts(); }, [fetchAccounts]);
  useEffect(() => {
    if (!accountModalOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = accountModalTriggerRef.current || document.activeElement;
    document.body.style.overflow = "hidden";
    const handleDialogKeys = (event) => {
      if (event.key === "Escape") {
        closeAccountModal();
        return;
      }
      if (event.key === "Tab") {
        const focusable = [...(accountDialogRef.current?.querySelectorAll(
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
      accountModalTriggerRef.current = null;
    };
  }, [accountModalOpen, closeAccountModal]);

  const formatMoney = (amount, currency) => {
    try {
      return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(Number(amount || 0));
    } catch {
      return `${currency} ${Number(amount || 0).toFixed(2)}`;
    }
  };

  const handleCreateAccount = async (event) => {
    event.preventDefault();
    if (!accountForm.name.trim() || accountForm.openingBalance === "" || Number(accountForm.openingBalance) < 0
      || (accountForm.type === "custom" && !accountForm.customTypeName.trim())) {
      toast.error(accountForm.type === "custom" && !accountForm.customTypeName.trim()
        ? "Enter a custom account type"
        : "Enter an account name and a valid opening balance");
      return;
    }
    setSaving(true);
    try {
      await axios.post(`${BASE_URL}/api/user/accounts`, {
        ...accountForm,
        name: accountForm.name.trim(),
        type: accountForm.type === "custom" ? "other" : accountForm.type,
        customTypeName: accountForm.type === "custom" ? accountForm.customTypeName.trim() : "",
        openingBalance: Number(accountForm.openingBalance),
      }, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      setAccountForm(initialAccountForm());
      setAccountModalOpen(false);
      await fetchAccounts();
      toast.success("Account added");
    } catch (requestError) {
      toast.error(requestError.response?.data?.error || "Could not add this account");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (account) => {
    if (!window.confirm(`Delete ${account.name}? Accounts with transaction history cannot be deleted.`)) return;
    try {
      await axios.delete(`${BASE_URL}/api/user/accounts/${account._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      await fetchAccounts();
      toast.success("Account deleted");
    } catch (requestError) {
      toast.error(requestError.response?.data?.error || "Could not delete this account");
    }
  };

  return (
    <>
      <Nav toggleSidebar={() => setIsSidebarOpen((open) => !open)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <Page $sidebarOpen={isSidebarOpen}>
        <PageInner>
          <Header>
            <div>
              <Eyebrow>Expense tracker</Eyebrow>
              <Title>Accounts</Title>
              <Description>Manage balances for your bank accounts, credit cards, and UPI Lite.</Description>
            </div>
            <HeaderActions>
              <AddAccountButton type="button" onClick={(event) => { accountModalTriggerRef.current = event.currentTarget; setAccountModalOpen(true); }}><FaPlus /> Add account</AddAccountButton>
              <LinkButton type="button" onClick={() => navigate("/expense-tracker")}><FaArrowLeft /> &nbsp;Back to expenses</LinkButton>
            </HeaderActions>
          </Header>

          <Panel>
            <PanelTitle>Your accounts</PanelTitle>
            {loading ? <EmptyState>Loading accounts…</EmptyState> : error ? <EmptyState role="alert">{error} <button type="button" onClick={fetchAccounts}>Try again</button></EmptyState> : accounts.length === 0 ? (
              <EmptyState>Use Add account above to create your first account. You’ll select it when recording a personal expense.</EmptyState>
            ) : (
              <AccountGrid>
                {accounts.map((account) => {
                  const accountType = ACCOUNT_TYPES.find((item) => item.value === account.type);
                  const Icon = account.type === "credit_card" ? FaCreditCard : account.type === "upi_lite" ? FaWallet : FaUniversity;
                  const accountTypeLabel = account.type === "other" ? (account.customTypeName || "Other") : (accountType?.label || account.type);
                  const historyPageCount = Math.max(1, Math.ceil(account.history.length / HISTORY_PAGE_SIZE));
                  const historyPage = Math.min(historyPages[account._id] || 1, historyPageCount);
                  const visibleHistory = account.history.slice((historyPage - 1) * HISTORY_PAGE_SIZE, historyPage * HISTORY_PAGE_SIZE);
                  return (
                    <AccountCard key={account._id}>
                      <AccountTop>
                        <AccountNameRow>
                          <div><AccountName><Icon aria-hidden="true" />{account.name}</AccountName><AccountType>{accountTypeLabel} · {account.currency}</AccountType></div>
                          <LinkButton type="button" onClick={() => handleDelete(account)} title="Delete account"><FaTrash /></LinkButton>
                        </AccountNameRow>
                        <BalanceLabel>{account.type === "credit_card" ? "Amount owed" : "Available balance"}</BalanceLabel>
                        <Balance $negative={Number(account.currentBalance) < 0}>{formatMoney(account.currentBalance, account.currency)}</Balance>
                      </AccountTop>
                      <History>
                        <HistoryTitle>Recent activity</HistoryTitle>
                        {account.history.length ? <>
                          {visibleHistory.map((item) => (
                            <HistoryRow key={`${item.kind}-${item._id}`} $credit={item.direction === "credit"}>
                              <strong>{item.description}</strong>
                              <span>{account.type === "credit_card" ? (item.direction === "credit" ? "−" : "+") : (item.direction === "credit" ? "+" : "−")}{formatMoney(item.amount, account.currency)}</span>
                              <small>{new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeZone: "UTC" }).format(new Date(item.date))} · {item.time || "00:00"}</small>
                              <small>Balance after · {formatMoney(item.balanceAfter, account.currency)}</small>
                            </HistoryRow>
                          ))}
                          {historyPageCount > 1 && <HistoryPagination aria-label={`${account.name} activity pages`}>
                            <HistoryPageButton type="button" onClick={() => setHistoryPages((current) => ({ ...current, [account._id]: historyPage - 1 }))} disabled={historyPage === 1}>Previous</HistoryPageButton>
                            <HistoryPageInfo>{historyPage} / {historyPageCount}</HistoryPageInfo>
                            <HistoryPageButton type="button" onClick={() => setHistoryPages((current) => ({ ...current, [account._id]: historyPage + 1 }))} disabled={historyPage === historyPageCount}>Next</HistoryPageButton>
                          </HistoryPagination>}
                        </> : <Description>No transactions yet. Opening balance: {formatMoney(account.openingBalance, account.currency)}</Description>}
                      </History>
                    </AccountCard>
                  );
                })}
              </AccountGrid>
            )}
          </Panel>
        </PageInner>
      </Page>
      {accountModalOpen && createPortal(
        <AccountModalOverlay onMouseDown={(event) => { if (event.target === event.currentTarget) closeAccountModal(); }}>
          <AccountModal ref={accountDialogRef} role="dialog" aria-modal="true" aria-labelledby="add-account-title">
            <ModalHeading>
              <div>
                <Eyebrow>Expense tracker</Eyebrow>
                <ModalTitle id="add-account-title">Add an account</ModalTitle>
                <Description>Add a bank account, credit card, UPI Lite, or a custom account.</Description>
              </div>
              <ModalClose type="button" onClick={closeAccountModal} aria-label="Close add account dialog"><FaTimes /></ModalClose>
            </ModalHeading>
            <form onSubmit={handleCreateAccount}>
              <FormGrid>
                <Field $wide>Account name<Control autoFocus value={accountForm.name} maxLength={60} onChange={(event) => setAccountForm({ ...accountForm, name: event.target.value })} placeholder="e.g. Main savings" required /></Field>
                <Field as="div">
                  <span>Type</span>
                  <SelectFrame>
                    <CustomSelect
                      id="account-type"
                      ariaLabel="Account type"
                      options={ACCOUNT_TYPES}
                      value={ACCOUNT_TYPES.find((type) => type.value === accountForm.type)}
                      onChange={(option) => setAccountForm((current) => ({ ...current, type: option.value }))}
                      placeholder="Choose account type"
                    />
                  </SelectFrame>
                </Field>
                {accountForm.type === "custom" && <Field>Custom type name<Control value={accountForm.customTypeName} maxLength={40} onChange={(event) => setAccountForm({ ...accountForm, customTypeName: event.target.value })} placeholder="e.g. Cash wallet" required /></Field>}
                <Field as="div">
                  <span>Currency</span>
                  <SelectFrame>
                    <CustomSelect ariaLabel="Account currency" options={CURRENCIES} value={CURRENCIES.find((currency) => currency.value === accountForm.currency)} onChange={(option) => setAccountForm((current) => ({ ...current, currency: option.value }))} />
                  </SelectFrame>
                </Field>
                <Field>{accountForm.type === "credit_card" ? "Opening amount owed" : "Opening balance"}<Control type="number" min="0" step="0.01" value={accountForm.openingBalance} onChange={(event) => setAccountForm({ ...accountForm, openingBalance: event.target.value })} placeholder="0.00" required /></Field>
              </FormGrid>
              <ModalActions>
                <CancelButton type="button" onClick={closeAccountModal}>Cancel</CancelButton>
                <PrimaryButton type="submit" disabled={saving}>{saving ? "Saving…" : "Add account"}</PrimaryButton>
              </ModalActions>
            </form>
          </AccountModal>
        </AccountModalOverlay>,
        document.body
      )}
    </>
  );
};

export default Accounts;
