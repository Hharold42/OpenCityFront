import { Link, useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../context/userContext";
import { useEffect, useState } from "react";
import {
  deleteEvent,
  getEventById,
} from "../../utils/controllers/eventController";
import {
  getPhotoIdById,
  getPhotoUrlById,
} from "../../utils/controllers/photoController";
import parseISO from "../../utils/isoToHuman";
import { getReportsByTypeAndId } from "../../utils/controllers/reportContorller";
import RenderReport from "../Reports/RenderReport";

const statuses = {
  verification: "На верификации",
  activ: "Активно",
  archive: "Архив",
  canceled: "Отменено",
};

const DetailEvent = () => {
  const [event, setEvent] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [reports, setReports] = useState(null);

  const params = useParams();
  const navigate = useNavigate();

  const { session, user } = useUser();

  useEffect(() => {
    const GE = async () => {
      try {
        const res = await getEventById(session, params.id);

        setEvent(res);
      } catch (e) {
        console.log(e);
        navigate("/event");
      }
    };

    if (session && !event && params) GE();
  }, [event, session, params, navigate]);

  useEffect(() => {
    const fetchPhoto = async () => {
      const imageId = await getPhotoIdById(params.id, 0);

      if (imageId) {
        await getPhotoUrlById(imageId).then((res) => setPhoto(res));
      } else {
        setPhoto(false);
      }
    };

    if (!photo && params) fetchPhoto();
  }, [photo, params]);

  useEffect(() => {
    if (user && !reports && session && event) {
      if (user.role !== "user" || user.id === event.id) {
        getReportsByTypeAndId(session, 0, params.id).then((data) =>
          setReports(
            data.map((item, index) => (
              <RenderReport
                key={index}
                id={item.id}
                description={item.description}
                author={item.user}
                entType={"event"}
                del={true}
                controller={setReports}
              />
            ))
          )
        );
      }
    }
  }, [user, reports, session, event, params]);

  return (
    <div className="page-wrap">
      {event && user ? (
        <div className="flex flex-col w-[1000px] px-4 py-2">
          <div className="relative z-40 w-full bg-[#2B2D3D] my-2 p-4 rounded-md">
            <label className="ft_title break-words">
              Событие "{event.title}"
            </label>
            <div className="flex flex-row my-4">
              <div
                className={`w-full min-h-64 h-full mx-auto ${
                  !photo && "bg-white"
                } rounded-xl`}
              >
                {photo ? (
                  <img
                    src={photo}
                    alt="Полученное изображение"
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  "Отсутствует изображение"
                )}
              </div>
              <div className=" ml-4 w-full px-8 py-4 bg-[#11131e7c] rounded-xl break-words max-w-[40%]">
                <div className="my-2 bg-[#11131E] w-fit px-2 py-1">
                  {statuses[event.status]}
                </div>
                <div className="break-words mb-2">
                  Адрес:
                  <br />
                  {event.address}
                </div>
                <div className="break-words mb-2">
                  Начало:
                  <br /> {parseISO(event.datetime_start)}
                </div>
                <div className="break-words mb-2">
                  Окончание:
                  <br /> {parseISO(event.datetime_end)}
                </div>
                <div className="break-words mb-2">
                  От:
                  <br /> {event.price_min}
                </div>
                <div className="break-words mb-2">
                  До:
                  <br /> {event.price_max}
                </div>
                <div className="flex my-2">
                  <p className="bg-[#1A1C28] px-1">{event.tag}</p>
                </div>
              </div>
            </div>
            <div className=" w-full px-8 py-4 bg-[#11131e7c] rounded-xl break-words my-4">
              <label className="ft_title mb-2">Описание</label>
              <br />
              {event.description}
            </div>
            {reports && (
              <div className=" w-full px-8 py-4 bg-[#11131e7c] rounded-xl break-words">
                <label className="ft_title mb-2">Жалобы</label>
                <table className="w-full border-b border-white my-4">
                  <thead>
                    <tr className="border-b border-white [&>*]:py-2">
                      <th>Пользователь</th>
                      <th>Описание</th>
                      <th>ID</th>
                    </tr>
                  </thead>
                  <tbody>{reports}</tbody>
                </table>
              </div>
            )}
            {(user.id === event.user || user.role !== "user") && (
              <div className="my-6 flex flex-row justify-between">
                <Link className="ft_button" to={`/events/change/${params.id}`}>
                  Change
                </Link>
                <button
                  className="ft_button-red"
                  onClick={async (e) => {
                    await deleteEvent(session, params.id);
                    navigate("/community");
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        "Загрузка..."
      )}
    </div>
  );
};

export default DetailEvent;
