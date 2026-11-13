import styled from "styled-components";

export const AuthWrapper = styled.main`
  box-sizing: border-box;
  display: grid;
  min-height: 100vh;
  min-height: 100svh;
  width: 100%;
  place-items: center;
  padding: 96px 20px 34px;
  background:
    radial-gradient(ellipse at 82% 15%, rgba(251,204,19,.085), transparent 31%),
    radial-gradient(ellipse at 12% 78%, rgba(0,139,139,.09), transparent 28%),
    #101112;
  @media (max-width: 560px) { padding: 82px 14px 22px; }
`;

export const AuthContainer = styled.div`
  display: grid;
  grid-template-columns: ${(props) => props.$single ? "minmax(0,1fr)" : "minmax(250px,.82fr) minmax(390px,1.18fr)"};
  width: ${(props) => props.$single ? "min(100%,560px)" : "min(100%,1020px)"};
  min-height: ${(props) => props.$single ? "0" : "610px"};
  border: 1px solid rgba(255,255,255,.095);
  border-radius: 22px;
  overflow: hidden;
  background: linear-gradient(145deg, rgba(31,33,34,.98), rgba(17,18,19,.99));
  box-shadow: 0 28px 80px rgba(0,0,0,.46), inset 0 1px rgba(255,255,255,.035);
  @media (max-width: 820px) { grid-template-columns: 1fr; width: min(100%, 620px); min-height: 0; }
  @media (max-width: 560px) { border-radius: 17px; }
`;

export const ImageSection = styled.aside`
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 40px;
  min-width: 0;
  padding: clamp(26px, 4vw, 44px);
  border-right: 1px solid rgba(255,255,255,.07);
  background:
    radial-gradient(ellipse at 0% 100%, rgba(0,139,139,.2), transparent 45%),
    radial-gradient(ellipse at 100% 0%, rgba(204,186,120,.17), transparent 42%),
    linear-gradient(145deg, #1b1d1e, #111213);
  &::after { content: ""; position: absolute; z-index: -1; right: -48px; bottom: 13%; width: 170px; height: 170px; border: 1px solid rgba(204,186,120,.11); border-radius: 50%; box-shadow: 0 0 0 28px rgba(204,186,120,.025), 0 0 0 58px rgba(0,139,139,.025); }
  @media (max-width: 820px) { min-height: 190px; gap: 24px; padding: 25px 30px; border-right: 0; border-bottom: 1px solid rgba(255,255,255,.07); }
  @media (max-width: 560px) { min-height: 0; padding: 20px 21px; gap: 14px; }
`;

export const BrandMark = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #f2d34f;
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: -.025em;
  span { display: grid; width: 35px; height: 35px; place-items: center; border: 1px solid rgba(204,186,120,.3); border-radius: 11px; background: linear-gradient(145deg,rgba(0,139,139,.3),rgba(204,186,120,.15)); color: #f4df8c; font-size: .72rem; letter-spacing: .02em; }
`;

export const BrandPitch = styled.div`
  max-width: 350px;
  h2 { margin: 0; color: #f2f3ef; font-size: clamp(1.6rem, 3vw, 2.3rem); line-height: 1.12; letter-spacing: -.05em; }
  h2 span { color: #e5ce6b; }
  p { margin: 14px 0 0; color: #969da1; font-size: .86rem; line-height: 1.7; }
`;

export const BenefitList = styled.div`
  display: grid;
  gap: 12px;
  @media (max-width: 820px) { grid-template-columns: repeat(3, minmax(0,1fr)); }
  @media (max-width: 560px) { display: none; }
`;

export const Benefit = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #bec3c4;
  font-size: .76rem;
  svg { flex: 0 0 auto; color: #79d4ad; }
  @media (max-width: 820px) { align-items: flex-start; font-size: .68rem; line-height: 1.45; }
`;

export const FormSection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  padding: clamp(25px, 5vw, 54px);
  color: #f4f4f2;
`;

export const FormEyebrow = styled.span`
  display: block;
  margin-bottom: 8px;
  color: #d4b33b;
  font-size: .65rem;
  font-weight: 800;
  letter-spacing: .15em;
  text-transform: uppercase;
`;

export const Title = styled.h1`
  margin: 0;
  color: #f5f5f3;
  font-size: clamp(1.7rem, 3vw, 2.1rem);
  font-weight: 750;
  letter-spacing: -.045em;
`;

export const FormIntro = styled.p`
  margin: 8px 0 0;
  color: #939a9e;
  font-size: .84rem;
  line-height: 1.55;
`;

export const RegisterForm = styled.form`
  display: grid;
  grid-template-columns: repeat(2, minmax(0,1fr));
  gap: 12px;
  margin-top: 23px;
  > div:nth-child(5), > div:nth-child(6), > button { grid-column: 1 / -1; }
  @media (max-width: 560px) { grid-template-columns: 1fr; > div, > button { grid-column: 1; } }
`;

export const InputGroup = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  min-width: 0;
  min-height: 47px;
  padding: 0 12px;
  border: 1px solid rgba(255,255,255,.105);
  border-radius: 10px;
  background: rgba(255,255,255,.035);
  transition: border-color 150ms ease, box-shadow 150ms ease, background 150ms ease;
  &:hover { border-color: rgba(255,255,255,.19); }
  &:focus-within { border-color: rgba(204,186,120,.62); box-shadow: 0 0 0 3px rgba(204,186,120,.09); background: rgba(255,255,255,.05); }
  .icon { flex: 0 0 auto; margin-right: 10px; color: #c9ad48; font-size: .92rem; }
  > div { flex: 1; min-width: 0; }
  > div > button { min-height: 45px; padding: 0 2px; font-size: .84rem; }
  .toggle-password { display: grid; flex: 0 0 auto; width: 32px; height: 32px; place-items: center; border: 0; border-radius: 8px; background: transparent; color: #929a9e; cursor: pointer; transition: color 140ms ease, background 140ms ease; }
  .toggle-password:hover { color: #e8d16d; background: rgba(255,255,255,.05); }
  .toggle-password:focus-visible { outline: 2px solid rgba(204,186,120,.6); outline-offset: 1px; }
`;

export const Input = styled.input`
  flex: 1;
  width: 100%;
  min-width: 0;
  padding: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: #f2f3f1;
  font: inherit;
  font-size: .84rem;
  &::placeholder { color: #747d81; opacity: 1; }
  &:-webkit-autofill { -webkit-box-shadow: 0 0 0 1000px #1d1f20 inset !important; -webkit-text-fill-color: #f2f3f1 !important; caret-color: #f2f3f1; }
`;

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  width: 100%;
  min-height: 47px;
  padding: 0 16px;
  border: 1px solid rgba(255,255,255,.16);
  border-radius: 10px;
  background: linear-gradient(110deg, #b8860b 0%, #d4b349 48%, #f0df9b 100%);
  color: #171717;
  font: inherit;
  font-size: .88rem;
  font-weight: 750;
  cursor: pointer;
  transition: transform 160ms ease, filter 160ms ease, box-shadow 160ms ease;
  &:hover:not(:disabled) { transform: translateY(-1px); filter: brightness(1.04); box-shadow: 0 9px 22px rgba(184,134,11,.16); }
  &:focus-visible { outline: 3px solid rgba(204,186,120,.45); outline-offset: 3px; }
  &:disabled { opacity: .6; cursor: wait; }
`;

export const SwitchText = styled.p`
  margin: 18px 0 0;
  color: #92999d;
  font-size: .8rem;
  text-align: center;
  a { color: #e5ce6b; font-weight: 700; text-decoration: none; }
  a:hover { color: #f3df8a; text-decoration: underline; }
`;
