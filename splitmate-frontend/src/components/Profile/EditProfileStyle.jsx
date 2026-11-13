import styled from "styled-components";

export const ProfileContainer = styled.main`
  flex: 1;
  min-width: 0;
  min-height: 100vh;
  padding: 104px clamp(18px, 4vw, 48px) 48px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background:
    radial-gradient(ellipse at 80% 8%, rgba(251, 204, 19, 0.075), transparent 32%),
    radial-gradient(ellipse at 12% 88%, rgba(251, 204, 19, 0.035), transparent 30%),
    #101112;
  transition: margin 280ms cubic-bezier(0.22, 1, 0.36, 1);
  @media (max-width: 600px) { padding: 92px 14px 32px; }
`;

export const ProfileBox = styled.section`
  position: relative;
  overflow: hidden;
  width: min(100%, 780px);
  padding: clamp(22px, 4vw, 38px);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 20px;
  background: linear-gradient(145deg, rgba(32, 33, 34, 0.97), rgba(20, 21, 22, 0.98));
  box-shadow: 0 22px 58px rgba(0, 0, 0, 0.36), inset 0 1px rgba(255, 255, 255, 0.04);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    height: 2px;
    background: linear-gradient(90deg, #ffe16b, rgba(251, 204, 19, 0.2) 60%, transparent);
  }
`;

export const ProfileHeader = styled.header`
  display: flex;
  align-items: center;
  gap: 17px;
  margin-bottom: 30px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.075);
`;

export const ProfileAvatar = styled.div`
  display: grid;
  flex: 0 0 54px;
  width: 54px;
  height: 54px;
  place-items: center;
  border: 1px solid rgba(251, 204, 19, 0.26);
  border-radius: 16px;
  background: linear-gradient(145deg, rgba(251, 204, 19, 0.19), rgba(251, 204, 19, 0.055));
  color: #f1d454;
  font-size: 1.3rem;
  box-shadow: inset 0 1px rgba(255, 255, 255, 0.05), 0 8px 22px rgba(0, 0, 0, 0.2);
`;

export const Title = styled.h1`
  margin: 0;
  color: #f4f4f3;
  font-size: clamp(1.35rem, 3vw, 1.75rem);
  font-weight: 740;
  letter-spacing: -0.035em;
`;

export const Description = styled.p`
  margin: 6px 0 0;
  color: #92989c;
  font-size: 0.87rem;
`;

export const ProfileForm = styled.form`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 19px 16px;
  @media (max-width: 580px) { grid-template-columns: 1fr; gap: 16px; }
`;

export const Field = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FieldLabel = styled.label`
  color: #c7c9c9;
  font-size: 0.78rem;
  font-weight: 650;
`;

export const InputGroup = styled.div`
  min-height: 50px;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 0 13px;
  border: 1px solid rgba(255, 255, 255, 0.11);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.035);
  box-shadow: inset 0 1px rgba(255, 255, 255, 0.02);
  transition: border-color 160ms ease, background 160ms ease, box-shadow 160ms ease;

  &:focus-within {
    border-color: rgba(251, 204, 19, 0.48);
    background: rgba(255, 255, 255, 0.05);
    box-shadow: 0 0 0 3px rgba(251, 204, 19, 0.055);
  }

  svg { flex: 0 0 auto; color: #c7aa33; font-size: 0.9rem; }
`;

export const Input = styled.input`
  width: 100%;
  min-width: 0;
  min-height: 48px;
  border: 0;
  outline: 0;
  background: transparent;
  color: #f0f1f1;
  font: inherit;
  font-size: 0.88rem;

  &::placeholder { color: #70777b; }
  &:-webkit-autofill {
    -webkit-text-fill-color: #f0f1f1;
    transition: background-color 9999s ease-in-out 0s;
  }
`;

export const FormActions = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
  padding-top: 19px;
  border-top: 1px solid rgba(255, 255, 255, 0.075);
  @media (max-width: 420px) { flex-direction: column-reverse; }
`;

export const CancelButton = styled.button`
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.035);
  color: #c4c8ca;
  font: inherit;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 150ms ease, background 150ms ease;
  &:hover { border-color: rgba(255, 255, 255, 0.22); background: rgba(255, 255, 255, 0.07); }
`;

export const SubmitButton = styled.button`
  min-height: 42px;
  min-width: 148px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 16px;
  border: 1px solid rgba(255,255,255,.16);
  border-radius: 9px;
  background: linear-gradient(110deg, #b8860b 0%, #d4b349 48%, #f0df9b 100%);
  color: #171717;
  font: inherit;
  font-size: 0.84rem;
  font-weight: 750;
  cursor: pointer;
  box-shadow: 0 7px 18px rgba(251, 204, 19, 0.13);
  transition: transform 160ms ease, box-shadow 160ms ease, filter 160ms ease;

  &:hover:not(:disabled) { transform: translateY(-1px); filter: brightness(1.04); box-shadow: 0 10px 22px rgba(251, 204, 19, 0.2); }
  &:disabled { cursor: wait; opacity: 0.7; }
  &:focus-visible { outline: 3px solid rgba(251, 204, 19, 0.35); outline-offset: 3px; }
`;

export const ProfileLoading = styled.div`
  min-height: 220px;
  display: grid;
  place-items: center;
`;
