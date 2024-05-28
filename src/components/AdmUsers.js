import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import { getAllUsers } from "../utils/controllers/userController";
import RenderUser from "./RenderUser";

const AdmUsers = () => {
  const navigate = useNavigate();
  const { user, session } = useUser();
  const [users, setUsers] = React.useState(null);

  useEffect(() => {
    if (user) user.role !== "admin" && navigate("/");
  }, [user, navigate]);

  useEffect(() => {
    console.log(user);
    if (!users && session) {
      getAllUsers(session).then((data) => {
        console.log(data);
        setUsers(
          data.map((item, index) => (
            <RenderUser data={item} key={index} controller={setUsers} />
          ))
        );
      });
    }
  }, [users, session, user]);

  return (
    <div className="page-wrap">
      <div className="flex flex-col w-[1000px] px-4 py-2">
      <label className="ft_title">Пользователи</label>
        {users && users}</div>
    </div>
  );
};

export default AdmUsers;
