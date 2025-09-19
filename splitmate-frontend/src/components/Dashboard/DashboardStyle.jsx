import styled from "styled-components";

export const LayoutWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  flex-direction: row;
`;

export const ContentWrapper = styled.main`
  flex-grow: 1;
  margin-left: 16rem; /* Adjusted for sidebar width */
  padding: 20px;
  background-color: #f8f9fa;
  overflow-y: auto;
`;

