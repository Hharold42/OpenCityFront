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
    <tr className=" border-b border-white [&>*]:py-2 [&>*]:border [&>*]:border-white">
      <td className="">{userName}</td>
      <td className=" truncate  ">{description.slice(0,70)}...</td>
      <td className="">{id}</td>
    </tr>
  );
};

export default RenderReport;
