import { useEffect, useState } from "react";
import { useUser } from "../../context/userContext";
import { Link } from "react-router-dom";
import { getMyEventsByStatus } from "../../utils/controllers/eventController";
import RenderUserEvents from "./RenderUserEvents";

const UserEvents = () => {
  const [events, setEvents] = useState(null);
  const [status, setStatus] = useState(1);

  const { session } = useUser();

  useEffect(() => {
    if (!events && session) {
      getMyEventsByStatus(status, session).then((data) => {
        setEvents(
          data.map((item, index) => (
            <RenderUserEvents
              key={index}
              item={item}
              index={index}
              controller={setEvents}
            />
          ))
        );
      });
    }
  }, [events, session, status]);

  return (
    <div className="page-wrap">
      <div className="flex flex-col w-[1000px] px-4 py-2">
      <label className="ft_title">Мои события</label>
        <Link className="ft_button self-start mb-4" to="/createEvent">
          Создать
        </Link>
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
        </select>
        {events ? events : "Отсутсвуют активные события"}
      </div>
    </div>
  );
};

export default UserEvents;
