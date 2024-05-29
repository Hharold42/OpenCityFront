import React, { useEffect, useState } from "react";
import { useUser } from "../../context/userContext";
import { getMyCommunitiesByStatus } from "../../utils/controllers/communityController";
import RenderUserCommunity from "./RednerUserCommunity";
import { Link } from "react-router-dom";

const UserCommunities = () => {
  const [communities, setCommunities] = useState(null);
  const [status, setStatus] = useState(1);

  const { session } = useUser();

  useEffect(() => {
    if (!communities && session) {
      getMyCommunitiesByStatus(status, session).then((data) => {
        setCommunities(
          data.map((item, index) => (
            <RenderUserCommunity
              item={item}
              index={index}
              key={index}
              controller={setCommunities}
            />
          ))
        );
      });
    }
  }, [communities, session, status]);

  return (
    <div className="page-wrap">
      <div className="flex flex-col w-[1000px] px-4 py-2">
      <label className="ft_title">Мои сообщества</label>
        <Link className="ft_button self-start mb-4" to="/community/create">
          Создать
        </Link>
        <select
          className="ft_input mr-4"
          value={status}
          onChange={(e) => {
            setCommunities(null);
            setStatus(e.target.value);
          }}
        >
          <option value={0}>На верификации</option>
          <option value={1}>Активные</option>
        </select>
        {communities ? communities : "Отсутсвуют активные события"}
      </div>
    </div>
  );
};

export default UserCommunities;
