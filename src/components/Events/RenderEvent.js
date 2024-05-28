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
        className=" relative z-40 w-full h-[300px] bg-[#2B2D3D] my-2 rounded-md flex flex-row justify-evenly [&>*]:w-full"
      >
        <div className="bg-white h-full rounded-l-md relative">
          {photos && (
            <img
              src={photos}
              alt="Полученное изображение"
              className="w-full h-full object-cover z-10"
            />
          )}
        </div>
        <div className="flex flex-col p-4 text-lg">
          <div className="text-2xl font-bold mb-2">{item.title}</div>
          <div>Адрес: {item.address}</div>
          <div>Начало: {parseISO(item.datetime_start)}</div>
          <div>Окончание: {parseISO(item.datetime_end)}</div>
          <div>От: {item.price_min}р.</div>
          <div>До: {item.price_max}р.</div>
          <div className="flex my-2">
            <p className="bg-[#1A1C28] px-1">{item.tag}</p>
          </div>
          {session && (
            <div className="flex items-center mt-auto relative">
              <div
                className="flex flex-row items-center cursor-pointer [&>*]:mx-2"
                onClick={() => setShowComplaint(!showComplaint)}
              >
                Отправить жалобу
                <FaFileAlt />
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col p-4 border-l border-white">
          {item.description}
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
              onChange={(e) => setReportText(e.target.value)}
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
