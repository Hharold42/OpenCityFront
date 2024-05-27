import React, { useEffect, useState } from "react";
import { useUser } from "../../context/userContext";
import RenderCommunity from "./RenderCommunity";
import {
  getAllActiveCommunities,
  getAllCommunitiesByStatus,
} from "../../utils/controllers/communityController";
import RenderAdmCommunity from "./RenderAdmCommunity";
import { Link } from "react-router-dom";

const Community = () => {
  const [communities, setCommunities] = useState(null);
  const { session, user } = useUser();
  const [adminMode, setAdminMode] = useState(false);
  const [status, setStatus] = useState(1);

  useEffect(() => {
    if (!communities && session) {
      if (!adminMode)
        getAllActiveCommunities(session).then((data) =>
          setCommunities(
            data.map((item, index) => (
              <RenderCommunity key={index} item={item} index={index} />
            ))
          )
        );
      else {
        getAllCommunitiesByStatus(session, status).then((data) =>
          setCommunities(
            data.map((item, index) => (
              <RenderAdmCommunity
                key={index}
                item={item}
                index={index}
                controller={setCommunities}
              />
            ))
          )
        );
      }
    }
  }, [communities, session, adminMode, status]);

  return (
    <div className="page-wrap">
      <div className="flex flex-col w-[1000px] px-4 py-2">
      <Link
          className="ft_button self-start mb-4"
          to={!!session ? "/community/create" : "/register"}
        >
          Создать
        </Link>
        {user && ["admin", "moderator"].includes(user.role) && (
          <div className="flex flex-row">
            {adminMode && (
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
                <option value={2}>Прошедшее</option>
                <option value={5}>Забанено</option>
              </select>
            )}

            <button
              className="ft_button self-start"
              onClick={() => {
                setCommunities(null);
                setAdminMode((prev) => !prev);
              }}
            >
              {adminMode ? "User Mode" : "Admin Mode"}
            </button>
          </div>
        )}
        {communities ? communities : "Отсутсвуют сообщества"}
      </div>
    </div>
  );
};

export default Community;
