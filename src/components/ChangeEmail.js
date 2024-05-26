import React, { useState } from "react";
import { changeEmail } from "../utils/controllers/userController";
import { useUser } from "../context/userContext";
import { useNavigate } from "react-router-dom";

const ChangeEmail = () => {
  const [oldEmail, setOldEmail] = useState();
  const [newEmail, setNewEmail] = useState();
  const { session, setSession } = useUser();
  const navigate = useNavigate();

  const confirm = async () => {
    if (oldEmail && newEmail) {
      const res = await changeEmail(session, oldEmail, newEmail);
      if (res.split("$")[0] === newEmail) {
        localStorage.removeItem("opencity-token");
        setSession("");
        navigate("/login");
      } else {
        alert(res);
      }
    }
  };

  return (
    <div className="page-wrap">
      <div className="flex flex-col w-[1000px] px-4 py-2">
        <div className="field_max">
          <label className="ft_field-label">Старый Email:</label>
          <input
            type="text"
            className="ft_input"
            value={oldEmail}
            onChange={(e) => setOldEmail(e.target.value)}
          />
        </div>
        <div className="field_max">
          <label className="ft_field-label">Новый Email:</label>
          <input
            type="text"
            className="ft_input"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
        </div>
        <button className="ft_button self-start" onClick={confirm}>
          Сменить
        </button>
      </div>
    </div>
  );
};

export default ChangeEmail;
