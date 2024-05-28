import { createContext, useContext, useState } from "react";

const PopupContext = createContext();

export const usePopup = () => useContext(PopupContext);

const PopupContextProvider = ({ children }) => {
  const [popup, setPopup] = useState(false);
  const [popupContent, setPopupContent] = useState(null);
  const [popupTitle, setPopupTitle] = useState(null);
  const [popupType, setPopupType] = useState(0);

  const providerValues = {
    popup,
    setPopup,
    popupContent,
    setPopupContent,
    popupTitle,
    setPopupTitle,
    popupType,
    setPopupType,
  };

  return <PopupContext value={providerValues}>{children}</PopupContext>;
};

export default PopupContextProvider;
