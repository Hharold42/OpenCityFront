import React, { useState } from "react";
import { chagneRole } from "../utils/controllers/userController";
import { useUser } from "../context/userContext";

const roles = ["user", "moderator", "admin"];

const RenderUser = ({ controller, data }) => {
  const [role, setRole] = useState(roles.indexOf(data.role));
  const { session } = useUser();

  const confirm = async () => {
    console.log(session, data.email, role);
    chagneRole(session, data.email, role).then(() => {
        controller(null)
    });
  };

  return (
    <div className="flex flex-row my-4 justify-between [&>*]:w-full [&>*]:items-center [&>*]:mx-8">
      <div>{data.email}</div>
      <div>{data.registationDate}</div>
      <select
        className="ft_input"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value={0}>USER</option>
        <option value={1}>MOD</option>
        <option value={2}>ADM</option>
      </select>
      <button className="ft_button" onClick={confirm}>
        Применить
      </button>
    </div>
  );
};

export default RenderUser;
