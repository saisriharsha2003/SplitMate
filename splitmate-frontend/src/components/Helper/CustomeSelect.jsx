import React, { useState, useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { FaChevronDown } from "react-icons/fa";

const menuEnter = keyframes`
  from { opacity: 0; transform: translateY(-5px) scale(.985); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const DropdownWrapper = styled.div`
  z-index: ${(props) => (props.$isOpen ? 30 : 1)};
  flex: 1;
  min-width: 0;
  position: relative;
  width: 100%;
`;

const DropdownHeader = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 48px;
  padding: 0 4px;
  border: 0;
  outline: 0;
  background: transparent;
  cursor: pointer;
  color: ${(props) => (props.$hasValue ? "#f7f7f7" : "#858b90")};
  font: inherit;
  font-size: 0.96rem;
  text-align: left;
  transition: color 160ms ease;

  &:hover { color: #fff; }
  &:focus-visible { outline: 2px solid rgba(251, 204, 19, 0.55); outline-offset: -3px; border-radius: 8px; }

  .icon {
    flex-shrink: 0;
    margin-left: 10px;
    color: #d9b62f;
    font-size: 0.78rem;
    transition: transform 180ms ease;
    transform: ${(props) => (props.$isOpen ? "rotate(180deg)" : "rotate(0deg)")};
  }
`;

const DropdownList = styled.ul`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  margin: 0;
  padding: 6px;
  list-style: none;
  border: 1px solid rgba(251, 204, 19, 0.2);
  border-radius: 12px;
  background: linear-gradient(150deg, #252627, #191a1b);
  box-shadow: 0 18px 38px rgba(0, 0, 0, 0.55), 0 0 20px rgba(251, 204, 19, 0.08), inset 0 1px rgba(255,255,255,.035);
  max-height: 240px;
  overflow-y: auto;
  z-index: 40;
  animation: ${menuEnter} 150ms ease both;
  scrollbar-color: rgba(251, 204, 19, 0.35) rgba(255, 255, 255, 0.04);
  scrollbar-width: thin;

  &::-webkit-scrollbar { width: 7px; }
  &::-webkit-scrollbar-thumb { border-radius: 8px; background: rgba(251, 204, 19, 0.3); }
`;

const DropdownItem = styled.li``;

const DropdownOption = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 44px;
  padding: 8px 10px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: ${(props) => (props.$selected ? "rgba(251, 204, 19, 0.1)" : "transparent")};
  color: ${(props) => (props.$selected ? "#f4d65a" : "#e5e7e8")};
  font: inherit;
  font-size: 0.9rem;
  text-align: left;
  cursor: pointer;
  transition: background 140ms ease, border-color 140ms ease, color 140ms ease;

  &:hover, &:focus-visible { outline: none; border-color: rgba(251, 204, 19, 0.17); background: rgba(251, 204, 19, 0.09); color: #f4d65a; }
`;

const CustomSelect = ({ id, options, value, onChange, placeholder }) => {
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
    <DropdownWrapper ref={wrapperRef} $isOpen={isOpen}>
      <DropdownHeader
        type="button"
        id={id}
        $isOpen={isOpen}
        $hasValue={Boolean(value)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setIsOpen(false);
        }}
      >
        {value?.label || placeholder || "Select..."}
        <FaChevronDown className="icon" />
      </DropdownHeader>
      {isOpen && (
        <DropdownList role="listbox" aria-label="Choose who paid">
          {options.map((opt) => (
            <DropdownItem key={opt.value} role="option" aria-selected={value?.value === opt.value}>
              <DropdownOption type="button" $selected={value?.value === opt.value} onClick={() => handleSelect(opt)}>
                {opt.label}
              </DropdownOption>
            </DropdownItem>
          ))}
        </DropdownList>
      )}
    </DropdownWrapper>
  );
};

export default CustomSelect;
