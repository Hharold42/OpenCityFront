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
        className="relative z-40 w-full h-[350px] bg-[#2B2D3D] my-2 rounded-md grid grid-cols-3"
      >
        <div className="bg-white h-full rounded-l-md relative overflow-hidden">
          {photos && (
            <img
              src={photos}
              alt="Полученное изображение"
              className="w-full h-full object-cover z-10"
            />
          )}
        </div>
        <div className="flex flex-col text-lg h-full relative">
          {/* <div className="px-4 py-2">
            <div className="text-2xl font-bold mb-2 truncate">{item.title}</div>
            <div className="flex my-2">
              <p className="bg-[#1A1C28] px-1 truncate">{item.tag}</p>
            </div>
          </div> */}
          <div className="p-4 flex flex-col">
            <div className="text-2xl font-bold mb-2 truncate">{item.title}</div>
            <div className="flex my-2">
              <p className="bg-[#1A1C28] px-1 truncate">{item.tag}</p>
            </div>
          </div>
          <div className="p-4 border-t border-white flex flex-col h-full bg-[#2a2d3a]">
            <div className=" truncate">
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
        <div className="flex flex-col border-l border-white h-full">
          <div className="px-4 py-2 break-words">{item.description}</div>
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
              onChange={(e) => e.target.value.length < 255 && setReportText(e.target.value)}
            />
            <button
              className=" ft_button self-start flex flex-row mt-4 items-center [&>*]:mx-2"
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
