import React, { useEffect, useState } from "react";
import { useUser } from "../../context/userContext";
import RenderEvent from "./RenderEvent";
import { Link } from "react-router-dom";
import RenderAdmEvent from "./RenderAdmEvent";
import {
  getAllActiveEvent,
  getAllEventsByStatus,
} from "../../utils/controllers/eventController";

const Event = () => {
  const [events, setEvents] = useState(null);
  const { session, user } = useUser();
  const [adminMode, setAdminMode] = useState(false);
  const [status, setStatus] = useState(1);

  useEffect(() => {
    if (!events) {
      if (!adminMode)
        getAllActiveEvent(session).then((data) =>
          setEvents(
            data.map((item, index) => (
              <RenderEvent key={index} item={item} index={index} />
            ))
          )
        );
      else if (session) {
        getAllEventsByStatus(session, status).then((data) =>
          setEvents(
            data.map((item, index) => (
              <RenderAdmEvent
                key={index}
                item={item}
                index={index}
                controller={setEvents}
              />
            ))
          )
        );
      }
    }
  }, [events, session, adminMode, status]);

  return (
    <div className="page-wrap">
      <div className="flex flex-col w-[1000px] px-4 py-2">
        <Link
          className="ft_button self-start mb-4"
          to={!!session ? "/events/create" : "/register"}
        >
          Создать
        </Link>

        {user && (user.role === "moderator" || user.role === "admin") && (
          <div className="flex flex-row">
            {adminMode && (
              <select
                className="ft_input mr-4"
                value={status}
                onChange={(e) => {
                  setEvents(null);
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
                setEvents(null);
                setAdminMode((prev) => !prev);
              }}
            >
              {adminMode ? "User Mode" : "Admin Mode"}
            </button>
          </div>
        )}
        {events ? events : "Отсутсвуют активные события"}
      </div>
    </div>
  );
};

export default Event;
