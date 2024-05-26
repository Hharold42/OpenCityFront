import React, { useEffect, useState } from "react";
import parseISO from "../../utils/isoToHuman";
import axios from "axios";
import RotWord from "../RotWord";
import {
  deleteEvent,
  updateEvent,
} from "../../utils/controllers/eventController";
import { useUser } from "../../context/userContext";
import { Link } from "react-router-dom";
import { getReportsByTypeAndId } from "../../utils/controllers/reportContorller";
import RenderReport from "../Reports/RenderReport";

const RenderAdmEvent = ({ item, index, controller }) => {
  const { session } = useUser();

  const [photos, setPhotos] = useState(null);
  const [showComplaint, setShowComplaint] = useState(false);
  const [reports, setReports] = useState(null);

  useEffect(() => {
    const fetchPhoto = async () => {
      const imageId = await axios
        .get(
          `http://localhost:8080/api/photo/all/by-id-and-type/${item.id}?type=0`
        )
        .then((res) => res.data)
        .then((data) => (data.length > 0 ? data[0] : false));

      if (imageId) {
        await axios
          .get(`http://localhost:8080/api/photo/${imageId}`, {
            responseType: "arraybuffer",
          })
          .then((res) => {
            const blob = new Blob([res.data], { type: "image/jpeg" });

            const imageUrl = URL.createObjectURL(blob);

            setPhotos(imageUrl);
          });
      } else {
        setPhotos(false);
      }
    };

    if (!photos) fetchPhoto();
  }, [photos, item]);

  const verify = async (e) => {
    e.preventDefault();

    const verified = await updateEvent(session, item.id, {
      title: item.title,
      description: item.description,
      address: item.address,
      datetime_start: item.datetime_start,
      datetime_end: item.datetime_start,
      price_min: item.price_min,
      price_max: item.price_max,
      status: "1",
    });

    if (verified === 1) controller(null);
  };

  useEffect(() => {
    const getReports = async () => {
      return await getReportsByTypeAndId(session, 0, item.id).then((data) =>
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
                to={`/events/change/${item.id}`}
              >
                <RotWord word={"Change"} />
              </Link>
            </div>
            <button
              className="px-4"
              onClick={() => setShowComplaint(!showComplaint)}
            >
              <RotWord word={"Report"} />
            </button>
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

export default RenderAdmEvent;
