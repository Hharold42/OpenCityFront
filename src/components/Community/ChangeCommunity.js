import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../context/userContext";
import {
  getCommunityById,
  updateCommunity,
} from "../../utils/controllers/communityController";
import {
  deletePhotoById,
  getPhotoIdById,
  uploadPhotoByEvenId,
} from "../../utils/controllers/photoController";
import Popup from "../Popup";

const statuses = {
  verification: 0,
  activ: 1,
  archive: 2,
  canceled: 3,
};

const tags = [
  { value: "0", text: "Танцы" },
  { value: "1", text: "Вокал" },
  { value: "2", text: "Музыка" },
  { value: "3", text: "Настолки" },
  { value: "4", text: "Фестиваль" },
  { value: "5", text: "Спорт" },
  { value: "6", text: "Интелектуальное соревнование" },
  { value: "7", text: "Культура" },
  { value: "8", text: "Другое" },
];

const ChangeCommunity = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [modal, setModal] = useState({
    text: "",
    title: "",
    type: "",
    active: false,
  });

  const closeModalController = () => {
    setModal({ ...modal, active: false });
  };

  const [data, setData] = useState(null);
  const [image, setImage] = useState();
  const [error, setError] = useState();
  const { session, user } = useUser();

  useEffect(() => {
    const fetchEvent = async () => {
      const res = await getCommunityById(params.id);
      console.log(user.role, user.id, res.user);
      if (user.role === "user" && user.id !== res.user) {
        navigate("/events");
      }

      setData({
        title: res.title,
        description: res.description,
        contact_info: res.contact_info,
        status: statuses[res.status],
      });
    };

    if (!data && session && user) fetchEvent();
  }, [data, params, session, user, navigate]);

  const handleChangeField = (field) => (e) => {
    setData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleAddFile = (e) => {
    const file = e.target.files[0];
    if (file);
    if (file) {
      if (file.type.startsWith("image/")) {
        setImage(file);
        setError("");
      } else {
        setImage(null);
        setError("Файл должен быть изображением.");
      }
    }
  };

  const isFormComplete = () => {
    // Check if all fields are filled
    for (const key in data) {
      if (data[key] === "") {
        return false;
      }
    }
    return true;
  };

  const confirm = async (e) => {
    if (!isFormComplete()) {
      setModal({
        text: "Не все поля заполнены",
        title: "Ошибка",
        type: "error",
        active: true,
      });
      return;
    }

    await updateCommunity(session, params.id, {
      title: data.title,
      description: data.description,
      contact_info: data.contact_info,
      status: data.status,
    });

    setModal({
      active: true,
      text: "Сообщество изменено",
      type: "success",
      title: "Успешно",
    });

    if (image) {
      const uploadedPhotoId = await getPhotoIdById(params.id, 1);
      if (uploadedPhotoId) {
        await deletePhotoById(uploadedPhotoId);
      }
      const formData = new FormData();
      formData.append("file", image);
      await uploadPhotoByEvenId(session, params.id, formData);

      setData(null);
    }
  };

  return (
    <div className="page-wrap">
      {data ? (
        <div className="flex flex-col w-[1000px] px-4 py-2">
          <label className="ft_title truncate">
            Изменить сообщество "{data.title}"
          </label>
          <div className="field_max">
            <label className="ft_field-label">Название:</label>
            <input
              type="text"
              className="ft_input"
              value={data.title}
              onChange={handleChangeField("title")}
            />
          </div>
          <div className="field_max">
            <label className="ft_field-label">Описание:</label>
            <textarea
              type="text"
              className="ft_input"
              value={data.description}
              onChange={handleChangeField("description")}
            />
          </div>
          <div className="field_max">
            <label className="ft_field-label">Контактная информация:</label>
            <textarea
              type="text"
              className="ft_input"
              value={data.contact_info}
              onChange={handleChangeField("contact_info")}
            />
          </div>
          <div className="field_max">
            <label className="ft_field-label">Тэг:</label>
            <select
              className="ft_input"
              value={data.tag}
              onChange={handleChangeField("tag")}
            >
              {tags.map((tag, index) => (
                <option key={index} value={tag.value}>
                  {tag.text}
                </option>
              ))}
            </select>
          </div>
          {user && user.role !== "user" && (
            <div className="field_max">
              <label className="ft_field-label">Статус:</label>
              <select
                className="ft_input"
                value={data.status}
                onChange={handleChangeField("status")}
              >
                <option value={0}>Верификация</option>
                <option value={1}>Активно</option>
                <option value={2}>Прошедшее</option>
                <option value={3}>Отменено</option>
              </select>
            </div>
          )}

          <div className="field_max">
            <label className="ft_field-label">Файл:</label>
            <input type="file" className="ft_input" onChange={handleAddFile} />
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
          <button className="ft_button self-start" onClick={confirm}>
            Изменить
          </button>
        </div>
      ) : (
        "Загрузка..."
      )}
      {modal.active && (
        <Popup
          text={modal.text}
          title={modal.title}
          type={modal.type}
          controller={closeModalController}
        />
      )}
    </div>
  );
};

export default ChangeCommunity;
