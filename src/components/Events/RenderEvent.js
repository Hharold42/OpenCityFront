import React, { useEffect, useState } from "react";
import parseISO from "../../utils/isoToHuman";
import { FaPaperPlane } from "react-icons/fa6";
import {
  getPhotoIdById,
  getPhotoUrlById,
} from "../../utils/controllers/photoController";
import { FaFileAlt } from "react-icons/fa";
import { createReport } from "../../utils/controllers/reportContorller";
import { useUser } from "../../context/userContext";
import { Link } from "react-router-dom";

const RenderEvent = ({ item, index, status }) => {
  const [photos, setPhotos] = useState(null);
  const [showComplaint, setShowComplaint] = useState(false);
  const [reportText, setReportText] = useState("");
  const { session } = useUser();

  useEffect(() => {
    const fetchPhoto = async () => {
      const imageId = await getPhotoIdById(item.id, 0);

      if (imageId) {
        await getPhotoUrlById(imageId).then((res) => setPhotos(res));
      } else {
        setPhotos(false);
      }
    };

    if (!photos) fetchPhoto();
  }, [photos, item]);

  const report = () => {
    if (reportText.length > 0) {
      createReport(session, reportText, 0, item.id).then((res) => {
        setShowComplaint(false);
        setReportText("");
      });
    }
  };

  return (
    <div className="relative h-fit transition-all duration-500">
      <div
        key={index}
        className="relative z-40 w-full h-[350px] bg-[#2B2D3D] my-2 rounded-md grid grid-cols-3"
      >
        <Link
          to={`/events/${item.id}`}
          className="bg-white h-full rounded-l-md relative overflow-hidden"
        >
          {photos && (
            <img
              src={photos}
              alt="Полученное изображение"
              className="w-full h-full object-cover z-10"
            />
          )}
        </Link>
        <div className="flex flex-col text-lg h-full relative">
          <div className="px-4 py-2">
            <div className="text-2xl font-bold mb-2 truncate">{item.title}</div>
            <div className="truncate">Адрес: {item.address}</div>
            <div className="truncate">
              Начало:
              <br /> {parseISO(item.datetime_start)}
            </div>
            <div className="truncate">
              Окончание:
              <br /> {parseISO(item.datetime_end)}
            </div>
            <div className="truncate">От: {item.price_min}р.</div>
            <div className="truncate">До: {item.price_max}р.</div>
            <div className="flex my-2">
              <p className="bg-[#1A1C28] px-1 truncate">{item.tag}</p>
            </div>
          </div>
          {session && (
            <div className="flex items-center mt-auto relative">
              <div
                className="flex flex-row items-center cursor-pointer [&>*]:mx-2 px-4 py-2"
                onClick={() => setShowComplaint(!showComplaint)}
              >
                Отправить жалобу
                <FaFileAlt />
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col border-l border-white h-full">
          <div className="px-4 py-2 break-words overflow-y-hidden">
            {item.description.length > 250
              ? item.description.slice(0, 250) + "..."
              : item.description}
          </div>
        </div>
      </div>
      <div
        className={` left-0 right-0 bg-[#11131E] rounded-b-md transition-transform duration-500 ease-in-out transform ${
          showComplaint ? "-translate-y-2" : "-translate-y-full absolute"
        } z-30`}
        style={{ top: "100%" }}
      >
        <div className="p-4">
          <div className="field_max">
            <label className="ft_field-label">Описание жалобы:</label>
            <textarea
              type="text"
              className="ft_input"
              value={reportText}
              onChange={(e) =>
                 setReportText(e.target.value)
              }
            />
            <button
              className=" ft_button self-start flex flex-row mt-4 items-center [&>*]:mx-2"
              onClick={report}
            >
              Отправить
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenderEvent;
