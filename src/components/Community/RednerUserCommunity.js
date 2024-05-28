import { useEffect, useState } from "react";
import { useUser } from "../../context/userContext";
import {
  getPhotoIdById,
  getPhotoUrlById,
} from "../../utils/controllers/photoController";
import { Link } from "react-router-dom";
import RotWord from "../RotWord";
import { deleteCommunity } from "../../utils/controllers/communityController";
import RenderReport from "../Reports/RenderReport";
import { getReportsByTypeAndId } from "../../utils/controllers/reportContorller";

const RednerUserCommunity = ({ item, index, controller }) => {
  const [photos, setPhotos] = useState(null);
  const [reports, setReports] = useState(null);
  const [showComplaint, setShowComplaint] = useState(false);

  const { session } = useUser();

  useEffect(() => {
    const fetchPhoto = async () => {
      const imageId = await getPhotoIdById(item.id, 0);

      if (imageId) await getPhotoUrlById(imageId).then((res) => setPhotos(res));
    };

    if (!photos) fetchPhoto();
  }, [photos, item]);

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

        {/* Правая часть с описанием */}
        <div className="flex flex-col p-4 border-l border-white w-full">
          {item.description}
        </div>

        {/* Кнопки управления */}
        <div className="bg-[#FF6363] flex flex-row rounded-r-md shadow-md text-black font-bold">
          <div className="bg-[#ffe573] flex flex-row h-full rounded-r-md self-start shadow-md">
            <div className="bg-[#2FB4FF] flex flex-row h-full rounded-r-md self-start shadow-md">
              <Link
                className="px-4 flex items-center"
                to={`/community/change/${item.id}`}
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
        {showComplaint && (
          <div className="p-4">
            <table className="w-full border-b border-white my-4">
              <thead>
                <tr className=" border-b border-white [&>*]:py-2">
                  <th>Пользователь</th>
                  <th>Описание</th>
                  <th>ID</th>
                </tr>
              </thead>
              <tbody>{reports && reports}</tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RednerUserCommunity;
