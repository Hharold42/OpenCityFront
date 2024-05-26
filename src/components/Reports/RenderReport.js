import React, { useEffect, useState } from "react";
import { getUserEmailById } from "../../utils/controllers/userController";
import { useUser } from "../../context/userContext";

const RenderReport = ({ id, description, user }) => {
  const [userName, setUserName] = useState("");

  const { session } = useUser();

  useEffect(() => {
    const fetchUser = async () => {
      const res = await getUserEmailById(session, user);

      setUserName(res);
    };

    if (!userName && session) fetchUser();
  }, [userName, user, session]);

  return (
    <div className="flex flex-row justify-between">
      <div>{userName}</div>
      <div>{description}</div>
      <div>{id}</div>
    </div>
  );
};

export default RenderReport;
