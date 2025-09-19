import { useState } from "react";
import styled from "styled-components";

const DropdownWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const DropdownHeader = styled.div`
  padding: 12px;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DropdownList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  margin-top: 5px;
  list-style: none;
  padding: 0;
  max-height: 150px;
  overflow-y: auto;
  z-index: 100;
`;

const DropdownItem = styled.li`
  padding: 12px;
  cursor: pointer;
  color: #fff;

  &:hover {
    background: rgba(0, 230, 230, 0.3);
  }
`;

const CurrencyDropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const options = ["INR", "USD"];

  const handleSelect = (option) => {
    onChange(option);
    setOpen(false);
  };

  return (
    <DropdownWrapper>
      <DropdownHeader onClick={() => setOpen(!open)}>
        {value} <span>▼</span>
      </DropdownHeader>
      {open && (
        <DropdownList>
          {options.map((option) => (
            <DropdownItem key={option} onClick={() => handleSelect(option)}>
              {option}
            </DropdownItem>
          ))}
        </DropdownList>
      )}
    </DropdownWrapper>
  );
};

export default CurrencyDropdown;