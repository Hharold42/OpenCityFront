import { useEffect, useState } from "react";
import { useUser } from "../../context/userContext";
import { getUserEmailById } from "../../utils/controllers/userController";
import { getEventById } from "../../utils/controllers/eventController";
import { getCommunityById } from "../../utils/controllers/communityController";
import { Link } from "react-router-dom";
import { deleteReport } from "../../utils/controllers/reportContorller";

const RenderAdmReports = ({
  id,
  description,
  user,
  entId,
  entType,
  controller,
}) => {
  const [userName, setUserName] = useState("");
  const [entName, setEntName] = useState("");

  const { session } = useUser();

  useEffect(() => {
    const fetchUser = async () => {
      const res = await getUserEmailById(session, user);

      setUserName(res);
    };

    if (!userName && session) fetchUser();
  }, [userName, user, session]);

  useEffect(() => {
    if (entType === "event")
      getEventById(session, entId).then((data) => setEntName(data.title));
    if (entType === "community")
      getCommunityById(session, entId).then((data) => setEntName(data.title));
  }, [entName, entId, entType, session]);

  return (
    <div className=" w-full bg-[#2B2D3D] flex flex-col rounded-xl px-8 py-4 my-2 ">
      <div className="flex my-2">
        <p className="bg-[#1A1C28] px-1 truncate">{id}</p>
      </div>
      <div className="w-full break-words mb-2">
        <label className="ft_title-sm border-b border-white">
          Пользователь:{" "}
        </label>
        {userName} [{user}]
      </div>
      <div className="w-full break-words mb-2">
        <label className="ft_title-sm border-b border-white">
          Описание жалобы:{" "}
        </label>
        <br />
        {description}
      </div>
      <div className="w-full break-words mb-2">
        <label className="ft_title-sm border-b border-white">
          Сущность({entType}):{" "}
        </label>
        <Link
          to={entType === "event" ? `/events/${entId}` : `/community/${entId}`}
          className=" ft_button-sm"
        >
          {entName ? entName : "Сущность"}
        </Link>
      </div>

      <div className="flex">
        <button
          className="ft_button-red"
          onClick={() => {
            deleteReport(session, id, entType).then((res) => {
              controller(null);
            });
          }}
        >
          Удалить
        </button>
      </div>
    </div>
  );
};

export default RenderAdmReports;
