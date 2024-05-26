import React, { useEffect, useState } from "react";
import { useUser } from "../../context/userContext";
import {
  getPhotoIdById,
  getPhotoUrlById,
} from "../../utils/controllers/photoController";
import { FaFileAlt } from "react-icons/fa";
import {
  deleteCommunity,
  updateCommunity,
} from "../../utils/controllers/communityController";
import RotWord from "../RotWord";
import { Link } from "react-router-dom";
import { FaPaperPlane } from "react-icons/fa6";
import {
  createReport,
  getReportsByTypeAndId,
} from "../../utils/controllers/reportContorller";
import RenderReport from "../Reports/RenderReport";

const RenderAdmCommunity = ({ item, index, controller }) => {
  const { session } = useUser();

  const [photos, setPhotos] = useState(null);
  const [showComplaint, setShowComplaint] = useState(false);
  const [reports, setReports] = useState(null);

  useEffect(() => {
    const fetchPhoto = async () => {
      const imageId = await getPhotoIdById(item.id, 1);
      if (imageId) await getPhotoUrlById(imageId).then((res) => setPhotos(res));
      else setPhotos(false);
    };

    if (!photos) fetchPhoto();
  }, [photos, item]);

  const verify = async (e) => {
    e.preventDefault();

    const verified = await updateCommunity(session, item.id, {
      title: item.title,
      description: item.description,
      contact_info: item.contact_info,
      status: "1",
    });

    if (verified === 1) controller(null);
  };

  useEffect(() => {
    const getReports = async () => {
      return await getReportsByTypeAndId(session, 1, item.id).then((data) =>
        setReports(
          data.map((item, index) => (
            <RenderReport
              key={index}
              id={item.id}
              description={item.description}
              user={item.user}
            />
          ))
        )
      );
    };

    if (!reports) getReports();
  }, [reports, item, session]);
  return (
    <div className="relative h-fit transition-all duration-500">
      <div
        key={index}
        className="relative z-40 w-full h-[300px] bg-[#2B2D3D] my-2 rounded-md flex flex-row justify-evenly [&>*]:"
      >
        <div className="bg-white h-full rounded-l-md relative w-full">
          {photos && (
            <img
              src={photos}
              alt="Полученное изображение"
              className="w-full h-full object-cover z-10"
            />
          )}
        </div>
        <div className=" flex flex-col text-lg w-full">
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
          </div>
        </div>
        <div className=" flex flex-col p-4 border-l border-white w-full">
          {item.description}
        </div>
        <div className="bg-[#FF6363] flex flex-row rounded-r-md shadow-md text-black font-bold">
          <div className="bg-[#ffe573] flex flex-row  h-full rounded-r-md self-start shadow-md">
            <div className="bg-[#2FB4FF] flex flex-row h-full rounded-r-md self-start shadow-md">
              {item.status === "verification" && (
                <div className="bg-[#86FF73] flex flex-row h-full rounded-r-md self-start shadow-md">
                  <button className="px-4" onClick={verify}>
                    <RotWord word={"Verify"} />
                  </button>
                </div>
              )}
              <Link
                className="px-4 flex items-center"
                to={`/community/change/${item.id}`}
              >
                <RotWord word={"Change"} />
              </Link>
            </div>
            <button
              className="px-4 "
              onClick={() => setShowComplaint(!showComplaint)}
            >
              <RotWord word={"Report"} />
            </button>
          </div>
          <button
            className="px-4 "
            onClick={async (e) => {
              await deleteCommunity(session, item.id);
              controller(null);
            }}
          >
            <RotWord word={"Delete"} />
          </button>
        </div>
      </div>
      <div
        className={` left-0 right-0 bg-[#11131E] rounded-b-md transition-transform duration-500 ease-in-out transform ${
          showComplaint ? "-translate-y-2" : "-translate-y-full absolute"
        } z-30`}
        style={{ top: "100%" }}
      >
        <div className="p-4">
          <div className="field_max text-left">
            <div className="flex flex-row justify-between border-b border-solid border-white mb-4">
              <div>Почта пользователя</div>
              <div>Описание </div>
              <div>ID</div>
            </div>
            {reports && reports}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenderAdmCommunity;
