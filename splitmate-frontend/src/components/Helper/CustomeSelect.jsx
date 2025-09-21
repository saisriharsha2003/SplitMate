import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { FaChevronDown } from "react-icons/fa";

// Wrapper
const DropdownWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const DropdownHeader = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isOpen"
})`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  color: white;
  font-size: 16px;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.03);
  }

  .icon {
    color: #00e6e6;
    transition: transform 0.3s;
    transform: ${(props) => (props.isOpen ? "rotate(180deg)" : "rotate(0deg)")};
  }
`;

const DropdownList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin: 12px 0 0 0;
  padding: 0;
  list-style: none;
  background: rgb(26, 26, 26);
  border-radius: 8px;
  box-shadow: 0 0 10px #00e6e6;
  max-height: 200px;
  overflow-y: auto;
  z-index: 100;
`;

// Individual item
const DropdownItem = styled.li`
  padding: 10px 12px;
  cursor: pointer;
  color: white;
  transition: background 0.2s ease-in-out;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const CustomSelect = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <DropdownWrapper ref={wrapperRef}>
      <DropdownHeader isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
        {value?.label || placeholder || "Select..."}
        <FaChevronDown className="icon" />
      </DropdownHeader>
      {isOpen && (
        <DropdownList>
          {options.map((opt) => (
            <DropdownItem key={opt.value} onClick={() => handleSelect(opt)}>
              {opt.label}
            </DropdownItem>
          ))}
        </DropdownList>
      )}
    </DropdownWrapper>
  );
};

export default CustomSelect;
