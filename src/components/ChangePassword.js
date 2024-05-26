import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import { changePassword } from "../utils/controllers/userController";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const { session, setSession, user } = useUser();
  const navigate = useNavigate();

  const confirm = async () => {
    if (user.email && newPassword) {
      const res = await changePassword(session, user.email, newPassword);
      if (res.split("$")[0] === user.email) {
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
          <label className="ft_field-label">Новый пароль:</label>
          <input
            type="text"
            className="ft_input"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <button className="ft_button self-start" onClick={confirm}>
          Сменить
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;
