import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { FaMoneyBillWave, FaUsers } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  Wrapper,
  Content,
  FormBox,
  Title,
  Form,
  Label,
  InputGroup,
  Input,
  SubmitButton,
} from "./AddExpenseStyle";
import CustomSelect from "../Helper/CustomeSelect";
import { BASE_URL } from "../config";

const AddExpense = ({ group, onAdded, onClose }) => {
  const [loading, setLoading] = useState(false);
  const username = localStorage.getItem("username");

  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    payer: group.members[0]?._id || "",
    participants: group.members.map((m) => m._id) || [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayerChange = (option) => {
    setFormData((prev) => ({ ...prev, payer: option.value }));
  };

  const handleParticipantsChange = (options) => {
    setFormData((prev) => ({
      ...prev,
      participants: options.map((opt) => opt.value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.payer) {
      toast.error("Please fill all required fields!");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${BASE_URL}/api/groups/${group._id}/expenses`,
        formData,
        { params: { username } }
      );
      toast.success("Expense added successfully!");
      onAdded(); 
      onClose(); 
    } catch (err) {
      toast.error(err.response?.data?.error || "Error adding expense");
    } finally {
      setLoading(false);
    }
  };

  const payerOptions = group.members.map((m) => ({
    value: m._id,
    label: m.user?.name || "Unknown",
  }));

  const participantOptions = group.members.map((m) => ({
    value: m._id,
    label: m.user?.name || "Unknown",
  }));

  const selectedPayer = payerOptions.find((p) => p.value === formData.payer);
  const selectedParticipants = participantOptions.filter((p) =>
    formData.participants.includes(p.value)
  );

  return (
    <Wrapper>
      <Content>
        <FormBox as={motion.div} initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
          <Title>Add Expense</Title>
          <Form onSubmit={handleSubmit}>
            <Label>Description</Label>
            <InputGroup>
              <FaMoneyBillWave className="icon" />
              <Input
                type="text"
                name="description"
                placeholder="Enter description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </InputGroup>

            <Label>Amount</Label>
            <InputGroup>
              <FaMoneyBillWave className="icon" />
              <Input
                type="number"
                name="amount"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </InputGroup>

            <Label>Payer</Label>
            <InputGroup>
              <FaUsers className="icon" />
              <CustomSelect
                options={payerOptions}
                value={selectedPayer}
                onChange={handlePayerChange}
                placeholder="Select payer"
              />
            </InputGroup>

            <Label>Participants</Label>
            <InputGroup>
              <FaUsers className="icon" />
              <CustomSelect
                options={participantOptions}
                value={selectedParticipants}
                onChange={handleParticipantsChange}
                isMulti
                placeholder="Select participants"
              />
            </InputGroup>

            <SubmitButton
              type="submit"
              disabled={loading}
              as={motion.button}
              whileHover={{ scale: 1.05 }}
            >
              {loading ? "Adding Expense..." : "Add Expense"}
            </SubmitButton>
          </Form>
        </FormBox>
      </Content>
    </Wrapper>
  );
};

export default AddExpense;
