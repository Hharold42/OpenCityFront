import React, { useEffect, useState } from "react";
import { FaFileAlt } from "react-icons/fa";
import {
  getPhotoIdById,
  getPhotoUrlById,
} from "../../utils/controllers/photoController";
import { FaPaperPlane } from "react-icons/fa6";
import { createReport } from "../../utils/controllers/reportContorller";
import { useUser } from "../../context/userContext";

const RenderCommunity = ({ item, index }) => {
  const [photos, setPhotos] = useState(null);
  const [showComplaint, setShowComplaint] = useState(false);
  const [reportText, setReportText] = useState("");
  const { session } = useUser();

  const report = () => {
    if (reportText.length > 0) {
      createReport(session, reportText, 1, item.id).then((res) => {
        setShowComplaint(false);
        setReportText("");
      });
    }
  };

  useEffect(() => {
    const fetchPhoto = async () => {
      const imageId = await getPhotoIdById(item.id, 1);

      if (imageId) {
        await getPhotoUrlById(imageId).then((res) => setPhotos(res));
      } else {
        setPhotos(false);
      }
    };

    if (!photos) fetchPhoto();
  }, [photos, item]);

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
        <div className=" flex flex-col text-lg">
          <div className="p-4 flex flex-col">
            <div className="text-2xl font-bold mb-2">{item.title}</div>
            <div className="flex my-2">
              <p className="bg-[#1A1C28] px-1">{item.tag}</p>
            </div>
          </div>
          <div className="p-4 border-t border-white flex flex-col h-full">
            <div className=" ">
              Контактная информация:
              <br />
              {item.contact_info}
            </div>
            {session && (
              <button
                className=" flex items-center [&>*]:mx-2 mt-auto "
                onClick={() => setShowComplaint(!showComplaint)}
              >
                Отправить жалобу
                <FaFileAlt />
              </button>
            )}
          </div>
        </div>
        <div className=" flex flex-col p-4 border-l border-white">
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
              className=" ft_button self-start flex flex-row mt-4"
              onClick={report}
            >
              <FaPaperPlane />
              Отправить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenderCommunity;
