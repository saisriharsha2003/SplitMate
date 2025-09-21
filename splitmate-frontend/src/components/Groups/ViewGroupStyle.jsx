import styled from "styled-components";

export const Wrapper = styled.div`
  flex: 1;
  padding: 20px;
  background: #0d0d0d;
  min-height: 100vh;
  margin-top: 20px;
  transition: margin 0.3s ease;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;

  h1 {
    font-size: 1.8rem;
    color: #00e6e6;
    font-weight: 600;
  }
`;

export const Title = styled.h1``;

export const SubTitle = styled.span`
  font-size: 0.95rem;
  color: #777;
  margin-top: 4px;
`;

export const BalancesWrapper = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
`;

export const BalanceCard = styled.div`
  flex: 1;
  padding: 12px 16px;
  background: rgba(26, 26, 26);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-left: 4px solid ${(props) => props.color || "#00e6e6"};
`;

export const BalanceTitle = styled.span`
  font-size: 0.9rem;
  color: #777;
  margin-bottom: 6px;
`;

export const BalanceAmount = styled.span`
  font-size: 1.2rem;
  font-weight: 600;
  color: #fff;
`;

export const SectionTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  color: #00e6e6;
  margin: 12px 0;
`;

export const ExpenseDate = styled.div`
  font-size: 0.85rem;
  color: #999;
  margin: 12px 0 6px 0;
`;

export const ExpenseCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(26, 26, 26);
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 8px;
`;

export const ExpenseLeft = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ExpenseTitle = styled.span`
  font-weight: 500;
  color: #fff;
`;

export const ExpenseMeta = styled.span`
  font-size: 0.8rem;
  color: #777;
`;

export const ExpenseAmount = styled.span`
  font-weight: 600;
  color: #00e6e6;
`;

export const FloatingButton = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: #00e6e6;
  color: #fff;
  border: none;
  padding: 14px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 230, 230, 0.4);

  &:hover {
    background: #1ddbd1;
  }
`;
