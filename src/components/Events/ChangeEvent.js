import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../context/userContext";
import {
  getEventById,
  updateEvent,
} from "../../utils/controllers/eventController";
import parseISO from "../../utils/isoToHuman";
import {
  deletePhotoById,
  getPhotoIdById,
  uploadPhotoByEvenId,
} from "../../utils/controllers/photoController";
import formatDateToISOString from "../../utils/dateToISOString";
import Popup from "../Popup";

const statuses = {
  verification: 0,
  activ: 1,
  archive: 2,
  canceled: 3,
};

const ChangeEvent = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [image, setImage] = useState();
  const [error, setError] = useState();
  const [modal, setModal] = useState({
    text: "",
    title: "",
    type: "",
    active: false,
  });

  const closeModalController = () => {
    setModal({ ...modal, active: false });
  };

  const { session, user } = useUser();

  useEffect(() => {
    const fetchEvent = async () => {
      const res = await getEventById(session, params.id);
      if (user.role === "user" && user.id !== res.user) {
        navigate("/events");
      }

      setData({
        title: res.title,
        description: res.description,
        address: res.address,
        datetime_start: parseISO(res.datetime_start),
        datetime_end: parseISO(res.datetime_end),
        price_min: res.price_min,
        price_max: res.price_max,
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

    await updateEvent(session, params.id, {
      title: data.title,
      description: data.description,
      address: data.address,
      datetime_start: formatDateToISOString(new Date(data.datetime_start)),
      datetime_end: formatDateToISOString(new Date(data.datetime_end)),
      price_min: data.price_min,
      price_max: data.price_max,
      status: data.status,
    });

    setModal({
      active: true,
      text: "Событие изменено",
      type: "success",
      title: "Успешно",
    });

    if (image) {
      const uploadedPhotoId = await getPhotoIdById(params.id, 0);
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
          <label className="ft_title">Изменить событие "{data.title}"</label>
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
            <label className="ft_field-label">Адрес:</label>
            <input
              type="text"
              className="ft_input"
              value={data.address}
              onChange={handleChangeField("address")}
            />
          </div>
          <div className="field_max">
            <label className="ft_field-label">Начало:</label>
            <input
              type="datetime-local"
              className="ft_input"
              value={data.datetime_start}
              onChange={handleChangeField("datetime_start")}
            />
          </div>
          <div className="field_max">
            <label className="ft_field-label">Окончание:</label>
            <input
              type="datetime-local"
              className="ft_input"
              value={data.datetime_end}
              onChange={handleChangeField("datetime_end")}
            />
          </div>
          <div className="field_max">
            <label className="ft_field-label">Минимальная цена:</label>
            <input
              type="number"
              className="ft_input"
              value={data.price_min}
              onChange={handleChangeField("price_min")}
            />
          </div>
          <div className="field_max">
            <label className="ft_field-label">Максимальная цена:</label>
            <input
              type="number"
              className="ft_input"
              value={data.price_max}
              onChange={handleChangeField("price_max")}
            />
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

export default ChangeEvent;
