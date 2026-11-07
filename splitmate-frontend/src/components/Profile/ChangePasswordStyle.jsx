import styled from "styled-components";

export const PasswordPage = styled.main`
  flex: 1;
  min-width: 0;
  min-height: 100vh;
  padding: 105px clamp(16px, 4vw, 48px) 42px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background:
    radial-gradient(ellipse at 84% 9%, rgba(251, 204, 19, 0.07), transparent 34%),
    #101112;
  transition: margin 280ms cubic-bezier(0.22, 1, 0.36, 1);
  @media (max-width: 600px) { padding: 92px 14px 32px; }
`;

export const PasswordCard = styled.section`
  position: relative;
  overflow: hidden;
  width: min(100%, 620px);
  padding: clamp(22px, 4vw, 36px);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 19px;
  background: linear-gradient(145deg, rgba(32, 33, 34, 0.97), rgba(20, 21, 22, 0.98));
  box-shadow: 0 22px 58px rgba(0, 0, 0, 0.36), inset 0 1px rgba(255, 255, 255, 0.04);
  &::before { content: ""; position: absolute; top: 0; right: 0; left: 0; height: 2px; background: linear-gradient(90deg, #ffe16b, rgba(251, 204, 19, 0.2) 60%, transparent); }
`;

export const PasswordHeading = styled.header`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 26px;
  padding-bottom: 23px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.075);
`;

export const PasswordIcon = styled.div`
  display: grid;
  flex: 0 0 50px;
  width: 50px;
  height: 50px;
  place-items: center;
  border: 1px solid rgba(251, 204, 19, 0.24);
  border-radius: 15px;
  background: linear-gradient(145deg, rgba(251, 204, 19, 0.18), rgba(251, 204, 19, 0.05));
  color: #f1d454;
  font-size: 1.1rem;
`;

export const Title = styled.h1`
  margin: 0;
  color: #f4f4f3;
  font-size: clamp(1.3rem, 3vw, 1.7rem);
  font-weight: 740;
  letter-spacing: -0.035em;
`;

export const Description = styled.p`
  margin: 6px 0 0;
  color: #92989c;
  font-size: 0.84rem;
  line-height: 1.45;
`;

export const PasswordForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 17px;
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

export const PasswordInputWrap = styled.div`
  min-height: 50px;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 0 11px 0 13px;
  border: 1px solid rgba(255, 255, 255, 0.11);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.035);
  transition: border-color 160ms ease, background 160ms ease, box-shadow 160ms ease;
  &:focus-within { border-color: rgba(251, 204, 19, 0.48); background: rgba(255, 255, 255, 0.05); box-shadow: 0 0 0 3px rgba(251, 204, 19, 0.055); }
  > svg { flex: 0 0 auto; color: #c7aa33; font-size: 0.9rem; }
`;

export const PasswordInput = styled.input`
  flex: 1;
  min-width: 0;
  min-height: 48px;
  border: 0;
  outline: 0;
  background: transparent;
  color: #f0f1f1;
  font: inherit;
  font-size: 0.88rem;
  &::placeholder { color: #70777b; }
`;

export const VisibilityButton = styled.button`
  display: grid;
  flex: 0 0 32px;
  width: 32px;
  height: 32px;
  place-items: center;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: #90979b;
  cursor: pointer;
  &:hover { border-color: rgba(251, 204, 19, 0.15); background: rgba(251, 204, 19, 0.07); color: #e5ca55; }
  &:focus-visible { outline: 2px solid rgba(251, 204, 19, 0.55); outline-offset: 2px; }
`;

export const PasswordHint = styled.p`
  margin: -4px 0 0;
  color: #858b90;
  font-size: 0.74rem;
  line-height: 1.5;
`;

export const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 4px;
  padding-top: 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.075);
  @media (max-width: 420px) { flex-direction: column-reverse; }
`;

export const BackButton = styled.button`
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
  &:hover { background: rgba(255, 255, 255, 0.07); }
`;

export const SaveButton = styled.button`
  min-height: 42px;
  padding: 0 16px;
  border: 1px solid #fbcc13;
  border-radius: 9px;
  background: linear-gradient(135deg, #ffdc4d, #f3c40c);
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
