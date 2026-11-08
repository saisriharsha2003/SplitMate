import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaCalendarAlt, FaMoneyBillWave, FaReceipt, FaUsers } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  Wrapper,
  Content,
  FormBox,
  FormHeader,
  HeaderCopy,
  Title,
  BackButton,
  Form,
  Field,
  Label,
  InputGroup,
  Input,
  ParticipantsPanel,
  ParticipantsHeader,
  ParticipantActions,
  SelectionButton,
  MemberGrid,
  MemberOption,
  MemberAvatar,
  MemberShareInput,
  MemberShareUnit,
  SplitModes,
  SplitModeButton,
  SplitPreview,
  SubmitButton,
  PageState,
} from "./AddExpenseStyle";
import CustomSelect from "../Helper/CustomeSelect";
import { BASE_URL } from "../config";
import Nav from "../Nav/Nav";
import Sidebar from "../Sidebar/Sidebar";

const AddExpense = ({ isEdit = false }) => {
  const { id: groupId, expenseId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [loading, setLoading] = useState(false);
  const today = new Date();
  const localDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date: localDate,
    payer: "",
    participants: [],
    splitMode: "equal",
    shares: {},
  });

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/user/groups/${groupId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const loadedGroup = response.data;
        const members = loadedGroup.members || [];
        const memberIds = members.map((member) => member.user?._id).filter(Boolean);
        const currentUsername = localStorage.getItem("username");
        const currentUserId = members.find(
          (member) => member.user?.username === currentUsername
        )?.user?._id;

        setGroup(loadedGroup);
        const existingExpense = isEdit
          ? loadedGroup.expenses?.find((expense) => expense._id === expenseId)
          : null;
        if (isEdit && !existingExpense) {
          setPageError("The expense could not be found in this group.");
          toast.error("Could not find this expense");
          return;
        }
        if (existingExpense) {
          const existingSplits = Array.isArray(existingExpense.splitAmong) ? existingExpense.splitAmong : [];
          const participants = existingSplits.map((split) => split.user?._id || split.user).filter(Boolean);
          const expenseDate = existingExpense.date ? new Date(existingExpense.date) : new Date();
          setFormData((current) => ({
            ...current,
            description: existingExpense.description || "",
            amount: String(existingExpense.amount ?? ""),
            date: Number.isNaN(expenseDate.getTime()) ? localDate : expenseDate.toISOString().slice(0, 10),
            payer: existingExpense.paidBy?._id || existingExpense.paidBy || currentUserId || memberIds[0] || "",
            participants,
            splitMode: existingExpense.splitType || "equal",
            shares: existingSplits.reduce((shares, split) => {
              const participantId = split.user?._id || split.user;
              const value = existingExpense.splitType === "percentage" ? split.percentage : split.shareAmount;
              return { ...shares, [participantId]: value === undefined ? "" : String(value) };
            }, {}),
          }));
        } else {
        setFormData((current) => ({
          ...current,
          payer: currentUserId || memberIds[0] || "",
          participants: memberIds,
          shares: memberIds.reduce((shares, memberId) => ({ ...shares, [memberId]: "" }), {}),
        }));
        }
      } catch (err) {
        const message = err.response?.data?.error || "Could not load this group";
        setPageError(message);
        toast.error(message);
      } finally {
        setPageLoading(false);
      }
    };

    if (groupId) fetchGroup();
  }, [expenseId, groupId, isEdit, localDate, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const toggleParticipant = (memberId) => {
    setFormData((current) => ({
      ...current,
      participants: current.participants.includes(memberId)
        ? current.participants.filter((id) => id !== memberId)
        : [...current.participants, memberId],
      shares: current.participants.includes(memberId)
        ? Object.fromEntries(Object.entries(current.shares).filter(([id]) => id !== memberId))
        : { ...current.shares, [memberId]: "" },
    }));
  };

  const members = (group?.members || []).filter((member) => member.user?._id);
  const amount = Number(formData.amount);
  const validAmount = Number.isFinite(amount) && amount > 0;
  const totalCents = validAmount ? Math.round(amount * 100) : 0;
  const baseShareCents = formData.participants.length
    ? Math.floor(totalCents / formData.participants.length)
    : 0;
  const extraCents = formData.participants.length
    ? totalCents % formData.participants.length
    : 0;
  const formatCurrency = (value) => new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: group?.currency || "INR",
  }).format(value);
  const selectedCount = formData.participants.length;
  const smallestShare = selectedCount ? baseShareCents / 100 : 0;
  const largestShare = selectedCount ? (baseShareCents + (extraCents ? 1 : 0)) / 100 : 0;
  const customShareCents = formData.participants.reduce((sum, memberId) => {
    const value = Number(formData.shares[memberId]);
    return sum + (Number.isFinite(value) && value >= 0 ? Math.round(value * 100) : 0);
  }, 0);
  const percentageTotalBasisPoints = formData.participants.reduce((sum, memberId) => {
    const value = Number(formData.shares[memberId]);
    return sum + (Number.isFinite(value) && value >= 0 ? Math.round(value * 100) : 0);
  }, 0);
  const allocatedCents = formData.splitMode === "amount" ? customShareCents : totalCents;
  const remainingCents = totalCents - allocatedCents;
  const remainingPercentageBasisPoints = 10000 - percentageTotalBasisPoints;
  const splitIsValid = formData.splitMode === "equal" || (
    validAmount && (formData.splitMode === "percentage"
      ? remainingPercentageBasisPoints === 0
      : remainingCents === 0)
  );

  const setSplitMode = (mode) => {
    setFormData((current) => ({
      ...current,
      splitMode: mode,
      shares: mode === "equal"
        ? {}
        : current.participants.reduce((shares, memberId) => ({ ...shares, [memberId]: "" }), {}),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.description.trim() || !validAmount || !formData.payer) {
      toast.error("Add a description, a valid amount, and choose who paid");
      return;
    }
    if (!selectedCount) {
      toast.error("Choose at least one person to split this expense with");
      return;
    }
    if (!splitIsValid) {
      if (formData.splitMode === "percentage") {
        toast.error("Participant percentages must add up to 100%");
      } else {
        toast.error(remainingCents > 0
          ? "The participant shares must add up to the full expense amount"
          : "The participant shares are greater than the expense amount");
      }
      return;
    }

    setLoading(true);
    try {
      const payload = {
        description: formData.description.trim(),
        amount: totalCents / 100,
        date: formData.date,
        payer: formData.payer,
        participants: formData.participants,
        splitType: formData.splitMode,
        ...(formData.splitMode === "percentage" && {
          shares: formData.participants.map((userId) => ({
            userId,
            percentage: Number(formData.shares[userId] || 0),
          })),
        }),
        ...(formData.splitMode === "amount" && {
          shares: formData.participants.map((userId) => ({
            userId,
            shareAmount: Number(formData.shares[userId] || 0),
          })),
        }),
      };
      const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
      if (isEdit) {
        await axios.put(`${BASE_URL}/api/user/groups/${group._id}/expenses/${expenseId}`, payload, { headers });
        toast.success("Expense updated successfully");
        navigate(`/groups/${groupId}/expenses/${expenseId}`);
      } else {
        await axios.post(`${BASE_URL}/api/user/groups/${group._id}/expenses`, payload, { headers });
        toast.success("Expense added and split successfully");
        navigate(`/groups/${groupId}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Could not add this expense");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading || !group || (isEdit && pageError)) {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Nav toggleSidebar={() => setIsSidebarOpen((open) => !open)} />
        <Wrapper>
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          <Content isOpen={isSidebarOpen}>
            <PageState>
              {pageLoading ? "Loading group members…" : pageError || "Could not load this group."}
              <button type="button" onClick={() => navigate(`/groups/${groupId}`)}>Back to group</button>
            </PageState>
          </Content>
        </Wrapper>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Nav toggleSidebar={() => setIsSidebarOpen((open) => !open)} />
      <Wrapper>
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <Content isOpen={isSidebarOpen}>
          <FormBox>
            <FormHeader>
              <HeaderCopy>
                <small>{isEdit ? "EDIT GROUP EXPENSE" : "GROUP EXPENSE"}</small>
                <Title>{isEdit ? "Edit expense" : "Add an expense"} <span>to {group.name}</span></Title>
                <p>Choose who paid and exactly who should share the cost.</p>
              </HeaderCopy>
              <BackButton type="button" onClick={() => navigate(isEdit ? `/groups/${groupId}/expenses/${expenseId}` : `/groups/${groupId}`)}>
                <FaArrowLeft /> Back to group
              </BackButton>
            </FormHeader>

            <Form onSubmit={handleSubmit}>
              <Field>
                <Label htmlFor="expense-description">What was it for?</Label>
                <InputGroup>
                  <FaReceipt className="icon" />
                  <Input
                    id="expense-description"
                    type="text"
                    name="description"
                    placeholder="e.g. Dinner, groceries, weekend trip"
                    value={formData.description}
                    onChange={handleChange}
                    maxLength={120}
                    required
                  />
                </InputGroup>
              </Field>

              <Field>
                <Label htmlFor="expense-amount">Total amount</Label>
                <InputGroup>
                  <FaMoneyBillWave className="icon" />
                  <Input
                    id="expense-amount"
                    type="number"
                    name="amount"
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                  />
                </InputGroup>
              </Field>

              <Field>
                <Label htmlFor="expense-payer">Who paid?</Label>
                <InputGroup>
                  <FaUsers className="icon" />
                  <CustomSelect
                    id="expense-payer"
                    options={members.map(({ user }) => ({ value: user._id, label: user.name || "Unknown member" }))}
                    value={members
                      .map(({ user }) => ({ value: user._id, label: user.name || "Unknown member" }))
                      .find((option) => option.value === formData.payer)}
                    onChange={(option) => setFormData((current) => ({ ...current, payer: option.value }))}
                    placeholder="Select who paid"
                  />
                </InputGroup>
              </Field>

              <Field>
                <Label htmlFor="expense-date">Expense date</Label>
                <InputGroup>
                  <FaCalendarAlt className="icon" />
                  <Input
                    id="expense-date"
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </InputGroup>
              </Field>

              <ParticipantsPanel>
                <ParticipantsHeader>
                  <div>
                    <Label>Split with</Label>
                    <p>
                      {formData.splitMode === "equal"
                        ? "Select everyone who should share this expense."
                        : formData.splitMode === "percentage"
                          ? "Enter a percentage beside each selected person. The total must be 100%."
                          : "Enter a custom amount beside each selected person. The amounts must match the total."}
                    </p>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
                    <SplitModes aria-label="Split type">
                      <SplitModeButton type="button" $active={formData.splitMode === "equal"} onClick={() => setSplitMode("equal")}>
                        Equally
                      </SplitModeButton>
                      <SplitModeButton type="button" $active={formData.splitMode === "percentage"} onClick={() => setSplitMode("percentage")}>
                        By percentage
                      </SplitModeButton>
                      <SplitModeButton type="button" $active={formData.splitMode === "amount"} onClick={() => setSplitMode("amount")}>
                        Custom amount
                      </SplitModeButton>
                    </SplitModes>
                    <ParticipantActions>
                      <SelectionButton
                        type="button"
                        onClick={() => setFormData((current) => ({
                          ...current,
                          participants: members.map(({ user }) => user._id),
                          shares: members.reduce((shares, { user }) => ({ ...shares, [user._id]: current.shares[user._id] ?? "" }), {}),
                        }))}
                      >Select all</SelectionButton>
                      <SelectionButton
                        type="button"
                        onClick={() => setFormData((current) => ({ ...current, participants: [], shares: {} }))}
                      >Clear</SelectionButton>
                    </ParticipantActions>
                  </div>
                </ParticipantsHeader>
                <MemberGrid>
                  {members.map(({ user }) => {
                    const selected = formData.participants.includes(user._id);
                    return (
                      <MemberOption as="div" key={user._id} $selected={selected}>
                        <input
                          type="checkbox"
                          aria-label={`Include ${user.name || "this member"} in the split`}
                          checked={selected}
                          onChange={() => toggleParticipant(user._id)}
                        />
                        <MemberAvatar aria-hidden="true">{user.name?.charAt(0) || "?"}</MemberAvatar>
                        <span>{user.name || "Unknown"}</span>
                        {selected && formData.splitMode !== "equal" && (
                          <div style={{ display: "flex", alignItems: "center", gap: "5px", marginLeft: "auto" }}>
                            <MemberShareInput
                              type="number"
                              min="0"
                              max={formData.splitMode === "percentage" ? "100" : undefined}
                              step="0.01"
                              placeholder="0.00"
                              aria-label={`${user.name || "Member"}'s ${formData.splitMode === "percentage" ? "percentage" : "share amount"}`}
                              value={formData.shares[user._id] ?? "0.00"}
                              onChange={(event) => setFormData((current) => ({
                                ...current,
                                shares: { ...current.shares, [user._id]: event.target.value },
                              }))}
                            />
                            <MemberShareUnit>{formData.splitMode === "percentage" ? "%" : group.currency}</MemberShareUnit>
                          </div>
                        )}
                      </MemberOption>
                    );
                  })}
                </MemberGrid>
              </ParticipantsPanel>

              <SplitPreview aria-live="polite">
                <span>
                  {selectedCount === 0
                    ? "Select at least one person to see the split"
                    : formData.splitMode === "equal"
                      ? `Split equally across ${selectedCount} ${selectedCount === 1 ? "person" : "people"}`
                      : formData.splitMode === "percentage"
                        ? `Percentage assigned: ${(percentageTotalBasisPoints / 100).toFixed(2)}% of 100%`
                        : `Custom amounts allocated: ${formatCurrency(allocatedCents / 100)}`}
                </span>
                {formData.splitMode === "equal" && selectedCount > 0 && validAmount && (
                  <strong>
                    {extraCents && smallestShare !== largestShare
                      ? `${formatCurrency(smallestShare)}–${formatCurrency(largestShare)} per person`
                      : `${formatCurrency(largestShare)} per person`}
                  </strong>
                )}
                {formData.splitMode === "amount" && selectedCount > 0 && validAmount && (
                  <strong>
                    {remainingCents === 0
                      ? "Fully allocated"
                      : `${formatCurrency(Math.abs(remainingCents) / 100)} ${remainingCents > 0 ? "remaining" : "over"}`}
                  </strong>
                )}
                {formData.splitMode === "percentage" && selectedCount > 0 && (
                  <strong>
                    {remainingPercentageBasisPoints === 0
                      ? "Fully allocated"
                      : `${(Math.abs(remainingPercentageBasisPoints) / 100).toFixed(2)}% ${remainingPercentageBasisPoints > 0 ? "remaining" : "over"}`}
                  </strong>
                )}
              </SplitPreview>

              <SubmitButton type="submit" disabled={loading || !members.length || !selectedCount || !splitIsValid}>
                <FaMoneyBillWave />
                {loading ? (isEdit ? "Saving changes…" : "Saving expense…") : (isEdit ? "Save changes" : "Add expense")}
              </SubmitButton>
            </Form>
          </FormBox>
        </Content>
      </Wrapper>
    </div>
  );
};

export default AddExpense;
