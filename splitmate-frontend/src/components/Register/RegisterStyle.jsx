import styled from "styled-components";
import background from "../../assets/images/background.jpg";
import CreatableSelect from "react-select/creatable";

export const AuthWrapper = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  padding-top: 65px;
  justify-content: center;
  align-items: center;
  background: url(${background}) no-repeat center center/cover;
`;

export const AuthContainer = styled.div`
  display: flex;
  width: 900px;
  height: 550px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(150px);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
  }
`;

export const ImageSection = styled.div`
  flex: 1;
  background: #111;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;

  img {
    width: 100%;
    max-width: 400px;
    border-radius: 12px;
  }
`;

export const FormSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px;
  color: #fff;
`;

export const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 20px;
  color: #00e6e6;
  display: flex;
  justify-content: center;
  text-align: center;
  font-weight: 700;

`;

export const InputGroup = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  margin: 10px 0;
  padding: 0 12px;

  .icon {
    color: #00e6e6;
    font-size: 1.1rem;
    margin-right: 10px;
  }
  .toggle-password {
    position: absolute;
    right: 63px;
    color: #fff;
    font-size: 1.1rem;
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
      color: #00ffff;
    }
`;

export const Input = styled.input`
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  outline: none;
  background: transparent;
  color: #fff;

  &:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
    -webkit-text-fill-color: #fff !important;
    caret-color: #fff !important;
    transition: background-color 9999s ease-in-out 0s;
  }

  &:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
    -webkit-text-fill-color: #fff !important;
  }

`;

export const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: linear-gradient(90deg, #00e6e6, #00b3b3);
  border: none;
  border-radius: 12px;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.1em;
  cursor: pointer;
  margin-top: 15px;
  transition: 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    background: linear-gradient(90deg, #00b3b3, #00e6e6);
  }
`;

export const SwitchText = styled.p`
  margin-top: 20px;
  font-size: 0.95rem;
  text-align: center;
  color: #ddd;

  a {
    color: #00e6e6;
    font-weight: bold;
    text-decoration: none;
    transition: 0.3s;
  }

  a:hover {
    text-decoration: underline;
  }
`;
export const CurrencySelect = styled(CreatableSelect).attrs({
  classNamePrefix: "react-select",
})`
  flex: 1;
  .react-select__control {
    background: transparent;
    border: none;
    border-radius: 12px;
    min-height: 45px;
    font-size: 1rem;
    color: #fff;
    box-shadow: none;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: transparent; 
    }
  }

  .react-select__single-value {
    color: #fff;
  }

  .react-select__menu {
    background: grey;
    border-radius: 12px;
    margin-top: 6px;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.6);
    overflow: hidden;
    z-index: 1000;
  }

  .react-select__option {
    padding: 10px 14px;
    font-size: 0.95rem;
    color: #e6e6e6;
    cursor: pointer;
    transition: all 0.2s ease;

    &--is-focused {
      background: transparent;
\    }

    &--is-selected {
      background: #00e6e6;
      color: #fff;
    }
  }

  .react-select__indicator-separator {
    display: none;
  }

  .react-select__dropdown-indicator {
    color: #00e6e6;

    &:hover {
      color: white;
    }
  }
`;
