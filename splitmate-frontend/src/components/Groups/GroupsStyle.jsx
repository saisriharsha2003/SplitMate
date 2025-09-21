import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
`;

export const Content = styled.div`
  flex: 1;
  padding: 20px;
  background: #00000;
  min-height: 100vh;
  transition: margin 0.3s ease;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  margin-top: 20px;

  h1 {
    font-size: 1.8rem;
    color: #00e6e6;
    font-weight: 600;
  }
`;

export const AddButton = styled.button`
  background: #00e6e6;
  color: #fff;
  border: none;
  padding: 10px 14px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;

  &:hover {
    background: #1ddbd1;
  }
`;

export const GroupsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const GroupCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(26, 26, 26);
  padding: 14px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`;

export const GroupInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const GroupName = styled.span`
  font-weight: 600;
  font-size: 1.1rem;
  color: #fff;
`;

export const GroupMembers = styled.span`
  font-size: 0.9rem;
  color: #777;
`;

export const GroupBalance = styled.span`
  font-weight: 600;
  color: #00e6e6;
`;

export const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

export const ActionButton = styled.button`
  background: #f1f1f1;
  border: none;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover {
    background: #e0f7f7;
  }
`;