import { useEffect, useState } from "react";
import { useUser } from "../../context/userContext";
import {
  getPhotoIdById,
  getPhotoUrlById,
} from "../../utils/controllers/photoController";
import parseISO from "../../utils/isoToHuman";
import { Link } from "react-router-dom";
import RotWord from "../RotWord";
import { deleteEvent } from "../../utils/controllers/eventController";

const RenderUserEvents = ({ item, index, controller }) => {
  const [photos, setPhotos] = useState(null);

  const { session } = useUser();

  useEffect(() => {
    const fetchPhoto = async () => {
      const imageId = await getPhotoIdById(item.id, 0);

      if (imageId) await getPhotoUrlById(imageId).then((res) => setPhotos(res));
    };

    if (!photos) fetchPhoto();
  }, [photos, item]);

  return (
    <div
      key={index}
      className="relative z-40 w-full h-[300px] bg-[#2B2D3D] my-2 rounded-md flex flex-row justify-evenly"
    >
      {/* Левая часть с изображением */}
      <div className="bg-white h-full rounded-l-md relative w-full">
        {photos && (
          <img
            src={photos}
            alt="Полученное изображение"
            className="w-full h-full object-cover z-10"
          />
        )}
      </div>

      {/* Средняя часть с информацией */}
      <div className="flex flex-col p-4 text-lg w-full">
        <div className="text-2xl font-bold mb-2">{item.title}</div>
        <div>Адрес: {item.address}</div>
        <div>Начало: {parseISO(item.datetime_start)}</div>
        <div>Окончание: {parseISO(item.datetime_end)}</div>
        <div>От: {item.price_min}р.</div>
        <div>До: {item.price_max}р.</div>
        <div className="flex my-2">
          <p className="bg-[#1A1C28] px-1">{item.tag}</p>
        </div>
      </div>

      {/* Правая часть с описанием */}
      <div className="flex flex-col p-4 border-l border-white w-full">
        {item.description}
      </div>

      {/* Кнопки управления */}
      <div className="bg-[#FF6363] flex flex-row rounded-r-md shadow-md text-black font-bold">
        <div className="bg-[#2FB4FF] flex flex-row h-full rounded-r-md self-start shadow-md">
          <Link
            className="px-4 flex items-center"
            to={`/events/change/${item.id}`}
          >
            <RotWord word={"Change"} />
          </Link>
        </div>
        <button
          className="px-4 "
          onClick={async (e) => {
            await deleteEvent(session, item.id);
            controller(null);
          }}
        >
          <RotWord word={"Delete"} />
        </button>
      </div>
    </div>
  );
};

export default RenderUserEvents;
