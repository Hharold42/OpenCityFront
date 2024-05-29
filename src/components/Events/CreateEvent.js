import axios from "axios";
import { useState } from "react";
import { useUser } from "../../context/userContext";
import { uploadPhotoByEvenId } from "../../utils/controllers/photoController";
import Popup from "../Popup";

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

const CreateEvent = () => {
  const [data, setData] = useState({
    title: "",
    description: "",
    address: "",
    datetime_start: "",
    datetime_end: "",
    price_min: "",
    price_max: "",
    tag: "0",
  });
  const [image, setImage] = useState();
  const [error, setError] = useState();
  const [modal, setModal] = useState({
    text: "",
    title: "",
    type: "",
    active: false,
  });

  const { session } = useUser();

  const handleChangeField = (field) => (e) => {
    if (e.target.value.length > 254) {
      return;
    }
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
    for (const key in data) {
      if (data[key] === "") {
        return false;
      }
    }
    return true;
  };

  const closeModalController = () => {
    setModal({ ...modal, active: false });
  };

  const confirm = async (e) => {
    e.preventDefault();

    if (!isFormComplete()) {
      setModal({
        text: "Не все поля заполнены",
        title: "Ошибка",
        type: "error",
        active: true,
      });
      return;
    }

    const newEventId = await axios
      .post("http://localhost:8080/api/event/create", data, {
        headers: {
          token: session,
        },
      })
      .then((res) => res.data);

    if (image) {
      const formData = new FormData();
      formData.append("file", image);
      await uploadPhotoByEvenId(session, newEventId, formData);
    }

    setModal({
      active: true,
      text: "Событие создано",
      type: "success",
      title: "Успешно",
    });

    setData({
      title: "",
      description: "",
      address: "",
      datetime_start: "",
      datetime_end: "",
      price_min: "",
      price_max: "",
      tag: "0",
    });
  };

  return (
    <div className="page-wrap">
      <div className="flex flex-col w-[1000px] px-4 py-2">
        <label className="ft_title">Создать событие</label>
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
        <div className="field_max">
          <label className="ft_field-label">Файл:</label>
          <input type="file" className="ft_input" onChange={handleAddFile} />
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
        <button className="ft_button self-start" onClick={confirm}>
          Создать
        </button>
      </div>
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

export default CreateEvent;
