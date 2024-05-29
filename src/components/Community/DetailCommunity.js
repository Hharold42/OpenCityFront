import { Link, useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../context/userContext";
import { useEffect, useState } from "react";
import {
  getPhotoIdById,
  getPhotoUrlById,
} from "../../utils/controllers/photoController";
import { getReportsByTypeAndId } from "../../utils/controllers/reportContorller";
import RenderReport from "../Reports/RenderReport";
import {
  deleteCommunity,
  getCommunityById,
} from "../../utils/controllers/communityController";

const statuses = {
  verification: "На верификации",
  activ: "Активно",
  archive: "Архив",
  canceled: "Отменено",
};

const DetailCommunity = () => {
  const [community, setCommunity] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [reports, setReports] = useState(null);

  const params = useParams();
  const navigate = useNavigate();

  const { session, user } = useUser();

  useEffect(() => {
    const GC = async () => {
      try {
        const res = await getCommunityById(session, params.id);

        setCommunity(res);
      } catch (e) {
        console.log(e);
        navigate("/event");
      }
    };

    if (session && !community && params) GC();
  }, [community, session, params, navigate]);

  useEffect(() => {
    const fetchPhoto = async () => {
      const imageId = await getPhotoIdById(params.id, 1);

      if (imageId) {
        await getPhotoUrlById(imageId).then((res) => setPhoto(res));
      } else {
        setPhoto(false);
      }
    };

    if (!photo && params) fetchPhoto();
  }, [photo, params]);

  useEffect(() => {
    if (user && !reports && session && community) {
      if (user.role !== "user" || user.id === community.id) {
        getReportsByTypeAndId(session, 1, params.id).then((data) =>
          setReports(
            data.map((item, index) => (
              <RenderReport
                key={index}
                id={item.id}
                description={item.description}
                author={item.user}
              />
            ))
          )
        );
      }
    }
  }, [user, reports, session, community, params]);

  return (
    <div className="page-wrap">
      {community && user ? (
        <div className="flex flex-col w-[1000px] px-4 py-2">
          <div className="relative z-40 w-full bg-[#2B2D3D] my-2 p-4 rounded-md">
            <label className="ft_title break-words">
              Сообщевство "{community.title}"
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
                  {statuses[community.status]}
                </div>
                <div className="break-words mb-2">
                  Контактная информация:
                  <br />
                  {community.contact_info}
                </div>
                <div className="flex my-2">
                  <p className="bg-[#1A1C28] px-1">{community.tag}</p>
                </div>
              </div>
            </div>
            <div className=" w-full px-8 py-4 bg-[#11131e7c] rounded-xl break-words my-4">
              <label className="ft_title mb-2">Описание</label>
              <br />
              {community.description}
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
            {(user.id === community.user || user.role !== "user") && (
              <div className="my-6 flex flex-row justify-between">
                <Link className="ft_button" to={`/events/change/${params.id}`}>
                  Change
                </Link>
                <button
                  className="ft_button-red"
                  onClick={async (e) => {
                    await deleteCommunity(session, params.id);
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

export default DetailCommunity;
